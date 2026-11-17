const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

const sourceProfiles = {
  gm: {
    manufacturer: 'General Motors', tool: 'GM GDS2/MDI-capable scan tool where required',
    portal: { title: 'ACDelco Technical Delivery System — GM Service Information', url: 'https://www.acdelcotds.com/subscriptions', scope: 'Official GM service manuals, campaigns, bulletins, diagnostics, and model-specific repair documentation.' },
    public: { title: 'Chevrolet Vehicle Support — The Brake System', url: 'https://www.chevrolet.com/support/vehicle/driving-safety/brakes/brakes-system', scope: 'Official public overview of brake inspection items, wear indicators, symptoms, and model-specific manual referral.' }
  },
  ford: {
    manufacturer: 'Ford/Lincoln', tool: 'Ford FDRS/IDS-capable scan tool where required',
    portal: { title: 'Motorcraft Service — Ford Workshop Information', url: 'https://www.motorcraftservice.com/', scope: 'Official Ford workshop manuals, wiring, service publications, and VIN/model-specific procedures.' }
  },
  toyota: {
    manufacturer: 'Toyota/Lexus', tool: 'Toyota Techstream-capable scan tool where required',
    portal: { title: 'Toyota Technical Information System (TIS)', url: 'https://techinfo.toyota.com/', scope: 'Official Toyota/Lexus repair manuals, wiring diagrams, service bulletins, training, diagnostics, and calibrations.' }
  },
  nissan: {
    manufacturer: 'Nissan/Infiniti', tool: 'Nissan CONSULT-capable scan tool where required',
    portal: { title: 'Nissan TechInfo — Factory Authorized Service Manuals', url: 'https://www.nissan-techinfo.com/find.aspx', scope: 'Official Nissan/Infiniti electronic service manuals, TSBs, publications, and model-specific repair procedures.' }
  },
  bmw: {
    manufacturer: 'BMW/MINI', tool: 'BMW ISTA-capable diagnostic system where required',
    portal: { title: 'BMW Technical Information System', url: 'https://bmwtechinfo.bmwgroup.com/', scope: 'Official BMW/MINI repair information, diagnosis, programming, and VIN-specific service documentation.' }
  },
  mercedes: {
    manufacturer: 'Mercedes-Benz/AMG/Maybach/smart', tool: 'Mercedes-Benz Xentry-capable diagnostic system where required',
    portal: { title: 'Mercedes-Benz XENTRY WIS', url: 'https://b2bconnect.mercedes-benz.com/ee/shop/workshop-solutions/xentry-wis', scope: 'Official current repair instructions, maintenance documents, wiring, VIN-specific information, and hybrid/EV guidance.' }
  },
  audi: {
    manufacturer: 'Audi/VAG', tool: 'Audi ODIS-capable diagnostic system where required',
    portal: { title: 'Audi erWin Online Service Information', url: 'https://audi-us.erwin-store.com/erwin/showHome.do', scope: 'Official published Audi service information and aftermarket repair documentation.' }
  }
};

function profileFor(entry) {
  const prefix = String(entry.id || '').split('-')[0];
  return sourceProfiles[prefix] || sourceProfiles.gm;
}

