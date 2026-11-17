const fs=require('fs'),path=require('path');
const replacement=[
"  function scoreEngineForRo(family, roContext) {",
"    const text = roContext.text || '';",
"    const normalizedText = ' ' + text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\\s+/g, ' ').trim() + ' ';",
"    const hints = family.repairOrderLinks || {};",
"    const hits = [];",
"    let score = 0;",
"    const containsToken = (token) => {",
"      const value = String(token || '').trim().toLowerCase();",
"      if (!value) return false;",
"      const normalized = value.replace(/[^a-z0-9]+/g, ' ').replace(/\\s+/g, ' ').trim();",
"      return normalized && (normalized.length <= 4 ? normalizedText.includes(' ' + normalized + ' ') : text.includes(value));",
"    };",
"    (hints.engineCodes || []).forEach((token) => { if (containsToken(token)) { score += 12; hits.push('engine ' + token); } });",
"    (hints.vehicleTextTokens || []).forEach((token) => { if (containsToken(token)) { score += 4; hits.push(token); } });",
"    (hints.makes || []).forEach((token) => { if (containsToken(token)) { score += 2; hits.push(token); } });",
"    const year = Number(roContext.order?.vehicle?.year || roContext.order?.vehicleYear || roContext.order?.year);",
"    const range = hints.matchYearRange || [];",
"    if (Number.isFinite(year) && range.length >= 2 && year >= Number(range[0]) && year <= Number(range[1])) { score += 1; hits.push('year ' + year); }",
"    return { score, hits: uniqueValues(hits) };",
"  }",
"",
].join('\n');
for(const name of ['app_live_extract','app_extracted']){
 const file=path.join(__dirname,'..','_private_dev','source',name,'dist','service-library-ui.js');let s=fs.readFileSync(file,'utf8');
 const start=s.indexOf('  function scoreEngineForRo(family, roContext) {');const end=s.indexOf('  function copyRoLink(',start);
 if(start<0||end<0)throw new Error(`Matcher boundaries not found in ${file}`);s=s.slice(0,start)+replacement+s.slice(end);fs.writeFileSync(file,s);console.log(`Repaired matcher in ${file}`);
}
