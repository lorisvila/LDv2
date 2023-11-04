import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocFctPageComponent } from './doc-fct-page.component';

describe('DocFctPageComponent', () => {
  let component: DocFctPageComponent;
  let fixture: ComponentFixture<DocFctPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocFctPageComponent]
    });
    fixture = TestBed.createComponent(DocFctPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
