import { Component } from '@angular/core';
import {AdministrationService} from "../../../services/administration.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-donnees',
  templateUrl: './donnees.component.html',
  styleUrls: ['./donnees.component.css']
})
export class DonneesComponent {

  constructor(
    public administrationService: AdministrationService,
    public dataService: DataService,
  ) {}

}
