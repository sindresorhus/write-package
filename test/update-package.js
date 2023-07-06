import path from 'node:path';
import test from 'ava';
import {temporaryDirectory} from 'tempy';
import {readPackage, readPackageSync} from 'read-pkg';
import {writeJsonFile, writeJsonFileSync} from 'write-json-file';
import {writePackage, writePackageSync, updatePackage, updatePackageSync} from '../index.js';

const emptyPropFixture = {
	foo: true,
	dependencies: {},
	devDependencies: {},
	optionalDependencies: {},
	peerDependencies: {},
};

test('async', async t => {
	const temporary = temporaryDirectory();

	await writePackage(temporary, {name: 'foo', version: '1.0.0'});
	await updatePackage(temporary, {version: '2.0.0', license: 'MIT'});

	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, {
		name: 'foo',
		version: '2.0.0',
		license: 'MIT',
	});
});

test('async - create package.json if one does not exist', async t => {
	const temporary = temporaryDirectory();

	await updatePackage(temporary, {name: 'foo', version: '1.0.0'});
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, {
		name: 'foo',
		version: '1.0.0',
	});
});

test('async - merge dependencies', async t => {
	const temporary = temporaryDirectory();

	await updatePackage(temporary, {
		name: 'foo',
		dependencies: {
			foo: '1.0.0',
			bar: '1.0.0',
		},
	});

	await updatePackage(temporary, {
		dependencies: {
			foo: '2.0.0',
			baz: '1.0.0',
		},
		devDependencies: {
			foobar: '1.0.0',
		},
	});

	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, {
		name: 'foo',
		dependencies: {
			foo: '2.0.0',
			bar: '1.0.0',
			baz: '1.0.0',
		},
		devDependencies: {
			foobar: '1.0.0',
		},
	});
});

test('async - removes empty dependency properties by default', async t => {
	const temporary = temporaryDirectory();

	await updatePackage(temporary, emptyPropFixture);
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('async - allow not removing empty dependency properties', async t => {
	const temporary = temporaryDirectory();

	await updatePackage(temporary, emptyPropFixture, {normalize: false});
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, emptyPropFixture);
});

test('async - detect tab indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	const temporaryDir = path.dirname(temporary);

	await writeJsonFile(temporary, {foo: true, bar: true}, {indent: '\t'});
	await updatePackage(temporary, {foo: false, foobar: true});

	const packageJson = await readPackage({cwd: temporaryDir, normalize: false});
	t.deepEqual(packageJson, {foo: false, bar: true, foobar: true});
});

test('async - detect 2 spaces indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	const temporaryDir = path.dirname(temporary);

	await writeJsonFile(temporary, {foo: true, bar: true}, {indent: 2});
	await updatePackage(temporary, {foo: false, foobar: true});

	const packageJson = await readPackage({cwd: temporaryDir, normalize: false});
	t.deepEqual(packageJson, {foo: false, bar: true, foobar: true});
});

test('sync', t => {
	const temporary = temporaryDirectory();

	writePackageSync(temporary, {name: 'foo', version: '1.0.0'});
	updatePackageSync(temporary, {version: '2.0.0', license: 'MIT'});

	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, {
		name: 'foo',
		version: '2.0.0',
		license: 'MIT',
	});
});

test('sync - create package.json if one does not exist', t => {
	const temporary = temporaryDirectory();

	updatePackageSync(temporary, {name: 'foo', version: '1.0.0'});
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, {
		name: 'foo',
		version: '1.0.0',
	});
});

test('sync - merge dependencies', t => {
	const temporary = temporaryDirectory();

	updatePackageSync(temporary, {
		name: 'foo',
		dependencies: {
			foo: '1.0.0',
			bar: '1.0.0',
		},
	});

	updatePackageSync(temporary, {
		dependencies: {
			foo: '2.0.0',
			baz: '1.0.0',
		},
		devDependencies: {
			foobar: '1.0.0',
		},
	});

	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, {
		name: 'foo',
		dependencies: {
			foo: '2.0.0',
			bar: '1.0.0',
			baz: '1.0.0',
		},
		devDependencies: {
			foobar: '1.0.0',
		},
	});
});

test('sync - removes empty dependency properties by default', t => {
	const temporary = temporaryDirectory();

	updatePackageSync(temporary, emptyPropFixture);
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('sync - allow not removing empty dependency properties', t => {
	const temporary = temporaryDirectory();

	updatePackageSync(temporary, emptyPropFixture, {normalize: false});
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, emptyPropFixture);
});

test('sync - detect tab indent', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	const temporaryDir = path.dirname(temporary);

	writeJsonFileSync(temporary, {foo: true, bar: true}, {indent: '\t'});
	updatePackageSync(temporary, {foo: false, foobar: true});

	const packageJson = readPackageSync({cwd: temporaryDir, normalize: false});
	t.deepEqual(packageJson, {foo: false, bar: true, foobar: true});
});

test('sync - detect 2 spaces indent', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	const temporaryDir = path.dirname(temporary);

	writeJsonFileSync(temporary, {foo: true, bar: true}, {indent: 2});
	updatePackageSync(temporary, {foo: false, foobar: true});

	const packageJson = readPackageSync({cwd: temporaryDir, normalize: false});
	t.deepEqual(packageJson, {foo: false, bar: true, foobar: true});
});
