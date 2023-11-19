import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {WcsAngularModule} from "wcs-angular";
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LDPageComponent } from './pages/ld-page/ld-page.component';
import { DocFctPageComponent } from './pages/doc-fct-page/doc-fct-page.component';
import { ModulesFormationPageComponent } from './pages/modules-formation-page/modules-formation-page.component';
import { LocOrgaPageComponent } from './pages/loc-orga-page/loc-orga-page.component';
import {appRoutingModule} from "./app.routing";
import { ModalsComponent } from './components/modals/modals.component';
import {CookieService} from "ngx-cookie-service";
import { GridComponent } from './pages/ld-page/grid/grid.component'

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    NavbarComponent,
    SidemenuComponent,
    HomePageComponent,
    LDPageComponent,
    DocFctPageComponent,
    ModulesFormationPageComponent,
    LocOrgaPageComponent,
    ModalsComponent,
    GridComponent,
  ],
  imports: [
    BrowserModule,
    WcsAngularModule,
    appRoutingModule
  ],
  providers: [
    CookieService
  ]
})
export class AppModule { }
