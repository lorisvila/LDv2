import {Injectable, IterableDiffers} from '@angular/core';
import {ItemDataType, FilterType} from "../app.types";
import {GeneralService} from "./general.service";
import {EnginService} from "./engin.service";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class DocFctService {

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
  selected_systeme: string = "";
  systemes: FilterType[] = this.dataService.filters.filter((item) => item.page == 'docFct' && item.type == 'systeme') // TODO : Rajouter la synchro des systemes quand la var globale des système s'update
  systemesSelectedGridValues: [] = [] // used to reinit values, not used to see what is selected...

  // List Item params
  loading: boolean = false;

  // Methode executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    console.log("Change variable " + variableName + " to value " + value)
    switch (variableName) {
      case "search_value": {
        this.search_value = value;
        break;
      }
      case "systeme": {
        if (value.detail.row.selected) { // Bug on the wcs-core grid element, return a state selected to "true" even when deselect
          this.selected_systeme = value.detail.row.data.filter
        } else {
          this.selected_systeme = ""
        }
        break;
      }
      case "systeme_all": {
        console.log(this.systemesSelectedGridValues)
        this.selected_systeme = "$all"
        this.systemesSelectedGridValues = []
      }
    }
    this.updateFilteredData()
  }

  updateFilteredData() {
    // Add data in the var
    let data: ItemDataType[] = []
    if (this.generalService.offlineMode) {
      data = this.dataService.allItemsData.filter((item) => item.page == "docFct") // Add local data
      this.loading = false
    } else if (!this.generalService.offlineMode) {
      data = this.dataService.allItemsData.filter((item) => item.page == "docFct") // TODO : Ajouter les données du serveur SQL
      this.loading = false // TODO : A passer a true quand l'implémentation SQL sera faite, le temps de reçevoir les données du serveur
    }
    // use only data for the engin
    data = data.filter((item) => item.engin == this.enginService.actual_engin)

    switch (this.selected_systeme) {
      case "$all": { break; } // Do nothing because I want to show all items
      case "": { // Case to not show any docs
        data = [];
        break;
      }
      default: {
        data = data.filter((item) => this.selected_systeme.includes(item.systeme))
      }
    }
    if (this.search_value != "") {} // TODO : Add the filtering by text

    this.filteredDocFctData = data
  }

  filteredDocFctData: ItemDataType[] = []

}
