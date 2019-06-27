// Modules 3rd party
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth-component/auth.component';
import { SignupComponentComponent } from './components/auth/signup-component/signup-component.component';
import { AuthGuardService } from '@shared/services/auth-guard.service';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { FileUploadComponent } from './components/dashboard/fileUpload/fileUpload.component';
import { ShareComponent } from './components/dashboard/share/share.component';

// Protected

// Routing
const appRoutes: Routes = [

  // Public pages
  { path: '', redirectTo: '/login', pathMatch : 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: SignupComponentComponent },

  { path: 'dashboard', children: [
    {path: 'main', component: FileUploadComponent, },
    {path: 'shared', component: ShareComponent}
  ]
},

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
