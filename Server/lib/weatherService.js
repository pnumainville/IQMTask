
var fetch = require('node-fetch');

var service = function(config){

   
    this.getCurrentConditionsForLocation = function(loc){
        var conditionsUrl = config.accuWeatherApiUrl + '/currentconditions/v1/' + loc.Key;
        var searchPath = '?apikey=' + config.accuWeatherApiToken + "&details=true";
        var self = this;

        return new Promise((fulfill,reject)=>{
            console.log("fetching " + conditionsUrl + searchPath);
            
            fetch(conditionsUrl + searchPath)
                .then(function(response) { 
                    if (response.status != 200){
                        reject({errorCode: response.status, message:"Host error"});
                    }
                    if(response.headers.get("content-type") && response.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0){
	                    // Json response received, convert to JSON object
 	                    return response.json();
                    }
                    else{
                        reject({errorCode: 11, message: "Invalid response from server"});
                    }
                })
                .then(
                    data=>{
                        if (data.length){
                            fulfill(self.mapConditionsResult(data[0],loc));
                        }
                        else{
                            reject({errorCode: 10, message: "No location found for the specified zipcode"});
                        }
                    },
                    err=>{
                        reject({errorCode: 11, message: "Invalid response from server"});
                    })
                .catch(err=> {
                    
                    reject({errorCode: 1, message: "Unknown server error" }); 
                });
        });
    }


    this.mapConditionsResult = function(accuWeatherConditions,location){
        var currentConditions = {
           locationName: location.LocalizedName,
           temperature: {
               metric: {value: accuWeatherConditions.Temperature.Metric.Value, unitLabel: "C"},
               imperial: {value: accuWeatherConditions.Temperature.Imperial.Value, unitLabel: "F"}
           },
           epochTime: accuWeatherConditions.EpochTime,
           iconIndex: accuWeatherConditions.WeatherIcon
        };

        return currentConditions;

    }

    this.getCurrentConditionsForZipCode = function(zipCode){

        var locationKey = "";
        var lastError = null;

        return new Promise( (fulfill,reject)=>{
            return this.findLocation(zipCode)
                .then(loc=>fulfill(this.getCurrentConditionsForLocation(loc)),
                err=>reject(err));
        });

    };



    //findLocationKey
    //Query AccuWeather API for the locationKey of  the provided zipCode. 
    //The locationKey will be used for subsequent requests to the accuWeather API for the provided zipCode
    this.findLocation = function(zipCode){

        var locationSearchUrl = config.accuWeatherApiUrl + '/locations/v1/search';
        var searchPath = '?apikey=' + config.accuWeatherApiToken + "&q=" + zipCode;

        console.log("fetching " + locationSearchUrl + searchPath);

        return new Promise((fulfill,reject)=>{
            fetch(locationSearchUrl + searchPath)
                .then(function(response) { 
                    if (response.status != 200){
                        reject({errorCode: response.status, message:"Unable to reach weather service at this time."});
                    }
                    if(response.headers.get("content-type") && response.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0){
                        // Json response received, convert to JSON object
 	                    return response.json();
                    }
                    else{
                        reject({errorCode: 11, message: "Invalid response from server"});
                    }
                })
                .then(
                    d=>{
                        //for now, just return the first result found.
                        if (d.length){
                            fulfill(d[0]);
                        }
                        else{
                             reject({errorCode: 10, message: "No location found for the specified zipcode"});
                        }
                    },
                    err=>{
                         reject({errorCode: 10, message: "Invalid response from server"});
                    }
                

                )
                .catch(err=>{ reject({errorCode: 1, message: "unknown server error" })} )
            });
    }
}

module.exports = service;
