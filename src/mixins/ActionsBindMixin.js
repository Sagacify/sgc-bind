define([
	'../utils'
], function(
		utils
){
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