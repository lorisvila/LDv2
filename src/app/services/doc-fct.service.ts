import {Injectable, IterableDiffers} from '@angular/core';
import {ItemDataType, FilterType, PageFilters, OramaItemDataType} from "../app.types";
import {GeneralService} from "./general.service";
import {EnginService} from "./engin.service";
import {DataService} from "./data.service";
import {SearchService} from "./search.service";
import {ToastrService} from "ngx-toastr";
import {Results} from "@orama/orama";

@Injectable({
  providedIn: 'root'
})
export class DocFctService {

  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public dataService: DataService,
    public searchService: SearchService,
    public notif: ToastrService
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
  systemes: FilterType[] = this.dataService.filters.filter((item) => item.page == 'docFct' && item.type == 'systeme') // TODO : Rajouter la synchro des systemes quand la var globale des système s'update
  systemesSelectedGridValues: [] = [] // used to reinit values, not used to see what is selected...
  filtersPage: PageFilters = {page: "docFct"};

  // List Item params
  loading: boolean = false;

  // Data for the item list
  filteredDocFctData: OramaItemDataType[] | undefined = undefined;

  // Methode executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    switch (variableName) {
      case "systeme": {
        if (value.detail?.row) { // Bug on the wcs-core grid element, return a state selected to "true" even when deselect --> Ticket already created
          this.systeme = value.detail.row.data.filter
          value = value.detail.row.data.filter
        } else {
          // Déselectionner le grid si "Tout afficher"
          // /!\ Bug possible si le filter est mal rentré et est "" (string vide)
          if (value == ""){this.systemesSelectedGridValues = []}

          this.systeme = value
        }
        break;
      }
      default: { // TODO : See if there is here a XSS vulnerabilty / Used by the search value filter
        (this as any)[variableName] = value
      }
    }

    this.searchService.prepareFilterObject(variableName, value, this.filtersPage, "docFct")

    this.updateFilteredData()
  }

  async updateFilteredData() {
    let results = await this.searchService.searchDataForPage(this.filtersPage, this.search_value)
    if (results == undefined) {
      this.notif.error("Une erreur est survenue dans la recherche...", "Aïe...")
      return;
    }
    let results_purified: OramaItemDataType[] = this.searchService.purifyObjectIntoOramaItemDataType(results)
    this.filteredDocFctData = results_purified
  }

}
