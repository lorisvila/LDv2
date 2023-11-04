import { Component } from '@angular/core';
import {VersionParamsService} from "../../services/version-params.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(public versionParams: VersionParamsService) {
  }

}
