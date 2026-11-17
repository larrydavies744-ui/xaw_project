Xpressive Autoworks - Body Shop Estimator

HOW TO USE
1. Unzip the folder.
2. Open index.html in Chrome or Edge.
3. Fill in customer, insurance, vehicle, and loss information.
4. Add estimate lines or use the built-in templates.
5. Save estimates locally in the browser.
6. Print estimates or export/import JSON backups.
7. Use Import CSV to merge insurer estimate spreadsheets into saved records.

DESKTOP INSTALLER
1. Install Node.js 20+ on the Windows build machine.
2. Run `npm install` in this folder.
3. Run `npm run dist` to generate the icon files and build the Windows installer.
4. Find the installer in the `dist` folder as `Xpressive-Body-Shop-Estimator-Setup-<version>.exe`.
5. Use `npm start` for a local desktop test build without creating the installer.
6. For a signed release on a machine with a code-signing certificate, set `CSC_LINK` and `CSC_KEY_PASSWORD`, or `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD`, then run `npm run dist:signed`.
7. Run `npm run smoke:scheduler` to validate the live scheduling month/week views, schedule exports, and drag-reschedule logic in a headless DOM smoke test.
8. Use `npm run dist:clean` when you want to wipe older release artifacts before producing a fresh installer.

RELEASE WORKFLOW
1. Update the version in `package.json`.
2. Run `npm run smoke:scheduler`.
3. Run `npm run dist` for the standard installer.
4. Run `npm run dist:signed` on a machine that has the certificate environment variables available.
5. Publish `dist/Xpressive-Body-Shop-Estimator-Setup-<version>.exe`.

FEATURES
- One-folder static app, no install needed
- Windows desktop wrapper with installer build support
- Branded application icon generated from local source artwork
- Eight built-in color themes: red, orange, yellow, green, blue, purple, black, and white
- Splash screen with logo and Xpressive credits on app startup
- Customer + insurance + claim fields
- Vehicle + loss details
- Estimate lines with labor, parts, materials
- Body / paint / frame / mechanical totals
- Paint materials, tax, shop supplies, deductible math
- Walkaround checklist
- Saved estimate search
- Print-friendly layout

NEW IN THIS VERSION
- Autosaves estimate edits to local browser storage after changes
- Duplicate and delete controls for faster estimate management
- Snapshot and readiness panels that surface missing details and likely supplement risks
- Refreshed mobile-friendly layout with stronger print separation
- Cleaner saved-estimate browsing with active record highlight
- Photo evidence uploads with local compression and per-photo captions
- Dedicated PDF packet view for customer or insurer handoff
- Drag-and-drop photo upload and drag reorder for the estimate gallery
- Editable shop branding, contact fields, and optional logo for the PDF packet
- Selectable photo caption presets for common inspection shots like VIN, odometer, and corners
- One-click Share Packet action that downloads the JSON backup and opens the PDF packet together
- Activity history with timestamps and manual notes per estimate
- Labor guide preset buttons for common repair, refinish, calibration, and detail lines
- Saved estimate status filters and sort controls for faster record retrieval
- Customer-facing and insurer-facing packet variants with different detail levels
- Archive, restore, and delete-archived bulk tools for saved estimate cleanup
- Audience-specific packet cover notes and signature blocks stored per estimate
- Queue dashboard with monthly record counts, monthly totals, and open-review visibility
- CSV export for the current saved-estimate view using the active search and filter settings
- Reusable insurer and customer packet note tools, including one-click contact block insertion
- Report date range filters with separate detail and monthly summary CSV exports
- Editable packet template library for insurer and customer canned copy, saved locally in the browser
- Template library import/export JSON so reusable packet copy can move between machines
- CSV import for insurer estimate spreadsheets with merge/update support
- Windows Copilot launcher panel that copies estimate-aware prompts and opens Copilot
- Dashboard bar charts for monthly totals and status mix without adding a framework or build step
- Printable management report that mirrors the current queue filters and report date range
- Queue assignment fields for assignee, repair type, tags, and internal routing notes
- Assignee and repair-type sidebar filters for slicing the working queue
- Due dates, overdue tracking, and aging indicators in the queue and management report
- Reminder dates, follow-up notes, urgency scoring, and assignee workload views for queue triage
- Urgency filter in the saved queue plus assignee workload sections in the summary CSV and management report
- Live scheduling calendar with month and week views for due dates and reminders
- Drag-and-drop schedule rescheduling for due dates and reminder dates
- Printable schedule output plus CSV and ICS exports for the current schedule view
- Electron desktop release now ships as version 1.0.3 with installer rebuild support

