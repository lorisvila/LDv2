import {Injectable} from '@angular/core';
import {FilterType, OramaItemDataType} from "../app.types";
import {GeneralService} from "./general.service";
import {EnginService} from "./engin.service";
import {DataService} from "./data.service";
import {SearchService} from "./search.service";
import {ToastrService} from "ngx-toastr";
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
  emptyFilterFormModel: any = {
    page: "docFct"
  }
  filterFormModel: any = JSON.parse(JSON.stringify(this.emptyFilterFormModel));

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
    return this.dataService.filters.filter((filter) => filter.type == 'fonction' && filter.engin == this.enginService.actual_engin.engin)
  }

  setAllCategoriesOfFonction() {
    const categories = this.filteredDocFctData
      ?.filter(doc => {
        // Check if the document has both 'fonction' and 'category' keys
        const hasFonction = doc?.meta?.hasOwnProperty('fonction');
        const hasCategory = doc?.meta?.hasOwnProperty('category');
        return hasFonction && hasCategory && (this.currentFonctionSelected ? doc.meta['fonction' as any].filter === this.currentFonctionSelected?.filter : true);
      })
      .map(doc => doc.meta['category' as any]) as FilterType[];

    // Filter out duplicates based on the 'filter' key
    const uniqueCategories = categories.filter((category, index, self) =>
      index === self.findIndex(c => c.filter === category.filter)
    );
    this.allCategoriesFromFonction = uniqueCategories
    this.filterFormModel = {...this.filterFormModel} // Replace the model to trigger a change in the UI
  }

  async resetFilters() {
    this.filterFormModel = JSON.parse(JSON.stringify(this.emptyFilterFormModel))
    await this.updateFilteredData()
  }

}
