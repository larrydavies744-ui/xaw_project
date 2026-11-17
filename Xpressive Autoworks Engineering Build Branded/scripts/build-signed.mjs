import { spawn } from 'node:child_process';
import path from 'node:path';

const certLink = process.env.WIN_CSC_LINK || process.env.CSC_LINK || '';
const certPassword = process.env.WIN_CSC_KEY_PASSWORD || process.env.CSC_KEY_PASSWORD || '';
const env = { ...process.env };

if (certLink && certPassword) {
	env.CSC_LINK = certLink;
	env.CSC_KEY_PASSWORD = certPassword;
	console.log('Using Windows code-signing certificate from environment variables.');
} else {
	console.warn('No code-signing certificate variables were found. Building an unsigned installer.');
	console.warn('Set CSC_LINK and CSC_KEY_PASSWORD, or WIN_CSC_LINK and WIN_CSC_KEY_PASSWORD, for a signed release.');
}

const builderBinary = path.join(
	process.cwd(),
	'node_modules',
	'.bin',
	process.platform === 'win32' ? 'electron-builder.cmd' : 'electron-builder'
);

const child = process.platform === 'win32'
	? spawn(`"${builderBinary}" --win nsis`, {
		stdio: 'inherit',
		env,
		shell: true
	})
	: spawn(builderBinary, ['--win', 'nsis'], {
		stdio: 'inherit',
		env
	});

child.on('exit', (code) => {
	process.exit(code ?? 1);
});

child.on('error', (error) => {
	console.error('Failed to launch electron-builder for the signed release flow.');
	console.error(error);
	process.exit(1);
});