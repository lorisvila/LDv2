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
  loading: boolean = false
  data: {[Name: string]: string}[] = [
    {
      "ref": "LD 5 200 201",
      "des": "Livret n°1",
      "url": "https://test.url"
    }, {
      "ref": "LD 5 200 202",
      "des": "Livret n°2",
      "url": "https://test.url"
    }
  ]

}
