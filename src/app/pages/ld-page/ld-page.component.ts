import { Component } from '@angular/core';
import { EnginService } from "../../services/engin.service";
import {LdService} from "../../services/ld.service";
import {GeneralService} from "../../services/general.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-ld-page',
  templateUrl: './ld-page.component.html',
  styleUrls: ['./ld-page.component.css']
})
export class LDPageComponent {

  constructor(
    public enginService: EnginService,
    public ldService: LdService,
    public generalService: GeneralService,
    public dataService: DataService
  ) {}

  protected readonly open = open;
}
