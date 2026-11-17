const STORAGE_KEY = 'xpressive_body_shop_estimates_v2';
const TEMPLATE_LIBRARY_KEY = 'xpressive_body_shop_note_templates_v1';
const THEME_STORAGE_KEY = 'xpressive_body_shop_theme_v1';
const AI_ASSISTANT_SETTINGS_KEY = 'xpressive_body_shop_ai_settings_v1';
const AI_ASSISTANT_CHAT_KEY = 'xpressive_body_shop_ai_chat_v1';
const DEFAULT_LOGO_ASSET = 'assets/shop-logo-source.png';
const AUTOSAVE_DELAY_MS = 600;
const MAX_PHOTOS = 6;
const PHOTO_MAX_DIMENSION = 1400;
const PHOTO_QUALITY = 0.78;
const LOGO_MAX_DIMENSION = 700;
const PHOTO_CAPTION_PRESETS = [
	'Front overall',
	'Rear overall',
	'Left front corner',
	'Right front corner',
	'Left rear corner',
	'Right rear corner',
	'Front bumper damage',
	'Rear bumper damage',
	'Left side damage',
	'Right side damage',
	'Hood damage',
	'Roof damage',
	'Quarter panel damage',
	'Wheel damage',
	'VIN label',
	'Odometer'
];
const THEME_OPTIONS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white'];
const LINE_OPERATION_HOUR_DEFAULTS = {
	Body: {
		Repair: 3,
		Replace: 2.5,
		'Refinish': 2,
		Blend: 1.2,
		'R&I': 0.8,
		Section: 4.5,
		Calibrate: 1,
		Sublet: 0
	},
	Paint: {
		Repair: 1.5,
		Replace: 1.2,
		'Refinish': 2.5,
		Blend: 1.4,
		'R&I': 0.6,
		Section: 2,
		Calibrate: 0.8,
		Sublet: 0
	},
	Frame: {
		Repair: 3.5,
		Replace: 3,
		'Refinish': 1.5,
		Blend: 1,
		'R&I': 1,
		Section: 5.5,
		Calibrate: 1.5,
		Sublet: 0
	},
	Mechanical: {
		Repair: 1.5,
		Replace: 1.8,
		'Refinish': 0,
		Blend: 0,
		'R&I': 0.8,
		Section: 1.4,
		Calibrate: 2,
		Sublet: 0
	},
	Parts: {
		Repair: 0,
		Replace: 0,
		'Refinish': 0,
		Blend: 0,
		'R&I': 0,
		Section: 0,
		Calibrate: 0,
		Sublet: 0
	},
	Sublet: {
		Repair: 0,
		Replace: 0,
		'Refinish': 0,
		Blend: 0,
		'R&I': 0,
		Section: 0,
		Calibrate: 0,
		Sublet: 0
	},
	Detail: {
		Repair: 1.2,
		Replace: 0.8,
		'Refinish': 1.2,
		Blend: 0.6,
		'R&I': 0.5,
		Section: 1,
		Calibrate: 0.5,
		Sublet: 0
	}
};
const LINE_GUIDE_PRESETS = [
	{ id: 'ri-bumper', label: 'Bumper R&I', meta: 'Body Ãƒâ€šÃ‚Â· 0.8h', line: { category: 'Body', operation: 'R&I', panel: 'Bumper cover', description: 'Remove and reinstall for repair/refinish', qty: 1, hours: 0.8, parts: 0, materials: 0 } },
	{ id: 'refinish-panel', label: 'Refinish Panel', meta: 'Paint Ãƒâ€šÃ‚Â· 2.5h', line: { category: 'Paint', operation: 'Refinish', panel: 'Affected panel', description: 'Prep, seal, and refinish panel', qty: 1, hours: 2.5, parts: 0, materials: 65 } },
	{ id: 'blend-panel', label: 'Blend Adjacent', meta: 'Paint Ãƒâ€šÃ‚Â· 1.4h', line: { category: 'Paint', operation: 'Blend', panel: 'Adjacent panel', description: 'Blend adjacent panel for color match', qty: 1, hours: 1.4, parts: 0, materials: 30 } },
	{ id: 'headlamp-ri', label: 'Headlamp R&I', meta: 'Body Ãƒâ€šÃ‚Â· 0.6h', line: { category: 'Body', operation: 'R&I', panel: 'Headlamp assembly', description: 'Remove and reinstall lamp for repair access', qty: 1, hours: 0.6, parts: 0, materials: 0 } },
	{ id: 'measure-pull', label: 'Measure & Pull', meta: 'Frame Ãƒâ€šÃ‚Â· 3.5h', line: { category: 'Frame', operation: 'Repair', panel: 'Structure', description: 'Measure, pull, and verify structure', qty: 1, hours: 3.5, parts: 0, materials: 20 } },
	{ id: 'adas-cal', label: 'ADAS Calibration', meta: 'Mechanical Ãƒâ€šÃ‚Â· 2.0h', line: { category: 'Mechanical', operation: 'Calibrate', panel: 'ADAS / sensors', description: 'Pre/post scan and calibration allowance', qty: 1, hours: 2, parts: 0, materials: 0 } },
	{ id: 'diagnostic-scan', label: 'Diagnostic Scan', meta: 'Mechanical Ãƒâ€šÃ‚Â· 0.8h', line: { category: 'Mechanical', operation: 'Calibrate', panel: 'Vehicle systems', description: 'Diagnostic scan and fault code review', qty: 1, hours: 0.8, parts: 0, materials: 0 } },
	{ id: 'final-detail', label: 'Final Detail', meta: 'Detail Ãƒâ€šÃ‚Â· 1.2h', line: { category: 'Detail', operation: 'Repair', panel: 'Delivery detail', description: 'Final wash, vacuum, and delivery cleanup', qty: 1, hours: 1.2, parts: 0, materials: 20 } }
];
const NON_ESTIMATE_UI_IDS = new Set(['activityNote', 'searchSaved', 'savedStatusFilter', 'savedSort', 'savedAssigneeFilter', 'savedRepairTypeFilter', 'savedUrgencyFilter', 'packetAudience', 'themeColorSelect', 'activeOnlyToggle', 'reportStartDate', 'reportEndDate', 'templateAudienceSelect', 'templateKeySelect', 'templateEditorText', 'aiIncludeContext', 'aiPromptInput', 'scheduleViewSelect', 'scheduleDraftCustomerName', 'scheduleDraftAssignee', 'scheduleDraftType', 'scheduleDraftRepairType', 'scheduleDraftTime', 'scheduleDraftNote']);
const FORM_FIELDS = [
	'shopName', 'shopTagline', 'shopPhone', 'shopEmail', 'shopAddress1', 'shopAddress2',
	'insurerCoverNote', 'insurerSignatureLabel', 'insurerSignatureName', 'customerCoverNote', 'customerSignatureLabel', 'customerSignatureName',
	'estimateNumber', 'estimateDate', 'estimateStatus', 'customerName', 'customerPhone', 'customerEmail',
	'assignedTo', 'repairType', 'dueDate', 'reminderDate', 'estimateTags', 'reminderNote', 'internalOwnerNotes',
	'customerAddress', 'insuranceCompany', 'insurerEstimateNumber', 'claimNumber', 'policyNumber', 'adjusterName', 'adjusterPhone',
	'deductible', 'vehicleYear', 'vehicleMake', 'vehicleModel', 'vehicleTrim', 'vehicleVin', 'vehiclePlate',
	'vehicleColor', 'vehicleMileage', 'lossDate', 'impactPoint', 'drivable', 'priority', 'lossDescription',
	'visibleDamage', 'frameNotes', 'refinishNotes', 'supplementNotes', 'bodyRate', 'paintRate', 'frameRate',
	'mechRate', 'paintMaterialsPct', 'shopSuppliesPct', 'taxPct', 'customerApproval', 'estimatorName'
];
const CHECKLIST_ITEMS = [
	'Pre-existing damage noted', 'Front bumper', 'Rear bumper', 'Hood', 'Roof', 'Deck lid / tailgate',
	'LF fender', 'RF fender', 'LF door', 'RF door', 'LR door', 'RR door', 'Quarter panels', 'Rocker panels',
	'Headlamps', 'Tail lamps', 'Fog lamps', 'Mirrors', 'Windshield', 'Glass / regulators', 'Wheel alignment signs',
	'Suspension visual', 'Frame rail visual', 'Core support', 'Air bags / SRS warning', 'ADAS calibration likely',
	'Cooling system damage', 'A/C condenser', 'Radiator support', 'Tire rub / wheel damage', 'Underbody damage',
	'Paint match concern', 'Blend adjacent panels', 'Corrosion present', 'Prior repairs visible', 'Seam sealer condition',
	'Molding / trim clips', 'Emblems', 'Door handles', 'Weatherstrips', 'Glass seals', 'Parking sensors', 'Cameras',
	'Harness / wiring visible', 'Battery disconnected needed', 'Road test needed', 'Mechanical inspection needed',
	'Detail required', 'Customer belongings removed', 'Final QC pending'
];
const templates = {
	bumper: [
		{ category: 'Body', operation: 'Repair', panel: 'Front bumper cover', description: 'Repair gouges and reshape', qty: 1, hours: 3.5, rate: 85, parts: 0, materials: 40 },
		{ category: 'Paint', operation: 'Refinish', panel: 'Front bumper cover', description: 'Prep and refinish bumper', qty: 1, hours: 3, rate: 90, parts: 0, materials: 85 },
		{ category: 'Detail', operation: 'R&I', panel: 'Grille / moldings', description: 'Remove and reinstall trim for refinish', qty: 1, hours: 1, rate: 85, parts: 0, materials: 0 }
	],
	fender: [
		{ category: 'Body', operation: 'Repair', panel: 'LF Fender', description: 'Metal repair and finish', qty: 1, hours: 4.5, rate: 85, parts: 0, materials: 25 },
		{ category: 'Paint', operation: 'Refinish', panel: 'LF Fender', description: 'Refinish repaired panel', qty: 1, hours: 2.8, rate: 90, parts: 0, materials: 75 },
		{ category: 'Paint', operation: 'Blend', panel: 'LF Door', description: 'Blend adjacent panel', qty: 1, hours: 1.6, rate: 90, parts: 0, materials: 35 }
	],
	door: [
		{ category: 'Body', operation: 'Repair', panel: 'RF Door shell', description: 'Repair door shell damage', qty: 1, hours: 6.2, rate: 85, parts: 0, materials: 35 },
		{ category: 'Paint', operation: 'Refinish', panel: 'RF Door', description: 'Refinish complete panel', qty: 1, hours: 3.2, rate: 90, parts: 0, materials: 90 },
		{ category: 'Detail', operation: 'R&I', panel: 'Handle / mirror / trim', description: 'R&I externals', qty: 1, hours: 1.4, rate: 85, parts: 0, materials: 0 }
	],
	hail: [
		{ category: 'Body', operation: 'Repair', panel: 'Roof', description: 'PDR or conventional repair allowance', qty: 1, hours: 8, rate: 85, parts: 0, materials: 50 },
		{ category: 'Body', operation: 'Repair', panel: 'Hood', description: 'Dent repair estimate', qty: 1, hours: 5, rate: 85, parts: 0, materials: 30 },
		{ category: 'Paint', operation: 'Blend', panel: 'Adjacent panels', description: 'Blend as needed after repairs', qty: 2, hours: 2.5, rate: 90, parts: 0, materials: 60 }
	],
	collision: [
		{ category: 'Body', operation: 'Replace', panel: 'Front bumper assembly', description: 'Replace bumper assembly', qty: 1, hours: 3, rate: 85, parts: 650, materials: 0 },
		{ category: 'Frame', operation: 'Repair', panel: 'Upper tie bar / support', description: 'Structural pull and measure', qty: 1, hours: 4.5, rate: 110, parts: 0, materials: 25 },
		{ category: 'Mechanical', operation: 'Calibrate', panel: 'ADAS / Radar', description: 'Calibration allowance', qty: 1, hours: 2, rate: 125, parts: 0, materials: 0 },
		{ category: 'Paint', operation: 'Refinish', panel: 'Front bumper', description: 'Refinish replacement bumper', qty: 1, hours: 3.2, rate: 90, parts: 0, materials: 95 }
	],
	detail: [
		{ category: 'Detail', operation: 'Repair', panel: 'Final detail', description: 'Wash, vacuum, delivery cleanup', qty: 1, hours: 1.5, rate: 65, parts: 0, materials: 20 }
	]
};

const REVIEW_STATUSES = new Set(['Pending Approval', 'Insurance Review', 'Supplement Needed']);
const CSV_IMPORT_FIELD_ALIASES = {
	estimateNumber: ['estimate number', 'estimate #', 'estimate no', 'ro', 'ro number', 'repair order', 'repair order number'],
	estimateDate: ['estimate date', 'date', 'created date'],
	estimateStatus: ['status', 'estimate status'],
	customerName: ['customer name', 'customer', 'insured name', 'owner name'],
	customerPhone: ['customer phone', 'phone', 'phone number', 'insured phone'],
	customerEmail: ['customer email', 'email', 'insured email'],
	customerAddress: ['customer address', 'address'],
	insuranceCompany: ['insurance company', 'carrier', 'insurer'],
	insurerEstimateNumber: ['insurance estimate number', 'insurance estimate #', 'carrier estimate number', 'carrier estimate #', 'insurer estimate number', 'insurer estimate #', 'appraiser estimate number', 'appraiser estimate #'],
	claimNumber: ['claim number', 'claim #', 'claim no'],
	policyNumber: ['policy number', 'policy #', 'policy no'],
	adjusterName: ['adjuster', 'adjuster name', 'appraiser', 'appraiser name'],
	adjusterPhone: ['adjuster phone', 'adjuster phone number', 'appraiser phone'],
	deductible: ['deductible', 'customer deductible'],
	assignedTo: ['assigned to', 'owner', 'assignee'],
	repairType: ['repair type', 'type'],
	dueDate: ['due date', 'promise date'],
	reminderDate: ['reminder date', 'follow up date'],
	reminderNote: ['reminder note', 'follow up note'],
	estimateTags: ['tags', 'estimate tags'],
	vehicleYear: ['vehicle year', 'year'],
	vehicleMake: ['vehicle make', 'make'],
	vehicleModel: ['vehicle model', 'model'],
	vehicleTrim: ['vehicle trim', 'trim'],
	vehicleVin: ['vin', 'vehicle vin'],
	vehiclePlate: ['plate', 'license plate', 'plate number'],
	vehicleColor: ['color', 'vehicle color'],
	vehicleMileage: ['mileage', 'odometer', 'vehicle mileage'],
	lossDate: ['loss date', 'date of loss'],
	impactPoint: ['point of impact', 'impact point'],
	drivable: ['drivable'],
	priority: ['priority', 'repair priority'],
	lossDescription: ['loss description', 'damage description', 'customer concern'],
	visibleDamage: ['visible damage', 'damage'],
	supplementNotes: ['supplement notes', 'supplement', 'supplement note'],
	bodyRate: ['body rate'],
	paintRate: ['paint rate'],
	frameRate: ['frame rate'],
	mechRate: ['mechanical rate', 'mech rate'],
	taxPct: ['tax', 'tax %', 'tax pct']
};
const NOTE_TEMPLATE_DEFINITIONS = {
	'carrier-review': { audience: 'insurer', label: 'Carrier Review', text: 'Please review claim {{claimNumber}} for {{vehicleLabel}}. This estimate reflects currently visible damage and attached documentation for initial carrier evaluation.' },
	'supplement-request': { audience: 'insurer', label: 'Supplement Request', text: 'Supplement review is requested for claim {{claimNumber}}. Additional repair operations, hidden damage, and part-related costs may be required after teardown and measurement verification.' },
	'calibration-required': { audience: 'insurer', label: 'Calibration Required', text: 'Diagnostics and calibration allowances should remain open on this file. Vehicle systems, ADAS components, and post-repair verification may require additional documented operations before release.' },
	'parts-delay': { audience: 'insurer', label: 'Parts Delay', text: 'Parts sourcing and insurer response timing may affect cycle time on this repair. Updated supplements and part documentation will be forwarded as availability and teardown findings are confirmed.' },
	'customer-intake': { audience: 'customer', label: 'Repair Intake', text: 'This repair summary was prepared for {{customerName}}. It reflects visible damage at intake and the current plan to return the vehicle to pre-loss condition.' },
	'deductible-reminder': { audience: 'customer', label: 'Deductible Reminder', text: 'Customer deductible responsibility is currently {{deductible}}. Final payment timing may depend on insurer approvals, supplements, and any customer-authorized out-of-pocket items.' },
	'timeline-update': { audience: 'customer', label: 'Timeline Update', text: 'Repair timing depends on insurer approvals, hidden damage discovered during disassembly, and parts availability. We will update you promptly if the repair plan or completion timing changes.' },
	'delivery-ready': { audience: 'customer', label: 'Delivery Ready', text: 'Once repairs, calibrations, and final quality checks are complete, we will coordinate delivery pickup and review the repaired areas with you before vehicle release.' }
};

const $ = (id) => document.getElementById(id);
const money = (value) => `$${Number(value || 0).toFixed(2)}`;

function loadThemePreference() {
	try {
		const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'orange';
		return THEME_OPTIONS.includes(storedTheme) ? storedTheme : 'orange';
	} catch {
		return 'orange';
	}
}

function applyTheme(themeName, { persistTheme = true } = {}) {
	const nextTheme = THEME_OPTIONS.includes(themeName) ? themeName : 'orange';
	document.documentElement.dataset.theme = nextTheme;
	document.documentElement.style.colorScheme = nextTheme === 'black' ? 'dark' : 'light';
	if ($('themeColorSelect')) {
		$('themeColorSelect').value = nextTheme;
	}
	if (persistTheme) {
		try {
			localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
		} catch {
			// Ignore theme persistence failures and keep the current session theme.
		}
	}
}

function dismissStartupSplash() {
	const splash = $('startupSplash');
	const shell = document.querySelector('.page-shell');
	if (!splash || splash.dataset.dismissed === 'true') return;
	splash.dataset.dismissed = 'true';
	const closeSplash = () => {
		splash.classList.add('is-hidden');
		shell?.classList.remove('is-booting');
		window.setTimeout(() => splash.remove(), 900);
	};
	const timer = window.setTimeout(closeSplash, 8200);
	$('skipSplashBtn')?.addEventListener('click', () => {
		window.clearTimeout(timer);
		closeSplash();
	});
}

function createHistoryEntry(note, type = 'system', timestamp = new Date().toISOString()) {
	return {
		id: crypto.randomUUID(),
		note,
		type,
		timestamp
	};
}

const defaultEstimate = () => ({
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	id: crypto.randomUUID(),
	estimateNumber: `XA-BS-${Date.now().toString().slice(-6)}`,
	estimateDate: new Date().toISOString().slice(0, 10),
	estimateStatus: 'Draft',
	shopName: 'Xpressive Autoworks',
	shopTagline: 'Automotive Engineering ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Diagnostics ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Body & Collision Estimating',
	shopPhone: '323-326-7354',
	shopEmail: '',
	shopAddress1: 'Los Angeles Area',
	shopAddress2: '',
	insurerCoverNote: '',
	insurerSignatureLabel: 'Estimator / Claims Contact',
	insurerSignatureName: '',
	customerCoverNote: '',
	customerSignatureLabel: 'Customer Care / Repair Team',
	customerSignatureName: '',
	shopLogoDataUrl: '',
	shopLogoName: '',
	isArchived: false,
	assignedTo: '',
	repairType: 'Collision',
	dueDate: '',
	dueTime: '',
	reminderDate: '',
	reminderTime: '',
	estimateTags: '',
	reminderNote: '',
	internalOwnerNotes: '',
	customerName: '',
	customerPhone: '',
	customerEmail: '',
	customerAddress: '',
	insuranceCompany: '',
	insurerEstimateNumber: '',
	claimNumber: '',
	policyNumber: '',
	adjusterName: '',
	adjusterPhone: '',
	deductible: 0,
	vehicleYear: '',
	vehicleMake: '',
	vehicleModel: '',
	vehicleTrim: '',
	vehicleVin: '',
	vehiclePlate: '',
	vehicleColor: '',
	vehicleMileage: '',
	lossDate: '',
	impactPoint: 'Front',
	drivable: 'Yes',
	priority: 'Standard',
	lossDescription: '',
	visibleDamage: '',
	frameNotes: '',
	refinishNotes: '',
	supplementNotes: '',
	bodyRate: 85,
	paintRate: 90,
	frameRate: 110,
	mechRate: 125,
	paintMaterialsPct: 15,
	shopSuppliesPct: 5,
	taxPct: 10.25,
	customerApproval: '',
	estimatorName: '',
	lines: [],
	photos: [],
	history: [createHistoryEntry('Estimate created', 'system')],
	checklist: Object.fromEntries(CHECKLIST_ITEMS.map((item) => [item, { status: 'OK', note: '' }]))
});

let state = {
	estimates: loadEstimates(),
	templateLibrary: loadTemplateLibrary(),
	aiSettings: loadAiSettings(),
	aiChat: loadAiChat(),
	aiBusy: false,
	current: null,
	filter: '',
	statusFilter: 'all',
	assigneeFilter: 'all',
	repairTypeFilter: 'all',
	urgencyFilter: 'all',
	sortOrder: 'updated-desc',
	activeOnly: true,
	reportStartDate: '',
	reportEndDate: '',
	calendarMonth: '',
	calendarSelectedDate: '',
	calendarView: 'month',
	scheduleComposerEdit: null,
	draggedScheduleEntry: null,
	activeContentTab: 'overview',
	sectionModal: null,
	dirty: false,
	lastSavedAt: null,
	currentTotals: null,
	currentSummary: null
};

let autosaveHandle = null;
let draggedPhotoId = null;
let copilotToastHandle = null;

function loadEstimates() {
	try {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
		return Array.isArray(stored) ? stored.map(normalizeEstimate) : [];
	} catch {
		return [];
	}
}

function defaultTemplateLibrary() {
	return Object.fromEntries(Object.entries(NOTE_TEMPLATE_DEFINITIONS).map(([key, definition]) => [key, definition.text]));
}

function loadTemplateLibrary() {
	const defaults = defaultTemplateLibrary();
	try {
		const stored = JSON.parse(localStorage.getItem(TEMPLATE_LIBRARY_KEY)) || {};
		return { ...defaults, ...stored };
	} catch {
		return defaults;
	}
}

function defaultAiSettings() {
	return {
		includeContext: true
	};
}

function loadAiSettings() {
	const defaults = defaultAiSettings();
	try {
		const stored = JSON.parse(localStorage.getItem(AI_ASSISTANT_SETTINGS_KEY)) || {};
		return { ...defaults, includeContext: stored.includeContext !== false };
	} catch {
		return defaults;
	}
}

function loadAiChat() {
	try {
		const stored = JSON.parse(localStorage.getItem(AI_ASSISTANT_CHAT_KEY)) || [];
		return Array.isArray(stored)
			? stored
				.filter((entry) => entry && typeof entry.content === 'string' && typeof entry.role === 'string')
				.slice(-12)
			: [];
	} catch {
		return [];
	}
}

function persistAiSettings() {
	const payload = {
		includeContext: state.aiSettings.includeContext
	};
	try {
		localStorage.setItem(AI_ASSISTANT_SETTINGS_KEY, JSON.stringify(payload));
		return true;
	} catch {
		return false;
	}
}

function persistAiChat() {
	try {
		localStorage.setItem(AI_ASSISTANT_CHAT_KEY, JSON.stringify(state.aiChat.slice(-12)));
		return true;
	} catch {
		return false;
	}
}

function persistTemplateLibrary() {
	try {
		localStorage.setItem(TEMPLATE_LIBRARY_KEY, JSON.stringify(state.templateLibrary));
		return true;
	} catch (error) {
		if (error && error.name === 'QuotaExceededError') {
			window.alert('Local browser storage is full. Template library changes could not be saved.');
			return false;
		}
		throw error;
	}
}

function persist() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state.estimates));
		return true;
	} catch (error) {
		if (error && error.name === 'QuotaExceededError') {
			window.alert('Local browser storage is full. Remove some photos or export and clear old estimates.');
			return false;
		}
		throw error;
	}
}

