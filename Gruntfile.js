function GruntTasks (grunt) {
	'use strict';

	grunt.initConfig({
		jsonlint: {
			pkg: {
				src: 'package.json'
			},
			bower: {
				src: ['bower.json', '.bowerrc']
			},
			jshint: {
				src: ['.jshintrc']
			},
			jscsrc: {
				src: '.jscsrc'
			},
		},
		jshint: {
			client: {
				options: {
					jshintrc: '.jshintrc',
				},
				src: [
					'src/**/*.js',
					'test/**/*.js'
				]
			}
		},
		jscs: {
			client: {
				src: [
					'src/src/**/*.js',
					'test/**/*.js'
				],
				options: {
					config: '.jscsrc',
				}
			}
		},
		clean: {
			coverage: [
				'test/coverage'
			],
			preDist: [
				'src/public/dist'
			],
			dist: [
				'src/public/dist/bower_components',
				'src/public/dist/init.js',
				'src/public/dist/main.js',
				'src/public/dist/main.js',
				'src/public/dist/config',
				'src/public/dist/js'
			]
		},

		requirejs: {
			all: {
				options: {
					baseUrl: 'src/public/dist',
					name: 'main',
					mainConfigFile: 'src/public/dist/init.js',
					out: 'src/public/dist/main.min.js',
					optimize: 'uglify2',
					generateSourceMaps: false,
					preserveLicenseComments: false,
					inlineText: true,
					findNestedDependencies: true,
					paths: {
						requireLib: 'bower_components/requirejs/require'
					},
					include: [
						'requireLib'
					]
				}
			}
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					timeout: 2000
				},
				src: [
					'test/test.js'
				]
			}
		},
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('verify', [
		'jsonlint',
		'jshint',
		'jscs'
	]);

	grunt.registerTask('test', [
		'mochaTest',
	]);

	grunt.registerTask('build', [
		'verify',
		'clean:preDist',
		'copy',
		'requirejs',
		'clean:dist',
	]);

	grunt.registerTask('ci', [
		'build',
		'test'
	]);
}

module.exports = GruntTasks;