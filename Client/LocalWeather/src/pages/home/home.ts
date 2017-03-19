import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {WeatherService} from '../../services/weather.service';
import {CurrentConditions, Temperature} from '../../services/currentConditions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ WeatherService ]
})
export class HomePage {
  error = "";
  zipCode = "";
  conditions = new CurrentConditions(new Temperature(null,null),new Temperature(null,null),null,null);
  constructor(
    public navCtrl: NavController,
    private weatherService: WeatherService
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
          this.conditions = new CurrentConditions(new Temperature(null,null),new Temperature(null,null),null,null);
        }
      );

  }

  showWeatherData(){
    return this.conditions.metric.value != null; 
  }

}