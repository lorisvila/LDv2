import { Component } from '@angular/core';
import {DataService} from "../../../services/data.service";
import {GeneralService} from "../../../services/general.service";
import {EnginService} from "../../../services/engin.service";
import {AdministrationService} from "../../../services/administration.service";

@Component({
  selector: 'app-add-elem',
  templateUrl: './add-elem.component.html',
  styleUrls: ['./add-elem.component.css']
})
export class AddElemComponent {

  constructor(
    public dataService: DataService,
    public generalService: GeneralService,
    public enginService: EnginService,
    public administrationService: AdministrationService
  ) {
  }

}
