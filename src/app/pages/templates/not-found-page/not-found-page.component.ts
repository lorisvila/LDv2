import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.css']
})
export class NotFoundPageComponent {

  constructor(
    public router: Router
  ) {
    let timeout = 5000 // miliseconds
    setTimeout(() => {
      this.router.navigate([''])
    }, timeout)

  }

}
