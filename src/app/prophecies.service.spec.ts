import { TestBed } from '@angular/core/testing';

import { PropheciesService } from './prophecies.service';

describe('PropheciesService', () => {
  let service: PropheciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropheciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
