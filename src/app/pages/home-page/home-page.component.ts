import { Component, OnInit } from '@angular/core'
import {Router, ActivatedRoute, Params} from '@angular/router'
import { ReportService } from '../../../services/report.service'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [ReportService]
})
export class HomePageComponent implements OnInit {

  private reader: any = new FileReader()
  public imageBase64: string = null
  public location: any
  public currAzimuth: any
  public azimuthWhenCapturing: any
  public locationWhenCapturing: any
  
  constructor(private router: Router, private reportSrv: ReportService) {
    localStorage.setItem('userToken', window.location.href.split('entry=')[1])
  }

  ngOnInit() {
    this.reportSrv.checkLocation()
    this.reportSrv.checkAzimuth()
  }

  goToCaptureScreen() {
    this.router.navigate(['/capture']);
  }

  openCamera() {
    // activate camera
    document.querySelector('input').click();
  }

  captureImage(event) {
    if (event.target.files && event.target.files[0]) {
      this.reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.imageBase64 = event.target.result;

        // Hold the image in memory, to be used in the next state(route)
        this.reportSrv.setImage(this.imageBase64);

        // Move further, to next route
        this.goToCaptureScreen();
      }

      this.locationWhenCapturing = this.location;
      this.azimuthWhenCapturing = this.currAzimuth;
    }
  }
}
