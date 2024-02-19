import {EventEmitter, Injectable} from '@angular/core';
import {AppEnginType, EnginType, TechnicentreType} from "../app.types";
import {GeneralService} from "./general.service";
import {CommunicationService} from "./communication.service";
import {DataService} from "./data.service";
import {ToastrService} from "ngx-toastr";
import {SearchService} from "./search.service";

@Injectable({
  providedIn: 'root'
})
export class EnginService {

  $actual_engin: EventEmitter<AppEnginType> = new EventEmitter<AppEnginType>();

  actual_engin: AppEnginType = this.dataService.engins[0];

  types_engin: {[Name: string]: string[]} = {}; // Be able in ng for loops to use the correct engin to get their engins types
  actual_types_engin: string[] = [];

  favoriteEngins: EnginType[] = []

  combinedTechFavEngins: {engins_fav: EnginType[], engins_technicentre: EnginType[]} = {engins_fav: [], engins_technicentre: []}

  constructor(
    public generalService: GeneralService,
    public communicationSerice: CommunicationService,
    public notif: ToastrService,
    public dataService: DataService,
    public searchService: SearchService
  ) {
    // Subscribe to event EventEmitters from other services
    this.generalService.$updateTechnicentre.subscribe((technicentre) => {
      this.combineEnginsTechFav()
    })
    this.generalService.$updateEngin.subscribe((engin) => {
      this.changeActualEngin(engin)
    })
    this.generalService.$updateFavEngins.subscribe((favEngins) => {
      this.favoriteEngins = favEngins
    })
    // Populate the "types_engin" variable
    this.dataService.engins.forEach((item) => this.types_engin[item.engin] = item.types_engin)

    this.generalService.$enginServiceInitialized.emit(true)

    // Set the combined Technicentre and Favorites engins
    this.combineEnginsTechFav()
    // Listen to a change in Technicentre to update the combined Fav Engin + Tech list
  }

  returnAppEnginObjectFromString(engin_as_string: string): AppEnginType | undefined {
    return this.dataService.engins.find((engin) => engin.engin == engin_as_string)
  }
  returnTechnicentreObjectFromString(technicentre_as_string: string): TechnicentreType | undefined {
    return this.dataService.technicentres.find((technicentre) => technicentre.technicentre == technicentre_as_string)
  }

  // Change the actual engin var + send a event for the listeners in other services / components
  changeActualEngin(engin: AppEnginType){
    this.actual_engin = engin
    this.searchService.$actualEngin.emit(engin)
    this.actual_types_engin = this.types_engin[this.actual_engin.engin]
    this.$actual_engin.emit(engin)
    this.combineEnginsTechFav()
  }

  // Change the default engin in the localStorage
  changeDefaultEngin(engin_as_string: string) {
    let enginObject = this.returnAppEnginObjectFromString(engin_as_string)
    if (!enginObject) {
      this.generalService.notif.error("Problème dans la récupération de l'engin", "Aïe...")
      return
    }
    this.communicationSerice.updateDataToStorage(this.communicationSerice.defaultEnginLocalStorageVarName, enginObject)
    this.notif.success("Engin " + engin_as_string + " selectionné !", "C'est bon !")
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
    location.reload()
    this.communicationSerice.updateDataToStorage(this.communicationSerice.favEnginLocalStorageVarName, this.favoriteEngins)
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
    this.communicationSerice.updateDataToStorage(this.communicationSerice.favEnginLocalStorageVarName, this.favoriteEngins)
    location.reload()
    this.notif.success("L'engin " + engin.engin + " " + engin.engin_type + " " + engin.engin_numero + " a bien été supprimé !", "C'est bon !")
  }

  // Combine the engins from Technicentre and FavEngin
  combineEnginsTechFav() {
    this.combinedTechFavEngins = {engins_fav: [], engins_technicentre: []}
    for (let engin of this.favoriteEngins) {
      if (this.combinedTechFavEngins.engins_fav.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
          this.combinedTechFavEngins.engins_technicentre.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
          engin.engin == this.actual_engin.engin) {
        this.combinedTechFavEngins.engins_fav.push(engin)
      }
    }
    if (this.generalService.actualTechnicentre?.engins) {
      for (let engin of this.generalService.actualTechnicentre?.engins) {
        if (this.combinedTechFavEngins.engins_fav.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
            this.combinedTechFavEngins.engins_technicentre.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
            engin.engin == this.actual_engin.engin) {
          this.combinedTechFavEngins.engins_technicentre.push(engin)
        }
      }
    }
  }

}
