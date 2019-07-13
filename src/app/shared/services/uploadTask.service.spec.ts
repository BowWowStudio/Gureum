/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UploadTaskService } from './uploadTask.service';

describe('Service: UploadTask', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadTaskService]
    });
  });

  it('should ...', inject([UploadTaskService], (service: UploadTaskService) => {
    expect(service).toBeTruthy();
  }));
});
