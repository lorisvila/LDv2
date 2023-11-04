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
    LocOrgaPageComponent
  ],
  imports: [
    BrowserModule,
    WcsAngularModule,
    appRoutingModule
  ],
  providers: []
})
export class AppModule { }
