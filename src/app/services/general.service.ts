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
import {AppError} from "../app.errors";

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
  app_version: string = "V0"; //TODO : Setup a versionning
  app_build: string = "dev";

  date_maj_applicatif: Date = new Date(2024, 9, 25);

  date_maj_applicatif_string: string = this.date_maj_applicatif.toLocaleDateString('fr-FR');

  dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Europe/Paris',
  })

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

  showModal: string = ''

  // Variables pour les cards
  showOfflineCard: boolean = false;

  // Variables pour le statut de connexion
  offlineMode: boolean = false;
  restrictOfflineMode: boolean = false; // TODO : A modifier si utilisation sur serveur

  //Variables pour l'affectation Technicentre
  actualTechnicentre: TechnicentreType | null = null

  // Function to toggle modals of the app
  toggleModal(modalTitle: string, state: boolean = false) {
    this.showModal = state ? modalTitle : ''
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
        this.importDataFromAPI()
      }
      // CACHE - Sinon écrire directement le cache dans dataService
      else {
        this.writeDataToVariables(localStorageRecoveredData.cachedData)
      }
    }
    // Si pas de JSON dans le localStorage, contacter API et le mettre dans cache
    else {
      this.importDataFromAPI()
    }
    this.searchService.$finishedLoadingDataFromCache.emit(true)
  }

  // Forcer à rafraîchir les données depuis API
  forceUpdateData() {
    this.communicationService.requestToAPI("GET", this.communicationService.API_Endpoint_refreshData, {token: this.communicationService.API_token}).subscribe((response) => {
      this.importDataFromAPI()
    })
  }

  // Importer les données depuis l'API
  importDataFromAPI() {
    let endpoint = this.communicationService.API_Endpoint_allTables
    let returnValue: EventEmitter<API_ResponseType> = new EventEmitter<API_ResponseType>()
    this.communicationService.requestToAPI("GET", endpoint).subscribe(
      (response) => {
        let check = this.communicationService.handleResponse(response)
        // Si la réponse contient des données
        if (check) {
          let responseObject = response as API_ResponseType
          this.notif.success("Données mise à jour depuis le serveur", "C'est bon !")
          this.writeDataToVariables(responseObject.data)
          this.writeCacheToLocalStorage(this.communicationService.getDataFromStorage('app'), responseObject)
          returnValue.emit(responseObject)
        }
        // Si les données sont corrompues
        else {
          this.notif.error("La réponse fournie par le serveur est corrompue... Utilisation des données locales")
          throw new AppError('NO_DATA_FROM_API')
        }
        this.searchService.$finishedLoadingDataFromCache.emit(true)
      },

      (error) => {
        this.communicationService.handleErrorResponse(error)
        this.searchService.$finishedLoadingDataFromCache.emit(true)
        throw new AppError('NO_DATA_FROM_API')
      })
    return returnValue
  }

  writeDataToVariables(cacheData: CachedDataTableType[]) {
    cacheData.forEach((tableObject: CachedDataTableType) => {
      if (!tableObject.tableName || !tableObject.tableData) {
        this.notif.warning("Une donnée reçue de l'API est corrompue...")
        return
      }
      switch (tableObject.tableName) {
        case "documents": {
          this.dataService.allItemsData = tableObject.tableData
          break
        }
        case "filter_types": {
          this.dataService.filterTypes = tableObject.tableData
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
