const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const prettier = require('prettier');
const isTextPath = require('is-text-path');
const { formatText } = require('lua-fmt');
const luamin = require('lua-format')

const projectRoot = path.join(__dirname, '..', '..');
const fileBlacklist = [
	"-lock",
	"package.json",
	".lock",
	".yml",
	".py",
	"tsconfig.json",
	"tslint.json",
	"config.",
	".ttf",
	".woff",
	".woff2",
	".map",
	"fxmanifest.lua",
	"__resource.lua",
];

const dirWhitelist = [
	"node_modules",
	"tools",
	"build",
	"dist"
];

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function convertIndentation(filePath) {
	const fileContents = await promisify(fs.readFile)(filePath, 'utf8');
	const formattedContents = prettier.format(fileContents, {
		filepath: filePath,
		tabWidth: 4,
		useTabs: true,
	});
	await promisify(fs.writeFile)(filePath, formattedContents, 'utf8');
	console.log(`Converted indentation: ${filePath}`);
}

async function fallbackFormat(fullPath) {
	if (fullPath.endsWith(".lua")) {
		const fileContents = await promisify(fs.readFile)(fullPath, 'utf8');
		try {
			let formatted = formatText(fileContents, {
				indentCount: 4,
				useTabs: true,
			});

			// ensure a newline after each Lua comment block
			formatted = formatted.replace(/(\]\])\s*(?=[^\n])/g, '$1\n');

			formatted = luamin.Beautify(formatted, {
				RenameVariables: false,
				RenameGlobals: false,
				SolveMath: false
			});

			// what in the fuck ??
			if (formatted.startsWith(`--discord.gg/boronide, code generated using luamin.js™`)) {
				// remove first 4 lines
				formatted = formatted.split('\n').slice(4).join('\n');
			}

			await promisify(fs.writeFile)(fullPath, formatted, 'utf8');
			console.log(`Lua Converted indentation: ${fullPath}`);
		} catch {
			const updatedContents = fileContents.replace(/^( {2}|\t)/gm, '    '); // Update the number of spaces here
			console.log(`Manually Converted indentation: ${fullPath}`);
			await promisify(fs.writeFile)(fullPath, updatedContents, 'utf8');
		}
	}
}

async function processDirectory(dirPath) {
	const entries = await readdir(dirPath);

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry);
		const stats = await stat(fullPath);

		if (stats.isDirectory()) {
			if (!dirWhitelist.includes(entry)) {
				await processDirectory(fullPath);
			}
		} else if (stats.isFile()) {
			const fileName = path.basename(fullPath);
			if (!fileBlacklist.some((name) => fileName.includes(name))) {
				if (isTextPath(fullPath)) {
					try {
						await convertIndentation(fullPath);
					} catch (error) {
						await fallbackFormat(fullPath);
					}
				}
			}
		}
	}
}

async function convertFilesToFourSpaceIndentation() {
	try {
		await processDirectory(projectRoot);
		console.log('Indentation conversion completed successfully.');
	} catch (error) {
		console.error('Error occurred during indentation conversion:', error);
	}
}

console.log("RUNNING IN " + projectRoot);

convertFilesToFourSpaceIndentation();