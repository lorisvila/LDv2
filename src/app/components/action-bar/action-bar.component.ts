import {Component, Input} from '@angular/core';
import {WcsAngularModule} from "wcs-angular";
import {EnginService} from "../../services/engin.service";
import {Router} from "@angular/router";

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
    public enginService: EnginService,
    public router: Router
  ) {
  }

  @Input() pageName!: string;
  @Input() homeButton: boolean = true;

}
