import { Injectable } from '@angular/core';
import { CryptoService } from './Crypto.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { FileDataStore } from '@shared/interfaces/FileDataStore.type';
import { Subject, Observable } from 'rxjs';
import { FileItem } from 'src/app/components/dashboard/fileList/fileList.type';

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
  public async newFolder(name, parentFolderDocId = null): Promise<void> {
    const uid = this.authService.getUser().uid;
    const docId = this.crypto.findFolderHash(name, uid, new Date());
    let newFolder: FileDataStore;
    const documentRef = this.db.collection('document');
    newFolder = {
      bucket : this.ref.bucket,
      isFolder : true,
      name : name,
      owner : uid,
      parent: parentFolderDocId,
      hash: docId,
    };
    await documentRef.doc(docId).set(newFolder);
  }
  public fileUpload(file: File, parentFolderDocId = null): Observable<firebase.storage.UploadTask> {
    const subject = new Subject<firebase.storage.UploadTask>();
    this.authService.getUserObservable().subscribe(async user => {
       const ref = firebase.storage().ref(user.uid);
       const hash = await this.crypto.findHash(file, new Date().toUTCString());
       const uploadTask = ref.child(hash).put(file);
       const newDoc: FileDataStore = {
         bucket : ref.bucket,
         hash : hash,
         isFolder : false,
         name : file.name,
         owner : user.uid,
         parent : parentFolderDocId,
       };
       subject.next(uploadTask);
       uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {subject.next(uploadTask); }, null, async () => {
        await this.db.collection('document').doc(hash).set(newDoc);
       });
    });
    return subject.asObservable();
  }
  public fileDelete(files : Set<FileItem>){
    
  }
  public fileDownload(files: Set<FileItem>){
    
  }
}
