import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocFctServiceService {

  constructor() { }

  // Filters and selection
  shortcut: string = "showAll";
  shortcuts = {
    "showAll": "Tout afficher",
    "schemas_elec": "Schémas Electriques",
    "cde_ded": "Codes défauts"
  };
  search_value: string = "";

  // Function to reset all the filter elements
  reinitFormValues() {
    this.changeValueFilter("shortcut", "showAll");
    this.changeValueFilter("search_value", "");
  }

  // Methode executed when a event is triggered on a filter element (the element call it in the DOM)
  changeValueFilter(variableName: string, value: any) {
    console.log("Change variable " + variableName + " to value " + value)
    switch (variableName) {
      case "shortcut": {
        this.shortcut = value;
        break;
      }
      case "search_value": {
        this.search_value = value;
        break;
      }
    }
  }

}
