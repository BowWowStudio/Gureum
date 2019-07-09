export interface FileDataStore {
    path: string;
    owner: string;
    bucket:string;
    name:string;
    isFolder:boolean;
    parent? : string;
    hash? : string;
  }
  