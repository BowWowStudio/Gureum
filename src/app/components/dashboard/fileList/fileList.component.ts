import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '@shared/services/auth.service';
import { FileItem } from './fileList.type';
import { FileDataStore } from '../fileUpload/fileUpload.type';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { saveAs } from 'file-saver';
import { Router, ActivatedRoute } from '@angular/router';
import { FolderComponent } from './folder/folder.component';

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
  treeControl = new NestedTreeControl<FileItem>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileItem>();
  ngOnDestroy(): void { }

  ngOnInit() {
    this.auth.getUser().subscribe(user => {
      const storageRef = firebase.storage().ref().child(user.uid);
      storageRef.listAll().then(res => {
        res.prefixes.forEach(folderRef => {
          console.log(folderRef);
        });
        res.items.forEach(itemRef => {
          console.log(itemRef);
        });
      });
    });

    this.db = firebase.firestore();
    const documentRef = this.db.collection('document');
    this.auth.getUser().subscribe(user => {
      if (user !== null) {
        this.user = user;
        documentRef.where('owner', '==', user.uid).get().then(snapshot => {
          if (this.route.url.includes(this.folderUrl)) {
            this.activatedRoute.paramMap.subscribe((paramMap) => {
              const hash = paramMap.get('hash');
              const fileItem = this.getFileItemFromHash(this.snapshotToFileNode(snapshot), hash, []);
              this.dataSource.data = fileItem[0].children;
              this.hierarchies = fileItem[1].slice(1);
            });
          } else {
            this.dataSource.data = this.snapshotToFileNode(snapshot).children;
          }
          this.loading = false;
        });
      }
    });
  }
  hasChild = (_: number, node: FileItem): boolean => {
    return !!node.children && node.children.length > 0;
  }

  private snapshotToFileNode(
    snapshot: firebase.firestore.QuerySnapshot
  ): FileItem {
    const frame = this.makeFileItemFromPath(snapshot);
    this.mapHashToFolders(snapshot, frame);
    snapshot.forEach(doc => {
      const data = doc.data() as FileDataStore;
      const fileItem = {
        isFolder: data.isFolder,
        name: data.name,
        ref: firebase
          .storage()
          .refFromURL(`gs://${data.bucket}/${data.path}/${data.name}`),
        hash: doc.id
      };
      const corresNode = this.getFileItemFromPath(frame, data.path.split('/'), true);
      if (corresNode.hash !== doc.id) {
        corresNode.children.push(fileItem);
      }
    });
    return frame;
  }
  private getFileItemFromPath(
    fileItem: FileItem,
    paths: string[],
    folder: boolean = false
  ): FileItem | null {
    if (fileItem.children !== null || fileItem.name === paths[0]) {
      if (paths.length === 1) {
        return fileItem;
      } else if (paths.length === 2) {
        return folder
          ? fileItem.children.find(child => child.name === paths[1])
          : fileItem;
      } else {
        const corresChild = fileItem.children.find(
          child => child.name === paths[1]
        );
        return this.getFileItemFromPath(corresChild, paths.slice(1), folder);
      }
    } else {
      return null;
    }
  }
  private getFileItemFromHash(
    fileItem: FileItem,
    hash: string,
    path: HierArchy[]
  ): [FileItem | null, HierArchy[]] {
    const newHierarchy = [...path, { hash: fileItem.hash, name: fileItem.name }];
    if (fileItem.hash === hash) {
      return [fileItem, newHierarchy];
    } else {
      for (const child of fileItem.children) {
        return this.getFileItemFromHash(child, hash, newHierarchy);
      }
    }
  }
  private makeFileItemFromPath(
    snapshot: firebase.firestore.QuerySnapshot
  ): FileItem {
    const pathSet: Set<string[]> = new Set();
    const fileItemLevelMap: Map<number, Map<string, FileItem>> = new Map();
    snapshot.forEach(doc => {
      const data = doc.data() as FileDataStore;
      pathSet.add(data.path.split('/'));
    });
    const root: FileItem = {
      isFolder: true,
      name: this.user.uid,
      children: []
    };
    pathSet.forEach(value => {
      for (let i = 0; i !== value.length; i += 1) {
        const pathString = value.slice(0, i).join('/');
        const result: FileItem = {
          name: value[i],
          isFolder: true,
          children: []
        };
        if (!fileItemLevelMap.has(i)) {
          const newMap = new Map();
          newMap.set(pathString, result);
          fileItemLevelMap.set(i, newMap);
        }
      }
    });
    const levels = Array.from(fileItemLevelMap.keys()).sort();
    levels.shift();
    for (const level of levels) {
      fileItemLevelMap.get(level).forEach((item, key) => {
        const parentPath = [...key.split('/'), ...item.name.split('/')];
        const corresFileItem = this.getFileItemFromPath(root, parentPath);
        corresFileItem.children.push(item);
      });
    }
    return root;
  }
  private mapHashToFolders(snapshot: firebase.firestore.QuerySnapshot, root: FileItem) {
    const folders = snapshot.docs.filter(doc => {
      const data = doc.data() as FileDataStore;
      return data.isFolder;
    });
    folders.forEach(folder => {
      this.getFileItemFromPath(root, (folder.data() as FileDataStore).path.split('/'), true).hash = folder.id;
    });
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
