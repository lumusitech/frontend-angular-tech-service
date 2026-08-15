import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SyncStatusPanelComponent } from './sync-status-panel.component';
import { OfflineService } from '../../../core/services/offline.service';
import { TranslationService } from '../../../core/services/translation.service';
import type { QueuedRequest } from '../../../core/services/offline-queue-store.service';

function makeRequest(overrides: Partial<QueuedRequest> = {}): QueuedRequest {
  return {
    id: 'req-1',
    method: 'PATCH',
    url: '/api/work-orders/wo-1',
    body: { status: 'completed' },
    idempotencyKey: 'key',
    createdAt: Date.now(),
    attempts: 0,
    state: 'blocked',
    lastError: '400',
    ...overrides,
  };
}

describe('SyncStatusPanelComponent', () => {
  let fixture: ComponentFixture<SyncStatusPanelComponent>;
  let pendingItemsSpy: ReturnType<typeof vi.fn>;
  let blockedItemsSpy: ReturnType<typeof vi.fn>;
  let retryBlockedSpy: ReturnType<typeof vi.fn>;
  let retryAllBlockedSpy: ReturnType<typeof vi.fn>;
  let closeSpy: ReturnType<typeof vi.fn>;

  function flush(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  beforeEach(() => {
    pendingItemsSpy = vi.fn().mockResolvedValue([]);
    blockedItemsSpy = vi.fn().mockResolvedValue([]);
    retryBlockedSpy = vi.fn().mockResolvedValue(undefined);
    retryAllBlockedSpy = vi.fn().mockResolvedValue(undefined);
    closeSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [SyncStatusPanelComponent],
      providers: [
        {
          provide: OfflineService,
          useValue: {
            isSyncing: signal(false),
            online: signal(true),
            pendingCount: signal(0),
            pendingItems: pendingItemsSpy,
            blockedItems: blockedItemsSpy,
            retryBlocked: retryBlockedSpy,
            retryAllBlocked: retryAllBlockedSpy,
          },
        },
        { provide: MatDialogRef, useValue: { close: closeSpy } },
        { provide: TranslationService, useValue: { instant: (key: string) => key } },
      ],
    });

    fixture = TestBed.createComponent(SyncStatusPanelComponent);
  });

  it('renders the title and loads pending/blocked items', async () => {
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('offline.title');
    expect(pendingItemsSpy).toHaveBeenCalled();
    expect(blockedItemsSpy).toHaveBeenCalled();
  });

  it('shows blocked items with their last error and a retry button', async () => {
    blockedItemsSpy.mockResolvedValue([makeRequest()]);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('/api/work-orders/wo-1');
    expect(fixture.nativeElement.textContent).toContain('400');
  });

  it('retries a blocked item on demand', async () => {
    blockedItemsSpy.mockResolvedValue([makeRequest()]);
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();

    const retryButtons = fixture.nativeElement.querySelectorAll('button[title="offline.retry"]');
    retryButtons[0]!.click();

    expect(retryBlockedSpy).toHaveBeenCalledWith('req-1');
  });
});
