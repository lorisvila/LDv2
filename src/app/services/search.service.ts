import {insertMultiple, create, search, Orama, Results, Result} from "@orama/orama";
import {EventEmitter, Injectable} from '@angular/core';
import {APIresponseAllTables, ItemDataType, OramaItemDataType, PageFilters} from "../app.types";
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchDB: undefined | Promise<Orama<any>> = undefined; // I put any in the DB type because it is already checked in the import method
  searchedObjects: any = undefined;
  searchValue: string  | undefined = undefined;

  actual_engin: string | undefined = undefined;
  $actual_engin: EventEmitter<string> = new EventEmitter<string>()

  $finishedLoadingDataFromCache: EventEmitter<boolean> = new EventEmitter<boolean>();
  finishedLoadingDataFromCache: boolean = false;

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
    this.$actual_engin.subscribe(() => {
      if (this.finishedLoadingDataFromCache && this.searchDB) {
        this.searchDB = this.updateItemDB()
        if (!router.url.startsWith("/recherche")) {return;}
        if (this.searchedObjects) {
          this.searchIntoWebSite(this.searchValue)
        }
      }
    })

  }

  async createSearchDB(): Promise<Orama<any>> {
    return await create({
      schema: {
        id: 'string',
        page: 'string',
        des: 'string',
        engin: 'string',
        engin_type: 'string[]',
        ref_main: 'string',
        url_main: 'string',
        ref_aux: 'string',
        url_aux: 'string',
        url_main_file: 'string',
        url_aux_file: 'string',
        systeme: {
          filter: "string",
          filter_formatted: "string"
        },
        type: {
          filter: "string",
          filter_formatted: "string"
        }
      },
      components: {
        tokenizer: {stemming: true, language: "english"} // TODO : Add the french stemmer
      }
    })
  }

  async updateItemDB(data?: ItemDataType[]): Promise<Orama<any>> {
    let allData: any[]
    if (data) {
      allData = data
    } else {
      allData = JSON.parse(JSON.stringify(this.dataService.allItemsData)) // Copy the list instead of linking it, not the best way but it works
    }
    // Filter only actual engin
    allData = allData.filter((item) => item.engin === this.actual_engin)

    // Convert the id of the item to a string because Orama doesn't like it as a number..., DONT ASK WHY !!!
    allData.forEach((item: any) => item.id = item.id.toString())

    // Add the human formatted filter to the object systeme and type to be able to search it
    allData.forEach((objectItem) => objectItem.systeme
      ? objectItem.systeme = {
        filter: objectItem.systeme,
        filter_formatted: this.dataService.filters.find((filterItem) => filterItem.filter == objectItem.systeme)?.filter_formatted}
      : objectItem.systeme = {
        filter: "",
        filter_formatted: ""
      })
    allData.forEach((objectItem) => objectItem.type
      ? objectItem.type = {
        filter: objectItem.type,
        filter_formatted: this.dataService.filters.find((filterItem) => filterItem.filter == objectItem.type)?.filter_formatted}
      : objectItem.type = {
        filter: "",
        filter_formatted: ""
      })

    let db: Promise<Orama<any>> = this.createSearchDB()
    await insertMultiple(await db, allData).catch((error) => {
      this.notif.error("Erreur lors de l'importation des données dans la base de données", "Aïe...")
      console.error("Erreur lors de l'importation des données dans la Item DB\n", error)
      return db;
    })
    return await db;
  }

  async searchInDB(db: Orama<any>, searchValue?: string, filters?: {}): Promise<Results<any>> {

    let searchParams: any = {}
    if (searchValue) {searchParams.term = searchValue}
    if (filters) {searchParams.where = filters}
    searchParams.limit = 400
    return await search(await db, searchParams);
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

  prepareFilterObject(variableName: string, value: string, filterObject: PageFilters) {
    // Handle the different cases for preparing the filter object for Orama search
    if (variableName == "reset") { // If I want to reset the search
      filterObject = {page: "ld"}
    } else if (["enginNum_value", "search_value", "fav_engin"].includes(variableName)) { // Do nothing if it is a search, engin num or fav_engin
    } else if (["systeme", "type"].includes(variableName)) { // If the filter is systeme or type --> nest it into the filter parameter
      if (value !== "") {
        (filterObject as any)[variableName + ".filter"] = value
      } else { // And delete it if unselected
        delete (filterObject as any)[variableName + ".filter"]
      }
    } else if (value === "") { // Delete the property from the filter if it is unselected
      delete (filterObject as any)[variableName]
    } else { // If any of the other options are completed (normally not used...)
      (filterObject as any)[variableName] = value
    }
    filterObject.engin = this.actual_engin
  }

  async searchIntoWebSite(search: string | number | null | undefined) {

    this.searchedObjects = []
    let data: any = undefined

    if (typeof search == "string" && this.searchDB) {
      data = await this.searchInDB(await this.searchDB, search, {"engin": this.actual_engin})
      this.searchValue = search
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

  async searchDataForPage(filters: PageFilters, searchValue: string) {
    if (this.searchDB) {
      return await this.searchInDB(await this.searchDB, searchValue, filters)
    } else {
      return undefined;
    }
  }

}
