import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, HostListener, AfterContentInit, AfterViewInit, ChangeDetectorRef, } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseKeys } from './firebase.config';
import { Menu, MenuDetail, HTMLInputEvent } from '@shared/interfaces/app.type';
import { AuthService } from '@shared/services/auth.service';
import { MenuClickService } from '@shared/services/menuClick.service';
import { FileUploadService } from '@shared/services/fileUpload.service';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { NewFolderDialogComponent } from './components/dashboard/fileList/newFolderDialog/newFolderDialog.component';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ContextMenuService } from '@shared/services/ContextMenu.service';
import { FileListService } from '@shared/services/fileList.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadButton', {read: ElementRef, static: false}) set uploadButtonElement(uploadButton: ElementRef<HTMLButtonElement>) {
    if (uploadButton !== undefined && uploadButton !== null) {
      this.uploadButton = uploadButton;
      this.updateButtonCoordinate();
    }
  }
  constructor(private route: Router, private authService: AuthService,
     private menuService: MenuClickService, private fileUploadService: FileUploadService,
     public dialog: MatDialog, private activatedRoute: ActivatedRoute, private contextMenuService: ContextMenuService,
     private fileListService: FileListService, private changeDetectorRef :ChangeDetectorRef, private matIconRegistry: MatIconRegistry, 
     private domSanitizer: DomSanitizer ) {
    this.menuDetails = [ {
      name: 'My Drive',
      isHover: false,
      url: ['dashboard', 'main'],
      corresMenu: Menu.MAIN,
      icon: 'harddisk',
    }, {
      name: 'Shared',
      isHover: false,
      url: ['dashboard', 'shared'],
      corresMenu: Menu.SHARE,
      icon: 'account-multiple-outline',
    }, {
      name: 'Recent',
      isHover: false,
      url: ['dashboard', 'recent'],
      corresMenu: Menu.RECENT,
      icon: 'clock-outline',
    }, {
      name: 'Starred',
      isHover: false,
      url: ['dashboard', 'star'],
      corresMenu: Menu.STARRED,
      icon: 'star-outline',
    }, {
      name: 'Bin',
      isHover: false,
      url: ['dashboard', 'bin'],
      corresMenu: Menu.BIN,
      icon: 'trash-can-outline',
    }];
  }
  static readonly toolbarHeight = 64;
  static readonly sideNavWidth = 250;
  public sideNavWidth = AppComponent.sideNavWidth;
  private uploadButton: ElementRef<HTMLButtonElement>;
  public readonly totalSpace = 1024;
  public totalOccupatedSpaceSubject : Subject<number>= new Subject();
  public totalOccupatedSpace :Observable<number>;
  public uploadTaskDivOpened = false;
  public uploadTaskDivDetailOpened = true;
  private readonly folderUrl = 'folder';
  private auth = ['/login', '/register' , '/'];
  public sideNavOpen = false;
  public menuEnum = Menu;
  public menuDetails: MenuDetail[];
  public uploadButtonCoordinate: [number, number];
  public uploadTasks: Map<{file: File, isCanceled: boolean, isHover: boolean}, Observable<firebase.storage.UploadTask>> = new Map();
  public ngOnInit(): void {
    this.totalOccupatedSpace = this.totalOccupatedSpaceSubject.asObservable();
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseKeys);
    }
    this.contextMenuService.getOpenObservable().subscribe(isContextOpen => {
      this.uploadTaskDivOpened = isContextOpen;
    });
    this.fileListService.calculateTotalSpace();
    this.fileListService.getTotalSpace().subscribe(totalSpace => {
      this.totalOccupatedSpaceSubject.next(Math.round(totalSpace * 100) / 100);
      this.changeDetectorRef.detectChanges();
    });
  }
  public ngAfterViewInit(): void {
  }
  public onRightClick($event: MouseEvent) {
    $event.preventDefault();
  }
  public toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
  public navigate(menu: Menu) {
    const corresMenuDetail = this.menuDetails.find(detail => detail.corresMenu === menu);
    this.route.navigate(corresMenuDetail.url);
  }
  public isAuth(): boolean {
    return this.auth.includes(this.route.url);
  }
  public logOut(): void {
    this.authService.logout();
  }
  public profilePage(): void {
    this.route.navigate(['dashboard', 'profile']);
  }
  public updateButtonCoordinate() {
    const element = this.uploadButton.nativeElement;
    this.uploadButtonCoordinate = [element.getBoundingClientRect().left, -element.offsetHeight];
  }
  public calculateUploadMenuStyle() {
      return this.uploadButtonCoordinate === undefined ? {} : {
        'top': this.uploadButtonCoordinate[1],
        'left': this.uploadButtonCoordinate[0],
      };
  }
  public newFolder() {
    const dialogRef = this.dialog.open(NewFolderDialogComponent, {
      width: '250px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(async folderName => {
      if (folderName === undefined) {
        return;
      }
      if (this.route.url.includes(this.folderUrl)) {
        const hash = this.getHashFromURL(this.route.url);
        await this.fileUploadService.newFolder(folderName, hash);
      } else {
        await this.fileUploadService.newFolder(folderName);
      }
    });
  }
  public async uploadFile(event: HTMLInputEvent) {
    console.log('uploadFile');
    let hash = null;
    if (this.route.url.includes(this.folderUrl)) {
      hash = this.getHashFromURL(this.route.url);
    }
    for (let i = 0; i !== event.target.files.length; i += 1) {
      const file = event.target.files.item(i);
      this.uploadTasks.set({file: file, isCanceled: false, isHover: false}, (this.fileUploadService.fileUpload(file, hash)));
    }
  }
  public getUploadPercentage(uploadTask: firebase.storage.UploadTask): number {
    if (uploadTask === null) {
      return 0;
    }
    return Math.ceil(uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes * 100);
  }
  private getHashFromURL(url: string): string {
    const urls = url.split('/');
    const hash = urls[urls.indexOf(this.folderUrl) + 1];
    return hash.split('?')[0];
  }
  public cancelUpload(uploadTask: firebase.storage.UploadTask) {
    this.fileUploadService.fileUploadCancel(uploadTask);
  }
}
