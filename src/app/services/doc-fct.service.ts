import {Injectable, IterableDiffers} from '@angular/core';
import {ItemDataType, FilterType, PageFilters, OramaItemDataType} from "../app.types";
import {GeneralService} from "./general.service";
import {EnginService} from "./engin.service";
import {DataService} from "./data.service";
import {SearchService} from "./search.service";
import {ToastrService} from "ngx-toastr";
import {Results} from "@orama/orama";
import {UntypedFormGroup} from "@angular/forms";

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
    this.updateFilteredData().then(() => {
      this.setAllCategoriesOfFonction()
    })
    // Subscribe to a change in the offline mode
    this.generalService.$offlineMode.subscribe((value) => {
      this.updateFilteredData().then(() => {
        this.setAllCategoriesOfFonction()
      })
    })
    // Subscribe to a change in the actual engin selected
    this.enginService.$actual_engin.subscribe((value) => {
      this.updateFilteredData().then(() => {
        this.setAllCategoriesOfFonction()
      })
    })
    // Subscribe to search DB initialized
    this.searchService.$finishedLoadingDataFromCache.subscribe((value) => {
      this.updateFilteredData().then(() => {
        this.setAllCategoriesOfFonction()
      })
    })
  }

  // Data for the item list
  filteredDocFctData: OramaItemDataType[] | undefined = undefined;

  // NGX-Formly forms for the DocFct page
  filterForm: UntypedFormGroup = new UntypedFormGroup({})
  filterFormModel: any = {
    page: "docFct"
  }

  currentFonctionSelected: FilterType | undefined = undefined
  allCategoriesFromFonction: FilterType[] = []

  async updateFilteredData() {
    let results = await this.searchService.searchDataForPage(JSON.parse(JSON.stringify(this.filterFormModel)))
    if (results == undefined) {
      this.notif.error("Une erreur est survenue dans la recherche...", "Aïe...")
      return;
    }
    let results_purified: OramaItemDataType[] = this.searchService.purifyObjectIntoOramaItemDataType(results)
    this.filteredDocFctData = results_purified
    return
  }

  get allFonctions() {
    return this.dataService.filters.filter((filter) => filter.type == 'fonction')
  }

  setAllCategoriesOfFonction() {
    console.log('Hehe', this.currentFonctionSelected ? 'true' : 'false')
    const categories = this.filteredDocFctData
      ?.filter(doc => this.currentFonctionSelected ? doc.meta['fonction' as any].filter === this.currentFonctionSelected?.filter : true)
      .map(doc => doc.meta['category' as any]) as FilterType[];

    // Filter out duplicates based on the 'filter' key
    const uniqueCategories = categories.filter((category, index, self) =>
      index === self.findIndex(c => c.filter === category.filter)
    );
    this.allCategoriesFromFonction = uniqueCategories
    this.filterFormModel = {...this.filterFormModel} // Replace the model to trigger a change in the UI
  }

}
