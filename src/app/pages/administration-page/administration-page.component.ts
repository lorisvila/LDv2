import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {GeneralService} from "../../services/general.service";
import {DataService} from "../../services/data.service";
import {CommunicationService} from "../../services/communication.service";
import {AdministrationService} from "../../services/administration.service";
import {ActivatedRoute, Router} from "@angular/router";

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
    public communicationService: CommunicationService,
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
    this.selectedPageFromUrl = new_tab
    this.router.navigate( [ '/administration' ], { fragment: new_tab } )
  }

}
