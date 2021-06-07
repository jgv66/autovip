import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposdeservicioComponent } from './tiposdeservicio.component';

describe('TiposdeservicioComponent', () => {
  let component: TiposdeservicioComponent;
  let fixture: ComponentFixture<TiposdeservicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposdeservicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposdeservicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
