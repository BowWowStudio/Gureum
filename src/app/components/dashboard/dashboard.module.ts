import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatProgressBarModule, MatCardModule, MatIconModule, MatListModule, MatTreeModule, MatProgressSpinnerModule, MatTableModule, MatMenuModule, MatDialogModule } from '@angular/material';
import { ShareComponent } from './share/share.component';
import { ProfileComponent } from './profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileListComponent } from './fileList/fileList.component';
import { ToolbarComponent } from './fileList/toolbar/toolbar.component';
import { NewFolderDialogComponent } from './fileList/newFolderDialog/newFolderDialog.component';
import { ContextMenuComponent } from './fileList/contextMenu/contextMenu.component';

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
  declarations: [ ShareComponent, ProfileComponent, FileListComponent, ToolbarComponent,NewFolderDialogComponent, ContextMenuComponent],
  providers: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
     ShareComponent, ProfileComponent, FileListComponent, ToolbarComponent, 
  ],
  bootstrap: [
    NewFolderDialogComponent
  ]
})
export class DashboardModule { }
