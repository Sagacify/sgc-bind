define([
	'sgc-bind',

    'text!./templates/templateAction1.html',
    'text!./templates/templateAction2.html',
    'text!./templates/templateAction3.html',
    'text!./templates/templateAction4.html',
    'text!./templates/templateAction5.html',
    
	'chai', 
	'sinonIE',
], function(SGCBind,

    templateAction1,
    templateAction2,
    templateAction3,
    templateAction4,
    templateAction5,

    chai
)  {
    'use strict';


    return function() {
        chai.should();

        describe('Testing actions Marionette View', function(done) {

            it('Test not trigger if actionsbind false', function(){

                var View = Backbone.Marionette.ItemView.extend({
                    actionsBind:false,
                    template: templateAction1,
                })

                var view = new View();
                view.render();
                _.keys(view.__getActionNodes()).length.should.equal(0);

            });

            it('Test view found correct bind', function(done){

                var View = Backbone.Marionette.ItemView.extend({

                    actionsBind:true,
                    
                    template: templateAction1,

                    methodToCall: function(){
                        done();
                    }
                })

                var view = new View();
                view.render();
                view.$el.find('button').trigger('click');
                done('Method never called');
            });

            it('Test view with no trigger (default click)', function(done){

                var View = Backbone.Marionette.ItemView.extend({

                    actionsBind:true,
                    
                    template: templateAction2,

                    methodToCall: function(){
                        done();
                    }
                })

                var view = new View();
                view.render();
                view.$el.find('button').trigger('click');

            });

            it('Test view custom trigger', function(done){
                var View = Backbone.Marionette.ItemView.extend({

                    actionsBind:true,
                    
                    template: templateAction3,

                    inputChange: function(evt, node){
                        done();
                    }
                })
                var view = new View();
                view.render();
                view.$el.find('input').trigger('change');
            });

          
            it('Test (__bindAction)  view custom unknow method or attributes', function(){

                chai.expect(function(){
                    var View = Backbone.Marionette.ItemView.extend({
                        actionsBind:true,
                        template: templateAction1,
                        methodToCall:null
                    })
                    var view = new View();
                    view.render();
                }).to['throw'](Error);

                chai.expect(function(){
                    var View = Backbone.Marionette.ItemView.extend({
                        actionsBind:true,
                        template: templateAction1,
                    })
                    var view = new View();
                    view.render();
                }).to['throw'](Error);
            });

            it('Test (__bindAction)  add tree binds on same method', function(){

                var View = Backbone.Marionette.ItemView.extend({

                    actionsBind:true,
                    
                    template: templateAction4,

                    methodToCall: function(evt, node){
                    }
                })
                var view = new View();
                view.render();

                _.keys(view.__getActionNodes()).length.should.equal(1);
                view.__getActionNodes()['methodToCall-click'].node.length.should.equal(3);
            });

            it('Test (__bindAction)  add two bind with same method, but other evt', function(){

                var View = Backbone.Marionette.ItemView.extend({

                    actionsBind:true,
                    
                    template: templateAction5,

                    methodToCall: function(evt, node){
                    }
                })
                var view = new View();
                view.render();

                _.keys(view.__getActionNodes()).length.should.equal(2);

                view.__getActionNodes()['methodToCall-click'].node.length.should.equal(1);
                view.__getActionNodes()['methodToCall-blur'].node.length.should.equal(1);
            });


            it('Test Unbind called with destroy', function(done){

                var View = Backbone.Marionette.ItemView.extend({

                    actionsBind:true,
                    
                    template: templateAction5,

                    methodToCall: function(evt, node){
                        done(new Error('Listenner always present'));
                    }
                })
                var view = new View();
                view.render();

                _.keys(view.__getActionNodes()).length.should.equal(2);
                view.destroy();
                _.keys(view.__getActionNodes()).length.should.equal(0);
                view.$el.find('button').trigger('click');
                done();
            });



        });
    };
});