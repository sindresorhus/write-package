import path from 'node:path';
import fs, {promises as fsPromises} from 'node:fs';
import test from 'ava';
import {temporaryDirectory} from 'tempy';
import {readPackage, readPackageSync} from 'read-pkg';
import {
	writePackage,
	writePackageSync,
	updatePackage,
	updatePackageSync,
} from '../index.js';

const emptyPropertyFixture = {
	foo: true,
	dependencies: {},
	devDependencies: {},
	optionalDependencies: {},
	peerDependencies: {},
};

const missingEndingBraceFixture = '{"name": "foo", "dependencies": {"bar": "1.0.0"}';

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

	await updatePackage(temporary, emptyPropertyFixture);
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('async - allow not removing empty dependency properties', async t => {
	const temporary = temporaryDirectory();

	await updatePackage(temporary, emptyPropertyFixture, {normalize: false});
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, emptyPropertyFixture);
});

test('async - detect tab indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	await writePackage(temporary, {foo: true, bar: true}, {indent: '\t'});
	await updatePackage(temporary, {foo: false, foobar: true});

	t.is(
		await fsPromises.readFile(temporary, 'utf8'),
		'{\n\t"foo": false,\n\t"bar": true,\n\t"foobar": true\n}\n',
	);
});

test('async - detect 2 spaces indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	await writePackage(temporary, {foo: true, bar: true}, {indent: 2});
	await updatePackage(temporary, {foo: false, foobar: true});

	t.is(
		await fsPromises.readFile(temporary, 'utf8'),
		'{\n  "foo": false,\n  "bar": true,\n  "foobar": true\n}\n',
	);
});

test('async - invalid package.json should throw', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	await fsPromises.writeFile(temporary, missingEndingBraceFixture);

	await t.throwsAsync(
		updatePackage(temporary, {version: '1.0.0'}),
		{name: 'JSONError'},
	);
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

	updatePackageSync(temporary, emptyPropertyFixture);
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.falsy(packageJson.dependencies);
	t.falsy(packageJson.devDependencies);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('sync - allow not removing empty dependency properties', t => {
	const temporary = temporaryDirectory();

	updatePackageSync(temporary, emptyPropertyFixture, {normalize: false});
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, emptyPropertyFixture);
});

test('sync - detect tab indent', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	writePackageSync(temporary, {foo: true, bar: true}, {indent: '\t'});
	updatePackageSync(temporary, {foo: false, foobar: true});

	t.is(
		fs.readFileSync(temporary, 'utf8'),
		'{\n\t"foo": false,\n\t"bar": true,\n\t"foobar": true\n}\n',
	);
});

test('sync - detect 2 spaces indent', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	writePackageSync(temporary, {foo: true, bar: true}, {indent: 2});
	updatePackageSync(temporary, {foo: false, foobar: true});

	t.is(
		fs.readFileSync(temporary, 'utf8'),
		'{\n  "foo": false,\n  "bar": true,\n  "foobar": true\n}\n',
	);
});

test('sync - invalid package.json should throw', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	fs.writeFileSync(temporary, missingEndingBraceFixture);

	t.throws(
		() => updatePackageSync(temporary, {version: '1.0.0'}),
		{name: 'JSONError'},
	);
});
