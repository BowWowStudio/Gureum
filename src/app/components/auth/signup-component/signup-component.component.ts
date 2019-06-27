import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup-component',
  templateUrl: './signup-component.component.html',
  styleUrls: ['./signup-component.component.scss']
})
export class SignupComponentComponent implements OnInit {

  public form: FormGroup;
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router,private snackBar: MatSnackBar) {
    this.form = fb.group({
      'name' : ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  ngOnInit() {
  }
  public async register() {
    if (await this.authService.signUp(this.form.get('email').value, this.form.get('password').value, this.form.get('name').value)) {
      this.router.navigateByUrl('/login');
      this.snackBar.open('User Created');
    }
  }
  styleUrls: ['./signup-component.component.css']
})
}
