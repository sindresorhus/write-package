import path from 'node:path';
import {writeJsonFile, writeJsonFileSync} from 'write-json-file';
import {readPackage, readPackageSync} from 'read-pkg';
import sortKeys from 'sort-keys';

const dependencyKeys = new Set([
	'dependencies',
	'devDependencies',
	'optionalDependencies',
	'peerDependencies',
]);

function normalize(packageJson) {
	const result = {};

	for (const key of Object.keys(packageJson)) {
		if (!dependencyKeys.has(key)) {
			result[key] = packageJson[key];
		} else if (Object.keys(packageJson[key]).length > 0) {
			result[key] = sortKeys(packageJson[key]);
		}
	}

	return result;
}

function sanitize(filePath, data, options, sanitizeData = true) {
	if (typeof filePath !== 'string') {
		options = data;
		data = filePath;
		filePath = '.';
	}

	options = {
		normalize: true,
		...options,
		detectIndent: true,
	};

	filePath = path.basename(filePath) === 'package.json' ? filePath : path.join(filePath, 'package.json');

	if (options.normalize && sanitizeData) {
		data = normalize(data);
	}

	return {filePath, data, options};
}

export async function writePackage(filePath, data, options) {
	({filePath, data, options} = sanitize(filePath, data, options));
	return writeJsonFile(filePath, data, options);
}

export function writePackageSync(filePath, data, options) {
	({filePath, data, options} = sanitize(filePath, data, options));
	writeJsonFileSync(filePath, data, options);
}

function mergeDependencies(pkg, dependencies, options) {
	const hasMultipleDependencyTypes = Object.keys(dependencies).some(key => dependencyKeys.has(key));

	if (hasMultipleDependencyTypes) {
		for (const key of dependencyKeys) {
			pkg[key] = {...pkg[key], ...dependencies[key]};
		}
	} else {
		pkg.dependencies = {...pkg.dependencies, ...dependencies};
	}

	if (options.normalize) {
		pkg = normalize(pkg);
	}

	return pkg;
}

export async function addPackageDependencies(filePath, dependencies, options) {
	({filePath, data: dependencies, options} = sanitize(filePath, dependencies, options, false));

	let pkg = await readPackage({cwd: path.dirname(filePath)});
	pkg = mergeDependencies(pkg, dependencies, options);

	return writeJsonFile(filePath, pkg, options);
}

export function addPackageDependenciesSync(filePath, dependencies, options) {
	({filePath, data: dependencies, options} = sanitize(filePath, dependencies, options, false));

	let pkg = readPackageSync({cwd: path.dirname(filePath)});
	pkg = mergeDependencies(pkg, dependencies, options);

	writeJsonFileSync(filePath, pkg, options);
}