NOTES
- Estimates are stored only in the browser on the current machine unless exported to JSON.
- Importing JSON replaces the saved estimate list in the current browser.
- Import CSV merges rows into the current saved list and does not delete existing estimates.
- Windows Copilot integration copies the generated prompt to the clipboard and opens the registered Copilot handler or browser fallback.
- The Windows Copilot panel includes dedicated Copy Insurer Prompt and Copy Customer Prompt buttons for faster handoff.
- In the Electron desktop build, Copilot launch now goes through the desktop shell bridge first instead of relying only on browser-side window opening.
- The Windows Copilot panel now shows whether it is running in Desktop Mode or Browser Mode.
- One-click Insurer to Copilot and Customer to Copilot buttons now copy the matching prompt and open Copilot in a single action.
- Copilot copy/open actions now show a toast confirmation and are logged in the estimate activity history for auditability.
- The Save Estimate button still works, but routine editing also autosaves.
- The PDF Packet button opens a branded print view; choose Save as PDF in the browser print dialog.
- Local browser storage is limited, so each estimate caps photo attachments and compresses them before saving.
- Logo and shop contact details are stored with each estimate so old packets keep their original branding.
- Share Packet is the fastest handoff path: it saves locally, downloads the backup JSON, and opens the print-ready packet in one action.
- Activity notes are kept with each estimate and recent entries are also included in the PDF packet.
- Packet audience is controlled from the header selector: insurer packets include claim and review detail, customer packets use a simplified summary.
- Active-only filtering is enabled by default so archived estimates stay out of the main working list until needed.
- CSV export respects the current sidebar view, so search, archive mode, and status filters can be used as a quick reporting lens before download.
- Packet note tools append reusable text snippets instead of overwriting existing notes, which helps build insurer and customer cover messages quickly.
- Report date range applies to both the dashboard and the CSV exports, so summary numbers and downloads stay aligned.
- Template library edits are stored separately from estimates, which makes them reusable across new records on the same machine/browser.
- Template library import accepts the app's exported JSON format and only applies recognized template keys.
- CSV import recognizes common headers such as Insurance Estimate #, Insurance Company, Claim Number, Estimate Number, Customer Name, VIN, Adjuster, Deductible, and core vehicle fields.
- CSV rows merge into existing saved estimates by Insurance Estimate # first, then Estimate Number, then Claim Number + VIN when available; unmatched rows create new estimates.
- Dashboard charts are visual summaries of the same current filtered/report-range dataset used by the numeric dashboard and CSV exports.
- Management Report opens a print-ready operations summary with monthly activity plus status, assignee, repair-type, and tag breakdowns.
- Queue metadata is saved per estimate and also appears in the saved-record list and detail CSV export for operational reporting.
- Saved estimates can now be filtered by assignee and repair type in addition to status, search, and archive scope.
- Due dates drive due-soon and overdue dashboard counts, while aging and stalled-record flags are surfaced in the saved list and management report.
- Reminder dates raise urgency automatically when follow-up is due, and assignee workload reporting shows hours, value, and urgent volume by owner.
- Urgency scoring now weighs due risk, reminders, priority, drivability, supplement review, and stale age so queue triage is less binary.
- Signed Windows release builds use Electron Builder's standard `CSC_LINK` and `CSC_KEY_PASSWORD` environment variables, with `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD` accepted as Windows-specific aliases.
- The `dist:signed` script now normalizes certificate environment variables before invoking Electron Builder so release machines can share one documented signing flow.
- The `smoke:scheduler` script checks the live scheduling features in a headless DOM run before packaging a release.

WINDOWS CODE SIGNING VARIABLES
- `CSC_LINK`: Path or base64/pfx URL for the code-signing certificate.
- `CSC_KEY_PASSWORD`: Password for the certificate referenced by `CSC_LINK`.
- `WIN_CSC_LINK`: Windows-specific alias for `CSC_LINK`.
- `WIN_CSC_KEY_PASSWORD`: Windows-specific alias for `CSC_KEY_PASSWORD`.
