import { Injectable } from '@angular/core';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  // Variables pour les modals
  showDebugModal: boolean = false;
  showDefaultEnginModal: boolean = false;

  // Variables pour les cards
  showOfflineCard: boolean = false;

  // Variables pour le statut de connexion
  offlineMode: boolean = false;

  constructor() {
  }

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

  toggleNetworkStatus() {
    this.offlineMode = !this.offlineMode;
    if (this.offlineMode) {this.showOfflineCard = true;}
    else {this.showOfflineCard = false;}
    console.log(this.offlineMode)
  }

  debugDataDict = [ ]

}
