// Modules 3rd party
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth-component/auth.component';

// Protected

// Routing
const appRoutes: Routes = [

  // Public pages
  { path: '', redirectTo: '/home', pathMatch : 'full' },
  { path: 'home', component: AuthComponent },

  // Protected pages
  // { path: 'profile/:uid/:name', component: ProfileComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
