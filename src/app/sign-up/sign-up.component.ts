import {Component, OnInit} from '@angular/core';
import { LoginInformation } from '../Model/login.model';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public newUser: LoginInformation = {id: '', password: ''};
  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }
  public signUp() {
    this.httpService.signUp(this.newUser).subscribe(a => console.log(a));
  }
}
