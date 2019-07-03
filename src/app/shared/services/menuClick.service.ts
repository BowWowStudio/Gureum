import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Menu } from '@shared/interfaces/app.type';

@Injectable({
  providedIn: 'root'
})
export class MenuClickService {
private menuSubject: Subject<Menu>;
constructor() {
  this.menuSubject = new Subject();
}
  public getMenuObservable(): Observable<Menu> {
    return this.menuSubject.asObservable();
  }
  public menuClicked(menu: Menu) {
    this.menuSubject.next(menu);
  }
}
