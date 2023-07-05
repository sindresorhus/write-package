import {expectType} from 'tsd';
import {writePackage, writePackageSync, updatePackage, updatePackageSync} from './index.js';

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

expectType<Promise<void>>(updatePackage('package.json', {version: 1}));
expectType<Promise<void>>(updatePackage('package.json', {version: 1}, {normalize: false}));
expectType<Promise<void>>(updatePackage('package.json', {version: 1}, {indent: 2}));
expectType<Promise<void>>(updatePackage({version: 1}));
expectType<Promise<void>>(updatePackage({version: 1}, {normalize: false}));
expectType<Promise<void>>(updatePackage({version: 1}, {indent: 2}));

expectType<void>(updatePackageSync('package.json', {version: 1}));
expectType<void>(updatePackageSync('package.json', {version: 1}, {normalize: false}));
expectType<void>(updatePackageSync('package.json', {version: 1}, {indent: 2}));
expectType<void>(updatePackageSync({version: 1}));
expectType<void>(updatePackageSync({version: 1}, {normalize: false}));
expectType<void>(updatePackageSync({version: 1}, {indent: 2}));
