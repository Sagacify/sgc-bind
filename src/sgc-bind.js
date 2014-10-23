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

		var appendUIDToEl = function($node){
			$node.attr('data-' + dataType + '-' + me.cid, $node.data()[dataType]);
			$node.removeAttr('data-' + dataType);
		}

		var me = this;
		this.$('[data-' + dataType + ']').each(function () {
			appendUIDToEl($(this));
		});

		if (!this.$el.parent().length) {
			$('<div>').append(this.$el).find('[data-'+dataType+']').filter(this.$el).each(function(){
				appendUIDToEl($(this));
			});
		} else {
			this.$el.parent().find('[data-'+dataType+']').filter(this.$el).each(function(){
				appendUIDToEl($(this));
			});
		}
	};

	Marionette.View.prototype._retrieveWithUids = function (dataType) {	
		
		var items = this.$('[data-' + dataType + '-'+this.cid+']');

		var parentItem;
		if (!this.$el.parent().length) {
			parentItem = $('<div>').append(this.$el).find('[data-'+dataType+'-'+this.cid+']');
		} else {
			parentItem = this.$el.parent().find('[data-'+dataType+'-'+this.cid+']').filter(this.$el);
		}
		
		return $(items.get().concat(parentItem.get()));;
	};



	_.extend(Marionette.View.prototype, ModelBindMixin, ActionsBindMixin, OutletBindMixin);

});