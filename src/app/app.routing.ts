import { Routes, RouterModule } from "@angular/router";

import {HomePageComponent} from "./pages/home-page/home-page.component";
import {LDPageComponent} from "./pages/ld-page/ld-page.component";
import {LocOrgaPageComponent} from "./pages/loc-orga-page/loc-orga-page.component";
import {DocFctPageComponent} from "./pages/doc-fct-page/doc-fct-page.component";
import {ModulesFormationPageComponent} from "./pages/modules-formation-page/modules-formation-page.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'ld', component: LDPageComponent},
  {path: 'loc-orga', component: LocOrgaPageComponent},
  {path: 'doc-fct', component: DocFctPageComponent},
  {path: 'mod-form', component: ModulesFormationPageComponent},
  {path: '**', redirectTo: ""}
];

export const appRoutingModule = RouterModule.forRoot(routes);
