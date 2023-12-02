import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenExitosaComponent } from './orden-exitosa.component';

describe('OrdenExitosaComponent', () => {
  let component: OrdenExitosaComponent;
  let fixture: ComponentFixture<OrdenExitosaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenExitosaComponent]
    });
    fixture = TestBed.createComponent(OrdenExitosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
