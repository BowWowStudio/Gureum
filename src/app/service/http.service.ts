import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../Model/event';
import { Observable } from 'rxjs';
import { LoginInformation } from '../Model/login.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly baseURL = 'http://localhost:3000/';
  constructor(private httpClient: HttpClient) { }
  public getPosts(): Observable<Array<Post>> {
    return this.httpClient.get<Array<Post>>(this.baseURL + 'post');
  }
  public postPosts(body: Post): Observable<object> {
    return this.httpClient.post(this.baseURL + 'post', body);
  }
  public login(body: LoginInformation): Observable<object> {
    return this.httpClient.post(this.baseURL + 'user', body);
  }
  public signUp(body: LoginInformation): Observable<object> {
    return this.httpClient.post(this.baseURL + 'newUser', body);
  }
}
