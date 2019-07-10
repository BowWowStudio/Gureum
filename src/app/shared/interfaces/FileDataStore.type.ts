export interface FileDataStore {
    owner: string;
    bucket:string;
    name:string;
    isFolder:boolean;
    parent? : string;
    hash? : string;
  }
  