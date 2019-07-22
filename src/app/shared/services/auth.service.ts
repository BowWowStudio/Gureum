import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AuthService {
  public token: string;
  private db: firebase.firestore.Firestore;
  private userSubject :Subject<firebase.User> = new Subject<firebase.User>();
  constructor(
    private router: Router,
    private auth: AngularFireAuth) {
      this.db = firebase.firestore();
    }

    public async signUp(email: string, password: string, name: string): Promise<boolean> {
      try {
        const credential = await this.auth.auth.createUserWithEmailAndPassword(email, password);
        await credential.user.updateProfile({
          displayName: name
        });
        const docRef = this.db.collection('users').doc(credential.user.uid);
        await docRef.set({
          name: name,
        });
        return true;
      } catch (error) {
        throw error;
      }
    }
  public async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      const credential = await this.auth.auth.signInWithEmailAndPassword(email, password);
      this.userSubject.next(credential.user);
      return credential;
    } catch (err) {
      throw err;
    }
  }
  public onSuccess(): void {
    sessionStorage.setItem('session-alive', 'true');
    this.auth.idToken.subscribe(token => {
      this.token = token;
    });
  }

  public logout(): void {
    sessionStorage.removeItem('session-alive');
    this.auth.auth.signOut();
    this.token = null;
    this.router.navigate(['/']);
  }

  public getIdToken(): string {
    firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }
  public getUserObservable(): Observable<firebase.User> {
    return this.userSubject.asObservable();
  }
  public isAuthenticated(): string {
    if (firebase.auth().currentUser) {
      return 'true';
    }
    return sessionStorage.getItem('session-alive');
  }
}
