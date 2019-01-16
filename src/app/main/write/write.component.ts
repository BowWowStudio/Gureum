import {Component, OnInit} from '@angular/core';
import { Post } from 'src/app/Model/event';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {
  public newPost: Post = {title: '', body: '', date: null};
  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }
  public submit() {
    this.httpService.postPosts(this.newPost).subscribe(a => console.log(a));
  }

}
