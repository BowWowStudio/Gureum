import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { firebaseKeys } from './firebase.config';
import { Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  auth = ['/login', '/register'];

  public ngOnInit(): void {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseKeys);
    }
  }
  public isAuth(): boolean {
    return this.auth.includes(this.router.url);
  }
}
