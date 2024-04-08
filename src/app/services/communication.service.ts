import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {API_RequestType} from "../app.types";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  API_url: URL =  new URL("http://localhost:8080/")

  API_Section_Data: string = "/data"
  API_Section_Auth: string = "/auth"
  API_Section_DataManage: string = "/manage"

  // Name of localStorage variables
  appLocalStorageVarName: string = "app"

  defaultEnginLocalStorageVarName: string = "defaultEngin";
  favEnginLocalStorageVarName: string = "enginFav";
  technicentreLocalStorageVarName: string = "technicentre";
  cachedDataLocalStorageVarName: string = "cachedData";
  filtersLocalStorageVarName: string = "filters";

  //API endpoints
  API_Endpoint_allTables: URL = new URL( this.API_Section_Data + "/allTables", this.API_url)
  API_Endpoint_refreshData: URL = new URL( this.API_Section_DataManage + "/refreshData", this.API_url)
  API_Endpoint_singleTable: URL = new URL(this.API_Section_Data + "/table", this.API_url)
  API_Endpoint_addDoc: URL = new URL(this.API_Section_DataManage + "/addDoc", this.API_url)
  API_Endpoint_modifyDoc: URL = new URL(this.API_Section_DataManage + "/modifyDoc", this.API_url)
  API_Endpoint_authConnect: URL = new URL(this.API_Section_Auth + "/connect", this.API_url)
  API_Endpoint_checkToken: URL = new URL(this.API_Section_Auth + "/checkToken", this.API_url)

  // API Token
  API_token: string | undefined = undefined

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

  requestToAPI(method: "GET" | "POST" | "PUT" | "DELETE", endpoint: URL, data?: any) {
    let requestObjectBody = new API_RequestType()
    if (this.API_token) {
      requestObjectBody.token = this.API_token
    }
    if (data) {
      requestObjectBody.data = data
    }
    return this.http.request(method, endpoint.href, {responseType: 'json', body: requestObjectBody})
  }

}
