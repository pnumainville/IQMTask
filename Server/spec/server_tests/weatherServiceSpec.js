describe("WeatherService",function(){

    var weatherService = require('../../lib/weatherService');

    var config = {
        accuWeatherApiUrl: "http://dataservice.accuweather.com",
        accuWeatherApiToken : "dxLeCvLGAqG3IRqKbywnGxAg0pmZejsl"
    }

    var service = new weatherService(config);

    it('should find a valid location for seattle',function(done){
        service.findLocation("98101").then(d=>{
            //console.log(d);
            expect(d.Key).toBe("41332_PC");
            done();
         })
         .catch(e=>fail(e));
    });

    it('should return error',function(done){
        service.findLocation("inavlidzipcode").then(d=>{
            fail('Unwanted branch, zip code was not valid. promise should have thrown error');
            done();
         })
         .catch(e=>{
             console.log(e);
            done();
         })

    });

     it('should return error, zipcode not found',function(done){
        service.findLocation("98998").then(d=>{
            fail('Unwanted branch, zip code was not valid. promise should have thrown error');
            done();
         })
         .catch(e=>{
              console.log(e);
            done();
         })

    });


    it("Should return currentConditions for LocationKey", function(done){
        service.getCurrentConditionsForLocation({Key:"41332_PC", LocalizedName: "Seattle"})
            .then(d=>{
                expect(d.temperature).toBeDefined();
                expect(d.temperature.metric.unitLabel).toBe("C");
                console.log("Temperature : "  + d.temperature.metric.value);
                done();
            })
            .catch(e=>{console.log(e.errorCode); done();});

    });

    it("Should return currentConditions for Seattle Zipcode", function(done){
        service.getCurrentConditionsForZipCode("98101")
            .then(d=>{
                expect(d.temperature).toBeDefined();
                expect(d.temperature.metric.unitLabel).toBe("C");
                console.log("Temperature : "  + d.temperature.metric.value);
                done();
            })
            .catch(e=>{console.log(e.errorCode); done();});

    });

});