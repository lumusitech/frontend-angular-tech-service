import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from '../../../core/services/translation.service';
import {
  StatusChangeDialogComponent,
  StatusChangeDialogData,
} from './status-change-dialog.component';

function createDialogRefMock() {
  return { close: vi.fn() };
}

describe('StatusChangeDialogComponent', () => {
  let fixture: ComponentFixture<StatusChangeDialogComponent>;
  let component: StatusChangeDialogComponent;
  let dialogRef: ReturnType<typeof createDialogRefMock>;

  function setup(data: StatusChangeDialogData): void {
    dialogRef = createDialogRefMock();

    TestBed.configureTestingModule({
      imports: [StatusChangeDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(StatusChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  const statusOptions = [
    { value: 'pending', labelKey: 'workOrders.statuses.pending' },
    { value: 'in_progress', labelKey: 'workOrders.statuses.inProgress' },
    { value: 'completed', labelKey: 'workOrders.statuses.completed' },
  ];

  describe('with statusOptions', () => {
    beforeEach(() => {
      setup({ statusOptions, statusLabel: 'bulk.status' });
    });

    it('should default selectedStatus to first option', () => {
      expect(component.selectedStatus()).toBe('pending');
    });

    it('should render mat-select with the provided options', () => {
      const select = fixture.nativeElement.querySelector('mat-select');
      expect(select).toBeTruthy();

      const matSelect = fixture.debugElement.query(By.css('mat-select'))
        .componentInstance as MatSelect;
      matSelect.open();
      fixture.detectChanges();

      const options = document.querySelectorAll('mat-option');
      expect(options.length).toBe(3);
      matSelect.close();
    });

    it('should update selectedStatus on status change', () => {
      component.onStatusChange({ value: 'completed' });
      expect(component.selectedStatus()).toBe('completed');
    });

    it('should close with confirmed true, detail trimmed and selected status', () => {
      component.detail.set('  some detail  ');
      component.onStatusChange({ value: 'in_progress' });
      component.confirm();

      expect(dialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
        detail: 'some detail',
        status: 'in_progress',
      });
    });

    it('should close with confirmed false and empty status on cancel', () => {
      const cancelButton = Array.from(fixture.nativeElement.querySelectorAll('button')).find((b) =>
        (b as HTMLButtonElement).textContent?.includes('common.cancel'),
      );
      (cancelButton as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(dialogRef.close).toHaveBeenCalledWith({
        confirmed: false,
        detail: '',
        status: '',
      });
    });
  });

  describe('without statusOptions', () => {
    beforeEach(() => {
      setup({ title: 'Change status' });
    });

    it('should default selectedStatus to empty string', () => {
      expect(component.selectedStatus()).toBe('');
    });

    it('should not render mat-select', () => {
      expect(fixture.nativeElement.querySelector('mat-select')).toBeNull();
    });

    it('should close with empty status on confirm', () => {
      component.confirm();
      expect(dialogRef.close).toHaveBeenCalledWith({
        confirmed: true,
        detail: '',
        status: '',
      });
    });
  });
});
