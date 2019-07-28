export interface FileDataStore {
  owner: string;
  ownerName?: string;
  bucket: string;
  name: string;
  isFolder: boolean;
  parent?: string;
  hash?: string;
  isDeleted: boolean;
  star: boolean;
}
