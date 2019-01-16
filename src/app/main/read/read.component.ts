import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { HttpService } from 'src/app/service/http.service';
import { Post } from 'src/app/Model/event';


@Component({
  selector: 'app-read',
  styleUrls: ['read.component.css'],
  templateUrl: 'read.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReadComponent implements OnInit {
  public dataSource = new MatTableDataSource<Post>();
  columnsToDisplay = ['title', 'date', 'body'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    this.httpService.getPosts().subscribe(a => {
      console.log(a);
      this.dataSource = new MatTableDataSource<Post>(a);
      this.dataSource.paginator = this.paginator;
    });
  }
}

