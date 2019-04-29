import fs from 'fs';
import path from 'path';
import test from 'ava';
import tempfile from 'tempfile';
import readPackage from 'read-pkg';
import writeJsonFile from 'write-json-file';
import writePackage from '.';

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
	const temp = tempfile();
	await writePackage(temp, fixture);
	const packageJson = await readPackage({cwd: temp, normalize: false});
	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
});

test('sync', t => {
	const temp = tempfile();
	writePackage.sync(temp, fixture);
	const packageJson = readPackage.sync({cwd: temp, normalize: false});
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
	peerDependencies: {}
};

test('removes empty dependency properties by default', async t => {
	const temp = tempfile();
	await writePackage(temp, emptyPropFixture);
	const packageJson = await readPackage({cwd: temp, normalize: false});
	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('removes empty dependency properties sync by default', t => {
	const temp = tempfile();
	writePackage.sync(temp, emptyPropFixture);
	const packageJson = readPackage.sync({cwd: temp, normalize: false});
	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('allow not removing empty dependency properties', async t => {
	const temp = tempfile();
	await writePackage(temp, emptyPropFixture, {normalize: false});
	const packageJson = await readPackage({cwd: temp, normalize: false});
	t.true(packageJson.foo);
	t.truthy(packageJson.dependencies);
	t.truthy(packageJson.devDependencies);
	t.truthy(packageJson.optionalDependencies);
	t.truthy(packageJson.peerDependencies);
});

test('allow not removing empty dependency properties sync', t => {
	const temp = tempfile();
	writePackage.sync(temp, emptyPropFixture, {normalize: false});
	const packageJson = readPackage.sync({cwd: temp, normalize: false});
	t.true(packageJson.foo);
	t.truthy(packageJson.dependencies);
	t.truthy(packageJson.devDependencies);
	t.truthy(packageJson.optionalDependencies);
	t.truthy(packageJson.peerDependencies);
});

test('detect tab indent', async t => {
	const temp = path.join(tempfile(), 'package.json');
	await writeJsonFile(temp, {foo: true}, {indent: '\t'});
	await writePackage(temp, {foo: true, bar: true, foobar: true});
	t.is(
		fs.readFileSync(temp, 'utf8'),
		'{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n'
	);
});

test('detect tab indent sync', async t => {
	const temp = path.join(tempfile(), 'package.json');
	await writeJsonFile(temp, {foo: true}, {indent: '\t'});
	writePackage.sync(temp, {foo: true, bar: true, foobar: true});
	t.is(
		fs.readFileSync(temp, 'utf8'),
		'{\n\t"foo": true,\n\t"bar": true,\n\t"foobar": true\n}\n'
	);
});

test('detect 2 spaces indent', async t => {
	const temp = path.join(tempfile(), 'package.json');
	await writeJsonFile(temp, {foo: true}, {indent: 2});
	await writePackage(temp, {foo: true, bar: true, foobar: true});
	t.is(
		fs.readFileSync(temp, 'utf8'),
		'{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n'
	);
});

test('detect 2 spaces indent sync', async t => {
	const temp = path.join(tempfile(), 'package.json');
	await writeJsonFile(temp, {foo: true}, {indent: 2});
	writePackage.sync(temp, {foo: true, bar: true, foobar: true});
	t.is(
		fs.readFileSync(temp, 'utf8'),
		'{\n  "foo": true,\n  "bar": true,\n  "foobar": true\n}\n'
	);
});
