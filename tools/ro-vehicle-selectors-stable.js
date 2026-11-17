(function () {
  'use strict';
  const listIds = {
    Year: 'xpressive-ro-years', Make: 'xpressive-ro-makes', Model: 'xpressive-ro-models',
    Trim: 'xpressive-ro-trims', LicensePlate: 'xpressive-ro-license-plates', PlateState: 'xpressive-ro-plate-states',
    Engine: 'xpressive-ro-engines', Transmission: 'xpressive-ro-transmissions',
    DriveType: 'xpressive-ro-drive-types', FuelType: 'xpressive-ro-fuel-types'
  };
  const plateStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];
  const transmissions = ['Automatic','Manual','CVT','eCVT','Dual-Clutch (DCT)','Automated Manual','Single-Speed EV','2-Speed EV','Other / VIN-specific'];
  const driveTypes = ['FWD','RWD','AWD','4WD','4x4','Part-Time 4WD','Full-Time 4WD','Selectable AWD','Other / VIN-specific'];
  const fuelTypes = ['Gasoline','Diesel','E85 / Flex Fuel','Hybrid','Plug-In Hybrid','Battery Electric','Hydrogen Fuel Cell','CNG','LPG / Propane','Other'];
  const commonTrims = {
    Chevrolet: ['LS','LT','LTZ','Premier','RST','High Country','Z71','ZR2','SS'],
    GMC: ['SLE','SLT','AT4','AT4X','Denali','Elevation'], Cadillac: ['Luxury','Premium Luxury','Sport','V-Series'],
    Buick: ['Preferred','Essence','Avenir','Sport Touring'], Ford: ['S','SE','SEL','ST','ST-Line','Titanium','XLT','Lariat','King Ranch','Platinum','Raptor'],
    Lincoln: ['Standard','Reserve','Black Label'], Toyota: ['L','LE','SE','XLE','XSE','Limited','TRD Sport','TRD Off-Road','TRD Pro'],
    Lexus: ['Base','Premium','Luxury','F Sport'], Nissan: ['S','SV','SR','SL','Platinum','PRO-4X','NISMO'],
    Infiniti: ['Pure','Luxe','Sensory','Autograph','Red Sport 400'], BMW: ['Base','Sport Line','Luxury Line','M Sport','M Performance'],
    MINI: ['Cooper','Cooper S','John Cooper Works'], 'Mercedes-Benz': ['Base','Premium','Exclusive','Pinnacle','AMG Line','AMG'],
    Audi: ['Premium','Premium Plus','Prestige','S line'], Volkswagen: ['S','SE','SEL','R-Line','Autobahn'],
    Honda: ['LX','Sport','EX','EX-L','Touring','Elite','Type R'], Acura: ['Base','Technology','A-Spec','Advance','Type S'],
    Hyundai: ['SE','SEL','XRT','Limited','N Line','N'], Kia: ['LX','S','EX','SX','SX Prestige','X-Line','GT-Line','GT'],
    Subaru: ['Base','Premium','Sport','Limited','Touring','Wilderness','STI'], Jeep: ['Sport','Latitude','Limited','Trailhawk','Overland','Rubicon','Summit'],
    Ram: ['Tradesman','Big Horn','Laramie','Rebel','Limited','TRX'], Dodge: ['SXT','GT','R/T','Scat Pack','SRT Hellcat'],
    Chrysler: ['Touring','Touring L','Limited','Pinnacle'], Mazda: ['Sport','Select','Preferred','Carbon Edition','Premium','Turbo','Signature'],
    Volvo: ['Core','Plus','Ultimate','Polestar Engineered'], Tesla: ['Standard Range','Long Range','Performance','Plaid']
  };
  const clean = (value) => String(value || '').trim();
  const lower = (value) => clean(value).toLowerCase();
  const unique = (values) => [...new Set(values.filter(Boolean).map(clean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const families = () => window.XPRESSIVE_SERVICE_LIBRARY?.engineFamilies || window.XpressiveServiceLibraryData?.engineFamilies || [];
  function field(panel, label) {
    return [...panel.querySelectorAll('.field')].find((entry) => clean(entry.querySelector(':scope > span')?.textContent) === label)?.querySelector('input') || null;
  }
  function savedPlates() {
    try {
      const orders = JSON.parse(localStorage.getItem('xpressive-repair-suite-orders-v2') || '[]');
      return unique((Array.isArray(orders) ? orders : []).flatMap((order) => {
        const vehicle = order?.vehicle || {};
        return [vehicle.licensePlate, vehicle.plate, order.licensePlate];
      }));
    } catch { return []; }
  }
  function setList(id, values, labels) {
    let list = document.getElementById(id);
    if (!list) { list = document.createElement('datalist'); list.id = id; document.body.appendChild(list); }
    const signature = values.join('|');
    if (list.dataset.signature === signature) return;
    list.dataset.signature = signature;
    list.replaceChildren(...values.map((value) => {
      const option = document.createElement('option'); option.value = value;
      if (labels?.get(value)) option.label = labels.get(value);
      return option;
    }));
  }
  function matchesYear(family, year) {
    const range = family.repairOrderLinks?.matchYearRange || []; const number = Number(year);
    return !year || !Number.isFinite(number) || range.length < 2 || (number >= Number(range[0]) && number <= Number(range[1]));
  }
  function matchesMake(family, make) { return !make || (family.repairOrderLinks?.makes || []).some((value) => lower(value) === lower(make)); }
  function matchesModel(family, model) { return !model || (family.repairOrderLinks?.vehicleTextTokens || []).some((value) => lower(value) === lower(model)); }
  function refresh(inputs) {
    const all = families(); const year = clean(inputs.Year.value); const make = clean(inputs.Make.value); const model = clean(inputs.Model.value);
    const newest = new Date().getFullYear() + 1;
    setList(listIds.Year, Array.from({ length: newest - 1979 }, (_entry, index) => String(newest - index)));
    const byYear = all.filter((family) => matchesYear(family, year));
    setList(listIds.Make, unique(byYear.flatMap((family) => family.repairOrderLinks?.makes || []).filter((value) => !['gm','vag'].includes(lower(value)))));
    const byMake = byYear.filter((family) => matchesMake(family, make));
    setList(listIds.Model, unique(byMake.flatMap((family) => family.repairOrderLinks?.vehicleTextTokens || [])));
    const resolvedMake = Object.keys(commonTrims).find((value) => lower(value) === lower(make));
    setList(listIds.Trim, unique([...(resolvedMake ? commonTrims[resolvedMake] : []), 'Base','Standard','Premium','Limited','Sport']));
    setList(listIds.LicensePlate, savedPlates());
    setList(listIds.PlateState, plateStates);
    setList(listIds.Transmission, transmissions);
    setList(listIds.DriveType, driveTypes);
    setList(listIds.FuelType, fuelTypes);
    if (inputs.Engine) {
      const byModel = byMake.filter((family) => matchesModel(family, model));
      const engines = unique(byModel.map((family) => family.engineFamily));
      const codes = new Map(byModel.map((family) => [family.engineFamily, (family.repairOrderLinks?.engineCodes || []).join(', ')]));
      setList(listIds.Engine, engines, codes);
    }
  }
  function enhance() {
    const heading = [...document.querySelectorAll('.panel h2')].find((entry) => clean(entry.textContent) === 'Vehicle');
    const panel = heading?.closest('.panel'); if (!panel) return false;
    const inputs = {
      Year: field(panel, 'Year'), Make: field(panel, 'Make'), Model: field(panel, 'Model'), Trim: field(panel, 'Trim'),
      LicensePlate: field(panel, 'License Plate'), PlateState: field(panel, 'Plate State'), Engine: field(panel, 'Engine'),
      Transmission: field(panel, 'Transmission'), DriveType: field(panel, 'Drive Type'), FuelType: field(panel, 'Fuel Type')
    };
    if (!inputs.Year || !inputs.Make || !inputs.Model || !inputs.Trim) return false;
    Object.entries(inputs).forEach(([label, input]) => {
      if (!input) return;
      input.setAttribute('list', listIds[label]); input.setAttribute('autocomplete', 'off');
      const displayLabel = label.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
      input.title = `Select a ${displayLabel} or enter a custom value.`;
      if (!input.dataset.xpressiveVehicleSelector) {
        input.dataset.xpressiveVehicleSelector = 'true';
        input.addEventListener('input', () => refresh(inputs));
        input.addEventListener('change', () => refresh(inputs));
      }
    });
    refresh(inputs); return true;
  }
  function scheduleEnhance() { [0, 80, 220, 500].forEach((delay) => window.setTimeout(enhance, delay)); }
  document.addEventListener('click', (event) => {
    const label = clean(event.target?.closest?.('button')?.innerText).toLowerCase();
    if (label === 'work order' || label.includes('intake')) scheduleEnhance();
  }, true);
  document.addEventListener('xpressive:workspace-view', scheduleEnhance);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleEnhance, { once: true });
  else scheduleEnhance();
})();