function escapeHtml(value = '') {
	return String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function normalizeEstimate(estimate = {}) {
	const base = defaultEstimate();
	const normalizedChecklist = { ...base.checklist, ...(estimate.checklist || {}) };
	const normalizedLines = Array.isArray(estimate.lines)
		? estimate.lines.map((line) => ({
			id: line.id || crypto.randomUUID(),
			category: line.category || 'Body',
			operation: line.operation || 'Repair',
			panel: line.panel || '',
			description: line.description || '',
			qty: Number(line.qty ?? 1),
			hours: Number(line.hours ?? 0),
			rate: Number(line.rate ?? 0),
			parts: Number(line.parts ?? 0),
			materials: Number(line.materials ?? 0)
		}))
		: [];
	const normalizedPhotos = Array.isArray(estimate.photos)
		? estimate.photos
			.filter((photo) => photo && photo.dataUrl)
			.slice(0, MAX_PHOTOS)
			.map((photo) => ({
				id: photo.id || crypto.randomUUID(),
				name: photo.name || 'Estimate photo',
				caption: photo.caption || '',
				dataUrl: photo.dataUrl
			}))
		: [];
	const normalizedHistory = Array.isArray(estimate.history) && estimate.history.length > 0
		? estimate.history.map((entry) => ({
			id: entry.id || crypto.randomUUID(),
			note: entry.note || 'Activity updated',
			type: entry.type || 'note',
			timestamp: entry.timestamp || estimate.updatedAt || estimate.createdAt || new Date().toISOString()
		}))
		: [createHistoryEntry('Estimate created', 'system', estimate.createdAt || new Date().toISOString())];

	return {
		...base,
		...estimate,
		createdAt: estimate.createdAt || base.createdAt,
		updatedAt: estimate.updatedAt || estimate.createdAt || base.updatedAt,
		shopLogoDataUrl: estimate.shopLogoDataUrl || '',
		shopLogoName: estimate.shopLogoName || '',
		isArchived: Boolean(estimate.isArchived),
		lines: normalizedLines,
		photos: normalizedPhotos,
		history: normalizedHistory,
		checklist: normalizedChecklist
	};
}

function categoryDefaultRate(estimate, category) {
	switch (category) {
		case 'Body':
			return Number(estimate.bodyRate || 0);
		case 'Paint':
			return Number(estimate.paintRate || 0);
		case 'Frame':
			return Number(estimate.frameRate || 0);
		case 'Mechanical':
			return Number(estimate.mechRate || 0);
		case 'Detail':
			return 65;
		default:
			return 0;
	}
}

function calculateEstimateMetrics(estimate) {
	const normalizedEstimate = normalizeEstimate(estimate);
	let bodyLabor = 0;
	let paintLabor = 0;
	let frameLabor = 0;
	let mechLabor = 0;
	let bodyHours = 0;
	let paintHours = 0;
	let frameHours = 0;
	let mechHours = 0;
	let parts = 0;
	let materials = 0;

	normalizedEstimate.lines.forEach((line) => {
		const quantity = Number(line.qty || 0);
		const hours = Number(line.hours || 0);
		const rate = Number(line.rate || categoryDefaultRate(normalizedEstimate, line.category));
		const labor = quantity * hours * rate;

		parts += Number(line.parts || 0);
		materials += Number(line.materials || 0);

		if (line.category === 'Paint') {
			paintLabor += labor;
			paintHours += quantity * hours;
		} else if (line.category === 'Frame') {
			frameLabor += labor;
			frameHours += quantity * hours;
		} else if (line.category === 'Mechanical') {
			mechLabor += labor;
			mechHours += quantity * hours;
		} else {
			bodyLabor += labor;
			bodyHours += quantity * hours;
		}
	});

	const calcPaintMaterials = paintLabor * (Number(normalizedEstimate.paintMaterialsPct || 0) / 100);
	const shopSupplies = (bodyLabor + paintLabor + frameLabor + mechLabor) * (Number(normalizedEstimate.shopSuppliesPct || 0) / 100);
	const tax = parts * (Number(normalizedEstimate.taxPct || 0) / 100);
	const deductible = Number(normalizedEstimate.deductible || 0);
	const grand = bodyLabor + paintLabor + frameLabor + mechLabor + parts + materials + calcPaintMaterials + shopSupplies + tax;

	return {
		bodyLabor,
		paintLabor,
		frameLabor,
		mechLabor,
		bodyHours,
		paintHours,
		frameHours,
		mechHours,
		parts,
		materials,
		calcPaintMaterials,
		shopSupplies,
		tax,
		deductible,
		grand
	};
}

function markDirty() {
	state.dirty = true;
	updateSaveState();
	window.clearTimeout(autosaveHandle);
	autosaveHandle = window.setTimeout(() => saveCurrent({ silent: true }), AUTOSAVE_DELAY_MS);
}

function updateSaveState(message) {
	const badge = $('saveStateBadge');
	const text = $('saveStateText');
	if (!badge || !text) {
		return;
	}

	if (state.dirty) {
		badge.textContent = 'Unsaved';
		badge.className = 'save-badge dirty';
		text.textContent = message || 'Autosave pending';
		return;
	}

	badge.textContent = 'Saved';
	badge.className = 'save-badge';
	text.textContent = message || (state.lastSavedAt ? `Last saved ${new Date(state.lastSavedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Ready');
}

function setInsurerLookupStatus(message = '', tone = '') {
	const status = $('insurerLookupStatus');
	if (!status) {
		return;
	}
	const defaultMessage = state.current && state.current.insurerEstimateNumber
		? 'Insurance estimate number saved with this record. Enter another number and use Auto Fill to load a different saved match.'
		: 'Load a saved estimate by insurance estimate number.';
	status.textContent = message || defaultMessage;
	status.className = tone ? `helper-text ${tone}` : 'helper-text';
}

function normalizeLookupValue(value = '') {
	return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function refreshInsurerEstimateNumberSuggestions() {
	const datalist = $('insurerEstimateNumberSuggestions');
	if (!datalist) {
		return;
	}
	const options = [...new Set(state.estimates
		.map((estimate) => String(estimate.insurerEstimateNumber || '').trim())
		.filter(Boolean))]
		.sort((left, right) => left.localeCompare(right));
	datalist.innerHTML = options.map((option) => `<option value="${escapeHtml(option)}"></option>`).join('');
}

function findEstimateByInsurerEstimateNumber(value, { excludeId = state.current?.id } = {}) {
	const lookupValue = normalizeLookupValue(value);
	if (!lookupValue) {
		return null;
	}
	return state.estimates
		.filter((estimate) => estimate.id !== excludeId)
		.filter((estimate) => normalizeLookupValue(estimate.insurerEstimateNumber) === lookupValue)
		.sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')))[0] || null;
}

function hasCurrentContentBeyondLookup() {
	const baseline = defaultEstimate();
	const meaningfulFields = [
		'customerName', 'customerPhone', 'customerEmail', 'customerAddress', 'insuranceCompany', 'claimNumber', 'policyNumber',
		'adjusterName', 'adjusterPhone', 'assignedTo', 'repairType', 'dueDate', 'reminderDate', 'estimateTags', 'reminderNote',
		'internalOwnerNotes', 'vehicleYear', 'vehicleMake', 'vehicleModel', 'vehicleTrim', 'vehicleVin', 'vehiclePlate',
		'vehicleColor', 'vehicleMileage', 'lossDate', 'impactPoint', 'drivable', 'priority', 'lossDescription', 'visibleDamage',
		'frameNotes', 'refinishNotes', 'supplementNotes', 'customerApproval', 'estimatorName'
	];
	return meaningfulFields.some((field) => String(state.current[field] || '').trim() !== String(baseline[field] || '').trim())
		|| state.current.lines.length > 0
		|| state.current.photos.length > 0
		|| Object.values(state.current.checklist || {}).some((entry) => entry.status !== 'OK' || String(entry.note || '').trim());
}

function autoFillFromInsurerEstimateNumber() {
	const lookupField = $('insurerEstimateNumber');
	const lookupValue = String(lookupField?.value || '').trim();
	if (!lookupValue) {
		setInsurerLookupStatus('Enter an insurance estimate number to search saved records.', 'lookup-warning');
		return false;
	}
	const match = findEstimateByInsurerEstimateNumber(lookupValue);
	if (!match) {
		setInsurerLookupStatus(`No saved record found for insurance estimate # ${lookupValue}.`, 'lookup-warning');
		window.alert(`No saved estimate was found for insurance estimate number ${lookupValue}.`);
		return false;
	}
	if (state.dirty && hasCurrentContentBeyondLookup()) {
		const confirmed = window.confirm(`Replace the current form with saved estimate ${match.estimateNumber}? Unsaved changes will be lost.`);
		if (!confirmed) {
			setInsurerLookupStatus('Auto Fill canceled. Current form kept.');
			return false;
		}
	}
	setCurrent(match);
	setInsurerLookupStatus(`Loaded saved estimate ${match.estimateNumber} from insurance estimate # ${lookupValue}.`, 'lookup-success');
	return true;
}

function setCurrent(estimate) {
	state.current = normalizeEstimate(structuredClone(estimate));
	state.dirty = false;
	renderForm();
	setInsurerLookupStatus();
	renderBrandProfile();
	renderArchiveButton();
	renderLines();
	renderChecklist();
	renderPhotos();
	renderSavedList();
	recalc();
	updateSaveState('Record loaded');
}

function syncFromForm() {
	FORM_FIELDS.forEach((id) => {
		state.current[id] = $(id).value;
	});
}

function renderForm() {
	Object.entries(state.current).forEach(([key, value]) => {
		if ($(key) && typeof value !== 'object') {
			$(key).value = value;
		}
	});
}

function joinNonEmpty(parts, separator = ' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ') {
	return parts.filter((part) => String(part || '').trim()).join(separator);
}

function getVehicleLabel(estimate = state.current) {
	return [estimate.vehicleYear, estimate.vehicleMake, estimate.vehicleModel, estimate.vehicleTrim].filter(Boolean).join(' ') || 'the vehicle';
}

function renderBrandProfile() {
	$('shopNameHeading').textContent = state.current.shopName || 'Xpressive Autoworks';
	$('shopTaglineHeading').textContent = state.current.shopTagline || 'Body Shop Estimator';
	$('shopNameBlock').textContent = state.current.shopName || 'Xpressive Autoworks';
	$('shopTaglineBlock').textContent = state.current.shopTagline || 'Automotive Engineering ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Diagnostics ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Body & Collision Estimating';
	$('shopContactBlock').textContent = joinNonEmpty([
		state.current.shopAddress1,
		state.current.shopAddress2,
		state.current.shopPhone ? `Phone: ${state.current.shopPhone}` : '',
		state.current.shopEmail
	]) || 'Los Angeles Area ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Phone: 323-326-7354';

	const logoPreview = $('logoPreview');
	logoPreview.innerHTML = state.current.shopLogoDataUrl
		? `<img src="${state.current.shopLogoDataUrl}" alt="${escapeHtml(state.current.shopLogoName || state.current.shopName || 'Shop logo')}" class="logo-thumb" />`
		: `<img src="${DEFAULT_LOGO_ASSET}" alt="${escapeHtml(state.current.shopName || 'Shop logo')}" class="logo-thumb default-logo-thumb" />`;
	$('removeLogoBtn').disabled = !state.current.shopLogoDataUrl;
}

function showCopilotToast(message, tone = '') {
	const toast = $('copilotToast');
	if (!toast) {
		return;
	}
	toast.textContent = message;
	toast.className = tone ? `copilot-toast is-visible ${tone}` : 'copilot-toast is-visible';
	window.clearTimeout(copilotToastHandle);
	copilotToastHandle = window.setTimeout(() => {
		toast.className = 'copilot-toast';
	}, 2600);
}

function getTemplateKeysForAudience(audience) {
	return Object.entries(NOTE_TEMPLATE_DEFINITIONS)
		.filter(([, definition]) => definition.audience === audience)
		.map(([key]) => key);
}

function ensureValidTemplateSelection() {
	const audience = $('templateAudienceSelect')?.value || 'insurer';
	const select = $('templateKeySelect');
	if (!select) {
		return null;
	}
	const keys = getTemplateKeysForAudience(audience);
	if (!keys.includes(select.value)) {
		select.value = keys[0] || '';
	}
	return select.value;
}

function renderTemplateLibraryEditor(message = 'Choose a template to edit its reusable text.') {
	const audienceSelect = $('templateAudienceSelect');
	const templateKeySelect = $('templateKeySelect');
	const editor = $('templateEditorText');
	const status = $('templateLibraryStatus');
	if (!audienceSelect || !templateKeySelect || !editor || !status) {
		return;
	}

	const audience = audienceSelect.value || 'insurer';
	const currentKey = templateKeySelect.value;
	templateKeySelect.innerHTML = getTemplateKeysForAudience(audience).map((key) => {
		const definition = NOTE_TEMPLATE_DEFINITIONS[key];
		return `<option value="${escapeHtml(key)}" ${currentKey === key ? 'selected' : ''}>${escapeHtml(definition.label)}</option>`;
	}).join('');
	const selectedKey = ensureValidTemplateSelection();
	editor.value = selectedKey ? state.templateLibrary[selectedKey] || NOTE_TEMPLATE_DEFINITIONS[selectedKey].text : '';
	status.textContent = message;
}

function templateTokensForEstimate(estimate = state.current) {
	return {
		claimNumber: estimate.claimNumber || '[claim number pending]',
		vehicleLabel: getVehicleLabel(estimate),
		customerName: estimate.customerName || 'the vehicle owner',
		deductible: money(estimate.deductible || 0),
		insuranceCompany: estimate.insuranceCompany || 'insurance company pending',
		adjusterName: estimate.adjusterName || 'adjuster pending',
		adjusterPhone: estimate.adjusterPhone || 'phone pending',
		customerPhone: estimate.customerPhone || 'phone pending',
		customerEmail: estimate.customerEmail || 'email pending',
		priority: estimate.priority || 'Standard'
	};
}

function renderTemplateText(templateKey, estimate = state.current) {
	const rawTemplate = state.templateLibrary[templateKey] || NOTE_TEMPLATE_DEFINITIONS[templateKey]?.text || '';
	const tokens = templateTokensForEstimate(estimate);
	return rawTemplate.replace(/{{\s*(\w+)\s*}}/g, (_, token) => tokens[token] || `[${token}]`);
}

function formatDateTime(value) {
	return value ? new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Unknown time';
}

function renderHistory() {
	const list = $('historyList');
	list.innerHTML = '';

	$('historyStatusText').textContent = `Updated ${formatDateTime(state.current.updatedAt)}`;

	state.current.history
		.slice()
		.sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
		.forEach((entry) => {
			const item = document.createElement('div');
			item.className = 'history-item';
			item.innerHTML = `
				<strong>${escapeHtml(entry.note)}</strong>
				<small>${escapeHtml(entry.type)} Ãƒâ€šÃ‚Â· ${escapeHtml(formatDateTime(entry.timestamp))}</small>
			`;
			list.appendChild(item);
		});
}

function appendHistory(note, type = 'note', timestamp = new Date().toISOString()) {
	state.current.history.unshift(createHistoryEntry(note, type, timestamp));
	state.current.history = state.current.history.slice(0, 25);
	state.current.updatedAt = timestamp;
	renderHistory();
}

function recordCopilotAction(note) {
	appendHistory(note, 'system');
	markDirty();
}

function addActivityNote() {
	const note = $('activityNote').value.trim();
	if (!note) {
		return;
	}
	appendHistory(note, 'note');
	$('activityNote').value = '';
	markDirty();
}

function renderLaborGuides() {
	const grid = $('laborGuideGrid');
	grid.innerHTML = '';

	LINE_GUIDE_PRESETS.forEach((guide) => {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'labor-guide-btn';
		button.dataset.guideId = guide.id;
		button.innerHTML = `<strong>${escapeHtml(guide.label)}</strong><small>${escapeHtml(guide.meta)}</small>`;
		grid.appendChild(button);
	});
}

function renderArchiveButton() {
	$('archiveEstimateBtn').textContent = state.current && state.current.isArchived ? 'Restore' : 'Archive';
}

function estimateMatchesVisibleFilters(estimate, query = state.filter.toLowerCase()) {
	return (!state.activeOnly || !estimate.isArchived)
		&& (state.statusFilter === 'all' || estimate.estimateStatus === state.statusFilter)
		&& (state.assigneeFilter === 'all' || (estimate.assignedTo || 'Unassigned') === state.assigneeFilter)
		&& (state.repairTypeFilter === 'all' || (estimate.repairType || 'Collision') === state.repairTypeFilter)
		&& (state.urgencyFilter === 'all' || getEstimateTimingInfo(estimate).urgencyLabel === state.urgencyFilter)
		&& [estimate.customerName, estimate.vehicleVin, estimate.claimNumber, estimate.estimateNumber, estimate.insurerEstimateNumber, estimate.vehicleMake, estimate.vehicleModel].join(' ').toLowerCase().includes(query);
}

function getVisibleEstimates() {
	const query = state.filter.toLowerCase();
	return state.estimates
		.filter((estimate) => estimateMatchesVisibleFilters(estimate, query))
		.sort((left, right) => compareEstimates(left, right, state.sortOrder));
}

function getCalendarEstimates() {
	const query = state.filter.toLowerCase();
	const estimates = state.estimates
		.filter((estimate) => estimateMatchesVisibleFilters(estimate, query))
		.map((estimate) => normalizeEstimate(structuredClone(estimate)));
	if (!state.current || !estimateMatchesVisibleFilters(state.current, query)) {
		return estimates.sort((left, right) => compareEstimates(left, right, state.sortOrder));
	}
	const currentEstimate = normalizeEstimate(structuredClone(state.current));
	const currentIndex = estimates.findIndex((estimate) => estimate.id === currentEstimate.id);
	if (currentIndex >= 0) {
		estimates[currentIndex] = currentEstimate;
	} else {
		estimates.push(currentEstimate);
	}
	return estimates.sort((left, right) => compareEstimates(left, right, state.sortOrder));
}

function compareScheduleEntries(left, right) {
	return left.date.localeCompare(right.date)
		|| timeSortValue(left.time) - timeSortValue(right.time)
		|| (left.type === right.type ? 0 : (left.type === 'due' ? -1 : 1))
		|| left.customerName.localeCompare(right.customerName)
		|| left.estimateNumber.localeCompare(right.estimateNumber);
}

function shiftIsoDate(value, dayDelta) {
	const anchor = parseIsoDateAtNoon(value) || parseIsoDateAtNoon(getTodayIsoDate()) || new Date();
	const shifted = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + dayDelta, 12);
	return formatDateAsIso(shifted);
}

function getWeekStartIsoDate(value) {
	const anchor = parseIsoDateAtNoon(value) || parseIsoDateAtNoon(getTodayIsoDate()) || new Date();
	return shiftIsoDate(formatDateAsIso(anchor), -anchor.getDay());
}

function normalizeTimeValue(value = '') {
	const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return '';
	}
	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
		return '';
	}
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function timeSortValue(value = '') {
	const normalized = normalizeTimeValue(value);
	if (!normalized) {
		return Number.MAX_SAFE_INTEGER;
	}
	const [hours, minutes] = normalized.split(':').map(Number);
	return (hours * 60) + minutes;
}

