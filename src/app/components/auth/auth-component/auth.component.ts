import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '@shared';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  private userEmail : string;
  private passWord : string;
  public showSpinner = false;
  constructor(private authService: AuthService) {}

  public async login() : Promise<void> {
    try{
      this.showSpinner = true;
      const credential = await this.authService.login(this.userEmail,this.passWord);
      if(credential){
        this.onSuccess();
      }
    }
    finally{
      this.showSpinner = false;
    }
  }
  public onSuccess(): void {
    return this.authService.onSuccess();
  }

}
