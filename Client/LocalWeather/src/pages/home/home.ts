import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {WeatherService} from '../../services/weather.service';
import {LocationService} from '../../services/location.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ WeatherService, LocationService ]
})
export class HomePage {
  error = "";
  zipCode = "";
  conditions = null;
  constructor(
    public navCtrl: NavController,
    private weatherService: WeatherService,
    private locationService: LocationService
    ) {  }

  getWeather(){
    console.log("getWeather");

   

    this.weatherService.getCurrentConditions(this.zipCode)
      .subscribe(
        conditions=>{
          this.conditions = conditions;
          this.error = "";
        }, 
        err=>{
          
          this.error = err;
          this.conditions = null;
        }
      );
  }

  locate(){
    this.locationService.getLocation().then(loc=>{
      this.weatherService.getCurrentConditionsByLatLng(loc.latitude,loc.longitude)
      .subscribe(
        conditions=>{
          this.conditions = conditions;
          this.error = "";
        }, 
        err=>{
          
          this.error = err;
          this.conditions = null;
        }
      );
    });
  }
  showWeatherData(){
    return this.conditions != null; 
  }

}
