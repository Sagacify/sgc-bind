require.config({
	deps: ['sgc-bind', 'test'],
	shim: {
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['underscore', 'jquery', 'underscore']
		},

		marionette: {
			exports: 'marionette',
			deps: ['backbone']
		},

		'sinonIE': {
			deps: ['sinon']
		}, 

		'sgc-bind': {
			deps: ['marionette']
		}
	},
	paths: {
		jquery: '../bower_components/jquery/dist/jquery.min',
		backbone: '../bower_components/backbone/backbone',
		underscore: '../bower_components/underscore/underscore',
		marionette: '../bower_components/marionette/lib/backbone.marionette',

		mocha: '../node_modules/mocha/mocha',
		chai: '../node_modules/chai/chai',

		sinon: '../node_modules/sinon/pkg/sinon',
		sinonIE: '../node_modules/sinon/pkg/sinon-ie',

		text: '../bower_components/requirejs-text/text',

		//base url
		'sgc-bind': 'view',

		'test': '../test/test'
	},
	baseUrl: '../src'
});
