import { Injectable } from '@angular/core';
import {EnginService} from "./engin.service";
import {GeneralService} from "./general.service";
import {ItemDataType, ShortcutType, SystemeType} from "../app.types";
import {create, insert, insertMultiple, Orama, Results, search, SearchParams, TypedDocument} from "@orama/orama";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class LdService {
  constructor(
    public enginService: EnginService,
    public generalService: GeneralService,
    public dataService: DataService
  ) {
    // When the LD page start show the elements in the grid
    this.updateFilteredData()
    // Subscribe to a change in the offline mode
    this.generalService.$offlineMode.subscribe((value) => {
      this.updateFilteredData()
    })
    // Subscribe to a change in the actual engin selected
    this.enginService.$actual_engin.subscribe((value) => {
      this.updateFilteredData()
    })
  };

  // Filters and selection
  engin_type: string = "";
  engin_types = this.enginService.types_engin;
  search_value: string = "";
  enginNum_value: string = "";
  systeme: string = "";
  systemes: SystemeType[] = this.dataService.systemesLD

  shortcut: string = "";
  shortcuts: ShortcutType[] = this.dataService.shortcutsLD

  // Function to reset all the filter elements
  reinitFormValues() {
    console.log(this.shortcut, this.engin_type);
    this.changeValueFilter("shortcut", "");
    this.changeValueFilter("systeme", "");
    this.changeValueFilter("engin_type", "");
    this.changeValueFilter("search_value", "");
    this.changeValueFilter("enginNum_value", "");
    console.log(this.shortcut, this.engin_type);
  }

  // Methode executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    console.log("Change variable " + variableName + " to value " + value)
    switch (variableName) {
      case "engin_type": {
        if (value == "tous") {
          value = ""
        }
        this.engin_type = value;
        break;
      }
      case "search_value": {
        this.search_value = value;
        break;
      }
      case "enginNum_value": {
        this.enginNum_value = value;
        break;
      }
      case "systeme": {
        if (value == "tous") {
          value = ""
        }
        this.systeme = value;
        break;
      }
      case "shortcut": {
        if (value == "tous") {
          value = ""
        }
        this.shortcut = value;
        break;
      }
    }
    this.updateFilteredData()
  }

  // Method to update the data list of documents for the document grid
  updateFilteredData() {

    // Add data in the var
    let data: ItemDataType[] = []
    if (this.generalService.offlineMode) {
      data = this.LDdata // Add local data
      this.loading = false
    } else if (!this.generalService.offlineMode) {
      data = this.LDdata // TODO : Ajouter les données du serveur SQL
      this.loading = false // TODO : A passer a true quand l'implémentation SQL sera faite
    }
    // use only data for the engin
    data = data.filter((item) => item.engin == this.enginService.actual_engin)

    // Filter the data
    if (this.systeme != "") {
      data = data.filter((item) => item.systeme == this.systeme)
    }
    if (this.shortcut != "") {
      data = data.filter((item) => item.type == this.shortcut)
    }
    if (this.engin_type != "") {
      data = data.filter((item) => item.engin_type.includes(this.engin_type))
    }
    if (this.search_value != "") {} // TODO : Add the filtering by text
    if (this.enginNum_value != "") {} // TODO : Add the filtering by train number

    // Add the data to the filtered values
    this.filteredLDdata = data

  }

  // Grid values
  loading: boolean = false;
  availablePageSizes: number[] = [10, 15, 20, 40, 60]
  pageSize: number = 15

  filteredLDdata: ItemDataType[] = []

  LDdata: ItemDataType[] = this.dataService.LDdata

}
