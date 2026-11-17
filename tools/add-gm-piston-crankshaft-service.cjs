const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sources = ['app_live_extract', 'app_extracted'].map((name) => path.join(root, '_private_dev', 'source', name, 'dist'));
const imageSource = {
  piston: 'C:\\Users\\larry\\.codex\\generated_images\\019f7dd8-597e-7832-85fd-0264d63dd8c9\\exec-e10d8b5b-295f-4a48-93a1-905a9ca8d052.png',
  crank: 'C:\\Users\\larry\\.codex\\generated_images\\019f7dd8-597e-7832-85fd-0264d63dd8c9\\exec-4d642756-99f1-4344-958f-503ad751fc12.png'
};

const service = {
  title: 'GM Piston Ring, Piston and Crankshaft Installation',
  applicability: 'GM gasoline and diesel engine families in this library. For Voltec/eAssist records, this applies only to the internal-combustion engine. Not applicable to battery-electric drive units.',
  availability: 'Conceptual shop workflow is stored locally. Pull the exact VIN, RPO, engine code, casting, model year and service operation from current GM Service Information before disassembly or assembly.',
  warning: 'Illustrations are conceptual—not exact ring-gap clocking, cap order, thrust location, fastener sequence, torque or angle specifications. Those details vary by engine and replacement-part manufacturer.',
  requiredVehicleData: ['Full VIN and model year', 'Make, model and drivetrain', 'RPO and exact engine code', 'Engine block/crankshaft casting or service-part identification', 'Piston, ring and bearing manufacturer/part numbers', 'RO concern, measurements and prior machining'],
  specifications: [
    { label: 'Cylinder condition', value: 'Retrieve bore diameter, taper, out-of-round, surface-finish and piston-to-wall limits.' },
    { label: 'Piston rings', value: 'Retrieve end-gap, side-clearance, groove, facing/mark orientation and ring-gap position instructions for the exact engine and ring set.' },
    { label: 'Connecting rods', value: 'Retrieve rod orientation, cap matching, bearing clearance, side clearance, fastener reuse and torque/angle sequence.' },
    { label: 'Crankshaft and mains', value: 'Retrieve journal diameter/runout, oil clearance, thrust location/endplay, bearing grade, cap orientation/sequence, sealant and torque/angle values.' },
    { label: 'Lubrication and priming', value: 'Retrieve approved assembly lubricant, seal installation, oil-pump priming and first-start instructions.' }
  ],
  diagrams: [
    { title: 'Piston ring inspection and installation', src: './service-images/gm-piston-ring-installation.png', alt: 'Conceptual piston ring set, ring expander, cylinder end-gap check, ring compressor and protected connecting-rod bolts.', caption: '1 ring set; 2 ring-expander tool; 3 end gap squared in the serviced bore; 4 compressor-guided piston entry; 5 protected rod bolts. Confirm actual ring order, markings and gap positions from GM SI and the ring maker.' },
    { title: 'Crankshaft, main bearings and endplay', src: './service-images/gm-crankshaft-installation.png', alt: 'Conceptual crankshaft, main bearing shells, main caps, thrust bearing, tightening pattern and dial-indicator endplay check.', caption: '1 crankshaft placement; 2 lubricated running face/clean dry shell back; 3 matched caps and thrust components; 4 conceptual staged tightening; 5 endplay check. Use the exact engine-specific cap identity, direction, sequence and values.' }
  ],
  procedures: [
    { title: 'Identify and measure before assembly', tools: 'GM SI access, micrometers, bore gauge, straightedge, feeler gauges and clean-room supplies', steps: ['Verify VIN, RPO, engine code, casting numbers and installed service parts; open the exact current GM SI procedure.', 'Clean oil galleries and components using the approved method; confirm plugs and restrictors are installed.', 'Measure every cylinder for diameter, taper and out-of-round and record piston-to-wall clearance at the specified gauge points.', 'Inspect ring lands, piston pin fit, connecting rods, main bore, crank journals, fillets, runout and surface condition.', 'Stop if any measurement is outside the exact service or machining limit. Do not compensate with an unapproved bearing or ring size.'] },
    { title: 'Fit and install piston rings', tools: 'Ring squaring tool or inverted piston, feeler gauges and piston-ring expander', steps: ['Keep each piston/ring set assigned to its measured cylinder.', 'Square each ring at the GM/ring-maker specified bore depth and measure end gap; file only when the supplied ring instructions permit it, keeping ends parallel and deburred.', 'Measure ring side clearance and verify groove cleanliness.', 'Install the oil expander and rails without overlapping expander ends unless the exact part instructions state otherwise.', 'Install compression rings with a ring-expander tool, honoring all dots, bevels, steps and TOP marks. Never spiral a compression ring onto the piston.', 'Position gaps exactly as the current engine-specific GM SI and ring-set sheet require; do not substitute a generic clocking diagram.', 'Verify every ring moves freely in its groove and recheck identification before compression.'] },
    { title: 'Install piston and connecting rod', tools: 'Correct ring compressor, protected rod-bolt guides, non-marring driver and calibrated torque/angle tools', steps: ['Confirm piston/rod bank and cylinder assignment, piston direction, rod chamfer and cap match.', 'Clean the bore and lubricate only as specified. Cover rod bolts so they cannot score the crank journal.', 'Compress rings evenly; ensure the compressor is square and fully seated on the deck.', 'Guide the piston into its assigned bore without hammering against resistance. Stop if a ring escapes or binds.', 'Guide the rod onto its journal, install the matched bearing/cap in the correct orientation and check clearance using the GM-approved method.', 'Apply new fasteners where required and tighten in the exact pass/sequence/torque-angle procedure. Confirm free rotation and rod side clearance.'] },
    { title: 'Install crankshaft and main bearings', tools: 'Micrometers, bore gauge or OEM-approved clearance method, assembly lubricant, calibrated torque/angle tools and dial indicator', steps: ['Match bearing grade/size and cap identity to the block and crankshaft. Ensure oil holes align.', 'Seat clean bearing shells with clean, dry backs; apply the specified lubricant only to running surfaces unless GM SI directs otherwise.', 'Lower the clean crankshaft straight into the upper bearings without dragging journals across shells.', 'Install the thrust bearing/component and matched main caps in their exact positions and directions.', 'Tighten fasteners in the exact GM sequence and stages using required new torque-to-yield fasteners. Never infer values from engine-family similarity.', 'Rotate the crankshaft after the prescribed stages. Stop and diagnose any new bind before continuing.', 'Measure oil clearance and crankshaft endplay using the method and limits for the exact engine; document all results.', 'Install seals, bedplate/cross-bolts and sealant within specified working time, then prime the lubrication system before start-up.'] }
  ],
  checklist: ['VIN/RPO/engine/casting and service-part IDs verified', 'Bore, piston, ring, rod, journal, main-clearance and endplay measurements recorded', 'Ring order, face markings and gap positions verified from exact instructions', 'Rod and main caps matched and oriented', 'Fastener reuse policy and calibrated torque-angle sequence verified', 'Crank rotates freely at required assembly stages', 'Oil galleries/seals/sealant and lubrication-system prime verified', 'RO contains the OEM SI document revision or access date used'],
  sourceLinks: [{ title: 'ACDelco Technical Delivery System / GM Service Information', url: 'https://www.acdelcotds.com/', scope: 'Subscription access to current VIN/application-specific GM service procedures, specifications and bulletins.', authority: 'GM/ACDelco' }]
};

for (const dist of sources) {
  const jsonPath = path.join(dist, 'service-library-data.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  data.version = Math.max(Number(data.version) || 0, 17);
  data.schema.internalEngineService = 'GM piston-ring, piston, connecting-rod and crankshaft installation workflows with conceptual diagrams; exact values and sequences require VIN/RPO/engine-specific OEM information.';
  let count = 0;
  for (const family of data.engineFamilies) {
    if (family.id.startsWith('gm-') && family.id !== 'gm-ultium-ev') {
      family.internalEngineService = JSON.parse(JSON.stringify(service));
      count += 1;
    } else delete family.internalEngineService;
  }
  fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(path.join(dist, 'service-library-data.js'), `window.XPRESSIVE_SERVICE_LIBRARY = ${JSON.stringify(data, null, 2)};\n`);
  const imageDir = path.join(dist, 'service-images');
  fs.mkdirSync(imageDir, { recursive: true });
  fs.copyFileSync(imageSource.piston, path.join(imageDir, 'gm-piston-ring-installation.png'));
  fs.copyFileSync(imageSource.crank, path.join(imageDir, 'gm-crankshaft-installation.png'));
  console.log(`Updated ${count} GM internal-combustion records in ${dist}`);
}