function formatScheduleTime(value = '') {
	const normalized = normalizeTimeValue(value);
	if (!normalized) {
		return '';
	}
	const [hours, minutes] = normalized.split(':').map(Number);
	const anchor = new Date(2000, 0, 1, hours, minutes, 0, 0);
	return anchor.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getScheduleFieldMeta(entryType) {
	return entryType === 'reminder'
		? { dateField: 'reminderDate', timeField: 'reminderTime', noteField: 'reminderNote', fallbackNoteField: 'internalOwnerNotes', label: 'Reminder' }
		: { dateField: 'dueDate', timeField: 'dueTime', noteField: 'internalOwnerNotes', fallbackNoteField: 'reminderNote', label: 'Due Date' };
}

function getScheduleEntryNote(estimate, entryType) {
	const meta = getScheduleFieldMeta(entryType);
	return String(estimate?.[meta.noteField] || estimate?.[meta.fallbackNoteField] || '').trim();
}

function formatScheduleSlotLabel(dateValue, timeValue = '') {
	const dateLabel = formatLongDate(dateValue);
	const timeLabel = formatScheduleTime(timeValue);
	return timeLabel ? `${dateLabel} at ${timeLabel}` : dateLabel;
}

function getScheduleEntries() {
	const currentIsPersisted = state.current ? state.estimates.some((estimate) => estimate.id === state.current.id) : false;
	return getCalendarEstimates().flatMap((estimate) => {
		const timing = getEstimateTimingInfo(estimate);
		const vehicleLabel = [estimate.vehicleYear, estimate.vehicleMake, estimate.vehicleModel].filter(Boolean).join(' ') || 'Vehicle pending';
		const shared = {
			estimateId: estimate.id,
			estimateNumber: estimate.estimateNumber,
			customerName: estimate.customerName || 'No customer',
			vehicleLabel,
			assigneeLabel: estimate.assignedTo || 'Unassigned',
			statusLabel: estimate.estimateStatus || 'Draft',
			urgencyLabel: timing.urgencyLabel,
			isUnsaved: Boolean(state.current && estimate.id === state.current.id && (state.dirty || !currentIsPersisted))
		};
		const entries = [];
		if (parseIsoDateAtNoon(estimate.dueDate)) {
			const dueTime = normalizeTimeValue(estimate.dueTime);
			entries.push({
				...shared,
				date: estimate.dueDate,
				time: dueTime,
				timeLabel: formatScheduleTime(dueTime),
				type: 'due',
				typeLabel: 'Due Date',
				calendarClass: timing.dueOffsetDays !== null && timing.dueOffsetDays < 0 ? 'schedule-type-overdue' : (timing.dueOffsetDays !== null && timing.dueOffsetDays <= 2 ? 'schedule-type-soon' : 'schedule-type-due'),
				detailText: `${timing.dueState}${dueTime ? ` at ${formatScheduleTime(dueTime)}` : ''}`,
				note: getScheduleEntryNote(estimate, 'due')
			});
		}
		if (parseIsoDateAtNoon(estimate.reminderDate)) {
			const reminderTime = normalizeTimeValue(estimate.reminderTime);
			entries.push({
				...shared,
				date: estimate.reminderDate,
				time: reminderTime,
				timeLabel: formatScheduleTime(reminderTime),
				type: 'reminder',
				typeLabel: 'Reminder',
				calendarClass: timing.reminderOffsetDays !== null && timing.reminderOffsetDays < 0 ? 'schedule-type-overdue' : (timing.reminderOffsetDays !== null && timing.reminderOffsetDays <= 1 ? 'schedule-type-soon' : 'schedule-type-reminder'),
				detailText: `${timing.reminderState}${reminderTime ? ` at ${formatScheduleTime(reminderTime)}` : ''}`,
				note: getScheduleEntryNote(estimate, 'reminder')
			});
		}
		return entries;
	}).sort(compareScheduleEntries);
}

function getCalendarVisibleRange() {
	const calendarView = state.calendarView === 'week' ? 'week' : 'month';
	if (calendarView === 'week') {
		const anchorDate = state.calendarSelectedDate || getTodayIsoDate();
		const start = getWeekStartIsoDate(anchorDate);
		const end = shiftIsoDate(start, 6);
		state.calendarMonth = start.slice(0, 7);
		return {
			view: 'week',
			start,
			end,
			label: `Week of ${formatLongDate(start)}`,
			selectionFallback: start,
			cellCount: 7,
			gridStart: parseIsoDateAtNoon(start)
		};
	}
	const monthKey = ensureCalendarMonth();
	const [year, month] = monthKey.split('-').map(Number);
	const monthStart = `${monthKey}-01`;
	const lastDate = new Date(year, month, 0, 12);
	const monthEnd = formatDateAsIso(lastDate);
	const firstOfMonth = new Date(year, month - 1, 1, 12);
	const gridStart = new Date(year, month - 1, 1 - firstOfMonth.getDay(), 12);
	return {
		view: 'month',
		start: monthStart,
		end: monthEnd,
		label: firstOfMonth.toLocaleDateString([], { month: 'long', year: 'numeric' }),
		selectionFallback: monthStart,
		cellCount: 42,
		gridStart
	};
}

function getScheduleEntriesForRange(range) {
	return getScheduleEntries().filter((entry) => entry.date >= range.start && entry.date <= range.end);
}

function getFirstScheduledDateInRange(range, eventMap) {
	return [...eventMap.keys()].filter((dateKey) => dateKey >= range.start && dateKey <= range.end).sort()[0] || '';
}

function resolveCalendarSelectedDate(range, eventMap) {
	if (state.calendarSelectedDate && state.calendarSelectedDate >= range.start && state.calendarSelectedDate <= range.end) {
		return state.calendarSelectedDate;
	}
	const today = getTodayIsoDate();
	if (today >= range.start && today <= range.end) {
		return today;
	}
	return getFirstScheduledDateInRange(range, eventMap) || range.selectionFallback;
}

function openEstimateFromCalendar(estimateId) {
	if (!estimateId || (state.current && state.current.id === estimateId)) {
		return;
	}
	const match = state.estimates.find((estimate) => estimate.id === estimateId);
	if (match) {
		setCurrent(match);
	}
}

function setScheduleComposeStatus(message, tone = '') {
	const status = $('scheduleComposeStatus');
	if (!status) {
		return;
	}
	status.textContent = message;
	status.className = tone ? `helper-text ${tone}` : 'helper-text';
}

function renderScheduleComposer(message = '') {
	const selectedDate = state.calendarSelectedDate || getTodayIsoDate();
	const editState = state.scheduleComposerEdit;
	if ($('scheduleComposeDateLabel')) {
		$('scheduleComposeDateLabel').textContent = `${editState ? 'Editing:' : 'Selected:'} ${formatLongDate(selectedDate)}`;
	}
	if ($('scheduleDraftCustomerName') && !$('scheduleDraftCustomerName').value.trim()) {
		$('scheduleDraftCustomerName').value = state.current?.customerName || '';
	}
	if ($('scheduleDraftAssignee') && !$('scheduleDraftAssignee').value.trim()) {
		$('scheduleDraftAssignee').value = state.current?.assignedTo || '';
	}
	if ($('scheduleDraftRepairType')) {
		$('scheduleDraftRepairType').value = state.current?.repairType || 'Collision';
	}
	if ($('scheduleDraftTime') && !$('scheduleDraftTime').value) {
		const selectedType = $('scheduleDraftType')?.value === 'reminder' ? 'reminder' : 'due';
		const suggestedTime = selectedType === 'reminder' ? state.current?.reminderTime : state.current?.dueTime;
		$('scheduleDraftTime').value = normalizeTimeValue(suggestedTime);
	}
	if ($('scheduleDraftType')) {
		$('scheduleDraftType').disabled = Boolean(editState);
	}
	if ($('scheduleCreateBtn')) {
		$('scheduleCreateBtn').textContent = editState ? 'Update Schedule' : 'Create New Schedule';
	}
	if ($('scheduleCurrentEstimateBtn')) {
		$('scheduleCurrentEstimateBtn').disabled = Boolean(editState);
	}
	if ($('scheduleCancelEditBtn')) {
		$('scheduleCancelEditBtn').hidden = !editState;
	}
	if (message) {
		setScheduleComposeStatus(message, 'lookup-success');
		return;
	}
	if (editState) {
		setScheduleComposeStatus(`Update this ${editState.entryType === 'due' ? 'due date' : 'reminder'} and save it back to the schedule.`, 'lookup-warning');
		return;
	}
	setScheduleComposeStatus('Open a day, then create a new schedule or place the current estimate on that date.');
}

function getScheduleDraftValues() {
	return {
		selectedDate: state.calendarSelectedDate || getTodayIsoDate(),
		customerName: String($('scheduleDraftCustomerName')?.value || '').trim(),
		assignee: String($('scheduleDraftAssignee')?.value || '').trim(),
		entryType: $('scheduleDraftType')?.value === 'reminder' ? 'reminder' : 'due',
		repairType: $('scheduleDraftRepairType')?.value || 'Collision',
		scheduleTime: normalizeTimeValue($('scheduleDraftTime')?.value || ''),
		note: String($('scheduleDraftNote')?.value || '').trim()
	};
}

function clearScheduleDraft({ keepSelectedDate = true } = {}) {
	state.scheduleComposerEdit = null;
	if ($('scheduleDraftCustomerName')) {
		$('scheduleDraftCustomerName').value = '';
	}
	if ($('scheduleDraftAssignee')) {
		$('scheduleDraftAssignee').value = '';
	}
	if ($('scheduleDraftType')) {
		$('scheduleDraftType').value = 'due';
	}
	if ($('scheduleDraftRepairType')) {
		$('scheduleDraftRepairType').value = state.current?.repairType || 'Collision';
	}
	if ($('scheduleDraftTime')) {
		$('scheduleDraftTime').value = '';
	}
	if ($('scheduleDraftNote')) {
		$('scheduleDraftNote').value = '';
	}
	if (!keepSelectedDate) {
		state.calendarSelectedDate = getTodayIsoDate();
	}
	renderScheduleComposer();
}

function populateScheduleComposerFromEntry(estimateId, entryType) {
	const entry = getScheduleEntries().find((item) => item.estimateId === estimateId && item.type === entryType);
	if (!entry) {
		setScheduleComposeStatus('That schedule item could not be loaded for editing.', 'lookup-warning');
		return false;
	}
	state.scheduleComposerEdit = { estimateId, entryType };
	state.calendarSelectedDate = entry.date;
	state.calendarMonth = entry.date.slice(0, 7);
	if ($('scheduleDraftCustomerName')) {
		$('scheduleDraftCustomerName').value = entry.customerName || '';
	}
	if ($('scheduleDraftAssignee')) {
		$('scheduleDraftAssignee').value = entry.assigneeLabel === 'Unassigned' ? '' : entry.assigneeLabel;
	}
	if ($('scheduleDraftType')) {
		$('scheduleDraftType').value = entry.type;
	}
	if ($('scheduleDraftRepairType')) {
		const estimate = state.estimates.find((item) => item.id === estimateId) || (state.current?.id === estimateId ? state.current : null);
		$('scheduleDraftRepairType').value = estimate?.repairType || 'Collision';
	}
	if ($('scheduleDraftTime')) {
		$('scheduleDraftTime').value = entry.time || '';
	}
	if ($('scheduleDraftNote')) {
		$('scheduleDraftNote').value = entry.note || '';
	}
	renderSchedulingCalendar();
	setScheduleComposeStatus(`Editing ${entry.typeLabel.toLowerCase()} for ${entry.customerName}.`, 'lookup-warning');
	return true;
}

function updateScheduleEntryFromDraft() {
	const editState = state.scheduleComposerEdit;
	if (!editState) {
		return false;
	}
	const draft = getScheduleDraftValues();
	const meta = getScheduleFieldMeta(editState.entryType);
	const timestamp = new Date().toISOString();
	const slotLabel = formatScheduleSlotLabel(draft.selectedDate, draft.scheduleTime);

	const applyUpdate = (estimate) => {
		estimate.customerName = draft.customerName || estimate.customerName;
		estimate.assignedTo = draft.assignee;
		estimate.repairType = draft.repairType;
		estimate[meta.dateField] = draft.selectedDate;
		estimate[meta.timeField] = draft.scheduleTime;
		estimate[meta.noteField] = draft.note;
	};

	if (state.current && state.current.id === editState.estimateId) {
		applyUpdate(state.current);
		if ($('customerName')) {
			$('customerName').value = state.current.customerName;
		}
		if ($('assignedTo')) {
			$('assignedTo').value = state.current.assignedTo;
		}
		if ($('repairType')) {
			$('repairType').value = state.current.repairType;
		}
		if ($(meta.dateField)) {
			$(meta.dateField).value = state.current[meta.dateField];
		}
		if ($(meta.noteField)) {
			$(meta.noteField).value = state.current[meta.noteField];
		}
		appendHistory(`${meta.label} updated from calendar to ${slotLabel}`, 'system', timestamp);
		const saved = saveCurrent({ silent: true });
		if (!saved) {
			setScheduleComposeStatus('Local storage is full. The updated schedule could not be saved.', 'lookup-warning');
			return false;
		}
		clearScheduleDraft();
		state.calendarSelectedDate = draft.selectedDate;
		state.calendarMonth = draft.selectedDate.slice(0, 7);
		setScheduleComposeStatus(`Updated the ${meta.label.toLowerCase()} for ${slotLabel}.`, 'lookup-success');
		return true;
	}

	const estimateIndex = state.estimates.findIndex((estimate) => estimate.id === editState.estimateId);
	if (estimateIndex < 0) {
		setScheduleComposeStatus('That schedule item no longer exists.', 'lookup-warning');
		return false;
	}
	const updated = normalizeEstimate(structuredClone(state.estimates[estimateIndex]));
	applyUpdate(updated);
	updated.updatedAt = timestamp;
	updated.history.unshift(createHistoryEntry(`${meta.label} updated from calendar to ${slotLabel}`, 'system', timestamp));
	updated.history = updated.history.slice(0, 25);
	state.estimates[estimateIndex] = updated;
	if (!persist()) {
		setScheduleComposeStatus('Local storage is full. The updated schedule could not be saved.', 'lookup-warning');
		return false;
	}
	state.lastSavedAt = Date.now();
	state.calendarSelectedDate = draft.selectedDate;
	state.calendarMonth = draft.selectedDate.slice(0, 7);
	clearScheduleDraft();
	renderSavedList();
	setScheduleComposeStatus(`Updated the ${meta.label.toLowerCase()} for ${slotLabel}.`, 'lookup-success');
	return true;
}

function deleteCalendarEntry(estimateId, entryType) {
	if (!estimateId || !['due', 'reminder'].includes(entryType)) {
		return false;
	}
	const meta = getScheduleFieldMeta(entryType);
	const timestamp = new Date().toISOString();
	const historyNote = `${meta.label} cleared from the schedule calendar`;

	if (state.current && state.current.id === estimateId) {
		state.current[meta.dateField] = '';
		state.current[meta.timeField] = '';
		if ($(meta.dateField)) {
			$(meta.dateField).value = '';
		}
		appendHistory(historyNote, 'system', timestamp);
		if (state.scheduleComposerEdit?.estimateId === estimateId && state.scheduleComposerEdit?.entryType === entryType) {
			clearScheduleDraft();
		}
		return saveCurrent({ silent: true });
	}

	const estimateIndex = state.estimates.findIndex((estimate) => estimate.id === estimateId);
	if (estimateIndex < 0) {
		return false;
	}
	const updated = normalizeEstimate(structuredClone(state.estimates[estimateIndex]));
	updated[meta.dateField] = '';
	updated[meta.timeField] = '';
	updated.updatedAt = timestamp;
	updated.history.unshift(createHistoryEntry(historyNote, 'system', timestamp));
	updated.history = updated.history.slice(0, 25);
	state.estimates[estimateIndex] = updated;
	if (!persist()) {
		updateSaveState('Storage full');
		return false;
	}
	if (state.scheduleComposerEdit?.estimateId === estimateId && state.scheduleComposerEdit?.entryType === entryType) {
		clearScheduleDraft();
	}
	state.lastSavedAt = Date.now();
	renderSavedList();
	updateSaveState('Schedule updated');
	return true;
}

function createScheduleForSelectedDay() {
	if (state.scheduleComposerEdit) {
		return updateScheduleEntryFromDraft();
	}
	const draft = getScheduleDraftValues();
	if (!draft.customerName) {
		setScheduleComposeStatus('Enter a customer or job name before creating the schedule.', 'lookup-warning');
		return false;
	}
	const estimate = defaultEstimate();
	estimate.customerName = draft.customerName;
	estimate.assignedTo = draft.assignee;
	estimate.repairType = draft.repairType;
	estimate.estimateDate = draft.selectedDate;
	estimate.estimateStatus = 'Draft';
	if (draft.entryType === 'due') {
		estimate.dueDate = draft.selectedDate;
		estimate.dueTime = draft.scheduleTime;
	} else {
		estimate.reminderDate = draft.selectedDate;
		estimate.reminderTime = draft.scheduleTime;
	}
	if (draft.note) {
		const meta = getScheduleFieldMeta(draft.entryType);
		estimate[meta.noteField] = draft.note;
	}
	const timestamp = new Date().toISOString();
	estimate.createdAt = timestamp;
	estimate.updatedAt = timestamp;
	estimate.history.unshift(createHistoryEntry(`Schedule created for ${formatScheduleSlotLabel(draft.selectedDate, draft.scheduleTime)} as ${draft.entryType === 'due' ? 'Due Date' : 'Reminder'}`, 'system', timestamp));
	state.estimates.unshift(estimate);
	if (!persist()) {
		state.estimates.shift();
		setScheduleComposeStatus('Local storage is full. The new schedule could not be saved.', 'lookup-warning');
		return false;
	}
	state.lastSavedAt = Date.now();
	state.calendarSelectedDate = draft.selectedDate;
	state.calendarMonth = draft.selectedDate.slice(0, 7);
	clearScheduleDraft();
	setCurrent(estimate);
	setScheduleComposeStatus(`Created a new scheduled estimate for ${formatScheduleSlotLabel(draft.selectedDate, draft.scheduleTime)}.`, 'lookup-success');
	return true;
}

function scheduleCurrentEstimateForSelectedDay() {
	const draft = getScheduleDraftValues();
	const selectedDate = draft.selectedDate;
	syncFromForm();
	syncLinesFromTable();
	syncChecklist();
	if (draft.customerName) {
		state.current.customerName = draft.customerName;
		if ($('customerName')) {
			$('customerName').value = draft.customerName;
		}
	}
	state.current.assignedTo = draft.assignee;
	state.current.repairType = draft.repairType;
	if ($('assignedTo')) {
		$('assignedTo').value = draft.assignee;
	}
	if ($('repairType')) {
		$('repairType').value = draft.repairType;
	}
	if (draft.entryType === 'due') {
		state.current.dueDate = selectedDate;
		state.current.dueTime = draft.scheduleTime;
		if ($('dueDate')) {
			$('dueDate').value = selectedDate;
		}
	} else {
		state.current.reminderDate = selectedDate;
		state.current.reminderTime = draft.scheduleTime;
		if ($('reminderDate')) {
			$('reminderDate').value = selectedDate;
		}
	}
	if (draft.note) {
		const meta = getScheduleFieldMeta(draft.entryType);
		state.current[meta.noteField] = draft.note;
		if ($(meta.noteField)) {
			$(meta.noteField).value = draft.note;
		}
		if ($('reminderNote') && meta.noteField === 'reminderNote') {
			$('reminderNote').value = draft.note;
		}
	}
	appendHistory(`Scheduled from calendar for ${formatScheduleSlotLabel(selectedDate, draft.scheduleTime)} as ${draft.entryType === 'due' ? 'Due Date' : 'Reminder'}`, 'system');
	state.calendarSelectedDate = selectedDate;
	state.calendarMonth = selectedDate.slice(0, 7);
	const saved = saveCurrent({ silent: true });
	if (!saved) {
		setScheduleComposeStatus('Local storage is full. The current estimate schedule could not be saved.', 'lookup-warning');
		return false;
	}
	clearScheduleDraft();
	setScheduleComposeStatus(`Scheduled the current estimate for ${formatScheduleSlotLabel(selectedDate, draft.scheduleTime)}.`, 'lookup-success');
	return true;
}

function getContentPanelTitle(sectionId) {
	const panel = document.querySelector(`[data-content-panel="${sectionId}"]`);
	if (panel?.dataset.panelTitle) {
		return panel.dataset.panelTitle;
	}
	const tabButton = document.querySelector(`[data-content-tab="${sectionId}"]`);
	return tabButton?.textContent?.trim() || 'Section Editor';
}

function renderContentWorkspace() {
	const activeTab = state.activeContentTab || 'overview';
	const modalSectionId = state.sectionModal?.sectionId || '';
	document.querySelectorAll('[data-content-tab]').forEach((button) => {
		const isActive = button.dataset.contentTab === activeTab;
		button.classList.toggle('is-active', isActive);
		button.setAttribute('aria-selected', isActive ? 'true' : 'false');
	});
	document.querySelectorAll('[data-content-panel]').forEach((panel) => {
		const shouldShow = panel.dataset.contentPanel === activeTab || panel.dataset.contentPanel === modalSectionId;
		panel.classList.toggle('is-active', shouldShow);
		panel.hidden = !shouldShow;
	});
	if ($('sectionEditModal')) {
		const modalOpen = Boolean(state.sectionModal);
		$('sectionEditModal').classList.toggle('is-open', modalOpen);
		$('sectionEditModal').setAttribute('aria-hidden', modalOpen ? 'false' : 'true');
	}
	if ($('sectionEditTitle')) {
		$('sectionEditTitle').textContent = state.sectionModal ? `${getContentPanelTitle(state.sectionModal.sectionId)} Editor` : 'Section Editor';
	}
	document.body.classList.toggle('section-modal-open', Boolean(state.sectionModal));
}

function setActiveContentTab(tabId) {
	if (!tabId || !document.querySelector(`[data-content-panel="${tabId}"]`)) {
		return;
	}
	if (state.sectionModal && state.sectionModal.sectionId !== tabId) {
		closeSectionModal({ restoreFocus: false });
	}
	state.activeContentTab = tabId;
	renderContentWorkspace();
}

function openSectionModal(sectionId = state.activeContentTab) {
	const panel = document.querySelector(`[data-content-panel="${sectionId}"]`);
	const modalBody = $('sectionEditBody');
	if (!panel || !modalBody) {
		return false;
	}
	if (state.sectionModal?.sectionId === sectionId) {
		renderContentWorkspace();
		return true;
	}
	if (state.sectionModal) {
		closeSectionModal({ restoreFocus: false });
	}
	state.activeContentTab = sectionId;
	const placeholder = document.createElement('div');
	placeholder.className = 'content-modal-placeholder';
	placeholder.dataset.sectionPlaceholder = sectionId;
	panel.before(placeholder);
	modalBody.appendChild(panel);
	panel.classList.add('is-modalized');
	state.sectionModal = { sectionId };
	renderContentWorkspace();
	return true;
}

function closeSectionModal({ restoreFocus = true } = {}) {
	if (!state.sectionModal) {
		return false;
	}
	const { sectionId } = state.sectionModal;
	const panel = document.querySelector(`[data-content-panel="${sectionId}"]`);
	const placeholder = document.querySelector(`[data-section-placeholder="${sectionId}"]`);
	if (panel) {
		panel.classList.remove('is-modalized');
	}
	if (panel && placeholder) {
		placeholder.replaceWith(panel);
	}
	state.sectionModal = null;
	renderContentWorkspace();
	if (restoreFocus) {
		document.querySelector(`[data-section-popout="${sectionId}"]`)?.focus();
	}
	return true;
}

function navigateCalendar(step) {
	if (state.calendarView === 'week') {
		const anchor = state.calendarSelectedDate || getTodayIsoDate();
		state.calendarSelectedDate = shiftIsoDate(anchor, step * 7);
		state.calendarMonth = state.calendarSelectedDate.slice(0, 7);
	} else {
		state.calendarMonth = addMonthsToMonthKey(ensureCalendarMonth(), step);
		state.calendarSelectedDate = '';
	}
	renderSchedulingCalendar();
}

function renderSchedulingCalendar() {
	const grid = $('scheduleCalendarGrid');
	const agendaList = $('scheduleAgendaList');
	const weekdayHeadings = document.querySelector('.calendar-weekdays');
	if (!grid || !agendaList || !weekdayHeadings) {
		return;
	}

	const range = getCalendarVisibleRange();
	const entries = getScheduleEntriesForRange(range);
	const eventMap = new Map();
	entries.forEach((entry) => {
		if (!eventMap.has(entry.date)) {
			eventMap.set(entry.date, []);
		}
		eventMap.get(entry.date).push(entry);
	});

	state.calendarSelectedDate = resolveCalendarSelectedDate(range, eventMap);
	state.calendarMonth = state.calendarSelectedDate.slice(0, 7);
	$('scheduleMonthLabel').textContent = range.label;
	$('scheduleScopeText').textContent = `${formatCalendarScope().join(' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ')}${state.dirty ? ' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ includes current unsaved changes' : ''}`;
	$('scheduleSelectionLabel').textContent = `${state.calendarView === 'week' ? 'Focused day' : 'Selected day'}: ${formatLongDate(state.calendarSelectedDate)}`;
	renderScheduleComposer();
	if ($('scheduleViewSelect')) {
		$('scheduleViewSelect').value = state.calendarView;
	}

	const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	weekdayHeadings.innerHTML = weekdayNames.map((label) => `<span>${label}</span>`).join('');
	grid.classList.toggle('calendar-grid-week', state.calendarView === 'week');
	grid.innerHTML = '';

	const todayIso = getTodayIsoDate();
	for (let index = 0; index < range.cellCount; index += 1) {
		const day = new Date(range.gridStart.getFullYear(), range.gridStart.getMonth(), range.gridStart.getDate() + index, 12);
		const isoDate = formatDateAsIso(day);
		const dayEntries = (eventMap.get(isoDate) || []).slice().sort(compareScheduleEntries);
		const dueCount = dayEntries.filter((entry) => entry.type === 'due').length;
		const reminderCount = dayEntries.filter((entry) => entry.type === 'reminder').length;
		const cell = document.createElement('button');
		cell.type = 'button';
		cell.className = `calendar-day${range.view === 'month' && isoDate.slice(0, 7) !== ensureCalendarMonth() ? ' is-outside' : ''}${isoDate === todayIso ? ' is-today' : ''}${isoDate === state.calendarSelectedDate ? ' is-selected' : ''}${dayEntries.length ? ' has-events' : ''}`;
		cell.dataset.date = isoDate;
		const previewMarkup = dayEntries.slice(0, range.view === 'week' ? 4 : 2).map((entry) => `
			<div class="calendar-entry-preview ${entry.calendarClass} schedule-draggable" draggable="true" data-estimate-id="${escapeHtml(entry.estimateId)}" data-entry-type="${escapeHtml(entry.type)}" data-date="${escapeHtml(entry.date)}">
				<span>${escapeHtml(entry.type === 'due' ? 'Due' : 'Rem')}${entry.timeLabel ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(entry.timeLabel)}` : ''}</span>
				<strong>${escapeHtml(entry.customerName)}</strong>
			</div>
		`).join('');
		cell.innerHTML = `
			<div class="calendar-day-top">
				<div class="calendar-day-heading">
					<span class="calendar-day-weekday">${weekdayNames[day.getDay()]}</span>
					<strong>${range.view === 'week' ? formatShortDate(isoDate) : day.getDate()}</strong>
				</div>
				${dayEntries.length ? `<span class="calendar-day-count">${dayEntries.length}</span>` : ''}
			</div>
			${(dueCount || reminderCount) ? `<div class="calendar-day-badges">
				${dueCount ? `<span class="calendar-count-pill count-due">${dueCount} due</span>` : ''}
				${reminderCount ? `<span class="calendar-count-pill count-reminder">${reminderCount} rem</span>` : ''}
			</div>` : '<div class="calendar-day-badges"></div>'}
			<div class="calendar-day-preview">${previewMarkup || '<span class="calendar-empty-slot">Open</span>'}${dayEntries.length > (range.view === 'week' ? 4 : 2) ? `<small class="calendar-more">+${dayEntries.length - (range.view === 'week' ? 4 : 2)} more</small>` : ''}</div>
		`;
		grid.appendChild(cell);
	}

	const selectedEntries = (eventMap.get(state.calendarSelectedDate) || []).slice().sort(compareScheduleEntries);
	$('scheduleAgendaCount').textContent = `${selectedEntries.length} item${selectedEntries.length === 1 ? '' : 's'}`;
	if (!selectedEntries.length) {
		agendaList.innerHTML = '<div class="chart-empty">No scheduled items on this day.</div>';
		return;
	}
	agendaList.innerHTML = selectedEntries.map((entry) => `
		<article class="schedule-agenda-item schedule-draggable" draggable="true" data-estimate-id="${escapeHtml(entry.estimateId)}" data-entry-type="${escapeHtml(entry.type)}" data-date="${escapeHtml(entry.date)}">
			<div class="schedule-agenda-top">
				<div class="schedule-agenda-badges">
					<span class="schedule-type-pill ${entry.calendarClass}">${escapeHtml(entry.typeLabel)}</span>
					<span class="schedule-agenda-urgency">${escapeHtml(entry.urgencyLabel)}</span>
				</div>
				<div class="schedule-agenda-actions">
					<button type="button" class="schedule-agenda-action" data-agenda-action="edit" data-estimate-id="${escapeHtml(entry.estimateId)}" data-entry-type="${escapeHtml(entry.type)}">Edit</button>
					<button type="button" class="schedule-agenda-action secondary-btn" data-agenda-action="delete" data-estimate-id="${escapeHtml(entry.estimateId)}" data-entry-type="${escapeHtml(entry.type)}">Delete</button>
				</div>
			</div>
			<button type="button" class="schedule-agenda-open" data-agenda-action="open" data-estimate-id="${escapeHtml(entry.estimateId)}">
				<strong>${escapeHtml(entry.estimateNumber)} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(entry.customerName)}</strong>
				<small>${entry.timeLabel ? `${escapeHtml(entry.timeLabel)} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ` : ''}${escapeHtml(entry.vehicleLabel)} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(entry.assigneeLabel)} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(entry.statusLabel)}</small>
				<small>${escapeHtml(entry.detailText)}${entry.note ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(entry.note)}` : ''}</small>
				${entry.isUnsaved ? '<small class="schedule-unsaved-note">Current form changes included</small>' : ''}
			</button>
		</article>
	`).join('');
}

function rescheduleCalendarEntry(estimateId, entryType, nextDate) {
	if (!estimateId || !nextDate || !['due', 'reminder'].includes(entryType)) {
		return false;
	}
	const field = entryType === 'due' ? 'dueDate' : 'reminderDate';
	const label = entryType === 'due' ? 'Due date' : 'Reminder';
	const timestamp = new Date().toISOString();
	const historyNote = `${label} moved to ${formatLongDate(nextDate)} from schedule calendar`;

	if (state.current && state.current.id === estimateId) {
		state.current[field] = nextDate;
		if ($(field)) {
			$(field).value = nextDate;
		}
		appendHistory(historyNote, 'system', timestamp);
		state.calendarSelectedDate = nextDate;
		state.calendarMonth = nextDate.slice(0, 7);
		return saveCurrent({ silent: true });
	}

	const estimateIndex = state.estimates.findIndex((estimate) => estimate.id === estimateId);
	if (estimateIndex < 0) {
		return false;
	}
	const updated = normalizeEstimate(structuredClone(state.estimates[estimateIndex]));
	updated[field] = nextDate;
	updated.updatedAt = timestamp;
	updated.history.unshift(createHistoryEntry(historyNote, 'system', timestamp));
	updated.history = updated.history.slice(0, 25);
	state.estimates[estimateIndex] = updated;
	if (!persist()) {
		updateSaveState('Storage full');
		return false;
	}
	state.lastSavedAt = Date.now();
	state.calendarSelectedDate = nextDate;
	state.calendarMonth = nextDate.slice(0, 7);
	renderSavedList();
	updateSaveState('Schedule updated');
	return true;
}

function toggleArchiveCurrent() {
	if (!state.current) {
		return;
	}
	state.current.isArchived = !state.current.isArchived;
	appendHistory(state.current.isArchived ? 'Estimate archived' : 'Estimate restored', 'system');
	renderArchiveButton();
	markDirty();
}

function archiveVisibleEstimates(archived) {
	const visibleIds = new Set(getVisibleEstimates().map((estimate) => estimate.id));
	if (visibleIds.size === 0) {
		return;
	}

	const timestamp = new Date().toISOString();
	state.estimates = state.estimates.map((estimate) => {
		if (!visibleIds.has(estimate.id)) {
			return estimate;
		}
		const updated = normalizeEstimate(structuredClone(estimate));
		updated.isArchived = archived;
		updated.updatedAt = timestamp;
		updated.history.unshift(createHistoryEntry(archived ? 'Estimate archived in bulk action' : 'Estimate restored in bulk action', 'system', timestamp));
		updated.history = updated.history.slice(0, 25);
		return updated;
	});
	persist();
	if (state.current) {
		const refreshedCurrent = state.estimates.find((estimate) => estimate.id === state.current.id);
		if (refreshedCurrent) {
			setCurrent(refreshedCurrent);
			return;
		}
	}
	renderSavedList();
}

function deleteArchivedEstimates() {
	const archivedCount = state.estimates.filter((estimate) => estimate.isArchived).length;
	if (archivedCount === 0) {
		return;
	}
	const confirmed = window.confirm(`Delete ${archivedCount} archived estimate(s)? This cannot be undone.`);
	if (!confirmed) {
		return;
	}
	state.estimates = state.estimates.filter((estimate) => !estimate.isArchived);
	persist();
	if (state.current && state.current.isArchived) {
		setCurrent(state.estimates[0] || defaultEstimate());
		return;
	}
	renderSavedList();
}

function insertLaborGuide(guideId) {
	const guide = LINE_GUIDE_PRESETS.find((item) => item.id === guideId);
	if (!guide) {
		return;
	}
	addLine(guide.line);
}

function rateForCategory(category) {
	switch (category) {
		case 'Body':
			return Number(state.current.bodyRate || 0);
		case 'Paint':
			return Number(state.current.paintRate || 0);
		case 'Frame':
			return Number(state.current.frameRate || 0);
		case 'Mechanical':
			return Number(state.current.mechRate || 0);
		case 'Detail':
			return 65;
		default:
			return 0;
	}
}

function defaultHoursForLine(category, operation) {
	return Number(LINE_OPERATION_HOUR_DEFAULTS[category]?.[operation] ?? LINE_OPERATION_HOUR_DEFAULTS.Body.Repair);
}

function applyLineDefaults(row, { updateRate = false, updateHours = false } = {}) {
	if (!row) {
		return;
	}
	const category = row.querySelector('.line-category').value;
	const operation = row.querySelector('.line-operation').value;
	if (updateRate) {
		row.querySelector('.line-rate').value = rateForCategory(category);
	}
	if (updateHours) {
		row.querySelector('.line-hours').value = defaultHoursForLine(category, operation);
	}
}

function addLine(data = {}) {
	state.current.lines.push({
		id: crypto.randomUUID(),
		category: data.category || 'Body',
		operation: data.operation || 'Repair',
		panel: data.panel || '',
		description: data.description || '',
		qty: Number(data.qty ?? 1),
		hours: Number(data.hours ?? defaultHoursForLine(data.category || 'Body', data.operation || 'Repair')),
		rate: Number(data.rate ?? rateForCategory(data.category || 'Body')),
		parts: Number(data.parts ?? 0),
		materials: Number(data.materials ?? 0)
	});
	renderLines();
	recalc();
	markDirty();
}

