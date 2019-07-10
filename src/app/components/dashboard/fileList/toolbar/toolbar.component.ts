import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HierArchy } from '../fileList.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input('Hierarchy') hierarchies: HierArchy[];
  @Output() folderClick  = new EventEmitter<any>();
  constructor( public route: Router ) { }

  ngOnInit() {
  }
  public openFolder(hash: string) {
    if (hash === undefined || hash === null) {
      this.route.navigate(['/dashboard', 'main']);
    } else {
      this.route.navigate(['/dashboard', 'folder', hash]);
    }
    // this.folderClick.emit();
  }
}
