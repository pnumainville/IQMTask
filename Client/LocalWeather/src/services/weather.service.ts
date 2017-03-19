import { Injectable }               from '@angular/core';
import { Http, Response }           from '@angular/http';

import {CurrentConditions, Temperature} from './currentConditions';

import { Observable }               from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {
  private weatherUrl = 'http://localhost:3000/byZip/';  // URL to web API
  constructor (private http: Http) {

      this.extractData = this.extractData.bind(this);
  }
    getCurrentConditions(zipCode): Observable<CurrentConditions> {
        return this.http.get(this.weatherUrl + zipCode)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  private extractData(res: Response) {
    console.log("extract data from weather service");
    let body = res.json();

    var dateTime = this.convertEpoch(body.epochTime);
    return new CurrentConditions(
        body.locationName,
        new Temperature(body.temperature.metric.value,body.temperature.metric.unitLabel),
        new Temperature(body.temperature.metric.value,body.temperature.metric.unitLabel),
        dateTime, 
        body.iconIndex
    ); 

  }

  private convertEpoch(epochTime : number) : Date{
        var utcSeconds = epochTime;
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(utcSeconds);
        return d;
  }

  private handleError (error: Response | any) {
     console.log("handle error  called");
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      
      if (body){
        errMsg = body.message;
      }
      else{
        errMsg = `${error.status} - ${error.statusText || ''} ${body}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}