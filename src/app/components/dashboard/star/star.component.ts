import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FileItem } from '../fileList/fileList.type';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FileListService } from '@shared/services/fileList.service';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from '@shared/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
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
export class StarComponent implements OnInit {
  public loading = true;
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['name', 'ownerName'];
  public columnCellName: Map<string, string> = new Map([
    ['name', 'Name'],
    ['ownerName', 'Owner'],
    // ['lastModified', 'Last Modified'],
    // ['size', 'Size']
  ]);
  public selectedRow: Set<FileItem> = new Set();
  public isContextMenuOpened = false;
  private subscriptions: Subscription[] = [];
  public contextMenuTop = 0;
  public contextMenuLeft = 0;
  private listSubscription: Subscription;
  constructor(
    private auth: AuthService,
    public route: Router,
    private fileListService: FileListService, ) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.fileListService.setStarFileListNull();
  }
  ngOnInit() {
    this.dataInit();
  }
  public refreshList() {
    this.selectedRow.forEach(row => {
      this.fileListService.deleteFromStarFileList(row.hash);
    });
  }
  private dataInit() {
    this.auth.getUserPromise().then(user => {
      this.listSubscription = this.fileListService.getStaredFiles(user.uid).subscribe(async result => {
        if (result !== null) {
          this.dataSource.data = result;
          this.loading = false;
        }
      });
    });
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
  public openFolder(hash: string) {
    if (hash === undefined || hash === null) {
      this.route.navigate(['/dashboard', 'main']);
    } else {
      this.route.navigate(['/dashboard', 'folder', hash], {queryParams: {hash: hash}});
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
      this.contextMenuLeft = event.clientX - AppComponent.sideNavWidth;
    }
    if (this.isContextMenuOpened) {
      this.isContextMenuOpened = false;
      setTimeout(() => this.isContextMenuOpened = true, 50);
    } else {

      this.isContextMenuOpened = true;
    }
    event.preventDefault();
  }
  public onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  public closeContextMenu() {
    this.isContextMenuOpened = false;
  }
}
