import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {GeneralService} from "../../../services/general.service";
import {DataService} from "../../../services/data.service";
import {PageType} from "../../../app.types";

@Component({
  selector: 'app-add-elem-formly',
  templateUrl: './add-elem-formly.component.html',
  styleUrls: ['./add-elem-formly.component.css']
})
export class AddElemFormlyComponent {

  constructor(
    public generalService: GeneralService,
    public dataService: DataService
  ) {
  }

  selectData = {
    pages: this.generalService.copyObject(this.dataService.webPages).filter((item: any) => {item.label = item.title_formatted ; item.value = item.title ; return true}),
    engins: this.generalService.copyObject(this.dataService.engins).filter((item: any) => {item.label = item.engin ; item.value = item.engin ; return true}),
  }

  formGroup: FormGroup = new FormGroup({})
  formModel = {}
  fields: FormlyFieldConfig[] = [
    {
      key: 'page',
      type: 'select',
      props: {
        options: this.selectData.pages,
        label: "Page",
        placeholder: 'Quelle page ?',
        required: true,
        multiple: false,
        disabled: false,
        styles: {
          input: {width: "20em"}
        }
      }
    },
    {
      key: 'engins',
      type: 'select',
      props: {
        options: this.selectData.engins,
        label: "Engin",
        placeholder: 'Quel engin ?',
        required: true,
        multiple: false,
        disabled: false,
        styles: {
          input: {width: "20em"}
        }
      }
    }
  ]

  onSubmit(model: {}) {
    console.log(model);
  }

}
