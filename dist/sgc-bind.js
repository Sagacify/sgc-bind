define('utils',[], function (
) {
	

	var utils = {};
	
	utils.startsWith = function(string, str){
		return string.slice(0, str.length) === str;
	};

	utils.endsWith = function(string, str){
		return string.slice(string.length - str.length, string.length) === str;
	};
	return utils;
});

define('mixins/ModelBindMixin',[
	'../utils'
], function (
	utils
) {
	

	var Binder = function (model, view, controller) {
		this.node = view;
		this.model = model;
		this.controller = controller;

		this.parseNodeAttribute();
		this.configureBindFunction();

		this.bind();

		this.tryTriggerFirstValue();
	};

	_.extend(Binder.prototype, {

		// Attribute info: 'change:name->.html(value)' 
		// Attribute info: ':name->.html(value)' <=> change:name->.html(value)
		// Attribute info: ':name' <=> change:name->.html(value)
		// Attribute info: 'change:name' <=> change:name->.html(value)
		// Call nameToEl if present in controller

		retrieveNodeData: function () {
			return $(this.node).attr('data-sgbind-' + this.controller.cid);
		},
		setNodeData: function (data) {
			$(this.node).attr('data-sgbind-' + this.controller.cid, data);
		},

		//Prepare the binder
		parseNodeAttribute: function () {
			var attributeInfo = this.retrieveNodeData();
			var splittedAttribute = attributeInfo.split('->');

			this.trigger = null;
			this.viewAction = null;
			this.attribute = null;

			this.trigger = splittedAttribute[0];

			if (!this.trigger) {
				throw 'Error with node ' + this.node;
			}

			//Syntaxic sugar :name  <=> change:name
			if ( utils.startsWith(this.trigger, ':')) {
				this.trigger = 'change' + this.trigger;
			}

			if (utils.startsWith(this.trigger, 'change:')) {
				this.attribute = this.trigger.split('change:')[1];
			};

			if (splittedAttribute.length >= 2) {
				//Action is define 
				//if start with $ -> jquery eval function 
				//Else call delegate
				this.viewAction = splittedAttribute[1];
			} else {
				//Default action
				if (this.attribute && (this.attribute + 'ToEl' in this.controller)) {
					//Default action if existe (call delegate)
					this.viewAction = this.attribute + 'ToEl';
				} else {
					//Simple jquery html function
					this.viewAction = '$.html(value)';
				}
			}

			$(this.node).removeAttr('data-sgbind-' + this.controller.cid);
		},

		isJqueryEvalAction: function () {
			return utils.startsWith(this.viewAction, '$');
		},

		configureBindFunction: function () {
			this._bindFunction = function (model, value, options) {
				
				if (this.isJqueryEvalAction()) {

					//Context: model, value, this.node
					// $[value ? 'hide' : 'show']();
					// $.attr('src', value);

					//Jquery eval function
					var stringToApply = 'this.node' + this.viewAction.substring(1);
					// console.log('--->'+stringToApply);
					try {
						eval(stringToApply);
					} catch (err) {
						console.log(err);
						throw 'Bad formated action ' + this.viewAction;
					}
				} else {
					//Delegate to controller
					if (this.viewAction in this.controller) {
						var e = {
							model: this.model,
							value: Array.apply(null, arguments),
							options: options
						};

						if (this.attribute) {
							//Back change: action
							e.value = value;
						}

						this.controller[this.viewAction](e, this.node, this);
					} else {
						throw 'Unknow thing to do with event ' + this.getIdentifier() + ' - ' + this.node;
					}
				}
			};
		},

		unBind: function () {
			this.model.off(this.trigger, this._bindFunction, this);
			this.controller = null;
			this.node = null;
			this.model = null;
		},

		bind: function () {
			this.model.on(this.trigger, this._bindFunction, this);
		},

		mergeWith: function (anotherBind) {
			this.node = $(this.node.get().concat(anotherBind.node.get()));
		},

		getIdentifier: function () {
			return this.trigger + '-' + this.viewAction + '-' + this.model.id;
		},

		tryTriggerFirstValue: function () {
			if (this.attribute) {
				var value = this.model.get(this.attribute, {
					lazyCreation: false
				});
				this._bindFunction.apply(this, [this.model, value]);
			}
		}
	});

	return {

		modelBind: false,

		__createAllBinders: function () {
			if (!this.modelBind) {
				return;
			}

			this._putUids('sgbind');

			if (!this.model) {
				throw new Error('unknow model');
			}

			//Auto generate binds
			this.__getModelBinds();

			var me = this;
			this._retrieveWithUids('sgbind').each(function(){
			// this.$('[data-sgbind-' + this.cid + ']').each(function () {
				// without [] -> single bind
				// with only one [] -> single bind
				// with multiple [] -> multiple binds
				var value = $(this).attr('data-sgbind-' + me.cid);

				if (utils.startsWith(value, '[')) {
					var values = value.split('],[');
					values[0] = values.first().slice(1);
					values[values.length - 1] = values.last().slice(0, -1);
					var self = this;
					values.forEach(function (bind) {
						var el = $(self).attr('data-sgbind-' + me.cid, bind);
						me.__addBind(new Binder(me.model, el, me));
					});
				} else {
					me.__addBind(new Binder(me.model, $(this), me));
				}
			});
		},

		__destroyAllBinder: function () {
			if (!this.modelBind) {
				return;
			}

			_.each(this.__getModelBinds(), function (bind) {
				bind.unBind();
			}, this);
			this.__binds = {};
		},

		__addBind: function (bindObj) {
			var existSameBind = this.__getModelBind(bindObj.getIdentifier());

			if (this.__getModelBind(bindObj.getIdentifier())) {
				existSameBind.mergeWith(bindObj);
			} else {
				this.__getModelBinds()[bindObj.getIdentifier()] = bindObj;
			}
		},

		__removeBinds: function () {
			_.each(this.__binds, function (bind) {
				bind.destroy();
				delete this.__binds[name];
			}, this);
			this.__binds = {};
		},

		__getModelBind: function (id) {
			return this.__getModelBinds()[id];
		},

		__getModelBinds: function () {
			if (!this.__binds) {
				this.__binds = {};
			}

			return this.__binds;
		}
	};
});
define('mixins/ActionsBindMixin',[
	'../utils'
], function(
		utils
){
		
	return {

		actionsBind: false,


		__defaultSGAction : 'click',

		__bindActions: function(){
			if (!this.actionsBind) {
				return;
			}

			this._putUids('sgaction');

			var me = this;
			this._retrieveWithUids('sgaction').each(function(){
			// this.$('[data-sgaction-'+this.cid+']').each(function(){
				var data = $(this).attr('data-sgaction-'+me.cid);


				if (utils.startsWith(data, '[')) {
					var datas = data.split('],[');
					datas[0] = _.first(datas).slice(1);
					datas[datas.length - 1] = _.last(datas).slice(0, -1);
					var self = this;
					datas.forEach(function (bind) {
						var el = $(self).attr('data-sgbind-' + me.cid, bind);
						me.__bindAction(el, bind.trim());
					});
				} else {
					me.__bindAction(this, data.trim());
				}
			});			
		},

		__bindAction: function(node, actionsInfo){
			var methodName, trigger;
			var actionsInfo = actionsInfo && actionsInfo.split(':');
			if (actionsInfo.length === 1) {
				methodName = actionsInfo[0];
				trigger = this.__defaultSGAction;
			} else {
				methodName = actionsInfo[1];
				trigger = actionsInfo[0];
			}

			if (!methodName in this || !_.isFunction(this[methodName])) {
				throw new Error('Define method for action:'+methodName);
			}

			var me = this;
			$(node).on(trigger, function(evt){
				me[methodName](evt, node);
			});


			var existingNode = this.__getActionNodes()[methodName+"-"+trigger];
			if (existingNode && existingNode.trigger === trigger) {
				this.__getActionNodes()[methodName+"-"+trigger].node = $(existingNode.node.get().concat([node]));
			} else {
				this.__getActionNodes()[methodName+"-"+trigger] = {
					node : $(node),
					trigger : trigger
				};
			}
		}, 

		__unbindActions: function(){
			if (!this.actionsBind) {
				return;
			}

			_.each(this.__getActionNodes(), function(value){
				value.node.off(value.trigger);
			}, this);
			this.__actionNodes = {};
		},

		__getActionNodes: function(){
			if (!this.__actionNodes) {
				this.__actionNodes = {};
			}
			return this.__actionNodes;
		}
	};
});
define('mixins/OutletBindMixin',[], function () {
	

	return {

		outletsBind: false,

		bindOutlets: function () {
			if (!this.outletsBind) {
				return;
			}

			var me = this;

			this._putUids('sgoutlet');

			this._retrieveWithUids('sgoutlet').each(function(){
			// this.$('[data-sgoutlet-' + this.cid + ']').each(function () {
				var outletName = $(this).attr('data-sgoutlet-' + me.cid);
				me.bindOutlet(this, outletName);
			});
		},

		bindOutlet: function (node, outletName) {
			if (this.getOutlets()[outletName]) {
				//merge outlet binder
				this.getOutlets()[outletName] = $(this.getOutlets()[outletName].get().concat([node]));
				return;
			}

			this.getOutlets()[outletName] = $(node);
		},

		getOutlets: function () {
			if (!this.outlets) {
				this.outlets = {};
			}

			return this.outlets;
		},

		__clearOutlets: function(){
			this.outlets = {};
		}
	};
});
define('sgc-bind',[
	'./mixins/ModelBindMixin',
	'./mixins/ActionsBindMixin',
	'./mixins/OutletBindMixin'
], function (/*Marionette, */ModelBindMixin, ActionsBindMixin, OutletBindMixin) {
	

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
