import { Component, OnInit, Input, HostBinding, HostListener, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FileItem } from '../../fileList/fileList.type';
import { FileListService } from '@shared/services/fileList.service';
import { FileUploadService } from '@shared/services/fileUpload.service';

@Component({
  selector: 'app-binContextMenu',
  templateUrl: './binContextMenu.component.html',
  styleUrls: ['./binContextMenu.component.scss']
})
export class BinContextMenuComponent implements OnInit {

  @Input()
  set top(number: number) {
    this.styleTop = number;
    this.changeDetector.detectChanges();
  }
  @Input()
  set left(number: number) {
    this.styleLeft = number;
    this.changeDetector.detectChanges();
  }
  @Output() clicked = new EventEmitter();
  constructor(private changeDetector: ChangeDetectorRef, private fileUploadService: FileUploadService,
    private fileListService: FileListService) { }
  @Input() fileItems: Set<FileItem> = new Set();

  @HostBinding('style.top.px')
  public styleTop = 0;
  @HostBinding('style.left.px')
  public styleLeft = 0;
  @HostListener('contextmenu', ['$event']) ContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
  ngOnInit(): void {
  }
  public fileDelete() {
    this.fileUploadService.fileDelete(this.fileItems).then(() => {
      this.fileItems.forEach(fileItem => {
        this.fileListService.deleteFromBinFileList(fileItem.hash);
      });
    });
    this.clicked.emit();
  }
  public restore() {
    this.fileUploadService.restoreFile(this.fileItems).then(() => {
      this.fileItems.forEach(fileItem => {
        this.fileListService.deleteFromBinFileList(fileItem.hash);
      });
    });
    this.clicked.emit();
  }
}
