/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuClickService } from './menuClick.service';

describe('Service: MenuClick', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuClickService]
    });
  });

  it('should ...', inject([MenuClickService], (service: MenuClickService) => {
    expect(service).toBeTruthy();
  }));
});
