import type {JsonObject, PackageJson} from 'type-fest';

// TODO: make `data` be PackageJson | JsonObject

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
export function writePackage(path: string, data: JsonObject, options?: Options): Promise<void>;
export function writePackage(data: JsonObject, options?: Options): Promise<void>;

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
export function writePackageSync(path: string, data: JsonObject, options?: Options): void;
export function writePackageSync(data: JsonObject, options?: Options): void;

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
export function updatePackage(path: string, data: JsonObject, options?: Options): Promise<void>;
export function updatePackage(data: JsonObject, options?: Options): Promise<void>;

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
export function updatePackageSync(path: string, data: JsonObject, options?: Options): void;
export function updatePackageSync(data: JsonObject, options?: Options): void;

type DependencyKeys =
	| 'dependencies'
	| 'devDependencies'
	| 'optionalDependencies'
	| 'peerDependencies';

export function addPackageDependencies(path: string, dependencies: Partial<Record<string, string>> | Pick<PackageJson, DependencyKeys>, options?: Options): Promise<void>;
export function addPackageDependencies(dependencies: Partial<Record<string, string>> | Pick<PackageJson, DependencyKeys>, options?: Options): Promise<void>;

export function addPackageDependenciesSync(path: string, dependencies: Partial<Record<string, string>> | Pick<PackageJson, DependencyKeys>, options?: Options): void;
export function addPackageDependenciesSync(dependencies: Partial<Record<string, string>> | Pick<PackageJson, DependencyKeys>, options?: Options): void;
