var express = require('express');
var weatherApp = express();
var weatherService = require('./lib/weatherService');
var config = require('./config');

//setup CORS access.
weatherApp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

weatherApp.get('/byZip/:zipCode',(req,res)=>{

    var service = new weatherService(config);

    if (isValidUSZip(req.params.zipCode) || isValidCAPostalCode(req.params.zipCode)){
        //fetch weather data using provided zipcode
        var currentWeather = service.getCurrentConditionsForZipCode(req.params.zipCode)
            .then(
                conditionsResult=>res.json(conditionsResult),
                err=>res.status(404).json(err)
            )
            .catch(err=>res.status(404).json(err));
    }
    else{
        res.status(404).json({errorCode: 1, message:"Invalid zipcode provided."});
    }


});

weatherApp.get('/byGeoLocation/:longitude/:latitude',(req,res)=>{

    var service = new weatherService(config);

    var lat = parseFloat(req.params.latitude);
    var lng = parseFloat(req.params.longitude);

    if (isValidLatLng(lat,lng)){
        //fetch weather data using provided latitude, longitude
        var currentWeather = service.getCurrentConditionsForLatLng(lat,lng)
            .then(
                conditionsResult=>res.json(conditionsResult),
                err=>res.status(404).json(err)
            )
            .catch(err=>res.status(404).json(err));
    }
    else{
        res.status(404).json({errorCode: 1, message:"Invalid latitude,longitude provided."});
    }


});


function isValidLatLng(lat,lng){
    if (typeof lat === 'number' && typeof lng === 'number')
        return lat > -90 && lat < 90 && lng > -180 && lng < 180;
    return false;
}


function isValidCAPostalCode(postalCode){
    return /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(postalCode);
}

function isValidUSZip(zipCode) {
   return /^\d{5}(-\d{4})?$/.test(zipCode);
}


weatherApp.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})