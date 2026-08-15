import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OfflineStatusButtonComponent } from './offline-status-button.component';
import { OfflineService } from '../../../core/services/offline.service';
import { TranslationService } from '../../../core/services/translation.service';

describe('OfflineStatusButtonComponent', () => {
  let fixture: ComponentFixture<OfflineStatusButtonComponent>;
  let online: ReturnType<typeof signal<boolean>>;
  let pendingCount: ReturnType<typeof signal<number>>;
  let blockedCount: ReturnType<typeof signal<number>>;
  let isSyncing: ReturnType<typeof signal<boolean>>;

  beforeEach(() => {
    online = signal(true);
    pendingCount = signal(0);
    blockedCount = signal(0);
    isSyncing = signal(false);

    TestBed.configureTestingModule({
      imports: [OfflineStatusButtonComponent],
      providers: [
        {
          provide: OfflineService,
          useValue: { online, pendingCount, blockedCount, isSyncing },
        },
        { provide: MatDialog, useValue: { open: vi.fn() } },
        { provide: TranslationService, useValue: { instant: (key: string) => key } },
      ],
    });

    fixture = TestBed.createComponent(OfflineStatusButtonComponent);
  });

  it('renders nothing when online with nothing pending', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('renders the button when offline', () => {
    online.set(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
  });

  it('shows the total pending+blocked count badge', () => {
    pendingCount.set(2);
    blockedCount.set(1);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('3');
  });
});