function renderLines() {
	const body = $('linesBody');
	body.innerHTML = '';

	state.current.lines.forEach((line) => {
		const row = $('lineRowTemplate').content.firstElementChild.cloneNode(true);
		row.dataset.id = line.id;
		row.querySelector('.line-category').value = line.category;
		row.querySelector('.line-operation').value = line.operation;
		row.querySelector('.line-panel').value = line.panel;
		row.querySelector('.line-description').value = line.description;
		row.querySelector('.line-qty').value = line.qty;
		row.querySelector('.line-hours').value = line.hours;
		row.querySelector('.line-rate').value = line.rate;
		row.querySelector('.line-parts').value = line.parts;
		row.querySelector('.line-materials').value = line.materials;
		body.appendChild(row);
	});
}

function syncLinesFromTable() {
	state.current.lines = [...document.querySelectorAll('#linesBody tr')].map((row) => ({
		id: row.dataset.id,
		category: row.querySelector('.line-category').value,
		operation: row.querySelector('.line-operation').value,
		panel: row.querySelector('.line-panel').value,
		description: row.querySelector('.line-description').value,
		qty: Number(row.querySelector('.line-qty').value || 0),
		hours: Number(row.querySelector('.line-hours').value || 0),
		rate: Number(row.querySelector('.line-rate').value || 0),
		parts: Number(row.querySelector('.line-parts').value || 0),
		materials: Number(row.querySelector('.line-materials').value || 0)
	}));
}

function renderChecklist() {
	const wrap = $('checklistGrid');
	wrap.innerHTML = '';

	CHECKLIST_ITEMS.forEach((item) => {
		const entry = state.current.checklist[item] || { status: 'OK', note: '' };
		const div = document.createElement('div');
		div.className = 'check-item';
		div.innerHTML = `
			<strong>${escapeHtml(item)}</strong>
			<select data-item="${escapeHtml(item)}" class="check-status">
				<option ${entry.status === 'OK' ? 'selected' : ''}>OK</option>
				<option ${entry.status === 'Damage' ? 'selected' : ''}>Damage</option>
				<option ${entry.status === 'N/A' ? 'selected' : ''}>N/A</option>
				<option ${entry.status === 'Needs Review' ? 'selected' : ''}>Needs Review</option>
			</select>
			<input data-item="${escapeHtml(item)}" class="check-note" type="text" placeholder="Note" value="${escapeHtml(entry.note)}" />
		`;
		wrap.appendChild(div);
	});
}

function renderPhotos() {
	const grid = $('photoGrid');
	grid.innerHTML = '';
	$('photoDropZone').classList.toggle('is-disabled', state.current.photos.length >= MAX_PHOTOS);

	$('photoCountText').textContent = `${state.current.photos.length} / ${MAX_PHOTOS} photos`;
	$('addPhotosBtn').disabled = state.current.photos.length >= MAX_PHOTOS;

	if (state.current.photos.length === 0) {
		const empty = document.createElement('div');
		empty.className = 'photo-empty';
		empty.textContent = 'Add walkaround and damage photos to include visual evidence with the estimate packet.';
		grid.appendChild(empty);
		return;
	}

	state.current.photos.forEach((photo) => {
		const presetValue = PHOTO_CAPTION_PRESETS.includes(photo.caption) ? photo.caption : '__custom__';
		const presetOptions = ['<option value="">Choose preset</option>']
			.concat(PHOTO_CAPTION_PRESETS.map((preset) => `<option value="${escapeHtml(preset)}" ${presetValue === preset ? 'selected' : ''}>${escapeHtml(preset)}</option>`))
			.concat([`<option value="__custom__" ${presetValue === '__custom__' ? 'selected' : ''}>Custom caption</option>`])
			.join('');
		const figure = document.createElement('article');
		figure.className = 'photo-card';
		figure.draggable = true;
		figure.dataset.photoId = photo.id;
		figure.innerHTML = `
			<div class="photo-card-top">
				<span class="photo-drag-hint">Drag to reorder</span>
			</div>
			<img src="${photo.dataUrl}" alt="${escapeHtml(photo.caption || photo.name)}" class="photo-thumb" />
			<div class="photo-meta">
				<strong>${escapeHtml(photo.name)}</strong>
				<label>Preset<select class="photo-caption-preset" data-photo-id="${photo.id}">${presetOptions}</select></label>
				<label>Caption<input type="text" class="photo-caption" data-photo-id="${photo.id}" value="${escapeHtml(photo.caption)}" placeholder="Front bumper, left quarter, etc." /></label>
				<button type="button" class="delete-photo secondary-btn" data-photo-id="${photo.id}">Remove</button>
			</div>
		`;
		grid.appendChild(figure);
	});
}

function updatePhotoCaption(photoId, caption) {
	const photo = state.current.photos.find((item) => item.id === photoId);
	if (photo) {
		photo.caption = caption;
	}
}

function applyPhotoPreset(photoId, preset) {
	const photo = state.current.photos.find((item) => item.id === photoId);
	if (!photo) {
		return;
	}

	if (preset && preset !== '__custom__') {
		photo.caption = preset;
	}

	renderPhotos();
	markDirty();
}

function movePhoto(photoId, targetPhotoId) {
	if (!photoId || !targetPhotoId || photoId === targetPhotoId) {
		return;
	}

	const sourceIndex = state.current.photos.findIndex((photo) => photo.id === photoId);
	const targetIndex = state.current.photos.findIndex((photo) => photo.id === targetPhotoId);
	if (sourceIndex < 0 || targetIndex < 0) {
		return;
	}

	const [photo] = state.current.photos.splice(sourceIndex, 1);
	state.current.photos.splice(targetIndex, 0, photo);
	renderPhotos();
	markDirty();
}

function removePhoto(photoId) {
	state.current.photos = state.current.photos.filter((photo) => photo.id !== photoId);
	renderPhotos();
	markDirty();
}

function readFileAsDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
		reader.readAsDataURL(file);
	});
}

function loadImage(source) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error('Image could not be decoded.'));
		image.src = source;
	});
}

async function compressPhoto(file) {
	return compressImageFile(file, { maxDimension: PHOTO_MAX_DIMENSION, quality: PHOTO_QUALITY });
}

async function compressLogo(file) {
	return compressImageFile(file, { maxDimension: LOGO_MAX_DIMENSION, quality: 0.9, preservePng: true });
}

async function compressImageFile(file, { maxDimension, quality, preservePng = false }) {
	const dataUrl = await readFileAsDataUrl(file);
	const image = await loadImage(dataUrl);
	const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
	const width = Math.max(1, Math.round(image.width * scale));
	const height = Math.max(1, Math.round(image.height * scale));
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');
	if (!context) {
		throw new Error('Canvas is not available in this browser.');
	}
	context.drawImage(image, 0, 0, width, height);
	const outputType = preservePng && file.type === 'image/png' ? 'image/png' : 'image/jpeg';
	return canvas.toDataURL(outputType, quality);
}

async function addPhotos(files) {
	const incoming = [...files].filter((file) => file.type.startsWith('image/'));
	if (incoming.length === 0) {
		return;
	}

	const availableSlots = Math.max(0, MAX_PHOTOS - state.current.photos.length);
	if (availableSlots === 0) {
		window.alert(`This estimate already has the maximum of ${MAX_PHOTOS} photos.`);
		return;
	}

	const selected = incoming.slice(0, availableSlots);
	if (incoming.length > availableSlots) {
		window.alert(`Only the first ${availableSlots} photo(s) were added to keep the estimate packet manageable.`);
	}

	for (const file of selected) {
		try {
			const dataUrl = await compressPhoto(file);
			state.current.photos.push({
				id: crypto.randomUUID(),
				name: file.name,
				caption: '',
				dataUrl
			});
		} catch {
			window.alert(`Could not process ${file.name}. Try a different image.`);
		}
	}

	renderPhotos();
	markDirty();
}

async function setShopLogo(file) {
	try {
		state.current.shopLogoDataUrl = await compressLogo(file);
		state.current.shopLogoName = file.name;
		renderBrandProfile();
		markDirty();
	} catch {
		window.alert('Could not process that logo image. Try a different file.');
	}
}

function clearShopLogo() {
	state.current.shopLogoDataUrl = '';
	state.current.shopLogoName = '';
	renderBrandProfile();
	markDirty();
}

function syncChecklist() {
	document.querySelectorAll('.check-status').forEach((element) => {
		const item = element.dataset.item;
		state.current.checklist[item] = state.current.checklist[item] || {};
		state.current.checklist[item].status = element.value;
	});

	document.querySelectorAll('.check-note').forEach((element) => {
		const item = element.dataset.item;
		state.current.checklist[item] = state.current.checklist[item] || {};
		state.current.checklist[item].note = element.value;
	});
}

function summarizeEstimate(totals, estimate = state.current) {
	const requiredMissing = [
		['Customer name', estimate.customerName],
		['Phone', estimate.customerPhone],
		['Insurance company', estimate.insuranceCompany],
		['Claim number', estimate.claimNumber],
		['Vehicle year', estimate.vehicleYear],
		['Vehicle make', estimate.vehicleMake],
		['Vehicle model', estimate.vehicleModel],
		['VIN', estimate.vehicleVin],
		['Loss description', estimate.lossDescription]
	].filter(([, value]) => !String(value || '').trim()).map(([label]) => label);

	const checklistFlags = Object.entries(estimate.checklist)
		.filter(([, entry]) => entry.status === 'Damage' || entry.status === 'Needs Review')
		.map(([label, entry]) => ({ label, status: entry.status, note: entry.note }));

	const insightItems = [];
	if (totals.paintLabor > 0) {
		insightItems.push(`Paint work present with ${totals.paintHours.toFixed(1)} refinish hours.`);
	}
	if (totals.frameLabor > 0) {
		insightItems.push('Structural labor exists. Expect measurement and supplement review.');
	}
	if (totals.mechLabor > 0 || checklistFlags.some((flag) => /ADAS|Air bags|Cameras|Parking sensors/i.test(flag.label))) {
		insightItems.push('Calibration or mechanical review likely before final delivery.');
	}
	if (Number(estimate.deductible || 0) > 0) {
		insightItems.push(`Customer deductible is ${money(estimate.deductible)}.`);
	}
	if (estimate.photos.length > 0) {
		insightItems.push(`${estimate.photos.length} estimate photo${estimate.photos.length === 1 ? '' : 's'} attached for visual support.`);
	}
	if (String(estimate.supplementNotes || '').trim()) {
		insightItems.push('Supplement notes are present. Plan for insurer follow-up.');
	}
	if (estimate.lines.length === 0) {
		insightItems.push('No estimate lines added yet. Template shortcuts can seed the first draft.');
	}

	const laborHours = totals.bodyHours + totals.paintHours + totals.frameHours + totals.mechHours;
	let severity = 'Low';
	if (totals.grand > 3500 || laborHours > 18 || totals.frameLabor > 0) {
		severity = 'High';
	} else if (totals.grand > 1200 || laborHours > 7) {
		severity = 'Medium';
	}

	let readiness = 'Needs Work';
	let readinessNote = 'Fill core claim and vehicle fields';
	if (requiredMissing.length === 0 && estimate.lines.length > 0) {
		readiness = checklistFlags.length > 4 ? 'Review Before Send' : 'Ready to Share';
		readinessNote = checklistFlags.length > 4 ? 'Several flagged inspections still need confirmation' : 'Core information is present';
	}

	return {
		requiredMissing,
		checklistFlags,
		insightItems,
		laborHours,
		severity,
		readiness,
		readinessNote
	};
}

function renderInsights(summary, totals) {
	$('snapshotLineCount').textContent = String(state.current.lines.length);
	$('snapshotLaborHours').textContent = summary.laborHours.toFixed(1);
	$('snapshotSeverity').textContent = summary.severity;
	$('snapshotFlags').textContent = String(summary.checklistFlags.length);

	$('heroGrandTotal').textContent = money(totals.grand);
	$('heroCustomerDue').textContent = money(Number(state.current.deductible || 0));
	$('heroVehicleLabel').textContent = [state.current.vehicleYear, state.current.vehicleMake, state.current.vehicleModel].filter(Boolean).join(' ') || 'No vehicle selected';
	$('heroCustomerLabel').textContent = state.current.customerName ? `${state.current.customerName}${state.current.claimNumber ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Claim ${state.current.claimNumber}` : ''}` : 'Awaiting customer details';
	$('heroReadiness').textContent = summary.readiness;
	$('heroReadinessNote').textContent = summary.readinessNote;

	const insightList = $('insightList');
	insightList.innerHTML = '';
	summary.insightItems.forEach((item) => {
		const div = document.createElement('div');
		div.className = 'list-pill';
		div.textContent = item;
		insightList.appendChild(div);
	});

	const missingList = $('missingList');
	missingList.innerHTML = '';

	if (summary.requiredMissing.length === 0) {
		const div = document.createElement('div');
		div.className = 'list-pill ok-pill';
		div.textContent = 'Core customer, claim, and vehicle details are filled in.';
		missingList.appendChild(div);
	} else {
		summary.requiredMissing.forEach((item) => {
			const div = document.createElement('div');
			div.className = 'list-pill';
			div.textContent = item;
			missingList.appendChild(div);
		});
	}
}

function monthKeyForEstimate(estimate) {
	const source = estimate.estimateDate || estimate.updatedAt || estimate.createdAt;
	const parsed = new Date(source);
	if (Number.isNaN(parsed.getTime())) {
		return null;
	}
	return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabelFromKey(key) {
	const [year, month] = key.split('-').map(Number);
	return new Date(year, month - 1, 1).toLocaleString([], { month: 'short', year: 'numeric' });
}

function estimateDateForReports(estimate) {
	const source = estimate.estimateDate || estimate.updatedAt || estimate.createdAt;
	const parsed = new Date(source);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatShortDate(value) {
	if (!value) {
		return 'No date';
	}
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return 'No date';
	}
	return parsed.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatLongDate(value) {
	if (!value) {
		return 'No date';
	}
	const parsed = new Date(`${value}T12:00:00`);
	if (Number.isNaN(parsed.getTime())) {
		return 'No date';
	}
	return parsed.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateAsIso(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function monthKeyFromIsoDate(value) {
	return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? String(value).slice(0, 7) : '';
}

function addMonthsToMonthKey(monthKey, delta) {
	const [year, month] = String(monthKey || '').split('-').map(Number);
	const anchor = Number.isFinite(year) && Number.isFinite(month)
		? new Date(year, month - 1 + delta, 1, 12)
		: new Date();
	return `${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, '0')}`;
}

function getTodayIsoDate() {
	return formatDateAsIso(new Date());
}

function getDefaultCalendarMonth() {
	return monthKeyFromIsoDate(state.current?.dueDate)
		|| monthKeyFromIsoDate(state.current?.reminderDate)
		|| getTodayIsoDate().slice(0, 7);
}

function ensureCalendarMonth() {
	if (!/^\d{4}-\d{2}$/.test(state.calendarMonth)) {
		state.calendarMonth = getDefaultCalendarMonth();
	}
	return state.calendarMonth;
}

function wholeDayDiff(laterDate, earlierDate) {
	const diffMs = laterDate.getTime() - earlierDate.getTime();
	return Math.floor(diffMs / 86400000);
}

function parseIsoDateAtNoon(value) {
	if (!value) {
		return null;
	}
	const parsed = new Date(`${value}T12:00:00`);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getUrgencyTier(score) {
	if (score >= 100) {
		return { label: 'Critical', className: 'urgency-critical' };
	}
	if (score >= 65) {
		return { label: 'High', className: 'urgency-high' };
	}
	if (score >= 30) {
		return { label: 'Watch', className: 'urgency-watch' };
	}
	return { label: 'Normal', className: 'urgency-normal' };
}

function getEstimateTimingInfo(estimate) {
	const today = new Date();
	today.setHours(12, 0, 0, 0);
	const due = parseIsoDateAtNoon(estimate.dueDate);
	const reminder = parseIsoDateAtNoon(estimate.reminderDate);
	const start = estimateDateForReports(estimate) || new Date();
	const updated = estimate.updatedAt ? new Date(estimate.updatedAt) : start;
	const ageDays = Math.max(0, wholeDayDiff(today, new Date(start.getFullYear(), start.getMonth(), start.getDate(), 12)));
	const staleDays = Math.max(0, wholeDayDiff(today, new Date(updated.getFullYear(), updated.getMonth(), updated.getDate(), 12)));
	let dueState = 'No Due Date';
	let dueClass = 'age-none';
	let dueOffsetDays = null;
	if (due && !Number.isNaN(due.getTime())) {
		dueOffsetDays = wholeDayDiff(due, today);
		if (dueOffsetDays < 0) {
			dueState = `${Math.abs(dueOffsetDays)}d overdue`;
			dueClass = 'age-overdue';
		} else if (dueOffsetDays <= 2) {
			dueState = `Due in ${dueOffsetDays}d`;
			dueClass = 'age-due-soon';
		} else {
			dueState = `Due ${formatShortDate(estimate.dueDate)}`;
			dueClass = 'age-scheduled';
		}
	}
	let reminderState = 'No Reminder';
	let reminderClass = 'age-none';
	let reminderOffsetDays = null;
	if (reminder) {
		reminderOffsetDays = wholeDayDiff(reminder, today);
		if (reminderOffsetDays < 0) {
			reminderState = `Reminder ${Math.abs(reminderOffsetDays)}d late`;
			reminderClass = 'age-overdue';
		} else if (reminderOffsetDays <= 1) {
			reminderState = reminderOffsetDays === 0 ? 'Reminder today' : 'Reminder tomorrow';
			reminderClass = 'age-due-soon';
		} else {
			reminderState = `Reminder ${formatShortDate(estimate.reminderDate)}`;
			reminderClass = 'age-scheduled';
		}
	}
	let ageBucket = '0-3 days';
	if (ageDays >= 15) {
		ageBucket = '15+ days';
	} else if (ageDays >= 8) {
		ageBucket = '8-14 days';
	} else if (ageDays >= 4) {
		ageBucket = '4-7 days';
	}
	const closed = estimate.estimateStatus === 'Closed';
	const stalled = staleDays >= 7 && !closed;
	let urgencyScore = 0;
	const urgencyReasons = [];
	if (!closed) {
		if (dueOffsetDays !== null) {
			if (dueOffsetDays < 0) {
				urgencyScore += 95 + Math.min(24, Math.abs(dueOffsetDays) * 4);
				urgencyReasons.push(dueState);
			} else if (dueOffsetDays <= 2) {
				urgencyScore += 78 - (dueOffsetDays * 12);
				urgencyReasons.push(dueState);
			} else if (dueOffsetDays <= 5) {
				urgencyScore += 28;
				urgencyReasons.push(dueState);
			} else if (dueOffsetDays <= 10) {
				urgencyScore += 12;
			}
		}
		if (reminderOffsetDays !== null) {
			if (reminderOffsetDays < 0) {
				urgencyScore += 55 + Math.min(20, Math.abs(reminderOffsetDays) * 3);
				urgencyReasons.push(reminderState);
			} else if (reminderOffsetDays <= 1) {
				urgencyScore += reminderOffsetDays === 0 ? 44 : 28;
				urgencyReasons.push(reminderState);
			} else if (reminderOffsetDays <= 3) {
				urgencyScore += 10;
			}
		}
		if (estimate.priority === 'Urgent') {
			urgencyScore += 26;
			urgencyReasons.push('Urgent priority');
		} else if (estimate.priority === 'Insurance Deadline') {
			urgencyScore += 22;
			urgencyReasons.push('Insurance deadline');
		}
		if (estimate.drivable === 'No') {
			urgencyScore += 18;
			urgencyReasons.push('Not drivable');
		}
		if (estimate.estimateStatus === 'Supplement Needed') {
			urgencyScore += 16;
			urgencyReasons.push('Supplement pending');
		} else if (estimate.estimateStatus === 'Insurance Review') {
			urgencyScore += 12;
		}
		if (stalled) {
			urgencyScore += 20;
			urgencyReasons.push(`${staleDays}d stale`);
		}
		if (REVIEW_STATUSES.has(estimate.estimateStatus)) {
			urgencyScore += 8;
		}
		if (ageDays >= 15) {
			urgencyScore += 10;
		} else if (ageDays >= 10) {
			urgencyScore += 6;
		}
	}
	urgencyScore = Math.min(140, urgencyScore);
	const urgencyTier = getUrgencyTier(urgencyScore);
	return {
		ageDays,
		ageBucket,
		staleDays,
		stalled,
		dueState,
		dueClass,
		dueOffsetDays,
		dueDateLabel: estimate.dueDate ? formatShortDate(estimate.dueDate) : 'No due date',
		reminderState,
		reminderClass,
		reminderOffsetDays,
		reminderDateLabel: estimate.reminderDate ? formatShortDate(estimate.reminderDate) : 'No reminder',
		urgencyScore,
		urgencyLabel: urgencyTier.label,
		urgencyClass: urgencyTier.className,
		urgencyReason: urgencyReasons[0] || 'Stable queue item'
	};
}

function isEstimateInReportRange(estimate) {
	const estimateDate = estimateDateForReports(estimate);
	if (!estimateDate) {
		return false;
	}
	if (state.reportStartDate) {
		const start = new Date(`${state.reportStartDate}T00:00:00`);
		if (estimateDate < start) {
			return false;
		}
	}
	if (state.reportEndDate) {
		const end = new Date(`${state.reportEndDate}T23:59:59.999`);
		if (estimateDate > end) {
			return false;
		}
	}
	return true;
}

function getReportEstimates() {
	return getVisibleEstimates().filter(isEstimateInReportRange);
}

function getRecentMonthKeys(count = 6) {
	const keys = [];
	const cursor = state.reportEndDate ? new Date(`${state.reportEndDate}T12:00:00`) : new Date();
	cursor.setDate(1);
	for (let index = 0; index < count; index += 1) {
		keys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
		cursor.setMonth(cursor.getMonth() - 1);
	}
	return keys;
}

function parseEstimateTags(value) {
	return String(value || '')
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean);
}

function formatReportScope() {
	const scopeParts = [state.activeOnly ? 'Active records' : 'All records'];
	if (state.statusFilter !== 'all') {
		scopeParts.push(state.statusFilter);
	}
	if (state.assigneeFilter !== 'all') {
		scopeParts.push(`Assignee: ${state.assigneeFilter}`);
	}
	if (state.repairTypeFilter !== 'all') {
		scopeParts.push(`Type: ${state.repairTypeFilter}`);
	}
	if (state.urgencyFilter !== 'all') {
		scopeParts.push(`Urgency: ${state.urgencyFilter}`);
	}
	if (state.filter) {
		scopeParts.push(`Search: ${state.filter}`);
	}
	if (state.reportStartDate || state.reportEndDate) {
		scopeParts.push(`Range: ${state.reportStartDate || 'Start'} to ${state.reportEndDate || 'Today'}`);
	}
	return scopeParts;
}

function formatCalendarScope() {
	const scopeParts = [state.activeOnly ? 'Active records' : 'All records'];
	if (state.statusFilter !== 'all') {
		scopeParts.push(state.statusFilter);
	}
	if (state.assigneeFilter !== 'all') {
		scopeParts.push(`Assignee: ${state.assigneeFilter}`);
	}
	if (state.repairTypeFilter !== 'all') {
		scopeParts.push(`Type: ${state.repairTypeFilter}`);
	}
	if (state.urgencyFilter !== 'all') {
		scopeParts.push(`Urgency: ${state.urgencyFilter}`);
	}
	if (state.filter) {
		scopeParts.push(`Search: ${state.filter}`);
	}
	return scopeParts;
}

function buildDashboardData() {
	const reportEstimates = getReportEstimates();
	const monthKeys = getRecentMonthKeys();
	const monthRows = monthKeys.map((key) => ({ key, label: monthLabelFromKey(key), count: 0, grand: 0 }));
	const monthMap = new Map(monthRows.map((row) => [row.key, row]));
	const statusCounts = new Map();
	const assigneeCounts = new Map();
	const urgencyCounts = new Map();
	const workloadMap = new Map();
	const repairTypeCounts = new Map();
	const tagCounts = new Map();
	const agingCounts = new Map();
	let openCount = 0;
	let dueSoonCount = 0;
	let overdueCount = 0;
	let stalledCount = 0;
	let urgentCount = 0;
	let totalGrand = 0;
	let totalHours = 0;

	reportEstimates.forEach((estimate) => {
		const metrics = calculateEstimateMetrics(estimate);
		const monthKey = monthKeyForEstimate(estimate);
		if (monthMap.has(monthKey)) {
			const row = monthMap.get(monthKey);
			row.count += 1;
			row.grand += metrics.grand;
		}
		statusCounts.set(estimate.estimateStatus || 'Draft', (statusCounts.get(estimate.estimateStatus || 'Draft') || 0) + 1);
		assigneeCounts.set(estimate.assignedTo || 'Unassigned', (assigneeCounts.get(estimate.assignedTo || 'Unassigned') || 0) + 1);
		repairTypeCounts.set(estimate.repairType || 'Collision', (repairTypeCounts.get(estimate.repairType || 'Collision') || 0) + 1);
		const timing = getEstimateTimingInfo(estimate);
		urgencyCounts.set(timing.urgencyLabel, (urgencyCounts.get(timing.urgencyLabel) || 0) + 1);
		const assigneeKey = estimate.assignedTo || 'Unassigned';
		const laborHours = metrics.bodyHours + metrics.paintHours + metrics.frameHours + metrics.mechHours;
		if (!workloadMap.has(assigneeKey)) {
			workloadMap.set(assigneeKey, { label: assigneeKey, count: 0, grand: 0, hours: 0, urgentCount: 0, overdueCount: 0, reminderCount: 0 });
		}
		const workloadRow = workloadMap.get(assigneeKey);
		workloadRow.count += 1;
		workloadRow.grand += metrics.grand;
		workloadRow.hours += laborHours;
		if (timing.urgencyLabel === 'Critical' || timing.urgencyLabel === 'High') {
			workloadRow.urgentCount += 1;
		}
		if (timing.dueOffsetDays !== null && timing.dueOffsetDays < 0) {
			workloadRow.overdueCount += 1;
		}
		if (timing.reminderOffsetDays !== null && timing.reminderOffsetDays <= 1) {
			workloadRow.reminderCount += 1;
		}
		agingCounts.set(timing.ageBucket, (agingCounts.get(timing.ageBucket) || 0) + 1);
		parseEstimateTags(estimate.estimateTags).forEach((tag) => {
			tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
		});
		if (REVIEW_STATUSES.has(estimate.estimateStatus)) {
			openCount += 1;
		}
		if (timing.dueOffsetDays !== null && timing.dueOffsetDays < 0) {
			overdueCount += 1;
		} else if (timing.dueOffsetDays !== null && timing.dueOffsetDays <= 2) {
			dueSoonCount += 1;
		}
		if (timing.stalled) {
			stalledCount += 1;
		}
		if (timing.urgencyLabel === 'Critical' || timing.urgencyLabel === 'High') {
			urgentCount += 1;
		}
		totalGrand += metrics.grand;
		totalHours += laborHours;
	});

	const workloadRows = [...workloadMap.values()]
		.map((row) => ({
			...row,
			loadScore: (row.hours * 2) + (row.count * 5) + (row.urgentCount * 18) + (row.overdueCount * 14) + (row.reminderCount * 6)
		}))
		.sort((left, right) => right.loadScore - left.loadScore || right.hours - left.hours || right.grand - left.grand);

	return {
		reportEstimates,
		monthRows,
		statusRows: [...statusCounts.entries()].map(([label, count]) => ({ label, count })),
		assigneeRows: [...assigneeCounts.entries()].map(([label, count]) => ({ label, count })).sort((left, right) => right.count - left.count),
		urgencyRows: ['Critical', 'High', 'Watch', 'Normal'].map((label) => ({ label, count: urgencyCounts.get(label) || 0 })).filter((row) => row.count > 0),
		workloadRows,
		repairTypeRows: [...repairTypeCounts.entries()].map(([label, count]) => ({ label, count })).sort((left, right) => right.count - left.count),
		tagRows: [...tagCounts.entries()].map(([label, count]) => ({ label, count })).sort((left, right) => right.count - left.count),
		agingRows: [...agingCounts.entries()].map(([label, count]) => ({ label, count })).sort((left, right) => left.label.localeCompare(right.label)),
		openCount,
		dueSoonCount,
		overdueCount,
		stalledCount,
		urgentCount,
		topAssignee: workloadRows[0] || null,
		totalGrand,
		totalHours,
		scopeParts: formatReportScope()
	};
}

function renderDashboard() {
	const dashboardData = buildDashboardData();
	const currentMonthRow = dashboardData.monthRows[0];

	$('dashboardScopeText').textContent = dashboardData.scopeParts.join(' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ');
	$('dashboardVisibleCount').textContent = String(dashboardData.reportEstimates.length);
	$('dashboardMonthCount').textContent = String(currentMonthRow.count);
	$('dashboardMonthGrand').textContent = money(currentMonthRow.grand);
	$('dashboardOpenCount').textContent = String(dashboardData.openCount);
	$('dashboardDueSoonCount').textContent = String(dashboardData.dueSoonCount);
	$('dashboardOverdueCount').textContent = String(dashboardData.overdueCount);
	if ($('dashboardUrgentCount')) {
		$('dashboardUrgentCount').textContent = String(dashboardData.urgentCount);
	}
	if ($('dashboardTopAssignee')) {
		$('dashboardTopAssignee').textContent = dashboardData.topAssignee
			? `${dashboardData.topAssignee.label} Ãƒâ€šÃ‚Â· ${dashboardData.topAssignee.count} / ${dashboardData.topAssignee.hours.toFixed(1)}h`
			: 'None';
	}

	const tbody = $('dashboardMonthRows');
	tbody.innerHTML = '';
	if (dashboardData.reportEstimates.length === 0) {
		tbody.innerHTML = '<tr><td colspan="4">No saved estimates in the current view.</td></tr>';
		renderDashboardCharts([], [], [], [], []);
		return;
	}

	dashboardData.monthRows.forEach((row) => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${escapeHtml(row.label)}</td>
			<td>${row.count}</td>
			<td>${money(row.grand)}</td>
			<td>${money(row.count > 0 ? row.grand / row.count : 0)}</td>
		`;
		tbody.appendChild(tr);
	});

	renderDashboardCharts(dashboardData.monthRows, dashboardData.statusRows, dashboardData.assigneeRows, dashboardData.repairTypeRows, dashboardData.workloadRows);
}

