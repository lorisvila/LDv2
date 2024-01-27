import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {LocalStorageDataType} from "../app.types";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  adminAuth: boolean = true;
  API_url: string = "http://localhost:5000"

  // Name of localStorage variables
  appLocalStorageVarName: string = "app"

  defaultEnginLocalStorageVarName: string = "defaultEngin";
  favEnginLocalStorageVarName: string = "enginFav";
  technicentreLocalStorageVarName: string = "technicentre";
  cachedDataLocalStorageVarName: string = "cachedData";
  filtersLocalStorageVarName: string = "filters";

  constructor(
    private http: HttpClient,
    public notif: ToastrService,
  ) {
  }

  // Main function to retrieve data from localStorage
  getDataFromStorage(key: string): null | any {
    let resultsString = localStorage.getItem(key)
    if (resultsString !== null) { // If the key exists in the localStorage
      try {
        return JSON.parse(resultsString);
      } catch {
        this.notif.error("Erreur dans la lecture de JSON")
        return null
      }
    } else {
      return null;
    }
  }

  // Main function to store data to localStrorage
  updateDataToStorage(key: string, value: any) {
    let stringifiedValue = JSON.stringify(value)
    localStorage.setItem(key, stringifiedValue)
  }

  // Main function to store data to localStrorage
  deleteDataFromStorage(key: string) {
    localStorage.removeItem(key)
  }

  getDataFromDB(endpoint: string) {
    return this.http.get(this.API_url + endpoint, {responseType:'json'})
  }
}
