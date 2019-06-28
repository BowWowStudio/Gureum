import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: firebase.User|null = null;
  constructor(private auth: AngularFireAuth) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      if(user !== null){
        this.user = user;
      }
    });
  }

}
