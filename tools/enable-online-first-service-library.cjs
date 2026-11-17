const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

for (const entry of data.engineFamilies) {
  const sourceMap = new Map();
  for (const service of [entry.brakeService, entry.tuneUpService, entry.startingChargingService]) {
    for (const source of service?.sourceLinks || []) sourceMap.set(source.url, source);
  }
  entry.onlineReference = {
    priority: 'online-first',
    title: `${entry.engineFamily} RO-specific online reference`,
    policy: 'Research the active repair order and current service area online first. Prefer current OEM service information, campaigns, recalls, TSBs, wiring, specifications, and guided tests. Use stored procedures as an offline fallback and workflow aid.',
    sourceLinks: [...sourceMap.values()],
    requiredRoFields: ['VIN','Year, make, model, and trim/chassis','Engine or drive-unit code','Mileage or hours','Customer complaint/requested service','DTCs, warning lamps, inspection findings, and technician notes'],
    researchRules: ['Do not send customer name, phone, email, street address, payment, or other contact information.','Prefer OEM and government recall/campaign sources; label aftermarket or generic guidance.','Use full VIN only with the OEM portal or explicitly authorized research service.','Never invent torque values, fluid specifications, discard limits, wiring pinouts, TSB numbers, labor times, parts, coding, or programming steps.','Cite live source links and publication/revision dates where available.','Clearly separate online-verified facts, VIN-specific items still requiring portal access, and offline-library guidance.'],
    offlineFallback: 'If internet research is unavailable, continue with the stored safety, identification, diagnostic, measurement, and QC workflows while marking VIN-specific values unresolved.'
  };
}

data.version = 15;
data.schema.onlineReference = 'Online-first, active-RO-specific research policy and OEM source routing. Detects VIN-specific or unstored needs and retains offline workflows as fallback.';
data.schema.coverage += ' Online OEM/RO research is the primary workflow; stored content is the verified fallback.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}
console.log(`Enabled online-first reference policy for ${data.engineFamilies.length} vehicle classes.`);
