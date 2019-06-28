/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShowSpinnerService } from './showSpinner.service';

describe('Service: ShowSpinner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowSpinnerService]
    });
  });

  it('should ...', inject([ShowSpinnerService], (service: ShowSpinnerService) => {
    expect(service).toBeTruthy();
  }));
});
