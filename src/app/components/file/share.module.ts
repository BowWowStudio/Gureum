import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualFileViewComponent } from './IndividualFileView/IndividualFileView.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatProgressBarModule, MatCardModule, MatIconModule, MatListModule, MatTreeModule, MatProgressSpinnerModule, MatTableModule, MatMenuModule, MatDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MatButtonModule, MatInputModule, MatProgressBarModule,
    MatCardModule, MatIconModule,
    ReactiveFormsModule,
    MatListModule,
    MatTreeModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
  ],
  declarations: [IndividualFileViewComponent]
})
export class ShareModule { }
