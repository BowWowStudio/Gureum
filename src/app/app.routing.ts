// Modules 3rd party
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth-component/auth.component';
import { SignupComponentComponent } from './components/auth/signup-component/signup-component.component';
import { AuthGuardService } from '@shared/services/auth-guard.service';
import { ShareComponent } from './components/dashboard/share/share.component';
import { LoginGuardService } from '@shared/services/login-guard.service';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { FileListComponent } from './components/dashboard/fileList/fileList.component';

// Protected

// Routing
const appRoutes: Routes = [

  // Public pages
  { path: '', redirectTo: '/login', pathMatch : 'full', canActivate:[LoginGuardService]},
  { path: 'login', component: AuthComponent, canActivate:[LoginGuardService]},
  { path: 'register', component: SignupComponentComponent ,canActivate:[LoginGuardService]},

  { path: 'dashboard',  canActivateChild:[AuthGuardService], children: [
    {path: '', redirectTo : 'main', pathMatch : 'full'},
    {path: 'folder/:hash', component: FileListComponent},
    {path: 'main', component: FileListComponent },
    {path: 'shared', component: ShareComponent},
    {path: 'profile', component: ProfileComponent},
  ]
},

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
