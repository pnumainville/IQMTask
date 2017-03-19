var express = require('express');
var weatherApp = express();
var weatherService = require('./lib/weatherService');
var config = require('./config');

weatherApp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

weatherApp.get('/byZip/:zipCode',(req,res)=>{

    var service = new weatherService(config);

    if (isValidUSZip(req.params.zipCode)){
        //fetch weather data using provided zipcode
        var currentWeather = service.getCurrentConditionsForZipCode(req.params.zipCode)
            .then(conditionsResult=>res.json(conditionsResult))
            .catch(err=>res.sendStatus(404).end("Current conditions were not found for specification location"));
    }
    else{
        res.status(404).end('Provided zipcode was not valid.');
    }


});



function isValidUSZip(zipCode) {
   return /^\d{5}(-\d{4})?$/.test(zipCode);
}


weatherApp.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})