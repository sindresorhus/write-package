'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const tempfile = require('tempfile');
const readPkg = require('read-pkg');
const writeJsonFile = require('write-json-file');
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

test('detect tab indent', async t => {
	const tmp = path.join(tempfile(), 'package.json');
	await writeJsonFile(tmp, {foo: true}, {indent: '\t'});
	await m(tmp, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(tmp, 'utf8'), '{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n');
});

test('detect tab indent sync', async t => {
	const tmp = path.join(tempfile(), 'package.json');
	await writeJsonFile(tmp, {foo: true}, {indent: '\t'});
	m.sync(tmp, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(tmp, 'utf8'), '{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n');
});

test('detect 2 spaces indent', async t => {
	const tmp = path.join(tempfile(), 'package.json');
	await writeJsonFile(tmp, {foo: true}, {indent: 2});
	await m(tmp, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
});

test('detect 2 spaces indent sync', async t => {
	const tmp = path.join(tempfile(), 'package.json');
	await writeJsonFile(tmp, {foo: true}, {indent: 2});
	m.sync(tmp, {foo: true, bar: true, foobar: true}, {detectIndent: true});
	t.is(fs.readFileSync(tmp, 'utf8'), '{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n');
});
