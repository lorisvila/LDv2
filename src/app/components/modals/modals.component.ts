import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {EnginService} from "../../services/engin.service";

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent {
  constructor(
    public generalService: GeneralService,
    public enginService: EnginService
  ) { }

  // Modal Default Engin
  engins: string[] = Object.keys(this.enginService.types_engin)
  actual_engin: string = this.enginService.actual_engin
  setDefaultEngin(engin: string) {
    this.generalService.toggleModal("defaultEnginModal", false)
    this.enginService.changeDefaultEngin(engin)
  }


}
