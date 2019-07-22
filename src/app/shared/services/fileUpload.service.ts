import { Injectable } from '@angular/core';
import { CryptoService } from './Crypto.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { FileDataStore } from '@shared/interfaces/FileDataStore.type';
import { Subject, Observable } from 'rxjs';
import { FileItem } from 'src/app/components/dashboard/fileList/fileList.type';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { ContextMenuService } from './ContextMenu.service';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private db: firebase.firestore.Firestore;
  private ref: firebase.storage.Reference;
  private zipFile: JSZip = new JSZip();
constructor(private crypto: CryptoService, private authService: AuthService, private contextMenuService: ContextMenuService) {
  this.db = firebase.firestore();
}
  public async newFolder(name, parentFolderDocId = null): Promise<void> {
    const uid = this.authService.getUserObservable().subscribe(async user=>{
      const uid = user.uid;
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
      documentRef.doc(docId).set(newFolder);
    });
  }
  public fileUpload(file: File, parentFolderDocId = null): Observable<firebase.storage.UploadTask> {
    this.contextMenuService.setOpen(true);
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
  public async fileDelete(files: Set<FileItem>) {
    for await(const file of Array.from(files)) {
      this.authService.getUserObservable().subscribe(async user => {
        this.db.collection('document').doc(file.hash).delete();
        firebase.storage().ref(user.uid).child(file.hash).delete();
      });
    }
  }
  public async fileUploadCancel(uploadTask: firebase.storage.UploadTask) {
    uploadTask.cancel();
  }
  public async fileDownload(files: Set<FileItem>) {
    if (files.size === 1) {
      const file = files.values().next().value;
      this.download(await this.getBlobFromHash(file), file.name);
    } else {
      for (const file of Array.from(files)) {
        this.zipFile.file<'blob'>(
          // TODO: calculate full path
          file.ref.fullPath
            .split('/')
            .slice(1)
            .join('/'),
          await this.getBlobFromHash(file)
        );
      }
      const content: Blob = await this.zipFile.generateAsync({ type: 'blob' });
      this.download(content, 'files');
    }
  }


  private download(blob: Blob, name: string) {
    saveAs(blob, name);
  }
  private async getBlobFromHash(file: FileItem): Promise<Blob> {
    return new Promise(async resolve => {
      const ref = firebase.storage(firebase.app()).ref(`${file.owner}/${file.hash}`);
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open('GET', await ref.getDownloadURL());
      xhr.send();
      xhr.onload = async () => {
        const blob: Blob = xhr.response;
        resolve(blob);
      };
    });
  }
}
