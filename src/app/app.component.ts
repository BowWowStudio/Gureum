import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseKeys } from './firebase.config';
import { Menu, MenuDetail } from '@shared/interfaces/app.type';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { MenuClickService } from '@shared/services/menuClick.service';

@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  private uploadButton: ElementRef<HTMLButtonElement>;
  @ViewChild('uploadButton', {read: ElementRef, static: false}) set uploadButtonElement(uploadButton: ElementRef<HTMLButtonElement>) {
    if (uploadButton !== undefined && uploadButton !== null) {
      this.uploadButton = uploadButton;
      this.updateButtonCoordinate();
    }
  }

  private auth = ['/login', '/register'];
  public sideNavOpen = false;
  public menuEnum = Menu;
  public menuDetails: MenuDetail[];
  public uploadButtonCoordinate: [number, number];
  constructor(private route: Router, private authService: AuthService, private menuService:MenuClickService ) {
    this.menuDetails = [{
      name: 'Upload',
      isHover: false,
      url: ['dashboard', 'upload'],
      corresMenu: Menu.UPLOAD,
    }, {
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
    console.log(this.uploadButtonCoordinate);
  }
  public calculateUploadMenuStyle() {
      return this.uploadButtonCoordinate === undefined ? {} : {
        'top': this.uploadButtonCoordinate[1],
        'left': this.uploadButtonCoordinate[0],
      };
  }
  public menuClicked(menu :Menu){
    this.menuService.menuClicked(menu);
  }
}
