import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {DocFctServiceService} from "../../services/doc-fct-service.service";

@Component({
  selector: 'app-doc-fct-page',
  templateUrl: './doc-fct-page.component.html',
  styleUrls: ['./doc-fct-page.component.css']
})
export class DocFctPageComponent {

  constructor(
    public enginService: EnginService,
    public docFctService: DocFctServiceService
  ) {
  }

}
