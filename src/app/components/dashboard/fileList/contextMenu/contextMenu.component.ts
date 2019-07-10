import { Component, OnInit, Input, HostBinding, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contextMenu',
  templateUrl: './contextMenu.component.html',
  styleUrls: ['./contextMenu.component.css']
})
export class ContextMenuComponent implements OnInit {
  @Input()
  set top(number:number){
    this.styleTop = number;
    this.changeDetector.detectChanges();
  }
  @Input()
  set left(number:number){
    
    this.styleLeft = number;
    this.changeDetector.detectChanges();
  }
  
  @HostBinding('style.top.px')
  public styleTop = 0;
  @HostBinding('style.left.px')
  public styleLeft = 0;

  constructor(private changeDetector : ChangeDetectorRef) { }

  ngOnInit() {
  }

}
