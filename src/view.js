define([
	'backbone.marionette',
	'./mixins/ModelBindMixin',
	'./mixins/ActionsBindMixin',
	'./mixins/OutletBindMixin'
], function (Marionette, ModelBindMixin, ActionsBindMixin, OutletBindMixin) {
	'use strict';

	var defaultBindUIElements = Marionette.View.prototype.bindUIElements;
	var defaultUnbindUIElements = Marionette.View.prototype.unbindUIElements;

	Marionette.View.prototype.bindUIElements = function(){
		this.bindToModel();
		this.bindOutlets();
		this.__bindActions();
		this.__createAllBinders();
		return defaultBindUIElements.apply(this, arguments);
	};

	Marionette.View.prototype.unbindUIElements = function(){
		this.__destroyAllBinder();
		this.__unbindActions();
		return defaultUnbindUIElements.apply(this, arguments);
	};

	_.extend(Marionette.View.prototype, ModelBindMixin, ActionsBindMixin, OutletBindMixin);

});