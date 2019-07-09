import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import * as hash from 'hash.js';
import {Buffer} from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
constructor() { }
  public findHash(file: File ,salt:string): Promise<string> {
    const fileReader: FileReader =  new FileReader();
    fileReader.readAsBinaryString(file);
    return new Promise((resolve) => {
      fileReader.onload = () => {
        resolve(hash.sha256().update(fileReader.result as string).update(salt).digest('hex'));
      };
    });
  }
  public findStringHash(string:string, salt:string): string {
    return hash.sha256().update(string).update(salt).digest('hex');
  }
  public findFolderHash(folderName : string, ownerId : string, date : Date){
    return hash.sha256().update(folderName).update(ownerId).update(date).digest('hex');
  }
}
