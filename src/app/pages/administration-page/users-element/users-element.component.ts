import {Component, OnInit} from '@angular/core';
import {WcsAngularModule} from "wcs-angular";
import {AdministrationService} from "../../../services/administration.service";
import {DatePipe, formatDate, NgIf} from "@angular/common";
import {WcsGridRowData} from "wcs-core/dist/types/components/grid/grid-interface";
import {GeneralService} from "../../../services/general.service";

@Component({
  selector: 'app-users-element',
  standalone: true,
  imports: [
    WcsAngularModule,
    DatePipe,
    NgIf
  ],
  templateUrl: './users-element.component.html',
  styleUrl: './users-element.component.css'
})
export class UsersElementComponent {

  constructor(
    public administrationService: AdministrationService,
    public generalService: GeneralService,
  ) {
  }

  dateFormatter(createElement: any, _: any, rowData: WcsGridRowData) {
    return createElement('span', {}, "Dernière connexion : " + new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Europe/Paris',
    }).format(rowData.data.lastConnect));
  }

}
