import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {DataService} from "../../services/data.service";
import {EnginService} from "../../services/engin.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(
    public generalService: GeneralService,
    public dataService: DataService,
    public enginService: EnginService
    ) {
  }

}
