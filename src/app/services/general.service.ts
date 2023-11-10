import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  @Output() $offlineMode: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Variables pour les modals
  showDebugModal: boolean = false;
  showDefaultEnginModal: boolean = false;

  // Variables pour les cards
  showOfflineCard: boolean = false;

  // Variables pour le statut de connexion
  offlineMode: boolean = false;

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

  // Debug variables to be used in the debug modal
  debugDataDict = [ ]

}

// Type for data in LD Dict
export type LDdata = {
  id: number,
  des: string,
  enginType: string[],
  ref: string,
  ind: string,
  url_DocMat: string,
  url_File: string,
  type: string
}
