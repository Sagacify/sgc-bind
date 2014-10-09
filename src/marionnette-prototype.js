define([
	'./dataParser'
], function (
	dataParser
	) {
	'use strict';
	var Marionette = require('backbone').Marionette;

	var defaultBindUIElements = Marionette.View.prototype.bindUIElements;
	Marionette.View.prototype.bindUIElements = function(){
		this.__createAllBinders();
		this.bindOutlets();
		this.__bindActions();
		this.__createAllBinders();
		return defaultBindUIElements.apply(this, arguments);
	};

	var defaultUnbindUIElements = Marionette.View.prototype.unbindUIElements;
	Marionette.View.prototype.unbindUIElements = function(){
		this.__destroyAllBinder();
		this.__unbindActions();
		this.__clearOutlets();
		return defaultUnbindUIElements.apply(this, arguments);
	};

	Marionette.View.prototype._retrieveWithDataType = function (dataType) {	
		var items = this.$('[sg-'+ dataType+']');

		if (this.$el.attr('sg-'+dataType)) {
			items = $(items.get().concat(this.$el.get()));	
		};

		var binds = items;

		var res = [];
		
		binds.each(function(node){
			var allData = dataParser.parseData($(this).attr('sg-'+dataType));

			for (var i = allData.length - 1; i >= 0; i--) {
				res.push({
					node:this,
					data:allData[i]
				});
			};
		});

		

		
		return res;
	};

	// var defaultAttachElContent = Marionette.ItemView.prototype.attachElContent;
	// Marionette.ItemView.prototype.attachElContent= function(html){

	// 	defaultAttachElContent.apply(this, arguments):

	// 	var res = this.$el.getAllTexts();

	// 	res = _.filter(res, function(textItem){
	// 		return _.str.contains($(textItem).text(), '{{');
	// 	});

	// 	// if (res.length) {
	// 	// 	this.__i18TextNodes = [];
	// 	// 	for (var i = res.length - 1; i >= 0; i--) {
	// 	// 		this.__i18TextNodes = this.__i18TextNodes.concat($(res[i]).translatableText());
	// 	// 	}
	// 	// }
		
	// 	// this.setElement(this.$el.children());
	// 	// return this;
	// }


});