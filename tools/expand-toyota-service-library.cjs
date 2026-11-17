const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

const definitions = [
  ['toyota-k-series','Toyota K-Series 1.0L–1.3L Inline-Four','1966-2007','1.0L, 1.1L, 1.2L, or 1.3L I4',['Toyota'],['2K','3K','4K','5K','7K','K-series'],['Corolla','Starlet','LiteAce','TownAce']],
  ['toyota-r-series','Toyota R / 20R / 22R / 22RE Inline-Four','1953-1997','1.5L–2.4L inline-four',['Toyota'],['R-series','18R','20R','22R','22RE','22R-TE'],['Pickup','Hilux','4Runner','Celica','Corona','Land Cruiser Prado']],
  ['toyota-a-series','Toyota A-Series 1.3L–1.8L Inline-Four','1978-2006','1.3L–1.8L inline-four',['Toyota','Geo','Chevrolet'],['2A','3A','4A-FE','4A-GE','4A-GZE','5A-FE','7A-FE','A-series'],['Corolla','Celica','MR2','Prizm','Carina','Tercel']],
  ['toyota-s-series','Toyota S-Series 1.8L–2.2L Inline-Four','1980-2007','1.8L, 2.0L, or 2.2L I4',['Toyota'],['1S','2S','3S-FE','3S-GE','3S-GTE','4S','5S-FE'],['Camry','Celica','MR2','RAV4','Solara','Carina']],
  ['toyota-jz-series','Toyota JZ-Series 2.5L / 3.0L Inline-Six','1990-2007','2.5L or 3.0L inline-six',['Toyota','Lexus'],['1JZ-GE','1JZ-GTE','2JZ-GE','2JZ-GTE','JZ'],['Supra','Soarer','Aristo','Chaser','Crown','Lexus GS300','Lexus IS300','Lexus SC300']],
  ['toyota-uz-v8','Toyota UZ-Series 4.0L / 4.3L / 4.7L V8','1989-2013','4.0L, 4.3L, or 4.7L V8',['Toyota','Lexus'],['1UZ-FE','2UZ-FE','3UZ-FE','UZ'],['Land Cruiser','Tundra','Sequoia','4Runner','Lexus LS400','Lexus LS430','Lexus GX470','Lexus LX470','Lexus SC400']],
  ['toyota-nz-series','Toyota NZ-Series 1.3L / 1.5L Inline-Four and Hybrid','1999-2021','1.3L or 1.5L inline-four',['Toyota','Scion'],['1NZ-FE','1NZ-FXE','2NZ-FE','NZ'],['Yaris','Echo','Prius','Prius c','Scion xA','Scion xB']],
  ['toyota-zz-series','Toyota ZZ-Series 1.4L–1.8L Inline-Four','1997-2011','1.4L, 1.6L, or 1.8L I4',['Toyota','Pontiac','Chevrolet','Lotus'],['1ZZ-FE','2ZZ-GE','3ZZ-FE','4ZZ-FE','ZZ'],['Corolla','Matrix','Celica','MR2 Spyder','Pontiac Vibe','Chevrolet Prizm','Lotus Elise']],
  ['toyota-az-series','Toyota AZ-Series 2.0L / 2.4L Inline-Four','2000-2017','2.0L or 2.4L inline-four',['Toyota','Lexus','Scion','Pontiac'],['1AZ-FE','1AZ-FSE','2AZ-FE','2AZ-FXE','AZ'],['Camry','RAV4','Highlander','Solara','Scion tC','Lexus HS250h','Pontiac Vibe']],
  ['toyota-ar-series','Toyota AR-Series 2.5L / 2.7L Inline-Four','2008-2021','2.5L or 2.7L inline-four',['Toyota','Lexus','Scion'],['1AR-FE','2AR-FE','2AR-FXE','2AR-FSE','AR'],['Camry','RAV4','Highlander','Venza','Sienna','Scion tC','Lexus ES300h','Lexus NX300h']],
  ['toyota-zr-series','Toyota ZR-Series 1.6L / 1.8L / 2.0L Inline-Four','2007-2022','1.6L, 1.8L, or 2.0L inline-four',['Toyota','Scion','Lexus'],['1ZR-FE','2ZR-FE','2ZR-FAE','2ZR-FXE','3ZR-FAE','ZR'],['Corolla','Matrix','Prius','C-HR','Scion xD','Lexus CT200h']],
  ['toyota-gr-v6','Toyota GR-Series 2.5L / 3.0L / 3.5L / 4.0L V6','2002-2024','2.5L–4.0L DOHC V6',['Toyota','Lexus'],['2GR-FE','2GR-FSE','2GR-FKS','2GR-FXS','3GR-FSE','4GR-FSE','1GR-FE','GR'],['Camry','Avalon','Sienna','Highlander','Tacoma','4Runner','FJ Cruiser','Lexus ES350','Lexus RX350','Lexus IS350','Lexus GX']],
  ['toyota-mz-v6','Toyota MZ-Series 3.0L / 3.3L V6','1993-2014','3.0L or 3.3L V6',['Toyota','Lexus'],['1MZ-FE','3MZ-FE','MZ'],['Camry','Avalon','Sienna','Highlander','Solara','Lexus ES300','Lexus ES330','Lexus RX300','Lexus RX330','Lexus RX400h']],
  ['toyota-ur-v8','Toyota UR-Series 4.6L / 5.0L / 5.7L V8','2006-2022','4.6L, 5.0L, or 5.7L V8',['Toyota','Lexus'],['1UR-FE','1UR-FSE','2UR-GSE','2UR-FSE','3UR-FE','3UR-FBE','UR'],['Tundra','Sequoia','Land Cruiser','Lexus LS460','Lexus GX460','Lexus LX570','Lexus IS F','Lexus RC F','Lexus LC500']],
  ['toyota-v35a-twin-turbo','Toyota V35A-FTS 3.4L Twin-Turbo V6','2018-2026','3.4L twin-turbo V6',['Toyota','Lexus'],['V35A-FTS','V35A','3.4 Twin Turbo','i-FORCE'],['Tundra','Sequoia','Land Cruiser','Lexus LS500','Lexus LX600','Lexus GX550']],
  ['toyota-dynamic-force-m20','Toyota M20A Dynamic Force 2.0L Inline-Four','2018-2026','2.0L Dynamic Force inline-four',['Toyota','Lexus'],['M20A-FKS','M20A-FXS','M20A'],['Corolla','Corolla Cross','C-HR','Camry','RAV4','Prius','Lexus UX200','Lexus UX250h']],
  ['toyota-dynamic-force-a25','Toyota A25A Dynamic Force 2.5L Inline-Four','2017-2026','2.5L Dynamic Force inline-four',['Toyota','Lexus'],['A25A-FKS','A25A-FXS','A25A'],['Camry','RAV4','Highlander','Sienna','Venza','Crown','Lexus ES250','Lexus ES300h','Lexus NX350h']],
  ['toyota-dynamic-force-t24','Toyota T24A-FTS 2.4L Turbo Dynamic Force','2021-2026','2.4L turbocharged inline-four',['Toyota','Lexus'],['T24A-FTS','T24A','2.4 Turbo','i-FORCE MAX'],['Tacoma','4Runner','Land Cruiser','Highlander','Crown','Lexus NX350','Lexus RX350','Lexus GX550']],
  ['toyota-g16e-turbo','Toyota G16E-GTS 1.6L Turbo Three-Cylinder','2020-2026','1.6L turbocharged inline-three',['Toyota'],['G16E-GTS','G16E','GR Three-Cylinder'],['GR Yaris','GR Corolla']],
  ['toyota-kd-diesel','Toyota KD-Series 2.5L / 3.0L Turbo Diesel','2000-2021','2.5L or 3.0L common-rail turbo-diesel I4',['Toyota'],['2KD-FTV','1KD-FTV','KD'],['Hilux','Fortuner','Land Cruiser Prado','HiAce']],
  ['toyota-gd-diesel','Toyota GD-Series 2.4L / 2.8L Turbo Diesel','2015-2026','2.4L or 2.8L common-rail turbo-diesel I4',['Toyota'],['2GD-FTV','1GD-FTV','GD'],['Hilux','Fortuner','Land Cruiser Prado','HiAce']],
  ['toyota-hybrid-synergy-drive','Toyota/Lexus Hybrid Synergy Drive and Multi-Stage Hybrid','2001-2026','Gasoline-electric hybrid propulsion',['Toyota','Lexus'],['Hybrid','HEV','PHEV','Prime','Hybrid Synergy Drive','HSD','THS','eCVT'],['Prius','Prius Prime','Camry Hybrid','RAV4 Hybrid','RAV4 Prime','Highlander Hybrid','Sienna Hybrid','Venza','Lexus RX Hybrid','Lexus ES Hybrid','Lexus NX Hybrid']],
  ['toyota-bev','Toyota/Lexus Battery-Electric Drive Systems','2012-2026','Battery-electric propulsion',['Toyota','Lexus','Scion'],['EV','BEV','bZ4X','RZ','High Voltage'],['RAV4 EV','bZ4X','Lexus RZ','Scion iQ EV']],
  ['toyota-fuel-cell','Toyota Mirai Hydrogen Fuel-Cell Electric System','2016-2026','Hydrogen fuel-cell electric propulsion',['Toyota'],['Mirai','FCEV','Fuel Cell','Hydrogen'],['Mirai']]
];

