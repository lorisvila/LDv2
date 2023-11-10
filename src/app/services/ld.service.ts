import { Injectable } from '@angular/core';
import {EnginService} from "./engin.service";
import {GeneralService, LDdata} from "./general.service";
import {search, insertMultiple, create} from "@orama/orama";

@Injectable({
  providedIn: 'root'
})
export class LdService {
  constructor(
    public enginService: EnginService,
    public generalService: GeneralService
  ) {
    this.updateFilteredData()
    this.generalService.$offlineMode.subscribe((value) => {
      this.updateFilteredData()
    })
  };

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
    this.updateFilteredData()
  }

  updateFilteredData() {

    // Add data in the var
    let data: LDdata[] = []
    if (this.generalService.offlineMode) {
      data = this.data // Add local data
    } else if (!this.generalService.offlineMode) {
      data = this.data // Add data from server DataBase
    }

    // Filter the data
    if (this.shortcut != "showAll") {
      data = data.filter((item) => item.type == this.shortcut)
    }
    if (this.engin_type != "") {
      data = data.filter((item) => item.enginType.includes(this.engin_type))
    }
    if (this.search_value != "") {

    }

    // Add the data to the filtered values
    this.filteredData = data

  }

  // Grid values
  loading: boolean = false;
  availablePageSizes: number[] = [10, 20, 40, 60]
  pageSize: number = 40
  data: LDdata[] = [
    {
      "id": 1,
      "des": "Schémas de principe",
      "enginType": ["XGC", "BGC", "ZGC"],
      "ref": "LD 5 200 201",
      "ind": "N",
      "url_DocMat": "https://docmat.sncf.fr/#/viewer/2323086/pdf/053709431", //https://docmat.sncf.fr/#/search/053709431
      "url_File": "assets/files/LD/053709431_N",
      "type": "schemas_elec"
    }, {
      "id": 2,
      "des": "Schémas de câblage motrice ZAC - à partir Z27513",
      "enginType": ["XGC", "BGC"],
      "ref": "05 3 721 348",
      "ind": "A",
      "url_DocMat": "https://docmat.sncf.fr/#/viewer/2321210/pdf/053712348",
      "url_File": "", // assets/files/LD/053712348_A
      "type": "schemas_elec"
    }, {
      "id": 3,
      "des": "Schéma de principe pur AGC",
      "enginType": ["XGC", "BGC", "ZGC"],
      "ref": "05 3 709 431",
      "ind": "A",
      "url_DocMat": "https://docmat.sncf.fr/#/viewer/2321210/pdf/053712348",
      "url_File": "assets/files/LD/053709431_M",
      "type": "schemas_elec"
    }
  ]

  filteredData: LDdata[] = []

}
