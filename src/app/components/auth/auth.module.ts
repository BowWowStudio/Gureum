// Modules 3rd party
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatProgressBarModule,
         MatCardModule, MatIconModule } from '@angular/material';
import { AuthComponent } from './auth-component/auth.component';

// Components

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MatButtonModule, MatInputModule, MatProgressBarModule,
    MatCardModule, MatIconModule,
  ],
  providers: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    AuthComponent,
  ]
})
export class AuthModule {
}
