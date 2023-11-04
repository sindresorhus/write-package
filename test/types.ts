import type {Macro, ExecutionContext} from 'ava';
import type {PackageJson} from 'type-fest';
import type * as writePackage from '../index.js';

export type NoPathMacro = Macro<[{
	fixture?: PackageJson;
	assertions: (_: {
		t: ExecutionContext;
		testedModule: typeof writePackage;
		getPackageJson: () => Promise<PackageJson>;
	}) => Promise<void>;
}]>;
