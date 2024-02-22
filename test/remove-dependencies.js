import path from 'node:path';
import fs, {promises as fsPromises} from 'node:fs';
import test from 'ava';
import {omit, pick} from 'filter-anything';
import {temporaryDirectory} from 'tempy';
import {readPackage, readPackageSync} from 'read-pkg';
import {removePackageDependencies, removePackageDependenciesSync, writePackage, writePackageSync} from '../index.js';

const emptyPropFixture = {
	foo: true,
	dependencies: {},
	devDependencies: {},
	optionalDependencies: {},
	peerDependencies: {},
};

const missingEndingBraceFixture = '{"name": "foo", "dependencies": {"bar": "1.0.0"}';

test('async', async t => {
	const temporary = temporaryDirectory();

	await writePackage(temporary, {name: 'foo', dependencies: {foo: '1.0.0'}});
	await removePackageDependencies(temporary, ['foo']);

	const packageJson = await readPackage({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, {name: 'foo'});
});

test('async - multiple types', async t => {
	const temporary = temporaryDirectory();

	const fixture = {
		name: 'foo',
		dependencies: {foo: '1.0.0'},
		devDependencies: {bar: '1.0.0', baz: '1.0.0'},
		peerDependencies: {foobar: '1.0.0'},
	};

	await writePackage(temporary, fixture);

	await removePackageDependencies(temporary, ['foo']);
	let packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, omit(fixture, ['dependencies']));

	await removePackageDependencies(temporary, {devDependencies: ['bar', 'baz'], peerDependencies: ['foobar']});
	packageJson = await readPackage({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, pick(fixture, ['name']));
});

test('async - should not throw if package.json does not exist', async t => {
	const temporary = temporaryDirectory();
	await t.notThrowsAsync(removePackageDependencies(temporary, ['foo']));
});

test('async - removing non-existent dependencies should not throw', async t => {
	const temporary = temporaryDirectory();
	const fixture = {name: 'foo', dependencies: {foo: '1.0.0'}};

	await writePackage(temporary, fixture);
	await removePackageDependencies(temporary, ['bar', 'baz', 'foobar']);

	const packageJson = await readPackage({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, fixture);
});

test('async - removes empty dependency properties by default', async t => {
	const temporary = temporaryDirectory();

	await writePackage(temporary, emptyPropFixture, {normalize: false});
	await removePackageDependencies(temporary, []);

	const packageJson = await readPackage({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, {foo: true});
});

test('async - allow not removing empty dependency properties', async t => {
	const temporary = temporaryDirectory();

	await writePackage(temporary, emptyPropFixture, {normalize: false});
	await removePackageDependencies(temporary, [], {normalize: false});

	const packageJson = await readPackage({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, emptyPropFixture);
});

test('async - detect tab indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	await writePackage(temporary, {name: 'foo', dependencies: {foo: '1.0.0'}}, {indent: '\t'});
	await removePackageDependencies(temporary, ['foo']);

	t.is(
		await fsPromises.readFile(temporary, 'utf8'),
		'{\n\t"name": "foo"\n}\n',
	);
});

test('async - detect 2 spaces indent', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	await writePackage(temporary, {name: 'foo', dependencies: {foo: '1.0.0'}}, {indent: 2});
	await removePackageDependencies(temporary, ['foo']);

	t.is(
		await fsPromises.readFile(temporary, 'utf8'),
		'{\n  "name": "foo"\n}\n',
	);
});

test('async - invalid package.json should throw', async t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	await fsPromises.writeFile(temporary, missingEndingBraceFixture);

	await t.throwsAsync(
		removePackageDependencies(temporary, ['bar']),
		{name: 'JSONError'},
	);
});

test('sync', t => {
	const temporary = temporaryDirectory();

	writePackageSync(temporary, {name: 'foo', dependencies: {foo: '1.0.0'}});
	removePackageDependenciesSync(temporary, ['foo']);

	const packageJson = readPackageSync({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, {name: 'foo'});
});

test('sync - multiple types', t => {
	const temporary = temporaryDirectory();

	const fixture = {
		name: 'foo',
		dependencies: {foo: '1.0.0'},
		devDependencies: {bar: '1.0.0', baz: '1.0.0'},
		peerDependencies: {foobar: '1.0.0'},
	};

	writePackageSync(temporary, fixture);

	removePackageDependenciesSync(temporary, ['foo']);
	let packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, omit(fixture, ['dependencies']));

	removePackageDependenciesSync(temporary, {devDependencies: ['bar', 'baz'], peerDependencies: ['foobar']});
	packageJson = readPackageSync({cwd: temporary, normalize: false});

	t.deepEqual(packageJson, pick(fixture, ['name']));
});

test('sync - should not throw if package.json does not exist', t => {
	const temporary = temporaryDirectory();
	t.notThrows(() => removePackageDependenciesSync(temporary, ['foo']));
});

test('sync - removing non-existent dependencies should not throw', t => {
	const temporary = temporaryDirectory();
	const fixture = {name: 'foo', dependencies: {foo: '1.0.0'}};

	writePackageSync(temporary, fixture);
	removePackageDependenciesSync(temporary, ['bar', 'baz', 'foobar']);

	const packageJson = readPackageSync({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, fixture);
});

test('sync - removes empty dependency properties by default', t => {
	const temporary = temporaryDirectory();

	writePackageSync(temporary, emptyPropFixture, {normalize: false});
	removePackageDependenciesSync(temporary, []);

	const packageJson = readPackageSync({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, {foo: true});
});

test('sync - allow not removing empty dependency properties', t => {
	const temporary = temporaryDirectory();

	writePackageSync(temporary, emptyPropFixture, {normalize: false});
	removePackageDependenciesSync(temporary, [], {normalize: false});

	const packageJson = readPackageSync({cwd: temporary, normalize: false});
	t.deepEqual(packageJson, emptyPropFixture);
});

test('sync - detect tab indent', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	writePackageSync(temporary, {name: 'foo', dependencies: {foo: '1.0.0'}}, {indent: '\t'});
	removePackageDependenciesSync(temporary, ['foo']);

	t.is(
		fs.readFileSync(temporary, 'utf8'),
		'{\n\t"name": "foo"\n}\n',
	);
});

test('sync - detect 2 spaces indent', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');

	writePackageSync(temporary, {name: 'foo', dependencies: {foo: '1.0.0'}}, {indent: 2});
	removePackageDependenciesSync(temporary, ['foo']);

	t.is(
		fs.readFileSync(temporary, 'utf8'),
		'{\n  "name": "foo"\n}\n',
	);
});

test('sync - invalid package.json should throw', t => {
	const temporary = path.join(temporaryDirectory(), 'package.json');
	fs.writeFileSync(temporary, missingEndingBraceFixture);

	t.throws(
		() => removePackageDependenciesSync(temporary, ['bar']),
		{name: 'JSONError'},
	);
});
