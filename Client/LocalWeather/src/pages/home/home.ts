import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {WeatherService} from '../../services/weather.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ WeatherService ]
})
export class HomePage {
  error = "";
  zipCode = "";
  conditions = null;
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
          this.conditions = null;
        }
      );
  }

  showWeatherData(){
    return this.conditions != null; 
  }

}
