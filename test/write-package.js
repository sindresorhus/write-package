import fs, {promises as fsPromises} from 'node:fs';
import path from 'node:path';
import test from 'ava';
import {temporaryDirectory} from 'tempy';
import {readPackage, readPackageSync} from 'read-pkg';
import {writeJsonFile} from 'write-json-file';
import {writePackage, writePackageSync} from '../index.js';

const fixture = {
	foo: true,
	scripts: {
		b: '1',
		a: '1',
	},
	dependencies: {
		foo: '1.0.0',
		bar: '1.0.0',
	},
	devDependencies: {
		foo: '1.0.0',
		bar: '1.0.0',
	},
	optionalDependencies: {
		foo: '1.0.0',
		bar: '1.0.0',
	},
	peerDependencies: {
		foo: '1.0.0',
		bar: '1.0.0',
	},
};

test('async', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, fixture);
	const packageJson = await readPackage({cwd: temporary, normalize: false});
	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
});

test('sync', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, fixture);
	const packageJson = readPackageSync({cwd: temporary, normalize: false});
	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
});

const emptyPropFixture = {
	foo: true,
	dependencies: {},
	devDependencies: {},
	optionalDependencies: {},
	peerDependencies: {},
};

test('async - removes empty dependency properties by default', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, emptyPropFixture);
	const packageJson = await readPackage({cwd: temporary, normalize: false});
	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('async - removes empty dependency properties sync by default', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, emptyPropFixture);
	const packageJson = readPackageSync({cwd: temporary, normalize: false});
	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('async - allow not removing empty dependency properties', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, emptyPropFixture, {normalize: false});
	const packageJson = await readPackage({cwd: temporary, normalize: false});
	t.true(packageJson.foo);
	t.truthy(packageJson.dependencies);
	t.truthy(packageJson.devDependencies);
	t.truthy(packageJson.optionalDependencies);
	t.truthy(packageJson.peerDependencies);
});

test('sync - allow not removing empty dependency properties', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, emptyPropFixture, {normalize: false});
	const packageJson = readPackageSync({cwd: temporary, normalize: false});
	t.true(packageJson.foo);
	t.truthy(packageJson.dependencies);
	t.truthy(packageJson.devDependencies);
	t.truthy(packageJson.optionalDependencies);
	t.truthy(packageJson.peerDependencies);
});

test('async - detect tab indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	await writeJsonFile(temporary, {foo: true}, {indent: '\t'});
	await writePackage(temporary, {foo: true, bar: true, foobar: true});
	t.is(
		await fsPromises.readFile(temporary, 'utf8'),
		'{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n',
	);
});

test('sync - detect tab indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	await writeJsonFile(temporary, {foo: true}, {indent: '\t'});
	writePackageSync(temporary, {foo: true, bar: true, foobar: true});
	t.is(
		await fsPromises.readFile(temporary, 'utf8'),
		'{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n',
	);
});

test('async - detect 2 spaces indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	await writeJsonFile(temporary, {foo: true}, {indent: 2});
	await writePackage(temporary, {foo: true, bar: true, foobar: true});
	t.is(
		await fsPromises.readFile(temporary, 'utf8'),
		'{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n',
	);
});

test('sync - detect 2 spaces indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	await writeJsonFile(temporary, {foo: true}, {indent: 2});
	writePackageSync(temporary, {foo: true, bar: true, foobar: true});
	t.is(
		fs.readFileSync(temporary, 'utf8'),
		'{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n',
	);
});
