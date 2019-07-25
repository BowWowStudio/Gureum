import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
@Injectable()
export class AuthService {
  public token: string;
  private db: firebase.firestore.Firestore;
  private userSubject: Subject<firebase.User> = new BehaviorSubject<firebase.User>(null);
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
  public isAuthenticated(): Promise<string> {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
          this.userSubject.next(user);
          resolve('true');
        } else {
          resolve('false');
        }
      });
    });
  }
  public async getUserName(uid: string): Promise<string> {
    console.log(uid);
    return new Promise<string>(async resolve => {
      const returnSubject = new Subject<string>();
      const docRef = this.db.collection('users').doc(uid);
      const name = (await docRef.get()).data().name;
      resolve(name);
    });
  }
}
