import {Component, OnInit} from '@angular/core';
import { LoginInformation } from '../Model/login.model';
import { HttpService } from '../service/http.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public load = false;
  public loginInfo: LoginInformation = {id: '', password: ''};
  constructor(private httpservice: HttpService, private router: Router) {
  }

  ngOnInit() {
  }
  public LogIn() {
    this.httpservice.login(this.loginInfo).subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate(['/write']);
      }
    });
  }
  public loadTrue() {
    this.load = true;
  }

}
