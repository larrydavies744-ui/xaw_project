const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');
function replaceExactlyOnce(source, previous, next, label) {
 const first=source.indexOf(previous);
 if(first<0||source.indexOf(previous,first+previous.length)>=0)throw new Error(`Unable to safely update scanner autofill ${label}.`);
 return source.slice(0,first)+next+source.slice(first+previous.length);
}
function patchScannerAutofill(bundlePath) {
 let source=fs.readFileSync(bundlePath,'utf8');
 if(source.includes('s.detectedTrim||""'))return;
 source=replaceExactlyOnce(source,'L=s.detectedModel.trim(),Z=s.ignitionType===','L=s.detectedModel.trim(),T=String(s.detectedTrim||"").trim(),E=String(s.detectedEngine||"").trim(),R=String(s.detectedTransmission||"").trim(),Q=String(s.detectedDriveType||"").trim(),F=String(s.detectedFuelType||"").trim(),Z=s.ignitionType===','detected vehicle fields');
 source=replaceExactlyOnce(source,'s.ignitionType==="spark"?"Gasoline":"",ye=p.vehicle','s.ignitionType==="spark"?"Gasoline":F,ye=p.vehicle','detected fuel fallback');
 source=replaceExactlyOnce(source,'if(!h&&!v&&!M&&!L&&!Z)return!1;','if(!h&&!v&&!M&&!L&&!T&&!E&&!R&&!Q&&!Z)return!1;','empty data guard');
 source=replaceExactlyOnce(source,'L&&(Ne||!ye.model.trim())&&ye.model!==L&&(be.model=L,Je=!0),Z&&','L&&(Ne||!ye.model.trim())&&ye.model!==L&&(be.model=L,Je=!0),T&&(Ne||!String(ye.trim||"").trim())&&ye.trim!==T&&(be.trim=T,Je=!0),E&&(Ne||!String(ye.engine||"").trim())&&ye.engine!==E&&(be.engine=E,Je=!0),R&&(Ne||!String(ye.transmission||"").trim())&&ye.transmission!==R&&(be.transmission=R,Je=!0),Q&&(Ne||!String(ye.driveType||"").trim())&&ye.driveType!==Q&&(be.driveType=Q,Je=!0),Z&&','RO field assignments');
 fs.writeFileSync(bundlePath,source,'utf8');
}
for(const name of ['app_live_extract','app_extracted']){
 const dist=path.join(root,'_private_dev','source',name,'dist');
 fs.copyFileSync(path.join(__dirname,'scanner-upgrade-runtime.js'),path.join(dist,'diagnostics-upgrade.js'));
 fs.copyFileSync(path.join(__dirname,'scanner-upgrade-runtime.css'),path.join(dist,'diagnostics-upgrade.css'));
 const assetsPath=path.join(dist,'assets');
 const appBundles=fs.readdirSync(assetsPath).filter(file=>/^index-.*\.js$/.test(file));
 if(!appBundles.length)throw new Error(`No application bundle found in ${assetsPath}`);
 appBundles.forEach(file=>patchScannerAutofill(path.join(assetsPath,file)));
 const htmlPath=path.join(dist,'index.html');let html=fs.readFileSync(htmlPath,'utf8');
 if(!html.includes('diagnostics-upgrade.css'))html=html.replace('<link rel="stylesheet" href="./print-preview.css">','<link rel="stylesheet" href="./print-preview.css">\n    <link rel="stylesheet" href="./diagnostics-upgrade.css">');
 if(!html.includes('diagnostics-upgrade.js'))html=html.replace('<script src="./print-preview.js"></script>','<script src="./print-preview.js"></script>\n    <script src="./diagnostics-upgrade.js"></script>');
 fs.writeFileSync(htmlPath,html);console.log(`Installed scanner upgrade in ${dist}`);
}
