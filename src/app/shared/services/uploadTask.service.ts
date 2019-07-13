import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadTaskService {
  private openObservable : Subject<boolean> = new Subject<boolean>();
  
constructor() { }
  public getIsOpened():Observable<boolean>{
    return this.openObservable.asObservable();
  }
  public setIsOpened(isOpened:boolean){
    this.openObservable.next(isOpened);
  }
}
