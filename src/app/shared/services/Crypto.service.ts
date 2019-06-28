import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
constructor() { }
  public findHash(file:File){
    // const fileBuffer = Buffer.from(file)
    // crypto.SHA256(file);
  }
}
