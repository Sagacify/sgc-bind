define([
	'../test/action_test',
	'../test/outlet_test',
	'../test/bind_test',
	
	'chai',
	'sinon',
	'mocha',
	'text'
], function (
	action_test,
	outlet_test,
	bind_test
	) {
	'use strict';

	var mocha = window.mocha;

	mocha.setup('bdd');
	
	action_test();
	outlet_test();
	bind_test();

	if (window.mochaPhantomJS) {
		window.mochaPhantomJS.run();
	}
	else {
		mocha.run();
	}
});
