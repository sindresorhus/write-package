import {expectType} from 'tsd';
import {
	writePackage,
	writePackageSync,
	updatePackage,
	updatePackageSync,
	addPackageDependencies,
	addPackageDependenciesSync,
	removePackageDependencies,
	removePackageDependenciesSync,
} from './index.js';

expectType<Promise<void>>(writePackage('package.json', {version: 1}));
expectType<Promise<void>>(writePackage('package.json', {version: '1.0.0'}));
expectType<Promise<void>>(writePackage('package.json', {version: 1}));
expectType<Promise<void>>(writePackage('package.json', {version: 1}, {normalize: false}));
expectType<Promise<void>>(writePackage('package.json', {version: 1}, {indent: 2}));
expectType<Promise<void>>(writePackage({version: 1}));
expectType<Promise<void>>(writePackage({version: 1}, {normalize: false}));
expectType<Promise<void>>(writePackage({version: 1}, {indent: 2}));

expectType<void>(writePackageSync('package.json', {version: 1}));
expectType<void>(writePackageSync('package.json', {version: '1.0.0'}));
expectType<void>(writePackageSync('package.json', {version: 1}, {normalize: false}));
expectType<void>(writePackageSync('package.json', {version: 1}, {indent: 2}));
expectType<void>(writePackageSync({version: 1}));
expectType<void>(writePackageSync({version: 1}, {normalize: false}));
expectType<void>(writePackageSync({version: 1}, {indent: 2}));

expectType<Promise<void>>(updatePackage('package.json', {version: 1}));
expectType<Promise<void>>(updatePackage('package.json', {version: '1.0.0'}));
expectType<Promise<void>>(updatePackage('package.json', {version: 1}, {normalize: false}));
expectType<Promise<void>>(updatePackage('package.json', {version: 1}, {indent: 2}));
expectType<Promise<void>>(updatePackage({version: 1}));
expectType<Promise<void>>(updatePackage({version: 1}, {normalize: false}));
expectType<Promise<void>>(updatePackage({version: 1}, {indent: 2}));

expectType<void>(updatePackageSync('package.json', {version: 1}));
expectType<void>(updatePackageSync('package.json', {version: '1.0.0'}));
expectType<void>(updatePackageSync('package.json', {version: 1}, {normalize: false}));
expectType<void>(updatePackageSync('package.json', {version: 1}, {indent: 2}));
expectType<void>(updatePackageSync({version: 1}));
expectType<void>(updatePackageSync({version: 1}, {normalize: false}));
expectType<void>(updatePackageSync({version: 1}, {indent: 2}));

expectType<Promise<void>>(addPackageDependencies('package.json', {foo: '1.0.0'}));
expectType<Promise<void>>(addPackageDependencies('package.json', {dependencies: {foo: '1.0.0'}, devDependencies: {bar: '1.0.0'}}));
expectType<Promise<void>>(addPackageDependencies('package.json', {foo: '1.0.0'}, {normalize: false}));
expectType<Promise<void>>(addPackageDependencies('package.json', {foo: '1.0.0'}, {indent: 2}));
expectType<Promise<void>>(addPackageDependencies({foo: '1.0.0'}));
expectType<Promise<void>>(addPackageDependencies({dependencies: {foo: '1.0.0'}, devDependencies: {bar: '1.0.0'}}));
expectType<Promise<void>>(addPackageDependencies({foo: '1.0.0'}, {normalize: false}));
expectType<Promise<void>>(addPackageDependencies({foo: '1.0.0'}, {indent: 2}));

expectType<void>(addPackageDependenciesSync('package.json', {foo: '1.0.0'}));
expectType<void>(addPackageDependenciesSync('package.json', {dependencies: {foo: '1.0.0'}, devDependencies: {bar: '1.0.0'}}));
expectType<void>(addPackageDependenciesSync('package.json', {foo: '1.0.0'}, {normalize: false}));
expectType<void>(addPackageDependenciesSync('package.json', {foo: '1.0.0'}, {indent: 2}));
expectType<void>(addPackageDependenciesSync({foo: '1.0.0'}));
expectType<void>(addPackageDependenciesSync({dependencies: {foo: '1.0.0'}, devDependencies: {bar: '1.0.0'}}));
expectType<void>(addPackageDependenciesSync({foo: '1.0.0'}, {normalize: false}));
expectType<void>(addPackageDependenciesSync({foo: '1.0.0'}, {indent: 2}));

expectType<Promise<void>>(removePackageDependencies('package.json', ['foo']));
expectType<Promise<void>>(removePackageDependencies('package.json', {dependencies: ['foo'], devDependencies: ['bar']}));
expectType<Promise<void>>(removePackageDependencies('package.json', ['foo'], {normalize: false}));
expectType<Promise<void>>(removePackageDependencies('package.json', ['foo'], {indent: 2}));
expectType<Promise<void>>(removePackageDependencies(['foo']));
expectType<Promise<void>>(removePackageDependencies({dependencies: ['foo'], devDependencies: ['bar']}));
expectType<Promise<void>>(removePackageDependencies(['foo'], {normalize: false}));
expectType<Promise<void>>(removePackageDependencies(['foo'], {indent: 2}));

expectType<void>(removePackageDependenciesSync('package.json', ['foo']));
expectType<void>(removePackageDependenciesSync('package.json', {dependencies: ['foo'], devDependencies: ['bar']}));
expectType<void>(removePackageDependenciesSync('package.json', ['foo'], {normalize: false}));
expectType<void>(removePackageDependenciesSync('package.json', ['foo'], {indent: 2}));
expectType<void>(removePackageDependenciesSync(['foo']));
expectType<void>(removePackageDependenciesSync({dependencies: ['foo'], devDependencies: ['bar']}));
expectType<void>(removePackageDependenciesSync(['foo'], {normalize: false}));
expectType<void>(removePackageDependenciesSync(['foo'], {indent: 2}));
