import fs from 'node:fs/promises';
import path from 'node:path';
import { webcrypto } from 'node:crypto';
import { JSDOM } from 'jsdom';

const rootDir = process.cwd();
const html = await fs.readFile(path.join(rootDir, 'index.html'), 'utf8');
const appCode = await fs.readFile(path.join(rootDir, 'app.js'), 'utf8');

const dom = new JSDOM(html, {
	url: 'https://xpressive.local/',
	runScripts: 'outside-only',
	pretendToBeVisual: true
});

const { window } = dom;
const { document } = window;

const noop = () => {};
window.crypto = webcrypto;
window.structuredClone = globalThis.structuredClone;
window.alert = noop;
window.confirm = () => true;
window.print = noop;
window.copilotBridge = {
	isElectron: false,
	openExternal: async () => false
};
window.URL.createObjectURL = () => 'blob:mock';
window.URL.revokeObjectURL = noop;
window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
window.cancelAnimationFrame = (handle) => window.clearTimeout(handle);

let lastOpenedHtml = '';
window.open = () => ({
	document: {
		open: noop,
		write(content) {
			lastOpenedHtml = String(content || '');
		},
		close: noop
	},
	close: noop
});

window.eval(appCode);

const downloads = [];
window.downloadBlob = (filename, blob) => {
	downloads.push({ filename, type: blob.type, size: blob.size });
	return true;
};
window.downloadCsv = (filename, rows) => window.downloadBlob(filename, new window.Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
window.downloadTextFile = (filename, content, type) => window.downloadBlob(filename, new window.Blob([content], { type }));

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function setFieldValue(id, value, eventName = 'input') {
	const field = document.getElementById(id);
	assert(field, `Missing field: ${id}`);
	field.value = value;
	field.dispatchEvent(new window.Event(eventName, { bubbles: true }));
	return field;
}

function click(id) {
	const element = document.getElementById(id);
	assert(element, `Missing clickable element: ${id}`);
	element.click();
	return element;
}

function saveEstimate({ customerName, dueDate, reminderDate, assignedTo }) {
	setFieldValue('customerName', customerName);
	setFieldValue('assignedTo', assignedTo);
	setFieldValue('dueDate', dueDate, 'change');
	setFieldValue('reminderDate', reminderDate, 'change');
	click('saveEstimateBtn');
}

saveEstimate({
	customerName: 'Scheduler Test One',
	assignedTo: 'Front Desk',
	dueDate: '2026-03-16',
	reminderDate: '2026-03-15'
});

click('newEstimateBtn');

saveEstimate({
	customerName: 'Scheduler Test Two',
	assignedTo: 'Body Tech',
	dueDate: '2026-03-17',
	reminderDate: '2026-03-18'
});

document.querySelector('[data-content-tab="scheduling"]')?.click();

assert(typeof window.getScheduleEntries === 'function', 'Schedule entries function is not available.');
const entries = window.getScheduleEntries();
assert(entries.length >= 4, 'Expected saved due and reminder entries to be present in the schedule.');

assert(document.getElementById('scheduleCalendarGrid').children.length === 42, 'Month view should render 42 calendar cells.');

const marchDayCell = document.querySelector('.calendar-day[data-date="2026-03-20"]');
assert(marchDayCell, 'Expected March 20 cell to exist in month view.');
marchDayCell.click();

setFieldValue('scheduleDraftCustomerName', 'Day Click Schedule');
setFieldValue('scheduleDraftAssignee', 'Estimator Lane');
setFieldValue('scheduleDraftRepairType', 'Detail', 'change');
setFieldValue('scheduleDraftType', 'reminder', 'change');
setFieldValue('scheduleDraftTime', '10:45', 'input');
setFieldValue('scheduleDraftNote', 'Call customer before drop-off.');
click('scheduleCreateBtn');

const createdEntry = window.getScheduleEntries().find((entry) => entry.customerName === 'Day Click Schedule' && entry.type === 'reminder');
assert(createdEntry?.date === '2026-03-20', 'Selected-day schedule creation did not create a reminder on the clicked day.');
assert(createdEntry?.time === '10:45', 'Selected-day schedule creation did not preserve the chosen time slot.');

const createdAgendaEntry = document.querySelector('.schedule-agenda-item[data-estimate-id] [data-agenda-action="edit"]');
assert(createdAgendaEntry, 'Expected an agenda edit action to be rendered.');
createdAgendaEntry.click();
setFieldValue('scheduleDraftTime', '11:15', 'input');
setFieldValue('scheduleDraftNote', 'Updated call time.');
click('scheduleCreateBtn');

const editedEntry = window.getScheduleEntries().find((entry) => entry.customerName === 'Day Click Schedule' && entry.type === 'reminder');
assert(editedEntry?.time === '11:15', 'Agenda edit flow did not update the schedule time.');
assert(editedEntry?.note === 'Updated call time.', 'Agenda edit flow did not update the schedule note.');

const scheduleViewSelect = document.getElementById('scheduleViewSelect');
scheduleViewSelect.value = 'week';
scheduleViewSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
assert(document.getElementById('scheduleCalendarGrid').children.length === 7, 'Week view should render 7 calendar cells.');

const dueEntry = window.getScheduleEntries().find((entry) => entry.customerName === 'Scheduler Test Two' && entry.type === 'due');
assert(dueEntry, 'Could not find the due-date schedule entry for the second test estimate.');

const moved = window.rescheduleCalendarEntry(dueEntry.estimateId, dueEntry.type, '2026-03-19');
assert(moved, 'Drag-style reschedule helper should return true for a valid move.');

const updatedEntry = window.getScheduleEntries().find((entry) => entry.estimateId === dueEntry.estimateId && entry.type === 'due');
assert(updatedEntry?.date === '2026-03-19', 'Rescheduled due date was not updated to the new date.');

const printHtml = window.buildSchedulePrintHtml();
assert(printHtml.includes('Xpressive Autoworks Schedule'), 'Printable schedule output was not generated.');
assert(printHtml.includes('Scheduler Test Two'), 'Printable schedule output is missing saved schedule data.');
assert(printHtml.includes('11:15') || printHtml.includes('11:15 AM') || printHtml.includes('11:15 am'), 'Printable schedule output is missing schedule time data.');

window.exportScheduleCsv();
window.exportScheduleIcs();
assert(downloads.some((entry) => entry.filename.endsWith('.csv')), 'Schedule CSV export did not run.');
assert(downloads.some((entry) => entry.filename.endsWith('.ics')), 'Schedule ICS export did not run.');

scheduleViewSelect.value = 'month';
scheduleViewSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
document.querySelector('.calendar-day[data-date="2026-03-20"]')?.click();

const deleteAction = [...document.querySelectorAll('[data-agenda-action="delete"]')].find((button) => button.dataset.estimateId === editedEntry.estimateId);
assert(deleteAction, 'Expected an agenda delete action to be rendered.');
deleteAction.click();
assert(!window.getScheduleEntries().some((entry) => entry.estimateId === editedEntry.estimateId && entry.type === 'reminder'), 'Agenda delete flow did not remove the scheduled item.');

document.querySelector('[data-section-popout="scheduling"]')?.click();
assert(document.getElementById('sectionEditModal')?.classList.contains('is-open'), 'Expected the section pop-out modal to open.');
click('sectionEditCloseBtn');
assert(!document.getElementById('sectionEditModal')?.classList.contains('is-open'), 'Expected the section pop-out modal to close.');

window.openSchedulePrint();
assert(lastOpenedHtml.includes('Xpressive Autoworks Schedule'), 'Schedule print window did not receive printable HTML.');

console.log('Scheduler smoke test passed.');