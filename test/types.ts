import type {Macro, ExecutionContext} from 'ava';
import type {PackageJson} from 'type-fest';
import type * as writePkg from '../index.js';

export type NoPathMacro = Macro<[{
	fixture?: PackageJson;
	assertions: (_: {
		t: ExecutionContext;
		testedModule: typeof writePkg;
		getPackageJson: () => Promise<PackageJson>;
	}) => Promise<void>;
}]>;
