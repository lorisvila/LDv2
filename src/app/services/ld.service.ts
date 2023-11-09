import { Injectable } from '@angular/core';
import {EnginService} from "./engin.service";

@Injectable({
  providedIn: 'root'
})
export class LdService {
  constructor(
    public enginService: EnginService
  ) { };

  // Filters and selection
  shortcuts = {
    "showAll": "Tout afficher",
    "schemas_elec": "Schémas Electriques",
    "cde_ded": "Codes défauts"
  };
  shortcut: string = "showAll";

  engin_types = this.enginService.types_engin;
  engin_type: string = "";

  search_value: string = "";

  reinitFormValues() {
    console.log(this.shortcut, this.engin_type);
    this.changeValueFilter("shortcut", "showAll");
    this.changeValueFilter("engin_type", "");
    this.changeValueFilter("search_value", "");
    console.log(this.shortcut, this.engin_type);
  }
  changeValueFilter(variableName: string, value: any) {
    console.log("Change variable " + variableName + " to value " + value)
    switch (variableName) {
      case "shortcut": {
        this.shortcut = value;
        break;
      }
      case "engin_type": {
        this.engin_type = value;
        break;
      }
      case "search_value": {
        this.search_value = value;
        break;
      }
    }
  }

  // Grid values
  loading: boolean = false;
  availablePageSizes: number[] = [10, 20, 40, 60]
  pageSize: number = 40
  data:({id: string, des: string, type: string[], ref: string, ind: string, url: string})[] = [
    {
      "id": "1",
      "des": "Schémas de principe",
      "type": ["XGC", "BGC", "ZGC"],
      "ref": "LD 5 200 201",
      "ind": "N",
      //"url": "https://docmat.sncf.fr/#/search/053709431",
      "url": "https://docmat.sncf.fr/#/viewer/2323086/pdf/053709431"
    }, {
      "id": "2",
      "des": "Schémas de câblage motrice ZAC - à partir Z27513",
      "type": ["XGC", "BGC"],
      "ref": "05 3 721 348",
      "ind": "A",
      "url": "https://docmat.sncf.fr/#/viewer/2321210/pdf/053712348"
    }
  ]

}
