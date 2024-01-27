import {EventEmitter, Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {
  APIresponseAllTables, AppEnginType,
  CacheDataObjectType, EnginType,
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

    // Set the technicentre Object when loading the page
    this.updateActualTechnicentre()

    // Gather the cached data if there is from Local Storage
    //this.updateDataFromCache()

    // Gather the filters if there is from Local Storage
    this.updateFiltersFromCache()

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

  date_maj_applicatif: Date = new Date("11/22/2023"); // /!\ Format de date US /!\
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

  //API endpoints
  allTablesEndpoint: string = "/allTables"
  singleTableEndpoint: string = "/table/{table}" // ! Rajouter une table derrière l'endpoint

  // TODO : Remove methods using theses localStorage endpoints
  basicEnginLocalStorageVarName: string = "defaultEngin";
  enginFavLocalStorageVarName: string = "enginFav";
  technicentreLocalStorageVarName: string = "technicentre";
  cachedDataLocalStorageVarName: string = "cachedData";
  filtersLocalStorageVarName: string = "filters";

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
        this.importDataFromAPI().subscribe((data: APIresponseAllTables) => {
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
      this.importDataFromAPI().subscribe((data: APIresponseAllTables) => {
        this.writeCacheToLocalStorage(localStorageRecoveredData, data) // LocalStorageRecoveredData is at null here
      })
    }
    this.searchService.$finishedLoadingDataFromCache.emit(true)
  }

  // Forcer à rafraîchir les données depuis API
  forceUpdateData() {
    let localStorageRecoveredData: LocalStorageDataType = this.communicationService.getDataFromStorage('app')
    this.importDataFromAPI(true).subscribe((data: APIresponseAllTables) => {
      this.writeCacheToLocalStorage(localStorageRecoveredData, data)
    })
  }

  // Importer les données depuis l'API
  importDataFromAPI(forceReload?: boolean) {
    let endpoint = '/allTables'
    if (forceReload) {
      endpoint = '/allTables?reload=true'
    }
    let returnValue: EventEmitter<APIresponseAllTables> = new EventEmitter<APIresponseAllTables>()
    this.communicationService.getDataFromDB(endpoint).subscribe(
      (response) => {
        let responseObject = (response as APIresponseAllTables)
        // Si erreur dans la requête
        if (!responseObject.success) {
          this.notif.warning(responseObject.message, "",{
            closeButton: false,
            disableTimeOut: true
          })
        }
        // Si la réponse contient des données
        else if (responseObject.data) {
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
  writeDataToVariables(cacheData: CacheDataObjectType) {
    this.dataService.allItemsData = cacheData.documents
    this.dataService.filters = cacheData.filters
    this.dataService.homePageNews = cacheData.news
    this.dataService.allItemsData = cacheData.documents
    this.dataService.engins = cacheData.engins
  }

  writeCacheToLocalStorage(oldObject: LocalStorageDataType | null, data: APIresponseAllTables) {
    let newObject: LocalStorageDataType
    if (oldObject) {
      newObject = oldObject
      newObject.cachedData = data.data
      newObject.lastCacheDate = data.lastRefreshTime
      newObject.refreshDelayMinutes = this.dataService.refreshDelayMinutes
    } else {
      newObject = {
        lastCacheDate: data.lastRefreshTime,
        refreshDelayMinutes: this.dataService.refreshDelayMinutes,
        cachedData: data.data
      }
    }
    this.communicationService.updateDataToStorage('app', newObject)
  }

  // Function to update the actual Technicentre
  updateActualTechnicentre() {
    let technicentreLocalStorage = this.communicationService.getDataFromStorage(this.technicentreLocalStorageVarName)
    if (technicentreLocalStorage !== null) {
      if (!(technicentreLocalStorage.hasOwnProperty("technicentre") && technicentreLocalStorage.hasOwnProperty("technicentre_formatted") && technicentreLocalStorage.hasOwnProperty("engins"))) {
        this.notif.error("L'importation du Technicentre d'affectation a échoué", "Aïe...")
        console.error("L'importation du Technicentre d'affectation a échoué")
        this.communicationService.deleteDataFromStorage(this.technicentreLocalStorageVarName)
        return;
      }
      this.actualTechnicentre = technicentreLocalStorage
      console.log("Technicentre par défaut : ", this.actualTechnicentre)
    }
  }

  // Function to update the Filters from the Local Storage
  updateFiltersFromCache() {
    let filtersLocalStorage = this.communicationService.getDataFromStorage(this.filtersLocalStorageVarName)
    if (filtersLocalStorage !== null) {
      this.dataService.filters = filtersLocalStorage
      console.log("Filtres récupérés : ", filtersLocalStorage)
    }
  }

  // Function to change the actual Technicentre
  changeTechnicentre(technicentre: TechnicentreType) {
    this.communicationService.updateDataToStorage(this.technicentreLocalStorageVarName, technicentre)
    this.actualTechnicentre = technicentre
    // this.$updateTechnicentre.emit() // Juste dire que j'ai changé de Technicentre
    this.notif.success(technicentre.technicentre_formatted + " ajouté !", "C'est bon !")
  }

  // Function to open a link in new tab
  openURL(URL: string, target: string) {
    window.open(URL, target)
  }
}
