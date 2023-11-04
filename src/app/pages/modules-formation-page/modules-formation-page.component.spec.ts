import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesFormationPageComponent } from './modules-formation-page.component';

describe('ModulesFormationPageComponent', () => {
  let component: ModulesFormationPageComponent;
  let fixture: ComponentFixture<ModulesFormationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModulesFormationPageComponent]
    });
    fixture = TestBed.createComponent(ModulesFormationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
