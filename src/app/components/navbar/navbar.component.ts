import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {GeneralService} from "../../services/general.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../../services/search.service";

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

  // Set the variables
  actual_engin: string = this.enginService.actual_engin

  changeEngin(engin: string) {
    this.enginService.changeActualEngin(engin)
  }

}


