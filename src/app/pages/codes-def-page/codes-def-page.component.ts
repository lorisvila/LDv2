import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {CodesDefService} from "../../services/codes-def.service";
import {FormlyFieldConfig} from "@ngx-formly/core";

@Component({
  selector: 'app-codes-def',
  templateUrl: './codes-def-page.component.html',
  styleUrls: ['./codes-def-page.component.css']
})
export class CodesDefPageComponent {

  constructor(
    public enginService: EnginService,
    public codesDefService: CodesDefService,
  ) {
  }

  searchBarFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'code',
          key: 'code',
          type: 'input',
          props: {
            type: 'text',
            label: "Code défaut",
            placeholder: 'ex: 5314',
            required: true,
          }
        },
        {
          id: 'calculateur',
          key: 'calculateur',
          type: 'select',
          defaultValue: '',
          props: {
            label: "Calculateur",
            options: [
              {value: '', label: 'Tous', class: 'bold'},
              {value: 'SIE', label: 'SIE'},
              {value: 'FPC24', label: 'FPC24'},
              {value: 'PCU', label: 'PCU / Traction'},
              {value: 'ODBS', label: 'ODBS / Traction'},
              {value: 'HARDI', label: 'HARDI / Comble lacune'},
            ],
            styles: {
              input: {
                width: '12em'
              }
            }
          },
          expressions: {
          }
        },
      ]
    }
  ]

}
