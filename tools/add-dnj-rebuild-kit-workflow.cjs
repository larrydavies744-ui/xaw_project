const fs = require('fs');
const path = require('path');

const roots = ['app_live_extract', 'app_extracted'].map((name) => path.join(__dirname, '..', '_private_dev', 'source', name, 'dist'));
const dnjSource = {
  title: 'DNJ Engine Rebuild Kits — official product information',
  url: 'https://enginecomponents.com/pages/engine-rebuild-kits-engine-kits',
  scope: 'Official DNJ overview of application-specific kit contents and component materials. Verify the exact catalog part number and included instruction sheet.',
  authority: 'DNJ Engine Components'
};

for (const root of roots) {
  const jsonPath = path.join(root, 'service-library-data.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  data.version = Math.max(Number(data.version) || 0, 18);
  data.schema.internalEngineService = 'GM piston-ring, piston, connecting-rod and crankshaft workflow optimized for the shop’s primarily used DNJ application-specific rebuild kits; exact DNJ part instructions and VIN/RPO-specific OEM information remain controlling.';
  let count = 0;
  for (const family of data.engineFamilies) {
    const service = family.internalEngineService;
    if (!service) continue;
    service.preferredKit = 'DNJ Engine Components rebuild kit (shop-primary aftermarket kit). Record the complete DNJ kit number, revision/lot markings, selected piston and bearing sizes, seller/source and every included component on the RO.';
    service.availability = 'Workflow is optimized for DNJ rebuild kits. Pull the exact DNJ application/kit listing plus current GM Service Information using VIN, RPO, engine code, casting, model year and service operation before disassembly or assembly.';
    service.warning = 'DNJ kit contents are application-specific and may differ. The exact supplied DNJ/component-maker instructions control ring markings, orientation and preparation; current GM SI controls engine assembly method, cap order, torque/angle, sealant and engine-specific limits. Resolve any conflict before assembly.';
    const required = service.requiredVehicleData || (service.requiredVehicleData = []);
    const dnjs = ['Complete DNJ kit part number and application listing', 'Kit revision/lot, seller/source and supplied instruction sheets', 'Ordered piston oversize and rod/main bearing undersize or grade', 'Received-kit inventory matched to the DNJ packing list'];
    for (const item of dnjs.reverse()) if (!required.includes(item)) required.unshift(item);
    service.specifications.unshift({ label: 'DNJ kit configuration', value: 'Confirm exact application, kit number, included components, piston size, ring set, main/rod bearing size or grade, gasket construction and any optional thrust/cam-bearing/freeze-plug content.' });
    service.procedures.unshift({
      title: 'Receive and verify the DNJ rebuild kit',
      tools: 'DNJ catalog/application listing, packing list, micrometers, bore gauge, scale and clean inspection bench',
      steps: [
        'Match the complete DNJ kit number to VIN, engine code, displacement, aspiration, model year and casting/application before opening sealed component packs.',
        'Photograph and record the kit label, revision/lot markings, seller/source, packing list and all supplied instruction sheets on the RO.',
        'Inventory every component. DNJ states contents are application-specific; do not assume pistons, rings, mains, rods, gaskets, plugs, cam bearings, thrust parts or pin bushings are included unless listed for this kit.',
        'Verify piston diameter/weight set, pin fit, ring groove dimensions, ring markings, bearing shell size/grade and gasket/seal construction against the order and measured engine.',
        'Inspect for shipping damage, contamination, mixed sizes, incorrect quantities and mismatched part markings. Quarantine the kit and resolve discrepancies before machining or assembly.',
        'Give the machine shop the actual DNJ pistons before final cylinder sizing/honing; set finished clearances and surface finish from the applicable DNJ/component instructions and GM limits.',
        'Retain labels and instructions with the job. Do not mix an unmatched replacement piston, ring or bearing into the set without dimensional and application approval.'
      ]
    });
    service.procedures[1].steps.splice(4, 0, 'Read the exact DNJ ring-set insert before fitting. DNJ kits may use application-specific ring materials/facings; component markings and supplied instructions take precedence over the conceptual diagram.');
    service.checklist.unshift('DNJ kit number, lot/revision, source, packing list and instruction sheets recorded');
    service.checklist.splice(1, 0, 'DNJ kit contents, quantities, piston size and bearing sizes/grades inspected and verified');
    if (!(service.sourceLinks || []).some((source) => source.url === dnjSource.url)) service.sourceLinks.push(dnjSource);
    count += 1;
  }
  fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(path.join(root, 'service-library-data.js'), `window.XPRESSIVE_SERVICE_LIBRARY = ${JSON.stringify(data, null, 2)};\n`);
  console.log(`Added DNJ workflow to ${count} GM engine records in ${root}`);
}
