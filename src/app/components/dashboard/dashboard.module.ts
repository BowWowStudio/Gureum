import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatProgressBarModule, MatCardModule, MatIconModule } from '@angular/material';
import { FileUploadComponent } from './fileUpload/fileUpload.component';
import { ShareComponent } from './share/share.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MatButtonModule, MatInputModule, MatProgressBarModule,
    MatCardModule, MatIconModule,
    ReactiveFormsModule,
  ],
  declarations: [FileUploadComponent, ShareComponent],
  providers: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    FileUploadComponent,ShareComponent
  ]
})
export class DashboardModule { }
