export interface FileListDetail {
    children: Array<FileListDetail>;
    folderName: string;
    files: Array<File>;
}
export interface DirectoryFile {
    file:File;
    webkitRelativePath : string;
}