import { Injectable, Output, EventEmitter } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
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
  }

  @Output() $offlineMode: EventEmitter<boolean> = new EventEmitter<boolean>();

  //Variables des versions et dates de mise à jour
  app_version: string = "V 2.1.0";
  app_build: string = "dev";

  date_maj_applicatif: Date = new Date("04/11/2023");
  date_maj_data_AGC: Date = new Date("04/11/2023");
  date_maj_data_TER2NNG: Date = new Date("04/11/2023");

  date_maj_applicatif_string: string = this.date_maj_applicatif.toLocaleDateString('fr-FR');
  date_maj_data_AGC_string: string = this.date_maj_data_AGC.toLocaleDateString('fr-FR');
  date_maj_data_TER2NNG_string: string = this.date_maj_data_TER2NNG.toLocaleDateString('fr-FR');

  // Name of cookies or localStorage variables
  basicEnginLocalStorageVarName: string = "defaultEngin";
  enginFavLocalStorageVarName: string = "enginFav";
  technicentreLocalStorageVarName: string = "technicentre";

  // Variables pour les modals
  showDefaultEnginModal: boolean = false;
  showTechnicentreEnginModal: boolean = false;
  showEnginsFavoris: boolean = false;

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
        this.showEnginsFavoris = state;
        break;
      }

    }
  }

  // Function to toggle the network status state
  toggleNetworkStatus() {
    this.offlineMode = !this.offlineMode;
    if (this.offlineMode) {this.showOfflineCard = true;}
    else {this.showOfflineCard = false;}
    console.log("Changing the offline mode to " + this.offlineMode)
    this.$offlineMode.emit(this.offlineMode)
  }

  // Function to update the actual Technicentre
  updateActualTechnicentre() {
    let technicentreLocalStorage = this.communicationService.getDataFromStorage(this.technicentreLocalStorageVarName)
    if (technicentreLocalStorage !== null) {
      this.actualTechnicentre = technicentreLocalStorage
      console.log("Technicentre par défaut : " + this.actualTechnicentre)
    }
  }

  // Function to change the actual Technicentre
  changeTechnicentre(technicentre: string) {
    this.communicationService.updateDataFromStorage(this.technicentreLocalStorageVarName, technicentre)
    this.actualTechnicentre = this.dataService.technicentresEngins.filter((item) => item.technicentre == technicentre)[0]
  }

}
