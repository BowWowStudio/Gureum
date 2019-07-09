import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '@shared/services/auth.service';
import { FileItem, MetaData, HierArchy } from './fileList.type';
import { saveAs } from 'file-saver';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as JSZip from 'jszip';
import { resolve } from 'q';
import { MatDialog } from '@angular/material';
import { NewFolderDialogComponent } from './newFolderDialog/newFolderDialog.component';
import { MenuClickService } from '@shared/services';
import { Menu } from '@shared/interfaces/app.type';
import { CryptoService } from '@shared/services/Crypto.service';
import { FileDataStore } from '@shared/interfaces/FileDataStore.type';
import { FileListService } from '@shared/services/fileList.service';

@Component({
  selector: "app-fileList",
  templateUrl: './fileList.component.html',
  styleUrls: ['./fileList.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthService,
    public route: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private menuService: MenuClickService,
    private hash: CryptoService,
    private fileListService : FileListService,
  ) {
    auth.getUserObservable().subscribe(user=>{
      fileListService.fileDataStoreToFileListDetail(user.uid).then(a=>{
        console.log(a);
        this.dataSource.data = a;
      });
    });
  }
  private folderUrl = 'folder';
  private db: firebase.firestore.Firestore;
  private zipFile: JSZip = new JSZip();
  public fileLists: FileItem[];
  public hierarchies: HierArchy[] = [{ hash: undefined, name: 'My Drive' }];
  public loading = true;
  public datas: FileItem[];
  public displayedColumns: string[] = ['name', 'owner'];
  public columnCellName: Map<string, string> = new Map([
    ['name', 'Name'],
    ['owner', 'Owner'],
    // ['lastModified', 'Last Modified'],
    // ['size', 'Size']
  ]);
  public dataSource = new MatTableDataSource();
  public selectedRow: Set<FileItem> = new Set();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnDestroy(): void {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.db = firebase.firestore();
    const documentRef = this.db.collection('document');
    this.auth.getUserObservable().subscribe(async user => {
      if (user !== null) {
        let storageRef: firebase.storage.Reference;
        if (this.route.url.includes(this.folderUrl)) {
          this.activatedRoute.paramMap.subscribe(async paramMap => {
            this.loading = true;
            const hash = paramMap.get('hash');
            const snapshot = await documentRef.doc(hash).get();
            const data = snapshot.data() as FileDataStore;
            storageRef = firebase
              .storage()
              .refFromURL(`gs://${data.bucket}/${data.path}`);
            const listResult = await storageRef.listAll();
            this.dataSource.data = await this.processListResultToFileItem(
              listResult
            );
            this.hierarchies = await this.getHierarchy(storageRef);
            this.loading = false;
          });
        } else {
          storageRef = firebase.storage().ref(user.uid);
          const listResult = await storageRef.listAll();
          this.dataSource.data = await this.processListResultToFileItem(
            listResult
          );
          this.loading = false;
        }
      }
    });
  }
  private async processListResultToFileItem(
    listResult: firebase.storage.ListResult
  ): Promise<FileItem[]> {
    const returnVal: FileItem[] = [];
    for (const prefix of listResult.prefixes) {
      const hashResult = await this.db
        .collection('document')
        .where('isFolder', '==', true)
        .where('path', '==', prefix.fullPath)
        .get();
      const hash = hashResult.docs[0].id;
      const newFileItem: FileItem = {
        name: prefix.name,
        isFolder: true,
        ref: prefix,
        hash: hash,
        owner: 'Me'
      };
      returnVal.push(newFileItem);
    }
    for (const item of listResult.items) {
      const metaData: MetaData = await item.getMetadata();
      returnVal.push({
        isFolder: false,
        lastModified: metaData.updated,
        name: item.name,
        owner: 'Me',
        size: metaData.size,
        ref: item
      });
    }
    return returnVal;
  }
  private async getHierarchy(
    ref: firebase.storage.Reference
  ): Promise<HierArchy[]> {
    let currentRef = ref;
    const hierarchy: HierArchy[] = [];
    const documentRef = this.db.collection('document');
    while (currentRef.parent.parent !== null) {
      hierarchy.unshift({
        hash: (await documentRef.where('path', '==', currentRef.fullPath).get())
          .docs[0].id,
        name: currentRef.name
      });
      currentRef = currentRef.parent;
    }
    hierarchy.unshift({
      hash: undefined,
      name: 'My Drive'
    });
    return hierarchy;
  }
  public download(blob: Blob, name: string) {
    saveAs(blob, name);
  }
  public async getBlobFromRef(ref: firebase.storage.Reference): Promise<Blob> {
    const url = await ref.getDownloadURL();
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.open('GET', url);
    xhr.send();
    return new Promise(resolve => {
      xhr.onload = async () => {
        const blob: Blob = xhr.response;
        resolve(blob);
      };
    });
  }
  public setIsLoading(loading: boolean) {
    this.loading = loading;
  }
  public openFolder(hash: string) {
    if (hash === undefined) {
      this.route.navigate(['/dashboard', 'main']);
    } else {
      this.route.navigate(['/dashboard', 'folder', hash]);
    }
  }
  public toggleSelect(element: FileItem, event: KeyboardEvent) {
    if (!event.ctrlKey) {
      this.selectedRow.clear();
    }
    if (this.selectedRow.has(element)) {
      this.selectedRow.delete(element);
    } else {
      this.selectedRow.add(element);
    }
  }
  public async downloadSelected() {
    if (this.selectedRow.size === 1) {
      const file = this.selectedRow.values().next().value;
      this.download(await this.getBlobFromRef(file.ref), file.ref.name);
    } else {
      for (const file of this.selectedRow) {
        this.zipFile.file<'blob'>(
          file.ref.fullPath
            .split('/')
            .slice(1)
            .join('/'),
          await this.getBlobFromRef(file.ref)
        );
      }
      const content: Blob = await this.zipFile.generateAsync({ type: 'blob' });
      this.download(content, 'files');
    }
  }
}
