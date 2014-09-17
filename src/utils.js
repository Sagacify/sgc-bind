define([], function (
) {
	'use strict';

	var utils = {};

	// utils.asGetter = function(string){
	// 	return 'get'+utils.capitalize(string);
	// };

	// utils.asSetter = function(string){
	// 	return 'set'+utils.capitalize(string);
	// };

	// utils.capitalize = function(string) {
	// 	var capitalized = '';
	// 	var split = string.split('.');
	// 	split.forEach(function(part){
	// 		capitalized += part.charAt(0).toUpperCase()+part.slice(1);
	// 	});
	//     return capitalized;
	// };

	// utils.contains = function(string, str){
	// 	return ~string.indexOf(str);
	// };

	utils.startsWith = function(string, str){
		return string.slice(0, str.length) === str;
	};

	utils.endsWith = function(string, str){
		return string.slice(string.length - str.length, string.length) === str;
	};
	return utils;
});
