import { Component } from '@angular/core';
import { EnginService } from "../../services/engin.service";
import {LdService} from "../../services/ld.service";
import {GeneralService} from "../../services/general.service";
import {DataService} from "../../services/data.service";
import {AdministrationService} from "../../services/administration.service";
import {FormlyFieldConfig} from "@ngx-formly/core";

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
    public dataService: DataService,
    public administrationService: AdministrationService
  ) {}

  public get favEnginSelected() {
    return this.ldService.filterFormModel.fav_engin
  }

  filterFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: "rowForm",
      fieldGroup: [
        {
          id: 'fav_engin',
          key: 'fav_engin',
          type: 'select',
          props: {
            label: 'N° Engin rapide',
            placeholder: 'X76...',
            styles: {
              input: {width: "12em"},
            },
            size: "m"
          },
          expressionProperties: {
            'wcsChange': (model, formState, field) => {
              this.ldService.updateFilteredData()
            },
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              let list: any = []
              let combinedEngins = this.enginService.combinedEnginsTechFav
              list = this.favEnginSelected ? [...list, {value: '', label: 'Désélectionner', class: 'bold'}] : [...list]
              list = [...list, {value: 'Technicentre', label: 'Technicentre', disabled: true}]
              list = combinedEngins.engins_technicentre ? [...list, ...combinedEngins.engins_technicentre.map(({engin, engin_type, engin_numero}) => ({value: `${engin}_${engin_type}_${engin_numero}`, label: `${engin_type} ${engin_numero}`}))] : [...list, {value: 'Technicentre_Vide', label: 'Vide...', disabled: true}]
              list = [...list, {value: 'Favoris', label: 'Favoris', disabled: true}]
              list = combinedEngins.engins_fav ? [...list, ...combinedEngins.engins_fav.map(({engin, engin_type, engin_numero}) => ({value: `${engin}_${engin_type}_${engin_numero}`, label: `${engin_type} ${engin_numero}`}))] : [...list, {value: 'Technicentre_Vide', label: 'Vide...', disabled: true}]
              return list
            },
            'props.wcsChange': (field: FormlyFieldConfig) => {
              if (field.id == 'fav_engin' && field.model.fav_engin) {
                field.form?.get('engin_type')?.setValue(field.model.fav_engin.split('_')[1])
                field.form?.get('engin_numero')?.setValue(field.model.fav_engin.split('_')[2])
              }
            }
          }
        },
        {
          id: 'engin_type',
          key: 'engin_type',
          type: 'select',
          props: {
            label: "Type d'engin",
            placeholder: 'XGC',
            styles: {
              input: {width: "10em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              let values: any = []
              values = field.model.engin_type ? [...values, {value: '', label: 'Désélectionner', class: 'bold'}] : [...values]
              values = [...values, ...this.enginService.actual_engin.types_engin.map((engin) => ({value: engin, label: engin}))]
              return values
            },
            'props.disabled': (field: FormlyFieldConfig) => {
              return this.favEnginSelected
            }
          }
        },
        {
          id: 'engin_numero',
          key: 'engin_numero',
          type: 'input',
          props: {
            label: "Numéro d'engin",
            placeholder: '76...',
            styles: {
              input: {width: "10em"},
            },
            maxLength: 5,
            type: "number",
            min: 0,
            max: 99999,
          },
          expressions: {
            'props.prefixLabel': (field: FormlyFieldConfig) => {
              return field.model.engin_type
            },
            'props.disabled': (field: FormlyFieldConfig) => {
              return this.favEnginSelected
            }
          }
        },
        {
          id: 'meta.systeme',
          key: 'meta.systeme',
          type: 'select',
          props: {
            label: "Système / Fonction",
            placeholder: "Motrice",
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              let values: any = []
              values = field.model.meta?.systeme ? [...values, {value: '', label: 'Désélectionner', class: 'bold'}] : [...values]
              values = [...values, ...this.dataService.filters.filter((filter) => filter.type == 'systeme' && filter.engin == this.enginService.actual_engin.engin && filter.page == 'ld').map(({filter, filter_formatted}) => ({value: filter, label: filter_formatted}))]
              return values
            }
          }
        },
        {
          id: 'meta.type',
          key: 'meta.type',
          type: 'select',
          props: {
            label: "Type",
            placeholder: "Schémas",
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              let values: any = []
              values = field.model.meta?.type?.filter ? [...values, {value: '', label: 'Désélectionner', class: 'bold'}] : [...values]
              values = [...values, ...this.dataService.filters.filter((filter) => filter.type == 'type' && filter.engin == this.enginService.actual_engin.engin && filter.page == 'ld').map(({filter, filter_formatted}) => ({value: filter, label: filter_formatted}))]
              return values
            }
          }
        },
        {
          id: 'recherche',
          key: 'recherche',
          type: 'input',
          props: {
            label: "Recherche textuelle",
            placeholder: 'Schémas motrice',
            styles: {
              input: {width: "20em"},
            }
          },
        },
      ]
    }
  ]

  protected readonly alert = alert;
}
