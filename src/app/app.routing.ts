// Modules 3rd party
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth-component/auth.component';
import { SignupComponentComponent } from './components/auth/signup-component/signup-component.component';

// Protected

// Routing
const appRoutes: Routes = [

  // Public pages
  { path: '', redirectTo: '/login', pathMatch : 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: SignupComponentComponent },

  // Protected pages
  // { path: 'profile/:uid/:name', component: ProfileComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
