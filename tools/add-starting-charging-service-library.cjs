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

function makeService(entry) {
  const text = `${entry.id} ${entry.engineFamily} ${entry.engine?.configuration || ''}`.toLowerCase();
  const bev = /\b(bev|battery-electric|electric drive|ford-bev|bmw-bev|audi-bev|nissan-bev|toyota-bev|mercedes-eq-bev|gm-ultium-ev)\b/.test(text);
  const hybrid = !bev && /hybrid|phev|voltec|e-power|epower|fuel-cell/.test(text);
  const diesel = /diesel|duramax|powerstroke|power stroke|\btdi\b|\bom6|\bom64|\bom65|\bidi\b|cummins/.test(text);
  const fortyEightVolt = /48v|eq boost|mhev|m256|m260|m264/.test(text);
  const prefix = String(entry.id || '').split('-')[0];
  const scanTool = toolsByPrefix[prefix] || 'OEM-capable scan tool';
  const sources = (entry.brakeService?.sourceLinks || entry.tuneUpService?.sourceLinks || []).map((source) => ({ ...source, relevance: 'Retrieve VIN-specific starting/charging diagrams, test plans, removal instructions, torque values, battery management, programming, and component serviceability.' }));
  const architecture = bev ? 'BEV low-voltage/DC-DC system' : hybrid ? 'hybrid starter-generator/high-voltage charging system' : fortyEightVolt ? '12V/48V starter-generator system' : diesel ? 'diesel high-load starting and charging system' : 'conventional or smart-controlled starting and charging system';
  return {
    title: `${entry.engineFamily} starting and charging service`,
    applicability: `Diagnostic and repair workflow for this ${architecture}. Confirm actual equipment by VIN; engine family alone does not identify generator output, starter design, battery count, belt routing, control strategy, or serviceability.`,
    availability: 'OEM source routing and test-first workflows are provided. Wiring, terminal IDs, output ratings, fastener torque, access sequence, one-time-use hardware, component repair parts, and programming remain VIN-specific.',
    safety: bev ? 'BEV: there is normally no conventional alternator or engine starter. Diagnose the 12V battery and DC/DC converter without opening high-voltage components; follow OEM depower and absence-of-voltage procedures.' : hybrid ? 'Hybrid: the motor-generators may crank the engine and charge through high voltage. Disable automatic READY/start behavior and follow OEM high-voltage procedures; do not substitute conventional starter tests.' : fortyEightVolt ? '48V system: identify every battery and isolation point. Treat 48V conductors and starter-generator equipment according to OEM depower procedures before disconnection.' : 'Disconnect and reconnect batteries in the published order, preserve memory only by an approved method, prevent terminal shorting, and support the vehicle correctly for starter access.',
    sourceLinks: sources,
    requiredVehicleData: ['Full VIN, engine/drive-unit code, model/chassis, and production date','Battery count, chemistry, capacity, location, and registration history','Alternator/generator, starter, ISG/BSG, or DC/DC converter part number and output rating','Wiring diagram, terminal IDs, fuse/fusible-link layout, grounds, and network topology','Belt drive, decoupler pulley, tensioner, and mounting configuration','Open recalls, campaigns, bulletins, software updates, and immobilizer/start-inhibit information'],
    specifications: [
      { label: 'Battery state-of-charge and health test method', value: 'Retrieve by battery chemistry/capacity and OEM test plan', required: true },
      { label: bev ? 'DC/DC commanded and actual low-voltage output' : hybrid ? 'Motor-generator/DC-DC operating values' : 'Generator rated output and regulated-voltage strategy', value: 'Retrieve by VIN and test at specified load, temperature, and state of charge', required: true },
      { label: bev ? 'READY-mode wake-up and low-voltage support conditions' : 'Starter current, cranking-speed, and voltage thresholds', value: 'Retrieve OEM test conditions and limits', required: true },
      { label: 'Positive and ground circuit voltage-drop limits', value: 'Use OEM limits where published; record current and test-point locations', required: true },
      { label: 'Mounting, cable, busbar, pulley, and belt fastener torque', value: 'Retrieve exact values and one-time-use requirements from OEM source', required: true },
      { label: 'Belt routing, tensioner position, pulley/decoupler service limits', value: 'Retrieve for installed accessory drive', required: true },
      { label: 'Component internal serviceability', value: 'Confirm OEM-supported brush, bearing, solenoid, rectifier, regulator, or overrunning-clutch repair before disassembly', required: true },
      { label: 'Battery registration, coding, programming, and relearns', value: `Retrieve exact procedure; use ${scanTool} where required`, required: true }
    ],
    procedures: [
      {
        title: 'Starting/charging concern verification and system identification', time: '0.5–1.0 hr', tools: `${scanTool}, OEM wiring and service information, battery tester, DVOM, current clamp`,
        steps: ['Confirm the complaint: no crank, slow crank, click, intermittent start, battery discharge, charging warning, over/undercharge, noise, belt concern, or repeated battery failure.','Identify every battery, alternator/generator, starter, starter-generator, DC/DC converter, fuse link, power-management module, and relevant ground by VIN and diagram.','Save a complete module scan, freeze-frame, energy-management history, start-inhibit reasons, battery state, commanded output, and load-shed data before clearing faults.','Inspect battery condition, terminals, grounds, power distribution, belt drive, fluid contamination, heat damage, collision damage, water entry, and prior wiring repairs.','Charge and test the battery or batteries before judging starter/generator performance; a discharged or failed battery invalidates many results.','Check campaigns, bulletins, software, battery-registration history, and parasitic-draw complaints before replacing a component.']
      },
      {
        title: bev ? 'BEV 12V supply and DC/DC converter diagnosis' : hybrid ? 'Hybrid motor-generator and DC/DC diagnosis' : fortyEightVolt ? '48V integrated/belt starter-generator diagnosis' : 'Starter circuit, cranking, and voltage-drop diagnosis',
        time: '0.8–2.0 hr initial diagnosis', tools: `${scanTool}, CAT-rated DVOM, current clamp, oscilloscope as required, remote start control only if OEM-approved`,
        steps: bev ? ['Verify 12V battery state, vehicle sleep/wake behavior, READY status, DC/DC enable command, output voltage/current, and high-voltage interlock faults.','Load-test low-voltage positive and ground paths while the DC/DC converter is active; inspect wake-up/network and battery-sensor data.','Do not condemn the converter for inhibited output until high-voltage state, contactor status, thermal limits, crash status, isolation faults, and charge state are resolved.','Follow the OEM guided test for converter, onboard charger, or power-distribution faults; do not open sealed high-voltage electronics.','Verify sleep current, wake-up, charging, READY operation, and multiple restart cycles after repair.'] : hybrid || fortyEightVolt ? ['Verify every low-voltage battery, start authorization, immobilizer/start requests, contactor or isolation status, DC/DC data, and engine-crank command.','Use OEM data and test plans to distinguish 12V supply, high-voltage battery, inverter, motor-generator, engine mechanical, and control faults.','Never apply external power to motor-generator phases or perform conventional starter current tests on an integrated hybrid drive.','Resolve isolation, interlock, cooling, resolver, inverter, and high-voltage faults using OEM procedures before component replacement.','Verify engine start/stop, READY operation, charging, regenerative behavior, and restart performance under published conditions.'] : ['Verify park/neutral or clutch input, immobilizer authorization, start request, relay command, engine speed, and module inhibit data.','Measure battery voltage and starter current during the fault; compare cranking speed/current with OEM conditions and temperature.','Measure positive-side voltage drop from battery to starter and ground-side drop from starter housing/engine to battery under the same loaded crank event.','Test relay, solenoid command, fuse links, switches, network requests, and terminal tension using the wiring diagram; do not jumper circuits blindly.','If circuit supply and command are correct, verify engine mechanical rotation and accessory seizure before condemning the starter.','Repeat cold/hot and soak conditions needed to reproduce intermittent faults and save scope/current evidence.']
      },
      {
        title: bev ? 'Low-voltage battery/DC-DC component replacement preparation' : hybrid || fortyEightVolt ? 'Starter-generator or power-electronics replacement preparation' : 'Starter removal and installation',
        time: '1.0–5.0 hr depending on vehicle', tools: 'OEM repair information, battery support/depower equipment, insulated or conventional tools as specified, torque wrenches, lifting/support equipment',
        steps: ['Retrieve the exact removal sequence, depower steps, access operations, support points, fastener torques, cable routing, seals, one-time-use parts, and programming requirements.','Save settings and diagnostic records, then shut down and disconnect batteries in the published order; verify the required wait time and absence of voltage where applicable.','Label and protect terminals immediately after disconnection; never allow an unfused battery cable or busbar to contact ground.','Support engines, transmissions, exhaust, steering, subframes, or cooling modules only as the OEM procedure specifies.','Remove the component without loading cables, hoses, connectors, or adjacent high-voltage parts; inspect mounting faces, dowels, ring terminals, and heat shields.','Install the verified part number with required new hardware, route and retain cables exactly, torque connections with calibrated tools, and restore depowered systems in sequence.']
      },
      {
        title: bev ? 'DC/DC and low-voltage component serviceability decision' : 'Starter/alternator bench inspection and supported internal repair', time: '1.0–3.0 hr after removal', tools: 'OEM/component service manual, calibrated bench tester, growler/ohmmeter/insulation tools as applicable, bearing and soldering equipment only when approved',
        steps: ['Confirm whether the OEM or component manufacturer supports internal repair and publishes limits/parts. Treat sealed, safety-related, high-voltage, LIN/BSS-controlled, or non-serviceable units as assemblies.','Record part number, rotation, pulley/drive type, rated output, terminal configuration, clocking, and failure evidence before disassembly.','For supported starters, inspect solenoid contacts, plunger, brushes, commutator, bushings/bearings, armature, field windings, reduction gears, and overrunning clutch against published limits.','For supported alternators, inspect bearings, slip rings, brushes, rotor/stator windings, rectifier diodes, regulator, decoupler pulley, fan, and insulation against published limits.','Do not improvise regulator setpoints, bypass communications, machine beyond limits, reuse prohibited fasteners, or rebuild high-voltage motor-generators without authorized equipment and procedures.','After supported repair, bench-test direction, no-load operation, current/output, ripple, cut-in, solenoid engagement, and noise using the correct fixture; document results.']
      },
      {
        title: bev ? 'Low-voltage energy-management restoration' : 'Alternator/generator output, control, and ripple diagnosis', time: '0.8–1.8 hr', tools: `${scanTool}, DVOM, current clamp, oscilloscope/ripple tester, carbon pile or OEM-approved load method`,
        steps: bev ? ['Reconnect and initialize systems in the OEM order, then verify DC/DC enable, output, battery current direction, battery-sensor plausibility, and power-management states.','Register or code the 12V battery where required and clear only resolved energy-management faults.','Test multiple sleep/wake/READY/charge cycles and confirm the vehicle enters sleep without abnormal current draw.','Verify external charging, remote functions, low-voltage support, and no new interlock or isolation faults.'] : ['Verify battery health and charge before loading the system; identify smart-charge, LIN/BSS, PCM-controlled, dual-alternator, and load-management strategy.','Compare desired and actual voltage/current at specified temperature, state of charge, engine speed, and electrical load. Charging voltage alone is not an output test.','Measure positive and ground voltage drop under high load, then inspect sense/communication circuits and battery-current/temperature sensor data.','Measure AC ripple with appropriate bandwidth/test method; isolate diode/stator faults from ignition, inverter, or accessory noise.','Inspect belt slip, tensioner motion, pulley decoupler/clutch, crank pulley, alignment, fluid contamination, and bearing noise.','Resolve control, wiring, battery sensor, software, or load faults before condemning a controlled alternator; verify full output only using the published safe test.']
      },
      {
        title: 'Programming, relearns, parasitic-draw check, and final verification', time: '0.5–1.5 hr', tools: `${scanTool}, battery support, current logger/clamp, thermal camera as useful`,
        steps: ['Register/code the battery and configure/program replacement modules or smart generators only when the OEM procedure requires it.','Restore window, sunroof, steering, throttle, idle, transmission, clock, radio, and other learned functions affected by battery disconnection.','Clear only resolved faults, then verify charging/start requests, cranking or READY operation, load response, warning lamps, and live data.','If discharge was part of the complaint, allow every module to time out and measure sleep current using a method that does not wake the vehicle.','Perform repeated cold/hot starts or READY cycles and a road test with electrical loads; inspect cable temperatures, belt tracking, noise, and leaks.','Complete a final scan and battery test, document before/after voltage, current, voltage drop, ripple, part numbers, programming, and warranty test codes.']
      }
    ],
    checklist: ['VIN and electrical architecture identified','Battery fully charged and tested before component diagnosis','Pre-repair scan and start/charge data saved','Loaded positive and ground voltage drops recorded','Exact part number, output rating, and pulley/terminal configuration verified','All cable and mounting torques documented','Battery registration/programming/relearns completed where required','Repeated start/READY, charging, sleep-current, road-test, and final scan checks passed']
  };
}

for (const entry of data.engineFamilies) entry.startingChargingService = makeService(entry);
data.version = 14;
data.schema.startingChargingService = 'Starting, charging, alternator, starter, starter-generator, DC/DC, battery, removal/installation, supported internal repair, programming, and verification workflows tailored by powertrain architecture.';
data.schema.coverage += ' Starting and charging workflows are available for every class.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}
console.log(`Added starting and charging service to ${data.engineFamilies.length} vehicle classes.`);
