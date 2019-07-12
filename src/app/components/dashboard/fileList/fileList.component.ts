import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '@shared/services/auth.service';
import { FileItem, MetaData, HierArchy } from './fileList.type';
import { saveAs } from 'file-saver';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as JSZip from 'jszip';
import { MatDialog } from '@angular/material';
import { MenuClickService } from '@shared/services';
import { CryptoService } from '@shared/services/Crypto.service';
import { FileListService } from '@shared/services/fileList.service';
import { AppComponent } from 'src/app/app.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: "app-fileList",
  templateUrl: './fileList.component.html',
  styleUrls: ['./fileList.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        height : '*',
      })),
      state('closed', style({
        opacity: 0,
        height: '0px',
      })),
      transition('closed => open', [
        animate('0.1s')
      ]),
    ]),
  ],
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
  public hierarchies: HierArchy[] = [{ hash: null, name: 'My Drive' }];
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
  public contextMenuTop = 0;
  public contextMenuLeft = 0;
  public isContextMenuOpened = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @HostListener('click') leftClick() {
    this.isContextMenuOpened = false;
  }
  ngOnDestroy(): void {}

  ngOnInit() {
    this.setIsLoading(true);
    this.auth.getUserObservable().subscribe(user => {
      if (this.route.url.includes(this.folderUrl)) {
        // If this is not the root directory
        this.activatedRoute.paramMap.subscribe(async paramMap => {
          const hash = paramMap.get('hash');
          this.fileListService.getHierarchy(hash).subscribe(hierarchies => {
            this.hierarchies = hierarchies;
            this.dataInit(user.uid, hash);
          });
        });
      } else {
        // if this is the root directory
        this.dataInit(user.uid);
      }
    });

  }
  private dataInit(uid: string, hash: string = null) {
    this.fileListService.fileDataStoreToFileListDetail(uid, hash).subscribe(result => {
      this.dataSource.data = result;
      this.setIsLoading(false);
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
    if (hash === undefined || hash === null) {
      this.route.navigate(['/dashboard', 'main']);
    } else {
      this.route.navigate(['/dashboard', 'folder', hash], {queryParams: {hash: hash}});
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
  public onFileRightClick(event: MouseEvent, element: FileItem) {
    if (this.selectedRow.has(element)) {

    } else {
      this.selectedRow.clear();
      this.selectedRow.add(element);
    }
    if (event.target instanceof Element) {
      this.contextMenuTop = event.clientY - AppComponent.toolbarHeight;
      this.contextMenuLeft = event.clientX ;
    }
    if (this.isContextMenuOpened) {
      this.isContextMenuOpened = false;
      setTimeout(() => this.isContextMenuOpened = true, 150);
    } else {

      this.isContextMenuOpened = true;
    }
    event.preventDefault();
  }
  public onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
