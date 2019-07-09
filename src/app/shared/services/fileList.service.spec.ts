/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileListService } from './fileList.service';

describe('Service: FileList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileListService]
    });
  });

  it('should ...', inject([FileListService], (service: FileListService) => {
    expect(service).toBeTruthy();
  }));
});
