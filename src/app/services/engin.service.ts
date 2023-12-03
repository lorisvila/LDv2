import {AfterContentInit, EventEmitter, Injectable, Output} from '@angular/core';
import {EnginType} from "../app.types";
import {GeneralService} from "./general.service";
import {CommunicationService} from "./communication.service";
import {DataService} from "./data.service";

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

  combinedTechFavEngins: EnginType[] = []

  constructor(
    public generalService: GeneralService,
    public communicationSerice: CommunicationService
  ) {
    // Set the basic engin to use when reload
    this.updateBasicEngin()
    // Set the favorites engins when page loads
    this.updateFavEngin()
    // Set the combined Technicentre and Favorites engins
    this.combineEnginsTechFav()
    // Listen to a change in Technicentre to update the combined Fav Engin + Tech list
    this.generalService.$changeTechnicentre.subscribe((value) => {
      this.combineEnginsTechFav()
    })
  }

  // Change the actual engin var + send a event for the listeners in other services / components
  changeActualEngin(engin: string){
    this.actual_engin = engin
    this.actual_type_engin = this.types_engin[this.actual_engin]
    this.$actual_engin.emit(engin)
    this.combineEnginsTechFav()
  }

  // Change the default engin in the localStorage
  changeDefaultEngin(engin: string) {
    this.communicationSerice.updateDataToStorage(this.generalService.basicEnginLocalStorageVarName, engin)
  }

  // Add a Favorite Engin in the locaStorage
  addFavEngin(engin: EnginType) {
    // Vérifier si l'engin respecte les conditions
    if (this.favoriteEngins.filter((item) => item.engin_numero == engin.engin_numero).length != 0) {return;}
    if (engin.engin_numero === undefined) {return;}
    if (engin.engin_numero?.toString().length < 5) {return;}

    // Si l'engin est valide alors l'ajouter
    this.favoriteEngins.push(engin)
    this.communicationSerice.updateDataToStorage(this.generalService.enginFavLocalStorageVarName, this.favoriteEngins)
    this.updateFavEngin()
  }

  // Remove a Favorite Engin from the localStorage
  deleteFavEngin(engin: EnginType) {
    // Vérifier si l'engin respecte les conditions
    if (this.favoriteEngins.filter((item) => item.engin_numero == engin.engin_numero).length == 0) {return;}
    if (engin.engin_numero === undefined) {return;}
    if (engin.engin_numero?.toString().length < 5) {return;}

    // Si l'engin est valide alors supprimer
    this.favoriteEngins.splice(this.favoriteEngins.indexOf(engin), 1)
    this.communicationSerice.updateDataToStorage(this.generalService.enginFavLocalStorageVarName, this.favoriteEngins)
    this.updateFavEngin()
  }

  // Update the actual basic engin from the localStorage
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
  // Update the Favorite Engin from the localStorage
  updateFavEngin() {
    let favEnginLocalStorage = this.communicationSerice.getDataFromStorage(this.generalService.enginFavLocalStorageVarName)
    if (favEnginLocalStorage !== null) {
      this.favoriteEngins = favEnginLocalStorage
      console.log("Favorite engins : ", favEnginLocalStorage)
    }
    this.combineEnginsTechFav()
  }

  // Combine the engins from Technicentre and FavEngin
  combineEnginsTechFav() {
    this.combinedTechFavEngins = []
    for (let engin of this.favoriteEngins) {
      if (this.combinedTechFavEngins.filter((item) => item.engin_numero == engin.engin_numero).length == 0) {
        this.combinedTechFavEngins.push(engin)
      }
    }
    if (this.generalService.actualTechnicentre?.engins) {
      for (let engin of this.generalService.actualTechnicentre?.engins) {
        if (this.combinedTechFavEngins.filter((item) => item.engin_numero == engin.engin_numero).length == 0) {
          this.combinedTechFavEngins.push(engin)
        }
      }
    }
    this.combinedTechFavEngins = this.combinedTechFavEngins.filter((item) => item.engin == this.actual_engin)
  }

}
