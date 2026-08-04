import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ClientFormComponent } from './client-form.component';
import { ClientsService } from '../../core/services/clients.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

function createDialogRefMock() {
  return { close: vi.fn() };
}

function createToastMock() {
  return { show: vi.fn() };
}

describe('ClientFormComponent', () => {
  let fixture: ComponentFixture<ClientFormComponent>;
  let component: ClientFormComponent;
  let dialogRef: ReturnType<typeof createDialogRefMock>;
  let toast: ReturnType<typeof createToastMock>;
  let createSpy: ReturnType<typeof vi.fn>;
  let updateSpy: ReturnType<typeof vi.fn>;

  function setup(data: { mode: 'create' | 'edit'; client?: never }) {
    dialogRef = createDialogRefMock();
    toast = createToastMock();
    createSpy = vi.fn().mockReturnValue(of({ id: 'c-1' }));
    updateSpy = vi.fn().mockReturnValue(of({ id: 'c-1' }));

    TestBed.configureTestingModule({
      imports: [ClientFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: ClientsService, useValue: { create: createSpy, update: updateSpy } },
        { provide: ToastService, useValue: toast },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('create mode', () => {
    beforeEach(() => setup({ mode: 'create' }));

    it('should create with isActive defaulting to true', () => {
      expect(component.model().isActive).toBe(true);
    });

    it('should not submit when form is invalid', () => {
      component.onSubmit();
      expect(createSpy).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should submit a valid create form and close dialog', () => {
      component.model.set({
        name: 'Test Client',
        email: 'client@test.com',
        phone: '123456',
        address: 'Calle 123',
        cuit: '',
        internetProvider: '',
        internetPlan: '',
        ivaCondition: 'monotributo',
        isActive: true,
      });

      component.onSubmit();

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Client',
          email: 'client@test.com',
          isActive: true,
          ivaCondition: 'monotributo',
        }),
      );
      expect(dialogRef.close).toHaveBeenCalled();
      expect(toast.show).toHaveBeenCalledWith(
        'common.toast.created',
        'success',
      );
    });

    it('should show error toast when create fails', () => {
      createSpy.mockReturnValue(throwError(() => new Error('fail')));

      component.model.set({
        name: 'Test Client',
        email: 'client@test.com',
        phone: '123456',
        address: 'Calle 123',
        cuit: '',
        internetProvider: '',
        internetPlan: '',
        ivaCondition: 'monotributo',
        isActive: true,
      });

      component.onSubmit();

      expect(dialogRef.close).not.toHaveBeenCalled();
      expect(toast.show).toHaveBeenCalledWith(
        'common.toast.errorCreated',
        'error',
      );
    });
  });

  describe('edit mode', () => {
    const existingClient = {
      id: 'c-1',
      name: 'Existing',
      email: 'existing@test.com',
      phone: '111',
      address: 'Addr',
      isActive: false,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    beforeEach(() =>
      setup({ mode: 'edit', client: existingClient } as never),
    );

    it('should pre-fill form with existing client data', () => {
      expect(component.model().name).toBe('Existing');
      expect(component.model().email).toBe('existing@test.com');
      expect(component.model().isActive).toBe(false);
    });

    it('should preserve isActive=false on edit', () => {
      component.model.set({
        ...component.model(),
        isActive: false,
      });

      component.onSubmit();

      expect(updateSpy).toHaveBeenCalledWith(
        'c-1',
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should submit update and close dialog', () => {
      component.onSubmit();
      expect(updateSpy).toHaveBeenCalledWith('c-1', expect.any(Object));
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should show error toast when update fails', () => {
      updateSpy.mockReturnValue(throwError(() => new Error('fail')));
      component.onSubmit();
      expect(toast.show).toHaveBeenCalledWith(
        'common.toast.errorUpdated',
        'error',
      );
    });
  });
});
