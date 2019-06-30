export interface FileListDetail {
  children: Array<FileListDetail>;
  folderName: string;
  files: Array<File>;
}
export interface DirectoryFile {
  file: File;
  webkitRelativePath: string;
}

export interface FileDataStore {
  path: string;
  owner: string;
  bucket:string;
  name:string;
  isFolder:boolean;
}
