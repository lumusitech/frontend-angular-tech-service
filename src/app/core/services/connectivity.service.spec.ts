import { TestBed } from '@angular/core/testing';
import { ConnectivityService } from './connectivity.service';

describe('ConnectivityService', () => {
  let service: ConnectivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ConnectivityService] });
    service = TestBed.inject(ConnectivityService);
  });

  it('reports online by default', () => {
    expect(service.online()).toBe(true);
  });

  it('flips to offline on the window offline event', () => {
    window.dispatchEvent(new Event('offline'));
    expect(service.online()).toBe(false);
  });

  it('flips back to online on the window online event', () => {
    window.dispatchEvent(new Event('offline'));
    window.dispatchEvent(new Event('online'));
    expect(service.online()).toBe(true);
  });

  it('reportOffline corrects the state based on real network failures', () => {
    service.reportOffline();
    expect(service.online()).toBe(false);
  });

  it('reportOnline corrects the state back to online', () => {
    service.reportOffline();
    service.reportOnline();
    expect(service.online()).toBe(true);
  });

  it('reportOnline is a no-op when already online', () => {
    service.reportOnline();
    expect(service.online()).toBe(true);
  });
});
