const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadDtcApi(mainPath) {
  const source = fs.readFileSync(mainPath, 'utf8');
  const mapStart = source.indexOf('const obdDtcDescriptions = {');
  const mapEnd = source.indexOf('\n};', mapStart) + 3;
  const describeStart = source.indexOf('function describeDtc(code) {');
  const decodeStart = source.indexOf('\nfunction decodeDtc(', describeStart);
  if (mapStart < 0 || mapEnd < 3 || describeStart < 0 || decodeStart < 0) {
    throw new Error(`Unable to locate the DTC library in ${mainPath}`);
  }

  const testModule = {
    exports: {},
  };
  vm.runInNewContext([
    source.slice(mapStart, mapEnd),
    source.slice(describeStart, decodeStart),
    'module.exports = { obdDtcDescriptions, describeDtc };',
  ].join('\n'), { module: testModule });
  return testModule.exports;
}

for (const appName of ['app_live_extract', 'app_extracted']) {
  const mainPath = path.join(__dirname, '..', '_private_dev', 'source', appName, 'electron', 'main.cjs');
  const { obdDtcDescriptions, describeDtc } = loadDtcApi(mainPath);
  assert.ok(Object.keys(obdDtcDescriptions).length >= 150, `${appName} catalog coverage`);
  assert.match(describeDtc('P0420'), /catalyst system efficiency/i);
  assert.match(describeDtc('P01C1'), /generic SAE range powertrain DTC/i);
  assert.match(describeDtc('P01C1'), /fuel and air metering/i);
  assert.match(describeDtc('P1234'), /manufacturer-controlled range powertrain DTC/i);
  assert.match(describeDtc('U2010'), /manufacturer-controlled range network communication DTC/i);
  assert.match(describeDtc('not-a-code'), /unrecognized diagnostic trouble code format/i);
}

console.log('DTC catalog tests passed for both app runtimes.');
