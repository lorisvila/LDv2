import { Component } from '@angular/core';
import { EnginService } from "../../services/engin.service";

@Component({
  selector: 'app-ld-page',
  templateUrl: './ld-page.component.html',
  styleUrls: ['./ld-page.component.css']
})
export class LDPageComponent {

  constructor(
    public enginService: EnginService
  ) {}

  types_engin: [] = this.enginService.type_engin[this.enginService.actual_engin as keyof typeof this.enginService.type_engin]

}
