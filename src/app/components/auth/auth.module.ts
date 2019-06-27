// Modules 3rd party
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatProgressBarModule,
  MatCardModule,
  MatIconModule,
  MatSnackBarModule
} from '@angular/material';
import { AuthComponent } from './auth-component/auth.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SignupComponentComponent } from './signup-component/signup-component.component';
import { RouterModule } from '@angular/router';

// Components

@NgModule({
  declarations: [AuthComponent, SignupComponentComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    FlexLayoutModule,
    RouterModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [AuthComponent, SignupComponentComponent]
})
export class AuthModule {}
