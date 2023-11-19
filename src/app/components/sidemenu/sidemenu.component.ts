import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent {

  constructor(public generalService: GeneralService) {
  }

}
