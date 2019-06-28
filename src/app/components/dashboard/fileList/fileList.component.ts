import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-fileList',
  templateUrl: './fileList.component.html',
  styleUrls: ['./fileList.component.css']
})
export class FileListComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    
  }

}
