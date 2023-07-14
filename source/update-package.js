import path from 'node:path';
import {writeJsonFile, writeJsonFileSync} from 'write-json-file';
import {readPackage, readPackageSync} from 'read-pkg';
import {deepmerge} from 'deepmerge-ts';
import {sanitize, normalize} from './util.js';

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
