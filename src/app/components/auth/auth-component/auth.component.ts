import { Component } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@shared';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public form: FormGroup;
  public showSpinner = false;
  constructor(private authService: AuthService, private fb: FormBuilder, private router:Router, private _snackBar: MatSnackBar) {
    this.form = fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  public async login(): Promise<void> {
    try {
      this.showSpinner = true;
      const credential = await this.authService.login(this.form.get('email').value, this.form.get('password').value);
      if (credential || this.authService.isAuthenticated()) {
        this.onSuccess();
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      switch(err.code){
        case 'auth/invalid-email' :
          this.openSnackBar('Please check your email', 'ok');
          break;
        case 'auth/user-not-found' :
        case 'auth/wrong-password' :
          this.openSnackBar('Please check your email and password', 'ok');
      }
      
    }
    finally {
      this.showSpinner = false;
    }
  }
  public onSuccess(): void {
    return this.authService.onSuccess();
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
