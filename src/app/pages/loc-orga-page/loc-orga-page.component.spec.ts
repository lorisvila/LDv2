import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocOrgaPageComponent } from './loc-orga-page.component';

describe('LocOrgaPageComponent', () => {
  let component: LocOrgaPageComponent;
  let fixture: ComponentFixture<LocOrgaPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocOrgaPageComponent]
    });
    fixture = TestBed.createComponent(LocOrgaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
