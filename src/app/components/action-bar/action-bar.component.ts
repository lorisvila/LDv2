import {Component, Input} from '@angular/core';
import {WcsAngularModule} from "wcs-angular";
import {EnginService} from "../../services/engin.service";
import {Router} from "@angular/router";
import {GeneralService} from "../../services/general.service";

@Component({
  selector: 'app-action-bar',
  standalone: true,
    imports: [
        WcsAngularModule
    ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.css'
})
export class ActionBarComponent {

  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public router: Router
  ) {
  }

  @Input() pageName!: string;
  @Input() homeButton: boolean = true;
  @Input() refreshButton: boolean = true;

}
