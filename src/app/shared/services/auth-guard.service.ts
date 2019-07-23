import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise(async resolve =>{
      if (await this.authService.isAuthenticated() !== 'true') {
        console.log('hello');
        this.router.navigate(['/login']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }
  constructor(private authService: AuthService, private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise(async resolve =>{
      if (await this.authService.isAuthenticated() !== 'true') {
        this.router.navigate(['/login']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }
}
