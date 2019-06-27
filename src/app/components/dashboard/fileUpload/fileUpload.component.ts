import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-fileUpload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.css']
})
export class FileUploadComponent implements OnInit {
  public formGroup:FormGroup;
  public file : File|null = null;
  constructor(private fb: FormBuilder) { 
    this.formGroup = this.fb.group({
      file: [null, Validators.required]
    });
  }

  public ngOnInit() {
  }
  public async fileChangeEvent(fileInput:Event){
    const fileTarget = fileInput.target as HTMLInputElement;
    if(fileTarget.files && fileTarget.files.length > 0){
      this.file = fileTarget.files.item(0);
    }
  }
  public async onSubmit() {
    console.log("hello");
    await firebase.storage().ref().child(this.file.name).put(this.file);
  }
}
