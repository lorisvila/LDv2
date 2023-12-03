import { Component } from '@angular/core';
import {DataService} from "../../../services/data.service";
import {GeneralService} from "../../../services/general.service";
import {EnginService} from "../../../services/engin.service";
import {DocFctService} from "../../../services/doc-fct.service";
import {AdministrationService} from "../../../services/administration.service";

@Component({
  selector: 'app-mod-elem',
  templateUrl: './mod-elem.component.html',
  styleUrls: ['./mod-elem.component.css']
})
export class ModElemComponent {

  constructor(
    public dataService: DataService,
    public generalService: GeneralService,
    public enginService: EnginService,
    public administrationService: AdministrationService
  ) {
  }

}
