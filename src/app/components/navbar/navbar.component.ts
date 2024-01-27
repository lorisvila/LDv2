import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {GeneralService} from "../../services/general.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../../services/search.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Import the variables and initialise with constructor
  constructor(
    public enginService: EnginService,
    public generalService: GeneralService,
    public router: Router,
    public searchService: SearchService,
    public dataService: DataService
  ) {
  }

  changeEngin(engin: string) {
    let selectedEnginsObject = this.enginService.returnAppEnginObjectFromString(engin)
    if (selectedEnginsObject) {
      this.enginService.changeActualEngin(selectedEnginsObject)
    }
  }

}


