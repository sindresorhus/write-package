import path from 'node:path';
import {writeJsonFile, writeJsonFileSync} from 'write-json-file';
import {readPackage, readPackageSync} from 'read-pkg';
import sortKeys from 'sort-keys';
import {deepmerge} from 'deepmerge-ts';

const dependencyKeys = new Set([
	'dependencies',
	'devDependencies',
	'optionalDependencies',
	'peerDependencies',
]);

const hasMultipleDependencyTypes = dependencies => Object.keys(dependencies).some(key => dependencyKeys.has(key));

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

function sanitize(filePath, data, options, {sanitizeData = true} = {}) {
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

export async function updatePackage(filePath, data, options) {
	({filePath, data, options} = sanitize(filePath, data, options));

	let pkg;

	try {
		pkg = await readPackage({cwd: path.dirname(filePath), normalize: false});
	} catch (error) {
		// 'package.json' doesn't exist
		if (error.code === 'ENOENT') {
			return writeJsonFile(filePath, data, options);
		}

		throw error;
	}

	pkg = deepmerge(pkg, data);

	if (options.normalize) {
		pkg = normalize(pkg);
	}

	return writeJsonFile(filePath, pkg, options);
}

export function updatePackageSync(filePath, data, options) {
	({filePath, data, options} = sanitize(filePath, data, options));

	let pkg;

	try {
		pkg = readPackageSync({cwd: path.dirname(filePath), normalize: false});
	} catch (error) {
		// 'package.json' doesn't exist
		if (error.code === 'ENOENT') {
			writeJsonFileSync(filePath, data, options);
			return;
		}

		throw error;
	}

	pkg = deepmerge(pkg, data);

	if (options.normalize) {
		pkg = normalize(pkg);
	}

	writeJsonFileSync(filePath, pkg, options);
}

export async function addPackageDependencies(filePath, dependencies, options) {
	return hasMultipleDependencyTypes(dependencies)
		? updatePackage(filePath, {...dependencies}, options)
		: updatePackage(filePath, {dependencies}, options);
}

export function addPackageDependenciesSync(filePath, dependencies, options) {
	return hasMultipleDependencyTypes(dependencies)
		? updatePackageSync(filePath, {...dependencies}, options)
		: updatePackageSync(filePath, {dependencies}, options);
}
