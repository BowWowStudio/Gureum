import { Injectable } from '@angular/core';
import { CryptoService } from './Crypto.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
import { FileDataStore } from '@shared/interfaces/FileDataStore.type';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HierArchy } from 'src/app/components/dashboard/fileList/fileList.type';

@Injectable({
  providedIn: 'root'
})
export class FileListService {
  private MbinByte = 1024 ** 2;
  private db: firebase.firestore.CollectionReference;
  private totalSpaceSubject: Subject<number> = new Subject<number>();
  private readonly fileListSubject = new BehaviorSubject<FileDataStore[]>(null);
  constructor(private crypto: CryptoService, private authService: AuthService) {
    this.db = firebase.firestore().collection('document');
  }
  public deleteFromFileList(docId: string) {
    this.fileListSubject.subscribe(fileLists => {
      if (fileLists.some(fileList => fileList.hash === docId)) {
        const newFileList = fileLists.filter(fileList => fileList.hash !== docId);
        this.fileListSubject.next(newFileList);
      }
    });
  }
  public fileDataStoreToFileListDetail(uid: string, folderId: string = null): Observable<FileDataStore[]> {
    this.db.where('owner', '==', uid).where('parent', '==', folderId).get().then(querysnapshot => {
      this.fileListSubject.next(
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
    return this.fileListSubject.asObservable();
  }
  public getHierarchy(folderId: string): Observable<HierArchy[]> {
    const newObservable = new Subject<HierArchy[]>();
    const hierarchy: HierArchy[] = [];
    this.db.doc(folderId).get().then(async doc => {
      const leaf = doc.data() as FileDataStore;
      hierarchy.push({name: leaf.name, hash: leaf.hash});
      let node: FileDataStore = leaf;
      while (node.parent !== null) {
        node = (await this.db.doc(node.parent).get()).data() as FileDataStore;
        hierarchy.unshift({name: node.name, hash: node.hash});
      }
      hierarchy.unshift({name : 'My Drive', hash : null});
      newObservable.next(hierarchy);
    });
    return newObservable.asObservable();
  }
  public getTotalSpace(): Observable<number> {
    return this.totalSpaceSubject.asObservable();
  }
  public calculateTotalSpace() {
    this.authService.getUserObservable().subscribe(async userInfo => {
      if (userInfo !== null) {
        const stoargeRef = firebase.storage().ref(userInfo.uid);
        const listResult = await stoargeRef.listAll();
        let total = 0;
        for (const item of listResult.items) {
          const metaData = await item.getMetadata();
          total += metaData.size;
        }
        this.totalSpaceSubject.next(total / this.MbinByte);
      }
    });
  }
}
