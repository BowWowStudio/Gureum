export interface FileItem {
  name: string;
  isFolder: boolean;
  ref?: firebase.storage.Reference;
  owner: string;
  lastModified?: Date;
  size?: number;
  hash?: string;
  isDeleted: boolean;
  star: boolean;
}
export interface MetaData {
  bucket: string;
  contentDisposition: string;
  contentEncoding: string;
  contentType: string;
  fullPath: string;
  generation: string;
  md5Hash: string;
  metageneration: string;
  name: string;
  size: number;
  timeCreated: Date;
  type: string;
  updated: Date;
}
export interface HierArchy {
  name: string;
  hash: string;
}