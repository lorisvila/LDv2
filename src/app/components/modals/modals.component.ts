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
    this.generalService.changeTechnicentre(technicentre)
  }

  // Function to interface the request for adding a Favorite Engin to the Local Storage
  addFavEngin(engin: string, engin_type: string, engin_numero: number | string | null | undefined) {
    if (engin_numero !== undefined && engin_numero != "" && typeof engin_numero === "string") {
      if (engin_numero.split("").length >= 5) { // TODO : Rajouter message d'erreur n° d'engin trop court...
        let objetEngin: EnginType = {
          "engin": engin,
          "engin_type": engin_type,
          "engin_numero": Number.parseInt(engin_numero)
        }
        this.enginService.addFavEngin(objetEngin)
        this.inputNumberEngin = ""
      }
    }
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
