const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

const definitions = [
  ['bmw-m10-m40-four','BMW M10 / M40 SOHC Inline-Four','1962-1994','1.5L–2.0L inline-four',['BMW'],['M10','M10B18','M10B20','M40','M40B16','M40B18'],['1500','1600','1800','2002','E21 3 Series','E30 3 Series','E34 5 Series']],
  ['bmw-m42-m44-four','BMW M42 / M44 DOHC Inline-Four','1989-2000','1.8L or 1.9L inline-four',['BMW'],['M42B18','M44B19','M42','M44'],['318i','318is','318ti','Z3 1.9','E30','E36']],
  ['bmw-m20-six','BMW M20 Inline-Six','1977-1993','2.0L–2.7L inline-six',['BMW'],['M20B20','M20B23','M20B25','M20B27','M20'],['320i','323i','325e','325i','525e','E21','E28','E30']],
  ['bmw-m30-six','BMW M30 Big Six','1968-1995','2.5L–3.5L inline-six',['BMW'],['M30B25','M30B28','M30B30','M30B32','M30B34','M30B35','M30'],['2500','2800','3.0CS','530i','533i','535i','633CSi','635CSi','735i','E3','E9','E12','E23','E24','E28','E34']],
  ['bmw-m50-m52-six','BMW M50 / M52 Inline-Six','1990-2000','2.0L–2.8L inline-six',['BMW'],['M50B20','M50B25','M50TU','M52B20','M52B25','M52B28','M52TU','M50','M52'],['320i','323i','325i','328i','520i','523i','525i','528i','Z3','E34','E36','E39','E46']],
  ['bmw-m54-six','BMW M54 Inline-Six','2000-2006','2.2L, 2.5L, or 3.0L inline-six',['BMW'],['M54B22','M54B25','M54B30','M54'],['320i','325i','330i','520i','525i','530i','X3','X5','Z3','Z4','E46','E39','E60','E83','E53']],
  ['bmw-n52-n53-six','BMW N52 / N53 Naturally Aspirated Inline-Six','2005-2013','2.5L or 3.0L inline-six',['BMW'],['N52B25','N52B30','N51','N53B25','N53B30','N52','N53'],['323i','325i','328i','330i','523i','525i','528i','530i','X3','X5','Z4','E90','E60','E83','E70']],
  ['bmw-n54-n55-six','BMW N54 / N55 Turbocharged Inline-Six','2006-2019','3.0L turbocharged inline-six',['BMW'],['N54B30','N55B30','N54','N55','TwinPower Turbo'],['135i','335i','535i','640i','740i','X3 35i','X5 35i','X6 35i','Z4 35i','M2','E90','F30','F10']],
  ['bmw-b58-six','BMW B58 Modular Turbocharged Inline-Six','2015-2026','3.0L turbocharged inline-six',['BMW','Toyota','Morgan','Ineos'],['B58B30','B58C','B58D','B58TU','B58'],['M240i','340i','M340i','440i','540i','740i','840i','X3 M40i','X5 40i','Z4 M40i','Toyota Supra','Grenadier']],
  ['bmw-m43-n42-n46-four','BMW M43 / N42 / N46 Inline-Four','1991-2015','1.6L–2.0L inline-four',['BMW'],['M43B16','M43B18','M43B19','N42B18','N42B20','N46B18','N46B20','M43','N42','N46'],['316i','318i','320i','E36','E46','E87','E90']],
  ['bmw-n20-n26-four','BMW N20 / N26 Turbocharged Inline-Four','2011-2017','2.0L turbocharged inline-four',['BMW'],['N20B20','N26B20','N20','N26'],['228i','320i','328i','428i','528i','X1 28i','X3 28i','X4 28i','Z4 28i','F22','F30','F10']],
  ['bmw-b48-four','BMW B46 / B48 Modular Turbocharged Inline-Four','2014-2026','2.0L turbocharged inline-four',['BMW','MINI','Toyota'],['B46A20','B46B20','B48A20','B48B20','B46','B48'],['230i','330i','430i','530i','X1','X2','X3 30i','Z4 30i','MINI Cooper S','Toyota Supra 2.0']],
  ['bmw-b38-three','BMW B36 / B38 Modular Turbocharged Three-Cylinder','2013-2026','1.2L or 1.5L turbocharged inline-three',['BMW','MINI'],['B36A15','B38A12','B38A15','B38B15','B36','B38'],['BMW i8','BMW 116i','BMW 218i','MINI Cooper','MINI Clubman','MINI Countryman']],
  ['bmw-mini-prince','BMW/MINI Prince N12–N18 Inline-Four','2006-2016','1.4L or 1.6L inline-four, naturally aspirated or turbocharged',['MINI','BMW','Peugeot','Citroen'],['N12B14','N12B16','N13B16','N14B16','N16B16','N18B16','Prince'],['MINI Cooper','MINI Cooper S','MINI JCW','BMW 116i','BMW 118i']],
  ['bmw-m60-m62-v8','BMW M60 / M62 V8','1992-2005','3.0L–4.6L V8',['BMW','Land Rover'],['M60B30','M60B40','M62B35','M62B44','M62B46','M62TU','M60','M62'],['530i','535i','540i','730i','735i','740i','840i','X5 4.4i','Range Rover','E34','E38','E39','E53']],
  ['bmw-n62-v8','BMW N62 Naturally Aspirated V8','2001-2010','3.6L–4.8L V8',['BMW','Morgan'],['N62B36','N62B40','N62B44','N62B48','N62'],['545i','550i','645Ci','650i','745i','750i','X5 4.8i','Morgan Aero']],
  ['bmw-n63-s63-v8','BMW N63 / S63 Twin-Turbo V8','2008-2026','4.4L twin-turbocharged V8',['BMW'],['N63B44','N63TU','S63B44','S63TU','N63','S63'],['550i','650i','750i','850i','X5 50i','X6 50i','M5','M6','X5 M','X6 M','M8']],
  ['bmw-s14-s50-s52-six','BMW M S14 / S50 / S52 Performance Engines','1986-2000','2.3L–3.2L high-performance four- or six-cylinder',['BMW'],['S14B23','S14B25','S50B30','S50B32','S52B32','S14','S50','S52'],['E30 M3','E36 M3','Z3 M Roadster','Z3 M Coupe']],
  ['bmw-s54-six','BMW S54 High-Performance Inline-Six','2000-2008','3.2L high-performance inline-six',['BMW'],['S54B32','S54'],['E46 M3','Z3 M Roadster','Z3 M Coupe','Z4 M Roadster','Z4 M Coupe']],
  ['bmw-s55-s58-six','BMW S55 / S58 Twin-Turbo M Inline-Six','2014-2026','3.0L twin-turbo high-performance inline-six',['BMW'],['S55B30','S58B30','S55','S58'],['M2','M3','M4','X3 M','X4 M']],
  ['bmw-s65-s85','BMW S65 V8 / S85 V10 M Engines','2005-2013','4.0L–4.4L V8 or 5.0L V10',['BMW'],['S65B40','S65B44','S85B50','S65','S85'],['E90 M3','E92 M3','E93 M3','E60 M5','E61 M5','E63 M6','E64 M6']],
  ['bmw-m57-n57-b57-diesel','BMW M57 / N57 / B57 Six-Cylinder Diesel','1998-2026','2.5L or 3.0L turbo-diesel inline-six',['BMW'],['M57D25','M57D30','N57D30','B57D30','M57','N57','B57'],['325d','330d','335d','525d','530d','535d','730d','X3 30d','X5 35d','X6 35d']],
  ['bmw-n47-b47-diesel','BMW N47 / B47 Four-Cylinder Diesel','2007-2026','1.6L or 2.0L turbo-diesel inline-four',['BMW','MINI','Toyota'],['N47D16','N47D20','B47D20','N47','B47'],['116d','118d','120d','316d','318d','320d','520d','X1 20d','X3 20d','MINI Cooper D']],
  ['bmw-hybrid-phev','BMW Plug-In Hybrid and ActiveHybrid Systems','2009-2026','Gasoline-electric hybrid propulsion',['BMW','MINI'],['Hybrid','PHEV','ActiveHybrid','eDrive','xDrive45e','xDrive50e'],['ActiveHybrid 3','ActiveHybrid 5','330e','530e','745e','750e','X3 30e','X5 40e','X5 45e','X5 50e','MINI Countryman SE','BMW i8']],
  ['bmw-bev','BMW i Battery-Electric Drive Systems','2014-2026','Battery-electric propulsion',['BMW','MINI'],['EV','BEV','BMW i','eDrive','High Voltage'],['BMW i3','BMW i4','BMW i5','BMW i7','BMW iX','BMW iX1','BMW iX3','MINI Cooper SE']]
];

