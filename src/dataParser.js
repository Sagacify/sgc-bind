define([
	'./utils'
	], function (utils) {
	'use strict';


	return {
		parseData: function(rawData){

			var res = [];
			if (utils.startsWith(rawData, '[')) {
				var allData = rawData.split('],[');
				allData[0] = _.first(allData).slice(1);
				allData[allData.length - 1] = _.last(allData).slice(0, -1);
				var self = this;
				allData.forEach(function (bind) {
					res.push(bind);
				});
			} else {
				res.push(rawData);
			}

			res = res.map(function(data){
				return data.trim();
			});

			return res;

		},

	}
});