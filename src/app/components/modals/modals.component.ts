import { Component } from '@angular/core';
import {GeneralService} from "../../services/general.service";
import {EnginService} from "../../services/engin.service";
import {DataService} from "../../services/data.service";
import {EnginType} from "../../app.types";

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent {
  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public dataService: DataService
  ) { }

  // Var for the selected values of the fav engin grid
  selectionFavEngin: EnginType[] = []
  inputNumberEngin: string = ""

  // Modal Default Engin
  setDefaultEngin(engin: string) {
    this.generalService.toggleModal("defaultEnginModal", false)
    this.enginService.changeDefaultEngin(engin)
  }

  // Modal choix Technicentre + Rajout engin
  setTechnicentre(technicentre: string) {
    this.generalService.toggleModal("technicentreEnginModal", false)
    let selectedTechnicentre = this.dataService.technicentres.filter((item) => item.technicentre == technicentre)[0]
    if (selectedTechnicentre === undefined) {
      this.generalService.notif.error("Problème dans la récupération du Technicentre", "Aïe...")
      return;
    }
    this.generalService.changeTechnicentre(selectedTechnicentre)
  }

  // Function to interface the request for adding a Favorite Engin to the Local Storage
  addFavEngin(engin: string, engin_type: string, engin_numero: number | string | null | undefined) {
    // TODO : Rajouter message d'erreur n° d'engin trop court ou trop long --> <= 7 car je ne sais pas trop encore...
    let engin_num_formatted: number = 0
    if (typeof engin_numero == "string") {
      engin_num_formatted = Number.parseInt(engin_numero)
    }
    if (engin_numero == undefined) {
      engin_num_formatted = 0
    }
    let objetEngin: EnginType = {
      "engin": engin,
      "engin_type": engin_type,
      "engin_numero": engin_num_formatted
    }
    this.enginService.addFavEngin(objetEngin)
    this.inputNumberEngin = ""
  }
  // Update the currrent selection of engins in the grid
  updateSelectedFavEngin(event: any, type: string) {
    switch (type) {
      case "single": { // ajouter ou supprimer un élement quand il coche 1 fois
        if (event.detail.row.selected) {
          this.selectionFavEngin.push(event.detail.row.data)
        } else {
          this.selectionFavEngin.splice(this.selectionFavEngin.indexOf(event.detail.row.data), 1)
        }
        break;
      }
      case "all": { // ajouter ou supprimer tous les élements
        if (event.detail.rows.length > 0) {
          for (let engin of event.detail.rows) {
            this.selectionFavEngin.push(engin.data)
          }
        } else {
          this.selectionFavEngin = []
        }
        break;
      }
    }
  }

  deleteFavEngins() {
    for (let engin of this.selectionFavEngin) {
      this.enginService.deleteFavEngin(engin)
    }
  }

}