function renderDashboardCharts(monthRows, statusRows, assigneeRows, repairTypeRows, workloadRows) {
	const monthChart = $('dashboardMonthChart');
	const statusChart = $('dashboardStatusChart');
	const assigneeChart = $('dashboardAssigneeChart');
	const repairTypeChart = $('dashboardRepairTypeChart');
	const workloadChart = $('dashboardAssigneeWorkloadChart');
	monthChart.innerHTML = '';
	statusChart.innerHTML = '';
	assigneeChart.innerHTML = '';
	repairTypeChart.innerHTML = '';
	if (workloadChart) {
		workloadChart.innerHTML = '';
	}

	const visibleMonthRows = monthRows.filter((row) => row.count > 0);
	const maxMonthGrand = Math.max(0, ...visibleMonthRows.map((row) => row.grand));
	if (visibleMonthRows.length === 0) {
		monthChart.innerHTML = '<div class="chart-empty">No monthly data yet.</div>';
	} else {
		visibleMonthRows.forEach((row) => {
			const bar = document.createElement('div');
			const widthPct = maxMonthGrand > 0 ? Math.max(10, (row.grand / maxMonthGrand) * 100) : 10;
			bar.className = 'chart-row';
			bar.innerHTML = `
				<div class="chart-labels">
					<strong>${escapeHtml(row.label)}</strong>
					<small>${row.count} record${row.count === 1 ? '' : 's'} Ãƒâ€šÃ‚Â· ${money(row.grand)}</small>
				</div>
				<div class="chart-track"><span class="chart-fill" style="width:${widthPct}%"></span></div>
			`;
			monthChart.appendChild(bar);
		});
	}

	const sortedStatusRows = statusRows.sort((left, right) => right.count - left.count);
	const maxStatusCount = Math.max(0, ...sortedStatusRows.map((row) => row.count));
	if (sortedStatusRows.length === 0) {
		statusChart.innerHTML = '<div class="chart-empty">No status data yet.</div>';
	} else {
		sortedStatusRows.forEach((row) => {
			const bar = document.createElement('div');
			const widthPct = maxStatusCount > 0 ? Math.max(10, (row.count / maxStatusCount) * 100) : 10;
			bar.className = 'chart-row status-row';
			bar.innerHTML = `
				<div class="chart-labels">
					<strong>${escapeHtml(row.label)}</strong>
					<small>${row.count} record${row.count === 1 ? '' : 's'}</small>
				</div>
				<div class="chart-track"><span class="chart-fill status-fill" style="width:${widthPct}%"></span></div>
			`;
			statusChart.appendChild(bar);
		});
	}

	const renderCountChart = (container, rows, emptyText, fillClass = '') => {
		const topRows = rows.slice(0, 6);
		const maxCount = Math.max(0, ...topRows.map((row) => row.count));
		if (topRows.length === 0) {
			container.innerHTML = `<div class="chart-empty">${emptyText}</div>`;
			return;
		}
		topRows.forEach((row) => {
			const bar = document.createElement('div');
			const widthPct = maxCount > 0 ? Math.max(10, (row.count / maxCount) * 100) : 10;
			bar.className = 'chart-row';
			bar.innerHTML = `
				<div class="chart-labels">
					<strong>${escapeHtml(row.label)}</strong>
					<small>${row.count} record${row.count === 1 ? '' : 's'}</small>
				</div>
				<div class="chart-track"><span class="chart-fill ${fillClass}" style="width:${widthPct}%"></span></div>
			`;
			container.appendChild(bar);
		});
	};

	renderCountChart(assigneeChart, assigneeRows, 'No assignee data yet.', 'assignee-fill');
	renderCountChart(repairTypeChart, repairTypeRows, 'No repair-type data yet.', 'repair-fill');

	if (workloadChart) {
		const topRows = workloadRows.slice(0, 6);
		const maxLoadScore = Math.max(0, ...topRows.map((row) => row.loadScore));
		if (topRows.length === 0) {
			workloadChart.innerHTML = '<div class="chart-empty">No workload data yet.</div>';
		} else {
			topRows.forEach((row) => {
				const bar = document.createElement('div');
				const widthPct = maxLoadScore > 0 ? Math.max(10, (row.loadScore / maxLoadScore) * 100) : 10;
				bar.className = 'chart-row';
				bar.innerHTML = `
					<div class="chart-labels">
						<strong>${escapeHtml(row.label)}</strong>
						<small>${row.count} record${row.count === 1 ? '' : 's'} Ãƒâ€šÃ‚Â· ${row.hours.toFixed(1)}h Ãƒâ€šÃ‚Â· ${money(row.grand)}${row.urgentCount ? ` Ãƒâ€šÃ‚Â· ${row.urgentCount} urgent` : ''}</small>
					</div>
					<div class="chart-track"><span class="chart-fill workload-fill" style="width:${widthPct}%"></span></div>
				`;
				workloadChart.appendChild(bar);
			});
		}
	}
}

