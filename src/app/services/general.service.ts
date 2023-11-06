import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  showDebugModal: boolean = false
  showDefaultEnginModal: boolean = false

  constructor() { }

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

}
