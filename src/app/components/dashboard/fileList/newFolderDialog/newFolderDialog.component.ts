import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-newFolderDialog',
  templateUrl: './newFolderDialog.component.html',
  styleUrls: ['./newFolderDialog.component.css']
})
export class NewFolderDialogComponent implements OnInit {
  private defaultName = 'newFolder';
  constructor(public dialogRef: MatDialogRef<NewFolderDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
    this.data.name = this.defaultName;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
