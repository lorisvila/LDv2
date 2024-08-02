import { NgModule } from '@angular/core';
import {appRoutingModule} from "./app.routing";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {WcsAngularModule} from "wcs-angular";
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LDPageComponent } from './pages/ld-page/ld-page.component';
import { DocFctPageComponent } from './pages/doc-fct-page/doc-fct-page.component';
import { ModulesFormationPageComponent } from './pages/modules-formation-page/modules-formation-page.component';
import { LocOrgaPageComponent } from './pages/loc-orga-page/loc-orga-page.component';
import { ModalsComponent } from './components/modals/modals.component';
import {CookieService} from "ngx-cookie-service";
import { GridComponent } from './pages/ld-page/grid/grid.component';
import {CodesDefPageComponent} from "./pages/codes-def-page/codes-def-page.component";
import { AdministrationPageComponent } from './pages/administration-page/administration-page.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { StillInDevPageComponent } from './pages/templates/still-in-dev-page/still-in-dev-page.component';
import { NotFoundPageComponent } from './pages/templates/not-found-page/not-found-page.component';
import {WcsFormlyModule} from "wcs-formly";
import {FormlyModule} from "@ngx-formly/core";
import {ReactiveFormsModule} from "@angular/forms";
import {ActionBarComponent} from "./components/action-bar/action-bar.component";
import {ModElementComponent} from "./pages/administration-page/mod-element/mod-element.component";
import {UsersElementComponent} from "./pages/administration-page/users-element/users-element.component";
import {FilterElementComponent} from "./pages/administration-page/filter-element/filter-element.component";
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
    CodesDefPageComponent,
    AdministrationPageComponent,
    SearchPageComponent,
    StillInDevPageComponent,
    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WcsAngularModule,
    appRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      maxOpened: 4,
    }),
    ActionBarComponent,
    ModElementComponent,
    BrowserModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    UsersElementComponent,
    WcsFormlyModule,
    FilterElementComponent
  ],
  providers: [
    CookieService
  ]
})
export class AppModule { }
