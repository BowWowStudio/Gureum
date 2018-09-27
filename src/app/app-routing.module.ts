import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from "./main/main.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ReadComponent} from "./main/read/read.component";
import {WriteComponent} from "./main/write/write.component";
import {SettingComponent} from "./main/setting/setting.component";
import {HelpComponent} from "./main/help/help.component";

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      {path: 'read', component: ReadComponent},
      {path: 'write', component: WriteComponent},
      {path: 'setting', component: SettingComponent},
      {path: 'help', component: HelpComponent}
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
