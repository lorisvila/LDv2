import {Injectable} from '@angular/core';
import {API_ResponseType, FilterType, ItemDataType} from "../app.types";
import {DataService} from "./data.service";
import {CommunicationService} from "./communication.service";
import {GeneralService} from "./general.service";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";
import {EnginService} from "./engin.service";

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(
    public dataService: DataService,
    public communicationService: CommunicationService,
    public generalService: GeneralService,
    public notif: ToastrService,
    public enginService: EnginService
  ) {
    this.checkToken()

    // Refresh the documents in the mod elem page when engin changes
    this.enginService.$actual_engin.subscribe((engin) => this.changeActualPageSelectedPageMod(this.actualPageSelectedModPage))
  }

  // ################################### GLOBAL ###################################
  auth_user: string | undefined  = ""
  auth_password: string | undefined = ""
  auth_message: string | undefined = ""
  auth_status: boolean = false
  auth_pending: boolean = false // True when the auth request is up

  // Function to check the token in localStorage
  checkToken() {
    let token = this.communicationService.getDataFromStorage('token')
    if (token) {
      let requestObject = {"token": token}
      let endpoint = this.communicationService.API_Endpoint_checkToken
      let request = this.communicationService.requestToAPI("POST", endpoint, requestObject)
      request.subscribe((response) => {
        let responseObject = (response as API_ResponseType)
        if (responseObject.status.code == 200) {
          this.auth_status = true
          this.auth_user = responseObject.data.username
          this.communicationService.API_token = token
        } else {
          this.notif.warning(responseObject.status.message)
          this.communicationService.deleteDataFromStorage("token")
        }
      }, (error) => {
        let responseObject = (error.error as API_ResponseType)
        this.notif.warning(responseObject.status.message)
        this.communicationService.deleteDataFromStorage("token")
      })
    }
  }

  // Function to authentificate user from the API
  authentificateUser(user: string | number | null | undefined, password: string | number | null | undefined) {
    if (user && password && typeof user == "string" && typeof password == "string") {
      this.auth_user = user
      this.auth_password = password
      this.auth_pending = true
      let requestObject = {"username": user, "password": password}
      let endpoint = this.communicationService.API_Endpoint_authConnect
      let request = this.communicationService.requestToAPI("POST", endpoint, requestObject)
      request.subscribe((response) => {
        let responseObject = (response as API_ResponseType)
        if (responseObject.status.code == 200) {
          this.communicationService.updateDataToStorage('token', responseObject.token)
          this.communicationService.API_token = responseObject.token
          this.generalService.toggleModal('authConnect', false)
          this.auth_status = true
          this.auth_message = undefined
          this.auth_pending = false
        }
      }, (error) => {
        error = error as HttpErrorResponse
        let responseObject = (error.error as API_ResponseType)
        if (responseObject.status) {
          this.auth_message = responseObject.status.message
        } else {
          this.auth_message = "Une erreur est survenue lors de la requête..."
        }
        this.auth_pending = false
      })
    } else {
      this.notif.warning("Veuillez remplir le champ utilisateur et mot de passe...")
    }
  }
  disconnectUser() {
    this.auth_status = false
    this.auth_password = undefined
    this.auth_user = undefined
    this.communicationService.deleteDataFromStorage('token')
  }

  // Functions data element
  writeCachedDataToLocalStorage(fullData: ItemDataType[]) {
    this.communicationService.updateDataToStorage(this.communicationService.cachedDataLocalStorageVarName, fullData)
    this.dataService.allItemsData = fullData
  }

  createDocumentObject(id:number, page: any, engin: any, typeEngin: string[],
                       mainRef: any, auxRef: any, mainURL: any,
                       auxURL: any, mainPath: any, auxPath: any,
                       des: any, type: any, systeme: any) {

    // See if there is a missing value
    let missingFields = []
    if (typeof mainURL  !== "string" || mainURL == "") {missingFields.push("URL Principale")}
    if (typeof mainPath  !== "string" || mainPath == "") {missingFields.push("Chemin Local Principal")}
    if (typeof des      !== "string" || des     == "") {missingFields.push("Designation")}
    if (typeof mainRef  !== "string" || mainRef == "") {missingFields.push("Ref Principale")}
    if (typeEngin.length == 0) {missingFields.push("Type d'engin")}
    if (page == "") {missingFields.push("Page")}
    if (engin == "") {missingFields.push("Engin")}
    if (systeme == "") {missingFields.push("Systeme")}
    if (missingFields.length > 0) {
      this.notif.error(`Il manque une / des  valeur(s) dans le formulaire : ${Array(missingFields).toString()}`)
      return null
    }

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
    if (typeof type     === "string" && type      != "") { element.type = type }
    if (typeof auxRef   === "string" && auxRef    != "") { element.ref_aux = auxRef }
    if (typeof auxURL   === "string" && auxURL    != "") { element.url_aux = auxURL }
    if (typeof mainPath === "string" && mainPath  != "") { element.url_main_file = mainPath }
    if (typeof auxPath  === "string" && auxPath   != "") { element.url_aux_file = auxPath }

    return element;
  }

  updateAllPagesData() {
    this.changeActualPageSelectedPageMod(this.actualPageSelectedModPage)
  }

  // Functions filter elements
  writeFiltersToLocalStorage(fullData: FilterType[]) {
    this.communicationService.updateDataToStorage(this.communicationService.filtersLocalStorageVarName, fullData)
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
  createFilter(filter: string, filter_formatted: string, page: string, type: string, engin: string): FilterType | null {
      if (filter === "" || filter_formatted === "" || page === "" || type === "") {
        this.notif.error("L'élement que vous essayer de créer n'est pas valable...", "Aïe...")
        return null;
      } else {
        return {
          filter_formatted: filter_formatted,
          filter: filter,
          page: page,
          type: type,
          engin: engin
        };
      }
  }

  // ################################### Modification Doc FORM ###################################
  // Variables
  actualPageSelectedModPage: string = "";
  dataGridDocumentsModPage: ItemDataType[] = [];
  selectedDocumentModPage: ItemDataType | undefined = undefined;

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

  showDeleteButton1ModPage: boolean = false;
  showDeleteButton2ModPage: boolean = false;
  showDeleteButton3ModPage: boolean = false;

  // Functions
  changeActualPageSelectedPageMod(page: string) {
    this.actualPageSelectedModPage = page;
    this.dataGridDocumentsModPage = this.dataService.allItemsData.filter((item) => item.page == page);
    this.selectedDocumentModPage = undefined; // TODO : Remettre à null le document sélectionné car le choix page à changé donc doc dans la grid aussi
  }
  selectDocumentPageMod(event: any) {
    this.selectedDocumentModPage = event.detail.row.data
  }
  modElementFromDB(page: any, engin: any, typeEngin: string[],
                   mainRef: any, auxRef: any, mainURL: any,
                   auxURL: any, mainPath: any, auxPath: any,
                   des: any, systeme: any, type: any) {

    let id = this.selectedDocumentModPage?.id
    if (id == undefined) {
      this.notif.error("Un problème avec l'id de l'élement est survenu...")
      return ;
    }
    let index = this.dataService.allItemsData.indexOf(this.dataService.allItemsData.filter((item) => item.id == id)[0])
    let new_element = this.createDocumentObject(id ,page, engin, typeEngin, mainRef, auxRef, mainURL, auxURL, mainPath, auxPath, des, type, systeme)
    if (new_element !== null) {
      this.dataService.allItemsData.splice(index, 1, new_element)
      this.writeCachedDataToLocalStorage(this.dataService.allItemsData)
      this.notif.success("Document " + new_element.ref_main + " a bien été modifié", "C'est bon !")
    } else { // Catch error
      this.notif.error("Un problème avec l'élément crée dans la fonction est survenu...")
    }
    this.updateAllPagesData()
  }

  deleteFromDB() {
    if (this.selectedDocumentModPage === undefined) {
      this.notif.error("Vous n'avez pas sélectionné de documents à supprimer...", "Aïe...")
      return;
    }
    let newData: ItemDataType[] = this.dataService.allItemsData.filter((item) =>
      item.id != this.selectedDocumentModPage?.id && item.engin != this.selectedDocumentModPage?.engin)
    this.writeCachedDataToLocalStorage(newData)
    this.updateAllPagesData()
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

    let element = this.createDocumentObject(0, page, engin, typeEngin, mainRef, auxRef, mainURL, auxURL, mainPath, auxPath, des, type, systeme)
    if (element !== null) {
      let requestObject = {
        action: "create",
        object: element
      }
      let endpoint = this.communicationService.API_Endpoint_addDoc
      this.communicationService.requestToAPI("POST", endpoint, requestObject).subscribe(
        (response) => {
          let responseObject = (response as API_ResponseType)
          // Si erreur dans la requête
          if (responseObject.status.code != 200) {
            this.notif.warning(responseObject.status.message, "Aïe",{
              closeButton: false,
              disableTimeOut: true
            })
          }
          // Si la réponse contient des données
          else if (responseObject.status.code == 200) {
            this.notif.success(responseObject.status.message)
          }
          // Si les données sont corrompues
          else {
            this.notif.error("La réponse fournie par le serveur est corrompue...")
          }
        },

        (error) => {
          this.notif.warning("Un problème est survenue lors de la requête...", "Aïe...", {
            closeButton: false,
            disableTimeOut: true
          })
        })
    }
    this.updateAllPagesData()
  }
  reinitFieldsPageAdd() {
    /*this.valueEnginAddPage = "";*/
    /*this.valueTypeEnginAddPage = "";*/
    /*this.valueSystemeAddPage = "";*/
    /*this.valueTypeAddPage= "";*/
    this.valueDesignationAddPage= "";
    this.valueRefPrincipaleAddPage= "";
    this.valueRefAuxiliaireAddPage= "";
    this.valueMainURLAddPage= "";
    this.valueAuxURLAddPage= "";
    this.valueMainPathAddPage= "";
    this.valueAuxPathAddPage= "";
  }

  // ################################### Données FORM ###################################
  // Variables
  typesOfDataToBeImportedExportedDoneesPage = [
    {
      "filter": "document",
      "filter_formatted": "Documents"
    },
    {
      "filter": "filters",
      "filter_formatted": "Filtres"
    },
    {
      "filter": "technicentres",
      "filter_formatted": "Technicentres"
    },
    {
      "filter": "engins",
      "filter_formatted": "Engins"
    },
  ];
  exportTextAreaVarDoneesPage = "";
  importTextAreaVarDoneesPage = "";
  typeOfDataExportDoneesPage: string | null = this.typesOfDataToBeImportedExportedDoneesPage[0].filter;
  typeOfDataImportDoneesPage: string | null = this.typesOfDataToBeImportedExportedDoneesPage[0].filter;
  keysOfImpotedDataDonneesPage: {name: string, keys: string[]}[] = [
    {name: "document", keys: ["id", "des", "engin", "engin_type", "ref_main", "url_main", "systeme"]}
  ]

  // Function
  updateExportTextArea() {
    this.exportTextAreaVarDoneesPage = JSON.stringify(this.dataService.allItemsData)
  }
  importFromImportTextArea(stringified_object: string | null | undefined) {
    if (stringified_object === null || stringified_object === undefined || stringified_object === "" || this.typeOfDataImportDoneesPage == null) {
      this.notif.error("Le texte importé est vide", "Erreur...")
      return;
    }
    let JSONobject: [] = JSON.parse(stringified_object) // Créer l'objet depuis le JSON en texte
    if (typeof JSONobject != "object") {
      this.notif.error("L'objet n'est pas une liste", "Erreur...")
      return;
    }
    let keysToCheck = this.keysOfImpotedDataDonneesPage.find((type) => type.name == this.typeOfDataImportDoneesPage)
    if (!keysToCheck) {
      this.notif.error("La vérification des données à échouée", "Erreur...")
      return;
    }
    let incorrectItems: {badKey: string, items: ItemDataType[]}[] = []
    for (let key of keysToCheck.keys) {
      let currentIncorrectItem = JSONobject.filter((item) => item[key] == "")
      if (currentIncorrectItem.length > 0) {
        incorrectItems.push({badKey: key, items: currentIncorrectItem})
      }
    }
    /*let incorrectItems = (JSON.parse(stringified_object) as ItemDataType[]).filter((item) => objects.find((item2) => item2.name == this.typeOfDataImportDoneesPage)?.keys.find((key) => item[(key as keyof object)] != "") !== undefined)*/
    console.log(incorrectItems)
    if (incorrectItems.length > 0) {
      this.notif.error("Un des élement de l'objet donné est incorrect, voir la console", "Erreur...")
      console.error("Cet ou ces objets posent problème... : ", incorrectItems)
      return;
    }
   /* let userObject: ItemDataType[] = (JSONobject as ItemDataType[])
    this.writeCachedDataToLocalStorage(userObject)
    this.notif.success("L'objet de " + userObject.length + " élement(s) a été crée", "C'est bon !")*/
  }

  // ################################### Filters FORM ###################################
  // Variables filters globales
  kindOfFilterSelectedFilterPage: string | null = null;

  // Variables filters systemes
  pageSelectedFiltersPage: string | null = null;
  enginSelectedFilterPage: string | null = null;
  systemeOrTypeSelectedFilterPage: string | null = null;
  showSureDeleteButtonFilterPage: boolean = false;

  // Functions
  createOrChangeFilterSystemeOrType(newNameSQL: string | number | null | undefined, newNameHuman: string | number | null | undefined, createElement?: boolean) {
    if (this.pageSelectedFiltersPage == null || this.kindOfFilterSelectedFilterPage == null ||
      this.enginSelectedFilterPage == null || typeof newNameSQL !== "string" || typeof newNameHuman !== "string") {
      this.notif.warning("Vous essayer d'executer une fonction sans tous ses paramètres ou avec des paramètres invalides...", "Oups...")
      return;
    }
    let filters = this.dataService.filters
    let newObject = this.createFilter(newNameSQL, newNameHuman, this.pageSelectedFiltersPage, this.kindOfFilterSelectedFilterPage, this.enginSelectedFilterPage)
    if (newObject == null) {
      return;
    }
    if (createElement) {
      filters.push(newObject)
    } else {
      let oldObject = this.dataService.filters.find((item) =>
        item.page == this.pageSelectedFiltersPage &&
        item.filter == this.systemeOrTypeSelectedFilterPage)
      if (!oldObject) {
        this.notif.error("L'objet à modifier n'a pas été trouvé...")
        return;
      }
      let index = this.dataService.filters.indexOf(oldObject)
      if (index === -1) {
        this.notif.error("Le filtre sélectionné n'a pas été trouvé...", "Aïe...")
        return;
      }
      filters.splice(index, 1, newObject)
    }
    this.writeFiltersToLocalStorage(filters)
    this.notif.success("Le filtre " + newNameHuman + " a été crée / modifié", "C'est bon!")
  }

  deleteFilterSystemeOrType() {
    if (this.pageSelectedFiltersPage == null || this.kindOfFilterSelectedFilterPage == null ||
      this.enginSelectedFilterPage == null) {
      this.notif.warning("Vous essayer d'executer une fonction sans tous ses paramètres ou avec des paramètres invalides...", "Oups...")
      return;
    }
    let elementObject = this.dataService.filters.find((item) =>
      item.filter == this.systemeOrTypeSelectedFilterPage &&
      item.engin == this.enginSelectedFilterPage &&
      item.page == this.pageSelectedFiltersPage)
    console.log(this.dataService.filters, elementObject, this.kindOfFilterSelectedFilterPage, this.enginSelectedFilterPage, this.pageSelectedFiltersPage)
    if (!elementObject) {
      this.notif.error("Le filtre sélectionné n'a pas été trouvé...", "Aïe...")
      return;
    }
    let index = this.dataService.filters.indexOf(elementObject)
    if (index === -1) {
      this.notif.error("L'index de l'objet trouvé n'est pas correct...", "Aïe...")
      return;
    }
    this.dataService.filters.splice(index, 1)
    this.notif.success("L'objet " + elementObject.filter_formatted + " a bien été supprimé", "C'est bon!")
    this.showSureDeleteButtonFilterPage = false;
  }


}
