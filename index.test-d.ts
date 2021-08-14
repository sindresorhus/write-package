import {expectType} from 'tsd';
import {writePackage, writePackageSync} from './index.js';

expectType<Promise<void>>(writePackage('package.json', {version: 1}));
expectType<Promise<void>>(writePackage('package.json', {version: 1}, {normalize: false}));
expectType<Promise<void>>(writePackage({version: 1}));
expectType<Promise<void>>(writePackage({version: 1}, {normalize: false}));

expectType<void>(writePackageSync('package.json', {version: 1}));
expectType<void>(writePackageSync('package.json', {version: 1}, {normalize: false}));
expectType<void>(writePackageSync({version: 1}));
expectType<void>(writePackageSync({version: 1}, {normalize: false}));
