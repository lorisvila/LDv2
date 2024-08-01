import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {SearchService} from "../../services/search.service";
import {Router} from "@angular/router";
import {GeneralService} from "../../services/general.service";
import {FilterType} from "../../app.types";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {

  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public searchService: SearchService,
    public router: Router
  ) {
    // Redirect user if no search...
    if (!searchService.searchedObjects) {
      this.router.navigate([""])
    }
  }

  getKeys(obj: any): Array<string> {
    return Object.keys(obj);
  }

  returnFilterObject(objects: any, key: string): FilterType {
    return objects[key]
  }

}
