import {expectType} from 'tsd';
import writePackage = require('.');

const options: writePackage.Options = {};

expectType<Promise<void>>(writePackage('package.json', {version: 1}));
expectType<Promise<void>>(writePackage('package.json', {version: 1}, {normalize: false}));
expectType<Promise<void>>(writePackage({version: 1}));
expectType<Promise<void>>(writePackage({version: 1}, {normalize: false}));

expectType<void>(writePackage.sync('package.json', {version: 1}));
expectType<void>(writePackage.sync('package.json', {version: 1}, {normalize: false}));
expectType<void>(writePackage.sync({version: 1}));
expectType<void>(writePackage.sync({version: 1}, {normalize: false}));
