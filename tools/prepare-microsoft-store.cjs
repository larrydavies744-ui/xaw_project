const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');const out=path.join(root,'_private_dev','microsoft-store-submission');const assets=path.join(out,'assets');fs.mkdirSync(assets,{recursive:true});
const appRoot=path.join(root,'_private_dev','source','app_live_extract');const sharp=require(path.join(appRoot,'node_modules','sharp'));
const icon=path.join(appRoot,'build','icons','app-icon.png');
async function logo(size,name){const pad=Math.round(size*.12),inner=size-pad*2;const resized=await sharp(icon).resize(inner,inner,{fit:'contain'}).png().toBuffer();await sharp({create:{width:size,height:size,channels:4,background:'#07111f'}}).composite([{input:resized,left:pad,top:pad}]).png().toFile(path.join(assets,name));}
function write(name,text){fs.writeFileSync(path.join(out,name),text.trim()+'\n');}
function hash(file){return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();}
(async()=>{
 await Promise.all([logo(300,'store-logo-300.png'),logo(150,'store-logo-150.png'),logo(50,'store-logo-50.png'),logo(512,'store-logo-512.png')]);
 const exe=path.join(root,'Xpressive Autoworks Engineering Repair Suite','Xpressive Autoworks Engineering Repair Suite.exe');
 const submission={schemaVersion:1,preparedAt:new Date().toISOString(),product:{requestedName:'Xpressive Autoworks Engineering Repair Suite',category:'Business > Automotive',delivery:'Digital download',pricingModel:'Paid — one-time purchase',requestedBasePrice:{amount:499.99,currency:'USD',taxTreatment:'Base price before applicable sales/use/VAT taxes. Microsoft Store calculates and displays applicable tax by purchaser market.'},trial:'None',audience:'Public',discoverability:'Searchable and direct link',markets:['United States initially; add other markets only after pricing, tax, support and legal review'],architecture:['x64'],minimumOS:'Windows 10 version 1809 or later (confirm during certification)',hardware:['Mouse and keyboard','Internet connection for online research and updates','Compatible ELM327 or J2534 adapter only for vehicle scanning features']},package:{submissionRoute:'MSI/EXE desktop app listing',currentExe:exe,currentExeSha256:hash(exe),currentExeSigned:false,requiredArtifact:'Offline, silently installable, CA-signed x64 EXE installer',versionedHttpsUrl:'REQUIRED_BEFORE_SUBMISSION'},partnerCenter:{reservedProductName:'REQUIRED',publisherDisplayName:'REQUIRED',sellerContact:'REQUIRED',supportUrl:'REQUIRED',privacyPolicyUrl:'REQUIRED',websiteUrl:'REQUIRED',payoutAndTaxProfile:'REQUIRED',ageRating:'Complete IARC questionnaire accurately'},notes:['Partner Center must confirm that USD 499.99 is an available paid price/tier. Select the closest acceptable tier only with owner approval.','Do not write “plus tax” into the numeric price field; tax is calculated/displayed according to Store market and account settings.']};
 write('submission-profile.json',JSON.stringify(submission,null,2));
 write('listing-en-US.md',`# Microsoft Store listing — en-US

Product name: Xpressive Autoworks Engineering Repair Suite

Short description:
Run repair orders, inspections, invoices, vehicle diagnostics and technician service-reference workflows from one Windows desktop workspace built for independent automotive repair operations.

Description:
Xpressive Autoworks Engineering Repair Suite brings the daily repair-shop workflow into one Windows application. Create and manage repair orders, document inspections, prepare labor and parts invoices, organize scheduling and customer history, and print professional service documents.

The integrated diagnostic workspace works with compatible ELM327 and J2534 interfaces for supported generic OBD-II and passthru operations. Technicians can review stored, pending and permanent diagnostic trouble codes; monitor live data; capture freeze-frame and emissions-readiness information; compare pre-scan and post-scan results; and research vehicle-specific service functions using current OEM information.

The service library contains manufacturer-family workflows and routes VIN-, engine- and option-specific values to current online service information. Procedures clearly distinguish general guidance from specifications that must be confirmed for the exact vehicle.

This is professional workflow and reference software. It does not replace technician training, vehicle-manufacturer service information, required safety equipment or an OEM-authorized programming subscription. Diagnostic and service-function availability depends on the vehicle, interface, driver and applicable service access.

Product features:
Repair-order creation and local history
50-point digital vehicle inspections
Labor, parts, tax and shop-supply invoicing
Scheduling and shop workflow boards
ELM327 and J2534 scanner connectivity
Stored, pending and permanent DTC review
Live data, freeze-frame and readiness information
Pre-scan and post-scan comparison
RO-aware online diagnostic research
Manufacturer-family service workflows
Brake, tune-up, starting and charging procedures
GM internal-engine and DNJ rebuild-kit workflows
Print and PDF-ready customer documents
Customer-safe in-app update center

Additional system requirements:
Internet access is needed for online research and application updates.
A compatible vehicle interface and its vendor driver are required for scanner functions.
J2534 enhanced functions may require OEM subscriptions, credentials or security access.
Vehicle service must be performed by qualified personnel using current OEM information.

First submission: leave “What’s new” blank in Partner Center.`);
 write('certification-notes.md',`# Notes for Microsoft certification

The app starts without account creation. Core repair-order, inspection, invoice, scheduling and service-library screens can be evaluated without connecting to a vehicle.

Scanner testing without hardware: open Diagnostics. The screen identifies that an adapter must be connected and remains functional without one.

Scanner testing with hardware: install the adapter vendor driver, connect a supported ELM327 serial/Wi-Fi interface or J2534 passthru, switch vehicle ignition on and select the interface. Actual results vary by vehicle capability.

No guessed bidirectional requests are sent. Manufacturer-specific service functions retrieve the exact OEM procedure and remain safety-gated unless a supported command is known.

The app stores shop and repair-order data locally on the Windows device. Internet features may open external research, Microsoft Copilot, OEM service-information or update endpoints at the user’s request.

Before submission, add exact silent-install and uninstall commands for the signed installer here, plus any certification-only credentials if later introduced.`);
 write('privacy-policy-draft.md',`# Privacy Policy Draft — legal review and public HTTPS hosting required

Effective date: [REQUIRED]
Publisher legal name and address: [REQUIRED]
Privacy contact: [REQUIRED]

Xpressive Autoworks Engineering Repair Suite processes information entered by a repair business, which may include customer contact details, vehicle identification numbers, mileage, repair-order details, inspection findings, diagnostic trouble codes, invoices and technician notes.

Application records are stored locally on the Windows device unless the user deliberately exports, prints, shares or opens an online feature. The publisher does not receive locally stored repair-order information merely because the application is installed.

When a user requests online diagnostic or service research, the application may send or place vehicle and repair context into an external browser or selected research service. The workflow is designed to exclude customer contact details. External services operate under their own privacy terms. Users should review information before sending it.

Application update checks may transmit standard network information and the installed application version to the configured update host. Microsoft Store acquisition, payment, telemetry and update activity is governed by Microsoft’s applicable terms and privacy statement.

Users control the information they enter and may edit or delete local repair orders using application controls. Exported files and backups must be managed and protected by the repair business. Uninstalling the application may not remove separately exported documents or all application data; document exact removal behavior before publishing this policy.

The application is intended for automotive businesses and qualified personnel, not children. It does not sell personal information. Complete jurisdiction-specific disclosure, retention, security, access/deletion request and service-provider sections with legal counsel before publication.`);
 write('submission-checklist.md',`# Microsoft Store submission checklist

## Partner Center

- [ ] Create/verify developer account and MFA.
- [ ] Complete payout and tax profile.
- [ ] Reserve the exact product name.
- [ ] Choose MSI/EXE app submission and Paid pricing model.
- [ ] Request USD 499.99 base price; confirm the exact Store tier shown before publishing.
- [ ] Start with United States market; review every added market separately.
- [ ] Select public/searchable availability or intentionally choose direct-link-only.
- [ ] Complete IARC age-rating questionnaire accurately.
- [ ] Add public HTTPS privacy, support and website URLs.

## Installer — currently blocked

- [ ] Produce a standalone offline x64 EXE installer.
- [ ] Support silent installation with no installer UI other than permitted UAC.
- [ ] Digitally sign the installer and every shipped PE file using a CA-trusted code-signing certificate.
- [ ] Timestamp signatures and verify the full certificate chain on a clean Windows machine.
- [ ] Test clean install, launch, update, repair and uninstall in a Windows Sandbox/VM.
- [ ] Host the immutable binary at a versioned HTTPS URL; never replace bytes at that URL.
- [ ] Record SHA-256, installer version, silent command and uninstall command.

## Listing

- [x] Draft en-US description, short description, features and requirements.
- [x] Prepare square Store logos.
- [ ] Capture at least four genuine 16:9 screenshots at 1366×768 or larger with fictional customer/vehicle information.
- [ ] Verify screenshots and text contain no private customer data or unlicensed logos/content.
- [ ] Publish legally reviewed privacy policy.
- [ ] Supply support contact and response process.
- [ ] Add final certification notes and hardware limitations.
- [ ] Hold publication until owner reviews price, markets, listing and final binary.`);
 write('screenshot-plan.md',`# Required genuine screenshots

Capture from the final signed candidate using fictional data only. Do not submit generated mockups as screenshots.

1. Dashboard and active repair-order overview.
2. Repair order with labor/parts and invoice totals.
3. 50-point inspection with mixed pass/attention states.
4. Scanner Pro showing simulated or authorized test-vehicle results with VIN redacted.
5. Service Manual showing a supported vehicle and procedure artwork.
6. Scheduling calendar/shop board.

Recommended capture size: 1920×1080 PNG. Keep Windows chrome consistent, remove other apps from view, and verify no customer contact information, real VINs, API keys, local paths or internal build data appear.`);
 write('READINESS.md',`# Store readiness status

Prepared: ${new Date().toISOString()}
Requested commercial model: one-time paid digital download, USD 499.99 base price, applicable tax calculated at checkout.

Ready: listing copy, feature list, system requirements, certification notes, privacy draft, submission profile, Store logos and screenshot plan.

Blocking submission: Partner Center product reservation/identity, confirmed price tier, payout/tax profile, public privacy/support URLs, genuine screenshots, CA code-signing certificate, signed silent offline installer and immutable versioned HTTPS installer URL.

Current installed executable SHA-256: ${hash(exe)}
Current installed executable signature status: NOT SIGNED — do not submit this binary.`);
 console.log(`Microsoft Store submission kit prepared at ${out}`);
})();
