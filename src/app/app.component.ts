import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseKeys } from './firebase.config';
import { Menu, MenuDetail } from '@shared/interfaces/app.type';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private route: Router, private activatedRoute : ActivatedRoute) {
    
    this.menuDetails = [{
      name: 'My Drive',
      isHover: false,
      url: ['dashboard', 'main'],
      corresMenu: Menu.UPLOAD,
      isActive : false,
    }, {
      name: 'Shared',
      isHover: false,
      url: ['dashboard', 'shared'],
      corresMenu: Menu.SHARE,
      isActive: false,
    }, {
      name: 'Recent',
      isHover: false,
      url: ['dashboard', 'recent'],
      corresMenu: Menu.RECENT,
      isActive : false,
    }];
    
  }
  public ngOnInit(): void {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseKeys);
    }
    this.activatedRoute.url.subscribe(url=>{
      console.log(url);
    })
  }

  public toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
  public navigate(menu: Menu) {
    const corresMenuDetail = this.menuDetails.find(detail=>detail.corresMenu === menu);
    switch (menu) {
      case Menu.UPLOAD: this.route.navigate(corresMenuDetail.url);
        break;
      case Menu.SHARE: this.route.navigate(['dashboard', 'shared']);
        break;
      case Menu.RECENT: this.route.navigateByUrl('/recent');
        break;
    }
  }
  public isAuth(): boolean {
    return this.auth.includes(this.router.url);
  }
}
