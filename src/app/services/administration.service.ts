import {Injectable} from '@angular/core';
import {FilterType, ItemDataType} from "../app.types";
import {DataService} from "./data.service";
import {CommunicationService} from "./communication.service";
import {GeneralService} from "./general.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(
    public dataService: DataService,
    public communicationService: CommunicationService,
    public generalService: GeneralService,
    public notif: ToastrService
  ) {}

  // ################################### GLOBAL ###################################
  // Functions data element
  writeCachedDataToLocalStorage(fullData: ItemDataType[]) {
    this.communicationService.updateDataToStorage(this.generalService.cachedDataLocalStorageVarName, fullData)
    this.dataService.allItemsData = fullData
  }
  addElementToCacheLocalStorage(element: ItemDataType) {
    let data: ItemDataType[] = this.dataService.allItemsData
    // TODO : Add check if Object type is wright
    if (data !== null && data.length > 0){ // If the object is not empty
      if (data.filter((item) => // If the doc does not exist in list
        item.ref_main == element.ref_main ||
        item.url_main == element.url_main ||
        item.des == element.des).length > 0) {
        this.notif.warning("L'élement que vous essayer de créer existe déjà", "Aïe...")
        return;
      }
      let lastId = data[data.length - 1].id // Put the ID of the last element + 1
      let elementMod = element
      elementMod.id = lastId + 1
      data.push(elementMod)
    } else {
      this.notif.warning("Liste de data corrompue dans le Local Storage du navigateur", "Oups....")
      data = [element] // Si liste vide ou corrompue --> écraser par le nouvel élement seulement
    }
    this.writeCachedDataToLocalStorage(data)
    this.dataService.allItemsData = data
  }

  createObject(id:number, page: any, engin: any, typeEngin: string[],
               mainRef: any, auxRef: any, mainURL: any,
               auxURL: any, mainPath: any, auxPath: any,
               des: any, type: any, systeme: any) {
    // See if there is a missing value
    if (typeof mainURL  !== "string" || mainURL == "") {return null;} // TODO : Show a popup saying not correct...
    if (typeof des      !== "string" || des     == "") {return null;}
    if (typeEngin.length == 0) {return null;}
    if (page == "") {return null;}
    if (engin == "") {return null;}
    if (systeme == "") {return null;}

    // Create the item Object
    let element: ItemDataType = {
      id: id, //                   Temp ID for having a correct Object -> Shall not be pushed like that to DB
      des: des,
      systeme: systeme,
      //type: type,               OPTIONAL VALUE
      page: page,
      engin: engin,
      engin_type: typeEngin,
      ref_main: mainRef,
      //ref_aux: auxRef,          OPTIONAL VALUE
      url_main: mainURL,
      //url_aux: auxURL,          OPTIONAL VALUE
      //url_main_file: mainPath,  OPTIONAL VALUE
      //url_aux_file: auxPath     OPTIONAL VALUE
    }

    // Add the optional values if given
    if (typeof type     === "string" && type      != "") { element["type"] = type }
    if (typeof auxRef   === "string" && auxRef    != "") { element["ref_aux"] = auxRef }
    if (typeof auxURL   === "string" && auxURL    != "") { element["url_aux"] = auxURL }
    if (typeof mainPath === "string" && mainPath  != "") { element["url_main_file"] = mainPath }
    if (typeof auxPath  === "string" && auxPath   != "") { element["url_aux_file"] = auxPath }

    return element;
  }

  // Functions filter elements
  writeFiltersToLocalStorage(fullData: FilterType[]) {
    this.communicationService.updateDataToStorage(this.generalService.filtersLocalStorageVarName, fullData)
    this.dataService.filters = fullData
  }
  addFilterLocalStorage(filter: FilterType) {
    let filters: FilterType[] = this.dataService.filters
    if (filters.filter((item) => // If filter already exists
      item.filter == filter.filter ||
      item.filter_formatted == filter.filter_formatted).length !== 0) {
      this.notif.warning("Le filtre que vous essayer de créer existe déjà", "Aïe...")
      return;
    }
    if (filters.length > 0){ // If the object is not empty
      filters.push(filter)
    } else {
      this.notif.warning("Liste filters corrompue dans le Local Storage du navigateur", "Oups....")
      filters = [filter] // Si liste vide ou corrompue --> écraser par le nouvel élement
    }
    this.writeFiltersToLocalStorage(filters)
    this.dataService.filters = filters
  }
  createFilter(filter: string, filter_formatted: string, page: string, type: string): FilterType | null {
      if (filter === "" || filter_formatted === "" || page === "" || type === "") {
        this.notif.error("L'élement que vous essayer de créer n'est pas valable...", "Aïe...")
        return null;
      } else {
        return {
          filter_formatted: filter_formatted,
          filter: filter,
          page: page,
          type: type
        };
      }
  }

  // ################################### Modification Doc FORM ###################################
  // Variables
  actualPageSelectedModPage: string = "";
  dataGridDocumentsModPage: ItemDataType[] = [];
  selectedDocumentModPage: ItemDataType | null = null;

  valuePageModPage: string = "";
  valueEnginModPage: string = "";
  valueTypeEnginModPage: string = "";
  valueSystemeModPage: string | number | null | undefined = "";
  valueTypeModPage: string | number | null | undefined = "";
  valueDesignationModPage: string | number | null | undefined = "";
  valueRefPrincipaleModPage: string | number | null | undefined = "";
  valueRefAuxiliaireModPage: string | number | null | undefined = "";
  valueMainURLModPage: string | number | null | undefined = "";
  valueAuxURLModPage: string | number | null | undefined = "";
  valueMainPathModPage: string | number | null | undefined = "";
  valueAuxPathModPage: string | number | null | undefined = "";

  // Functions
  changeActualPageSelectedPageMod(page: string) {
    this.actualPageSelectedModPage = page;
    this.dataGridDocumentsModPage = this.dataService.allItemsData.filter((item) => item.page == page);
    this.selectedDocumentModPage = null; // TODO : Remettre à null le document sélectionné car le choix page à changé donc doc dans la grid aussi
  }
  selectDocumentPageMod(event: any) {
    this.selectedDocumentModPage = event.detail.row.data
  }
  modElementFromDB(page: any, engin: any, typeEngin: string[],
                   mainRef: any, auxRef: any, mainURL: any,
                   auxURL: any, mainPath: any, auxPath: any,
                   des: any, type: any, systeme: any) {

    let id = this.selectedDocumentModPage?.id
    if (id == undefined) {
      this.notif.error("Un problème avec l'id de l'élement est survenu...")
      return ;
    }
    let index = this.dataService.allItemsData.indexOf(this.dataService.allItemsData.filter((item) => item.id == id)[0])
    let new_element = this.createObject(id ,page, engin, typeEngin, mainRef, auxRef, mainURL, auxURL, mainPath, auxPath, des, type, systeme)
    if (new_element !== null) {
      this.dataService.allItemsData.splice(index, 1, new_element)
      this.writeCachedDataToLocalStorage(this.dataService.allItemsData)
      this.notif.success("Document " + new_element.ref_main + " a bien été modifié", "C'est bon !")
    } else { // Catch error
      this.notif.error("Un problème avec l'élément crée dans la fonction est survenu...")
    }
  }

  // ################################### Add Doc FORM ###################################
  // Variables
  valuePageAddPage: string = "";
  valueEnginAddPage: string = "";
  valueTypeEnginAddPage: string = "";
  valueSystemeAddPage: string | number | null | undefined = "";
  valueTypeAddPage: string | number | null | undefined = "";
  valueDesignationAddPage: string | number | null | undefined = "";
  valueRefPrincipaleAddPage: string | number | null | undefined = "";
  valueRefAuxiliaireAddPage: string | number | null | undefined = "";
  valueMainURLAddPage: string | number | null | undefined = "";
  valueAuxURLAddPage: string | number | null | undefined = "";
  valueMainPathAddPage: string | number | null | undefined = "";
  valueAuxPathAddPage: string | number | null | undefined = "";

  // Functions
  addElementToDB(page: any, engin: any, typeEngin: string[],
                 mainRef: any, auxRef: any, mainURL: any,
                 auxURL: any, mainPath: any, auxPath: any,
                 des: any, type: any, systeme: any) {

    let element = this.createObject(0, page, engin, typeEngin, mainRef, auxRef, mainURL, auxURL, mainPath, auxPath, des, type, systeme)
    if (element !== null) {
      this.addElementToCacheLocalStorage(element)
      this.notif.success("Le document " + element.ref_main + " a bien été crée", "C'est bon !")
    }
  }
  reinitFieldsPageAdd() {
    this.valueEnginAddPage = "";
    this.valueTypeEnginAddPage = "";
    this.valueSystemeAddPage = "";
    this.valueTypeAddPage= "";
    this.valueDesignationAddPage= "";
    this.valueRefPrincipaleAddPage= "";
    this.valueRefAuxiliaireAddPage= "";
    this.valueMainURLAddPage= "";
    this.valueAuxURLAddPage= "";
    this.valueMainPathAddPage= "";
    this.valueAuxPathAddPage= "";
  }

  // ################################### Modification Doc FORM ###################################
  // Variables
  exportTextAreaVarDoneesPage = "";
  importTextAreaVarDoneesPage = "";

  // Function
  updateExportTextArea() {
    this.exportTextAreaVarDoneesPage = JSON.stringify(this.dataService.allItemsData)
  }
  importFromImportTextArea(stringified_object: string | null | undefined) {
    if (stringified_object === null || stringified_object === undefined || stringified_object === "") {
      this.notif.error("Le texte importé est vide", "Erreur...")
      return;
    }
    let userObject: ItemDataType[] = JSON.parse(stringified_object) // Créer l'objet depuis le JSON en texte
    if (typeof userObject != "object") {
      this.notif.error("L'objet n'est pas une liste", "Erreur...")
      return;
    }
    let incorrectItems = userObject.filter((item) => item.page == "" || item.id == null ||
                                    item.ref_main == "" || item.des == "" || item.ref_main == "" || item.url_main == "")
    if (incorrectItems.length > 0) {
      this.notif.error("Un des élement de l'objet donné est incorrect", "Erreur...")
    }
    this.writeCachedDataToLocalStorage(userObject)
    this.notif.success("L'objet de " + userObject.length + " élement(s) a été crée", "C'est bon !")
  }

  // ################################### Filters FORM ###################################
  // Variables filters globales
  actualFilterSelectedFilterPage: string | null = null
  pageSelectedFiltersPage: string | null = null

  // Variables filters systemes
  systemeSelectedFilterPage: string | null = null

  // Functions
  changeFilterSystemeOrType(newNameSQL: string | number | null | undefined, newNameHuman: string | number | null | undefined) {
    if (this.pageSelectedFiltersPage == null || this.actualFilterSelectedFilterPage == null ||
      typeof newNameSQL !== "string" || typeof newNameHuman !== "string") {
      this.notif.warning("Vous essayer d'executer une fonction sans tous ses paramètres ou avec des paramètres invalides...", "Oups...")
      return;
    }
    let oldObject = this.dataService.filters.filter((item) =>
      item.page == this.pageSelectedFiltersPage &&
      item.filter == this.systemeSelectedFilterPage)[0]
    let index = this.dataService.filters.indexOf(oldObject)
    let filters = this.dataService.filters
    let newObject = this.createFilter(newNameSQL, newNameHuman, this.pageSelectedFiltersPage, this.actualFilterSelectedFilterPage)
    if (newObject == null) {
      return;
    }
    filters.splice(index, 1, newObject)
    this.writeFiltersToLocalStorage(filters)
    console.log(filters)
  }

}
