import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {API_RequestType, API_ResponseType} from "../app.types";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  /*API_Url: URL =  new URL("http://ldv2.cic.sncf.fr:3000/");*/
  API_Url: URL =  new URL("http://localhost:8081/");
  API_Version: string = '/v1'

  // Name of localStorage variables
  appLocalStorageVarName: string = "app";

  defaultEnginLocalStorageVarName: string = "defaultEngin";
  favEnginLocalStorageVarName: string = "enginFav";
  technicentreLocalStorageVarName: string = "technicentre";

  // Main Sections of API

  API_Section_Data: string = this.API_Version + "/data";
  API_Section_DataManage: string = this.API_Version + "/dataManage";
  API_Section_Auth: string = this.API_Version + "/auth";

  //API endpoints
  API_Endpoint_allTables: URL = new URL(this.API_Section_Data + "/getAllTables", this.API_Url)
  API_Endpoint_refreshData: URL = new URL(this.API_Section_Data + "/refresh", this.API_Url)
  API_Endpoint_singleTable: URL = new URL(this.API_Section_Data + "/table", this.API_Url)

  API_Endpoint_authConnect: URL = new URL(this.API_Section_Auth + "/connect", this.API_Url)
  API_Endpoint_checkToken: URL = new URL(this.API_Section_Auth + "/checkToken", this.API_Url)
  API_Endpoint_GetUsers: URL = new URL(this.API_Section_Auth + "/users", this.API_Url)
  API_Endpoint_CreateUser: URL = new URL(this.API_Section_Auth + "/createUser", this.API_Url)
  API_Endpoint_DeleteUser: URL = new URL(this.API_Section_Auth + "/deleteUser", this.API_Url)
  API_Endpoint_EditUser: URL = new URL(this.API_Section_Auth + "/editUser", this.API_Url)

  API_Endpoint_CreateDocument: URL = new URL(this.API_Section_DataManage + "/createDocument", this.API_Url)
  API_Endpoint_EditDocument: URL = new URL(this.API_Section_DataManage + "/editDocument", this.API_Url)
  API_Endpoint_DeleteDocument: URL = new URL(this.API_Section_DataManage + "/deleteDocument", this.API_Url)
  API_Endpoint_CreateFilter: URL = new URL(this.API_Section_DataManage + "/createFilter", this.API_Url)
  API_Endpoint_EditFilter: URL = new URL(this.API_Section_DataManage + "/editFilter", this.API_Url)
  API_Endpoint_DeleteFilter: URL = new URL(this.API_Section_DataManage + "/deleteFilter", this.API_Url)
  API_Endpoint_CreateEnginTechnicentre: URL = new URL(this.API_Section_DataManage + "/createEnginTechnicentre", this.API_Url)
  API_Endpoint_DeleteEnginTechnicentre: URL = new URL(this.API_Section_DataManage + "/deleteEnginTechnicentre", this.API_Url)
  API_Endpoint_CreateTechnicentre: URL = new URL(this.API_Section_DataManage + "/createTechnicentre", this.API_Url)
  API_Endpoint_DeleteTechnicentre: URL = new URL(this.API_Section_DataManage + "/deleteTechnicentre", this.API_Url)

  // API Token
  API_token: string | undefined = undefined
  $API_token: EventEmitter<string> = new EventEmitter<string>

  constructor(
    private http: HttpClient,
    public notif: ToastrService,
  ) {
  }

  // Main function to retrieve data from localStorage
  getDataFromStorage(key: string): undefined | any {
    let resultsString = localStorage.getItem(key)
    if (resultsString !== null) { // If the key exists in the localStorage
      try {
        return JSON.parse(resultsString);
      } catch {
        this.notif.error("Erreur dans la lecture de JSON")
        return undefined
      }
    } else {
      return undefined;
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
    let headers: {} = {}
    if (this.API_token) {
      requestObjectBody.token = this.API_token
      headers = {token: this.API_token}
    }
    if (data) {
      requestObjectBody.data = data
    }
    return this.http.request(method, endpoint.href, {responseType: 'json', body: requestObjectBody, headers: headers})
  }

  handleResponse(response: any, successMessage?: string): API_ResponseType | undefined {
    let responseObject = (response as API_ResponseType)
    if (responseObject.status.code === 200) {
      successMessage ? this.notif.success(successMessage) : undefined
      return responseObject
    } else {
      this.notif.error(responseObject.status.message)
      return undefined
    }
  }
  handleErrorResponse(error: any, showErrorToast: boolean = true): API_ResponseType | undefined {
    error = error as HttpErrorResponse
    if (error.statusText == 'Unknown Error') {
      this.notif.error("Impossible de joindre l'API")
      return undefined
    }
    let responseObject = (error.error as API_ResponseType)
    if (showErrorToast) {
      this.notif.error(responseObject.status.message)
    }
    return responseObject
  }

}
