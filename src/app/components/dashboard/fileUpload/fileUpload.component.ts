import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { FileListDetail, DirectoryFile, FileDataStore } from './fileUpload.type';
import { map } from 'rxjs/operators';
import { _MatCheckboxRequiredValidatorModule } from '@angular/material';
import { AuthService } from '@shared/services/auth.service';
import { CryptoService } from '@shared/services/Crypto.service';

@Component({
  selector: 'app-fileUpload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.scss']
})
export class FileUploadComponent implements OnInit {
  private db: firebase.firestore.Firestore;
  public formGroup: FormGroup;
  public file: File | null = null;
  public files: FileListDetail | null = null;
  constructor(private fb: FormBuilder, private auth: AuthService, private hash: CryptoService) {
    this.formGroup = this.fb.group({
      file: [null, Validators.required]
    });
  }

  public ngOnInit() {
    this.db = firebase.firestore();
  }
  public async fileChangeEvent(fileInput: Event) {
    const fileTarget = fileInput.target as HTMLInputElement;
    this.files = null;
    if (fileTarget.files && fileTarget.files.length > 0) {
      this.file = fileTarget.files.item(0);
    }
  }
  public async directoryChangeEvent(directoryInput: Event) {
    const fileTarget = directoryInput.target as HTMLInputElement;
    this.file = null;
    if (fileTarget.files) {

      this.files = this.processFiles(this.processDirectoryFiles(fileTarget.files))[0];
    }
  }
  public async onSubmit() {
    this.auth.getUser().subscribe(async (user) => {
      const ref = firebase.storage().ref(user.uid);
      if (this.file === null) {
        await this.uploadFolder(ref, this.files);
      } else {
        await this.uploadFile(ref, this.file);
      }
    });
  }
  public async uploadFile(ref: firebase.storage.Reference, file: File) {
    await ref.child(file.name).put(file);
    const fullPath = `${ref.fullPath}/${file.name}`;
    const hash = await this.hash.findHash(file, fullPath);
    this.auth.getUser().subscribe(async (user) => {
      const newDoc: FileDataStore = {
        path: ref.fullPath,
        owner: user.uid,
        bucket: ref.bucket,
        name: file.name,
        isFolder: false,
      };
      await this.db.collection('document').doc(hash).set(newDoc);
    });
  }
  public async uploadFolder(ref: firebase.storage.Reference, filesDetail: FileListDetail) {
    const newRef = ref.child(filesDetail.folderName);
    const hash = this.hash.findStringHash(filesDetail.folderName, ref.fullPath);
    const fullPath = `${ref.fullPath}/${filesDetail.folderName}`;
    this.auth.getUser().subscribe(async (user) => {
      const newDoc: FileDataStore = {
        path: fullPath === user.uid ? '""' : fullPath,
        owner: user.uid,
        bucket: ref.bucket,
        name: filesDetail.folderName,
        isFolder: true,
      };
      await this.db.collection('document').doc(hash).set(newDoc);
    });
    for (const file of filesDetail.files) {
      await this.uploadFile(newRef, file);
    }
    for (const child of filesDetail.children) {
      await this.uploadFolder(newRef, child);
    };
  }
  public processFiles(directoryFiles: Array<DirectoryFile>, level: number = 0): Array<FileListDetail> {
    const directoryMap: Map<string, Array<DirectoryFile>> = new Map();
    const children = [];
    for (const directoryFile of directoryFiles) {
      const directory = directoryFile.webkitRelativePath.split('/');
      if (directory.length === level + 2) {
        if (directoryMap.has(directory[level])) {
          directoryMap.get(directory[level]).push(directoryFile);
        } else {
          directoryMap.set(directory[level], [directoryFile]);
        }
      } else {
        children.push(directoryFile);
      }
    }
    const returnArray: Array<FileListDetail> = [];
    directoryMap.forEach((value, key) => {
      returnArray.push({
        children: this.processFiles(children, level + 1),
        files: value.map(files => files.file),
        folderName: key,
      });
    });
    return returnArray;
  }
  public processDirectoryFiles(directoryFiles: FileList): Array<DirectoryFile> {
    const returnArray: Array<DirectoryFile> = [];
    for (let i = 0; i !== directoryFiles.length; i += 1) {
      returnArray.push({ file: directoryFiles.item(i), webkitRelativePath: directoryFiles.item(i)['webkitRelativePath'] });
    }
    return returnArray;
  }
}
