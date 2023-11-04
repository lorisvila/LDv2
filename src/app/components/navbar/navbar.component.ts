import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Import the variables and initialise with constructor
  constructor(
    public enginService: EnginService
  ) {
  }

  // Set the variables
  engins: string[] = this.enginService.engins
  actual_engin: string = this.enginService.actual_engin

  changeEngin(engin: string) {
    this.enginService.changeActualEngin(engin)
  }

}


