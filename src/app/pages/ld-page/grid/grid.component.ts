import { Component } from '@angular/core';
import {EnginService} from "../../../services/engin.service";
import {LdService} from "../../../services/ld.service";
import {GeneralService} from "../../../services/general.service";
import {AdministrationService} from "../../../services/administration.service";

@Component({
  selector: 'ld-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {

  constructor(
    public enginService: EnginService,
    public ldService: LdService,
    public generalService: GeneralService,
    public administrationService: AdministrationService
  ) {

  }

  protected readonly Number = Number;
  protected readonly parseInt = parseInt;
}
