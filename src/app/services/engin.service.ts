import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class EnginService {

  actual_engin: string = "";
  types_engin: {[Name: string]: string[]} = {
    "AGC": ["XGC", "BGC", "ZGC"],
    "TER 2N NG": ["2C", "3C", "4C", "5C"]
  };
  actual_types_engin: string[] = [];

  changeActualEngin(engin: string){
    this.actual_engin = engin
    this.actual_types_engin = this.types_engin[this.actual_engin]
  }
  changeDefaultEngin(engin: string) {
    this.cookieService.set("defaultEngin", engin) // Change the cookie value of default engin
  }

  constructor(
    public cookieService: CookieService
  ) {
    // Set the basic engin to use when reload
    if (cookieService.check("defaultEngin") === true) {
      this.changeActualEngin(cookieService.get("defaultEngin"))
      console.log("Engin par défaut : " + cookieService.get("defaultEngin")) // Set the actual engin to the cookie value
    } else {
      this.changeActualEngin("AGC") // Set to AGC if not in cookies
    }
  }

}
