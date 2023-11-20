import {EventEmitter, Injectable, Output} from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class EnginService {

  @Output() $actual_engin: EventEmitter<string> = new EventEmitter<string>();

  actual_engin: string = "";
  types_engin: {[Name: string]: string[]} = {
    "AGC": ["XGC", "BGC", "ZGC"],
    "TER 2N NG": ["2C", "3C", "4C", "5C"]
  };
  actual_type_engin: string[] = [];
  hasDefaultEngin: boolean = false;

  changeActualEngin(engin: string){
    this.actual_engin = engin
    this.actual_type_engin = this.types_engin[this.actual_engin]
    this.$actual_engin.emit(engin)
  }
  changeDefaultEngin(engin: string) {
    let expiry_date = new Date()
    this.cookieService.set("defaultEngin", engin, 365) // Change the cookie value of default engin
  }

  constructor(
    public cookieService: CookieService
  ) {
    // Set the basic engin to use when reload
    if (cookieService.check("defaultEngin") === true) {
      this.changeActualEngin(cookieService.get("defaultEngin")); // Set the actual engin to the cookie value
      this.hasDefaultEngin = true;
      console.log("Engin par défaut : " + cookieService.get("defaultEngin"))
    } else {
      this.changeActualEngin("AGC") // Set to AGC if not in cookies
    }
  }

}
