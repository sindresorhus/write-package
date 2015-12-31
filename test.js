'use strict';
var test = require('ava');
var tempfile = require('tempfile');
var readPkg = require('read-pkg');
var fn = require('./');
var fixture = {foo: true};

test('async', function (t) {
	var tmp = tempfile();
	return fn(tmp, fixture).then(function () {
		var x = readPkg.sync(tmp);
		t.true(x.foo);
	});
});

test('sync', function (t) {
	var tmp = tempfile();
	fn.sync(tmp, fixture);
	var x = readPkg.sync(tmp);
	t.true(x.foo);
});
