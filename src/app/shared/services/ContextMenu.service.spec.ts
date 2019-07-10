/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContextMenuService } from './ContextMenu.service';

describe('Service: ContextMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContextMenuService]
    });
  });

  it('should ...', inject([ContextMenuService], (service: ContextMenuService) => {
    expect(service).toBeTruthy();
  }));
});
