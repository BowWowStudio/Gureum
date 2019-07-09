export interface FileListDetail {
    children: Array<FileListDetail>;
    folderName: string;
    files: Array<File>;
}
