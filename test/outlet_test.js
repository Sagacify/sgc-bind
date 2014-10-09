define([
	'sgc-bind',

    'text!./templates/templateOutlet1.html',
    'text!./templates/templateOutlet2.html',
        
	'chai', 
	'sinonIE',
], function(SGCBind,

    templateOutlet1,
	templateOutlet2,

    chai
)  {
    'use strict';


    return function() {
        chai.should();

        describe('Testing outlets Marionette View', function() {

            it('Test no outlets if options false', function(){
                var View = Backbone.Marionette.ItemView.extend({
                    outletsBind:false,
                    template: templateOutlet1,
                });
                var view = new View();
                view.render();
                _.keys(view.outlets).length.should.equal(0);
            });                 

            it('Test outlet foundin view', function(){
                var View = Backbone.Marionette.ItemView.extend({
                    outletsBind:true,
                    template: templateOutlet1,
                });
                var view = new View();
                view.render();
                view.$el.find('[data-sgoutlet-'+view.cid+']').length.should.equal(1);
                view.outlets.anOutlet.get(0).should.equal(view.$el.find('[data-sgoutlet-'+view.cid+']').get(0));
            });     

            it('Test mutliple outlets with same name in view', function(){
                var View = Backbone.Marionette.ItemView.extend({
                    outletsBind:true,
                    template: templateOutlet2,
                });
                var view = new View();
                view.render();
                _.keys(view.outlets).length.should.equal(1);
				view.outlets.anOutlet.length.should.equal(2);
            });  

            it('Test oultets cleared when view is destroy', function(){
                var View = Backbone.Marionette.ItemView.extend({
                    outletsBind:true,
                    template: templateOutlet2,
                });
                var view = new View();
                view.render();
                _.keys(view.outlets).length.should.equal(1);
				view.outlets.anOutlet.length.should.equal(2);
				view.destroy();
				_.keys(view.outlets).length.should.equal(0);

            });  

        });
    };
});