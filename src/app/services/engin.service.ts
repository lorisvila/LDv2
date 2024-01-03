import {AfterContentInit, EventEmitter, Injectable, Output} from '@angular/core';
import {EnginType} from "../app.types";
import {GeneralService} from "./general.service";
import {CommunicationService} from "./communication.service";
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {SearchService} from "./search.service";

@Injectable({
  providedIn: 'root'
})
export class EnginService {

  @Output() $actual_engin: EventEmitter<string> = new EventEmitter<string>();

  actual_engin: string = "";

  types_engin: {[Name: string]: string[]} = {}; // TODO : Safe delete this station
  actual_type_engin: string[] = [];
  hasDefaultEngin: boolean = false;

  favoriteEngins: EnginType[] = []

  combinedTechFavEngins: {engins_fav: EnginType[], engins_technicentre: EnginType[]} = {engins_fav: [], engins_technicentre: []}

  constructor(
    public generalService: GeneralService,
    public searchService: SearchService,
    public communicationSerice: CommunicationService,
    public notif: ToastrService,
    public dataService: DataService
  ) {
    // Populate the "types_engin" variable
    this.engins.forEach((item) => this.types_engin[item.engin] = item.types_engin)

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
    this.searchService.actual_engin = engin
    this.searchService.$actual_engin.emit(engin)
    this.combineEnginsTechFav()
  }

  // Change the default engin in the localStorage
  changeDefaultEngin(engin: string) {
    this.communicationSerice.updateDataToStorage(this.generalService.basicEnginLocalStorageVarName, engin)
    this.notif.success("Engin " + engin + " ajouté !", "C'est bon !")
  }

  // Add a Favorite Engin in the locaStorage
  addFavEngin(engin: EnginType) {
    // Vérifier si l'engin respecte les conditions
    if (this.favoriteEngins.filter((item) => item.engin_numero == engin.engin_numero).length != 0) {
      this.notif.warning("L'engin existe déjà dans votre liste d'engins favoris...", "Aïe...")
      return;
    }
    if (engin.engin_numero === undefined || engin.engin_numero === 0) {
      this.notif.error("Erreur dans le numéro d'engin...", "Aïe...")
      return;
    }
    if (engin.engin_numero?.toString().length < 5) {
      this.notif.warning("Votre numéro d'engin n'est pas assez long pour un numéro SNCF...", "Aïe...")
      return;
    }

    // Si l'engin est valide alors l'ajouter
    this.favoriteEngins.push(engin)
    this.communicationSerice.updateDataToStorage(this.generalService.enginFavLocalStorageVarName, this.favoriteEngins)
    this.updateFavEngin()
    this.notif.success("L'engin " + engin.engin + " " + engin.engin_type + " " + engin.engin_numero + " a bien été ajouté !", "C'est bon !")
  }

  // Remove a Favorite Engin from the localStorage
  deleteFavEngin(engin: EnginType) {
    // Vérifier si l'engin respecte les conditions
    if (this.favoriteEngins.filter((item) => item.engin_numero == engin.engin_numero).length == 0) {
      this.notif.warning("L'engin n'existe pas dans votre liste d'engins favoris...", "Aïe...")
      return;
    }
    if (engin.engin_numero === undefined) {
      this.notif.error("Erreur dans le numéro d'engin...", "Aïe...")
      return;
    }
    if (engin.engin_numero?.toString().length < 5) {
      this.notif.warning("Votre numéro d'engin n'est pas assez long pour un numéro SNCF...", "Aïe...")
      return;
    }

    // Si l'engin est valide alors supprimer
    this.favoriteEngins.splice(this.favoriteEngins.indexOf(engin), 1)
    this.communicationSerice.updateDataToStorage(this.generalService.enginFavLocalStorageVarName, this.favoriteEngins)
    this.updateFavEngin()
    this.notif.success("L'engin " + engin.engin + " " + engin.engin_type + " " + engin.engin_numero + " a bien été supprimé !", "C'est bon !")
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
    this.combinedTechFavEngins = {engins_fav: [], engins_technicentre: []}
    for (let engin of this.favoriteEngins) {
      if (this.combinedTechFavEngins.engins_fav.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
          this.combinedTechFavEngins.engins_technicentre.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
          engin.engin == this.actual_engin) {
        this.combinedTechFavEngins.engins_fav.push(engin)
      }
    }
    if (this.generalService.actualTechnicentre?.engins) {
      for (let engin of this.generalService.actualTechnicentre?.engins) {
        if (this.combinedTechFavEngins.engins_fav.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
            this.combinedTechFavEngins.engins_technicentre.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
            engin.engin == this.actual_engin) {
          this.combinedTechFavEngins.engins_technicentre.push(engin)
        }
      }
    }
  }

}