function escapeCsvValue(value) {
	const stringValue = String(value ?? '');
	if (/[,"\n]/.test(stringValue)) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}
	return stringValue;
}

function downloadBlob(filename, blob) {
	const anchor = document.createElement('a');
	anchor.href = URL.createObjectURL(blob);
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(anchor.href);
	return true;
}

function downloadCsv(filename, rows) {
	return downloadBlob(filename, new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
}

function downloadTextFile(filename, content, type) {
	return downloadBlob(filename, new Blob([content], { type }));
}

function getVisibleSchedulePayload() {
	const range = getCalendarVisibleRange();
	const entries = getScheduleEntriesForRange(range);
	return { range, entries };
}

function exportScheduleCsv() {
	if (!saveCurrent({ silent: true })) {
		return false;
	}
	const { range, entries } = getVisibleSchedulePayload();
	const lines = [[
		'Date', 'Time', 'Type', 'Estimate Number', 'Customer Name', 'Vehicle', 'Assignee', 'Status', 'Urgency', 'Detail', 'Reminder Note'
	].join(',')];
	entries.forEach((entry) => {
		lines.push([
			entry.date,
			entry.timeLabel || '',
			entry.typeLabel,
			entry.estimateNumber,
			entry.customerName,
			entry.vehicleLabel,
			entry.assigneeLabel,
			entry.statusLabel,
			entry.urgencyLabel,
			entry.detailText,
			entry.note || ''
		].map(escapeCsvValue).join(','));
	});
	if (entries.length === 0) {
		lines.push(['No scheduled items in the current view', '', '', '', '', '', '', '', '', '', ''].map(escapeCsvValue).join(','));
	}
	const filename = `xpressive-schedule-${range.view}-${new Date().toISOString().slice(0, 10)}.csv`;
	return downloadCsv(filename, lines);
}

function escapeIcsText(value = '') {
	return String(value || '')
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r?\n/g, '\\n');
}

function formatIcsDateValue(isoDate) {
	return String(isoDate || '').replace(/-/g, '');
}

function formatIcsDateTimeValue(isoDate, timeValue = '') {
	return `${formatIcsDateValue(isoDate)}T${normalizeTimeValue(timeValue).replace(':', '')}00`;
}

function exportScheduleIcs() {
	if (!saveCurrent({ silent: true })) {
		return false;
	}
	const { range, entries } = getVisibleSchedulePayload();
	const dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Xpressive Autoworks//Body Shop Scheduler//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH'
	];
	entries.forEach((entry) => {
		const nextDay = shiftIsoDate(entry.date, 1);
		const normalizedTime = normalizeTimeValue(entry.time);
		const hasTime = Boolean(normalizedTime);
		const eventEnd = hasTime
			? (() => {
				const start = new Date(`${entry.date}T${normalizedTime}:00`);
				const end = new Date(start.getTime() + 3600000);
				return { date: formatDateAsIso(end), time: `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}` };
			})()
			: null;
		lines.push(
			'BEGIN:VEVENT',
			`UID:${escapeIcsText(`${entry.estimateId}-${entry.type}-${entry.date}@xpressive-autoworks.local`)}`,
			`DTSTAMP:${dtStamp}`,
			hasTime ? `DTSTART:${formatIcsDateTimeValue(entry.date, normalizedTime)}` : `DTSTART;VALUE=DATE:${formatIcsDateValue(entry.date)}`,
			hasTime ? `DTEND:${formatIcsDateTimeValue(eventEnd.date, eventEnd.time)}` : `DTEND;VALUE=DATE:${formatIcsDateValue(nextDay)}`,
			`SUMMARY:${escapeIcsText(`${entry.typeLabel}: ${entry.customerName} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${entry.estimateNumber}`)}`,
			`DESCRIPTION:${escapeIcsText([
				entry.timeLabel ? `Time: ${entry.timeLabel}` : '',
				`Vehicle: ${entry.vehicleLabel}`,
				`Assignee: ${entry.assigneeLabel}`,
				`Status: ${entry.statusLabel}`,
				`Urgency: ${entry.urgencyLabel}`,
				`Detail: ${entry.detailText}`,
				entry.note ? `Note: ${entry.note}` : ''
			].filter(Boolean).join('\n'))}`,
			'END:VEVENT'
		);
	});
	lines.push('END:VCALENDAR');
	const filename = `xpressive-schedule-${range.view}-${new Date().toISOString().slice(0, 10)}.ics`;
	return downloadTextFile(filename, lines.join('\r\n'), 'text/calendar;charset=utf-8');
}

function buildSchedulePrintHtml() {
	const { range, entries } = getVisibleSchedulePayload();
	const grouped = new Map();
	entries.forEach((entry) => {
		if (!grouped.has(entry.date)) {
			grouped.set(entry.date, []);
		}
		grouped.get(entry.date).push(entry);
	});
	const daysMarkup = grouped.size === 0
		? '<article class="card"><h2>No scheduled items</h2><p>No due dates or reminders fall inside the current schedule view.</p></article>'
		: [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([date, dayEntries]) => `
			<article class="card">
				<h2>${escapeHtml(formatLongDate(date))}</h2>
				<ul>
					${dayEntries.sort(compareScheduleEntries).map((entry) => `<li><strong>${escapeHtml(entry.typeLabel)}</strong> Ãƒâ€šÃ‚Â· ${escapeHtml(entry.customerName)} Ãƒâ€šÃ‚Â· ${escapeHtml(entry.estimateNumber)} Ãƒâ€šÃ‚Â· ${escapeHtml(entry.vehicleLabel)} Ãƒâ€šÃ‚Â· ${escapeHtml(entry.assigneeLabel)} Ãƒâ€šÃ‚Â· ${escapeHtml(entry.detailText)}${entry.note ? ` Ãƒâ€šÃ‚Â· ${escapeHtml(entry.note)}` : ''}</li>`).join('')}
				</ul>
			</article>
		`).join('');
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Shop Schedule</title>
	<style>
		* { box-sizing: border-box; }
		body { margin: 0; font-family: Aptos, "Segoe UI", sans-serif; background: #f6efe4; color: #241813; }
		.toolbar { position: sticky; top: 0; display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 16px 24px; background: rgba(246, 239, 228, 0.96); border-bottom: 1px solid #d5c2aa; }
		.toolbar button { border: 0; border-radius: 999px; padding: 10px 16px; font-weight: 700; color: #fff8f3; background: linear-gradient(135deg, #b6462a, #cc5c37); cursor: pointer; }
		.sheet { max-width: 1100px; margin: 0 auto; padding: 24px; }
		.hero { margin-bottom: 18px; padding: 24px; border-radius: 24px; background: linear-gradient(140deg, #2b1c15, #5a3628); color: #fff7f2; }
		.hero h1 { margin: 0; font-family: Georgia, "Times New Roman", serif; }
		.hero p { margin: 10px 0 0; color: rgba(255, 247, 242, 0.78); }
		.grid { display: grid; gap: 14px; }
		.card { padding: 18px 20px; border-radius: 20px; background: #fffaf4; border: 1px solid #d5c2aa; }
		.card h2 { margin: 0 0 12px; }
		ul { margin: 0; padding-left: 18px; }
		li { margin-bottom: 8px; line-height: 1.5; }
		.scope { margin-top: 12px; font-size: 14px; color: #70584b; }
		@media print { body { background: #fff; } .toolbar { display: none; } .sheet { max-width: none; padding: 0; } .card { break-inside: avoid; } }
	</style>
</head>
<body>
	<div class="toolbar">
		<button onclick="window.print()">Print / Save PDF</button>
		<small>Printable shop schedule for the current ${escapeHtml(range.view)} view.</small>
	</div>
	<div class="sheet">
		<section class="hero">
			<h1>Xpressive Autoworks Schedule</h1>
			<p>${escapeHtml(range.label)}</p>
			<p class="scope">${escapeHtml(formatCalendarScope().join(' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ '))}</p>
		</section>
		<section class="grid">${daysMarkup}</section>
	</div>
</body>
</html>`;
}

function openSchedulePrint() {
	if (!saveCurrent({ silent: true })) {
		return false;
	}
	const reportWindow = window.open('', '_blank', 'noopener,noreferrer');
	if (!reportWindow) {
		window.alert('The schedule window was blocked. Allow pop-ups for this page and try again.');
		return false;
	}
	reportWindow.document.open();
	reportWindow.document.write(buildSchedulePrintHtml());
	reportWindow.document.close();
	return true;
}

function exportTemplateLibrary() {
	const payload = {
		version: 1,
		exportedAt: new Date().toISOString(),
		templates: state.templateLibrary
	};
	const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
	const anchor = document.createElement('a');
	anchor.href = URL.createObjectURL(blob);
	anchor.download = `xpressive-template-library-${new Date().toISOString().slice(0, 10)}.json`;
	anchor.click();
	URL.revokeObjectURL(anchor.href);
	return true;
}

function importTemplateLibrary(file) {
	const reader = new FileReader();
	reader.onload = () => {
		try {
			const data = JSON.parse(reader.result);
			const incomingTemplates = data && typeof data === 'object' && !Array.isArray(data)
				? (data.templates && typeof data.templates === 'object' ? data.templates : data)
				: null;
			if (!incomingTemplates) {
				throw new Error('Template import must be a JSON object.');
			}

			const mergedLibrary = { ...defaultTemplateLibrary() };
			Object.keys(NOTE_TEMPLATE_DEFINITIONS).forEach((key) => {
				if (typeof incomingTemplates[key] === 'string' && incomingTemplates[key].trim()) {
					mergedLibrary[key] = incomingTemplates[key].trim();
				}
			});
			state.templateLibrary = mergedLibrary;
			if (persistTemplateLibrary()) {
				renderTemplateLibraryEditor('Imported reusable template library.');
			}
		} catch {
			window.alert('Could not import that template library. Use a previously exported template JSON file.');
		}
	};
	reader.readAsText(file);
}

function exportDetailCsv() {
	if (!saveCurrent({ silent: true })) {
		return false;
	}

	const visibleEstimates = getReportEstimates();
	const headers = [
		'Month', 'Estimate Number', 'Estimate Date', 'Updated At', 'Status', 'Archived', 'Customer Name', 'Customer Phone', 'Customer Email',
		'Insurance Company', 'Insurance Estimate Number', 'Claim Number', 'Adjuster', 'Adjuster Phone', 'Assigned To', 'Repair Type', 'Due Date', 'Reminder Date', 'Reminder Note', 'Urgency', 'Tags', 'Vehicle', 'VIN', 'Priority', 'Drivable', 'Line Count', 'Photo Count',
		'Labor Hours', 'Grand Total', 'Deductible', 'Customer Due', 'Readiness', 'Severity'
	];
	const lines = [headers.join(',')];

	visibleEstimates.forEach((estimate) => {
		const metrics = calculateEstimateMetrics(estimate);
		const summary = summarizeEstimate(metrics, estimate);
		const timing = getEstimateTimingInfo(estimate);
		lines.push([
			monthLabelFromKey(monthKeyForEstimate(estimate) || getRecentMonthKeys(1)[0]),
			estimate.estimateNumber,
			estimate.estimateDate,
			estimate.updatedAt,
			estimate.estimateStatus,
			estimate.isArchived ? 'Yes' : 'No',
			estimate.customerName,
			estimate.customerPhone,
			estimate.customerEmail,
			estimate.insuranceCompany,
			estimate.insurerEstimateNumber,
			estimate.claimNumber,
			estimate.adjusterName,
			estimate.adjusterPhone,
			estimate.assignedTo,
			estimate.repairType,
			estimate.dueDate,
			estimate.reminderDate,
			estimate.reminderNote,
			`${timing.urgencyLabel} (${timing.urgencyReason})`,
			estimate.estimateTags,
			[estimate.vehicleYear, estimate.vehicleMake, estimate.vehicleModel, estimate.vehicleTrim].filter(Boolean).join(' '),
			estimate.vehicleVin,
			estimate.priority,
			estimate.drivable,
			estimate.lines.length,
			estimate.photos.length,
			summary.laborHours.toFixed(1),
			metrics.grand.toFixed(2),
			metrics.deductible.toFixed(2),
			metrics.deductible.toFixed(2),
			summary.readiness,
			summary.severity
		].map(escapeCsvValue).join(','));
	});

	return downloadCsv(`xpressive-estimate-detail-${new Date().toISOString().slice(0, 10)}.csv`, lines);
}

function exportSummaryCsv() {
	if (!saveCurrent({ silent: true })) {
		return false;
	}

	const dashboardData = buildDashboardData();
	const reportEstimates = dashboardData.reportEstimates;
	const monthRows = new Map();
	reportEstimates.forEach((estimate) => {
		const key = monthKeyForEstimate(estimate);
		if (!key) {
			return;
		}
		if (!monthRows.has(key)) {
			monthRows.set(key, { key, count: 0, grand: 0, openReviews: 0 });
		}
		const row = monthRows.get(key);
		const metrics = calculateEstimateMetrics(estimate);
		row.count += 1;
		row.grand += metrics.grand;
		if (REVIEW_STATUSES.has(estimate.estimateStatus)) {
			row.openReviews += 1;
		}
	});

	const lines = [['Month', 'Records', 'Total', 'Average Ticket', 'Open Reviews'].join(',')];
	[...monthRows.values()]
		.sort((left, right) => right.key.localeCompare(left.key))
		.forEach((row) => {
			lines.push([
				monthLabelFromKey(row.key),
				row.count,
				row.grand.toFixed(2),
				(row.count > 0 ? row.grand / row.count : 0).toFixed(2),
				row.openReviews
			].map(escapeCsvValue).join(','));
		});

	lines.push('');
	lines.push('Assignee Workload');
	lines.push(['Assignee', 'Records', 'Labor Hours', 'Queue Value', 'Urgent Now', 'Overdue', 'Reminders Due'].join(','));
	if (dashboardData.workloadRows.length === 0) {
		lines.push(['No workload data', '', '', '', '', '', ''].map(escapeCsvValue).join(','));
	} else {
		dashboardData.workloadRows.forEach((row) => {
			lines.push([
				row.label,
				row.count,
				row.hours.toFixed(1),
				row.grand.toFixed(2),
				row.urgentCount,
				row.overdueCount,
				row.reminderCount
			].map(escapeCsvValue).join(','));
		});
	}

	lines.push('');
	lines.push('Urgency Mix');
	lines.push(['Urgency', 'Records'].join(','));
	if (dashboardData.urgencyRows.length === 0) {
		lines.push(['No urgency data', '0'].map(escapeCsvValue).join(','));
	} else {
		dashboardData.urgencyRows.forEach((row) => {
			lines.push([row.label, row.count].map(escapeCsvValue).join(','));
		});
	}

	return downloadCsv(`xpressive-estimate-summary-${new Date().toISOString().slice(0, 10)}.csv`, lines);
}

function buildManagementReportHtml() {
	const dashboardData = buildDashboardData();
	const scopeText = dashboardData.scopeParts.join(' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ');
	const monthRows = dashboardData.monthRows.filter((row) => row.count > 0);
	const totalsByMonth = monthRows.length === 0
		? '<tr><td colspan="4">No monthly activity in the current report scope.</td></tr>'
		: monthRows.map((row) => `
			<tr>
				<td>${escapeHtml(row.label)}</td>
				<td>${row.count}</td>
				<td>${money(row.grand)}</td>
				<td>${money(row.count > 0 ? row.grand / row.count : 0)}</td>
			</tr>
		`).join('');
	const assigneeMarkup = dashboardData.assigneeRows.length === 0
		? '<li>No assignee data yet.</li>'
		: dashboardData.assigneeRows.map((row) => `<li><strong>${escapeHtml(row.label)}</strong><span>${row.count} record${row.count === 1 ? '' : 's'}</span></li>`).join('');
	const repairTypeMarkup = dashboardData.repairTypeRows.length === 0
		? '<li>No repair-type data yet.</li>'
		: dashboardData.repairTypeRows.map((row) => `<li><strong>${escapeHtml(row.label)}</strong><span>${row.count} record${row.count === 1 ? '' : 's'}</span></li>`).join('');
	const urgencyMarkup = dashboardData.urgencyRows.length === 0
		? '<li>No urgency data yet.</li>'
		: dashboardData.urgencyRows.map((row) => `<li><strong>${escapeHtml(row.label)}</strong><span>${row.count} record${row.count === 1 ? '' : 's'}</span></li>`).join('');
	const workloadMarkup = dashboardData.workloadRows.length === 0
		? '<li>No workload data yet.</li>'
		: dashboardData.workloadRows.map((row) => `<li><strong>${escapeHtml(row.label)}</strong><span>${row.count} record${row.count === 1 ? '' : 's'} Ãƒâ€šÃ‚Â· ${row.hours.toFixed(1)}h Ãƒâ€šÃ‚Â· ${money(row.grand)}${row.urgentCount ? ` Ãƒâ€šÃ‚Â· ${row.urgentCount} urgent` : ''}</span></li>`).join('');
	const workloadTable = dashboardData.workloadRows.length === 0
		? '<tr><td colspan="7">No workload data in the current scope.</td></tr>'
		: dashboardData.workloadRows.map((row) => `
			<tr>
				<td>${escapeHtml(row.label)}</td>
				<td>${row.count}</td>
				<td>${row.hours.toFixed(1)}</td>
				<td>${money(row.grand)}</td>
				<td>${row.urgentCount}</td>
				<td>${row.overdueCount}</td>
				<td>${row.reminderCount}</td>
			</tr>
		`).join('');
	const tagMarkup = dashboardData.tagRows.length === 0
		? '<li>No tags recorded yet.</li>'
		: dashboardData.tagRows.slice(0, 12).map((row) => `<li><strong>${escapeHtml(row.label)}</strong><span>${row.count}</span></li>`).join('');
	const agingMarkup = dashboardData.agingRows.length === 0
		? '<li>No aging data yet.</li>'
		: dashboardData.agingRows.map((row) => `<li><strong>${escapeHtml(row.label)}</strong><span>${row.count} record${row.count === 1 ? '' : 's'}</span></li>`).join('');
	const statusMarkup = dashboardData.statusRows.length === 0
		? '<li>No status data yet.</li>'
		: dashboardData.statusRows.sort((left, right) => right.count - left.count).map((row) => `<li><strong>${escapeHtml(row.label)}</strong><span>${row.count} record${row.count === 1 ? '' : 's'}</span></li>`).join('');
	const reminderMarkup = dashboardData.reportEstimates
		.map((estimate) => ({ estimate, timing: getEstimateTimingInfo(estimate) }))
		.filter(({ timing }) => timing.reminderOffsetDays !== null && timing.reminderOffsetDays <= 1)
		.sort((left, right) => (left.timing.reminderOffsetDays ?? 9999) - (right.timing.reminderOffsetDays ?? 9999))
		.slice(0, 10)
		.map(({ estimate, timing }) => `<li><strong>${escapeHtml(estimate.estimateNumber)}</strong><span>${escapeHtml(estimate.assignedTo || 'Unassigned')} Ãƒâ€šÃ‚Â· ${escapeHtml(timing.reminderState)}${estimate.reminderNote ? ` Ãƒâ€šÃ‚Â· ${escapeHtml(estimate.reminderNote)}` : ''}</span></li>`)
		.join('');
	const stalledMarkup = dashboardData.reportEstimates
		.map((estimate) => ({ estimate, timing: getEstimateTimingInfo(estimate) }))
		.filter(({ timing }) => timing.stalled || (timing.dueOffsetDays !== null && timing.dueOffsetDays < 0))
		.sort((left, right) => (left.timing.dueOffsetDays ?? 9999) - (right.timing.dueOffsetDays ?? 9999))
		.slice(0, 10)
		.map(({ estimate, timing }) => `<li><strong>${escapeHtml(estimate.estimateNumber)}</strong><span>${escapeHtml(estimate.assignedTo || 'Unassigned')} Ãƒâ€šÃ‚Â· ${escapeHtml(timing.dueState)} Ãƒâ€šÃ‚Â· ${timing.ageDays}d open</span></li>`)
		.join('');
	const avgTicket = dashboardData.reportEstimates.length > 0 ? dashboardData.totalGrand / dashboardData.reportEstimates.length : 0;

	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Management Report</title>
	<style>
		:root { color-scheme: light; }
		* { box-sizing: border-box; }
		body { margin: 0; font-family: Aptos, "Segoe UI", sans-serif; background: #f6efe4; color: #241813; }
		.toolbar { position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 24px; background: rgba(246, 239, 228, 0.96); border-bottom: 1px solid #d5c2aa; }
		.toolbar button { border: 0; border-radius: 999px; padding: 10px 16px; font-weight: 700; color: #fff8f3; background: linear-gradient(135deg, #b6462a, #cc5c37); cursor: pointer; }
		.sheet { max-width: 1100px; margin: 0 auto; padding: 24px; }
		.hero, .summary-grid, .breakdown-grid { display: grid; gap: 16px; }
		.hero { grid-template-columns: 1.4fr 1fr; }
		.summary-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 18px 0; }
		.breakdown-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 18px; }
		.card { background: #fffaf4; border: 1px solid #d5c2aa; border-radius: 24px; padding: 22px; }
		.hero-card { background: linear-gradient(135deg, #2b1c15, #5a3628); color: #fff7f2; }
		.hero-card p { color: rgba(255,247,242,0.78); }
		.eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #f0c7a6; }
		.metric span { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #70584b; }
		.metric strong { display: block; margin-top: 8px; font-size: 26px; }
		table { width: 100%; border-collapse: collapse; }
		th, td { padding: 10px 8px; text-align: left; border-bottom: 1px solid #ead9c2; }
		th { color: #7f2e1c; background: #f8efe3; }
		.breakdown-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
		.breakdown-list li { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 8px; border-bottom: 1px dashed #d5c2aa; }
		.footer-note { margin-top: 18px; color: #70584b; font-size: 13px; }
		@media print { body { background: #fff; } .toolbar { display: none; } .sheet { max-width: none; padding: 0; } .card { break-inside: avoid; box-shadow: none; } }
	</style>
</head>
<body>
	<div class="toolbar">
		<button onclick="window.print()">Print / Save PDF</button>
		<small>${escapeHtml(scopeText || 'Current queue scope')}</small>
	</div>
	<div class="sheet">
		<section class="hero">
			<article class="card hero-card">
				<div class="eyebrow">Management Report</div>
				<h1>Xpressive Queue Summary</h1>
				<p>${escapeHtml(scopeText || 'Current queue scope')}</p>
				<p class="footer-note">Generated ${escapeHtml(new Date().toLocaleString())}</p>
			</article>
			<article class="card">
				<h2>Scope</h2>
				<p>${escapeHtml(scopeText || 'No active scope filters applied.')}</p>
			</article>
		</section>
		<section class="summary-grid">
			<article class="card metric"><span>Records</span><strong>${dashboardData.reportEstimates.length}</strong></article>
			<article class="card metric"><span>Open Reviews</span><strong>${dashboardData.openCount}</strong></article>
			<article class="card metric"><span>Due Soon</span><strong>${dashboardData.dueSoonCount}</strong></article>
			<article class="card metric"><span>Overdue</span><strong>${dashboardData.overdueCount}</strong></article>
			<article class="card metric"><span>Urgent Now</span><strong>${dashboardData.urgentCount}</strong></article>
			<article class="card metric"><span>Total Queue Value</span><strong>${money(dashboardData.totalGrand)}</strong></article>
			<article class="card metric"><span>Avg Ticket</span><strong>${money(avgTicket)}</strong></article>
			<article class="card metric"><span>Stalled</span><strong>${dashboardData.stalledCount}</strong></article>
			<article class="card metric"><span>Labor Hours</span><strong>${dashboardData.totalHours.toFixed(1)}</strong></article>
		</section>
		<section class="card">
			<h2>Monthly Activity</h2>
			<table>
				<thead><tr><th>Month</th><th>Records</th><th>Total</th><th>Avg Ticket</th></tr></thead>
				<tbody>${totalsByMonth}</tbody>
			</table>
		</section>
		<section class="card">
			<h2>Assignee Workload Detail</h2>
			<table>
				<thead><tr><th>Assignee</th><th>Records</th><th>Labor Hours</th><th>Queue Value</th><th>Urgent</th><th>Overdue</th><th>Reminders Due</th></tr></thead>
				<tbody>${workloadTable}</tbody>
			</table>
		</section>
		<section class="breakdown-grid">
			<article class="card"><h2>Status Mix</h2><ul class="breakdown-list">${statusMarkup}</ul></article>
			<article class="card"><h2>Assignee Mix</h2><ul class="breakdown-list">${assigneeMarkup}</ul></article>
			<article class="card"><h2>Assignee Workload</h2><ul class="breakdown-list">${workloadMarkup}</ul></article>
			<article class="card"><h2>Repair Type Mix</h2><ul class="breakdown-list">${repairTypeMarkup}</ul></article>
			<article class="card"><h2>Urgency Mix</h2><ul class="breakdown-list">${urgencyMarkup}</ul></article>
			<article class="card"><h2>Top Tags</h2><ul class="breakdown-list">${tagMarkup}</ul></article>
			<article class="card"><h2>Aging Buckets</h2><ul class="breakdown-list">${agingMarkup}</ul></article>
			<article class="card"><h2>Reminder Queue</h2><ul class="breakdown-list">${reminderMarkup || '<li>No reminders due today or overdue in the current scope.</li>'}</ul></article>
			<article class="card"><h2>Deadline Risk</h2><ul class="breakdown-list">${stalledMarkup || '<li>No stalled or overdue estimates in the current scope.</li>'}</ul></article>
		</section>
		<p class="footer-note">This report uses the same saved-record filters, archive scope, and report date range as the queue dashboard and CSV exports.</p>
	</div>
</body>
</html>`;
}

function openManagementReport() {
	if (!saveCurrent({ silent: true })) {
		return false;
	}
	const reportWindow = window.open('', '_blank', 'noopener,noreferrer');
	if (!reportWindow) {
		window.alert('The report window was blocked. Allow pop-ups for this page and try again.');
		return false;
	}
	reportWindow.document.open();
	reportWindow.document.write(buildManagementReportHtml());
	reportWindow.document.close();
	return true;
}

function renderQueueFilterOptions() {
	const assigneeSelect = $('savedAssigneeFilter');
	if (!assigneeSelect) {
		return;
	}
	const options = [...new Set(state.estimates.map((estimate) => estimate.assignedTo || 'Unassigned'))].sort((left, right) => left.localeCompare(right));
	assigneeSelect.innerHTML = ['<option value="all">All assignees</option>']
		.concat(options.map((option) => `<option value="${escapeHtml(option)}" ${state.assigneeFilter === option ? 'selected' : ''}>${escapeHtml(option)}</option>`))
		.join('');
}

function appendUniqueText(existingValue, addition) {
	const currentValue = String(existingValue || '').trim();
	const nextValue = String(addition || '').trim();
	if (!nextValue) {
		return currentValue;
	}
	if (currentValue.includes(nextValue)) {
		return currentValue;
	}
	return currentValue ? `${currentValue}\n\n${nextValue}` : nextValue;
}

function buildContactTemplate(audience) {
	if (audience === 'customer') {
		return `Customer contact: ${joinNonEmpty([
			state.current.customerName || 'Name pending',
			state.current.customerPhone || 'Phone pending',
			state.current.customerEmail || 'Email pending'
		])}`;
	}

	return `Carrier contact: ${joinNonEmpty([
		state.current.insuranceCompany || 'Insurance company pending',
		state.current.adjusterName || 'Adjuster pending',
		state.current.adjusterPhone || 'Phone pending'
	])}`;
}

function applyNoteTemplate(targetField, templateId) {
	const input = $(targetField);
	if (!NOTE_TEMPLATE_DEFINITIONS[templateId] || !input) {
		return;
	}
	input.value = appendUniqueText(input.value, renderTemplateText(templateId));
	state.current[targetField] = input.value;
	markDirty();
}

function applyContactTemplate(audience) {
	const targetField = audience === 'customer' ? 'customerCoverNote' : 'insurerCoverNote';
	const input = $(targetField);
	if (!input) {
		return;
	}
	input.value = appendUniqueText(input.value, buildContactTemplate(audience));
	state.current[targetField] = input.value;
	markDirty();
}

function setAiStatus(message, tone = '') {
	const status = $('aiStatusText');
	if (!status) {
		return;
	}
	status.textContent = message;
	status.className = tone ? `helper-text ${tone}` : 'helper-text';
}

function isDesktopCopilotMode() {
	return Boolean(window.copilotBridge?.isElectron && typeof window.copilotBridge.openExternal === 'function');
}

function renderAiSettings() {
	if (!$('aiIncludeContext')) {
		return;
	}
	$('aiIncludeContext').checked = state.aiSettings.includeContext !== false;
	if ($('aiDesktopModeBadge')) {
		$('aiDesktopModeBadge').textContent = isDesktopCopilotMode() ? 'Desktop Mode Active' : 'Browser Mode';
		$('aiDesktopModeBadge').className = `desktop-mode-badge ${isDesktopCopilotMode() ? 'desktop-mode-active' : ''}`;
	}
	setAiStatus(isDesktopCopilotMode()
		? 'Desktop mode is active. The Electron app will launch Windows Copilot through the desktop shell bridge.'
		: 'Browser mode is active. The app will copy the prompt and try to open Copilot from the browser.');
}

function renderAiChat() {
	const list = $('aiAssistantMessages');
	if (!list) {
		return;
	}
	list.innerHTML = '';
	if (!state.aiChat.length) {
		list.innerHTML = '<div class="chart-empty">No Copilot prompt history yet. Use a shortcut or write your own prompt, then open Windows Copilot.</div>';
	} else {
		state.aiChat.forEach((entry) => {
			const item = document.createElement('article');
			item.className = `ai-message ai-message-${entry.role}`;
			item.innerHTML = `
				<strong>${escapeHtml(entry.role === 'assistant' ? 'Copilot Launcher' : 'You')}</strong>
				<p>${escapeHtml(entry.content).replace(/\n/g, '<br />')}</p>
			`;
			list.appendChild(item);
		});
	}
	if ($('aiOpenCopilotBtn')) {
		$('aiOpenCopilotBtn').disabled = state.aiBusy;
		$('aiOpenCopilotBtn').textContent = state.aiBusy ? 'Opening...' : 'Open Windows Copilot';
	}
	if ($('aiCopyPromptBtn')) {
		$('aiCopyPromptBtn').disabled = state.aiBusy;
	}
	if ($('aiCopyInsurerPromptBtn')) {
		$('aiCopyInsurerPromptBtn').disabled = state.aiBusy;
		$('aiCopyCustomerPromptBtn').disabled = state.aiBusy;
		$('aiOpenInsurerPromptBtn').disabled = state.aiBusy;
		$('aiOpenCustomerPromptBtn').disabled = state.aiBusy;
	}
	if ($('aiClearChatBtn')) {
		$('aiClearChatBtn').disabled = state.aiBusy || !state.aiChat.length;
	}
}

function syncAiSettingsFromForm() {
	state.aiSettings.includeContext = $('aiIncludeContext').checked;
	persistAiSettings();
}

function appendAiMessage(role, content) {
	state.aiChat.push({ role, content: String(content || '').trim(), timestamp: new Date().toISOString() });
	state.aiChat = state.aiChat.slice(-12);
	persistAiChat();
	renderAiChat();
}

function clearAiConversation() {
	state.aiChat = [];
	persistAiChat();
	renderAiChat();
	setAiStatus('Conversation cleared.');
}

function getLastAssistantReply() {
	return [...state.aiChat].reverse().find((entry) => entry.role === 'assistant')?.content || '';
}

function buildEstimateContextForAi() {
	const { totals, summary } = recalc();
	const vehicleLabel = getVehicleLabel(state.current);
	const laborHours = summary.laborHours.toFixed(1);
	return [
		`Estimate #: ${state.current.estimateNumber}`,
		`Estimate status: ${state.current.estimateStatus}`,
		`Customer: ${state.current.customerName || 'Not provided'}`,
		`Insurance company: ${state.current.insuranceCompany || 'Not provided'}`,
		`Insurance estimate #: ${state.current.insurerEstimateNumber || 'Not provided'}`,
		`Claim number: ${state.current.claimNumber || 'Not provided'}`,
		`Vehicle: ${vehicleLabel}`,
		`VIN: ${state.current.vehicleVin || 'Not provided'}`,
		`Loss description: ${state.current.lossDescription || 'Not provided'}`,
		`Visible damage: ${state.current.visibleDamage || 'Not provided'}`,
		`Supplement notes: ${state.current.supplementNotes || 'None'}`,
		`Line count: ${state.current.lines.length}`,
		`Labor hours: ${laborHours}`,
		`Grand total: ${money(totals.grand)}`,
		`Deductible: ${money(totals.deductible)}`,
		`Readiness: ${summary.readiness}`,
		`Missing info: ${summary.requiredMissing.length ? summary.requiredMissing.join(', ') : 'None'}`
	].join('\n');
}

function buildWindowsCopilotPrompt(prompt) {
	const sections = [
		'You are helping with an automotive collision estimate. Use only the facts provided. If information is missing, say what is missing and avoid inventing details.',
		`Task:\n${prompt}`
	];
	if (state.aiSettings.includeContext) {
		sections.push(`Estimate context:\n${buildEstimateContextForAi()}`);
	}
	sections.push('Output: keep it concise and practical for a body shop workflow.');
	return sections.join('\n\n');
}

async function copyTextToClipboard(text) {
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return true;
	}
	const helper = document.createElement('textarea');
	helper.value = text;
	helper.setAttribute('readonly', 'readonly');
	helper.style.position = 'fixed';
	helper.style.opacity = '0';
	document.body.appendChild(helper);
	helper.select();
	document.execCommand('copy');
	helper.remove();
	return true;
}

function openWindowsCopilot() {
	if (window.copilotBridge?.isElectron && typeof window.copilotBridge.openExternal === 'function') {
		return window.copilotBridge.openExternal('ms-copilot:')
			.then((opened) => {
				if (opened) {
					return true;
				}
				return window.copilotBridge.openExternal('https://copilot.microsoft.com/').then(() => false);
			})
			.catch(() => window.copilotBridge.openExternal('https://copilot.microsoft.com/').then(() => false).catch(() => false));
	}
	let openedProtocol = false;
	try {
		const popup = window.open('ms-copilot:', '_blank', 'noopener,noreferrer');
		openedProtocol = Boolean(popup) || popup === null;
	} catch {
		openedProtocol = false;
	}
	if (!openedProtocol) {
		window.open('https://copilot.microsoft.com/', '_blank', 'noopener,noreferrer');
		return false;
	}
	return true;
}

function insurerCopilotPrompt() {
	return 'Draft a concise insurer-facing cover note for this estimate. Mention visible damage, likely supplement risk, and any calibration or parts considerations only if supported by the estimate data.';
}

function customerCopilotPrompt() {
	return 'Draft a customer-facing repair update that explains the current estimate, deductible, and likely next steps in plain language.';
}

async function sendAiPrompt(promptOverride = '', { copyOnly = false, actionLabel = 'custom Copilot prompt' } = {}) {
	const prompt = String(promptOverride || $('aiPromptInput').value || '').trim();
	if (!prompt || state.aiBusy) {
		return;
	}
	syncAiSettingsFromForm();
	state.aiBusy = true;
	renderAiChat();
	setAiStatus(copyOnly ? 'Copying prompt...' : 'Copying prompt and opening Windows Copilot...');
	appendAiMessage('user', prompt);
	if (!promptOverride) {
		$('aiPromptInput').value = '';
	}
	try {
		const fullPrompt = buildWindowsCopilotPrompt(prompt);
		await copyTextToClipboard(fullPrompt);
		const openedNativeCopilot = copyOnly ? false : await openWindowsCopilot();
		const launchMode = copyOnly ? 'copy only' : (openedNativeCopilot ? (isDesktopCopilotMode() ? 'desktop Copilot' : 'browser protocol') : 'browser fallback');
		appendAiMessage('assistant', copyOnly
			? 'Prompt copied to clipboard. Paste it into Windows Copilot.'
			: (openedNativeCopilot
				? 'Prompt copied to clipboard. Windows Copilot was opened. Paste the prompt if it does not prefill.'
				: 'Prompt copied to clipboard. Windows Copilot was not opened directly, so the browser Copilot page was opened instead.'));
		recordCopilotAction(copyOnly
			? `Copilot prompt copied: ${actionLabel}`
			: `Copilot launched: ${actionLabel} via ${launchMode}`);
		showCopilotToast(copyOnly
			? `${actionLabel} copied to clipboard.`
			: `${actionLabel} copied and Copilot opened.`, copyOnly ? '' : '');
		setAiStatus(copyOnly
			? 'Prompt copied. Paste it into Windows Copilot.'
			: 'Prompt copied and Copilot opened. Paste the prompt into the Copilot window.', 'lookup-success');
	} catch (error) {
		setAiStatus(error.message || 'AI request failed.', 'lookup-warning');
		showCopilotToast(error.message || 'Could not copy the prompt for Windows Copilot.', 'toast-warning');
		window.alert(error.message || 'Could not copy the prompt for Windows Copilot.');
	} finally {
		state.aiBusy = false;
		renderAiChat();
	}
}

function quickAiPrompt(prompt, actionLabel = 'quick Copilot prompt') {
	$('aiPromptInput').value = prompt;
	sendAiPrompt(prompt, { actionLabel });
}

function openInsurerPromptInCopilot() {
	return sendAiPrompt(insurerCopilotPrompt(), { actionLabel: 'insurer prompt' });
}

function openCustomerPromptInCopilot() {
	return sendAiPrompt(customerCopilotPrompt(), { actionLabel: 'customer prompt' });
}

function saveTemplateLibraryEntry() {
	const selectedKey = ensureValidTemplateSelection();
	if (!selectedKey) {
		return;
	}
	state.templateLibrary[selectedKey] = $('templateEditorText').value.trim() || NOTE_TEMPLATE_DEFINITIONS[selectedKey].text;
	if (persistTemplateLibrary()) {
		renderTemplateLibraryEditor(`Saved template: ${NOTE_TEMPLATE_DEFINITIONS[selectedKey].label}`);
	}
}

function resetTemplateLibraryEntry() {
	const selectedKey = ensureValidTemplateSelection();
	if (!selectedKey) {
		return;
	}
	state.templateLibrary[selectedKey] = NOTE_TEMPLATE_DEFINITIONS[selectedKey].text;
	if (persistTemplateLibrary()) {
		renderTemplateLibraryEditor(`Reset template: ${NOTE_TEMPLATE_DEFINITIONS[selectedKey].label}`);
	}
}

function resetTemplateLibrary() {
	state.templateLibrary = defaultTemplateLibrary();
	if (persistTemplateLibrary()) {
		renderTemplateLibraryEditor('Reset all reusable template copy to defaults.');
	}
}

function recalc() {
	syncFromForm();
	renderBrandProfile();
	syncLinesFromTable();
	syncChecklist();

	const metrics = calculateEstimateMetrics(state.current);

	document.querySelectorAll('#linesBody tr').forEach((row, index) => {
		const line = state.current.lines[index];
		const labor = line.qty * line.hours * line.rate;
		const total = labor + Number(line.parts) + Number(line.materials);
		row.querySelector('.line-total').textContent = money(total);
	});

	$('bodyLaborTotal').textContent = money(metrics.bodyLabor);
	$('paintLaborTotal').textContent = money(metrics.paintLabor);
	$('frameLaborTotal').textContent = money(metrics.frameLabor);
	$('mechLaborTotal').textContent = money(metrics.mechLabor);
	$('partsTotal').textContent = money(metrics.parts);
	$('materialsTotal').textContent = money(metrics.materials);
	$('calcPaintMaterials').textContent = money(metrics.calcPaintMaterials);
	$('shopSuppliesTotal').textContent = money(metrics.shopSupplies);
	$('taxTotal').textContent = money(metrics.tax);
	$('deductibleTotal').textContent = money(metrics.deductible);
	$('grandTotal').textContent = money(metrics.grand);
	$('customerDue').textContent = money(metrics.deductible);

	const summary = summarizeEstimate(metrics, state.current);

	state.currentTotals = metrics;
	state.currentSummary = summary;
	renderInsights(summary, metrics);
	renderSchedulingCalendar();
	return { totals: state.currentTotals, summary };
}

function saveCurrent({ silent = false } = {}) {
	syncFromForm();
	syncLinesFromTable();
	syncChecklist();
	state.current.updatedAt = new Date().toISOString();

	const existingIndex = state.estimates.findIndex((estimate) => estimate.id === state.current.id);
	if (existingIndex >= 0) {
		state.estimates[existingIndex] = structuredClone(state.current);
	} else {
		state.estimates.unshift(structuredClone(state.current));
	}

	if (!persist()) {
		state.dirty = true;
		updateSaveState('Storage full');
		return false;
	}
	state.dirty = false;
	state.lastSavedAt = Date.now();
	renderSavedList();
	renderHistory();
	updateSaveState(silent ? 'Autosaved locally' : 'Saved locally');
	return true;
}

function deleteCurrent() {
	if (!state.current) {
		return;
	}

	const confirmed = window.confirm(`Delete estimate ${state.current.estimateNumber}?`);
	if (!confirmed) {
		return;
	}

	state.estimates = state.estimates.filter((estimate) => estimate.id !== state.current.id);
	persist();

	if (state.estimates.length > 0) {
		setCurrent(state.estimates[0]);
	} else {
		setCurrent(defaultEstimate());
	}

	updateSaveState('Record deleted');
}

function duplicateCurrent() {
	syncFromForm();
	syncLinesFromTable();
	syncChecklist();

	const duplicate = structuredClone(state.current);
	duplicate.id = crypto.randomUUID();
	duplicate.estimateNumber = `${state.current.estimateNumber}-COPY`;
	duplicate.estimateDate = new Date().toISOString().slice(0, 10);
	duplicate.createdAt = new Date().toISOString();
	duplicate.updatedAt = duplicate.createdAt;
	duplicate.history = [
		createHistoryEntry(`Estimate duplicated from ${state.current.estimateNumber}`, 'system', duplicate.createdAt),
		createHistoryEntry('Estimate created', 'system', duplicate.createdAt)
	];
	state.estimates.unshift(duplicate);
	if (!persist()) {
		state.estimates.shift();
		updateSaveState('Storage full');
		return;
	}
	setCurrent(duplicate);
	state.lastSavedAt = Date.now();
	updateSaveState('Duplicate created');
}

function renderSavedList() {
	const list = $('savedList');
	list.innerHTML = '';
	renderQueueFilterOptions();
	refreshInsurerEstimateNumberSuggestions();

	const visibleItems = getVisibleEstimates();

	$('savedCountLabel').textContent = `${visibleItems.length} records`;
	renderDashboard();
	renderSchedulingCalendar();

	visibleItems.forEach((estimate) => {
		const item = document.createElement('button');
		item.type = 'button';
		item.className = `saved-item ${state.current && estimate.id === state.current.id ? 'active' : ''}`;
		const timing = getEstimateTimingInfo(estimate);
		item.innerHTML = `
			<strong>${escapeHtml(estimate.estimateNumber)}</strong>
			<div>${escapeHtml(estimate.customerName || 'No customer')} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml([estimate.vehicleYear, estimate.vehicleMake, estimate.vehicleModel].filter(Boolean).join(' ') || 'Vehicle pending')}</div>
			<small>${escapeHtml(estimate.claimNumber || 'No claim')} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(estimate.vehicleVin || 'No VIN')}</small>
			<small>${escapeHtml(estimate.insuranceCompany || 'No insurer')} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(estimate.insurerEstimateNumber || 'No insurance estimate #')}</small>
			<small>${escapeHtml(estimate.assignedTo || 'Unassigned')} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(estimate.repairType || 'Collision')}</small>
			<small><span class="urgency-pill ${timing.urgencyClass}">${escapeHtml(timing.urgencyLabel)}</span> ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(timing.urgencyReason)}</small>
			<small><span class="age-pill ${escapeHtml(timing.dueClass)}">${escapeHtml(timing.dueState)}</span> ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${timing.ageDays}d open${timing.stalled ? ' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Stalled' : ''}</small>
			<small>${escapeHtml(timing.reminderState)}${estimate.reminderNote ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(estimate.reminderNote)}` : ''}</small>
			<small>${estimate.isArchived ? 'Archived' : 'Active'} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${escapeHtml(estimate.estimateStatus || 'Draft')}</small>
			<small>Updated ${escapeHtml(formatDateTime(estimate.updatedAt))}</small>
		`;
		item.onclick = () => setCurrent(estimate);
		list.appendChild(item);
	});
}

function compareEstimates(left, right, sortOrder) {
	switch (sortOrder) {
		case 'updated-asc':
			return String(left.updatedAt || '').localeCompare(String(right.updatedAt || ''));
		case 'date-desc':
			return String(right.estimateDate || '').localeCompare(String(left.estimateDate || ''));
		case 'date-asc':
			return String(left.estimateDate || '').localeCompare(String(right.estimateDate || ''));
		case 'customer-asc':
			return String(left.customerName || '').localeCompare(String(right.customerName || ''));
		case 'status-asc':
			return String(left.estimateStatus || '').localeCompare(String(right.estimateStatus || ''));
		case 'urgency-desc': {
			const leftTiming = getEstimateTimingInfo(left);
			const rightTiming = getEstimateTimingInfo(right);
			return rightTiming.urgencyScore - leftTiming.urgencyScore || String(right.updatedAt || '').localeCompare(String(left.updatedAt || ''));
		}
		case 'updated-desc':
		default:
			return String(right.updatedAt || '').localeCompare(String(left.updatedAt || ''));
	}
}

function exportJson({ skipSave = false } = {}) {
	if (!skipSave && !saveCurrent({ silent: true })) {
		return false;
	}
	const blob = new Blob([JSON.stringify(state.estimates, null, 2)], { type: 'application/json' });
	const anchor = document.createElement('a');
	anchor.href = URL.createObjectURL(blob);
	anchor.download = 'xpressive-body-shop-estimates.json';
	anchor.click();
	URL.revokeObjectURL(anchor.href);
	return true;
}

function normalizeCsvHeader(value = '') {
	return String(value || '')
		.trim()
		.toLowerCase()
		.replace(/[\s_/.-]+/g, ' ')
		.replace(/#/g, 'number')
		.replace(/[^a-z0-9 ]/g, '')
		.replace(/\s+/g, ' ');
}

function parseCsv(text) {
	const rows = [];
	let current = '';
	let row = [];
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const next = text[index + 1];

		if (char === '"') {
			if (inQuotes && next === '"') {
				current += '"';
				index += 1;
			} else {
				inQuotes = !inQuotes;
			}
			continue;
		}

		if (char === ',' && !inQuotes) {
			row.push(current);
			current = '';
			continue;
		}

		if ((char === '\n' || char === '\r') && !inQuotes) {
			if (char === '\r' && next === '\n') {
				index += 1;
			}
			row.push(current);
			if (row.some((cell) => cell.trim() !== '')) {
				rows.push(row);
			}
			row = [];
			current = '';
			continue;
		}

		current += char;
	}

	if (current.length > 0 || row.length > 0) {
		row.push(current);
		if (row.some((cell) => cell.trim() !== '')) {
			rows.push(row);
		}
	}

	return rows;
}

function buildCsvFieldMap(headers) {
	const normalizedHeaders = headers.map(normalizeCsvHeader);
	const fieldMap = {};
	Object.entries(CSV_IMPORT_FIELD_ALIASES).forEach(([field, aliases]) => {
		const matchIndex = normalizedHeaders.findIndex((header) => aliases.includes(header));
		if (matchIndex >= 0) {
			fieldMap[field] = matchIndex;
		}
	});
	return fieldMap;
}

function coerceImportedFieldValue(field, value) {
	const trimmed = String(value || '').trim();
	if (!trimmed) {
		return '';
	}
	if (['deductible', 'vehicleMileage', 'bodyRate', 'paintRate', 'frameRate', 'mechRate', 'taxPct'].includes(field)) {
		const normalized = trimmed.replace(/[$,%]/g, '').replace(/,/g, '');
		const numeric = Number(normalized);
		return Number.isFinite(numeric) ? numeric : '';
	}
	if (['estimateDate', 'dueDate', 'reminderDate', 'lossDate'].includes(field)) {
		const parsed = new Date(trimmed);
		return Number.isNaN(parsed.getTime()) ? trimmed : parsed.toISOString().slice(0, 10);
	}
	return trimmed;
}

function buildImportedEstimatePatch(row, fieldMap) {
	const patch = {};
	Object.entries(fieldMap).forEach(([field, index]) => {
		const nextValue = coerceImportedFieldValue(field, row[index]);
		if (nextValue !== '') {
			patch[field] = nextValue;
		}
	});
	return patch;
}

function findEstimateForImportedPatch(patch) {
	const insurerMatch = patch.insurerEstimateNumber ? findEstimateByInsurerEstimateNumber(patch.insurerEstimateNumber, { excludeId: null }) : null;
	if (insurerMatch) {
		return insurerMatch;
	}
	if (patch.estimateNumber) {
		const estimateNumberMatch = state.estimates.find((estimate) => normalizeLookupValue(estimate.estimateNumber) === normalizeLookupValue(patch.estimateNumber));
		if (estimateNumberMatch) {
			return estimateNumberMatch;
		}
	}
	if (patch.claimNumber && patch.vehicleVin) {
		return state.estimates.find((estimate) => normalizeLookupValue(estimate.claimNumber) === normalizeLookupValue(patch.claimNumber)
			&& normalizeLookupValue(estimate.vehicleVin) === normalizeLookupValue(patch.vehicleVin)) || null;
	}
	return null;
}

function applyImportedPatchToEstimate(estimate, patch, timestamp) {
	const updated = normalizeEstimate(structuredClone(estimate));
	Object.entries(patch).forEach(([field, value]) => {
		updated[field] = value;
	});
	updated.updatedAt = timestamp;
	updated.history.unshift(createHistoryEntry('CSV import merged insurer estimate data', 'system', timestamp));
	updated.history = updated.history.slice(0, 25);
	return updated;
}

function createEstimateFromImportedPatch(patch, timestamp) {
	const created = defaultEstimate();
	Object.entries(patch).forEach(([field, value]) => {
		created[field] = value;
	});
	created.createdAt = timestamp;
	created.updatedAt = timestamp;
	created.history = [
		createHistoryEntry('CSV import created estimate', 'system', timestamp),
		createHistoryEntry('Estimate created', 'system', timestamp)
	];
	if (!created.estimateNumber || !String(created.estimateNumber).trim()) {
		created.estimateNumber = `CSV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
	}
	return created;
}

function importInsurerCsv(file) {
	const reader = new FileReader();
	reader.onload = () => {
		try {
			const rows = parseCsv(String(reader.result || ''));
			if (rows.length < 2) {
				throw new Error('CSV must include a header row and at least one data row.');
			}

			const [headers, ...dataRows] = rows;
			const fieldMap = buildCsvFieldMap(headers);
			if (!Object.keys(fieldMap).length) {
				throw new Error('No recognized columns were found.');
			}

			const importedRecords = [];
			let createdCount = 0;
			let updatedCount = 0;
			let skippedCount = 0;

			dataRows.forEach((row) => {
				const patch = buildImportedEstimatePatch(row, fieldMap);
				if (!Object.keys(patch).length) {
					skippedCount += 1;
					return;
				}
				const timestamp = new Date().toISOString();
				const existing = findEstimateForImportedPatch(patch);
				if (existing) {
					const updated = applyImportedPatchToEstimate(existing, patch, timestamp);
					const existingIndex = state.estimates.findIndex((estimate) => estimate.id === existing.id);
					state.estimates[existingIndex] = updated;
					importedRecords.push(updated);
					updatedCount += 1;
					return;
				}
				const created = createEstimateFromImportedPatch(patch, timestamp);
				state.estimates.unshift(created);
				importedRecords.push(created);
				createdCount += 1;
			});

			if (!importedRecords.length) {
				throw new Error('No usable rows were found in the CSV file.');
			}

			if (!persist()) {
				updateSaveState('Storage full');
				return;
			}
			state.lastSavedAt = Date.now();
			renderSavedList();
			setCurrent(importedRecords[0]);
			updateSaveState(`CSV import complete: ${createdCount} created, ${updatedCount} updated`);
			window.alert(`CSV import complete. Created: ${createdCount}. Updated: ${updatedCount}. Skipped: ${skippedCount}.`);
		} catch {
			window.alert('Could not import that CSV file. Include headers like Insurance Estimate #, Insurance Company, Claim Number, Customer Name, VIN, or Estimate Number.');
		}
	};
	reader.readAsText(file);
}

function importJson(file) {
	const reader = new FileReader();
	reader.onload = () => {
		try {
			const data = JSON.parse(reader.result);
			if (!Array.isArray(data)) {
				throw new Error('Import data must be an array of estimates.');
			}

			state.estimates = data.map(normalizeEstimate);
			state.estimates.forEach((estimate) => {
				if (!estimate.history.some((entry) => entry.note === 'Estimate imported')) {
					estimate.history.unshift(createHistoryEntry('Estimate imported', 'system', new Date().toISOString()));
				}
				estimate.updatedAt = new Date().toISOString();
			});
			persist();
			renderSavedList();
			if (data[0]) {
				setCurrent(state.estimates[0]);
			}
			updateSaveState('Import complete');
		} catch {
			window.alert('Could not import that JSON file. Use a previously exported estimate backup.');
		}
	};
	reader.readAsText(file);
}

function buildPacketHtml(audience = 'insurer') {
	const { totals, summary } = recalc();
	const isCustomerPacket = audience === 'customer';
	const vehicleLabel = [state.current.vehicleYear, state.current.vehicleMake, state.current.vehicleModel, state.current.vehicleTrim].filter(Boolean).join(' ');
	const customerLabel = state.current.customerName || 'Unassigned customer';
	const shopContact = joinNonEmpty([
		state.current.shopAddress1,
		state.current.shopAddress2,
		state.current.shopPhone ? `Phone: ${state.current.shopPhone}` : '',
		state.current.shopEmail
	], '<br />');
	const flaggedItems = summary.checklistFlags.length === 0
		? '<li>No flagged checklist items.</li>'
		: summary.checklistFlags.map((flag) => `<li><strong>${escapeHtml(flag.label)}</strong> Ãƒâ€šÃ‚Â· ${escapeHtml(flag.status)}${flag.note ? ` Ãƒâ€šÃ‚Â· ${escapeHtml(flag.note)}` : ''}</li>`).join('');
	const simplifiedLineRows = state.current.lines.length === 0
		? '<tr><td colspan="4">No repair lines have been added yet.</td></tr>'
		: state.current.lines.map((line) => `
			<tr>
				<td>${escapeHtml(line.operation)}</td>
				<td>${escapeHtml(line.panel)}</td>
				<td>${escapeHtml(line.description)}</td>
				<td>${money(line.qty * line.hours * line.rate + line.parts + line.materials)}</td>
			</tr>
		`).join('');
	const lineRows = state.current.lines.length === 0
		? '<tr><td colspan="6">No estimate lines have been added yet.</td></tr>'
		: state.current.lines.map((line) => `
			<tr>
				<td>${escapeHtml(line.category)}</td>
				<td>${escapeHtml(line.operation)}</td>
				<td>${escapeHtml(line.panel)}</td>
				<td>${escapeHtml(line.description)}</td>
				<td>${Number(line.qty).toFixed(1)}</td>
				<td>${money(line.qty * line.hours * line.rate + line.parts + line.materials)}</td>
			</tr>
		`).join('');
	const photoMarkup = state.current.photos.length === 0
		? '<p class="packet-empty">No photo evidence attached.</p>'
		: `<div class="packet-photos">${state.current.photos.map((photo) => `
			<figure class="packet-photo-card">
				<img src="${photo.dataUrl}" alt="${escapeHtml(photo.caption || photo.name)}" />
				<figcaption>${escapeHtml(photo.caption || photo.name)}</figcaption>
			</figure>
		`).join('')}</div>`;
	const historyMarkup = state.current.history.length === 0
		? '<p class="packet-empty">No activity notes recorded.</p>'
		: `<ul class="packet-list">${state.current.history.slice(0, 6).map((entry) => `<li><strong>${escapeHtml(entry.note)}</strong> Ãƒâ€šÃ‚Â· ${escapeHtml(formatDateTime(entry.timestamp))}</li>`).join('')}</ul>`;
	const packetTitle = isCustomerPacket ? 'Customer Repair Summary' : 'Collision Estimate Packet';
	const packetSubtitle = isCustomerPacket
		? 'Customer-facing repair summary and pricing overview'
		: 'Automotive Engineering Ãƒâ€šÃ‚Â· Diagnostics Ãƒâ€šÃ‚Â· Body & Collision Estimating';
	const coverNote = isCustomerPacket
		? state.current.customerCoverNote || 'Thank you for reviewing this repair summary. This packet reflects the current visible damage and planned repair approach.'
		: state.current.insurerCoverNote || 'This packet is prepared for insurer review and reflects visible damage, operational findings, and current repair planning.';
	const signatureLabel = isCustomerPacket
		? state.current.customerSignatureLabel || 'Customer Care / Repair Team'
		: state.current.insurerSignatureLabel || 'Estimator / Claims Contact';
	const signatureName = isCustomerPacket
		? state.current.customerSignatureName || state.current.estimatorName || ''
		: state.current.insurerSignatureName || state.current.estimatorName || '';
	const claimSnapshot = isCustomerPacket
		? `
			<div class="meta-item"><span>Customer</span><strong>${escapeHtml(customerLabel)}</strong></div>
			<div class="meta-item"><span>Vehicle</span><strong>${escapeHtml(vehicleLabel || 'Vehicle pending')}</strong></div>
			<div class="meta-item"><span>Status</span><strong>${escapeHtml(state.current.estimateStatus || 'Draft')}</strong></div>
			<div class="meta-item"><span>Priority</span><strong>${escapeHtml(state.current.priority || 'Standard')}</strong></div>
		`
		: `
			<div class="meta-item"><span>Customer</span><strong>${escapeHtml(customerLabel)}</strong></div>
			<div class="meta-item"><span>Vehicle</span><strong>${escapeHtml(vehicleLabel || 'Vehicle pending')}</strong></div>
			<div class="meta-item"><span>Claim Number</span><strong>${escapeHtml(state.current.claimNumber || 'Not provided')}</strong></div>
			<div class="meta-item"><span>Insurance Estimate #</span><strong>${escapeHtml(state.current.insurerEstimateNumber || 'Not provided')}</strong></div>
			<div class="meta-item"><span>VIN</span><strong>${escapeHtml(state.current.vehicleVin || 'Not provided')}</strong></div>
			<div class="meta-item"><span>Insurance</span><strong>${escapeHtml(state.current.insuranceCompany || 'Not provided')}</strong></div>
			<div class="meta-item"><span>Point of Impact</span><strong>${escapeHtml(state.current.impactPoint)}</strong></div>
		`;
	const totalsMarkup = isCustomerPacket
		? `
			<div class="totals-list">
				<div><span>Repair Total</span><strong>${money(totals.grand)}</strong></div>
				<div><span>Customer Due</span><strong>${money(totals.deductible)}</strong></div>
				<div><span>Estimate Status</span><strong>${escapeHtml(state.current.estimateStatus)}</strong></div>
			</div>
		`
		: `
			<div class="totals-list">
				<div><span>Body Labor</span><strong>${money(totals.bodyLabor)}</strong></div>
				<div><span>Paint Labor</span><strong>${money(totals.paintLabor)}</strong></div>
				<div><span>Frame Labor</span><strong>${money(totals.frameLabor)}</strong></div>
				<div><span>Mechanical Labor</span><strong>${money(totals.mechLabor)}</strong></div>
				<div><span>Parts</span><strong>${money(totals.parts)}</strong></div>
				<div><span>Materials</span><strong>${money(totals.materials + totals.calcPaintMaterials)}</strong></div>
				<div><span>Tax</span><strong>${money(totals.tax)}</strong></div>
			</div>
		`;
	const secondaryPanel = isCustomerPacket
		? `<article class="panel"><h2 class="section-title">Repair Overview</h2><ul class="packet-list">${summary.insightItems.slice(0, 6).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`
		: `<article class="panel"><h2 class="section-title">Review Flags</h2><ul class="packet-list">${flaggedItems}</ul><p class="footer-note">Readiness: ${escapeHtml(summary.readiness)} Ãƒâ€šÃ‚Â· Severity: ${escapeHtml(summary.severity)}</p></article>`;
	const linesSection = isCustomerPacket
		? `
		<section class="panel">
			<h2 class="section-title">Repair Summary</h2>
			<table class="packet-table">
				<thead>
					<tr><th>Operation</th><th>Area</th><th>Description</th><th>Total</th></tr>
				</thead>
				<tbody>${simplifiedLineRows}</tbody>
			</table>
		</section>
		`
		: `
		<section class="panel">
			<h2 class="section-title">Estimate Lines</h2>
			<table class="packet-table">
				<thead>
					<tr><th>Category</th><th>Operation</th><th>Panel / Part</th><th>Description</th><th>Qty</th><th>Total</th></tr>
				</thead>
				<tbody>${lineRows}</tbody>
			</table>
		</section>
		`;
	const historySection = isCustomerPacket ? '' : `
		<section class="panel">
			<h2 class="section-title">Activity Notes</h2>
			${historyMarkup}
		</section>
	`;
	const damageSummaryMarkup = isCustomerPacket
		? `
			<div class="notes-grid">
				<div class="note-block"><span>Repair Summary</span><p>${escapeHtml(state.current.visibleDamage || state.current.lossDescription || 'Repair details will be confirmed during disassembly and repair.')}</p></div>
				<div class="note-block"><span>Delivery Notes</span><p>${escapeHtml(state.current.supplementNotes || 'Hidden damage, parts delays, and insurer approvals may affect the final completion timing.')}</p></div>
			</div>
		`
		: `
			<div class="notes-grid">
				<div class="note-block"><span>Loss Description</span><p>${escapeHtml(state.current.lossDescription || 'No loss description recorded.')}</p></div>
				<div class="note-block"><span>Visible Damage</span><p>${escapeHtml(state.current.visibleDamage || 'No visible damage notes recorded.')}</p></div>
				<div class="note-block"><span>Structural Notes</span><p>${escapeHtml(state.current.frameNotes || 'No structural notes recorded.')}</p></div>
				<div class="note-block"><span>Supplement Notes</span><p>${escapeHtml(state.current.supplementNotes || 'No supplement notes recorded.')}</p></div>
			</div>
		`;
	const footerText = isCustomerPacket
		? 'This summary reflects visible damage and the current repair plan. Hidden damage, parts availability, and insurer approvals may change the final amount or completion date.'
		: 'Estimate reflects visible damage at time of inspection. Hidden damage, calibration needs, parts availability, corrosion, insurer requirements, and prior repairs may change the final repair amount.';

	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${escapeHtml(state.current.estimateNumber)} Packet</title>
	<style>
		:root { color-scheme: light; }
		* { box-sizing: border-box; }
		body { margin: 0; font-family: Aptos, "Segoe UI", sans-serif; color: #241813; background: #f6efe4; }
		.toolbar { position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 24px; background: rgba(246, 239, 228, 0.95); border-bottom: 1px solid #d5c2aa; }
		.toolbar button { border: 0; border-radius: 999px; padding: 10px 16px; font-weight: 700; color: #fff8f3; background: linear-gradient(135deg, #b6462a, #cc5c37); cursor: pointer; }
		.toolbar small { color: #70584b; }
		.sheet { max-width: 1080px; margin: 0 auto; padding: 24px; }
		.hero { display: grid; grid-template-columns: 1.5fr 1fr; gap: 18px; margin-bottom: 18px; }
		.hero-card, .panel { background: #fffaf4; border: 1px solid #d5c2aa; border-radius: 24px; padding: 22px; }
		.hero-card { background: linear-gradient(135deg, #2b1c15, #5a3628); color: #fff7f2; }
		.hero-brand { display: flex; align-items: center; gap: 16px; }
		.packet-logo { width: 92px; height: 92px; object-fit: contain; border-radius: 18px; background: rgba(255,255,255,0.92); padding: 10px; }
		.hero-card h1 { margin: 0; font-family: Georgia, "Times New Roman", serif; }
		.hero-card p { margin: 6px 0 0; color: rgba(255, 247, 242, 0.78); }
		.hero-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 18px; }
		.hero-stats div { padding: 12px; border-radius: 16px; background: rgba(255,255,255,0.08); }
		.eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #f0c7a6; }
		.meta-grid, .summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
		.meta-item span, .totals-list span { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #70584b; }
		.meta-item strong, .totals-list strong { display: block; margin-top: 6px; }
		.section-title { margin: 0 0 12px; font-size: 18px; }
		.totals-list { display: grid; gap: 10px; }
		.totals-list div { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dashed #d5c2aa; padding-bottom: 8px; }
		.packet-table { width: 100%; border-collapse: collapse; }
		.packet-table th, .packet-table td { padding: 10px 8px; border-bottom: 1px solid #ead9c2; text-align: left; vertical-align: top; }
		.packet-table th { color: #7f2e1c; background: #f8efe3; }
		.packet-list { margin: 0; padding-left: 18px; }
		.packet-list li { margin-bottom: 8px; }
		.packet-photos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
		.packet-photo-card { margin: 0; border: 1px solid #d5c2aa; border-radius: 20px; overflow: hidden; background: #fff; }
		.packet-photo-card img { display: block; width: 100%; height: 280px; object-fit: cover; background: #f0e1cf; }
		.packet-photo-card figcaption { padding: 12px 14px; font-size: 14px; color: #4f3a31; }
		.notes-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
		.note-block { min-height: 110px; }
		.note-block p { white-space: pre-wrap; margin: 10px 0 0; }
		.footer-note { margin-top: 18px; font-size: 13px; color: #70584b; }
		.packet-empty { color: #70584b; }
		.contact-copy { margin-top: 14px; color: rgba(255, 247, 242, 0.8); }
		@media print {
			body { background: #fff; }
			.toolbar { display: none; }
			.sheet { max-width: none; padding: 0; }
			.panel, .hero-card { box-shadow: none; break-inside: avoid; }
		}
	</style>
</head>
<body>
	<div class="toolbar">
		<button onclick="window.print()">Print / Save PDF</button>
		<small>Use the print dialog's Save as PDF option for a shareable packet.</small>
	</div>
	<div class="sheet">
		<section class="hero">
			<article class="hero-card">
				<div class="eyebrow">${escapeHtml(packetTitle)}</div>
				<div class="hero-brand">
					${state.current.shopLogoDataUrl ? `<img src="${state.current.shopLogoDataUrl}" alt="${escapeHtml(state.current.shopLogoName || state.current.shopName || 'Shop logo')}" class="packet-logo" />` : ''}
					<div>
						<h1>${escapeHtml(state.current.shopName || 'Xpressive Autoworks')}</h1>
						<p>${escapeHtml(isCustomerPacket ? packetSubtitle : state.current.shopTagline || packetSubtitle)}</p>
					</div>
				</div>
				<p class="contact-copy">${shopContact || 'Los Angeles Area<br />Phone: 323-326-7354'}</p>
				<div class="hero-stats">
					<div><span>Estimate #</span><strong>${escapeHtml(state.current.estimateNumber)}</strong></div>
					<div><span>Status</span><strong>${escapeHtml(state.current.estimateStatus)}</strong></div>
					<div><span>Grand Total</span><strong>${money(totals.grand)}</strong></div>
					<div><span>Customer Due</span><strong>${money(totals.deductible)}</strong></div>
				</div>
			</article>
			<article class="panel">
				<h2 class="section-title">Claim Snapshot</h2>
				<div class="meta-grid">
					${claimSnapshot}
				</div>
			</article>
		</section>

		<section class="summary-grid">
			<article class="panel">
				<h2 class="section-title">Cover Note</h2>
				<p>${escapeHtml(coverNote)}</p>
			</article>
			<article class="panel">
				<h2 class="section-title">Totals</h2>
				${totalsMarkup}
			</article>
		</section>

		<section class="summary-grid">
			${secondaryPanel}
			<article class="panel">
				<h2 class="section-title">Signature</h2>
				<p><strong>${escapeHtml(signatureLabel)}</strong></p>
				<p>${escapeHtml(signatureName || 'Pending signature')}</p>
			</article>
		</section>

		<section class="panel">
			<h2 class="section-title">Damage Summary</h2>
			${damageSummaryMarkup}
		</section>

		${linesSection}

		<section class="panel">
			<h2 class="section-title">Photo Evidence</h2>
			${photoMarkup}
		</section>

		${historySection}

		<p class="footer-note">${escapeHtml(footerText)}</p>
	</div>
</body>
</html>`;
}

function openPdfPacket({ skipSave = false, packetWindow: existingWindow = null, audience = $('packetAudience') ? $('packetAudience').value : 'insurer' } = {}) {
	if (!skipSave && !saveCurrent({ silent: true })) {
		return false;
	}

	const packetWindow = existingWindow || window.open('', '_blank', 'noopener,noreferrer');
	if (!packetWindow) {
		window.alert('The packet window was blocked. Allow pop-ups for this page and try again.');
		return false;
	}

	packetWindow.document.open();
	packetWindow.document.write(buildPacketHtml(audience));
	packetWindow.document.close();
	return true;
}

function shareEstimatePacket() {
	const packetWindow = window.open('', '_blank', 'noopener,noreferrer');
	if (!packetWindow) {
		window.alert('The packet window was blocked. Allow pop-ups for this page and try again.');
		return;
	}

	if (!saveCurrent({ silent: true })) {
		packetWindow.close();
		return;
	}

	if (!exportJson({ skipSave: true })) {
		packetWindow.close();
		return;
	}

	openPdfPacket({ skipSave: true, packetWindow, audience: $('packetAudience').value });
}

function wireEvents() {
	$('newEstimateBtn').onclick = () => setCurrent(defaultEstimate());
	$('duplicateEstimateBtn').onclick = duplicateCurrent;
	$('archiveEstimateBtn').onclick = toggleArchiveCurrent;
	$('deleteEstimateBtn').onclick = deleteCurrent;
	$('saveEstimateBtn').onclick = () => {
		if (saveCurrent()) {
			window.alert('Estimate saved locally.');
		}
	};
	$('autoFillInsuranceEstimateBtn').onclick = autoFillFromInsurerEstimateNumber;
	$('insurerEstimateNumber').addEventListener('input', () => {
		setInsurerLookupStatus($('insurerEstimateNumber').value.trim()
			? 'Click Auto Fill to load the most recent saved record with this insurance estimate number.'
			: 'Load a saved estimate by insurance estimate number.');
	});
	$('insurerEstimateNumber').addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			autoFillFromInsurerEstimateNumber();
		}
	});
	$('printBtn').onclick = () => window.print();
	$('pdfPacketBtn').onclick = openPdfPacket;
	$('sharePacketBtn').onclick = shareEstimatePacket;
	$('exportBtn').onclick = exportJson;
	$('exportDetailCsvBtn').onclick = exportDetailCsv;
	$('exportSummaryCsvBtn').onclick = exportSummaryCsv;
	$('printManagementReportBtn').onclick = openManagementReport;
	$('clearReportRangeBtn').onclick = () => {
		state.reportStartDate = '';
		state.reportEndDate = '';
		$('reportStartDate').value = '';
		$('reportEndDate').value = '';
		renderSavedList();
	};
	$('schedulePrevMonthBtn').onclick = () => navigateCalendar(-1);
	$('scheduleTodayBtn').onclick = () => {
		state.calendarMonth = getTodayIsoDate().slice(0, 7);
		state.calendarSelectedDate = getTodayIsoDate();
		renderSchedulingCalendar();
	};
	$('scheduleNextMonthBtn').onclick = () => navigateCalendar(1);
	$('scheduleViewSelect').onchange = (event) => {
		state.calendarView = event.target.value === 'week' ? 'week' : 'month';
		if (!state.calendarSelectedDate) {
			state.calendarSelectedDate = getTodayIsoDate();
		}
		renderSchedulingCalendar();
	};
	$('scheduleDraftType').onchange = () => renderScheduleComposer();
	$('scheduleCreateBtn').onclick = createScheduleForSelectedDay;
	$('scheduleCurrentEstimateBtn').onclick = scheduleCurrentEstimateForSelectedDay;
	$('scheduleCancelEditBtn').onclick = () => clearScheduleDraft();
	$('printScheduleBtn').onclick = openSchedulePrint;
	$('exportScheduleCsvBtn').onclick = exportScheduleCsv;
	$('exportScheduleIcsBtn').onclick = exportScheduleIcs;
	document.querySelectorAll('[data-content-tab]').forEach((button) => {
		button.onclick = () => setActiveContentTab(button.dataset.contentTab);
	});
	document.querySelectorAll('[data-section-popout]').forEach((button) => {
		button.onclick = () => openSectionModal(button.dataset.sectionPopout);
	});
	$('sectionEditCloseBtn').onclick = () => closeSectionModal();
	$('sectionEditModal').addEventListener('click', (event) => {
		if (event.target === $('sectionEditModal') || event.target.dataset.sectionModalClose === 'true') {
			closeSectionModal();
		}
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && state.sectionModal) {
			closeSectionModal();
		}
	});
	$('importFile').onchange = (event) => event.target.files[0] && importJson(event.target.files[0]);
	$('importCsvFile').onchange = (event) => {
		const file = event.target.files[0];
		if (!file) {
			return;
		}
		saveCurrent({ silent: true });
		importInsurerCsv(file);
		event.target.value = '';
	};
	$('uploadLogoBtn').onclick = () => $('logoInput').click();
	$('removeLogoBtn').onclick = clearShopLogo;
	$('addActivityNoteBtn').onclick = addActivityNote;
	$('aiOpenCopilotBtn').onclick = () => sendAiPrompt('', { actionLabel: 'custom prompt' });
	$('aiCopyPromptBtn').onclick = () => sendAiPrompt('', { copyOnly: true, actionLabel: 'custom prompt' });
	$('aiClearChatBtn').onclick = clearAiConversation;
	$('aiQuickSummaryBtn').onclick = () => quickAiPrompt('Summarize this estimate for internal shop review in 5 to 7 concise bullets.', 'estimate summary prompt');
	$('aiQuickMissingBtn').onclick = () => quickAiPrompt('List the missing or weak estimate information that should be completed before sending this to an insurer.', 'missing information prompt');
	$('aiQuickInsurerBtn').onclick = () => quickAiPrompt(insurerCopilotPrompt(), 'insurer prompt');
	$('aiQuickCustomerBtn').onclick = () => quickAiPrompt(customerCopilotPrompt(), 'customer prompt');
	$('aiCopyInsurerPromptBtn').onclick = () => sendAiPrompt(insurerCopilotPrompt(), { copyOnly: true, actionLabel: 'insurer prompt' });
	$('aiCopyCustomerPromptBtn').onclick = () => sendAiPrompt(customerCopilotPrompt(), { copyOnly: true, actionLabel: 'customer prompt' });
	$('aiOpenInsurerPromptBtn').onclick = openInsurerPromptInCopilot;
	$('aiOpenCustomerPromptBtn').onclick = openCustomerPromptInCopilot;
	$('aiIncludeContext').addEventListener('change', syncAiSettingsFromForm);
	$('aiPromptInput').addEventListener('keydown', (event) => {
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			sendAiPrompt();
		}
	});
	$('templateAudienceSelect').onchange = () => renderTemplateLibraryEditor();
	$('templateKeySelect').onchange = () => renderTemplateLibraryEditor();
	$('saveTemplateLibraryBtn').onclick = saveTemplateLibraryEntry;
	$('exportTemplateLibraryBtn').onclick = exportTemplateLibrary;
	$('importTemplateLibraryFile').onchange = (event) => {
		if (event.target.files[0]) {
			importTemplateLibrary(event.target.files[0]);
		}
		event.target.value = '';
	};
	$('resetTemplateEntryBtn').onclick = resetTemplateLibraryEntry;
	$('resetTemplateLibraryBtn').onclick = resetTemplateLibrary;
	document.querySelectorAll('.note-template-btn').forEach((button) => {
		button.onclick = () => applyNoteTemplate(button.dataset.noteTarget, button.dataset.noteTemplate);
	});
	document.querySelectorAll('.contact-template-btn').forEach((button) => {
		button.onclick = () => applyContactTemplate(button.dataset.contactTemplate);
	});
	$('logoInput').onchange = async (event) => {
		if (event.target.files[0]) {
			await setShopLogo(event.target.files[0]);
		}
		event.target.value = '';
	};
	$('addPhotosBtn').onclick = () => $('photoInput').click();
	$('photoInput').onchange = async (event) => {
		if (event.target.files.length > 0) {
			await addPhotos(event.target.files);
			recalc();
		}
		event.target.value = '';
	};
	$('searchSaved').oninput = (event) => {
		state.filter = event.target.value;
		renderSavedList();
	};
	$('themeColorSelect').onchange = (event) => {
		applyTheme(event.target.value);
	};
	$('activeOnlyToggle').onchange = (event) => {
		state.activeOnly = event.target.checked;
		renderSavedList();
	};
	$('savedStatusFilter').onchange = (event) => {
		state.statusFilter = event.target.value;
		renderSavedList();
	};
	$('savedAssigneeFilter').onchange = (event) => {
		state.assigneeFilter = event.target.value;
		renderSavedList();
	};
	$('savedRepairTypeFilter').onchange = (event) => {
		state.repairTypeFilter = event.target.value;
		renderSavedList();
	};
	$('savedUrgencyFilter').onchange = (event) => {
		state.urgencyFilter = event.target.value;
		renderSavedList();
	};
	$('savedSort').onchange = (event) => {
		state.sortOrder = event.target.value;
		renderSavedList();
	};
	$('scheduleCalendarGrid').addEventListener('click', (event) => {
		const cell = event.target.closest('.calendar-day');
		if (!cell) {
			return;
		}
		state.calendarSelectedDate = cell.dataset.date;
		renderSchedulingCalendar();
	});
	$('scheduleAgendaList').addEventListener('click', (event) => {
		const actionButton = event.target.closest('[data-agenda-action]');
		if (actionButton?.dataset.agendaAction === 'edit') {
			populateScheduleComposerFromEntry(actionButton.dataset.estimateId, actionButton.dataset.entryType);
			return;
		}
		if (actionButton?.dataset.agendaAction === 'delete') {
			const confirmed = window.confirm('Delete this scheduled item from the calendar?');
			if (!confirmed) {
				return;
			}
			const deleted = deleteCalendarEntry(actionButton.dataset.estimateId, actionButton.dataset.entryType);
			if (deleted) {
				renderSchedulingCalendar();
			}
			return;
		}
		if (actionButton?.dataset.agendaAction === 'open') {
			openEstimateFromCalendar(actionButton.dataset.estimateId);
			return;
		}
		const item = event.target.closest('.schedule-agenda-item');
		if (!item) {
			return;
		}
		openEstimateFromCalendar(item.dataset.estimateId);
	});
	const scheduleDragStart = (event) => {
		const item = event.target.closest('.schedule-draggable');
		if (!item) {
			return;
		}
		state.draggedScheduleEntry = {
			estimateId: item.dataset.estimateId,
			entryType: item.dataset.entryType,
			fromDate: item.dataset.date
		};
		item.classList.add('is-dragging');
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', JSON.stringify(state.draggedScheduleEntry));
	};
	const scheduleDragEnd = (event) => {
		const item = event.target.closest('.schedule-draggable');
		if (item) {
			item.classList.remove('is-dragging');
		}
		state.draggedScheduleEntry = null;
		document.querySelectorAll('.calendar-day').forEach((cell) => cell.classList.remove('is-drop-target'));
	};
	$('scheduleCalendarGrid').addEventListener('dragstart', scheduleDragStart);
	$('scheduleAgendaList').addEventListener('dragstart', scheduleDragStart);
	$('scheduleCalendarGrid').addEventListener('dragend', scheduleDragEnd);
	$('scheduleAgendaList').addEventListener('dragend', scheduleDragEnd);
	$('scheduleCalendarGrid').addEventListener('dragover', (event) => {
		const cell = event.target.closest('.calendar-day');
		if (!cell || !state.draggedScheduleEntry) {
			return;
		}
		event.preventDefault();
		document.querySelectorAll('.calendar-day').forEach((node) => node.classList.remove('is-drop-target'));
		cell.classList.add('is-drop-target');
	});
	$('scheduleCalendarGrid').addEventListener('dragleave', (event) => {
		const cell = event.target.closest('.calendar-day');
		if (cell) {
			cell.classList.remove('is-drop-target');
		}
	});
	$('scheduleCalendarGrid').addEventListener('drop', (event) => {
		const cell = event.target.closest('.calendar-day');
		if (!cell || !state.draggedScheduleEntry) {
			return;
		}
		event.preventDefault();
		cell.classList.remove('is-drop-target');
		const moved = rescheduleCalendarEntry(state.draggedScheduleEntry.estimateId, state.draggedScheduleEntry.entryType, cell.dataset.date);
		state.draggedScheduleEntry = null;
		if (moved) {
			renderSchedulingCalendar();
		}
	});
	$('reportStartDate').onchange = (event) => {
		state.reportStartDate = event.target.value;
		if (state.reportEndDate && state.reportStartDate && state.reportStartDate > state.reportEndDate) {
			state.reportEndDate = state.reportStartDate;
			$('reportEndDate').value = state.reportEndDate;
		}
		renderSavedList();
	};
	$('reportEndDate').onchange = (event) => {
		state.reportEndDate = event.target.value;
		if (state.reportStartDate && state.reportEndDate && state.reportEndDate < state.reportStartDate) {
			state.reportStartDate = state.reportEndDate;
			$('reportStartDate').value = state.reportStartDate;
		}
		renderSavedList();
	};
	$('archiveVisibleBtn').onclick = () => archiveVisibleEstimates(true);
	$('restoreVisibleBtn').onclick = () => archiveVisibleEstimates(false);
	$('deleteArchivedBtn').onclick = deleteArchivedEstimates;
	$('addLineBtn').onclick = () => addLine();
	$('laborGuideGrid').addEventListener('click', (event) => {
		const button = event.target.closest('.labor-guide-btn');
		if (button) {
			insertLaborGuide(button.dataset.guideId);
		}
	});

	document.addEventListener('input', (event) => {
		if (NON_ESTIMATE_UI_IDS.has(event.target.id)) {
			return;
		}
		if (event.target.classList.contains('photo-caption')) {
			updatePhotoCaption(event.target.dataset.photoId, event.target.value);
		}
		if (event.target.matches('input,select,textarea')) {
			recalc();
			markDirty();
		}
	});

	$('photoGrid').addEventListener('change', (event) => {
		if (event.target.classList.contains('photo-caption-preset')) {
			applyPhotoPreset(event.target.dataset.photoId, event.target.value);
		}
	});

	$('photoGrid').addEventListener('click', (event) => {
		if (event.target.classList.contains('delete-photo')) {
			removePhoto(event.target.dataset.photoId);
		}
	});

	$('photoGrid').addEventListener('dragstart', (event) => {
		const card = event.target.closest('.photo-card');
		if (!card) {
			return;
		}
		draggedPhotoId = card.dataset.photoId;
		card.classList.add('is-dragging');
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', draggedPhotoId);
	});

	$('photoGrid').addEventListener('dragend', (event) => {
		const card = event.target.closest('.photo-card');
		if (card) {
			card.classList.remove('is-dragging');
		}
		draggedPhotoId = null;
		document.querySelectorAll('.photo-card').forEach((item) => item.classList.remove('drop-target'));
	});

	$('photoGrid').addEventListener('dragover', (event) => {
		const card = event.target.closest('.photo-card');
		if (!draggedPhotoId || !card) {
			return;
		}
		event.preventDefault();
		document.querySelectorAll('.photo-card').forEach((item) => item.classList.remove('drop-target'));
		card.classList.add('drop-target');
	});

	$('photoGrid').addEventListener('drop', (event) => {
		const card = event.target.closest('.photo-card');
		if (!draggedPhotoId || !card) {
			return;
		}
		event.preventDefault();
		movePhoto(draggedPhotoId, card.dataset.photoId);
		document.querySelectorAll('.photo-card').forEach((item) => item.classList.remove('drop-target'));
	});

	['dragenter', 'dragover'].forEach((eventName) => {
		$('photoDropZone').addEventListener(eventName, (event) => {
			event.preventDefault();
			$('photoDropZone').classList.add('is-active');
		});
	});

	['dragleave', 'drop'].forEach((eventName) => {
		$('photoDropZone').addEventListener(eventName, () => {
			$('photoDropZone').classList.remove('is-active');
		});
	});

	$('photoDropZone').addEventListener('drop', async (event) => {
		event.preventDefault();
		if (event.dataTransfer.files.length > 0) {
			await addPhotos(event.dataTransfer.files);
			recalc();
		}
	});

	$('linesBody').addEventListener('change', (event) => {
		if (event.target.classList.contains('line-category')) {
			const row = event.target.closest('tr');
			applyLineDefaults(row, { updateRate: true, updateHours: true });
			recalc();
			markDirty();
			return;
		}
		if (event.target.classList.contains('line-operation')) {
			const row = event.target.closest('tr');
			applyLineDefaults(row, { updateHours: true });
			recalc();
			markDirty();
		}
	});

	$('linesBody').addEventListener('click', (event) => {
		if (event.target.classList.contains('delete-line')) {
			const id = event.target.closest('tr').dataset.id;
			state.current.lines = state.current.lines.filter((line) => line.id !== id);
			renderLines();
			recalc();
			markDirty();
		}
	});

	document.querySelectorAll('.template-btn').forEach((button) => {
		button.onclick = () => {
			templates[button.dataset.template].forEach(addLine);
			recalc();
			markDirty();
		};
	});

	window.addEventListener('beforeunload', (event) => {
		if (!state.dirty) {
			return;
		}
		saveCurrent({ silent: true });
		event.preventDefault();
		event.returnValue = '';
	});
}

const AUTH_CONFIG_KEY = 'xpressive_estimator_auth_v1';
const AUTH_SESSION_KEY = 'xpressive_estimator_session_v1';

async function hashCredential(value) {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value)));
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
function readAuthConfig() { try { return JSON.parse(localStorage.getItem(AUTH_CONFIG_KEY) || 'null'); } catch { return null; } }
function saveAuthConfig(config) { localStorage.setItem(AUTH_CONFIG_KEY, JSON.stringify(config)); }
function readAuthSession() { try { return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY) || 'null'); } catch { return null; } }
function normalizeUsername(value) { return String(value || '').replace(/[^a-z0-9]/gi, '').toLowerCase(); }
function makeStaffUsername(firstName, lastName) {
	const first = String(firstName || '').trim().charAt(0);
	const last = String(lastName || '').trim().replace(/[^a-z0-9]/gi, '');
	return first && last ? `${first.toUpperCase()}${last.charAt(0).toUpperCase()}${last.slice(1)}` : '';
}
function renderAuthSession(session) {
	$('authGate').hidden = Boolean(session);
	$('programChoice').hidden = !session;
	$('signedInIdentity').hidden = !session;
	$('signOutBtn').hidden = !session;
	$('programChoiceBtn').hidden = !session;
	$('manageStaffBtn').hidden = session?.role !== 'Service Manager';
	if (session) { $('signedInName').textContent = session.name; $('signedInRole').textContent = session.role; $('programChoiceWelcome').textContent = `Signed in as ${session.name} - ${session.role}`; }
}
function showAuthFailure(message, targetId) {
	$(targetId).textContent = message;
	$('authGate').classList.remove('is-denied'); void $('authGate').offsetWidth; $('authGate').classList.add('is-denied');
}
function configureManagerSetupState() {
	const firstRun = !readAuthConfig()?.manager;
	$('managerLoginTitle').textContent = firstRun ? 'Create Manager Account' : 'Manager Sign In';
	$('managerLoginHelp').textContent = firstRun ? 'First-time setup: create the service manager credentials used to control staff access.' : 'Sign in to manage shop access and staff accounts.';
	$('confirmManagerPasswordLabel').hidden = !firstRun;
	$('confirmManagerPassword').required = firstRun;
	$('managerLoginSubmit').textContent = firstRun ? 'Create Manager & Open' : 'Open Dashboard';
}
function renderStaffAccounts() {
	const config = readAuthConfig() || { staff: [] };
	const list = $('staffAccountList'); list.innerHTML = '';
	if (!config.staff?.length) { list.innerHTML = '<p class="lead">No staff accounts yet. Add the first staff member above.</p>'; return; }
	config.staff.forEach((account) => {
		const card = document.createElement('div'); card.className = `staff-account-card${account.enabled === false ? ' is-disabled' : ''}`;
		card.innerHTML = `<div><strong>${escapeHtml(account.firstName)} ${escapeHtml(account.lastName)}</strong><small>${escapeHtml(account.username)} · ${escapeHtml(account.role)}${account.enabled === false ? ' · Disabled' : ''}</small></div><div class="staff-account-actions"><button type="button" data-edit-staff="${account.id}">Edit</button><button type="button" class="secondary-btn" data-toggle-staff="${account.id}">${account.enabled === false ? 'Enable' : 'Disable'}</button></div>`;
		list.appendChild(card);
	});
	list.querySelectorAll('[data-edit-staff]').forEach((button) => button.onclick = () => {
		const account=config.staff.find((item)=>item.id===button.dataset.editStaff); if(!account)return;
		$('staffAccountId').value=account.id; $('staffFirstName').value=account.firstName; $('staffLastName').value=account.lastName; $('staffRole').value=account.role; $('staffAssignedPin').value=''; $('staffAssignedPin').required=false; updateStaffUsernamePreview();
	});
	list.querySelectorAll('[data-toggle-staff]').forEach((button) => button.onclick = () => {
		const account=config.staff.find((item)=>item.id===button.dataset.toggleStaff); if(!account)return;
		account.enabled=account.enabled===false; saveAuthConfig(config); renderStaffAccounts();
	});
}
function updateStaffUsernamePreview() { $('staffUsernamePreview').textContent = makeStaffUsername($('staffFirstName').value, $('staffLastName').value) || '—'; }
function setupAuthGate() {
	configureManagerSetupState();
	const signOut=()=>{saveCurrent({silent:true});sessionStorage.removeItem(AUTH_SESSION_KEY);renderAuthSession(null);configureManagerSetupState();};
	$('openEstimatorBtn').onclick=()=>{$('programChoice').hidden=true;};
	$('programChoiceBtn').onclick=()=>{$('programChoiceError').textContent='';$('programChoice').hidden=false;};
	$('openEngineeringSuiteBtn').onclick=async()=>{
		$('programChoiceError').textContent='';
		if(!window.programBridge?.isElectron){$('programChoiceError').textContent='Open the installed desktop app to launch the Engineering Repair Suite.';return;}
		const result=await window.programBridge.openEngineeringSuite();
		if(!result?.ok)$('programChoiceError').textContent=result?.message||'The Engineering Repair Suite could not be opened.';
	};
	$('choiceSignOutBtn').onclick=signOut;
	const selectMode=(mode)=>{const shop=mode==='shop';$('shopLoginTab').classList.toggle('is-active',shop);$('staffLoginTab').classList.toggle('is-active',!shop);$('shopLoginForm').hidden=!shop;$('staffLoginForm').hidden=shop;};
	$('shopLoginTab').onclick=()=>selectMode('shop'); $('staffLoginTab').onclick=()=>selectMode('staff');
	$('shopLoginForm').onsubmit=async(event)=>{event.preventDefault();$('shopLoginError').textContent='';let config=readAuthConfig();const username=$('shopUsername').value.trim();const password=$('shopPassword').value;
		if(!config?.manager){if(password!==$('confirmManagerPassword').value){showAuthFailure('Passwords do not match.','shopLoginError');return;} config={manager:{username,usernameKey:normalizeUsername(username),passwordHash:await hashCredential(password)},staff:[]};saveAuthConfig(config);}
		else if(normalizeUsername(username)!==config.manager.usernameKey || await hashCredential(password)!==config.manager.passwordHash){showAuthFailure('Incorrect manager username or password.','shopLoginError');return;}
		const session={name:username,role:'Service Manager',signedInAt:new Date().toISOString()};sessionStorage.setItem(AUTH_SESSION_KEY,JSON.stringify(session));$('shopPassword').value='';$('confirmManagerPassword').value='';renderAuthSession(session);
	};
	$('staffLoginForm').onsubmit=async(event)=>{event.preventDefault();$('staffLoginError').textContent='';const config=readAuthConfig();const account=config?.staff?.find((item)=>item.usernameKey===normalizeUsername($('staffUsername').value));
		if(!account||account.enabled===false||await hashCredential($('staffPin').value)!==account.pinHash){showAuthFailure('Incorrect username or PIN, or this account is disabled.','staffLoginError');return;}
		const session={name:`${account.firstName} ${account.lastName}`,role:account.role,username:account.username,signedInAt:new Date().toISOString()};sessionStorage.setItem(AUTH_SESSION_KEY,JSON.stringify(session));$('staffPin').value='';renderAuthSession(session);
	};
	$('manageStaffBtn').onclick=()=>{$('staffManagerModal').hidden=false;renderStaffAccounts();}; $('closeStaffManagerBtn').onclick=()=>{$('staffManagerModal').hidden=true;};
	$('staffFirstName').oninput=updateStaffUsernamePreview; $('staffLastName').oninput=updateStaffUsernamePreview;
	$('staffAccountForm').onsubmit=async(event)=>{event.preventDefault();$('staffManagerError').textContent='';const config=readAuthConfig();const id=$('staffAccountId').value;const firstName=$('staffFirstName').value.trim();const lastName=$('staffLastName').value.trim();const username=makeStaffUsername(firstName,lastName);const usernameKey=normalizeUsername(username);const existing=config.staff.find((item)=>item.id===id);const duplicate=config.staff.find((item)=>item.usernameKey===usernameKey&&item.id!==id);if(duplicate){$('staffManagerError').textContent='That generated username is already assigned.';return;}const pin=$('staffAssignedPin').value;if(!existing&&!/^\d{4}$/.test(pin)){ $('staffManagerError').textContent='Assign exactly four PIN digits.';return;}const account={id:existing?.id||crypto.randomUUID(),firstName,lastName,username,usernameKey,role:$('staffRole').value,pinHash:pin?await hashCredential(pin):existing.pinHash,enabled:existing?.enabled!==false};if(existing)Object.assign(existing,account);else config.staff.push(account);saveAuthConfig(config);event.target.reset();$('staffAccountId').value='';$('staffAssignedPin').required=true;updateStaffUsernamePreview();renderStaffAccounts();};
	$('signOutBtn').onclick=signOut;
	renderAuthSession(readAuthSession());
}
function boot() {
	applyTheme(loadThemePreference(), { persistTheme: false });
	state.current = state.estimates[0] ? normalizeEstimate(structuredClone(state.estimates[0])) : defaultEstimate();
	state.calendarMonth = getDefaultCalendarMonth();
	state.calendarView = 'month';
	state.activeContentTab = 'overview';
	$('activeOnlyToggle').checked = state.activeOnly;
	$('savedStatusFilter').value = state.statusFilter;
	$('savedRepairTypeFilter').value = state.repairTypeFilter;
	$('savedUrgencyFilter').value = state.urgencyFilter;
	$('savedSort').value = state.sortOrder;
	$('scheduleViewSelect').value = state.calendarView;
	$('reportStartDate').value = state.reportStartDate;
	$('reportEndDate').value = state.reportEndDate;
	renderForm();
	setInsurerLookupStatus();
	renderAiSettings();
	renderAiChat();
	renderBrandProfile();
	renderTemplateLibraryEditor();
	renderArchiveButton();
	renderHistory();
	renderLaborGuides();
	renderLines();
	renderChecklist();
	renderPhotos();
	renderContentWorkspace();
	renderSavedList();
	recalc();
	wireEvents();
	updateSaveState();
	setupAuthGate();
	dismissStartupSplash();
}

boot();
