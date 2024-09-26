import { Component } from '@angular/core';
import {GeneralService} from "../../../services/general.service";
import {AdministrationService} from "../../../services/administration.service";
import {DataService} from "../../../services/data.service";
import {WcsAngularModule} from "wcs-angular";
import {FormlyFieldConfig, FormlyModule} from "@ngx-formly/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WcsCellFormatter} from "wcs-core";
import {WcsGridRow, WcsGridRowData} from "wcs-core/dist/types/components/grid/grid-interface";

@Component({
  selector: 'app-engin-tech-element',
  standalone: true,
  imports: [
    WcsAngularModule,
    FormlyModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './engin-tech-element.component.html',
  styleUrl: './engin-tech-element.component.css'
})
export class EnginTechElementComponent {

  constructor(
    public generalService: GeneralService,
    public administrationService: AdministrationService,
    public dataService: DataService,
  ) {
  }

  // Getters
  public get enginsTechnicentre() {
    return this.dataService.technicentres.find(technicentre => technicentre.technicentre == this.administrationService.enginTechAddFormModel.technicentre)?.engins
  }
  public get readyAddEnginTechnicentre() {
    return this.administrationService.enginTechAddForm.valid
  }
  public get readyAddTechnicentre() {
    return this.administrationService.technicentreAddForm.valid
  }

  // Forms
  enginTechAddFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'technicentre',
          key: 'technicentre',
          type: 'select',
          props: {
            label: 'Technicentre',
            placeholder: 'Technicentre Industriel de Bischheim',
            required: true,
            styles: {
              input: {width: "25em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.technicentres.map(({technicentre, technicentre_formatted}) => ({ value: technicentre, label: technicentre_formatted }))
            }
          }
        },
      ]
    }
  ]
  enginTech2AddFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [

        {
          id: 'engin',
          key: 'engin',
          type: 'select',
          props: {
            label: 'Engin',
            placeholder: 'AGC',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.engins.map(({engin}) => ({ value: engin, label: engin }))
            }
          }
        },
        {
          id: 'engin_type',
          key: 'engin_type',
          type: 'select',
          props: {
            label: "Type d'engin",
            placeholder: 'BGC',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.engins.find(engin => engin.engin == field.model.engin)?.types_engin.map((engin_type) => ({ value: engin_type, label: engin_type }))
            }
          }
        },
        {
          id: 'engin_numero',
          key: 'engin_numero',
          type: 'input',
          props: {
            label: "Numéro d'engin",
            prefixLabel: 'prefix',
            placeholder: '76559',
            required: true,
            styles: {
              input: {width: "15em"},
            },
          },
          expressions: {
            'props.prefixLabel': (field: FormlyFieldConfig) => {
              return field.model.engin_type
            }
          }
        },

      ]
    }
  ]

  technicentreAddFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'technicentre',
          key: 'technicentre',
          type: 'input',
          props: {
            label: "Technicentre abgrégé",
            placeholder: 'TI_BHM',
            required: true,
            styles: {
              input: {width: "10em"},
            },
          },
        },
        {
          id: 'technicentre_formatted',
          key: 'technicentre_formatted',
          type: 'input',
          props: {
            label: "Technicentre",
            placeholder: 'Technicentre Industriel de Bischheim',
            required: true,
            styles: {
              input: {width: "25em"},
            },
          },
        },
      ]
    }
  ]

}
