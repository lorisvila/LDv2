import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {EnginService} from "../../services/engin.service";
import {LdService} from "../../services/ld.service";
import {DebugDataType} from "../../app.types";

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent {
  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public ldService: LdService
  ) { }

  // Modal Default Engin
  engins: string[] = Object.keys(this.enginService.types_engin)
  actual_engin: string = this.enginService.actual_engin
  setDefaultEngin(engin: string) {
    this.generalService.toggleModal("defaultEnginModal", false)
    this.enginService.changeDefaultEngin(engin)
  }

  // Modal Debug
  dataDebug: DebugDataType[] = [
    {
      "var": "showOfflineCard",
      "val": this.generalService.showOfflineCard
    },{
      "var": "showDefaultEnginModal",
      "val": this.generalService.showDefaultEnginModal
    },
  ]


}