function makeBrakeService(entry) {
  const profile = profileFor(entry);
  const electrified = /hybrid|bev|ev|voltec|ultium|fuel-cell|epower|e-tron|eq-|phev/i.test(`${entry.id} ${entry.engineFamily}`);
  const legacy = Number(entry.repairOrderLinks?.matchYearRange?.[1] || 9999) < 2000;
  const sources = [profile.portal, ...(profile.public ? [profile.public] : [])].map((source) => ({ ...source, accessed: '2026-07-27', authority: 'OEM' }));
  return {
    title: `${profile.manufacturer} brake inspection and service`,
    applicability: `Applies as a service workflow to ${entry.engineFamily} vehicle classes. Brake hardware is selected by VIN, chassis, axle, brake option/PR/RPO code, production date, and market—not engine family alone.`,
    availability: 'Workflow and OEM source location verified online. Numeric specifications must be retrieved from the linked OEM repair information for the exact vehicle before work begins.',
    safety: electrified
      ? 'Electrified vehicle: follow OEM sleep/depower and brake-pressure precautions. Regenerative braking can mask friction-brake defects, and some systems can self-apply or pressurize the brakes.'
      : 'Support the vehicle at approved lift points, control brake dust without compressed air, prevent fluid contamination, and never work under a vehicle supported only by a jack.',
    sourceLinks: sources,
    requiredVehicleData: ['Full VIN and model year','Model/chassis/platform and production date','Front and rear brake option, axle, or PR/RPO code','Wheel/tire and performance-brake package','Electronic parking brake and brake-by-wire equipment','Open recalls, campaigns, and brake-related bulletins'],
    specifications: [
      { label: 'Front pad minimum thickness', value: 'Retrieve by VIN/brake option from OEM source', required: true },
      { label: 'Rear pad/shoe minimum thickness', value: 'Retrieve by VIN/brake option from OEM source', required: true },
      { label: 'Front rotor minimum/refinish thickness and maximum runout', value: 'Retrieve by VIN/brake option; compare with rotor stamping where present', required: true },
      { label: 'Rear rotor/drum discard diameter and maximum runout', value: 'Retrieve by VIN/brake option; rear parking-brake design varies', required: true },
      { label: 'Caliper, carrier, hose, bleeder, and wheel fastener torque', value: 'Retrieve exact values and one-time-use requirements from OEM source', required: true },
      { label: 'Brake fluid grade and replacement interval', value: 'Retrieve by VIN/model/market; never mix silicone DOT 5 with glycol-based fluid', required: true },
      { label: 'Bleed sequence and scan-tool routine', value: `Retrieve from OEM source; ${profile.tool}`, required: true },
      { label: 'Electronic parking brake service mode', value: legacy ? 'Usually not equipped; verify exact vehicle' : `Verify equipment and invoke the OEM procedure with ${profile.tool}`, required: true }
    ],
    procedures: [
      {
        title: 'Brake concern verification and complete inspection', time: '0.5–1.0 hr',
        tools: 'Approved lift, inspection light, brake lining gauge, micrometer, dial indicator, fluid tester as permitted, scan tool',
        steps: ['Confirm the customer concern, warning messages, noise conditions, pull, pulsation, pedal feel, and recent brake/tire work.','Record VIN and brake option data; check OEM campaigns, bulletins, and current repair instructions.','Scan ABS/ESC, parking-brake, powertrain, and hybrid/EV modules before clearing faults; save freeze-frame and event records.','Inspect fluid level/condition and the master cylinder, booster, lines, hoses, calipers, wheel cylinders, hardware, cables, and leaks.','Measure every accessible pad/shoe and rotor/drum; record inner versus outer and left versus right values.','Check tire condition, wheel installation, hub/bearing play, suspension, and alignment-related contributors before condemning brakes.']
      },
      {
        title: 'Disc brake pad and rotor service', time: '1.0–2.5 hr per axle',
        tools: 'OEM repair information, torque wrenches, caliper tools, micrometer, dial indicator, hub-cleaning tools, brake-safe cleaner',
        steps: ['Retrieve pad limits, rotor limits/runout, fastener torques, replacement hardware, lubrication points, and bedding procedure by VIN.','Enter electronic parking-brake or brake-service mode before retracting any controlled actuator.','Remove components without hanging the caliper by its hose; inspect boots, slides, pistons, hoses, sensors, and mounting threads.','Measure rotor thickness at multiple positions and check lateral runout with the rotor secured to the clean hub using the OEM method.','Correct hub corrosion/runout and identify thickness variation or heat damage; do not machine below the published refinish/minimum limit.','Install matched friction components and specified new hardware; apply only approved lubricant at published locations.','Torque all fasteners and wheels in sequence with calibrated tools, restore service mode, pump the pedal, and verify fluid level.','Perform OEM bedding/burnishing and a controlled road test; confirm no warnings, leaks, pull, pulsation, noise, or abnormal temperature split.']
      },
      {
        title: 'Drum and drum-in-hat parking-brake service', time: '1.0–2.5 hr per axle',
        tools: 'OEM repair information, brake spring tools, drum gauge/micrometer, torque wrench, dust-control equipment',
        steps: ['Retrieve shoe limits, drum discard diameter, adjustment method, hardware layout, and parking-brake specification by VIN.','Release and disable automatic/electronic parking-brake operation as the OEM procedure requires.','Document spring, lever, adjuster, and cable orientation before disassembly; service one side at a time for reference.','Inspect wheel cylinders or drum-in-hat mechanisms for leakage, seizure, heat damage, glazing, contamination, and backing-plate wear.','Measure drum diameter and roundness; replace any drum beyond the published limit or with prohibited damage.','Install specified hardware and lubricate only approved backing-plate contact points; keep friction surfaces clean.','Adjust shoes and parking brake using the OEM sequence, verify free rotation and holding ability, then road-test safely.']
      },
      {
        title: 'Brake fluid exchange and hydraulic bleed', time: '0.8–1.8 hr',
        tools: `${profile.tool}, OEM-approved pressure/vacuum/manual bleed equipment, sealed specified brake fluid`,
        steps: ['Confirm the exact fluid specification, replacement interval, reservoir configuration, bleed order, pressure limit, and scan-tool requirements by VIN.','Inspect for leaks, swollen hoses, damaged bleeders, contaminated fluid, and hydraulic faults before exchange. Do not exchange fluid to mask a mechanical failure.','Protect painted surfaces and prevent the reservoir from running dry; use only fresh fluid from a sealed container.','Bleed/exchange in the published sequence and perform ABS/ESC, brake-by-wire, or accumulator routines when directed by OEM information.','Monitor expelled fluid for air, debris, petroleum contamination, or seal material; stop and diagnose abnormal findings.','Set final level using the OEM condition, clean spillage, verify pedal feel and booster operation, scan for faults, and perform a controlled road test.']
      },
      {
        title: 'Electronic parking brake / brake-by-wire service', time: '0.5–1.5 hr plus mechanical repair',
        tools: `${profile.tool}, stable battery support, OEM repair information, DVOM as directed`,
        steps: ['Identify electronic parking brake, integrated brake control, electro-hydraulic booster, regenerative braking, and automatic emergency braking equipment.','Connect stable battery support when specified and save all brake/chassis fault records before commanding service mode.','Follow the exact OEM service-mode entry method; never force a motorized piston or apply power directly unless the published test instructs it.','Complete mechanical service, then run close/normalize/calibrate/bleed routines required by the control system.','Verify parking-brake apply/release, hill hold, warning indicators, pedal simulator/booster operation, and diagnostic data.','For electrified vehicles, confirm friction-brake operation independently from regenerative deceleration during the road test.']
      },
      {
        title: 'Brake pulsation, pull, noise, and overheating diagnosis', time: '0.8–2.0 hr initial diagnosis',
        tools: 'Scan tool, micrometer, dial indicator, infrared thermometer, pressure gauges as OEM-directed, chassis inspection tools',
        steps: ['Reproduce the concern safely and record speed, temperature, pedal pressure, steering input, road crown, load, and whether regeneration is active.','Measure rotor thickness variation and installed runout; inspect hub face, wheel torque history, bearing play, and rotor indexing.','Compare lining wear and wheel temperatures side to side; check slides, pistons, hoses, parking-brake release, and residual pressure.','Inspect tires, alignment, suspension, steering, driveline, ABS/ESC events, and wheel-speed signals that can imitate brake faults.','Correct the proven cause, not only the symptom; complete bedding and duplicate the original conditions for verification.']
      }
    ],
    checklist: ['VIN and brake option recorded','OEM source and document revision/date recorded','All pad/shoe and rotor/drum measurements recorded by wheel','Fluid specification and condition recorded','Fastener and wheel torque values retrieved and documented','EPB/ABS/ESC service routines completed where required','Pedal pumped and hydraulic leaks checked before movement','Controlled road test and post-test temperature/noise check completed']
  };
}

for (const entry of data.engineFamilies) entry.brakeService = makeBrakeService(entry);
data.version = 12;
data.schema.brakeService = 'OEM-sourced brake inspection, measurement, pad/rotor/drum, hydraulic, EPB/brake-by-wire, diagnostic workflows, checklists, and online source links. Numeric limits and torques remain VIN/brake-option-specific.';
data.schema.coverage += ' Brake workflows are available for every class with OEM online-source routing.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}
console.log(`Added brake service to ${data.engineFamilies.length} vehicle classes.`);
