import type {PackageJson, JsonObject} from 'type-fest';

export type Options = {
	/**
	The indentation to use for new files.

	Accepts `'\t'` for tab indentation or a number of spaces.

	If the file already exists, the existing indentation will be used.

	Default: Auto-detected or `'\t'`
	*/
	readonly indent?: string | number;

	/**
	Remove empty `dependencies`, `devDependencies`, `optionalDependencies` and `peerDependencies` objects.

	@default true
	*/
	readonly normalize?: boolean;
};

/** A JSON object with suggested fields for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file). */
type PackageJsonData = PackageJson | JsonObject; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents

/**
Write a `package.json` file.

Writes atomically and creates directories for you as needed. Sorts dependencies when writing. Preserves the indentation if the file already exists.

@param path - The path to where the `package.json` file should be written or its directory.

@example
```
import path from 'node:path';
import {writePackage} from 'write-pkg';

await writePackage({foo: true});
console.log('done');

await writePackage(path.join('unicorn', 'package.json'), {foo: true});
console.log('done');
```
*/
export function writePackage(path: string, data: PackageJsonData, options?: Options): Promise<void>;
export function writePackage(data: PackageJsonData, options?: Options): Promise<void>;

/**
Synchronously write a `package.json` file.

Writes atomically and creates directories for you as needed. Sorts dependencies when writing. Preserves the indentation if the file already exists.

@param path - The path to where the `package.json` file should be written or its directory.

@example
```
import path from 'node:path';
import {writePackageSync} from 'write-pkg';

writePackageSync({foo: true});
console.log('done');

writePackageSync(path.join('unicorn', 'package.json'), {foo: true});
console.log('done');
```
*/
export function writePackageSync(path: string, data: PackageJsonData, options?: Options): void;
export function writePackageSync(data: PackageJsonData, options?: Options): void;

/**
Update a `package.json` file.

Writes atomically and creates directories for you as needed. Sorts dependencies when writing. Preserves the indentation if the file already exists.

@param path - The path to where the `package.json` file should be written or its directory.

@example
```
import path from 'node:path';
import {updatePackage} from 'write-pkg';

await updatePackage({foo: true});
//=> { "foo": true }

await updatePackage({foo: false, bar: true});
//=> { "foo": false, "bar": true }
```
*/
export function updatePackage(path: string, data: PackageJsonData, options?: Options): Promise<void>;
export function updatePackage(data: PackageJsonData, options?: Options): Promise<void>;

/**
Update a `package.json` file.

Writes atomically and creates directories for you as needed. Sorts dependencies when writing. Preserves the indentation if the file already exists.

@param path - The path to where the `package.json` file should be written or its directory.

@example
```
import path from 'node:path';
import {updatePackageSync} from 'write-pkg';

updatePackageSync({foo: true});
//=> { "foo": true }

updatePackageSync({foo: false, bar: true});
//=> { "foo": false, "bar": true }
```
*/
export function updatePackageSync(path: string, data: PackageJsonData, options?: Options): void;
export function updatePackageSync(data: PackageJsonData, options?: Options): void;

type DependencyKeys =
	| 'dependencies'
	| 'devDependencies'
	| 'optionalDependencies'
	| 'peerDependencies';

type Dependencies = Partial<Record<string, string>> | Pick<PackageJson, DependencyKeys>;

export function addPackageDependencies(path: string, dependencies: Dependencies, options?: Options): Promise<void>;
export function addPackageDependencies(dependencies: Dependencies, options?: Options): Promise<void>;

export function addPackageDependenciesSync(path: string, dependencies: Dependencies, options?: Options): void;
export function addPackageDependenciesSync(dependencies: Dependencies, options?: Options): void;

type DependenciesToRemove = string[] | Partial<Record<DependencyKeys, string[]>>;

export function removePackageDependencies(path: string, dependencies: DependenciesToRemove, options?: Options): Promise<void>;
export function removePackageDependencies(dependencies: DependenciesToRemove, options?: Options): Promise<void>;

export function removePackageDependenciesSync(path: string, dependencies: DependenciesToRemove, options?: Options): void;
export function removePackageDependenciesSync(dependencies: DependenciesToRemove, options?: Options): void;
