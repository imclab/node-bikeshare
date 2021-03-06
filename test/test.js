require('mocha');

var BikeShare = require('../index'),
	should = require('should'),
	util = require('util');

require('./fixtures/fixtures');

var client = null;

describe('node-bikeshare', function(){

	beforeEach(function(){
		client = new BikeShare();
	});

	describe('initialization', function(){
		it('should create a new instance of the BikeShare class', function(done){
			client.should.be.an.instanceOf(BikeShare)

			done();
		});

		it('should accept a url to pull data from and create a new instance of the BikeShare class', function(done){
			client_with_url = new BikeShare("http://bayareabikeshare.com/stations/json_with_offline_stations");
			client_with_url.should.be.an.instanceOf(BikeShare)

			done();
		});
	});

	describe('errors', function(){
		it("should throw errors if something goes wrong when pulling the data", function(done){
			client_with_errors = new BikeShare("http://bayareabikeshare.com/stations/bad_response");

			client_with_errors.once("error", function(error, statusCode){
				statusCode.should.equal(500);
				
				done();
			});

			client_with_errors.fetch();
		});
	});

	describe("lastStation", function(){
		it("should return 77 for the last station's id", function(done){
	    	var last_station_id_on_json = 77;

	    	client.once("fetch", function(){
				client.lastStation().id.should.equal(last_station_id_on_json);
				done();
			});

			client.fetch();
	    });
	});

	describe("station", function(){
		it("should return the information for a single station if valid", function(done){
			
			expected_station_id = 3;

			client.once("fetch", function(){

				station = client.station(3);

				station.should.have.property('id', 3);
				station.should.have.property('stationName', 'San Jose Civic Center');
				station.should.have.property('availableDocks', 6);
				station.should.have.property('totalDocks', 15);
				station.should.have.property('latitude', 37.330698);
				station.should.have.property('longitude', -121.888979);
				station.should.have.property('statusKey', 1);
				station.should.have.property('availableBikes', 9);
				station.should.have.property('stAddress1', 'San Jose Civic Center');
				station.should.have.property('stAddress2', '');
				station.should.have.property('city', "San Jose");
				station.should.have.property('postalCode', "");
				station.should.have.property('location', "W San Carlos Street");
				station.should.have.property('altitude', '');
				station.should.have.property('testStation', false);
				station.should.have.property('lastCommunicationTime', null);
				station.should.have.property('landMark', "San Jose");

				done();
			});

			client.fetch();
		});

	    it("should return null if station is not found", function(done){
	      client.once("fetch", function(){
				station = client.station(99)
				
				should.not.exist(station);

				done();
			});

			client.fetch();
	    });
	});

	describe("stations", function(){
		it("should return all of the stations if no city name is provided", function(done){
			all_stations_count = 64;

			client.once("fetch", function(){

				stations = client.stations();

				stations.should.be.an.Array;
      			stations.length.should.equal(all_stations_count);

      			done();
			});
			
			client.fetch();
		});

		it("should return all San Jose stations", function(done){
			san_jose_stations_count = 14;

			client.once("fetch", function(){

				stations = client.stations("San Jose");
				
				stations.should.be.an.Array;
      			stations.length.should.equal(san_jose_stations_count);

      			done();
			});
			
			client.fetch();
		});

		it("should return all San Francisco stations even if the city name has the wrong capitalization", function(done){
			san_francisco_stations_count = 34;

			client.once("fetch", function(){

				stations = client.stations("san francisco");
				
				stations.should.be.an.Array;
      			stations.length.should.equal(san_francisco_stations_count);

      			done();
			});
			
			client.fetch();
		});

		it("should return an empty array if the city cannot be found", function(done){
			client.once("fetch", function(){

				stations = client.stations("baltimore");
				
				stations.should.be.an.Array;
      			stations.should.be.empty;

      			done();
			});
			
			client.fetch();
		});
	});

	describe("empty stations", function(){

		it("should return an array with empty stations", function(done){
			client.once("fetch", function(){

				stations = client.emptyStations();
				
				stations.should.be.an.Array;
      			stations.length.should.equal(2);

      			done();
			});
			
			client.fetch();
		});

		it("should return an empty array if there are no empty stations", function(done){
			client_with_no_empty_stations = new BikeShare("http://bayareabikeshare.com/stations/json_with_offline_stations");

			client_with_no_empty_stations.once("fetch", function(){

				stations = client_with_no_empty_stations.emptyStations();
				
				stations.should.be.an.Array;
      			stations.should.be.empty;

      			done();
			});
			
			client_with_no_empty_stations.fetch();
		});

		it("should return true if a specific station is empty", function(done){
			client.once("fetch", function(){

				client.isEmptyStation(4).should.be.true;

      			done();
			});
			
			client.fetch();
		});

		it("should return false if a specific station is not empty", function(done){
			client.once("fetch", function(){

				client.isEmptyStation(5).should.be.false;

      			done();
			});
			
			client.fetch();
		});

		it("should return true or false if a station object is passed", function(done){
			client.once("fetch", function(){
				station = client.station(4);

				client.isEmptyStation(station).should.be.true;

      			done();
			});
			
			client.fetch();
		});
	});

	describe("full stations", function(){

		it("should return an array with all stations that are full", function(done){
			client.once("fetch", function(){

				stations = client.fullStations();
				
				stations.should.be.an.Array;
      			stations.length.should.equal(2);

      			done();
			});
			
			client.fetch();
		});

		it("should return an empty array if there are no full stations", function(done){
			client_with_no_full_stations = new BikeShare("http://bayareabikeshare.com/stations/json_with_offline_stations");

			client_with_no_full_stations.once("fetch", function(){

				stations = client_with_no_full_stations.fullStations();
				
				stations.should.be.an.Array;
      			stations.should.be.empty;

      			done();
			});
			
			client_with_no_full_stations.fetch();
		});

		it("should return true if a specific station is full", function(done){
			client.once("fetch", function(){

				client.isFullStation(57).should.be.true;

      			done();
			});
			
			client.fetch();
		});

		it("should return false if a specific station is not full", function(done){
			client.once("fetch", function(){

				client.isFullStation(5).should.be.false;

      			done();
			});
			
			client.fetch();
		});

		it("should return true or false if a station object is passed", function(done){
			client.once("fetch", function(){
				station = client.station(57);

				client.isFullStation(station).should.be.true;

      			done();
			});
			
			client.fetch();
		});
	});

	describe("percent available bikes", function(){

		it("should return the percent of available bikes for a station", function(done){
			client.once("fetch", function(){

				percentAvailable = client.percentAvailableBikes(58);
				
				percentAvailable.should.be.an.Number;
      			percentAvailable.should.equal(36.84);

      			done();
			});
			
			client.fetch();
		});

		it("should return the percent of available bikes for a station if a station object is passed", function(done){
			client.once("fetch", function(){
				station = client.station(58);

				percentAvailable = client.percentAvailableBikes(station);
				
				percentAvailable.should.be.an.Number;
      			percentAvailable.should.equal(36.84);

      			done();
			});
			
			client.fetch();
		});
	});

	describe("offline stations", function(){

		it("should return an empty array if there are no offline stations", function(done){
			client.once("fetch", function(){

				offlineStations = client.offlineStations();
				
				offlineStations.should.be.an.Array;
      			offlineStations.should.be.empty;

      			done();
			});
			
			client.fetch();
		});

		it("should return an array of offline stations", function(done){
			
			client_with_offline_stations = new BikeShare("http://bayareabikeshare.com/stations/json_with_offline_stations");

			client_with_offline_stations.once("fetch", function(){

				offlineStations = client_with_offline_stations.offlineStations();
				
				offlineStations.should.be.an.Array;
      			offlineStations.length.should.equal(1);

      			done();
			});
			
			client_with_offline_stations.fetch();
		});

	});

});