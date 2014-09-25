define([], function (
) {
	'use strict';

	var utils = {};
	
	utils.startsWith = function(string, str){
		return string.slice(0, str.length) === str;
	};

	utils.endsWith = function(string, str){
		return string.slice(string.length - str.length, string.length) === str;
	};
	return utils;
});
