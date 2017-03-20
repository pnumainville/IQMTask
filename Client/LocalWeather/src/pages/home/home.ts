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
  requestInProgress = false;
  conditions = null;
  constructor(
    public navCtrl: NavController,
    private weatherService: WeatherService,
    private locationService: LocationService
    ) {  }

  getWeather(){
    console.log("getWeather");

   
    this.requestInProgress = true;
    this.conditions = null;
    this.weatherService.getCurrentConditions(this.zipCode)
      .subscribe(
        conditions=>{
          this.conditions = conditions;
          this.error = "";
          this.requestInProgress = false;
        }, 
        err=>{
          
          this.error = err;
          this.conditions = null;
          this.requestInProgress = false;
        }
      );
  }

  locate(){
    
    this.locationService.getLocation().then(loc=>{
      this.requestInProgress = true;
      this.conditions = null;
      this.weatherService.getCurrentConditionsByLatLng(loc.latitude,loc.longitude)
      .subscribe(
        conditions=>{
          this.conditions = conditions;
          this.error = "";
          this.requestInProgress = false;
        }, 
        err=>{
          
          this.error = err;
          this.conditions = null;
          this.requestInProgress = false;
        }
      );
    });
  }

  isLoading(){
    return this.requestInProgress;
  }
  showWeatherData(){
    return this.conditions != null; 
  }

}
