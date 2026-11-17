const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

const definitions = [
  ['audi-ea827-legacy-four','Audi/VW EA827 1.6L–2.0L Inline-Four','1972-2002','1.6L–2.0L inline-four',['Audi','Volkswagen','VW'],['EA827','1.6','1.8','2.0 8V','3A','6A','AEB block family'],['Audi 80','Audi 100','Audi Coupe','Volkswagen Golf','Volkswagen Jetta','Volkswagen Passat','Volkswagen Scirocco']],
  ['audi-18t-ea113','Audi/VW 1.8T and EA113 2.0T FSI Inline-Four','1996-2015','1.8L or 2.0L turbocharged inline-four',['Audi','Volkswagen','VW','SEAT','Skoda'],['1.8T','EA113','AEB','ATW','AWM','AMB','BAM','APY','BPG','BPY','BWA','CDL'],['A3','A4','A6','TT','S3','Volkswagen GTI','Volkswagen Jetta GLI','Volkswagen Passat','Volkswagen Golf R']],
  ['audi-ea888-gen1-2','Audi/VW EA888 Generation 1 / 2 1.8T–2.0T','2008-2015','1.8L or 2.0L turbocharged direct-injection inline-four',['Audi','Volkswagen','VW','SEAT','Skoda'],['EA888 Gen 1','EA888 Gen 2','CAEB','CCTA','CBFA','CDNC','CCZA','1.8 TFSI','2.0 TFSI'],['A3','A4','A5','A6','Q3','Q5','TT','Volkswagen GTI','Volkswagen Tiguan','Volkswagen CC']],
  ['audi-ea888-gen3-4','Audi/VW EA888 Generation 3 / 4 1.8T–2.0T','2013-2026','1.8L or 2.0L turbocharged direct/dual-injection inline-four',['Audi','Volkswagen','VW','SEAT','Skoda','Porsche'],['EA888 Gen 3','EA888 Gen 4','MQB','MLB evo','CXCA','CXCB','CYMC','DLRA','DKFA','DNPA','2.0 TFSI'],['A3','A4','A5','A6','Q3','Q5','TT','S3','Volkswagen GTI','Volkswagen Golf R','Porsche Macan']],
  ['audi-ea111-ea211','Audi/VW EA111 / EA211 1.0L–1.5L TFSI','2005-2026','1.0L–1.5L turbocharged three- or four-cylinder',['Audi','Volkswagen','VW','SEAT','Skoda'],['EA111','EA211','EA211 evo','1.0 TFSI','1.2 TFSI','1.4 TFSI','1.5 TFSI','CAXA','CZEA','DADA'],['A1','A3','Q2','Volkswagen Golf','Volkswagen Jetta','Volkswagen Taos','Volkswagen Polo']],
  ['audi-legacy-inline-five','Audi Classic Inline-Five Gasoline Engines','1976-1997','1.9L–2.3L inline-five, naturally aspirated or turbocharged',['Audi','Volkswagen','VW'],['EA828','2.1 Turbo','2.2 Turbo','2.3E','MC','3B','AAN','ABY','ADU','7A','NG'],['Audi 100','Audi 200','Audi Coupe Quattro','Audi Quattro','S2','S4','S6','RS2','Volkswagen Quantum']],
  ['audi-25tfsi-five','Audi 2.5L TFSI Inline-Five','2009-2026','2.5L turbocharged direct-injection inline-five',['Audi','Volkswagen','VW'],['EA855','EA855 evo','CEPA','CTSA','DAZA','DNWA','2.5 TFSI'],['TT RS','RS3','RS Q3','Volkswagen Jetta','Volkswagen Passat']],
  ['audi-v6-12v-30v','Audi 2.6L / 2.8L / 3.0L V6 12V and 30V','1991-2008','2.6L–3.0L naturally aspirated V6',['Audi','Volkswagen','VW'],['AAH','ABC','AFC','ACK','ATQ','ASN','AVK','2.8 12V','2.8 30V','3.0 30V'],['Audi 80','Audi 90','A4','A6','A8','Cabriolet','Volkswagen Passat']],
  ['audi-27t-v6','Audi 2.7L Biturbo V6','1997-2005','2.7L twin-turbocharged V6',['Audi'],['APB','A6 2.7T','S4 2.7T','RS4 2.7T','2.7 Biturbo'],['B5 S4','C5 A6','C5 allroad','B5 RS4']],
  ['audi-ea837-v6','Audi EA837 3.0L Supercharged/Turbo V6','2009-2018','3.0L supercharged or turbocharged V6',['Audi','Volkswagen','VW','Porsche'],['EA837','3.0 TFSI','CAJA','CCBA','CGXC','CREC','CTUB'],['A6','A7','A8','Q5','Q7','S4','S5','SQ5','Volkswagen Touareg','Porsche Cayenne','Porsche Panamera']],
  ['audi-ea839-v6','Audi/Porsche EA839 2.9L / 3.0L Turbo V6','2017-2026','2.9L twin-turbo or 3.0L turbocharged V6',['Audi','Porsche','Volkswagen','VW'],['EA839','2.9 TFSI','3.0 TFSI','CWGD','DECA','DCBE','DLZA'],['A6','A7','A8','Q7','Q8','S4','S5','RS4','RS5','SQ5','Porsche Cayenne','Porsche Panamera','Porsche Macan']],
  ['audi-v8-belt-chain','Audi 3.7L / 4.2L V8 Belt and Chain-Drive Engines','1988-2011','3.6L–4.2L naturally aspirated V8',['Audi','Volkswagen','VW'],['ABH','AUX','AWN','ART','BFM','BAS','BBK','BHF','4.2 V8','3.7 V8'],['Audi V8','A6','A8','S4','S6','S8','allroad','Volkswagen Phaeton','Volkswagen Touareg']],
  ['audi-42fsi-v8','Audi 4.2L FSI V8','2005-2015','4.2L direct-injection naturally aspirated V8',['Audi'],['4.2 FSI','BAR','BVJ','CAUA','CFSA'],['A6','A8','Q7','S5','RS4','RS5','R8']],
  ['audi-ea824-v8','Audi/Porsche EA824 4.0L Twin-Turbo V8','2012-2026','4.0L twin-turbocharged direct-injection V8',['Audi','Porsche','Bentley','Lamborghini'],['EA824','4.0 TFSI','CEUC','CTGE','CWUB','DCUE','DHUB'],['S6','S7','S8','RS6','RS7','A8','SQ7','SQ8','RS Q8','Porsche Panamera','Porsche Cayenne','Bentley Continental GT','Lamborghini Urus']],
  ['audi-52fsi-v10','Audi/Lamborghini 5.2L FSI V10','2006-2024','5.2L naturally aspirated direct-injection V10',['Audi','Lamborghini'],['5.2 FSI','BUH','CEUA','CTNA','DKA','V10 FSI'],['S6','S8','R8','Lamborghini Gallardo','Lamborghini Huracan']],
  ['audi-w12','Audi/VW/Bentley W12 Gasoline Engine','2001-2020','6.0L twin-turbo or naturally aspirated W12',['Audi','Volkswagen','VW','Bentley'],['W12','6.0 W12','BHT','BTE','CEJA'],['A8 W12','Volkswagen Phaeton W12','Volkswagen Touareg W12','Bentley Continental GT','Bentley Flying Spur','Bentley Bentayga']],
  ['audi-19tdi','Audi/VW 1.9L TDI Diesel','1991-2010','1.9L turbo-diesel inline-four',['Audi','Volkswagen','VW','SEAT','Skoda'],['1.9 TDI','EA180','EA188','1Z','AHU','ALH','BEW','BRM','BKC','PD TDI'],['A3','A4','A6','Volkswagen Golf TDI','Volkswagen Jetta TDI','Volkswagen Passat TDI','Volkswagen New Beetle TDI']],
  ['audi-ea189-20tdi','Audi/VW EA189 2.0L TDI','2007-2015','2.0L common-rail turbo-diesel inline-four',['Audi','Volkswagen','VW','SEAT','Skoda'],['EA189','2.0 TDI','CBEA','CJAA','CAGA','CAHA','CKRA'],['A3 TDI','A4 TDI','A6 TDI','Q5 TDI','Volkswagen Golf TDI','Volkswagen Jetta TDI','Volkswagen Passat TDI','Volkswagen Tiguan TDI']],
  ['audi-ea288-20tdi','Audi/VW EA288 2.0L TDI','2014-2026','2.0L common-rail turbo-diesel inline-four',['Audi','Volkswagen','VW','SEAT','Skoda'],['EA288','EA288 evo','2.0 TDI','CRUA','CVCA','DEUA'],['A3 TDI','A4 TDI','A6 TDI','Q3 TDI','Q5 TDI','Volkswagen Golf TDI','Volkswagen Jetta TDI','Volkswagen Passat TDI']],
  ['audi-v6-tdi','Audi/VW 2.7L / 3.0L V6 TDI','2004-2026','2.7L or 3.0L common-rail turbo-diesel V6',['Audi','Volkswagen','VW','Porsche'],['EA896','EA897','EA897 evo','2.7 TDI','3.0 TDI','CATA','CNRB','CRCA','CVMD'],['A4 TDI','A5 TDI','A6 TDI','A7 TDI','A8 TDI','Q5 TDI','Q7 TDI','Volkswagen Touareg TDI','Porsche Cayenne Diesel']],
  ['audi-v8-tdi','Audi/VW 4.0L / 4.2L V8 TDI','2005-2020','4.0L or 4.2L twin-turbo diesel V8',['Audi','Volkswagen','VW','Porsche'],['4.0 TDI','4.2 TDI','EA898','BVN','CCFA','CKDA'],['A8 TDI','Q7 TDI','SQ7 TDI','Volkswagen Touareg V8 TDI','Porsche Cayenne S Diesel']],
  ['audi-v12-tdi','Audi Q7 6.0L V12 TDI','2008-2012','6.0L twin-turbo common-rail diesel V12',['Audi'],['V12 TDI','CCGA','6.0 TDI'],['Q7 V12 TDI']],
  ['audi-hybrid-phev','Audi TFSI e and e-hybrid Systems','2011-2026','Gasoline-electric hybrid and plug-in hybrid propulsion',['Audi','Volkswagen','VW','Porsche'],['Hybrid','PHEV','TFSI e','e-hybrid','48V MHEV'],['A3 e-tron','A6 TFSI e','A7 TFSI e','A8 TFSI e','Q5 TFSI e','Q7 TFSI e','Q8 TFSI e','Volkswagen Touareg Hybrid','Porsche Cayenne E-Hybrid']],
  ['audi-bev','Audi e-tron Battery-Electric Drive Systems','2019-2026','Battery-electric propulsion',['Audi','Porsche','Volkswagen','VW'],['EV','BEV','e-tron','PPE','J1','MEB','High Voltage'],['Audi e-tron','Q4 e-tron','Q6 e-tron','Q8 e-tron','e-tron GT','RS e-tron GT','A6 e-tron','Porsche Taycan']]
];

