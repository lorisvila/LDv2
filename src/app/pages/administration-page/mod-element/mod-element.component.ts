import { Component } from '@angular/core';
import {WcsAngularModule} from "wcs-angular";
import {FormlyFieldConfig, FormlyModule} from "@ngx-formly/core";
import {FormsModule, ReactiveFormsModule, UntypedFormGroup} from "@angular/forms";
import {AdministrationService} from "../../../services/administration.service";
import {DataService} from "../../../services/data.service";
import {EnginService} from "../../../services/engin.service";
import {NgForOf} from "@angular/common";
import {FilterType, ItemDataType, LinkType} from "../../../app.types";
import * as _ from "lodash";
import {WcsCellFormatter} from "wcs-core";

@Component({
  selector: 'app-mod-element',
  standalone: true,
  imports: [
    WcsAngularModule,
    FormlyModule,
    FormsModule,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './mod-element.component.html',
  styleUrl: './mod-element.component.css'
})
export class ModElementComponent {

  constructor(
    public administrationService: AdministrationService,
    public dataService: DataService,
    public enginService: EnginService,
  ) {
  }

  showModalConfirmDelete: boolean = false;

  // Forms
  documentEditFormFilters = new UntypedFormGroup({});
  documentEditFormFiltersModel = {};
  documentEditFormTags = new UntypedFormGroup({});
  documentEditFormTagsModel = {};
  documentEditFormLinks = new UntypedFormGroup({});
  documentEditFormLinksModel = {};

  forms: UntypedFormGroup[] = [
    this.documentEditFormFilters,
    this.documentEditFormTags,
    this.documentEditFormLinks,
    this.administrationService.documentEditForm
  ]

  // Fields for forms
  // Exemple à : https://gitlab.com/SNCF/wcs/-/blob/master/example/angular/src/app/formly-example/formly-example.component.ts
  documentEditFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'columnForm editDocForm',
      fieldGroup: [
        {
          id: 'name',
          key: 'name',
          type: 'input',
          props: {
            label: 'Désignation',
            placeholder: 'Schémas généralités B82500',
            required: true,
            size: "m"
          }
        },
        {
          id: 'ref_main',
          key: 'ref_main',
          type: 'input',
          props: {
            label: 'Référence Principale',
            placeholder: 'LD 5 200 2 02 E01',
            required: true,
            size: "m"
          }
        },
        {
          id: 'page',
          key: 'page',
          type: 'select',
          props: {
            label: 'Page',
            placeholder: 'Livrets de Dépannage',
            required: true,
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.webPages.map(({ title, title_formatted }) => ({ value: title, label: title_formatted }))
            }
          }
        },
        {
          id: 'engin',
          key: 'engin',
          type: 'select',
          props: {
            label: 'Engin',
            placeholder: 'AGC',
            required: true,
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.engins.map(({ engin }) => ({ value: engin, label: engin }))
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
            required: true,
            multiple: true,
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.engins.find(engin => engin.engin == field.model.engin)?.types_engin.map(engin => ({value: engin, label: engin}))
            }
          }
        }
      ]
    }
  ]

  documentEditFormFilterFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'filter_type',
          key: 'filter_type',
          type: 'select',
          props: {
            label: 'Type',
            placeholder: 'Système',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              return this.dataService.filterTypes.map(({ type, type_formatted }) => ({ value: type, label: type_formatted }))
            }
          }
        },
        {
          id: 'filter',
          key: 'filter',
          type: 'select',
          props: {
            label: 'Filtre',
            placeholder: 'Motrice',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
          expressions: {
            'props.options': (field: FormlyFieldConfig) => {
              let mainModel = this.administrationService.documentEditFormModel
              let values = this.dataService.filters.filter(filter => filter.page == mainModel.page && filter.type == field.model.filter_type && filter.engin == mainModel.engin).map(({ filter, filter_formatted }) => ({ value: filter, label: filter_formatted }))
              if (!values || values.length < 1) {
                return [{value: '', label: "Pas assez de paramètres :", disabled: true},{value: '', label: "Sélectionnez Page & Engin", disabled: true}];
              }
              return values
            },
            hide: (field: FormlyFieldConfig) => {
              return !field.model.filter_type
            }
          }
        },
      ]
    }
  ]
  documentEditFormTagsFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'tag',
          key: 'tag',
          type: 'input',
          props: {
            label: 'Tag',
            placeholder: 'GROG',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
        },
      ]
    }
  ]
  documentEditFormLinksFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'link_name',
          key: 'link_name',
          type: 'input',
          props: {
            label: 'Nom',
            placeholder: 'LD 5 200 E01...',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
        },
        {
          id: 'link_type',
          key: 'link_type',
          type: 'input',
          props: {
            label: 'Type',
            placeholder: 'LD',
            required: true,
            styles: {
              input: {width: "15em"},
            },
            size: "m"
          },
        },
        {
          id: 'link_url',
          key: 'link_url',
          type: 'input',
          props: {
            label: 'URL',
            placeholder: 'https://dsmat.sncf.fr/...',
            required: true,
            styles: {
              input: {width: "20em"},
            },
            size: "m"
          },
        },
      ]
    }
  ]

  // Getters
  public get tagsFormattedData() {
    return this.administrationService.documentEditFormModel.tags?.map(tag => ({ tag }));
  }
  public get readyAddFilter() {
    return this.documentEditFormFilters.status == 'VALID'
  }
  public get readyAddTag() {
    return this.documentEditFormTags.status == 'VALID'
  }
  public get readyAddUrl() {
    return this.documentEditFormLinks.status == 'VALID'
  }
  public get readyForUpdateDoc() {
    return (this.administrationService.documentEditForm.status == 'VALID' && !this.formUnchanged)
  }
  public get formUnchanged() {
    return _.isEqual(this.administrationService.documentEditBackup, this.administrationService.documentEditFormModel)
  }

  // Functions to edit the form object (filters, tags and links)
  addFilter() {
    let mainModel = this.administrationService.documentEditFormModel as any
    let model = this.documentEditFormFiltersModel as any
    if (!this.readyAddFilter) {
      this.administrationService.notif.warning('Veuillez remplir tous les champs')
      return
    }
    let foundFilter = this.dataService.filters.filter(filter => filter.filter == model.filter && filter.type == model.filter_type).map(({filter, filter_formatted, type}) => ({type: type, filter: filter, filter_formatted: filter_formatted}))[0]
    if (mainModel.meta?.find((filter: FilterType) => filter.filter == model.filter && filter.type == model.filter_type)) {
      this.administrationService.notif.warning('Le filtre existe déjà sur cet élement...')
      return;
    }
    mainModel.meta = [...mainModel.meta, foundFilter]
  }
  deleteFilter(object: FilterType) {
    let mainModel = this.administrationService.documentEditFormModel
    mainModel.meta = mainModel.meta?.filter(filter => filter != object)
  }

  addTag() {
    let mainModel = this.administrationService.documentEditFormModel as any
    let model = this.documentEditFormTagsModel as any
    if (!this.readyAddTag) {
      this.administrationService.notif.warning('Veuillez remplir tous les champs')
      return
    }
    if (mainModel.tags.find((tag: string) => tag == model.tag)) {
      this.administrationService.notif.warning('Le tag existe déjà sur cet élement...')
      return;
    }
    mainModel.tags = [...mainModel.tags, model.tag]
  }
  removeTag(tagName: string) {
    let mainModel = this.administrationService.documentEditFormModel
    mainModel.tags = mainModel.tags?.filter(tag => tag != tagName)
  }

  addUrl() {
    let mainModel = this.administrationService.documentEditFormModel as any
    let model = this.documentEditFormLinksModel as any
    if (!this.readyAddUrl) {
      this.administrationService.notif.warning('Veuillez remplir tous les champs')
      return
    }
    if (mainModel.links.find((link: LinkType) => link.url == model.link_url || link.name == model.link_name)) {
      this.administrationService.notif.warning('Le tag existe déjà sur cet élement...')
      return;
    }
    let urlObject: LinkType = {
      name: model.link_name,
      type: model.link_type,
      url: model.link_url,
    }
    mainModel.links = [...mainModel.links, urlObject]
  }
  removeUrl(url: string) {
    let mainModel = this.administrationService.documentEditFormModel
    mainModel.links = mainModel.links?.filter(link => link.url != url)
  }

}
