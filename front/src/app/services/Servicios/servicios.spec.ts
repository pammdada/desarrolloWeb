import { TestBed } from '@angular/core/testing';

import { Servicios } from '../Servicios/servicios';

describe('Servicios', () => {
  let service: Servicios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Servicios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
