import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, 'assets');
const sourceLogo = path.join(assetsDir, 'shop-logo-source.png');
const sourceSvg = path.join(assetsDir, 'icon-source.svg');
const outputPng = path.join(assetsDir, 'icon.png');
const outputIco = path.join(assetsDir, 'icon.ico');

async function buildIcons() {
	await fs.mkdir(assetsDir, { recursive: true });
	let pngBuffer;
	try {
		await fs.access(sourceLogo);
		const logoImage = sharp(sourceLogo);
		const logoMetadata = await logoImage.metadata();
		const squareSize = Math.min(logoMetadata.width || 768, logoMetadata.height || 768);
		const cropLeft = Math.max(0, Math.round(((logoMetadata.width || squareSize) - squareSize) / 2));
		const cropTop = Math.max(0, Math.round(((logoMetadata.height || squareSize) - squareSize) / 2));
		const croppedLogo = await logoImage
			.extract({
				left: cropLeft,
				top: cropTop,
				width: squareSize,
				height: squareSize
			})
			.resize(420, 420, { fit: 'cover', position: 'centre' })
			.png()
			.toBuffer();
		const badgeMask = await sharp({
			create: {
				width: 420,
				height: 420,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 0 }
			}
		})
			.composite([{
				input: Buffer.from(`
					<svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
						<rect x="14" y="14" width="392" height="392" rx="96" ry="96" fill="white" />
					</svg>
				`),
				blend: 'dest-in'
			}])
			.png()
			.toBuffer();
		const badgeBuffer = await sharp(croppedLogo)
			.composite([{ input: badgeMask, blend: 'dest-in' }])
			.png()
			.toBuffer();
		pngBuffer = await sharp({
			create: {
				width: 512,
				height: 512,
				channels: 4,
				background: { r: 6, g: 6, b: 6, alpha: 1 }
			}
		})
			.composite([
				{
					input: Buffer.from(`
						<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<radialGradient id="glow" cx="50%" cy="44%" r="56%">
									<stop offset="0%" stop-color="#ff4220" stop-opacity="0.34"/>
									<stop offset="52%" stop-color="#c21d10" stop-opacity="0.12"/>
									<stop offset="100%" stop-color="#000000" stop-opacity="0"/>
								</radialGradient>
							</defs>
							<rect width="512" height="512" rx="120" fill="#050505"/>
							<rect x="18" y="18" width="476" height="476" rx="108" fill="#0d0d0d" stroke="#2a2a2a" stroke-width="2"/>
							<circle cx="256" cy="216" r="180" fill="url(#glow)"/>
						</svg>
					`),
					gravity: 'center'
				},
				{
					input: badgeBuffer,
					gravity: 'center'
				},
				{
					input: Buffer.from(`
						<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
							<rect x="20" y="20" width="472" height="472" rx="106" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
						</svg>
					`),
					gravity: 'center'
				}
			])
			.png()
			.toBuffer();
	} catch {
		const svgBuffer = await fs.readFile(sourceSvg);
		pngBuffer = await sharp(svgBuffer)
			.resize(512, 512)
			.png()
			.toBuffer();
	}
	await fs.writeFile(outputPng, pngBuffer);
	const icoBuffer = await pngToIco(pngBuffer);
	await fs.writeFile(outputIco, icoBuffer);
	console.log(`Created ${path.relative(rootDir, outputPng)} and ${path.relative(rootDir, outputIco)}`);
}

buildIcons().catch((error) => {
	console.error('Failed to build application icons.');
	console.error(error);
	process.exitCode = 1;
});