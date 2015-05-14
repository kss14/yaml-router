var chai = require('chai')
  , chaiHttp = require('chai-http');
chai.use(chaiHttp);

var assert = chai.assert;
var expect = chai.expect;

var express = require('express');
var yamlRouter = require('..');

describe('yaml-router', function() {
  var app;
  var mountedApp;
  var noop = function(req, res, next) { next(); };

  before(function() {
		app = express();
		
		app.set('views', __dirname + '/fixtures/views');
		app.set('view engine', 'twig');
		
	
		yamlRouter(app, {
			routingFile: __dirname+'/fixtures/routing.yml',
			controllerPath: __dirname+'/fixtures/controller'
		});
	});
  
  
	it('should find controller functions for defined routes in yaml', function() {
		assert.equal(app.locals.url('about'), '/about');
		assert.equal(app.locals.url('item'), '/item');
		assert.equal(app.locals.url('param', {test: 5}), '/param/5');
	});
	
	it('should find controller functions for yaml loaded through resource syntax', function() {
		assert.equal(app.locals.url('api-get'), '/api/get');
	});
	
	
	
	describe('should render twig templates from controllers', function() {
		it('GET /about', function(done) {
			chai.request(app)
				.get('/about')
			  	.end(function (err, res) {
					expect(err).to.be.null;
				 	expect(res).to.have.status(200);
					done();     
			});
		});
	
		it('POST /item', function(done) {
			chai.request(app)
			  .post('/item')
			  .end(function (err, res) {
				 expect(err).to.be.null;
				 expect(res).to.have.status(200);
				done();     
			  });
			
		});
	});

	describe('should check the allowed methods', function() {
		
		it('should not find GET /item', function(done) {

			chai.request(app)
		  		.get('/item')
		  		.end(function (err, res) {
			 		expect(err).to.be.null;
			 		expect(res).to.have.status(404);
			 		done();
		  	});
		});	
	});	
	
});
