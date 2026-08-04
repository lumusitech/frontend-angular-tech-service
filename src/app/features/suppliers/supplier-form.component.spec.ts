import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { SupplierFormComponent } from './supplier-form.component';
import { SuppliersService } from '../../core/services/suppliers.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

function createDialogRefMock() {
  return { close: vi.fn() };
}

describe('SupplierFormComponent', () => {
  let fixture: ComponentFixture<SupplierFormComponent>;
  let component: SupplierFormComponent;
  let dialogRef: ReturnType<typeof createDialogRefMock>;
  let toast: { show: ReturnType<typeof vi.fn> };
  let createSpy: ReturnType<typeof vi.fn>;
  let updateSpy: ReturnType<typeof vi.fn>;

  function setup(data: { mode: 'create' | 'edit'; supplier?: never }) {
    dialogRef = createDialogRefMock();
    toast = { show: vi.fn() };
    createSpy = vi.fn().mockReturnValue(of({ id: 'x-1' }));
    updateSpy = vi.fn().mockReturnValue(of({ id: 'x-1' }));

    TestBed.configureTestingModule({
      imports: [SupplierFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: SuppliersService, useValue: { create: createSpy, update: updateSpy } },
        { provide: ToastService, useValue: toast },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(SupplierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function fillValidModel() {
    component.model.set({ name: 'S', contact: 'C', phone: '111', address: 'A', email: 's@t.com', notes: '', isActive: true });
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
      contact: 'C',
      phone: '111',
      address: 'A',
      email: 'existing@test.com',
      notes: '',
      isActive: false,
    };

    beforeEach(() => setup({ mode: 'edit', supplier: existing } as never));

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
