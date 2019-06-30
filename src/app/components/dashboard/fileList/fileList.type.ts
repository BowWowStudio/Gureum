export interface FileItem {
  name: string;
  isFolder: boolean;
  ref?: firebase.storage.Reference;
  children?: FileItem[];
  hash?: string;
}
