import path from 'node:path';
import {writeJsonFile, writeJsonFileSync} from 'write-json-file';
import {readPackage, readPackageSync} from 'read-pkg';
import {updatePackage, updatePackageSync} from './update-package.js';
import {sanitize, normalize, hasMultipleDependencyTypes} from './util.js';

export async function addPackageDependencies(filePath, dependencies, options) {
	return hasMultipleDependencyTypes(typeof filePath === 'string' ? dependencies : filePath)
		? updatePackage(filePath, {...dependencies}, options)
		: updatePackage(filePath, {dependencies}, options);
}

export function addPackageDependenciesSync(filePath, dependencies, options) {
	return hasMultipleDependencyTypes(typeof filePath === 'string' ? dependencies : filePath)
		? updatePackageSync(filePath, {...dependencies}, options)
		: updatePackageSync(filePath, {dependencies}, options);
}

export async function removePackageDependencies(filePath, dependencies, options) {
	({filePath, data: dependencies, options} = sanitize(filePath, dependencies, options, {sanitizeData: false}));

	let pkg;

	try {
		pkg = await readPackage({cwd: path.dirname(filePath), normalize: false});
	} catch (error) {
		// 'package.json' doesn't exist
		if (error.code === 'ENOENT') {
			return;
		}

		throw error;
	}

	if (Array.isArray(dependencies)) {
		for (const dependency of dependencies) {
			delete pkg.dependencies[dependency];
		}
	} else {
		for (const [dependencyKey, dependency] of Object.entries(dependencies)) {
			delete pkg[dependencyKey][dependency];
		}
	}

	if (options.normalize) {
		pkg = normalize(pkg);
	}

	return writeJsonFile(filePath, pkg, options);
}

export function removePackageDependenciesSync(filePath, dependencies, options) {
	({filePath, data: dependencies, options} = sanitize(filePath, dependencies, options, {sanitizeData: false}));

	let pkg;

	try {
		pkg = readPackageSync({cwd: path.dirname(filePath), normalize: false});
	} catch (error) {
		// 'package.json' doesn't exist
		if (error.code === 'ENOENT') {
			return;
		}

		throw error;
	}

	if (Array.isArray(dependencies)) {
		for (const dependency of dependencies) {
			delete pkg.dependencies[dependency];
		}
	} else {
		for (const [dependencyKey, dependency] of Object.entries(dependencies)) {
			delete pkg[dependencyKey][dependency];
		}
	}

	if (options.normalize) {
		pkg = normalize(pkg);
	}

	writeJsonFileSync(filePath, pkg, options);
}
