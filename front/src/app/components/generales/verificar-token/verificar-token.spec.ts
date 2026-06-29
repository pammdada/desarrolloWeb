import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarToken } from './verificar-token';

describe('VerificarToken', () => {
  let component: VerificarToken;
  let fixture: ComponentFixture<VerificarToken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarToken]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarToken);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
