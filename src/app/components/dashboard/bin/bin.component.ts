import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileItem } from '../fileList/fileList.type';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { FileListService } from '@shared/services/fileList.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss'],
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
export class BinComponent implements OnInit {

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
  constructor(
    private auth: AuthService,
    public route: Router,
    private fileListService: FileListService, ) { }

  ngOnInit() {
    this.auth.getUserPromise().then(user => {
      this.subscriptions.push(this.fileListService.getDeletedFiles(user.uid).subscribe(async result => {
        if (result !== null) {
          this.dataSource.data = result;
          this.loading = false;
        }
      }));
    })
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
  public closeContextMenu(){
    this.isContextMenuOpened = false;
  }
}
