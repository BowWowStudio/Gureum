import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, HostListener, } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseKeys } from './firebase.config';
import { Menu, MenuDetail, HTMLInputEvent } from '@shared/interfaces/app.type';
import { AuthService } from '@shared/services/auth.service';
import { MenuClickService } from '@shared/services/menuClick.service';
import { FileUploadService } from '@shared/services/fileUpload.service';
import { MatDialog } from '@angular/material';
import { NewFolderDialogComponent } from './components/dashboard/fileList/newFolderDialog/newFolderDialog.component';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  static readonly toolbarHeight = 64;
  private uploadButton: ElementRef<HTMLButtonElement>;
  @ViewChild('uploadButton', {read: ElementRef, static: false}) set uploadButtonElement(uploadButton: ElementRef<HTMLButtonElement>) {
    if (uploadButton !== undefined && uploadButton !== null) {
      this.uploadButton = uploadButton;
      this.updateButtonCoordinate();
    }
  }
  private readonly folderUrl = 'folder';
  private auth = ['/login', '/register'];
  public sideNavOpen = false;
  public menuEnum = Menu;
  public menuDetails: MenuDetail[];
  public uploadButtonCoordinate: [number, number];
  public uploadTasks: Observable<firebase.storage.UploadTask>[] = [];
  constructor(private route: Router, private authService: AuthService,
     private menuService: MenuClickService, private fileUploadService: FileUploadService,
     public dialog: MatDialog, private activatedRoute: ActivatedRoute, ) {
    this.menuDetails = [ {
      name: 'My Drive',
      isHover: false,
      url: ['dashboard', 'main'],
      corresMenu: Menu.MAIN,
    }, {
      name: 'Shared',
      isHover: false,
      url: ['dashboard', 'shared'],
      corresMenu: Menu.SHARE,
    }, {
      name: 'Recent',
      isHover: false,
      url: ['dashboard', 'recent'],
      corresMenu: Menu.RECENT,
    }];

  }
  public ngOnInit(): void {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseKeys);
    }
  }
  public onRightClick($event : MouseEvent){
    console.log('helo');
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
    let hash = null;
    if (this.route.url.includes(this.folderUrl)) {
      hash = this.getHashFromURL(this.route.url);
    }
    for (let i = 0; i !== event.target.files.length; i += 1) {
      this.uploadTasks.push(this.fileUploadService.fileUpload(event.target.files.item(i), hash));
    }
  }
  public getUploadPercentage(uploadTask: firebase.storage.UploadTask): number {
    if (uploadTask === null) {
      return 0;
    }
    return Math.ceil(uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes * 100);
  }
  private getHashFromURL(url:string):string{
    const urls = url.split('/')
    const hash = urls[urls.indexOf(this.folderUrl) + 1];
    return hash.split('?')[0];
  }
}
