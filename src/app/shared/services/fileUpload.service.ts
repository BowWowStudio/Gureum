import { Injectable } from '@angular/core';
import { CryptoService } from './Crypto.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { FileDataStore } from '@shared/interfaces/FileDataStore.type';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private db: firebase.firestore.Firestore;
  private ref: firebase.storage.Reference;
constructor(private crypto: CryptoService, private authService: AuthService) {
  this.db = firebase.firestore();
  this.authService.getUserObservable().subscribe(user => {
    this.ref = firebase.storage().ref(user.uid);
  });
}
  public async newFolder(name, parentFolderDocId = null) : Promise<void>{
    const uid = this.authService.getUser().uid;
    const docId = this.crypto.findFolderHash(name, uid, new Date());
    let newFolder: FileDataStore;
    const documentRef = this.db.collection('document');
    if (parentFolderDocId !== null) {
      // find the corresponding doc and find the folder path
      let path = '';
      try {
        path = ((await documentRef.doc(parentFolderDocId).get()).data() as FileDataStore).path;
      } catch (err) {
        throw Error('Parent path does not exist');
      }
      newFolder = {
        bucket : this.ref.bucket,
        isFolder : true,
        name : name,
        owner : uid,
        path : `${path}/${name}`,
      };
    } else {
      // path is equal to the uid
      newFolder = {
        bucket : this.ref.bucket,
        isFolder : true,
        name : name,
        owner : uid,
        path : uid
      };
    }
    documentRef.doc(docId).set(newFolder);
  }
}
