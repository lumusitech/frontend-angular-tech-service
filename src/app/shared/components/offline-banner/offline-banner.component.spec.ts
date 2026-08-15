import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OfflineBannerComponent } from './offline-banner.component';
import { OfflineService } from '../../../core/services/offline.service';
import { TranslationService } from '../../../core/services/translation.service';

describe('OfflineBannerComponent', () => {
  let fixture: ComponentFixture<OfflineBannerComponent>;
  let online: ReturnType<typeof signal<boolean>>;
  let pendingCount: ReturnType<typeof signal<number>>;
  let blockedCount: ReturnType<typeof signal<number>>;
  let isSyncing: ReturnType<typeof signal<boolean>>;
  let openDialogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    online = signal(true);
    pendingCount = signal(0);
    blockedCount = signal(0);
    isSyncing = signal(false);
    openDialogSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [OfflineBannerComponent],
      providers: [
        {
          provide: OfflineService,
          useValue: { online, pendingCount, blockedCount, isSyncing },
        },
        { provide: MatDialog, useValue: { open: openDialogSpy } },
        { provide: TranslationService, useValue: { instant: (key: string) => key } },
      ],
    });

    fixture = TestBed.createComponent(OfflineBannerComponent);
  });

  it('renders nothing when online with nothing pending', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('renders the offline message when offline', () => {
    online.set(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('offline.offlineMessage');
  });

  it('renders the syncing state when syncing', () => {
    isSyncing.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('offline.syncing');
  });

  it('renders the blocked banner when there are blocked changes', () => {
    blockedCount.set(2);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('offline.blocked');
  });

  it('renders the pending banner when there are pending changes', () => {
    pendingCount.set(3);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('offline.pending');
  });

  it('opens the sync panel when clicked', () => {
    online.set(false);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button')!.click();

    expect(openDialogSpy).toHaveBeenCalled();
  });
});
