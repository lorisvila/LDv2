import {insertMultiple, create, search, Orama, Results, Result} from "@orama/orama";
import {EventEmitter, Injectable} from '@angular/core';
import {AppEnginType, ItemDataType, OramaItemDataType, PageFilters} from "../app.types";
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchDB: undefined | Promise<Orama<any>> = undefined; // I put any in the DB type because it is already checked in the import method
  searchedObjects: OramaItemDataType[] | undefined = undefined;
  searchValue: string  | undefined = undefined;

  $finishedLoadingDataFromCache: EventEmitter<boolean> = new EventEmitter<boolean>();
  finishedLoadingDataFromCache: boolean = false;

  actualEngin: AppEnginType = this.dataService.engins[0] // TODO : Try to find a way to set the default to the same "Basic choice" of engin as the engin service class
  $actualEngin: EventEmitter<AppEnginType> = new EventEmitter<AppEnginType>();

  constructor(
    public dataService: DataService,
    public notif: ToastrService,
    public router: Router
  ) {
    // Create the Orama DB for searching
    this.searchDB = this.createSearchDB()

    // Update the search DB when fetching data from LocalStorage or SQL is finished
    this.$finishedLoadingDataFromCache.subscribe((value) => {
      this.finishedLoadingDataFromCache = value
      if (this.finishedLoadingDataFromCache && this.searchDB) { // Check if the message is send to a true state and if Search DB already exists
        this.searchDB = this.updateItemDB()
      }
    })
    this.$actualEngin.subscribe((engin) => {
      this.actualEngin = engin
      if (this.finishedLoadingDataFromCache && this.searchDB) {
        this.searchDB = this.updateItemDB()
        if (!router.url.startsWith("/recherche")) {return;} // If the user is not in the search page : skip
        if (this.searchedObjects) {
          this.searchIntoWebSite(this.searchValue)
        }
      }
    })

  }

  async createSearchDB(): Promise<Orama<any>> {
    let format = await create({
      schema: {
        id: 'string',
        page: 'string',
        name: 'string',
        engin: 'string',
        engin_type: 'string[]',
        ref_main: 'string',
        meta: this.dataService.filterTypes.reduce((acc, { type }) => ({ ...acc, [type]: { filter: "string", filter_formatted: "string" } }), {}),
        tags: 'string[]'
      },
      components: {
        tokenizer: {stemming: true, language: "english"} // TODO : Add the french stemmer
      }
    })
    return format
  }

  async updateItemDB(data?: ItemDataType[]): Promise<Orama<any>> {
    let allData: ItemDataType[]

    // Filter only actual engin
    if (data) {
      allData = (JSON.parse(JSON.stringify(data)) as ItemDataType[]).filter((item) => item.engin === this.actualEngin.engin)
    } else {
      allData = (JSON.parse(JSON.stringify(this.dataService.allItemsData)) as ItemDataType[]).filter((item) => item.engin === this.actualEngin.engin)
    }

    // Convert the id of the item to a string because Orama doesn't like it as a number..., DONT ASK WHY !!!
    allData.forEach((item: any) => item.id = item.id.toString()) // Force the type to any to prevent type error "int -> string"

    // Convert the filters to a dict like object for orama -> It cannot process array of objects
    allData.forEach((item: ItemDataType) => {
      let newMeta: { [Name: string]: { filter: string, filter_formatted: string } } = {}
      item.meta?.forEach((filter) => {
        newMeta[filter.type] = {filter: filter.filter, filter_formatted: filter.filter_formatted}
      })
      item.meta = (newMeta as any)
    })

    let db: Promise<Orama<any>> = this.createSearchDB()
    await insertMultiple(await db, allData).catch((error) => {
      this.notif.error("Erreur lors de l'importation des données dans la base de données", "Aïe...")
      console.error("Erreur lors de l'importation des données dans la Item DB\n", error)
      return db;
    })
    return await db;
  }

  async searchInDB(db: Orama<any>, filters?: PageFilters, searchValue?: string): Promise<Results<any>> {
    let searchParams: any = {}
    if (searchValue) {searchParams.term = searchValue}
    if (filters) {searchParams.where = filters}
    searchParams.limit = 10000 // TODO : Implement this limit from the API --> Prevent a number doc size limit by the frontend
    let data = await search(await db, searchParams);
    console.log("Searched", data, searchParams)
    return data
  }

  purifyObjectIntoOramaItemDataType(results: Results<any>): OramaItemDataType[] {
    if (results.hits.length > 0) {
      let returnList: OramaItemDataType[] = []
      // J'utilise la function filter pour rajouter le score dans l'objet, c'est pas propre mais... ça marche
      results.hits.filter((item) => item.document.score = item.score)
      results.hits.forEach((item: Result<any>) => returnList.push(item.document))
      return (returnList as OramaItemDataType[])
    } else {
      return []
    }
  }


  // TODO : Remove this function
  prepareFilterObject(variableName: string, value: string, filterObject: PageFilters, page: string) {
    // Handle the different cases for preparing the filter object for Orama search
    if (variableName == "reset") { // If I want to reset the search
      filterObject = {page: page}
    } else if (["enginNum_value", "search_value", "fav_engin"].includes(variableName)) { // Do nothing if it is a search, engin num or fav_engin
    } else if (this.dataService.filterTypes.find(type => type.type == variableName)) { // If the filter is systeme or type --> nest it into the filter parameter
      if (value !== "") {
        (filterObject as any)["meta." + variableName + ".filter"] = value
      } else { // And delete it if unselected
        delete (filterObject as any)["meta." + variableName + ".filter"]
      }
    } else if (value === "") { // Delete the property from the filter if it is unselected
      delete (filterObject as any)[variableName]
    } else { // If any of the other options are completed (normally not used...)
      (filterObject as any)[variableName] = value
    }
  }

  async searchIntoWebSite(search: string | number | null | undefined) {

    this.searchedObjects = []
    let data: any = undefined

    if (typeof search == "string" && this.searchDB) {
      this.searchValue = search
      data = await this.searchInDB(await this.searchDB, {"engin": this.actualEngin.engin}, search)
    } else {
      this.notif.error("Erreur lors de la recherche", "Aïe...")
      console.error("Erreur lors de la recherche... car soit search value n'est pas string ou la DB n'existe pas encore")
    }

    if (this.router.url !== "/recherche") { // Redirect user if not on the search page
      this.router.navigate(["/recherche"])
    }

    if (data) {
      this.searchedObjects = this.purifyObjectIntoOramaItemDataType(data)
    } else {
      this.notif.error("Erreur lors de l'affichage des données de recherche...", "Aïe...")
      console.error("Erreur lors de l'affichage des donneés de recherche...")
    }

  }

  purifyFilters(filters: any) {
    let searchValue = undefined
    if (filters.hasOwnProperty("recherche")) {
      searchValue = filters.recherche
      delete filters.recherche
    }
    if (filters.meta) {
      Object.keys(filters.meta).forEach(key => {
        filters['meta.' + key + '.filter'] = filters.meta[key]
      })
      delete filters.meta
    }
    Object.keys(filters).forEach((filter: any) => {
      (this.dataService.doc_fields_to_remove.includes(filter) || filters[filter] == '') ? delete filters[filter] : undefined
    })
    return {filters, searchValue}
  }

  async searchDataForPage(ngxFormObjectFilters: any) {
    if (this.searchDB) {
      let {filters, searchValue} = this.purifyFilters(ngxFormObjectFilters)
      return await this.searchInDB(await this.searchDB, filters, searchValue)
    } else {
      this.notif.error("La base de donnée de recherche n'a pas été initialisée...")
      return
    }
  }

}
