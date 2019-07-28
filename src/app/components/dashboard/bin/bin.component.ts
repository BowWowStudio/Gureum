import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileItem } from '../fileList/fileList.type';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { FileListService } from '@shared/services/fileList.service';
@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss']
})
export class BinComponent implements OnInit {

  public loading;
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['name', 'owner'];
  public columnCellName: Map<string, string> = new Map([
    ['name', 'Name'],
    ['owner', 'Owner'],
    // ['lastModified', 'Last Modified'],
    // ['size', 'Size']
  ]);
  public selectedRow: Set<FileItem> = new Set();
  public isContextMenuOpened = false;
  private subscriptions: Subscription[] = [];
  constructor(
    private auth: AuthService,
    public route: Router,
    private fileListService: FileListService, ) { }

  ngOnInit() {
    this.auth.getUserPromise().then(user => {
      this.subscriptions.push(this.fileListService.getDeletedFiles(user.uid).subscribe(async result => {
        if (result !== null) {
          this.dataSource.data = result;
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
      // this.contextMenuTop = event.clientY - AppComponent.toolbarHeight;
      // this.contextMenuLeft = event.clientX - AppComponent.sideNavWidth;
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
