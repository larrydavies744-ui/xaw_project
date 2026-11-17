(function(){
  'use strict';
  const api=window.desktopApi;if(!api?.setSplashLogo)return;
  function updateCopy(){
    document.querySelectorAll('.field-help').forEach(el=>{if(/use across the dashboard, printouts, and packaged desktop branding/i.test(el.textContent||''))el.textContent='Upload a PNG, JPG, WebP, or SVG logo for the startup splash screen only. The splash artwork, theme, desktop icon, dashboard, and printed documents remain unchanged. The new logo appears on the next app launch.'});
    document.querySelectorAll('.field.full-width').forEach(field=>{const title=field.querySelector(':scope > span');if(title?.textContent?.trim()==='Logo')title.textContent='Splash Screen Logo'});
    document.querySelectorAll('button').forEach(button=>{if(button.textContent.trim()==='Upload logo')button.textContent='Upload splash logo';if(button.textContent.trim()==='Clear logo')button.textContent='Clear splash logo'});
  }
  document.addEventListener('change',async event=>{const input=event.target;if(!(input instanceof HTMLInputElement)||input.type!=='file'||!String(input.accept).includes('image/'))return;const file=input.files?.[0];if(!file)return;if(file.size>5*1024*1024){window.alert('Splash logo must be 5 MB or smaller.');return}const reader=new FileReader();reader.onload=async()=>{try{await api.setSplashLogo({dataUrl:String(reader.result||''),fileName:file.name});window.alert('Splash screen logo saved. It will appear the next time the app starts.')}catch(error){window.alert('Unable to save splash logo: '+(error?.message||error))}};reader.readAsDataURL(file)},true);
  document.addEventListener('click',async event=>{const button=event.target.closest('button');if(!button||button.textContent.trim()!=='Clear splash logo')return;try{await api.setSplashLogo({dataUrl:'',fileName:''})}catch(error){window.alert('Unable to clear splash logo: '+(error?.message||error))}},true);
  new MutationObserver(updateCopy).observe(document.documentElement,{childList:true,subtree:true});updateCopy();
})();
