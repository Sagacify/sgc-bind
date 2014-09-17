define([], function(){
	'use strict';	
	return {

		actionsBind: false,


		__defaultSGAction : 'click',

		__bindActions: function(){
			if (!this.actionsBind) {
				return;
			}

			this._putUids('sgaction');

			var me = this;
			$('[data-sgaction-'+this.cid+']', this.el).each(function(){
				
				var data = $(this).attr('data-sgaction-'+me.cid);
				var actionsInfo = data && data.split(':');
				if (!actionsInfo || !actionsInfo.length) {
					throw 'Error for data-sgaction for the widget ';
				}
				var method, trigger;

				if (actionsInfo.length === 1) {
					method = actionsInfo[0];
					trigger = me.__defaultSGAction;
				} else {
					method = actionsInfo[1];
					trigger = actionsInfo[0];
				}
				me.__bindAction(this, trigger, method);
			});			
		},

		__bindAction: function(node, trigger, methodName){
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