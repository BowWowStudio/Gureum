import { Component, OnInit, Input, HostBinding, ChangeDetectorRef, HostListener } from '@angular/core';
import { FileItem } from '../fileList.type';

@Component({
  selector: 'app-contextMenu',
  templateUrl: './contextMenu.component.html',
  styleUrls: ['./contextMenu.component.css']
})
export class ContextMenuComponent implements OnInit {
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

  constructor(private changeDetector: ChangeDetectorRef) { }
  @Input() fileItems: Set<FileItem> = new Set();

  @HostBinding('style.top.px')
  public styleTop = 0;
  @HostBinding('style.left.px')
  public styleLeft = 0;
  @HostListener('contextmenu', ['$event']) ContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  ngOnInit() {
  }
  public isOnlyFiles(): boolean {
    const tempArray = [...this.fileItems];
    return tempArray.every(file => !file.isFolder);
  }
  public isOnlyFolders(): boolean {
    const tempArray = [...this.fileItems];
    return tempArray.every(file => file.isFolder);
  }
}