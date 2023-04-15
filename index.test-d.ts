import {expectType} from 'tsd';
import {writePackage, writePackageSync, addPackageDependencies, addPackageDependenciesSync} from './index.js';

expectType<Promise<void>>(writePackage('package.json', {version: 1}));
expectType<Promise<void>>(writePackage('package.json', {version: 1}, {normalize: false}));
expectType<Promise<void>>(writePackage('package.json', {version: 1}, {indent: 2}));
expectType<Promise<void>>(writePackage({version: 1}));
expectType<Promise<void>>(writePackage({version: 1}, {normalize: false}));
expectType<Promise<void>>(writePackage({version: 1}, {indent: 2}));

expectType<void>(writePackageSync('package.json', {version: 1}));
expectType<void>(writePackageSync('package.json', {version: 1}, {normalize: false}));
expectType<void>(writePackageSync('package.json', {version: 1}, {indent: 2}));
expectType<void>(writePackageSync({version: 1}));
expectType<void>(writePackageSync({version: 1}, {normalize: false}));
expectType<void>(writePackageSync({version: 1}, {indent: 2}));

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
