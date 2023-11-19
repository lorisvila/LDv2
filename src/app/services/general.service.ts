import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

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

  // Variables pour les modals
  showDebugModal: boolean = false;
  showDefaultEnginModal: boolean = false;

  // Variables pour les cards
  showOfflineCard: boolean = false;

  // Variables pour le statut de connexion
  offlineMode: boolean = false;
  restrictOfflineMode: boolean = false; // A modifier si utilisation sur serveur

  constructor() { }

  // Function to toggle modals of the app
  toggleModal(modalTitle: string, state: boolean = false) {
    console.log("Modal " + modalTitle + " to state " + state)
    switch (modalTitle) {
      case "debugModal": {
        this.showDebugModal = state;
        break;
      }
      case "defaultEnginModal": {
        this.showDefaultEnginModal = state;
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

}
