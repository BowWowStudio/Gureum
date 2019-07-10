import { Injectable } from '@angular/core';
import { CryptoService } from './Crypto.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { FileDataStore } from '@shared/interfaces/FileDataStore.type';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileListService {
  private db: firebase.firestore.CollectionReference;
  private uid: string;
  constructor(private crypto: CryptoService, private authService: AuthService) {
    this.db = firebase.firestore().collection('document');
    this.authService.getUserObservable().subscribe(user => {
      this.uid = user.uid;
    });
  }
  public fileDataStoreToFileListDetail(uid: string, folderId: string = null): Observable<FileDataStore[]> {
    const newObservable = new Subject<FileDataStore[]>();
    this.db.where('owner', '==', uid).where('parent', '==', folderId).get().then(querysnapshot => {
      newObservable.next(
        querysnapshot.docs.map(doc => doc.data() as FileDataStore).sort((a, b) => {
          if (a.isFolder && b.isFolder) {
            return 0;
          } else if (a.isFolder) {
            return -1;
          } else {
            return 1;
          }})
      );
    });
    return newObservable.asObservable();
  }
}
