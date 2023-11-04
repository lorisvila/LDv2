import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LDPageComponent } from './ld-page.component';

describe('LDPageComponent', () => {
  let component: LDPageComponent;
  let fixture: ComponentFixture<LDPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LDPageComponent]
    });
    fixture = TestBed.createComponent(LDPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
