'use strict';
const path = require('path');
const writeJsonFile = require('write-json-file');
const sortKeys = require('sort-keys');

const opts = {indent: 2};

module.exports = (fp, data) => {
	if (typeof fp !== 'string') {
		data = fp;
		fp = '.';
	}

	fp = path.basename(fp) === 'package.json' ? fp : path.join(fp, 'package.json');

	data = normalize(data);

	return writeJsonFile(fp, data, opts);
};

module.exports.sync = (fp, data) => {
	if (typeof fp !== 'string') {
		data = fp;
		fp = '.';
	}

	fp = path.basename(fp) === 'package.json' ? fp : path.join(fp, 'package.json');

	data = normalize(data);

	writeJsonFile.sync(fp, data, opts);
};

const dependencyKeys = new Set([
	'dependencies',
	'devDependencies',
	'optionalDependencies',
	'peerDependencies'
]);

function normalize(pkg) {
	const npkg = {};
	for (const key of Object.keys(pkg)) {
		npkg[key] = dependencyKeys.has(key) ? sortKeys(pkg[key]) : pkg[key];
	}
	return npkg;
}