const base = data.engineFamilies.find((entry) => entry.id === 'mercedes-m276') || data.engineFamilies[0];
if (!base) throw new Error('Base service record not found.');

function makeRecord(def) {
  const [id, name, years, displacement, makes, codes, models] = def;
  const diesel = id.includes('tdi');
  const highVoltage = id.includes('hybrid') || id.includes('bev');
  const performance = /25tfsi|27t|42fsi|ea824|52fsi/.test(id);
  const record = structuredClone(base);
  record.id = id;
  record.engineFamily = name;
  record.engine = {
    application: 'Audi/VAG applications listed in matching hints; confirm full VIN, PR codes, engine code stamped/labelled on the vehicle, market, production date, and control-unit software.',
    years: `${years} common service range; market and platform availability vary`,
    displacement,
    configuration: highVoltage ? 'Electrified Volkswagen Group propulsion architecture; motor, inverter, battery, charger, and gearbox configuration is VIN/PR-code-specific' : diesel ? 'Audi/VW turbo-diesel architecture; injection, turbocharging, aftertreatment, and emissions generation are engine-code-specific' : performance ? 'Audi performance architecture; engine code, production revision, platform, and installation are critical identifiers' : 'Audi/VW gasoline architecture; valvetrain, induction, platform, and generation are engine-code-specific',
    induction: highVoltage ? 'Electric traction or assist system with gasoline engine where applicable' : diesel ? 'Mechanical, unit-injector, or common-rail diesel injection depending on engine code' : 'Naturally aspirated, supercharged, or turbocharged; port/direct/dual injection varies by generation',
    horsepower: 'Varies by engine code, market, software level, model/platform, and production date',
    torque: 'Varies by engine code, market, software level, model/platform, and production date',
    compression: 'Engine-code-specific; retrieve current Audi erWin/ELSA repair information',
    boreStroke: 'Engine-code-specific; do not infer from badge or displacement alone',
    oilCapacity: highVoltage && id.includes('bev') ? 'No engine oil; drive-unit fluid is VIN/gearbox-code-specific' : 'VIN/engine-code-specific; follow repair-manual fill and electronic level procedure where equipped',
    recommendedOil: highVoltage && id.includes('bev') ? 'Electric drive-unit fluid is gearbox-specific; no engine oil' : diesel ? 'Use the exact VW oil standard specified for engine code, DPF equipment, market, and service interval' : 'Use the exact VW oil standard and viscosity specified by VIN/engine code; fixed and flexible service intervals differ',
    coolant: 'Use the current VW Group coolant specification by VIN; do not identify coolant only by color, and observe multiple thermal circuits',
    firingOrder: highVoltage && id.includes('bev') ? 'Not applicable' : 'Engine-code-specific; verify cylinder numbering and firing order in erWin/ELSA',
    sparkPlugs: diesel || (highVoltage && id.includes('bev')) ? 'Not applicable; diesel glow-plug or high-voltage service is engine-specific' : 'Part number, heat range, gap policy, and replacement interval are VIN/engine-code-specific',
    notes: 'Offline shop reference. Confirm Audi erWin/ELSA repair information, TPI/TSB documents, campaigns, ODIS guided functions, component protection, coding, one-time-use hardware, and specifications by VIN.'
  };
  record.repairOrderLinks = { matchYearRange: years.split('-').map(Number), makes, engineCodes: codes, vehicleTextTokens: models };
  for (const item of record.torqueSpecs) {
    item.spec = item.spec.replace(/Mercedes-Benz WIS\/Xentry instructions|BMW AIR\/ISTA repair instructions|GM SI/g, 'Audi erWin/ELSA instructions');
    item.notes = item.notes.replace(/Mercedes-Benz|BMW\/MINI|GM/g, 'Audi/VAG');
  }
  for (const [index, procedure] of record.procedures.entries()) {
    if (index === 0) procedure.title = `${name} identification and baseline`;
    procedure.tools = procedure.tools.replace(/Mercedes-Benz Xentry-capable|BMW ISTA-capable|GM-capable/g, 'Audi ODIS-capable');
    procedure.steps = procedure.steps.map((step) => step.replace(/Mercedes-Benz WIS\/Xentry information|BMW AIR\/ISTA repair information|GM service information/g, 'Audi erWin/ELSA information').replace(/Mercedes-Benz Xentry-capable|BMW ISTA-capable|GM-capable/g, 'Audi ODIS-capable'));
  }
  record.worksheets[0].title = `${name} intake worksheet`;
  return record;
}

const records = definitions.map(makeRecord);
const ids = new Set(records.map((entry) => entry.id));
data.engineFamilies = [...data.engineFamilies.filter((entry) => !ids.has(entry.id)), ...records];
data.version = 11;
data.schema.coverage = 'GM, Ford, Toyota/Lexus, Nissan/Infiniti/Datsun, BMW/MINI, Mercedes-Benz/AMG/Maybach/smart, and Audi/VAG multi-family offline service library. Critical specifications require VIN/engine-code confirmation against current OEM information.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}

console.log(`Wrote ${data.engineFamilies.length} total families including ${records.length} Audi/VAG families.`);
