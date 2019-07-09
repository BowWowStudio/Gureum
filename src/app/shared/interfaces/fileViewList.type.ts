import { FileDataStore } from './FileDataStore.type';

export interface FileListDetail {
    children: Array<FileListDetail>;
    folderName: string;
    files: Array<FileDataStore>;
}
