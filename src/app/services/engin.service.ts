import {EventEmitter, Injectable, Output} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {EnginType} from "../app.types";
import {GeneralService} from "./general.service";
import {CommunicationService} from "./communication.service";

@Injectable({
  providedIn: 'root'
})
export class EnginService {

  @Output() $actual_engin: EventEmitter<string> = new EventEmitter<string>();

  actual_engin: string = "";
  types_engin: {[Name: string]: string[]} = {
    "AGC": ["XGC", "BGC", "ZGC"],
    "TER 2N NG": ["2C", "3C", "4C", "5C"],
  };
  actual_type_engin: string[] = [];
  hasDefaultEngin: boolean = false;

  favoriteEngins: EnginType[] = []

  constructor(
    public generalService: GeneralService,
    public communicationSerice: CommunicationService
  ) {
    // Set the basic engin to use when reload
    this.updateBasicEngin()
    // Set the favorites engins when page loads
    this.updateFavEngin()
  }

  changeActualEngin(engin: string){
    this.actual_engin = engin
    this.actual_type_engin = this.types_engin[this.actual_engin]
    this.$actual_engin.emit(engin)
  }

  changeDefaultEngin(engin: string) {
    this.communicationSerice.updateDataFromStorage(this.generalService.basicEnginLocalStorageVarName, engin)
  }

  addFavEngin(engin: EnginType) {
    // Vérifier si l'engin respecte les conditions
    if (this.favoriteEngins.filter((item) => item.engin_numero == engin.engin_numero).length != 0) {return;}
    if (engin.engin_numero === undefined) {return;}
    if (engin.engin_numero?.toString().length < 5) {return;}

    // Si l'engin est valide alors l'ajouter
    this.favoriteEngins.push(engin)
    this.communicationSerice.updateDataFromStorage(this.generalService.enginFavLocalStorageVarName, this.favoriteEngins)
    this.updateFavEngin()
  }
  deleteFavEngin(engin: EnginType) {
    // Vérifier si l'engin respecte les conditions
    if (this.favoriteEngins.filter((item) => item.engin_numero == engin.engin_numero).length == 0) {return;}
    if (engin.engin_numero === undefined) {return;}
    if (engin.engin_numero?.toString().length < 5) {return;}

    // Si l'engin est valide alors supprimer
    this.favoriteEngins.splice(this.favoriteEngins.indexOf(engin), 1)
    this.communicationSerice.updateDataFromStorage(this.generalService.enginFavLocalStorageVarName, this.favoriteEngins)
    this.updateFavEngin()
  }


  // Functions to update the variables linked with the localStorage
  updateBasicEngin() {
    let defaultEnginLocalStorage = this.communicationSerice.getDataFromStorage(this.generalService.basicEnginLocalStorageVarName)
    if (defaultEnginLocalStorage !== null) {
      this.changeActualEngin(defaultEnginLocalStorage);
      console.log("Engin par défaut : " + this.actual_engin)
      this.hasDefaultEngin = true;
    } else {
      this.changeActualEngin("AGC")
    }
  }
  updateFavEngin() {
    let favEnginLocalStorage = this.communicationSerice.getDataFromStorage(this.generalService.enginFavLocalStorageVarName)
    if (favEnginLocalStorage !== null) {
      this.favoriteEngins = favEnginLocalStorage
    }
  }

}
