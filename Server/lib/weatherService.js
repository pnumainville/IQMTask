
var fetch = require('node-fetch');

var searchMethods = {
    geolocation: "/cities/geoposition",
    zipCode: ""
}

var errorCodes = {
    notFound: 10,
    contentError:  11,
    localError: 12,
}

var service = function(config){

   
    this.getCurrentConditionsForLocation = function(loc){
        var conditionsUrl = config.accuWeatherApiUrl + '/currentconditions/v1/' + loc.Key;
        var searchPath = '?apikey=' + config.accuWeatherApiToken + "&details=true";
        var self = this;

        return new Promise((resolve,reject)=>{
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
                        reject({errorCode: errorCodes.contentError, message: "Invalid response from server"});
                    }
                })
                .then(
                    data=>{
                        if (data.length){
                            resolve(self.mapConditionsResult(data[0],loc));
                        }
                        else{
                            reject({errorCode: errorCodes.notFound, message: "No location found for the specified zipcode"});
                        }
                    },
                    err=>{
                        reject({errorCode: errorCodes.contentError, message: "Invalid response from server"});
                    })
                .catch(err=> {
                    
                    reject({errorCode: errorCodes.localError, message: "Unknown server error" }); 
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

        return new Promise( (resolve,reject)=>{
            return this.findLocation(searchMethods.zipCode,zipCode)
                .then(
                    loc=>resolve(this.getCurrentConditionsForLocation(loc)),
                    err=>reject(err)
                );
        });

    };

    this.getCurrentConditionsForLatLng = function(lat,lng){

        var locationKey = "";
        var lastError = null;

        return new Promise( (resolve,reject)=>{
            return this.findLocation(searchMethods.geolocation, [lat,lng].join(","))
                .then(
                    loc=>resolve(this.getCurrentConditionsForLocation(loc)),
                    err=>reject(err)
                );
        });

    };



    //findLocation
    //Query AccuWeather API for the locationKey of the provided query. 
    //The locationKey will be used for subsequent requests to the accuWeather API for the provided location information 
    //[method = searchMethods, query = (lat,lng) or zipCode]
    this.findLocation = function(method,query){
        
        var locationSearchUrl = config.accuWeatherApiUrl + '/locations/v1' + method + "/search";
        var searchPath = '?apikey=' + config.accuWeatherApiToken + "&q=" + query;

        console.log("fetching " + locationSearchUrl + searchPath);

        return new Promise((resolve,reject)=>{
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
                        reject({errorCode: errorCodes.contentError, message: "Invalid response from server"});
                    }
                })
                .then(
                    d=>{
                        //for now, just return the first result found.
                        if (Array.isArray(d)){
                            if (d.length){
                                resolve(d[0]);
                            }
                            else{ 
                                reject({errorCode: errorCodes.notFound, message: "No location found for the specified request"});
                            }
                        }
                        //Check for null object as well, accuweather  api will return null when geolocation is not found.
                        else if (typeof d === "object" && d != null){
                            resolve(d);
                        }
                        else{
                            reject({errorCode: errorCodes.notFound, message: "No location found for the specified request"});
                        }
                        
                    },
                    err=>{
                         reject({errorCode: errorCodes.contentError, message: "Invalid response from server"});
                    }
                )
                .catch(err=>{  reject({errorCode: errorCodes.localError, message: "unknown server error" })} )
            });
    }

    
}

module.exports = service;
