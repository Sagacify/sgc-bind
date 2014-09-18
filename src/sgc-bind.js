define([
	'./mixins/ModelBindMixin',
	'./mixins/ActionsBindMixin',
	'./mixins/OutletBindMixin'
], function (/*Marionette, */ModelBindMixin, ActionsBindMixin, OutletBindMixin) {
	'use strict';

	var Marionette = require('backbone').Marionette;

	var defaultBindUIElements = Marionette.View.prototype.bindUIElements;
	var defaultUnbindUIElements = Marionette.View.prototype.unbindUIElements;

	Marionette.View.prototype.bindUIElements = function(){
		this.__createAllBinders();
		this.bindOutlets();
		this.__bindActions();
		this.__createAllBinders();
		return defaultBindUIElements.apply(this, arguments);
	};

	Marionette.View.prototype.unbindUIElements = function(){
		this.__destroyAllBinder();
		this.__unbindActions();
		this.__clearOutlets();
		return defaultUnbindUIElements.apply(this, arguments);
	};

	Marionette.View.prototype._putUids = function (dataType) {	

		var me = this;

		$('[data-' + dataType + ']', this.el).each(function () {
			var $node = $(this);
			$node.attr('data-' + dataType + '-' + me.cid, $node.data()[dataType]);
			$node.removeAttr('data-' + dataType);
		});
	};



	_.extend(Marionette.View.prototype, ModelBindMixin, ActionsBindMixin, OutletBindMixin);

});