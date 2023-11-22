import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {EnginService} from "../../services/engin.service";
import {ModulesFormationService} from "../../services/modules-formation.service";

@Component({
  selector: 'app-modules-formation-page',
  templateUrl: './modules-formation-page.component.html',
  styleUrls: ['./modules-formation-page.component.css']
})
export class ModulesFormationPageComponent {

  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public modulesFormationService: ModulesFormationService
  ) { }

}