const base = data.engineFamilies.find((entry) => entry.id === 'nissan-vq-v6') || data.engineFamilies[0];
if (!base) throw new Error('Base service record not found.');

function makeRecord(def) {
  const [id, name, years, displacement, makes, codes, models] = def;
  const diesel = id.includes('diesel');
  const highVoltage = id.includes('hybrid') || id.includes('bev');
  const performance = id.includes('s14-') || id.includes('s54-') || id.includes('s55-') || id.includes('s65-');
  const record = structuredClone(base);
  record.id = id;
  record.engineFamily = name;
  record.engine = {
    application: 'BMW/MINI applications listed in matching hints; confirm full VIN, chassis code, engine designation, market, integration level, and underhood label.',
    years: `${years} common service range; market and chassis availability vary`,
    displacement,
    configuration: highVoltage ? 'Electrified propulsion architecture; exact engine, electric machine, inverter, battery, and transmission configuration is VIN-specific' : diesel ? 'BMW turbo-diesel architecture; injection, turbocharger, and emissions generation are engine-code-specific' : performance ? 'BMW M high-performance architecture; production revision and chassis installation are critical identifiers' : 'BMW gasoline engine architecture; valvetrain, induction, and technical-update generation are engine-code-specific',
    induction: highVoltage ? 'Electric traction system with gasoline engine where applicable' : diesel ? 'High-pressure common-rail diesel injection on modern variants; legacy system varies' : 'Naturally aspirated or turbocharged; port/direct injection varies by engine generation',
    horsepower: 'Varies by engine designation, technical update, market, calibration, model year, and chassis',
    torque: 'Varies by engine designation, technical update, market, calibration, model year, and chassis',
    compression: 'Engine-designation-specific; retrieve current BMW AIR/ISTA repair information',
    boreStroke: 'Engine-designation-specific; do not infer from model badge or displacement alone',
    oilCapacity: highVoltage && id.includes('bev') ? 'No engine oil; electric drive-unit fluid is VIN-specific' : 'VIN/engine-designation-specific; follow ISTA fill procedure and electronic level check where equipped',
    recommendedOil: highVoltage && id.includes('bev') ? 'Electric drive-unit fluid is model-specific; no engine oil' : diesel ? 'BMW Longlife-approved diesel oil specification by VIN, emissions system, market, and temperature' : 'BMW Longlife approval and viscosity specified for VIN/market; performance models may have unique requirements',
    coolant: 'Use the current BMW-approved coolant specification for the VIN; electrified and turbocharged vehicles may have multiple circuits',
    firingOrder: highVoltage && id.includes('bev') ? 'Not applicable' : 'Engine-designation-specific; verify cylinder numbering and firing order in ISTA/AIR',
    sparkPlugs: diesel || (highVoltage && id.includes('bev')) ? 'Not applicable; diesel glow-plug or high-voltage service is engine-specific' : 'Part number, installation procedure, and replacement interval are VIN/engine-specific',
    notes: 'Offline shop reference. Confirm current BMW AIR/ISTA repair instructions, service information bulletins, campaigns, test plans, programming requirements, aluminum fasteners, and specifications by VIN.'
  };
  record.repairOrderLinks = { matchYearRange: years.split('-').map(Number), makes, engineCodes: codes, vehicleTextTokens: models };
  for (const item of record.torqueSpecs) {
    item.spec = item.spec.replace(/Nissan\/Infiniti service manual|Toyota\/Lexus repair manual|GM SI/g, 'BMW AIR/ISTA repair instructions');
    item.notes = item.notes.replace(/Nissan\/Infiniti|Toyota\/Lexus|GM/g, 'BMW/MINI');
  }
  for (const [index, procedure] of record.procedures.entries()) {
    if (index === 0) procedure.title = `${name} identification and baseline`;
    procedure.tools = procedure.tools.replace(/Nissan CONSULT-capable|Toyota Techstream-capable|GM-capable/g, 'BMW ISTA-capable');
    procedure.steps = procedure.steps.map((step) => step.replace(/Nissan\/Infiniti service information|Toyota\/Lexus repair information|GM service information/g, 'BMW AIR/ISTA repair information').replace(/Nissan CONSULT-capable|Toyota Techstream-capable|GM-capable/g, 'BMW ISTA-capable'));
  }
  record.worksheets[0].title = `${name} intake worksheet`;
  return record;
}

const records = definitions.map(makeRecord);
const ids = new Set(records.map((entry) => entry.id));
data.engineFamilies = [...data.engineFamilies.filter((entry) => !ids.has(entry.id)), ...records];
data.version = 9;
data.schema.coverage = 'GM, Ford, Toyota/Lexus, Nissan/Infiniti/Datsun, and BMW/MINI multi-family offline service library. Critical specifications require VIN/engine-code confirmation against current OEM information.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}

console.log(`Wrote ${data.engineFamilies.length} total families including ${records.length} BMW/MINI families.`);
