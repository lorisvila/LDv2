import { Injectable } from '@angular/core';
import {UntypedFormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CodesDefService {

  constructor() { }

  // NGX-Formly forms for the DocFct page
  searchBarForm: UntypedFormGroup = new UntypedFormGroup({})
  searchBarFormModel: any = {
    page: "codesDef"
  }

}
