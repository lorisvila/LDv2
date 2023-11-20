import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {DocFctService} from "../../services/doc-fct.service";
import {GeneralService} from "../../services/general.service";

@Component({
  selector: 'app-doc-fct-page',
  templateUrl: './doc-fct-page.component.html',
  styleUrls: ['./doc-fct-page.component.css']
})
export class DocFctPageComponent {

  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public docFctService: DocFctService
  ) {
  }

  protected readonly getSelection = getSelection;
  protected readonly Component = Component;
}
