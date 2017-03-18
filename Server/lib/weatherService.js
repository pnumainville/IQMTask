
var fetch = require('node-fetch');

var service = function(config){

   
    this.getCurrentConditionsForLocation = function(locKey){
        var conditionsUrl = config.accuWeatherApiUrl + '/currentconditions/v1/' + locKey;
        var searchPath = '?apikey=' + config.accuWeatherApiToken;
        var self = this;

        return new Promise((fulfill,reject)=>{
            console.log("fetching " + conditionsUrl + searchPath);
            
            fetch(conditionsUrl + searchPath)
                .then(function(response) { 
                    if (response.status != 200){
                        reject({errorCode: response.status, message:"Host error"});
                        
                    }
	                // Convert to JSON
	                response.json()
                        .then(d=>{
                            //for now, just return the first result found.
                            if (d.length > 0){
                                fulfill(self.mapConditionsResult(d[0]));
                            }
                            else{
                                reject({errorCode: 10, message: "Multiple results, result not accurate enough"});
                            }
                        })
                    .catch(e=>reject(e));
                })
                .catch(err=> {
                    console.log("fetch error");
                    reject({errorCode: 1, message: "fetch error" }); 
                });
        });
    }


    this.mapConditionsResult = function(accuWeatherConditions){

        var currentConditions = {
           temperature: {
               metric: {value: accuWeatherConditions.Temperature.Metric.Value, unitLabel: "C"},
               imperial: {value: accuWeatherConditions.Temperature.Imperial.Value, unitLabel: "F"}
           },
           epochTime: accuWeatherConditions.EpochTime
        };

        return currentConditions;

    }

    this.getCurrentConditionsForZipCode = function(zipCode){

        var locationKey = "";
        var lastError = null;

        return new Promise( (fulfill,reject)=>{
            return this.findLocationKey(zipCode)
                .then(locKey=>fulfill(this.getCurrentConditionsForLocation(locKey)));
        });

    };



    //findLocationKey
    //Query AccuWeather API for the locationKey of  the provided zipCode. 
    //The locationKey will be used for subsequent requests to the accuWeather API for the provided zipCode
    this.findLocationKey = function(zipCode){

        var locationSearchUrl = config.accuWeatherApiUrl + '/locations/v1/search';
        var searchPath = '?apikey=' + config.accuWeatherApiToken + "&q=" + zipCode;

        console.log("fetching " + locationSearchUrl + searchPath);

        return new Promise((fulfill,reject)=>{
            fetch(locationSearchUrl + searchPath)
                .then(function(response) { 
                    if (response.status != 200){
                        reject({errorCode: response.status, message:"Host error"});
                    }
	                // Convert to JSON
	                response.json()
                        .then(d=>{
                            //for now, just return the first result found.
                            if (d.length > 0){
                                fulfill(d[0].Key);
                            }
                            else{
                                reject({errorCode: 10, message: "Multiple results, result not accurate enough"});
                            }
                        })
                        .catch(err=> reject({errorCode: 2, message:"Error reading result from the server." }) );
                })
                .catch(err=> reject({errorCode: 1, message: "fetch error" }) )
            });
    }
}

module.exports = service;
