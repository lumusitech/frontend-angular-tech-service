import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ServiceTypeFormComponent } from './service-type-form.component';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

function createDialogRefMock() {
  return { close: vi.fn() };
}

describe('ServiceTypeFormComponent', () => {
  let fixture: ComponentFixture<ServiceTypeFormComponent>;
  let component: ServiceTypeFormComponent;
  let dialogRef: ReturnType<typeof createDialogRefMock>;
  let toast: { show: ReturnType<typeof vi.fn> };
  let createSpy: ReturnType<typeof vi.fn>;
  let updateSpy: ReturnType<typeof vi.fn>;

  function setup(data: { mode: 'create' | 'edit'; serviceType?: never }) {
    dialogRef = createDialogRefMock();
    toast = { show: vi.fn() };
    createSpy = vi.fn().mockReturnValue(of({ id: 'x-1' }));
    updateSpy = vi.fn().mockReturnValue(of({ id: 'x-1' }));

    TestBed.configureTestingModule({
      imports: [ServiceTypeFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: ServiceTypesService, useValue: { create: createSpy, update: updateSpy } },
        { provide: ToastService, useValue: toast },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(ServiceTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function fillValidModel() {
    component.model.set({ name: 'T', description: 'D', estimatedDuration: '60', isActive: true, requiresDelivery: false });
  }

  describe('create mode', () => {
    beforeEach(() => setup({ mode: 'create' }));

    it('should not submit when form is invalid', () => {
      component.onSubmit();
      expect(createSpy).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should submit valid create form and close dialog', () => {
      fillValidModel();
      component.onSubmit();
      expect(createSpy).toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should show error toast when create fails', () => {
      createSpy.mockReturnValue(throwError(() => new Error('fail')));
      fillValidModel();
      component.onSubmit();
      expect(dialogRef.close).not.toHaveBeenCalled();
      expect(toast.show).toHaveBeenCalledWith('common.toast.errorCreated', 'error');
    });
  });

  describe('edit mode', () => {
    const existing = {
      id: 'x-1',
      name: 'Existing',
      isActive: false,
    };

    beforeEach(() => setup({ mode: 'edit', serviceType: existing } as never));

    it('should pre-fill form with existing data', () => {
      expect(component.model().name).toBe('Existing');
    });

    it('should submit update and close dialog', () => {
      component.onSubmit();
      expect(updateSpy).toHaveBeenCalledWith('x-1', expect.any(Object));
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should show error toast when update fails', () => {
      updateSpy.mockReturnValue(throwError(() => new Error('fail')));
      component.onSubmit();
      expect(toast.show).toHaveBeenCalledWith('common.toast.errorUpdated', 'error');
    });
  });
});
