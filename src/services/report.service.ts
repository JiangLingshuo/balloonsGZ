import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable()
export class ReportService {
    private image: string = null
    private _window: any

    private currLocation: any
    private currAzimuth: number = 0

    // report data
    private azimuthWhenCapturing: number = 0
    private locationWhenCapturing: any
    private category: string = '11'
    private imageBase64: string = ''
    private description: string = ''

    constructor(private http: HttpClient) {
        this._window = window
    }
    /**
        *   Set private local variable "image", to hold the recieved image (as string)
        *   @returns {Boolean}
        */
    setImage(stringifiedImage) {
        this.image = stringifiedImage;

        return this.image == stringifiedImage;
    }

    /**
    *   Return the local variable image (as string)
    *   @returns {String}
    */
    getImage() {
        return this.image;
    }


    /**
     *  Watches user location for his report
     */
    checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(((position) => {
                this.currLocation = position.coords
                console.log(position.coords)
            }), (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("User denied the request for Geolocation.")
                        this.checkLocation()
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is unavailable.")
                        break;
                    case error.TIMEOUT:
                        alert("The request to get user location timed out.")
                        break;
                }
            })
        }
    }

    /**
 *  Watches user azimuth for his report
 */
    checkAzimuth() {
        // Check if device can provide absolute orientation data
        if ('DeviceOrientationAbsoluteEvent' in window) {
            window.addEventListener("DeviceOrientationAbsoluteEvent", (event: any) => {
                this.deviceOrientationHandler(event)
            })
        } // If not, check if the device sends any orientation data
        else if ('DeviceOrientationEvent' in window) {
            window.addEventListener("deviceorientation", (event: any) => {
                this.deviceOrientationHandler(event)
            });
        } // Send an alert if the device isn't compatible
        else {
            alert("Sorry, try again on a compatible mobile device!");
        }
    }

    deviceOrientationHandler(event: any) {
        //Check if absolute values have been sent
        if (typeof event.webkitCompassHeading !== "undefined") {
            this.currAzimuth = event.webkitCompassHeading; //iOS non-standard
        }
        else {
            this.currAzimuth = 360 - event.alpha
            // this.isRelativeAzimuth = true
        }
    }

    upload() {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        }

        let body = {
            'name': 'dunky-monkey',
            'lat': this.currLocation ? this.currLocation.latitude.toString() : '0',
            'lng': this.currLocation ? this.currLocation.longitude.toString() : '0',
            'imageBase64': this.imageBase64,
            'azimuth': this.azimuthWhenCapturing,
            'description': this.description,
            'category': '11',// TODO - balloon, kite, fire
            'userToken': localStorage.getItem('userToken')
        }

        this.http.post(`/api/report`, body, options).subscribe(data => {
            alert("עובדים על זה. תודה.")
        }, error => {
            alert(error.error.text)
        });
    }
}