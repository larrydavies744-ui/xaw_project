const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist'),
  path.join(root, '_private_dev', 'source', 'app_extracted', 'dist')
];
const data = JSON.parse(fs.readFileSync(path.join(dirs[0], 'service-library-data.json'), 'utf8'));

const definitions = [
  ['mercedes-m102-m103','Mercedes-Benz M102 / M103 Gasoline Engines','1980-1993','1.8L–3.0L inline-four or inline-six',['Mercedes-Benz','Mercedes'],['M102','M102.982','M103','M103.980','M103.983'],['190E','230E','260E','300E','300SE','W201','W123','W124','W126']],
  ['mercedes-m104','Mercedes-Benz M104 DOHC Inline-Six','1989-1999','2.8L, 3.0L, or 3.2L inline-six',['Mercedes-Benz','Mercedes'],['M104','M104.980','M104.990','M104.992','M104.995'],['280E','300E-24','E280','E320','S320','SL320','C36 AMG','W124','W140','R129']],
  ['mercedes-m111','Mercedes-Benz M111 Inline-Four','1992-2006','1.8L–2.3L inline-four, naturally aspirated or supercharged',['Mercedes-Benz','Mercedes'],['M111','M111.920','M111.940','M111.951','M111.955','Kompressor'],['C180','C200','C230 Kompressor','E200','E230','SLK200','SLK230','CLK200','W202','W203','W210']],
  ['mercedes-m112-m113','Mercedes-Benz M112 V6 / M113 V8','1997-2012','2.4L–3.7L V6 or 4.3L–5.5L V8',['Mercedes-Benz','Mercedes','AMG','Chrysler'],['M112','M112.912','M112.946','M113','M113.940','M113.980','M113K'],['C240','C320','E320','ML320','SLK320','E430','E500','S500','ML500','E55 AMG','SL55 AMG','G55 AMG','W203','W210','W211','W220']],
  ['mercedes-m116-m117','Mercedes-Benz M116 / M117 V8','1969-1991','3.5L–5.6L V8',['Mercedes-Benz','Mercedes'],['M116','M116.960','M117','M117.960','M117.968'],['280SE 3.5','350SL','380SL','450SL','500SL','560SL','450SEL','560SEL','W108','W116','W126','R107']],
  ['mercedes-m119','Mercedes-Benz M119 DOHC V8','1989-1999','4.2L or 5.0L V8',['Mercedes-Benz','Mercedes','AMG'],['M119','M119.960','M119.970','M119.974','M119.980'],['400E','E420','500E','E500','S420','S500','SL500','W124','W140','R129']],
  ['mercedes-m120','Mercedes-Benz M120 V12','1991-2002','6.0L–7.3L V12',['Mercedes-Benz','Mercedes','AMG','Pagani'],['M120','M120.980','M120.982','M120.983'],['600SEL','S600','600SL','SL600','CL600','W140','R129','Pagani Zonda']],
  ['mercedes-m137-m275-m279','Mercedes-Benz M137 / M275 / M279 V12','1998-2026','5.5L–6.3L V12, naturally aspirated or twin-turbo',['Mercedes-Benz','Mercedes','AMG','Maybach'],['M137','M275','M275.950','M285','M279','M279.980'],['S600','CL600','SL600','S65 AMG','CL65 AMG','SL65 AMG','Maybach 57','Maybach 62','Mercedes-Maybach S680']],
  ['mercedes-m271','Mercedes-Benz M271 Inline-Four','2002-2015','1.6L or 1.8L inline-four, supercharged or turbocharged',['Mercedes-Benz','Mercedes'],['M271','M271.820','M271.860','M271.940','M271 EVO','Kompressor','CGI'],['C180','C200','C230','E200','E250','SLK200','CLK200','W203','W204','W212']],
  ['mercedes-m272-m273','Mercedes-Benz M272 V6 / M273 V8','2004-2015','2.5L–3.5L V6 or 4.7L–5.5L V8',['Mercedes-Benz','Mercedes'],['M272','M272.920','M272.965','M273','M273.960','M273.968'],['C230','C280','C300','C350','E350','ML350','S400','E500','S550','ML550','GL550','W204','W211','W212','W221']],
  ['mercedes-m270-m274','Mercedes-Benz M270 / M274 Turbo Inline-Four','2011-2020','1.6L or 2.0L turbocharged inline-four',['Mercedes-Benz','Mercedes','Infiniti'],['M270','M270.910','M270.920','M274','M274.910','M274.920','M274 DE20 AL'],['A180','A250','CLA250','GLA250','C300','E300','GLC300','SLC300','Infiniti Q50 2.0t','W205','W212','W213']],
  ['mercedes-m260-m264','Mercedes-Benz M260 / M264 Modular Inline-Four','2017-2026','1.3L or 2.0L turbocharged inline-four with 48V integration on selected models',['Mercedes-Benz','Mercedes'],['M260','M260.920','M264','M264.915','M264.920','EQ Boost'],['A220','A250','CLA250','GLA250','C300','E350','GLC300','CLE300','W206','W213']],
  ['mercedes-m133-m139-amg','Mercedes-AMG M133 / M139 Turbo Inline-Four','2013-2026','2.0L high-performance turbocharged inline-four',['Mercedes-Benz','Mercedes','AMG'],['M133','M133.980','M139','M139.980','M139l'],['A45 AMG','CLA45 AMG','GLA45 AMG','C43 AMG','SL43 AMG','AMG GT 43']],
  ['mercedes-m276','Mercedes-Benz M276 V6','2010-2020','3.0L or 3.5L V6, naturally aspirated or twin-turbo',['Mercedes-Benz','Mercedes','Infiniti'],['M276','M276.820','M276.821','M276.952','M276 DELA30'],['C350','E350','E400','E450','S400','S450','ML350','GLE400','GLS450','SL400','Infiniti Q50','W205','W212','W213','W222']],
  ['mercedes-m256','Mercedes-Benz M256 Turbocharged Inline-Six','2017-2026','3.0L turbocharged inline-six with 48V integrated starter-generator',['Mercedes-Benz','Mercedes','AMG','Maybach'],['M256','M256.930','M256.940','M256M','EQ Boost'],['E450','S500','S580e','CLS450','GLE450','GLS450','AMG 53','Mercedes-Maybach S480']],
  ['mercedes-m278-m157','Mercedes-Benz M278 / AMG M157 Twin-Turbo V8','2010-2020','4.7L or 5.5L twin-turbo V8',['Mercedes-Benz','Mercedes','AMG'],['M278','M278.922','M278.928','M157','M157.982','M157.984'],['E550','S550','CL550','CLS550','GL550','ML550','E63 AMG','S63 AMG','CLS63 AMG','GLS63 AMG','W212','W221','W222']],
  ['mercedes-m176-m177-m178','Mercedes-Benz/AMG M176 / M177 / M178 Twin-Turbo V8','2014-2026','4.0L twin-turbo V8',['Mercedes-Benz','Mercedes','AMG','Aston Martin'],['M176','M176.980','M177','M177.980','M178','M178.980'],['S560','S580','GLE580','GLS580','G550','AMG C63','AMG E63','AMG GT','AMG G63','Aston Martin DB11','Vantage']],
  ['mercedes-m156','Mercedes-AMG M156 / M159 Naturally Aspirated V8','2006-2015','6.2L high-performance V8',['Mercedes-Benz','Mercedes','AMG'],['M156','M156.980','M156.985','M159','M159.980'],['C63 AMG','E63 AMG','S63 AMG','ML63 AMG','CLK63 AMG','SL63 AMG','SLS AMG']],
  ['mercedes-om601-om606','Mercedes-Benz OM601–OM606 Diesel Engines','1983-2001','2.0L–3.0L inline-four, five, or six-cylinder diesel',['Mercedes-Benz','Mercedes'],['OM601','OM602','OM603','OM604','OM605','OM606','OM606.962'],['190D','250D','300D','E300 Diesel','E300 Turbodiesel','S350 Turbodiesel','G300 Diesel','W201','W124','W210']],
  ['mercedes-om611-om646','Mercedes-Benz OM611 / OM612 / OM613 / OM647 / OM648 / OM646 CDI','1998-2010','2.1L–3.2L common-rail turbo-diesel inline-four, five, or six',['Mercedes-Benz','Mercedes','Dodge','Freightliner','Jeep'],['OM611','OM612','OM613','OM646','OM647','OM648','CDI'],['C220 CDI','E270 CDI','E320 CDI','Sprinter','Dodge Sprinter','Jeep Grand Cherokee CRD','W203','W210','W211']],
  ['mercedes-om642','Mercedes-Benz OM642 3.0L V6 BlueTEC Diesel','2005-2023','3.0L common-rail turbo-diesel V6',['Mercedes-Benz','Mercedes','Dodge','Freightliner','Jeep'],['OM642','OM642.820','OM642.850','OM642.920','BlueTEC','CRD'],['E320 BlueTEC','E350 BlueTEC','ML320 CDI','GL320 CDI','GLE350d','GLS350d','Sprinter','Dodge Sprinter','Jeep Grand Cherokee CRD']],
  ['mercedes-om651','Mercedes-Benz OM651 Four-Cylinder Diesel','2008-2020','1.8L or 2.1L common-rail turbo-diesel inline-four',['Mercedes-Benz','Mercedes','Infiniti'],['OM651','OM651.911','OM651.921','OM651.924','BlueTEC'],['C220d','E220d','GLK250 BlueTEC','GLC250d','Sprinter','Metris','Infiniti Q50 2.2d']],
  ['mercedes-om654-om656','Mercedes-Benz OM654 / OM656 Modular Diesel','2016-2026','2.0L inline-four or 2.9L inline-six turbo-diesel',['Mercedes-Benz','Mercedes'],['OM654','OM654.920','OM654M','OM656','OM656.929'],['C220d','E220d','E300d','S350d','S400d','GLE300d','GLE450d','GLS450d','Sprinter']],
  ['mercedes-smart-engines','smart Gasoline Engines 0.6L–1.0L and Turbo','1998-2020','0.6L–1.0L three-cylinder gasoline engine',['smart','Mercedes-Benz','Mercedes'],['M160','M132','M281','3B21','3B20','smart engine'],['smart fortwo','smart forfour','Roadster','W450','W451','W453']],
  ['mercedes-hybrid-phev','Mercedes-Benz EQ Boost, Hybrid, and Plug-In Hybrid Systems','2009-2026','Gasoline/diesel-electric hybrid propulsion',['Mercedes-Benz','Mercedes','AMG','Maybach'],['Hybrid','PHEV','EQ Boost','EQ Power','48V','ISG'],['S400 Hybrid','E300 BlueTEC Hybrid','C350e','C300e','E350e','S580e','GLE450e','AMG GT 63 S E Performance','AMG C63 S E Performance']],
  ['mercedes-eq-bev','Mercedes-Benz EQ and smart Battery-Electric Drive Systems','2010-2026','Battery-electric propulsion',['Mercedes-Benz','Mercedes','AMG','Maybach','smart'],['EV','BEV','EQ','EVA2','MMA','High Voltage'],['B-Class Electric Drive','EQB','EQA','EQC','EQE','EQS','EQS SUV','EQE SUV','G 580 with EQ Technology','smart electric drive','smart EQ fortwo']]
];

