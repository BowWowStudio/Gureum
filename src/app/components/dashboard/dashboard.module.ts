import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatInputModule,
  MatProgressBarModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatTreeModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatMenuModule,
  MatDialogModule
} from '@angular/material';
import { ShareComponent } from './share/share.component';
import { ProfileComponent } from './profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileListComponent } from './fileList/fileList.component';
import { ToolbarComponent } from './fileList/toolbar/toolbar.component';
import { NewFolderDialogComponent } from './fileList/newFolderDialog/newFolderDialog.component';
import { ContextMenuComponent } from './fileList/contextMenu/contextMenu.component';
import { SettingComponent } from './setting/setting.component';
import { BinComponent } from './bin/bin.component';
import { RecentComponent } from './recent/recent.component';
import { StarComponent } from './star/star.component';
import { BinContextMenuComponent } from './bin/binContextMenu/binContextMenu.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    DragDropModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatListModule,
    MatTreeModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
  ],
  declarations: [
    ShareComponent,
    ProfileComponent,
    FileListComponent,
    ToolbarComponent,
    NewFolderDialogComponent,
    ContextMenuComponent,
    SettingComponent,
    BinComponent,
    BinContextMenuComponent,
    RecentComponent,
    StarComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ShareComponent,
    ProfileComponent,
    FileListComponent,
    ToolbarComponent
  ],
  bootstrap: [NewFolderDialogComponent]
})
export class DashboardModule {}
