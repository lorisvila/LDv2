import { Injectable } from '@angular/core';
import {GeneralService} from "./general.service";
import {EnginService} from "./engin.service";
import {DataService} from "./data.service";
import {ItemDataType, FilterType} from "../app.types";

// This module is nearly indentical than the doc fonction service ;
// the term "system" in this module refers to the formation

@Injectable({
  providedIn: 'root'
})
export class ModulesFormationService {

  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public dataService: DataService
  ) {
    // When the doc fonction page start show the elements in the grid
    this.updateFilteredData()
    // Subscribe to a change in the offline mode
    this.generalService.$offlineMode.subscribe((value) => {
      this.updateFilteredData()
    })
    // Subscribe to a change in the actual engin selected
    this.enginService.$actual_engin.subscribe((value) => {
      this.updateFilteredData()
    })
  }

  // Filters and selection
  search_value: string = "";
  systeme: string = "";
  systemes: FilterType[] = this.dataService.filters.filter((item) => item.page == 'modulesFormation' && item.type == 'systeme') // TODO : Rajouter la synchro des systemes quand la var globale des système s'update
  systemesSelectedGridValues: [] = [] // used to reinit values, not used to see what is selected...

  // List Item params
  loading: boolean = false;

  // Methode executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    console.log("Change variable ", variableName, " to value ", value)
    switch (variableName) {
      case "search_value": {
        this.search_value = value;
        break;
      }
      case "systeme": {
        if (value.detail?.row.selected) { // Select 1 item (from grid)
          // Bug on the wcs-core grid element, return a state selected to "true" even when deselect
          this.systeme = value.detail.row.data.filter
        } else { // Select all items (from button)
          // Déselectionner le grid si "Tout afficher"
          if (value == ""){this.systemesSelectedGridValues = []}

          this.systeme = ""
        }
        break;
      }
    }
    this.updateFilteredData()
  }

  updateFilteredData() {
    // Add data in the var
    let data: ItemDataType[] = []
    if (this.generalService.offlineMode) {
      data = this.dataService.allItemsData.filter((item) => item.page == "modulesFormation") // Add local data
      this.loading = false
    } else if (!this.generalService.offlineMode) {
      data = this.dataService.allItemsData.filter((item) => item.page == "modulesFormation") // TODO : Ajouter les données du serveur SQL
      this.loading = false // TODO : A passer a true quand l'implémentation SQL sera faite
    }
    // use only data for the engin
    data = data.filter((item) => item.engin == this.enginService.actual_engin.engin)

    switch (this.systeme) {
      case "": { // Case to not show any docs
        data = [];
        break;
      }
      default: {
        //data = data.filter((item) => this.systeme.includes(item.systeme)) TODO : See if it bugs, I removed this line because system is possibly undefined now...
      }
    }
    if (this.search_value != "") {} // TODO : Add the filtering by text

    this.filteredModulesFormation = data
  }

  filteredModulesFormation: ItemDataType[] = []

}
