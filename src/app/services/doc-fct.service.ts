import { Injectable } from '@angular/core';
import {ItemDataType} from "../app.types";

@Injectable({
  providedIn: 'root'
})
export class DocFctService {

  constructor( ) { }

  // Filters and selection
  search_value: string = "";
  selected_systemes: string[] = [];
  systemes = [
    {"systeme_formatted": "Afficheurs",         "systeme": "AFF"},
    {"systeme_formatted": "Anti-Enrayeurs",     "systeme": "AE"},
    {"systeme_formatted": "ATESS",              "systeme": "ATESS"},
    {"systeme_formatted": "Boucle inductive",   "systeme": "BI"},
    {"systeme_formatted": "Chaîne de traction", "systeme": "CT"},
    {"systeme_formatted": "Climatisation",      "systeme": "CLM"},
    {"systeme_formatted": "Comble lacune",      "systeme": "CL"},
    {"systeme_formatted": "Coupleur",           "systeme": "CMCF"},
    {"systeme_formatted": "Détection incendie", "systeme": "DI"},
    {"systeme_formatted": "Eclairage & Feux de signalisation", "systeme": "ECL"},
    {"systeme_formatted": "EMCO",               "systeme": "EMCO"},
    {"systeme_formatted": "Essuie vitre & Lave glace", "systeme": "EVLG"},
    {"systeme_formatted": "Générateur de sons", "systeme": "GS"},
    {"systeme_formatted": "GPS",                "systeme": "GPS"},
    {"systeme_formatted": "Indicateur de vitesse", "systeme": "IV"},
    {"systeme_formatted": "Manipulateur de traction / freinage", "systeme": "MPCOF"}
  ]

  // Methode executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    //console.log("Change variable " + variableName + " to value " + value)
    console.log(this.selected_systemes)
    console.log(value.detail.row)
    switch (variableName) {
      case "search_value": {
        this.search_value = value;
        break;
      }
      case "systeme": {
        if (value.detail.row.selected) {
          this.selected_systemes.push(value.detail.row.data.systeme); // Add a systeme element to the actualSystemes list
        } else {
          this.selected_systemes.splice(this.selected_systemes.indexOf(value.detail.row.data.systeme), 1); // Delete the systeme element from the list
        }
        break;
      }
    }
    console.log(this.selected_systemes)
  }

  filteredDocFctData: ItemDataType[] = []

  DocFctData: ItemDataType[] = [
    {
      "id": 2,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 02 E01",
      "ref_aux": "05-3 709 829",
      "des": "Schémas de câblage motrice 1 B81500 jusqu’à la rame B81545 (XAB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 829",
      "url_main_file": "assets/documents/LD/LD5200202E01_A-.pdf"
    },
    {
      "id": 3,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 02 E02",
      "ref_aux": "05-3 709 830",
      "des": "Schémas de câblage motrice 1 B81500 à partir de la rame B81547 et B82500 (XAB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 830",
      "url_main_file": "assets/documents/LD/LD5200202E02_A-.pdf"
    },
    {
      "id": 4,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E01",
      "ref_aux": "05-3 709 835",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) jusqu’à la rame X76563",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 835",
      "url_main_file": "assets/documents/LD/LD5200203E01_A-.pdf"
    },
    {
      "id": 5,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E02",
      "ref_aux": "05-3 709 836",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) à partir de la rame X76575",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 836",
      "url_main_file": "assets/documents/LD/LD5200203E02_A-.pdf"
    },
    {
      "id": 6,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 04 E01",
      "ref_aux": "05-3 709 839",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) jusqu’à la rame X76561",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 839",
      "url_main_file": "assets/documents/LD/LD5200204E01_A-.pdf"
    },
    {
      "id": 7,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 04 E02",
      "ref_aux": "05-3 709 840",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) à partir de la rame X76565",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 840",
      "url_main_file": "assets/documents/LD/LD5200204E02_A-.pdf"
    },
    {
      "id": 8,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 05 E01",
      "ref_aux": "05-3 712 347",
      "des": "Schémas de câblage Z27500 motrice 1 couplable (ZAC) rame Z27503",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200205E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 347",
      "url_main_file": "assets/documents/LD/LD4200205E01_A-.pdf"
    }
  ]

}
