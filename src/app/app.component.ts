import { Component } from '@angular/core';
import {GeneralService} from "./services/general.service";

@Component({
  selector: 'app-root',
	templateUrl: "app.component.html",
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'ld-main';

  constructor(
    public generalService: GeneralService
  ) {
  }

}
