import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { FileItem, HierArchy } from './fileList.type';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material';
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
    private fileListService: FileListService,
  ) {
  }
  private folderUrl = 'folder';
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
