import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatProgressBarModule, MatCardModule, MatIconModule, MatListModule, MatTreeModule, MatProgressSpinnerModule, MatTableModule, MatMenuModule, MatDialogModule } from '@angular/material';
import { FileUploadComponent } from './fileUpload/fileUpload.component';
import { ShareComponent } from './share/share.component';
import { ProfileComponent } from './profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileListComponent } from './fileList/fileList.component';
import { ToolbarComponent } from './fileList/toolbar/toolbar.component';
import { NewFolderDialogComponent } from './fileList/newFolderDialog/newFolderDialog.component';

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
  declarations: [FileUploadComponent, ShareComponent, ProfileComponent, FileListComponent, ToolbarComponent,NewFolderDialogComponent],
  providers: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    FileUploadComponent, ShareComponent, ProfileComponent, FileListComponent, ToolbarComponent, 
  ],
  bootstrap: [
    NewFolderDialogComponent
  ]
})
export class DashboardModule { }
