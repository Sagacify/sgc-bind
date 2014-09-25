define([
	'../utils'
], function (
	utils
) {
	'use strict';

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