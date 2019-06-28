import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {
  public token: string;
  private db: firebase.firestore.Firestore;
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
        return false;
      }
    }
  public login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.auth.signInWithEmailAndPassword(email, password);
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
  public getUser():firebase.User{
    return this.auth.auth.currentUser;
  }
  public isAuthenticated(): string {
    if (firebase.auth().currentUser){
      return 'true';
    }
    return sessionStorage.getItem('session-alive');
  }
}
