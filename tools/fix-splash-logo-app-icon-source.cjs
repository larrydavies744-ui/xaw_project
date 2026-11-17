const fs=require('fs'),path=require('path');
for(const name of ['app_live_extract','app_extracted']){
 const file=path.join(__dirname,'..','_private_dev','source',name,'scripts','prepare-release-branding.cjs');
 let source=fs.readFileSync(file,'utf8');
 if(!source.includes('Splash uploads intentionally do not alter')){
  const pattern=/  const resolvedIconSourcePath = resolveProfileAssetPath\(profileFilePath, brandingProfile\.splashLogoPath\);\r?\n  const inlineLogoBuffer = bufferFromDataUrl\(brandingProfile\.logoDataUrl\);\r?\n  const hasCustomIconSource = Boolean\(resolvedIconSourcePath && fs\.existsSync\(resolvedIconSourcePath\)\);/;
  if(!pattern.test(source))throw new Error(`App icon source block not found in ${file}`);
  source=source.replace(pattern,"  // Splash uploads intentionally do not alter the executable, shortcut, or Store icon.\n  const resolvedIconSourcePath = '';\n  const inlineLogoBuffer = null;\n  const hasCustomIconSource = false;");fs.writeFileSync(file,source);
 }
 console.log(`Protected app icon in ${file}`);
}
