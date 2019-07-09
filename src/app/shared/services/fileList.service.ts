import { Injectable } from '@angular/core';
import { CryptoService } from './Crypto.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { FileListDetail } from '@shared/interfaces/fileViewList.type';
import { FileDataStore } from '@shared/interfaces/FileDataStore.type';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
  public async fileDataStoreToFileListDetail(uid: string, folderId: string = null): Promise<FileDataStore[]> {
    const querysnapshot = await this.db.where('owner', '==', uid).where('parent', '==', folderId).get();
    return querysnapshot.docs.map(doc => doc.data() as FileDataStore).sort((a, b) => {
      if (a.isFolder && b.isFolder) {
        return 0;
      } else if (a.isFolder) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}
