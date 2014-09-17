define([
	'sgc-bind',

    'text!./templates/templateBind1.html',
    'text!./templates/templateBind2.html',
    'text!./templates/templateBind3.html',
    'text!./templates/templateBind4.html',
        
	'chai', 
	'sinonIE',
], function(SGCBind,

    templateBind1,
    templateBind2,
    templateBind3,
    templateBind4,

    chai
)  {
    'use strict';


    return function() {
        chai.should();



        describe('Testing bind with Marionette View', function() {

            it('Test bind :name', function(){
                var View = Backbone.Marionette.ItemView.extend({
                    modelBind:true,
                    template: templateBind1,
                });
                var model = new Backbone.Model();
                model.set('name', 'YVAN');
                var view = new View({model:model});
                view.render();
                view.$el.find('span').html().should.equal('YVAN');

                model.set('name', 'FRANCOIS');
                view.$el.find('span').html().should.equal('FRANCOIS');
            }); 

            it('Test bind change:name', function(){
                var View = Backbone.Marionette.ItemView.extend({
                    modelBind:true,
                    template: templateBind2,
                });

                var model = new Backbone.Model();
                model.set('name', 'YVAN');
                var view = new View({model:model});
                view.render();
                view.$el.find('span').html().should.equal('YVAN');

                model.set('name', 'FRANCOIS');
                view.$el.find('span').html().should.equal('FRANCOIS');
            }); 

            it('Test bind customEvent', function(){
                var View = Backbone.Marionette.ItemView.extend({
                    modelBind:true,
                    template: templateBind3,
                });
                var model = new Backbone.Model();
                var view = new View({model:model});

                view.render();
                
                model.trigger('customEvent', model, 'YVAN');
                view.$el.find('span').html().should.equal('YVAN');

                model.trigger('customEvent', model, 'FRANCOIS');
                view.$el.find('span').html().should.equal('FRANCOIS');


            }); 

        });
    };
});