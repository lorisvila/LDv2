import { Component } from '@angular/core';
import {AdministrationService} from "../../../services/administration.service";

@Component({
  selector: 'app-donnees',
  templateUrl: './donnees.component.html',
  styleUrls: ['./donnees.component.css']
})
export class DonneesComponent {

  constructor(
    public administrationService: AdministrationService
  ) {
  }

}
