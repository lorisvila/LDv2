import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";

@Component({
  selector: 'app-codes-def',
  templateUrl: './codes-def-page.component.html',
  styleUrls: ['./codes-def-page.component.css']
})
export class CodesDefPageComponent {

  constructor(
    public enginService: EnginService,
  ) {
  }

}
