const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

const definitions = [
  ['nissan-a-e-series','Nissan A / E-Series 1.0L–1.6L Inline-Four','1967-1999','1.0L–1.6L inline-four',['Nissan','Datsun'],['A10','A12','A13','A14','A15','E13','E15','E16'],['Datsun 1200','B210','210','Sentra','Pulsar','Cherry','Vanette']],
  ['nissan-l-z-series','Nissan L / Z-Series 1.6L–2.8L Gasoline Engines','1967-1989','1.6L–2.8L inline-four or inline-six',['Nissan','Datsun'],['L16','L18','L20B','L24','L26','L28','Z20','Z22','Z24'],['510','610','710','240Z','260Z','280Z','Pickup','720','Maxima']],
  ['nissan-ca-series','Nissan CA-Series 1.6L / 1.8L Inline-Four','1982-1994','1.6L or 1.8L inline-four',['Nissan'],['CA16DE','CA18DE','CA18DET','CA20E','CA'],['Pulsar','Stanza','Silvia','180SX','Bluebird']],
  ['nissan-ga-series','Nissan GA-Series 1.3L–1.6L Inline-Four','1987-2013','1.3L, 1.4L, 1.5L, or 1.6L inline-four',['Nissan'],['GA13DE','GA14DE','GA15DE','GA16DE','GA16DS','GA'],['Sentra','Sunny','Pulsar','Almera','NX','AD Van']],
  ['nissan-sr-series','Nissan SR-Series 1.6L / 2.0L Inline-Four','1989-2007','1.6L or 2.0L inline-four, naturally aspirated or turbocharged',['Nissan','Infiniti'],['SR16VE','SR18DE','SR20DE','SR20DET','SR20VE','SR'],['Sentra SE-R','NX2000','200SX','Silvia','180SX','Bluebird','Infiniti G20']],
  ['nissan-ka-series','Nissan KA-Series 2.4L Inline-Four','1988-2004','2.4L inline-four',['Nissan'],['KA24E','KA24DE','KA'],['240SX','Altima','Frontier','Pickup','Xterra','Stanza']],
  ['nissan-qr-series','Nissan QR-Series 2.0L / 2.5L Inline-Four','2000-2026','2.0L or 2.5L inline-four',['Nissan','Infiniti','Renault'],['QR20DE','QR25DE','QR25DER','QR'],['Altima','Sentra SE-R','Rogue','Frontier','X-Trail','Murano Hybrid','Pathfinder Hybrid']],
  ['nissan-mr-series','Nissan MR-Series 1.6L / 1.8L / 2.0L Inline-Four','2004-2026','1.6L, 1.8L, or 2.0L inline-four',['Nissan','Infiniti','Renault'],['MR16DDT','MR18DE','MR20DE','MR20DD','M5M','MR'],['Versa','Sentra','Rogue Sport','Juke','Kicks','Qashqai','Tiida']],
  ['nissan-hr-series','Nissan HR-Series 1.2L–1.6L Inline-Three/Four','2004-2026','1.2L–1.6L inline-three or inline-four',['Nissan','Infiniti','Renault','Mitsubishi'],['HR12DE','HR12DDR','HR13DDT','HR15DE','HR16DE','H4M','HR'],['Versa','Note','Micra','Kicks','March','Juke','Sentra']],
  ['nissan-vc-turbo','Nissan/Infiniti VC-Turbo KR-Series','2018-2026','1.5L three-cylinder or 2.0L four-cylinder variable-compression turbo',['Nissan','Infiniti'],['KR15DDT','KR20DDET','VC-Turbo','VC-T'],['Rogue','Altima','Infiniti QX50','Infiniti QX55']],
  ['nissan-vg-v6','Nissan VG-Series 2.0L–3.3L V6','1983-2004','2.0L–3.3L SOHC/DOHC V6',['Nissan','Infiniti'],['VG20E','VG30E','VG30DE','VG30DETT','VG30ET','VG33E','VG33ER','VG'],['300ZX','Maxima','Pathfinder','Pickup','Frontier','Xterra','Quest','Infiniti M30']],
  ['nissan-vq-v6','Nissan/Infiniti VQ-Series 2.5L–4.0L V6','1994-2026','2.5L–4.0L DOHC V6',['Nissan','Infiniti'],['VQ25DE','VQ30DE','VQ35DE','VQ35HR','VQ37VHR','VQ40DE','VQ'],['Altima','Maxima','Murano','Pathfinder','Quest','350Z','370Z','Frontier','Xterra','Infiniti G35','Infiniti G37','Infiniti Q50','Infiniti QX60']],
  ['nissan-vr-v6','Nissan/Infiniti VR-Series Twin-Turbo V6','2007-2026','3.0L or 3.8L twin-turbo V6',['Nissan','Infiniti'],['VR30DDTT','VR38DETT','VR'],['GT-R','Nissan Z','Infiniti Q50','Infiniti Q60']],
  ['nissan-vk-v8','Nissan/Infiniti VK-Series 4.5L / 5.0L / 5.6L V8','2001-2026','4.5L, 5.0L, or 5.6L DOHC V8',['Nissan','Infiniti'],['VK45DE','VK50VE','VK56DE','VK56VD','VK'],['Titan','Armada','Patrol','Infiniti Q45','Infiniti M45','Infiniti FX50','Infiniti QX56','Infiniti QX80']],
  ['nissan-rb-inline-six','Nissan RB-Series 2.0L–2.6L Inline-Six','1985-2004','2.0L–2.6L inline-six, naturally aspirated or turbocharged',['Nissan'],['RB20DE','RB20DET','RB25DE','RB25DET','RB26DETT','RB'],['Skyline','GT-R','Stagea','Laurel','Cefiro']],
  ['nissan-tb-inline-six','Nissan TB-Series 4.2L / 4.5L / 4.8L Inline-Six','1987-2023','4.2L, 4.5L, or 4.8L gasoline inline-six',['Nissan'],['TB42','TB45E','TB48DE','TB'],['Patrol','Safari']],
  ['nissan-yd-diesel','Nissan YD-Series 2.2L / 2.5L Turbo Diesel','1998-2026','2.2L or 2.5L common-rail turbo-diesel inline-four',['Nissan','Infiniti','Renault'],['YD22DDT','YD22DDTi','YD25DDTi','YD'],['Navara','Frontier','Pathfinder','X-Trail','Primera','Almera','Presage']],
  ['nissan-zd-diesel','Nissan ZD30 3.0L Turbo Diesel','1999-2026','3.0L turbo-diesel inline-four',['Nissan'],['ZD30DD','ZD30DDT','ZD30DDTi','ZD30'],['Patrol','Navara','Terrano','Caravan','Cabstar']],
  ['nissan-td-diesel','Nissan TD-Series 2.3L–4.2L Diesel','1985-2011','2.3L–4.2L indirect-injection diesel inline engine',['Nissan'],['TD23','TD25','TD27','TD42','TD42T','TD42Ti','TD'],['Pickup','Navara','Terrano','Pathfinder','Patrol','Caravan']],
  ['nissan-cummins-v8','Nissan Titan XD 5.0L Cummins Diesel V8','2016-2019','5.0L turbo-diesel V8',['Nissan','Cummins'],['ISV5.0','Cummins 5.0','5.0 Diesel'],['Titan XD']],
  ['nissan-m9r-diesel','Nissan/Renault M9R 2.0L Turbo Diesel','2006-2021','2.0L common-rail turbo-diesel inline-four',['Nissan','Renault'],['M9R','2.0 dCi'],['X-Trail','Qashqai','Navara','Primastar','Koleos']],
  ['nissan-hybrid','Nissan/Infiniti Hybrid and Plug-In Hybrid Systems','2007-2026','Gasoline-electric hybrid propulsion',['Nissan','Infiniti'],['Hybrid','HEV','PHEV','HM34','RM31','Tino Hybrid'],['Altima Hybrid','Pathfinder Hybrid','Murano Hybrid','Rogue Hybrid','Infiniti Q50 Hybrid','Infiniti Q70 Hybrid','Infiniti QX60 Hybrid']],
  ['nissan-epower','Nissan e-POWER Series-Hybrid Propulsion','2016-2026','Series-hybrid electric propulsion with gasoline generator',['Nissan'],['e-POWER','ePOWER','HR12DE e-POWER','KR15DDT e-POWER'],['Note e-POWER','Kicks e-POWER','Serena e-POWER','Qashqai e-POWER','X-Trail e-POWER','Rogue e-POWER']],
  ['nissan-bev','Nissan/Infiniti Battery-Electric Drive Systems','2011-2026','Battery-electric propulsion',['Nissan','Infiniti'],['EV','BEV','LEAF','Ariya','e-NV200','High Voltage'],['Leaf','Ariya','e-NV200','Sakura','Infiniti LE']]
];

