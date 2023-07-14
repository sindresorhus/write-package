import {writeJsonFile, writeJsonFileSync} from 'write-json-file';
import {sanitize} from './util.js';

export async function writePackage(filePath, data, options) {
	({filePath, data, options} = sanitize(filePath, data, options));
	return writeJsonFile(filePath, data, options);
}

export function writePackageSync(filePath, data, options) {
	({filePath, data, options} = sanitize(filePath, data, options));
	writeJsonFileSync(filePath, data, options);
}
