import {Geolocation} from 'ionic-native';


export class LocationService {


    getLocation() : Promise<any> {
        var p = new Promise((resolve,reject)=>{
            Geolocation.getCurrentPosition().then(pos => {
                console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
                resolve({latitude: pos.coords.latitude,longitude: pos.coords.longitude});
            });
        });
        return p;
    }

}