import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '@shared/services/auth.service';
import { FileItem } from './fileList.type';
import { FileDataStore } from '../fileUpload/fileUpload.type';
import { saveAs } from 'file-saver';
import { Router, ActivatedRoute } from '@angular/router';

interface HierArchy {
  name: string;
  hash: string;
}

@Component({
  selector: "app-fileList",
  templateUrl: './fileList.component.html',
  styleUrls: ['./fileList.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService, public route: Router, private activatedRoute: ActivatedRoute) { }
  private folderUrl = 'folder';
  private db: firebase.firestore.Firestore;
  public fileLists: FileItem[];
  private user: firebase.User;
  public hierarchies: HierArchy[];
  public loading = true;
  public datas: FileItem[];

  ngOnDestroy(): void { }

  ngOnInit() {
    this.db = firebase.firestore();
    const documentRef = this.db.collection('document');
    this.auth.getUser().subscribe(async (user) => {
      if (user !== null) {
        let storageRef: firebase.storage.Reference;
        let rootFileItem: FileItem;
        if (this.route.url.includes(this.folderUrl)) {
          this.activatedRoute.paramMap.subscribe((paramMap) => {
            const hash = paramMap.get('hash');
            documentRef.doc(hash).get().then(snapshot => {
              const data = snapshot.data() as FileDataStore;
              storageRef = firebase.storage().refFromURL(`gs://${data.bucket}/${data.path}`);
              rootFileItem = {
                name: data.name,
                hash: snapshot.id,
                isFolder: data.isFolder,
                ref : storageRef,
                children : [],
              };
              storageRef.listAll().then(listResult => {
                this.processListResultToFileItem(listResult, rootFileItem).then(async result => {
                  this.datas = result.children;
                  this.hierarchies = await this.getHierarchy(user.uid, data.path);
                  this.loading = false;
                });
              });
            });
          });
        } else {
          storageRef = firebase.storage().ref(user.uid);
          rootFileItem = {
            name: user.uid,
            isFolder: true,
            ref : storageRef,
            children : [],
          };
          storageRef.listAll().then(listResult => {
            this.processListResultToFileItem(listResult, rootFileItem).then(result => {
              this.datas = result.children;
              this.loading = false;
            });
          });
        }
      }
    });
  }
  private async processListResultToFileItem(listResult: firebase.storage.ListResult, fileItem: FileItem): Promise<FileItem> {
    for (const prefix of listResult.prefixes) {
      const listItem = await prefix.listAll();
      const hashResult = await this.db.collection('document').where('isFolder', '==', true).where('path', '==', prefix.fullPath).get();
      const hash = hashResult.docs[0].id;
      const newFileItem: FileItem = {
        name: prefix.name,
        isFolder: true,
        children: [],
        ref : prefix,
        hash : hash,
      };
      fileItem.children.push(await this.processListResultToFileItem(listItem, newFileItem));
    }
    for (const item of listResult.items) {
      console.log(item.getMetadata());
      fileItem.children.push({
        isFolder: false,
        name: item.name,
        ref: item,
      });
    }
    return fileItem;
  }
  private async getHierarchy(uid: string, fullPath: string): Promise<HierArchy[]> {
    const hierarchy: HierArchy[] = [];
    const documentRef = this.db.collection('document');
    const paths = fullPath.split('/');
    for (let i = 1; i !== paths.length; i += 1) {
      const newFullPath = paths.slice(0, i + 1).join('/');
      const result = (await documentRef.where('path', '==', newFullPath).get()).docs[0];
      hierarchy.push({
        hash: result.id,
        name: paths[i],
      });
    }
    return hierarchy;
  }
  public download(ref: firebase.storage.Reference) {
    ref.getDownloadURL().then(url => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = async () => {
        const blob = xhr.response;
        saveAs(blob, ref.name);
      };
      xhr.open('GET', url);
      xhr.send();
    });
  }
  public openFolder(hash: string) {
    if (hash === undefined) {
      this.route.navigate(['/dashboard', 'main']);
    } else {
      this.route.navigate(['/dashboard', 'folder', hash]);
    }
  }
}
