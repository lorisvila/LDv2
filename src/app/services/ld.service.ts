import { Injectable } from '@angular/core';
import {EnginService} from "./engin.service";
import {GeneralService} from "./general.service";
import {EnginType, ItemDataType, ShortcutType, SystemeType} from "../app.types";
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

  // Filters as a string
  engin_type: string = "";
  search_value: string = "";
  enginNum_value: string = "";
  systeme: string = "";
  favEngin: string = ""
  shortcut: string = "";

  // Filters results as Objects
  favEnginObject: EnginType | undefined = undefined;
  systemeObject: SystemeType | undefined = undefined;
  shortcutObject: ShortcutType | undefined = undefined;
  enginTypeObject: EnginType | undefined = undefined;

  // Function to reset all the filter elements
  reinitFormValues() {
    this.changeValueFilter("shortcut", "");
    this.changeValueFilter("systeme", "");
    this.changeValueFilter("engin_type", "");
    this.changeValueFilter("search_value", "");
    this.changeValueFilter("enginNum_value", "");
    this.changeValueFilter("fav_engin", "");
  }

  // Function executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    switch (variableName) {
      case "engin_type": {
        this.engin_type = value;
        this.enginTypeObject = {
          "engin": this.enginService.actual_engin,
          "engin_type": this.enginService.types_engin[this.enginService.actual_engin].filter((item) => item == value)[0]
        }
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
        this.systeme = value;
        this.systemeObject = this.dataService.systemesLD.filter((item) => item.systeme == value)[0]
        // [0] pour 1er élement de la liste au cas où il y aurait une erreur et plusieurs systemes matcheraient la value
        break;
      }
      case "shortcut": {
        this.shortcut = value;
        this.shortcutObject = this.dataService.shortcutsLD.filter((item) => item.shortcut == value)[0]
        // [0] pour 1er élement de la liste au cas où il y aurait une erreur et plusieurs shortcuts matcheraient la value
        break;
      }
      case "fav_engin": {
        this.favEngin = value;
        this.favEnginObject = this.enginService.combinedTechFavEngins.filter((item) => item.engin_numero == value)[0]
        // [0] pour 1er élement de la liste au cas où il y aurait une erreur et plusieurs engins favoris matcheraient la value
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
