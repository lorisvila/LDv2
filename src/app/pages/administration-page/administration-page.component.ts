import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {GeneralService} from "../../services/general.service";
import {DataService} from "../../services/data.service";
import {AdministrationService} from "../../services/administration.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemDataType} from "../../app.types";

@Component({
  selector: 'app-administration-page',
  templateUrl: './administration-page.component.html',
  styleUrls: ['./administration-page.component.css']
})
export class AdministrationPageComponent {

  constructor(
    public enginService: EnginService,
    public generalService: GeneralService,
    public dataService: DataService,
    public administrationService: AdministrationService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.route.fragment.subscribe((fragment) => {
      this.selectedPageFromUrl = fragment
    })
  }

  selectedPageFromUrl: string | null = null

  changeUrlToTab(event: any) {
    let new_tab = event.detail.selectedKey
    if (new_tab == 'ajout') {
      this.administrationService.prepareUIcreateDoc()
    }
    this.selectedPageFromUrl = new_tab
    this.router.navigate( [ '/administration' ], { fragment: new_tab } )
  }

}
