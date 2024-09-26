import { Component } from '@angular/core';
import {GeneralService} from "../../../services/general.service";
import {AdministrationService} from "../../../services/administration.service";
import {WcsAngularModule} from "wcs-angular";
import {FormlyFieldConfig, FormlyModule} from "@ngx-formly/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import * as _ from "lodash";
import {FilterType} from "../../../app.types";

@Component({
  selector: 'app-filter-element',
  standalone: true,
  imports: [
    WcsAngularModule,
    FormlyModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './filter-element.component.html',
  styleUrl: './filter-element.component.css'
})
export class FilterElementComponent {

  constructor(
    public generalService: GeneralService,
    public administrationService: AdministrationService,
    public dataService: DataService,
  ) {
  }

  // Modals
  showModalConfirmDelete: boolean = false

  // Forms
  filterAddFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'type',
          key: 'type',
          type: 'select',
          props: {
            label: 'Type de filtre',
            placeholder: 'Système',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.filterTypes.map(({type, type_formatted}) => ({ value: type, label: type_formatted }))
            }
          }
        },
        {
          id: 'engin',
          key: 'engin',
          type: 'select',
          props: {
            label: 'Engin affecté',
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
          id: 'page',
          key: 'page',
          type: 'select',
          props: {
            label: 'Page',
            placeholder: 'AGC',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.webPages.map(({title, title_formatted}) => ({ value: title, label: title_formatted }))
            }
          }
        },
        {
          id: 'filter',
          key: 'filter',
          type: 'input',
          props: {
            label: 'Filtre côté application',
            placeholder: 'AE',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          }
        },
        {
          id: 'filter_formatted',
          key: 'filter_formatted',
          type: 'input',
          props: {
            label: 'Filtre côté humain',
            placeholder: 'Anti-Enrayeurs',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          }
        },
      ]
    }
  ]
  filterEditToModifFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'type_to_modif',
          key: 'type_to_modif',
          type: 'select',
          props: {
            label: 'Type de filtre',
            placeholder: 'Système',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.filterTypes.map(({type, type_formatted}) => ({ value: type, label: type_formatted }))
            }
          }
        },
        {
          id: 'engin_to_modif',
          key: 'engin_to_modif',
          type: 'select',
          props: {
            label: 'Engin affecté',
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
          id: 'page_to_modif',
          key: 'page_to_modif',
          type: 'select',
          props: {
            label: 'Page',
            placeholder: 'AGC',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.webPages.map(({title, title_formatted}) => ({ value: title, label: title_formatted }))
            }
          }
        },
        {
          id: 'filter_to_modif',
          key: 'filter_to_modif',
          type: 'select',
          props: {
            label: 'Filtre à modifier',
            placeholder: 'AE',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m",
            multiple: false
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.filters.filter((filter) => (filter.engin == field.model.engin_to_modif && filter.type == field.model.type_to_modif && filter.page == field.model.page_to_modif)).map(({filter, filter_formatted}) => ({ value: filter, label: filter_formatted }))
            }
          }
        }
      ]
    }
  ]
  filterEditFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'type',
          key: 'type',
          type: 'select',
          props: {
            label: 'Type de filtre',
            placeholder: 'Système',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.filterTypes.map(({type, type_formatted}) => ({ value: type, label: type_formatted }))
            }
          }
        },
        {
          id: 'engin',
          key: 'engin',
          type: 'select',
          props: {
            label: 'Engin affecté',
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
          id: 'page',
          key: 'page',
          type: 'select',
          props: {
            label: 'Page',
            placeholder: 'AGC',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.webPages.map(({title, title_formatted}) => ({ value: title, label: title_formatted }))
            }
          }
        },
        {
          id: 'filter',
          key: 'filter',
          type: 'input',
          props: {
            label: 'Filtre côté application',
            placeholder: 'AE',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          }
        },
        {
          id: 'filter_formatted',
          key: 'filter_formatted',
          type: 'input',
          props: {
            label: 'Filtre côté humain',
            placeholder: 'Anti-Enrayeurs',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          }
        },
      ]
    }
  ]

  // Getters
  public get readyAddFilter() {
    return this.administrationService.filterAddForm.status == 'VALID'
  }
  public get readyEditFilter() {
    let backup = this.administrationService.filterEditBackup;
    let model = this.administrationService.filterEditFormModel;
    let check: boolean = false;
    ['engin', 'page', 'filter', 'filter_formatted', 'type'].forEach((key) => {
      if (backup && model && backup[key as keyof FilterType] !== model[key as keyof FilterType]) {
        check = true
      }
    })
    return check
  }

}
