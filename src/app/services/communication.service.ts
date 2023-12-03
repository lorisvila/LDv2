import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  adminAuth: boolean = true;

  // Main function to retrieve data from localStorage
  getDataFromStorage(key: string): null | any {
    let resultsString = localStorage.getItem(key)
    if (resultsString !== null) { // If the key exists in the localStorage
      return JSON.parse(resultsString);
    } else {
      return null;
    }
  }

  // Main function to store data to localStrorage
  updateDataToStorage(key: string, value: string | [] | {}) {
    let stringifiedValue = JSON.stringify(value)
    localStorage.setItem(key, stringifiedValue)
  }

  // Main function to store data to localStrorage
  deleteDataFromStorage(key: string) {
    localStorage.removeItem(key)
  }

}
