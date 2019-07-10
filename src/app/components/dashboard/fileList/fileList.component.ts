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
    private fileListService: FileListService,
  ) {
  }
  private folderUrl = 'folder';
  private db: firebase.firestore.Firestore;
  private zipFile: JSZip = new JSZip();
  public fileLists: FileItem[];
  public hierarchies: HierArchy[] = [{ hash: undefined, name: 'My Drive' }];
  public loading;
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
    this.setIsLoading(true);
    this.auth.getUserObservable().subscribe(user => {
      this.fileListService.fileDataStoreToFileListDetail(user.uid).subscribe(a => {
        this.dataSource.data = a;
        this.setIsLoading(false);
      });
    });
  }
  public download(blob: Blob, name: string) {
    saveAs(blob, name);
  }
  public async getBlobFromHash(file: FileItem): Promise<Blob> {
    return new Promise(resolve => {
      this.auth.getUserObservable().subscribe(async user => {
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
    console.log(this.selectedRow);
  }
  public async downloadSelected() {
    if (this.selectedRow.size === 1) {
      const file = this.selectedRow.values().next().value;
      this.download(await this.getBlobFromHash(file), file.name);
    } else {
      for (const file of this.selectedRow) {
        this.zipFile.file<'blob'>(
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
}
