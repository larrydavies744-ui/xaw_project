const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

const toolsByPrefix = {
  gm: 'GM GDS2/MDI-capable scan tool', ford: 'Ford FDRS/IDS-capable scan tool',
  toyota: 'Toyota Techstream-capable scan tool', nissan: 'Nissan CONSULT-capable scan tool',
  bmw: 'BMW ISTA-capable diagnostic system', mercedes: 'Mercedes-Benz Xentry-capable diagnostic system',
  audi: 'Audi ODIS-capable diagnostic system'
};

function makeTuneUpService(entry) {
  const text = `${entry.id} ${entry.engineFamily} ${entry.engine?.configuration || ''}`.toLowerCase();
  const bev = /\b(bev|battery-electric|electric drive|ford-bev|bmw-bev|audi-bev|nissan-bev|toyota-bev|mercedes-eq-bev|gm-ultium-ev)\b/.test(text);
  const diesel = /diesel|duramax|powerstroke|power stroke|\btdi\b|\bom6|\bom64|\bom65|\bidi\b|cummins/.test(text);
  const hybrid = !bev && /hybrid|phev|voltec|e-power|epower|fuel-cell|48v/.test(text);
  const boosted = /turbo|supercharg|ecoboost|kompressor|tfsI|twinpower|biturbo/.test(text);
  const prefix = String(entry.id || '').split('-')[0];
  const scanTool = toolsByPrefix[prefix] || 'OEM-capable scan tool';
  const sourceLinks = (entry.brakeService?.sourceLinks || []).map((source) => ({ ...source, relevance: 'Use the OEM portal to retrieve the exact maintenance schedule, parts, specifications, procedures, campaigns, and relearns for this VIN.' }));
  const powertrainLabel = bev ? 'battery-electric drive system' : diesel ? 'diesel engine' : hybrid ? 'hybrid powertrain' : 'gasoline engine';

  return {
    title: `${entry.engineFamily} tune-up and scheduled-maintenance service`,
    applicability: `Maintenance workflow for this ${powertrainLabel} class. Final service items are determined by VIN, engine/drive-unit code, model, market, mileage, time, operating conditions, and prior maintenance history.`,
    definition: '“Tune-up” means an evidence-based scheduled-maintenance and drivability-baseline service. It is not automatic replacement of ignition, fuel, or emissions parts without inspection or an OEM interval.',
    availability: 'Workflow and OEM source routing are provided. Exact intervals, part numbers, fluids, gaps, torque values, reset channels, and adaptation procedures must be retrieved for the vehicle.',
    safety: bev
      ? 'Battery-electric vehicle: do not open or probe high-voltage components during routine maintenance. Follow OEM sleep, lift, thermal-system, and high-voltage precautions.'
      : hybrid
        ? 'Hybrid vehicle: the engine can start automatically. Place the system in the OEM maintenance/inspection mode only when directed, and follow high-voltage precautions.'
        : diesel
          ? 'Diesel vehicle: never loosen a high-pressure fuel line while running or check injection leaks by hand. Observe glow-plug, hot exhaust, and regeneration hazards.'
          : 'Disable automatic starting where equipped, work on a cool engine when specified, and keep ignition sources away from fuel vapors.',
    sourceLinks,
    requiredVehicleData: ['Full VIN, model year, model/chassis, and production date','Engine/drive-unit code and emissions certification','Mileage, engine hours where available, and time since prior service','Normal, severe-duty, fleet, towing, track, or extended-idle usage','Complete maintenance and repair history','Open recalls, campaigns, service bulletins, and software updates'],
    specifications: [
      { label: 'OEM maintenance schedule', value: 'Retrieve by VIN, mileage/time, market, and operating conditions', required: true },
      { label: bev ? 'Cabin filter and desiccant/thermal-system service' : diesel ? 'Fuel-filter and water-separator interval' : 'Spark-plug part number, gap policy, and interval', value: 'Retrieve exact parts and interval from OEM source', required: true },
      { label: bev ? 'Reduction-gear fluid specification/interval' : diesel ? 'Glow-plug test specification and replacement procedure' : 'Ignition coil/boot inspection and fastener torque', value: 'Retrieve by VIN and powertrain code', required: true },
      { label: 'Engine/cabin air-filter part numbers and inspection interval', value: 'Retrieve by VIN; replacement depends on environment and restriction/condition', required: true },
      { label: bev ? 'Battery coolant specification and service routine' : 'Engine oil approval, viscosity, capacity, filter, and interval', value: 'Retrieve current OEM values; verify final level using published conditions', required: true },
      { label: 'Coolant, brake fluid, transmission/drive-unit, differential, and transfer-case requirements', value: 'Retrieve each fluid approval and interval independently', required: true },
      { label: bev ? '12V battery registration/reset requirements' : 'Accessory/serpentine/timing drive inspection or replacement interval', value: 'Retrieve by VIN, production date, and installed hardware', required: true },
      { label: 'Maintenance reminder reset, adaptations, and scan-tool routines', value: `Retrieve exact procedure; use ${scanTool} where required`, required: true }
    ],
    procedures: [
      {
        title: 'VIN-based maintenance plan and baseline scan', time: '0.4–0.8 hr', tools: `${scanTool}, OEM service portal, battery support as specified`,
        steps: ['Record VIN, mileage, hours, production date, powertrain code, customer usage, prior maintenance, and current concerns.','Retrieve the normal and severe-duty maintenance schedules plus model-specific exceptions from the linked OEM source.','Check open campaigns, recalls, technical bulletins, software actions, and emissions warranty items.','Perform and save a complete module scan before clearing faults; capture readiness, counters, freeze-frame, maintenance data, and battery state.','Build an itemized service plan separating due maintenance, failed inspection items, diagnostic concerns, and optional preventive work.','Obtain authorization before work outside the scheduled or customer-requested scope.']
      },
      {
        title: bev ? 'Electric-drive and low-voltage maintenance inspection' : diesel ? 'Diesel combustion and starting-system service' : 'Ignition and combustion service',
        time: '0.8–2.0 hr', tools: bev ? `${scanTool}, DVOM, battery tester, inspection tools` : diesel ? `${scanTool}, glow-plug/current test equipment, fuel-filter tools, restriction gauge as applicable` : `${scanTool}, spark-plug tools, torque wrench, borescope as needed, ignition scope where indicated`,
        steps: bev ? ['Review traction-battery health data, charging faults, thermal warnings, and 12V battery history.','Inspect charge-port condition, seals, pins, cable retention, and vehicle charging equipment without opening high-voltage assemblies.','Test the 12V battery using the OEM method and register/initialize a replacement where required.','Inspect drive-unit mounts, half-shafts, boots, reduction-gear leakage, underbody shields, and high-voltage cable protection.','Perform only published maintenance routines; route isolation, battery, inverter, or charger faults to the OEM diagnostic procedure.'] : diesel ? ['Review starting time, smoke, fuel quality, regeneration history, correction/balance values, rail-pressure data, and glow-system faults.','Replace the fuel filter only at the published interval or for proven restriction/contamination; drain the separator where equipped.','Prime and bleed the low-pressure system using the OEM method; never crank a dry high-pressure pump contrary to instructions.','Test glow plugs/controller electrically before replacement and follow engine-specific removal precautions.','Inspect intake/charge-air hoses, crankcase ventilation, turbo plumbing, EGR/aftertreatment connections, and exhaust leaks.','Verify cold and hot starting, rail-pressure response, idle quality, smoke, and absence of leaks after service.'] : ['Review misfire counters, fuel correction, cold-start behavior, readiness, knock data, and ignition-related faults before parts removal.','Retrieve the exact spark-plug part number, replacement interval, gap policy, installation torque, and access procedure.','Remove plugs from the engine condition specified by OEM information; organize and read deposits by cylinder.','Do not wire-brush, regap, coat, or lubricate plugs unless the plug maker and OEM procedure explicitly allow it.','Inspect coils, boots, springs, connectors, grounds, oil/coolant intrusion, and carbon tracking; replace only failed or interval-specified parts.','Install with calibrated tools, restore harness routing and retainers, then verify misfire counts under the original operating conditions.']
      },
      {
        title: 'Air induction, filtration, and ventilation service', time: '0.4–1.2 hr', tools: 'Inspection light, filter tools, smoke machine or restriction gauge when diagnosis requires, OEM service information',
        steps: ['Inspect the air-filter element, housing, seals, inlet duct, resonators, clamps, and water/debris drains.','Replace filters by the published interval or documented condition; do not use compressed air on elements unless explicitly approved.','Inspect throttle/intake deposits without assuming cleaning is required; use only approved cleaners and methods.','Inspect PCV/crankcase ventilation, vacuum lines, boost hoses, charge-air coolers, and evaporative connections applicable to the powertrain.','For boosted engines, inspect compressor inlet/outlet plumbing, oil/coolant connections, wastegate/actuator linkage where visible, and heat shields.','Perform throttle, idle, airflow, or charge-pressure adaptations only when the OEM procedure calls for them.']
      },
      {
        title: 'Fluids, filters, belts, hoses, and leak inspection', time: '0.6–1.5 hr plus fluid services', tools: 'OEM fluid information, inspection light, refractometer/test tools where approved, torque wrenches, belt gauge as applicable',
        steps: ['Retrieve every fluid approval, capacity, interval, fill temperature, level condition, and one-time-use plug/seal requirement independently.','Inspect engine or drive-unit, transmission, transfer case, differentials, cooling circuits, power steering where fitted, and washer system for level and leakage.','Inspect belts, tensioners, idlers, pulleys, hoses, quick connectors, mounts, shields, and evidence of contact or contamination.','Do not perform universal “flushes” or add chemicals unless the OEM procedure and fluid compatibility support the service.','Replace only scheduled or failed items using approved fluids and filters; record lot/specification and measured quantity.','Run required fill, bleed, prime, level, or adaptation procedures and reinspect for leaks after reaching the published operating condition.']
      },
      {
        title: 'Battery, charging, starting, and electrical maintenance', time: '0.4–1.0 hr', tools: `${scanTool}, OEM-approved battery conductance/load tester, DVOM, battery support`,
        steps: ['Identify all low-voltage batteries and any auxiliary/48V system; follow power-down precautions before disconnecting.','Inspect battery case, hold-down, terminals, venting, grounds, power distribution, and evidence of water entry or heat damage.','Test state of charge and health using the battery type and OEM method; recharge before condemning a discharged battery.','Test charging and starting performance or DC/DC converter operation under specified conditions.','Register/code/initialize replacement batteries and restore learned functions only as required by the vehicle.','Verify clock, windows, steering-angle, idle, transmission, charging, and other affected adaptations using the published procedure.']
      },
      {
        title: 'Final reset, quality control, and road test', time: '0.4–0.8 hr', tools: `${scanTool}, tire-pressure gauge, inspection light, road-test route`,
        steps: ['Confirm all caps, plugs, filters, ducts, connectors, grounds, shields, tools, and fluid levels before starting or making READY.','Start/enable the vehicle and monitor warning indicators, noises, leaks, misfires, fuel correction, temperatures, charging, and other relevant data.','Reset only the maintenance items actually completed, using the exact OEM menu or scan-tool channel.','Check tires, exterior lights, wipers/washers, horn, safety systems, and visible underbody concerns as part of final inspection.','Road-test through appropriate cold/hot, idle, cruise, acceleration, deceleration, and charging/regeneration conditions.','Perform a final scan and leak/level inspection; document completed work, measurements, deferred items, and the next time/mileage due.']
      }
    ],
    checklist: ['VIN/powertrain code and usage profile recorded','OEM schedule and document revision consulted','Pre-service scan and readiness saved','Installed parts and fluid approvals documented','All removed connectors, ducts, grounds, and shields rechecked','Maintenance resets match work actually completed','Post-service scan and road test completed','Next service time/mileage and deferred work documented']
  };
}

for (const entry of data.engineFamilies) entry.tuneUpService = makeTuneUpService(entry);
data.version = 13;
data.schema.tuneUpService = 'VIN-based scheduled-maintenance and tune-up workflows for gasoline, diesel, hybrid, and battery-electric classes, including OEM sources, required specifications, procedures, and QC checklists.';
data.schema.coverage += ' Tune-up and scheduled-maintenance workflows are available for every class.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}
console.log(`Added tune-up service to ${data.engineFamilies.length} vehicle classes.`);
