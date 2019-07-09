import { Injectable } from '@angular/core';
import { CryptoService } from './Crypto.service';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FileListService {
  private db: firebase.firestore.Firestore;
  private ref: firebase.storage.Reference;
  constructor(private crypto: CryptoService, private authService: AuthService) {
    this.db = firebase.firestore();
    this.authService.getUserObservable().subscribe(user => {
      this.ref = firebase.storage().ref(user.uid);
    });
  }
}
