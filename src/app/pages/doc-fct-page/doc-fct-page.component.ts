import { Component } from '@angular/core';
import {EnginService} from "../../services/engin.service";
import {DocFctService} from "../../services/doc-fct.service";
import {GeneralService} from "../../services/general.service";
import {FilterType} from "../../app.types";
import {AdministrationService} from "../../services/administration.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import { ChangeDetectorRef } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-doc-fct-page',
  templateUrl: './doc-fct-page.component.html',
  styleUrls: ['./doc-fct-page.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DocFctPageComponent {

  constructor(
    public generalService: GeneralService,
    public enginService: EnginService,
    public docFctService: DocFctService,
    public administrationService: AdministrationService,
    private cd: ChangeDetectorRef,
  ) {
  }

  hideFonctions: boolean = false;
  hideCategories: boolean = true;

  searchFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: "rowForm",
      fieldGroup: [
        {
          id: 'recherche',
          key: 'recherche',
          type: 'input',
          props: {
            label: "Recherche textuelle",
            placeholder: 'S.DOT',
            styles: {
              input: {width: "20em"},
            }
          },
          expressions: {
            'props.wcsChange': () => {
              this.docFctService.updateFilteredData()
            }
          }
        },
      ]
    }
  ]

  categoryFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'rowForm',
      fieldGroup: [
        {
          id: 'meta.category',
          key: 'meta.category',
          type: 'radio',
          props: {
            label: "Catégorie",
            options: []
          },
          expressions: {
            'props.wcsChange': () => {
              this.docFctService.updateFilteredData()
            },
            'props.options': () => {
              return this.docFctService.allCategoriesFromFonction.map(({filter, filter_formatted}) => ({label: filter_formatted, value: filter}))
            }
          }
        },
      ]
    }
  ]

  getKeys(obj: any): Array<string> {
    return Object.keys(obj);
  }

  returnFilterObject(objects: any, key: string): FilterType {
    return objects[key]
  }

  selectFunction(functionObject: FilterType) {
    this.hideFonctions = true
    this.hideCategories = false
    if (!this.docFctService.filterFormModel.meta) { // Add the meta object if not already exists
      this.docFctService.filterFormModel.meta = {}
    }
    if (!this.docFctService.filterFormModel.meta.fonction) { // Add the fonction key if not already exists
      this.docFctService.filterFormModel.meta.fonction =  ''
    }
    if (this.docFctService.filterFormModel.meta.category) { // Remove a category if already selected
      delete this.docFctService.filterFormModel.meta.category
    }
    this.docFctService.filterFormModel.meta.fonction = functionObject.filter // Set the fonction to the actual filter string
    this.docFctService.currentFonctionSelected = functionObject // Set the current selected fonction in the service
    this.docFctService.updateFilteredData().then(() => {
      this.docFctService.setAllCategoriesOfFonction() // Update the categories when the docs will be filtered
    })
  }

  getNumberOfMatchFunction(fonction_filter: FilterType) {
    return this.docFctService.filteredDocFctData?.filter((doc) => {
      if (doc.meta?.hasOwnProperty('fonction'))  {
        return doc.meta["fonction" as any].filter as string == fonction_filter.filter
      } else {
        return false
      }
    }).length
  }

}
