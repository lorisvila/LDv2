import {EventEmitter, Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {
  API_ResponseType,
  AppEnginType, CachedDataTableType,
  EnginType,
  LocalStorageDataType,
  TechnicentreType
} from "../app.types";
import {CommunicationService} from "./communication.service";
import {ToastrService} from "ngx-toastr";
import {SearchService} from "./search.service";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    public dataService: DataService,
    public communicationService: CommunicationService,
    public searchService: SearchService,
    public notif: ToastrService
  ) {
    this.$enginServiceInitialized.subscribe((state) => {
      // Update the website data from API (or not if refresh rate) & preference
      this.synchronisePreferenceOnLaunch()
      this.synchroniseDataOnLaunch()
    })

    // Tell that setup is finished
    this.searchService.$finishedLoadingDataFromCache.emit(true) // TODO : Delete this emit and put it in the function that gather data
  }
  // Events
  $offlineMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  $updateTechnicentre: EventEmitter<TechnicentreType> = new EventEmitter<TechnicentreType>();
  $updateEngin: EventEmitter<AppEnginType> = new EventEmitter<AppEnginType>();
  $updateFavEngins: EventEmitter<EnginType[]> = new EventEmitter<EnginType[]>();
  $enginServiceInitialized: EventEmitter<boolean> = new EventEmitter<boolean>();

  //Variables des versions et dates de mise à jour
  app_version: string = "V 2.2.0";
  app_build: string = "dev";

  date_maj_applicatif: Date = new Date("04/08/2024"); // /!\ Format de date US /!\
  date_maj_data_AGC: Date = new Date("11/04/2023"); // /!\ Format de date US /!\
  date_maj_data_TER2NNG: Date = new Date("11/04/2023"); // /!\ Format de date US /!\

  date_maj_applicatif_string: string = this.date_maj_applicatif.toLocaleDateString('fr-FR');
  date_maj_data_AGC_string: string = this.date_maj_data_AGC.toLocaleDateString('fr-FR');
  date_maj_data_TER2NNG_string: string = this.date_maj_data_TER2NNG.toLocaleDateString('fr-FR');

  // URL des sites
  URLDsMat = "https://dsmat.sncf.fr/"
  URLDocMat: string = "https://docmat.sncf.fr/#/"
  URLconnectDsMat: string = this.URLDsMat + "Login.aspx";
  URLconnectDocMat: string = this.URLDocMat

  // Variables pour les modals
  showDefaultEnginModal: boolean = false;
  showTechnicentreEnginModal: boolean = false;
  showEnginsFavorisModal: boolean = false;
  showAuthConnectModal: boolean = false;

  // Variables pour les cards
  showOfflineCard: boolean = false;

  // Variables pour le statut de connexion
  offlineMode: boolean = false;
  restrictOfflineMode: boolean = false; // TODO : A modifier si utilisation sur serveur

  //Variables pour l'affectation Technicentre
  actualTechnicentre: TechnicentreType | null = null

  // Message / popup info connect to DsMat and DocMat
  connectMessageStatus: boolean = true;
  hideConnectMessage() {this.connectMessageStatus = false}

  // Function to toggle modals of the app
  toggleModal(modalTitle: string, state: boolean = false) {
    console.log("Modal " + modalTitle + " to state " + state)
    switch (modalTitle) {
      case "defaultEnginModal": {
        this.showDefaultEnginModal = state;
        break;
      }
      case "technicentreEnginModal": {
        this.showTechnicentreEnginModal = state;
        break;
      }
      case "enginsFavoris": {
        this.showEnginsFavorisModal = state;
        break;
      }
      case "authConnect": {
        this.showAuthConnectModal = state;
        break;
      }
    }
  }

  // Function to toggle the network status state
  toggleNetworkStatus() {
    this.offlineMode = !this.offlineMode;
    this.showOfflineCard = this.offlineMode;
    this.$offlineMode.emit(this.offlineMode)
  }


  synchronisePreferenceOnLaunch() {
    let defaultEnginLocalStorage: AppEnginType | null = this.communicationService.getDataFromStorage(this.communicationService.defaultEnginLocalStorageVarName)
    if (defaultEnginLocalStorage) {
      this.$updateEngin.emit(defaultEnginLocalStorage)
    }
    let favEnginsLocalStorage: EnginType[] | null = this.communicationService.getDataFromStorage(this.communicationService.favEnginLocalStorageVarName)
    if (favEnginsLocalStorage) {
      this.$updateFavEngins.emit(favEnginsLocalStorage)
    }
    let technicentreLocalStorage: TechnicentreType | null = this.communicationService.getDataFromStorage(this.communicationService.technicentreLocalStorageVarName)
    if (technicentreLocalStorage) {
      this.$updateTechnicentre.emit(technicentreLocalStorage)
      this.actualTechnicentre = technicentreLocalStorage
    }
  }

  synchroniseDataOnLaunch() {
    // Récupérer les données du localStorage
    let localStorageRecoveredData: LocalStorageDataType = this.communicationService.getDataFromStorage(this.communicationService.appLocalStorageVarName)
    // Si du JSON non null dans le localStorage
    if (localStorageRecoveredData) {
      this.dataService.refreshDelayMinutes = localStorageRecoveredData.refreshDelayMinutes
      let timeElapsedSinceLastCache = (new Date().getTime() - new Date(localStorageRecoveredData.lastCacheDate).getTime())/1000/60
      // CACHE - Si date de cache > au délai ou pas de cache dans l'objet dans le localStorage
      if (timeElapsedSinceLastCache > this.dataService.refreshDelayMinutes || !localStorageRecoveredData.cachedData) { // Cache data because too old or not here
        this.importDataFromAPI().subscribe((data: API_ResponseType) => {
          this.writeCacheToLocalStorage(localStorageRecoveredData, data)
        })
      }
      // CACHE - Sinon écrire directement le cache dans dataService
      else {
        this.writeDataToVariables(localStorageRecoveredData.cachedData)
      }
    }
    // Si pas de JSON dans le localStorage, contacter API et le mettre dans cache
    else {
      this.importDataFromAPI().subscribe((data: API_ResponseType) => {
        this.writeCacheToLocalStorage(localStorageRecoveredData, data) // LocalStorageRecoveredData is at null here
      })
    }
    this.searchService.$finishedLoadingDataFromCache.emit(true)
  }

  // Forcer à rafraîchir les données depuis API
  forceUpdateData() {
    let localStorageRecoveredData: LocalStorageDataType = this.communicationService.getDataFromStorage(this.communicationService.appLocalStorageVarName)
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_refreshData, {token: this.communicationService.API_token}).subscribe((response) => {
      this.importDataFromAPI().subscribe((data: API_ResponseType) => {
        console.log(data)
        this.writeCacheToLocalStorage(localStorageRecoveredData, data)
      })
    })
  }

  // Importer les données depuis l'API
  importDataFromAPI() {
    let endpoint = this.communicationService.API_Endpoint_allTables
    let returnValue: EventEmitter<API_ResponseType> = new EventEmitter<API_ResponseType>()
    this.communicationService.requestToAPI("GET", endpoint).subscribe(
      (response) => {
        let responseObject = (response as API_ResponseType)
        // Si erreur dans la requête
        if (responseObject.status.code != 200) {
          this.notif.warning(responseObject.status.message, "",{
            closeButton: false,
            disableTimeOut: true
          })
        }
        // Si la réponse contient des données
        else if (responseObject.status.code == 200) {
          this.notif.success("Données mise à jour depuis le serveur", "C'est bon !")
          this.writeDataToVariables(responseObject.data)
          returnValue.emit(responseObject)
        }
        // Si les données sont corrompues
        else {
          this.notif.error("La réponse fournie par le serveur est corrompue... Utilisation des données locales")
        }
        this.searchService.$finishedLoadingDataFromCache.emit(true)
      },

      (error) => {
        this.notif.warning("Les données locales vont être utilisées, la base de donnée n'a pas pu être contactée", "", {
          closeButton: false,
          disableTimeOut: true
        })
        this.searchService.$finishedLoadingDataFromCache.emit(true)
      })
    return returnValue
  }
  writeDataToVariables(cacheData: CachedDataTableType[]) {
    cacheData.forEach((tableObject: CachedDataTableType) => {
      switch (tableObject.tableName) {
        case "documents": {
          this.dataService.allItemsData = tableObject.tableData
          break
        }
        case "news": {
          this.dataService.homePageNews = tableObject.tableData
          break
        }
        case "filters": {
          this.dataService.filters = tableObject.tableData
          break
        }
        case "engins": {
          this.dataService.engins = tableObject.tableData
          break
        }
        case "technicentres": {
          this.dataService.technicentres = tableObject.tableData
          this.updateTechnicentreInLocalStorage(tableObject.tableData)
          break
        }
      }
    })
  }

  // User Technicentre appartenance can be outdated when new engin come in the Technicentre, this function will update it to the last version
  updateTechnicentreInLocalStorage(latestTechnicentresObject: TechnicentreType[]) {
    let userNewTechnicentre = latestTechnicentresObject.find((technicentre) => technicentre.technicentre == this.actualTechnicentre?.technicentre)
    if (userNewTechnicentre) {
      this.communicationService.updateDataToStorage(this.communicationService.technicentreLocalStorageVarName, userNewTechnicentre)
    }
  }

  writeCacheToLocalStorage(oldObject: LocalStorageDataType | null, data: API_ResponseType) {
    let newObject: LocalStorageDataType
    if (oldObject) {
      newObject = oldObject
      newObject.cachedData = data.data
      newObject.lastCacheDate = data.data ? (data.data as CachedDataTableType[])[0].tableLastRefresh : 0
      newObject.refreshDelayMinutes = this.dataService.refreshDelayMinutes
    } else {
      newObject = {
        lastCacheDate: data.data ? (data.data as CachedDataTableType[])[0].tableLastRefresh : 0,
        refreshDelayMinutes: this.dataService.refreshDelayMinutes,
        cachedData: data.data
      }
    }
    this.communicationService.updateDataToStorage('app', newObject)
  }

  // Function to change the actual Technicentre
  changeTechnicentre(technicentre: TechnicentreType) {
    this.communicationService.updateDataToStorage(this.communicationService.technicentreLocalStorageVarName, technicentre)
    this.actualTechnicentre = technicentre
    // this.$updateTechnicentre.emit() // Juste dire que j'ai changé de Technicentre
    this.notif.success(technicentre.technicentre_formatted + " ajouté !", "C'est bon !")
  }

  // Function to open a link in new tab
  openURL(URL: string, target: string) {
    window.open(URL, target)
  }

  copyObject(object: {} | []) {
    return JSON.parse(JSON.stringify(object))
  }

}
