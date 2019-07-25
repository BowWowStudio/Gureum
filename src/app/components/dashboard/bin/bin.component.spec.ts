/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BinComponent } from './bin.component';

describe('BinComponent', () => {
  let component: BinComponent;
  let fixture: ComponentFixture<BinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
