import { Component } from '@angular/core';
import {AdministrationService} from "../../../services/administration.service";
import {DataService} from "../../../services/data.service";
import {EnginService} from "../../../services/engin.service";

@Component({
  selector: 'app-gest-filtres',
  templateUrl: './gest-filtres.component.html',
  styleUrls: ['./gest-filtres.component.css']
})
export class GestFiltresComponent {

  constructor(
    public administrationService: AdministrationService,
    public dataService: DataService,
    public enginService: EnginService
  ) {
  }

}
