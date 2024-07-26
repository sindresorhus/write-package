import test from 'ava';
import esmock from 'esmock';
import {temporaryDirectory} from 'tempy';
import {readPackage} from 'read-pkg';
import {writePackage} from '../index.js';

/** @type {import('./types').NoPathMacro} */
const verifyPackage = test.macro(async (t, {fixture, assertions}) => {
	const temporaryDirectory_ = temporaryDirectory();

	if (fixture) {
		await writePackage(temporaryDirectory_, fixture);
	}

	const testedModule = await esmock('../index.js', {}, {
		'node:path': {join: () => `${temporaryDirectory_}/package.json`},
	});

	const getPackageJson = async () => readPackage({cwd: temporaryDirectory_, normalize: false});
	await assertions({t, testedModule, getPackageJson});
});

const writeFixture = {
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

test('async - writePackage', verifyPackage, {
	async assertions({t, testedModule: {writePackage}, getPackageJson}) {
		await writePackage(writeFixture);
		const packageJson = await getPackageJson();

		t.true(packageJson.foo);
		t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
		t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'foo']);
		t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'foo']);
		t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
		t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
	},
});

test('async - updatePackage', verifyPackage, {
	fixture: {name: 'foo', version: '1.0.0'},
	async assertions({t, testedModule: {updatePackage}, getPackageJson}) {
		await updatePackage({version: '2.0.0', license: 'MIT'});
		const packageJson = await getPackageJson();

		t.deepEqual(packageJson, {
			name: 'foo',
			version: '2.0.0',
			license: 'MIT',
		});
	},
});

test('async - addPackageDependencies', verifyPackage, {
	fixture: writeFixture,
	async assertions({t, testedModule: {addPackageDependencies}, getPackageJson}) {
		await addPackageDependencies(addFixture);
		const packageJson = await getPackageJson();

		t.true(packageJson.foo);
		t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
		t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
		t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
		t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'baz', 'foo']);
		t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'baz', 'foo']);
	},
});

test('async - removePackageDependencies', verifyPackage, {
	fixture: writeFixture,
	async assertions({t, testedModule: {removePackageDependencies}, getPackageJson}) {
		await removePackageDependencies({
			dependencies: ['foo'],
			devDependencies: ['bar'],
			optionalDependencies: ['foo'],
			peerDependencies: ['bar'],
		});
		const packageJson = await getPackageJson();

		t.true(packageJson.foo);
		t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
		t.deepEqual(Object.keys(packageJson.dependencies), ['bar']);
		t.deepEqual(Object.keys(packageJson.devDependencies), ['foo']);
		t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar']);
		t.deepEqual(Object.keys(packageJson.peerDependencies), ['foo']);
	},
});

test('sync - writePackage', verifyPackage, {
	async assertions({t, testedModule: {writePackageSync}, getPackageJson}) {
		writePackageSync(writeFixture);
		const packageJson = await getPackageJson();

		t.true(packageJson.foo);
		t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
		t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'foo']);
		t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'foo']);
		t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'foo']);
		t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'foo']);
	},
});

test('sync - updatePackage', verifyPackage, {
	fixture: {name: 'foo', version: '1.0.0'},
	async assertions({t, testedModule: {updatePackageSync}, getPackageJson}) {
		updatePackageSync({version: '2.0.0', license: 'MIT'});
		const packageJson = await getPackageJson();

		t.deepEqual(packageJson, {
			name: 'foo',
			version: '2.0.0',
			license: 'MIT',
		});
	},
});

test('sync - addPackageDependencies', verifyPackage, {
	fixture: writeFixture,
	async assertions({t, testedModule: {addPackageDependenciesSync}, getPackageJson}) {
		addPackageDependenciesSync(addFixture);
		const packageJson = await getPackageJson();

		t.true(packageJson.foo);
		t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
		t.deepEqual(Object.keys(packageJson.dependencies), ['bar', 'baz', 'foo']);
		t.deepEqual(Object.keys(packageJson.devDependencies), ['bar', 'baz', 'foo']);
		t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar', 'baz', 'foo']);
		t.deepEqual(Object.keys(packageJson.peerDependencies), ['bar', 'baz', 'foo']);
	},
});

test('sync - removePackageDependencies', verifyPackage, {
	fixture: writeFixture,
	async assertions({t, testedModule: {removePackageDependenciesSync}, getPackageJson}) {
		removePackageDependenciesSync({
			dependencies: ['foo'],
			devDependencies: ['bar'],
			optionalDependencies: ['foo'],
			peerDependencies: ['bar'],
		});
		const packageJson = await getPackageJson();

		t.true(packageJson.foo);
		t.deepEqual(Object.keys(packageJson.scripts), ['b', 'a']);
		t.deepEqual(Object.keys(packageJson.dependencies), ['bar']);
		t.deepEqual(Object.keys(packageJson.devDependencies), ['foo']);
		t.deepEqual(Object.keys(packageJson.optionalDependencies), ['bar']);
		t.deepEqual(Object.keys(packageJson.peerDependencies), ['foo']);
	},
});
