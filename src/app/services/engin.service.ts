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

  favoriteEngins: EnginType[] = []

  constructor(
    public generalService: GeneralService,
    public communicationSerice: CommunicationService,
    public notif: ToastrService,
    public dataService: DataService,
    public searchService: SearchService
  ) {
    // Subscribe to event EventEmitters from other services
    this.generalService.$updateEngin.subscribe((engin) => {
      this.changeActualEngin(engin)
    })
    this.generalService.$updateFavEngins.subscribe((favEngins) => {
      this.favoriteEngins = favEngins
    })
    // Populate the "types_engin" variable
    this.changeActualEngin(this.actual_engin)

    this.generalService.$enginServiceInitialized.emit(true)

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
    this.$actual_engin.emit(engin)
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
    if (!engin.engin || !engin.engin_type) {
      this.notif.error("Il manque une donnée dans votre engin...")
      return;
    }
    if (engin.engin_numero?.toString().length < 5) {
      this.notif.warning("Votre numéro d'engin n'est pas assez long pour un numéro SNCF...", "Aïe...")
      return;
    }

    // Si l'engin est valide alors l'ajouter
    this.favoriteEngins = [...this.favoriteEngins, engin];
    this.communicationSerice.updateDataToStorage(this.communicationSerice.favEnginLocalStorageVarName, this.favoriteEngins)
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
    this.favoriteEngins = this.favoriteEngins.filter((item) => !(item.engin_numero == engin.engin_numero && item.engin_type == engin.engin_type && item.engin == engin.engin))
    this.communicationSerice.updateDataToStorage(this.communicationSerice.favEnginLocalStorageVarName, this.favoriteEngins)
  }

  // Combine the engins from Technicentre and FavEngin
  public get combinedEnginsTechFav() {
    let combinedTechFavEngins: {engins_fav: EnginType[], engins_technicentre: EnginType[]} = {engins_fav: [], engins_technicentre: []}
    this.favoriteEngins.forEach(engin => {
      if (combinedTechFavEngins.engins_fav.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
          combinedTechFavEngins.engins_technicentre.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
          engin.engin == this.actual_engin.engin) {
        combinedTechFavEngins.engins_fav = combinedTechFavEngins.engins_fav ? [...combinedTechFavEngins.engins_fav, engin] : [engin]
      }
    })
    if (this.generalService.actualTechnicentre?.engins) {
      this.generalService.actualTechnicentre?.engins.forEach(engin => {
        if (combinedTechFavEngins.engins_fav.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
            combinedTechFavEngins.engins_technicentre.filter((item) => item.engin_numero == engin.engin_numero).length == 0 &&
            engin.engin == this.actual_engin.engin) {
          combinedTechFavEngins.engins_technicentre = combinedTechFavEngins.engins_technicentre ? [...combinedTechFavEngins.engins_technicentre, engin] : [engin]
        }
      })
    }
    return combinedTechFavEngins
  }

}
