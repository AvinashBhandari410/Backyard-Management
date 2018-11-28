import { Injectable } from "@angular/core";
import { ScriptStore } from "./script.store";

declare var document: any;

@Injectable({
    providedIn: 'root'
})
export class ScriptService {

    private scripts: any = {};

    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    load(...scripts: string[]) {
        var promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }

    loadScript(name: string) {
        return new Promise((resolve, reject) => {
            //resolve if already loaded
            if (this.scripts[name].loaded) {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            }
            else {
                //load script
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.scripts[name].src;
                if (script.readyState) {  //IE
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            this.scripts[name].loaded = true;
                            resolve({ script: name, loaded: true, status: 'Loaded' });
                        }
                    };
                } else {  //Others
                    script.onload = () => {
                        this.scripts[name].loaded = true;
                        resolve({ script: name, loaded: true, status: 'Loaded' });
                    };
                }
                script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        });
    }

    //https://medium.com/@balramchavan/using-async-await-feature-in-angular-587dd56fdc77
    // Using async-await feature in Angular
    geocodeAddress(address): any {

        return new Promise(resolve => {
            var geocoder = new google.maps.Geocoder();
            var latlng = new Array(2);
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    latlng[0] = results[0].geometry.location.lat();
                    latlng[1] = results[0].geometry.location.lng();
                    resolve(latlng);
                    //this._callback(latlng); 
                    //  callback(latlng); // call the callback function here
                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        });

    }

}