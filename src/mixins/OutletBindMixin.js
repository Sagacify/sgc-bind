define([], function () {
	'use strict';

	return {

		outletsBind: false,

		bindOutlets: function () {
			if (!this.outletsBind) {
				return;
			}

			var me = this;

			this._putUids('sgoutlet');

			$('[data-sgoutlet-' + this.cid + ']', this.el).each(function () {
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