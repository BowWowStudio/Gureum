// Modules 3rd party
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatInputModule, MatSnackBarModule,
         MatToolbarModule, MatDialogModule, MatSidenavModule, MatNativeDateModule,
         MatCardModule, MatTabsModule, MatIconModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
// Modules
import { PipesModule } from '@shared/pipes/pipes.module';

// Shared
import {
  FooterComponent,
  HeaderComponent,
  UserService,
  AlertService,
  AuthGuardService,
  AuthService,
  WindowService
} from '@shared';

// Main
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthModule } from './components/auth/auth.module';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { firebaseKeys } from './firebase.config';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CryptoService } from '@shared/services/Crypto.service';
import { FileListService } from '@shared/services/fileList.service';
import { ShareModule } from './components/file/share.module';

// Pages

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseKeys),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule, MatCheckboxModule, MatMenuModule, MatInputModule, MatSnackBarModule,
    MatToolbarModule, MatDialogModule, MatSidenavModule, MatNativeDateModule, MatListModule,
    MatCardModule, MatTabsModule, MatIconModule, MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    PipesModule,
    AuthModule,
    DashboardModule,
    FlexLayoutModule,
    RouterModule,
    ShareModule,
  ],
  providers: [
    UserService,
    AlertService,
    AuthGuardService,
    AuthService,
    WindowService,
    AngularFireAuth,
    CryptoService,
    FileListService,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
