function GruntTasks (grunt) {
	'use strict';

	grunt.initConfig({
		jsonlint: {
			pkg: {
				src: 'package.json'
			},
			bower: {
				src: 'bower.json'
			},
			jshint: {
				src: '.jshintrc'
			},
			jscsrc: {
				src: '.jscsrc'
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			src: [
				'src/**/*.js',
				'test/**/*.js'
			]
		},
		jscs: {
			src: [
				'src/**/*.js',
				'test/**/*.js'
			]
		},

		clean: {
			dist: [
				'dist'
			]
		},

		requirejs: {
			min: {
				options: {
					baseUrl: 'src',
					name: 'sgc-bind',
					out: 'dist/sgc-bind.min.js',
					optimize: 'uglify2',
					generateSourceMaps: false,
					preserveLicenseComments: false,
					inlineText: true,
					findNestedDependencies: true
				}
			},
			concat: {
				options: {
					baseUrl: 'src',
					name: 'sgc-bind',
					out: 'dist/sgc-bind.js',
					optimize: 'none',
					generateSourceMaps: false,
					preserveLicenseComments: false,
					inlineText: true,
					findNestedDependencies: true
				}
			},

		},

		mocha_phantomjs: {
			test: [
				'test/index.html'
			]
		}

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('verify', [
		'jsonlint',
		'jshint',
		'jscs'
	]);

	grunt.registerTask('test', [
		'mocha_phantomjs',
	]);

	grunt.registerTask('build', [
		'verify',
		'clean:dist',
		'requirejs'
	]);

	grunt.registerTask('ci', [
		'build',
		'test'
	]);
}

module.exports = GruntTasks;