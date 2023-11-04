import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnginService {

  engins: string[] = ["AGC", "TER 2N NG"];
  actual_engin: string = "";
  type_engin: {} = {
    "AGC": ["XGC", "BGC", "ZGC"],
    "TER 2N NG": ["2C", "3C", "4C", "5C"]
  };
  actual_type_engin:[] = [];

  changeActualEngin(engin: string){
    this.actual_engin = engin
    this.actual_type_engin = this.type_engin[this.actual_engin as keyof typeof this.type_engin]
  }

  constructor() {
    // Set the basic engin to use when reload
    this.changeActualEngin("AGC")
  }

}