const base = data.engineFamilies.find((entry) => entry.id === 'gm-ecotec-20t');
if (!base) throw new Error('Base service record not found.');

function makeRecord(def) {
  const [id, name, years, displacement, makes, codes, models] = def;
  const diesel = id.includes('diesel');
  const highVoltage = id.includes('hybrid') || id.includes('bev') || id.includes('fuel-cell');
  const record = structuredClone(base);
  record.id = id;
  record.engineFamily = name;
  record.engine = {
    application: 'Toyota/Lexus applications listed in matching hints; confirm VIN, engine code, market, calibration, and underhood label.',
    years: `${years} common service range; market availability varies`,
    displacement,
    configuration: highVoltage ? 'Electrified propulsion architecture; exact engine, motor, battery, and transaxle configuration is VIN-specific' : diesel ? 'Common-rail turbo-diesel architecture; emissions generation is market- and VIN-specific' : 'Toyota gasoline engine architecture; valvetrain, induction, and generation are engine-code specific',
    induction: highVoltage ? 'Electric drive with gasoline engine or fuel-cell stack where applicable' : diesel ? 'High-pressure common-rail direct injection' : 'Naturally aspirated or turbocharged; port/direct/dual injection varies by engine code',
    horsepower: 'Varies by engine code, market, calibration, model year, and application',
    torque: 'Varies by engine code, market, calibration, model year, and application',
    compression: 'Engine-code-specific; retrieve current Toyota/Lexus repair information',
    boreStroke: 'Engine-code-specific; do not infer from displacement alone',
    oilCapacity: highVoltage && id.includes('bev') ? 'No engine oil; drive-unit fluid is VIN-specific' : 'VIN/engine-code-specific; verify repair manual and final level',
    recommendedOil: highVoltage && id.includes('bev') ? 'Drive-unit fluid is model-specific; no engine oil' : diesel ? 'Toyota-approved diesel oil specification by market, emissions system, temperature, and duty' : 'Toyota-approved viscosity and specification shown on oil cap/current repair information',
    coolant: 'Use the exact Toyota Super Long Life Coolant or specified equivalent for the VIN; hybrids/EVs can have multiple isolated loops',
    firingOrder: highVoltage && id.includes('bev') ? 'Not applicable' : 'Engine-code-specific; verify cylinder numbering and firing order in current repair information',
    sparkPlugs: diesel || (highVoltage && id.includes('bev')) ? 'Not applicable; diesel glow-plug or high-voltage service is engine-specific' : 'Part number, gap policy, and replacement interval are VIN/engine-code-specific',
    notes: 'Offline shop reference. Confirm current Toyota/Lexus repair manual, TSBs, campaigns, one-time-use hardware, and specifications by VIN before critical work.'
  };
  record.repairOrderLinks = { matchYearRange: years.split('-').map(Number), makes, engineCodes: codes, vehicleTextTokens: models };
  for (const item of record.torqueSpecs) {
    item.spec = item.spec.replace(/GM SI/g, 'Toyota/Lexus repair manual');
    item.notes = item.notes.replace(/GM/g, 'Toyota/Lexus');
  }
  for (const [index, procedure] of record.procedures.entries()) {
    if (index === 0) procedure.title = `${name} identification and baseline`;
    procedure.tools = procedure.tools.replace(/GM-capable/g, 'Toyota Techstream-capable');
    procedure.steps = procedure.steps.map((step) => step.replace(/GM service information/g, 'Toyota/Lexus repair information').replace(/GM-capable/g, 'Toyota Techstream-capable'));
  }
  record.worksheets[0].title = `${name} intake worksheet`;
  return record;
}

const records = definitions.map(makeRecord);
const ids = new Set(records.map((entry) => entry.id));
data.engineFamilies = [...data.engineFamilies.filter((entry) => !ids.has(entry.id)), ...records];
data.version = 7;
data.schema.coverage = 'GM, Ford, Toyota, and Lexus multi-family offline service library. Critical specifications require VIN/engine-code confirmation against current OEM information.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}

console.log(`Wrote ${data.engineFamilies.length} total families including ${records.length} Toyota/Lexus families.`);
