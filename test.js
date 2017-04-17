'use strict';
const test = require('ava');
const tempfile = require('tempfile');
const readPkg = require('read-pkg');
const m = require('.');

const fixture = {
	foo: true,
	scripts: {
		b: '1',
		a: '1'
	},
	dependencies: {
		foo: '1.0.0',
		bar: '1.0.0'
	},
	devDependencies: {
		foo: '1.0.0',
		bar: '1.0.0'
	},
	optionalDependencies: {
		foo: '1.0.0',
		bar: '1.0.0'
	},
	peerDependencies: {
		foo: '1.0.0',
		bar: '1.0.0'
	}
};

test('async', async t => {
	const tmp = tempfile();
	await m(tmp, fixture);
	const x = await readPkg(tmp, {normalize: false});
	t.true(x.foo);
	t.deepEqual(Object.keys(x.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(x.dependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(x.devDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(x.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(x.peerDependencies), ['bar', 'foo']);
});

test('sync', t => {
	const tmp = tempfile();
	m.sync(tmp, fixture);
	const x = readPkg.sync(tmp, {normalize: false});
	t.true(x.foo);
	t.deepEqual(Object.keys(x.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(x.dependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(x.devDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(x.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(x.peerDependencies), ['bar', 'foo']);
});

const emptyPropFixture = {
	foo: true,
	dependencies: {},
	devDependencies: {},
	optionalDependencies: {},
	peerDependencies: {}
};

test('removes empty dependency properties', async t => {
	const tmp = tempfile();
	await m(tmp, emptyPropFixture);
	const x = await readPkg(tmp, {normalize: false});
	t.true(x.foo);
	t.falsy(x.dependencies);
	t.falsy(x.devDependencies);
	t.falsy(x.optionalDependencies);
	t.falsy(x.peerDependencies);
});

test('removes empty dependency properties sync', t => {
	const tmp = tempfile();
	m.sync(tmp, emptyPropFixture);
	const x = readPkg.sync(tmp, {normalize: false});
	t.true(x.foo);
	t.falsy(x.dependencies);
	t.falsy(x.devDependencies);
	t.falsy(x.optionalDependencies);
	t.falsy(x.peerDependencies);
});
