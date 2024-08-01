import {Component, OnInit} from '@angular/core';
import {WcsAngularModule} from "wcs-angular";
import {AdministrationService} from "../../../services/administration.service";
import {DatePipe, formatDate, NgIf} from "@angular/common";

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
    public administrationService: AdministrationService
  ) {
  }
}
