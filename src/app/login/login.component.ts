import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public load: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  public loadTrue() {
    this.load = true;
  }

}
