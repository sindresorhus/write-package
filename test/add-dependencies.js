import path from 'node:path';
import fs, {promises as fsPromises} from 'node:fs';
import test from 'ava';
import {pick} from 'filter-anything';
import {temporaryDirectory} from 'tempy';
import {readPackage, readPackageSync} from 'read-pkg';
import {
	writePackage,
	writePackageSync,
	addPackageDependencies,
	addPackageDependenciesSync,
} from '../index.js';

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

const emptyPropertyFixture = {
	foo: true,
	dependencies: {},
	devDependencies: {},
	optionalDependencies: {},
	peerDependencies: {},
};

const addFixture = {
	dependencies: {
		baz: '1.0.0',
	},
	devDependencies: {
		baz: '1.0.0',
	},
	optionalDependencies: {
		baz: '1.0.0',
	},
	peerDependencies: {
		baz: '1.0.0',
	},
};

test('async', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, fixture);
	await addPackageDependencies(temporary, addFixture.dependencies);
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.true(packageJson.foo);

	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
});

test('async - multiple types', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, fixture);
	await addPackageDependencies(temporary, addFixture);
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'baz', 'foo']);
});

test('async - two types', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, fixture);
	await addPackageDependencies(temporary, pick(addFixture, ['dependencies', 'devDependencies']));
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
});

test('async - two types with empty', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, pick(fixture, ['foo', 'scripts', 'dependencies', 'devDependencies']));
	await addPackageDependencies(temporary, pick(addFixture, ['dependencies', 'devDependencies']));
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('async - overwrite dependency', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, fixture);
	await addPackageDependencies(temporary, {bar: '2.0.0'});
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'foo']);
	t.is(packageJson.dependencies.bar, '2.0.0');
});

test('async - allow not removing empty dependency properties', async t => {
	const temporary = temporaryDirectory();
	await writePackage(temporary, emptyPropertyFixture, {normalize: false});
	await addPackageDependencies(temporary, pick(addFixture, ['dependencies', 'devDependencies']), {normalize: false});
	const packageJson = await readPackage({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.dependencies), ['baz']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['baz']);
	t.truthy(packageJson.optionalDependencies);
	t.truthy(packageJson.peerDependencies);
});

test('async - create package.json if one does not exist', async t => {
	const temporary = temporaryDirectory();
	await addPackageDependencies(temporary, addFixture);
	const {
		dependencies,
		devDependencies,
		optionalDependencies,
		peerDependencies,
		...rest
	} = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(Object.keys(dependencies), ['baz']);
	t.deepEqual(Object.keys(devDependencies), ['baz']);
	t.deepEqual(Object.keys(optionalDependencies), ['baz']);
	t.deepEqual(Object.keys(peerDependencies), ['baz']);
	t.true(Object.keys(rest).length === 0, 'package.json had additional fields!');
});

test('sync', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, fixture);
	addPackageDependenciesSync(temporary, addFixture.dependencies);
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.true(packageJson.foo);

	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
});

test('sync - multiple types', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, fixture);
	addPackageDependenciesSync(temporary, addFixture);
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'baz', 'foo']);
});

test('sync - two types', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, fixture);
	addPackageDependenciesSync(temporary, pick(addFixture, ['dependencies', 'devDependencies']));
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
	t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
});

test('sync - two types with empty', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, pick(fixture, ['foo', 'scripts', 'dependencies', 'devDependencies']));
	addPackageDependenciesSync(temporary, pick(addFixture, ['dependencies', 'devDependencies']));
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
	t.falsy(packageJson.optionalDependencies);
	t.falsy(packageJson.peerDependencies);
});

test('sync - overwrite dependency', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, fixture);
	addPackageDependenciesSync(temporary, {bar: '2.0.0'});
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'foo']);
	t.is(packageJson.dependencies.bar, '2.0.0');
});

test('sync - allow not removing empty dependency properties', t => {
	const temporary = temporaryDirectory();
	writePackageSync(temporary, emptyPropertyFixture, {normalize: false});
	addPackageDependenciesSync(temporary, pick(addFixture, ['dependencies', 'devDependencies']), {normalize: false});
	const packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.true(packageJson.foo);
	t.deepEqual(Object.keys(packageJson.dependencies), ['baz']);
	t.deepEqual(Object.keys(packageJson.devDependencies), ['baz']);
	t.truthy(packageJson.optionalDependencies);
	t.truthy(packageJson.peerDependencies);
});

test('sync - create package.json if one does not exist', t => {
	const temporary = temporaryDirectory();
	addPackageDependenciesSync(temporary, addFixture);
	const {
		dependencies,
		devDependencies,
		optionalDependencies,
		peerDependencies,
		...rest
	} = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(Object.keys(dependencies), ['baz']);
	t.deepEqual(Object.keys(devDependencies), ['baz']);
	t.deepEqual(Object.keys(optionalDependencies), ['baz']);
	t.deepEqual(Object.keys(peerDependencies), ['baz']);
	t.true(Object.keys(rest).length === 0, 'package.json had additional fields!');
});

const missingEndingBraceFixture = '{"name": "foo", "dependencies": {"bar": "1.0.0"}';

test('async - invalid package.json', async t => {
	const temporary = temporaryDirectory();
	await fsPromises.writeFile(path.join(temporary, 'package.json'), missingEndingBraceFixture);

	await t.throwsAsync(
		addPackageDependencies(temporary, addFixture.dependencies),
		{name: 'JSONError'},
	);
});

test('sync - invalid package.json', t => {
	const temporary = temporaryDirectory();
	fs.writeFileSync(path.join(temporary, 'package.json'), missingEndingBraceFixture);

	t.throws(
		() => addPackageDependenciesSync(temporary, addFixture.dependencies),
		{name: 'JSONError'},
	);
});
