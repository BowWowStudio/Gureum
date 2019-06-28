import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseKeys } from './firebase.config';
import { Menu, MenuDetail } from '@shared/interfaces/app.type';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  auth = ['/login', '/register'];
  public sideNavOpen = false;
  public menu = Menu;
  public menuDetails: MenuDetail[];

  constructor(private route: Router, private authService: AuthService, ) {

    this.menuDetails = [{
      name: 'Upload',
      isHover: false,
      url: ['dashboard', 'upload'],
      corresMenu: Menu.UPLOAD,
    },{
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
}
