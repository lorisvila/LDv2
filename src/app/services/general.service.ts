import {EventEmitter, Injectable, Output} from '@angular/core';
import {DataService} from "./data.service";
import {Technicentre} from "../app.types";
import {CommunicationService} from "./communication.service";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    public dataService: DataService,
    public communicationService: CommunicationService
  ) {
    // Set the technicentre Object when loading the page
    this.updateActualTechnicentre()

    // Gather the cached data if there is from Local Storage
    this.updateDataFromCache()

    // Gather the filters if there is from Local Storage
    this.updateFiltersFromCache()
  }

  @Output() $offlineMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() $changeTechnicentre: EventEmitter<null> = new EventEmitter<null>();

  //Variables des versions et dates de mise à jour
  app_version: string = "V 2.1.0";
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

  // Name of localStorage variables
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
  actualTechnicentre: Technicentre | undefined = undefined

  // Message info connect systemes
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

  // Function to update the actual Technicentre
  updateActualTechnicentre() {
    let technicentreLocalStorage = this.communicationService.getDataFromStorage(this.technicentreLocalStorageVarName)
    if (technicentreLocalStorage !== null) {
      this.actualTechnicentre = this.dataService.technicentresEngins.filter((item) => item.technicentre == technicentreLocalStorage)[0]
      console.log("Technicentre par défaut : ", this.actualTechnicentre)
    }
  }

  // Function to update all the Item Data list
  updateDataFromCache() {
    let cachedDataLocalStorage = this.communicationService.getDataFromStorage(this.cachedDataLocalStorageVarName)
    if (cachedDataLocalStorage !== null) {
      this.dataService.allItemsData = cachedDataLocalStorage
      console.log("Data récupérée du cache : ", cachedDataLocalStorage)
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
  changeTechnicentre(technicentre: string) {
    this.communicationService.updateDataToStorage(this.technicentreLocalStorageVarName, technicentre)
    this.actualTechnicentre = this.dataService.technicentresEngins.filter((item) => item.technicentre == technicentre)[0]
    this.$changeTechnicentre.emit(null) // Juste dire que j'ai changé de Technicentre
  }

  // Function to open a link in new tab
  openURL(URL: string, target: string) {
    window.open(URL, target)
  }
}
