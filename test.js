'use strict';
const test = require('ava');
const tempfile = require('tempfile');
const readPkg = require('read-pkg');
const m = require('./');

const fixture = {foo: true};

test('async', async t => {
	const tmp = tempfile();
	await m(tmp, fixture);
	const x = await readPkg(tmp);
	t.true(x.foo);
});

test('sync', t => {
	const tmp = tempfile();
	m.sync(tmp, fixture);
	const x = readPkg.sync(tmp);
	t.true(x.foo);
});
