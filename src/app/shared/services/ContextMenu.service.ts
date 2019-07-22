import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
private isOpen = false;
private openSubject: Subject<boolean> = new Subject<boolean>();
constructor() { }
  public getOpenObservable(): Observable<boolean> {
    return this.openSubject.asObservable();
  }
  public setOpen(isOpen: boolean) {
    this.isOpen = isOpen;
    this.openSubject.next(this.isOpen);
  }
}
