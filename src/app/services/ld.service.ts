import { Injectable } from '@angular/core';
import {EnginService} from "./engin.service";
import {GeneralService} from "./general.service";
import {EnginType, ItemDataType, FilterType, PageFilters, OramaItemDataType} from "../app.types";
import {DataService} from "./data.service";
import {SearchService} from "./search.service";
import {Results} from "@orama/orama";
import {ToastrService} from "ngx-toastr";
import {AdministrationService} from "./administration.service";

@Injectable({
  providedIn: 'root'
})
export class LdService {
  constructor(
    public enginService: EnginService,
    public generalService: GeneralService,
    public dataService: DataService,
    public searchService: SearchService,
    public notif: ToastrService,

    public administrationService: AdministrationService
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
    // Subscribe to search DB initialized
    this.searchService.$finishedLoadingDataFromCache.subscribe((value) => {
      this.updateFilteredData()
    })

  };

  // Filters as a string
  engin_type: string = "";
  search_value: string = "";
  enginNum_value: string = "";
  systeme: string = "";
  type: string = "";
  fav_engin: string = ""

  // Filters results as Objects
  favEnginObject: EnginType | undefined = undefined;
  filtersPage: PageFilters = {page: "ld"};

  // Grid values
  loading: boolean = false;
  availablePageSizes: number[] = [10, 15, 20, 40, 60]
  pageSize: number = 15

  // Data for grid
  filteredLDdata: OramaItemDataType[] | undefined = undefined;

  // Function executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    switch (variableName) {
      case "reset": {
        this.engin_type = "";
        this.search_value = "";
        this.enginNum_value = "";
        this.systeme = "";
        this.type = "";
        this.fav_engin = "";
        break;
      }
      case "fav_engin": {
        let num_engin = value.split("_")[1]
        this.fav_engin = value;
        if (value.split("_")[0] === "fav") { // If user select a favorite engin from his list
          this.favEnginObject = this.enginService.combinedTechFavEngins.engins_fav.find((item) =>
            item.engin_numero == num_engin)
        } else if (value.split("_")[0] === "technicentre") { // If user select a favorite engin from the technicentre list
          this.favEnginObject = this.enginService.combinedTechFavEngins.engins_technicentre.find((item) =>
            item.engin_numero == num_engin)
        } else { // If he unselect favorite engin
          this.enginNum_value = ""
          this.engin_type = ""
          return;
        }
        if (!this.favEnginObject?.engin_numero) {
          return;
        }
        this.enginNum_value = this.favEnginObject.engin_numero.toString()
        this.engin_type = this.favEnginObject.engin_type
        break;
      }
      default: { // TODO : See if there is here a XSS vulnerabilty or a usage
        (this as any)[variableName] = value
      }
    }

    if (variableName == "fav_engin") { // If there is a fav engin, handle it before preparing the filter
      this.filtersPage.engin_type = [this.engin_type]
    }

    this.searchService.prepareFilterObject(variableName, value, this.filtersPage, "ld")

    this.updateFilteredData()
  }

  async updateFilteredData() {
    let results = await this.searchService.searchDataForPage(this.filtersPage, this.search_value)
    if (results == undefined) {
      this.notif.error("Une erreur est survenue dans la recherche...", "Aïe...")
      return;
    }
    let results_purified: OramaItemDataType[] = this.searchService.purifyObjectIntoOramaItemDataType(results)
    this.filteredLDdata = results_purified
  }

}
