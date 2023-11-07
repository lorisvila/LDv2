import { Injectable } from '@angular/core';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  // Variables pour les modals
  showDebugModal: boolean = false
  showDefaultEnginModal: boolean = false

  // Variables pour le statut de connexion
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  offlineMode: boolean = false;

  constructor() {

  }

  ngOnInit() {
    this.checkNetworkStatus()
  }

  ngOnDestroy() {
    this.networkStatus$.unsubscribe()
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

  // Function to subscribe to connected or disconnected event
  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        console.log('status', status);
        this.networkStatus = status;
      });
  }

}