const base = data.engineFamilies.find((entry) => entry.id === 'bmw-n54-n55-six') || data.engineFamilies[0];
if (!base) throw new Error('Base service record not found.');

function makeRecord(def) {
  const [id, name, years, displacement, makes, codes, models] = def;
  const diesel = id.includes('om') || id.includes('diesel');
  const highVoltage = id.includes('hybrid') || id.includes('bev');
  const amg = id.includes('amg') || id.includes('m156') || id.includes('m176-m177-m178') || id.includes('m278-m157');
  const record = structuredClone(base);
  record.id = id;
  record.engineFamily = name;
  record.engine = {
    application: 'Mercedes-Benz/AMG/Maybach/smart applications listed in matching hints; confirm full VIN, model/chassis series, engine number, market, control-unit software, and datacard.',
    years: `${years} common service range; market and chassis availability vary`,
    displacement,
    configuration: highVoltage ? 'Electrified propulsion architecture; exact combustion engine, electric machine, power electronics, battery, and transmission configuration is VIN-specific' : diesel ? 'Mercedes-Benz diesel architecture; injection, turbocharging, and emissions generation are engine-number-specific' : amg ? 'Mercedes-AMG performance architecture; engine variant, production revision, and chassis installation are critical identifiers' : 'Mercedes-Benz gasoline architecture; valvetrain, induction, and production modification status are engine-number-specific',
    induction: highVoltage ? 'Electric traction or assist system with combustion engine where applicable' : diesel ? 'Mechanical, inline-pump, or common-rail diesel injection depending on engine family' : 'Naturally aspirated, supercharged, or turbocharged; port/direct injection varies by engine generation',
    horsepower: 'Varies by engine number, market, calibration, model/chassis series, and production date',
    torque: 'Varies by engine number, market, calibration, model/chassis series, and production date',
    compression: 'Engine-number-specific; retrieve current Mercedes-Benz WIS/Xentry information',
    boreStroke: 'Engine-number-specific; do not infer from trunk badge or displacement alone',
    oilCapacity: highVoltage && id.includes('bev') ? 'No engine oil; electric drive-unit fluid is VIN-specific' : 'VIN/engine-number-specific; follow WIS fill and electronic level procedure where equipped',
    recommendedOil: highVoltage && id.includes('bev') ? 'Electric drive-unit fluid is model-specific; no engine oil' : diesel ? 'Mercedes-Benz sheet-approved diesel oil by VIN, emissions system, market, and temperature' : 'Use the Mercedes-Benz operating-fluid sheet approval and viscosity specified for the VIN; AMG requirements may differ',
    coolant: 'Use the current Mercedes-Benz operating-fluid sheet coolant approval for the VIN; 48V, hybrid, EV, and turbo vehicles may use multiple circuits',
    firingOrder: highVoltage && id.includes('bev') ? 'Not applicable' : 'Engine-number-specific; verify cylinder numbering and firing order in WIS/Xentry',
    sparkPlugs: diesel || (highVoltage && id.includes('bev')) ? 'Not applicable; diesel glow-plug or high-voltage service is engine-specific' : 'Part number, installation procedure, and replacement interval are VIN/engine-number-specific',
    notes: 'Offline shop reference. Confirm current Mercedes-Benz WIS/Xentry procedures, TIPS documents, campaigns, guided tests, SCN coding, one-time-use hardware, operating-fluid sheets, and specifications by VIN.'
  };
  record.repairOrderLinks = { matchYearRange: years.split('-').map(Number), makes, engineCodes: codes, vehicleTextTokens: models };
  for (const item of record.torqueSpecs) {
    item.spec = item.spec.replace(/BMW AIR\/ISTA repair instructions|Nissan\/Infiniti service manual|GM SI/g, 'Mercedes-Benz WIS/Xentry instructions');
    item.notes = item.notes.replace(/BMW\/MINI|Nissan\/Infiniti|GM/g, 'Mercedes-Benz');
  }
  for (const [index, procedure] of record.procedures.entries()) {
    if (index === 0) procedure.title = `${name} identification and baseline`;
    procedure.tools = procedure.tools.replace(/BMW ISTA-capable|Nissan CONSULT-capable|GM-capable/g, 'Mercedes-Benz Xentry-capable');
    procedure.steps = procedure.steps.map((step) => step.replace(/BMW AIR\/ISTA repair information|Nissan\/Infiniti service information|GM service information/g, 'Mercedes-Benz WIS/Xentry information').replace(/BMW ISTA-capable|Nissan CONSULT-capable|GM-capable/g, 'Mercedes-Benz Xentry-capable'));
  }
  record.worksheets[0].title = `${name} intake worksheet`;
  return record;
}

const records = definitions.map(makeRecord);
const ids = new Set(records.map((entry) => entry.id));
data.engineFamilies = [...data.engineFamilies.filter((entry) => !ids.has(entry.id)), ...records];
data.version = 10;
data.schema.coverage = 'GM, Ford, Toyota/Lexus, Nissan/Infiniti/Datsun, BMW/MINI, and Mercedes-Benz/AMG/Maybach/smart multi-family offline service library. Critical specifications require VIN/engine-code confirmation against current OEM information.';

const json = `${JSON.stringify(data, null, 2)}\n`;
const js = `window.XpressiveServiceLibraryData = ${JSON.stringify(data, null, 2)};\n`;
for (const dir of dirs) {
  fs.writeFileSync(path.join(dir, 'service-library-data.json'), json);
  fs.writeFileSync(path.join(dir, 'service-library-data.js'), js);
}

console.log(`Wrote ${data.engineFamilies.length} total families including ${records.length} Mercedes-Benz/AMG/Maybach/smart families.`);
