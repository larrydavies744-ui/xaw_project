(function(){
  'use strict';
  const ids={Year:'xpressive-ro-years',Make:'xpressive-ro-makes',Model:'xpressive-ro-models',Engine:'xpressive-ro-engines'};
  const clean=v=>String(v||'').trim();const lower=v=>clean(v).toLowerCase();const unique=v=>[...new Set(v.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));
  function families(){return window.XPRESSIVE_SERVICE_LIBRARY?.engineFamilies||window.XpressiveServiceLibraryData?.engineFamilies||[]}
  function field(panel,label){return [...panel.querySelectorAll('.field')].find(el=>clean(el.querySelector(':scope > span')?.textContent)===label)?.querySelector('input')||null}
  function inYear(family,year){const n=Number(year),range=family.repairOrderLinks?.matchYearRange||[];return !Number.isFinite(n)||!year||range.length<2||(n>=Number(range[0])&&n<=Number(range[1]))}
  function hasMake(family,make){return !make||(family.repairOrderLinks?.makes||[]).some(v=>lower(v)===lower(make))}
  function hasModel(family,model){if(!model)return true;return (family.repairOrderLinks?.vehicleTextTokens||[]).some(v=>lower(v)===lower(model)||lower(v).includes(lower(model))||lower(model).includes(lower(v)))}
  function setList(id,values,labeler){let list=document.getElementById(id);if(!list){list=document.createElement('datalist');list.id=id;document.body.appendChild(list)}const signature=values.map(value=>value+'|'+(labeler?.(value)||'')).join('|#|');if(list.dataset.signature===signature)return;list.dataset.signature=signature;list.innerHTML='';values.forEach(value=>{const option=document.createElement('option');option.value=value;if(labeler){const label=labeler(value);if(label)option.label=label}list.appendChild(option)})}
  function update(panel,inputs,note){
    const all=families(),year=clean(inputs.Year.value),make=clean(inputs.Make.value),model=clean(inputs.Model.value);
    const currentYear=new Date().getFullYear()+1;setList(ids.Year,Array.from({length:currentYear-1979},(_,i)=>String(currentYear-i)));
    const yearFamilies=all.filter(f=>inYear(f,year));const makes=unique(yearFamilies.flatMap(f=>f.repairOrderLinks?.makes||[]).filter(v=>lower(v)!=='gm'&&lower(v)!=='vag'));setList(ids.Make,makes);
    const makeFamilies=yearFamilies.filter(f=>hasMake(f,make));const models=unique(makeFamilies.flatMap(f=>f.repairOrderLinks?.vehicleTextTokens||[]));setList(ids.Model,models);
    const modelFamilies=makeFamilies.filter(f=>hasModel(f,model));const engineNames=unique(modelFamilies.map(f=>f.engineFamily));const map=new Map(modelFamilies.map(f=>[f.engineFamily,(f.repairOrderLinks?.engineCodes||[]).join(', ')]));setList(ids.Engine,engineNames,value=>map.get(value));
    const exactEngine=modelFamilies.find(f=>lower(f.engineFamily)===lower(inputs.Engine.value));const best=exactEngine||modelFamilies[0];
    note.innerHTML=best?`<strong>${modelFamilies.length} compatible library class${modelFamilies.length===1?'':'es'}</strong><span>Best current match: ${escapeHtml(best.engineFamily)}${map.get(best.engineFamily)?' Â· '+escapeHtml(map.get(best.engineFamily)):''}</span>`:'<strong>No stored class matched yet</strong><span>Continue entering the vehicle manually; online RO research remains available.</span>';
  }
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function enhance(){
    const heading=[...document.querySelectorAll('.panel h2')].find(h=>clean(h.textContent)==='Vehicle');const panel=heading?.closest('.panel');if(!panel)return;
    const inputs=Object.fromEntries(Object.keys(ids).map(label=>[label,field(panel,label)]));if(Object.values(inputs).some(v=>!v))return;
    let guide=panel.querySelector('.ro-vehicle-dropdown-guide');if(!guide){guide=document.createElement('div');guide.className='ro-vehicle-dropdown-guide';guide.innerHTML='<div><span>RO SERVICE-LIBRARY MATCHING</span><strong>Guided vehicle selection</strong><p>Choose from known coverage or type a value for vehicles not yet stored.</p></div><div class="ro-vehicle-match-note"></div>';const form=inputs.Year.closest('.form-grid');form.parentElement.insertBefore(guide,form)}
    const note=guide.querySelector('.ro-vehicle-match-note');
    Object.entries(inputs).forEach(([label,input])=>{input.setAttribute('list',ids[label]);input.setAttribute('autocomplete','off');input.classList.add('ro-vehicle-dropdown-input');input.title=`Choose a ${label.toLowerCase()} from the service library or type a custom value.`;if(!input.dataset.vehicleDropdownBound){input.dataset.vehicleDropdownBound='true';input.addEventListener('input',()=>update(panel,inputs,note));input.addEventListener('change',()=>update(panel,inputs,note))}});
    update(panel,inputs,note);
  }
  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});window.setInterval(enhance,1200);document.readyState==='loading'?document.addEventListener('DOMContentLoaded',enhance):enhance();
})();
