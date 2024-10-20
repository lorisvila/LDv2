import { Injectable } from '@angular/core';
import {EnginService} from "./engin.service";
import {GeneralService} from "./general.service";
import {OramaItemDataType} from "../app.types";
import {DataService} from "./data.service";
import {SearchService} from "./search.service";
import {ToastrService} from "ngx-toastr";
import {AdministrationService} from "./administration.service";
import {UntypedFormGroup} from "@angular/forms";

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
      this.filterForm.reset()
      this.updateFilteredData()
    })
    // Subscribe to search DB initialized
    this.searchService.$finishedLoadingDataFromCache.subscribe((value) => {
      this.updateFilteredData()
    })

  };

  // Filters as a string
  engin_type: string = ""; // TODO : Remove those variables because they are not used anymore, however I am not sure, check it pls ;)
  search_value: string = "";
  enginNum_value: string = "";
  systeme: string = "";
  type: string = "";
  fav_engin: string = ""

  // NGX-Formly forms for the ld page
  filterForm: UntypedFormGroup = new UntypedFormGroup({})
  emptyFilterFormModel: any = {
    page: "ld"
  }
  filterFormModel: any = JSON.parse(JSON.stringify(this.emptyFilterFormModel))

  // Grid values
  loading: boolean = false;
  availablePageSizes: number[] = [10, 15, 20, 40, 60]
  pageSize: number = 15

  // Data for grid
  filteredLDdata: OramaItemDataType[] = [];

  async updateFilteredData() {
    let results = await this.searchService.searchDataForPage(JSON.parse(JSON.stringify(this.filterFormModel)))
    if (results == undefined) {
      this.notif.error("Une erreur est survenue dans la recherche...", "Aïe...")
      return;
    }
    let results_purified: OramaItemDataType[] = this.searchService.purifyObjectIntoOramaItemDataType(results)
    this.filteredLDdata = results_purified
  }

  async resetFilters() {
    this.filterFormModel = JSON.parse(JSON.stringify(this.emptyFilterFormModel))
    await this.updateFilteredData()
  }

}
