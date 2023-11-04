import { Component } from '@angular/core';
import {VersionParamsService} from "../../services/version-params.service";
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent {

  constructor(public versionParams: VersionParamsService) {
  }

}
