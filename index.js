'use strict';
const path = require('path');
const writeJsonFile = require('write-json-file');

const opts = {indent: 2};

module.exports = (fp, data) => {
	if (typeof fp !== 'string') {
		data = fp;
		fp = '.';
	}

	fp = path.basename(fp) === 'package.json' ? fp : path.join(fp, 'package.json');

	return writeJsonFile(fp, data, opts);
};

module.exports.sync = (fp, data) => {
	if (typeof fp !== 'string') {
		data = fp;
		fp = '.';
	}

	fp = path.basename(fp) === 'package.json' ? fp : path.join(fp, 'package.json');

	writeJsonFile.sync(fp, data, opts);
};