const base = data.engineFamilies.find((entry) => entry.id === 'toyota-gr-v6') || data.engineFamilies[0];
if (!base) throw new Error('Base service record not found.');

function makeRecord(def) {
  const [id, name, years, displacement, makes, codes, models] = def;
  const diesel = id.includes('diesel') || id.includes('cummins');
  const highVoltage = id.includes('hybrid') || id.includes('epower') || id.includes('bev');
  const record = structuredClone(base);
  record.id = id;
  record.engineFamily = name;
  record.engine = {
    application: 'Nissan/Infiniti/Datsun applications listed in matching hints; confirm VIN, engine code, market, calibration, and underhood label.',
    years: `${years} common service range; market availability varies`,
    displacement,
    configuration: highVoltage ? 'Electrified propulsion architecture; exact engine, motor, inverter, battery, and transaxle configuration is VIN-specific' : diesel ? 'Diesel architecture; injection and emissions generation are market- and engine-code-specific' : 'Nissan gasoline engine architecture; valvetrain, induction, and generation are engine-code-specific',
    induction: highVoltage ? 'Electric traction drive with gasoline generator/engine where applicable' : diesel ? 'Mechanical or high-pressure common-rail diesel injection depending on engine code' : 'Naturally aspirated or turbocharged; port/direct/dual injection varies by engine code',
    horsepower: 'Varies by engine code, market, calibration, model year, and application',
    torque: 'Varies by engine code, market, calibration, model year, and application',
    compression: 'Engine-code-specific; retrieve current Nissan/Infiniti service information',
    boreStroke: 'Engine-code-specific; do not infer from displacement alone',
    oilCapacity: highVoltage && id.includes('bev') ? 'No engine oil; reduction-gear fluid is VIN-specific' : 'VIN/engine-code-specific; verify service manual and final level',
    recommendedOil: highVoltage && id.includes('bev') ? 'Reduction-gear fluid is model-specific; no engine oil' : diesel ? 'Nissan-approved diesel oil specification by market, emissions equipment, temperature, and duty' : 'Nissan-approved viscosity and specification shown on oil cap/current service information',
    coolant: 'Use the exact Nissan Long Life Antifreeze/Coolant specification for the VIN; electrified vehicles may have multiple cooling circuits',
    firingOrder: highVoltage && id.includes('bev') ? 'Not applicable' : 'Engine-code-specific; verify cylinder numbering and firing order in current service information',
    sparkPlugs: diesel || (highVoltage && id.includes('bev')) ? 'Not applicable; diesel glow-plug or high-voltage service is engine-specific' : 'Part number, gap policy, and replacement interval are VIN/engine-code-specific',
    notes: 'Offline shop reference. Confirm current Nissan/Infiniti Electronic Service Manual, TSBs, campaigns, CONSULT procedures, one-time-use hardware, and specifications by VIN.'
  };
  record.repairOrderLinks = { matchYearRange: years.split('-').map(Number), makes, engineCodes: codes, vehicleTextTokens: models };
  for (const item of record.torqueSpecs) {
    item.spec = item.spec.replace(/Toyota\/Lexus repair manual|GM SI/g, 'Nissan/Infiniti service manual');
    item.notes = item.notes.replace(/Toyota\/Lexus|GM/g, 'Nissan/Infiniti');
  }
  for (const [index, procedure] of record.procedures.entries()) {
    if (index === 0) procedure.title = `${name} identification and baseline`;
    procedure.tools = procedure.tools.replace(/Toyota Techstream-capable|GM-capable/g, 'Nissan CONSULT-capable');
    procedure.steps = procedure.steps.map((step) => step.replace(/Toyota\/Lexus repair information|GM service information/g, 'Nissan/Infiniti service information').replace(/Toyota Techstream-capable|GM-capable/g, 'Nissan CONSULT-capable'));
  }
  record.worksheets[0].title = `${name} intake worksheet`;
  return record;
}

const records = definitions.map(makeRecord);
const ids = new Set(records.map((entry) => entry.id));
data.engineFamilies = [...data.engineFamilies.filter((entry) => !ids.has(entry.id)), ...records];
data.version = 8;
data.schema.coverage = 'GM, Ford, Toyota/Lexus, and Nissan/Infiniti/Datsun multi-family offline service library. Critical specifications require VIN/engine-code confirmation against current OEM information.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}

console.log(`Wrote ${data.engineFamilies.length} total families including ${records.length} Nissan/Infiniti/Datsun families.`);
