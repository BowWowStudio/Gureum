import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, 
  RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve)=>{
      this.authService.isAuthenticated().then(isAuth=>{
        if (isAuth === 'true') {
          this.router.navigate(['/dashboard']);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

constructor(private authService: AuthService, private router: Router) { }

}
