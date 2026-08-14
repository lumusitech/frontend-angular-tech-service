import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ConvertInquiryDialogComponent } from './convert-inquiry-dialog.component';
import { InquiriesService } from '../../core/services/inquiries.service';
import { ClientsService } from '../../core/services/clients.service';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

function createDialogRefMock() {
  return { close: vi.fn() };
}

function createToastMock() {
  return { show: vi.fn() };
}

function createPaginated<T>(data: T[]) {
  return { data, total: data.length, page: 1, limit: 20, totalPages: 1 };
}

const inquiry = {
  id: 'iq-1',
  clientName: 'Juan Pérez',
  clientPhone: '1122334455',
  clientEmail: 'juan@test.com',
  clientAddress: 'Av. Corrientes 1234',
  description: 'La notebook no prende',
  source: 'phone',
  status: 'reviewed',
  priority: 'high',
  assignedTo: null,
  assignedToId: null,
  createdBy: { id: 'u-1', name: 'Admin', email: 'admin@techservice.local' },
  createdById: 'u-1',
  technicianNotes: null,
  estimatedCost: null,
  estimatedDuration: null,
  materialsNeeded: null,
  recommendation: null,
  adminDecision: 'approved',
  adminNotes: null,
  workOrderId: null,
  contactedAt: null,
  reviewedAt: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('ConvertInquiryDialogComponent', () => {
  let fixture: ComponentFixture<ConvertInquiryDialogComponent>;
  let component: ConvertInquiryDialogComponent;
  let dialogRef: ReturnType<typeof createDialogRefMock>;
  let toast: ReturnType<typeof createToastMock>;
  let convertSpy: ReturnType<typeof vi.fn>;
  let createClientSpy: ReturnType<typeof vi.fn>;
  let getAllClientsSpy: ReturnType<typeof vi.fn>;

  function setup() {
    dialogRef = createDialogRefMock();
    toast = createToastMock();
    convertSpy = vi.fn().mockReturnValue(of(inquiry));
    createClientSpy = vi.fn().mockReturnValue(of({ id: 'c-1' }));
    getAllClientsSpy = vi
      .fn()
      .mockReturnValue(
        of(
          createPaginated([{ id: 'c-1', name: 'Cliente Ex', email: 'ex@test.com', phone: '999' }]),
        ),
      );

    TestBed.configureTestingModule({
      imports: [ConvertInquiryDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { inquiry } },
        {
          provide: InquiriesService,
          useValue: { convert: convertSpy },
        },
        {
          provide: ClientsService,
          useValue: {
            getAll: getAllClientsSpy,
            create: createClientSpy,
          },
        },
        {
          provide: ServiceTypesService,
          useValue: {
            getAll: vi
              .fn()
              .mockReturnValue(of(createPaginated([{ id: 'st-1', name: 'Reparación' }]))),
          },
        },
        { provide: ToastService, useValue: toast },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(ConvertInquiryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(setup);

  it('should prefill new client data from the inquiry', () => {
    expect(component.newClientModel().name).toBe('Juan Pérez');
    expect(component.newClientModel().email).toBe('juan@test.com');
    expect(component.newClientModel().phone).toBe('1122334455');
    expect(component.newClientModel().address).toBe('Av. Corrientes 1234');
  });

  it('should prefill diagnosis and workAddress from the inquiry', () => {
    expect(component.model().diagnosis).toBe('La notebook no prende');
    expect(component.model().workAddress).toBe('Av. Corrientes 1234');
  });

  it('should default to new client mode', () => {
    expect(component.clientMode()).toBe('new');
  });

  it('should load service types and clients on init', () => {
    expect(component.serviceTypes().length).toBe(1);
    expect(component.filteredClients().length).toBe(1);
  });

  it('should not submit without a service type', () => {
    component.onSubmit();
    expect(createClientSpy).not.toHaveBeenCalled();
    expect(convertSpy).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should not create client when new client form is invalid', () => {
    component.model.update((m) => ({ ...m, serviceTypeId: 'st-1' }));
    component.newClientModel.update((m) => ({ ...m, email: '' }));

    component.onSubmit();

    expect(createClientSpy).not.toHaveBeenCalled();
    expect(convertSpy).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should create the client and then convert in new client mode', () => {
    component.model.update((m) => ({ ...m, serviceTypeId: 'st-1' }));

    component.onSubmit();

    expect(createClientSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Juan Pérez',
        email: 'juan@test.com',
        phone: '1122334455',
        address: 'Av. Corrientes 1234',
      }),
    );
    expect(convertSpy).toHaveBeenCalledWith(
      'iq-1',
      expect.objectContaining({
        clientId: 'c-1',
        serviceTypeId: 'st-1',
        diagnosis: 'La notebook no prende',
        workAddress: 'Av. Corrientes 1234',
      }),
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
    expect(toast.show).toHaveBeenCalledWith('common.toast.created', 'success');
  });

  it('should not convert in existing mode without a selected client', () => {
    component.model.update((m) => ({ ...m, serviceTypeId: 'st-1' }));
    component.clientMode.set('existing');

    component.onSubmit();

    expect(convertSpy).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should convert with the selected existing client', () => {
    component.model.update((m) => ({ ...m, serviceTypeId: 'st-1' }));
    component.clientMode.set('existing');
    component.onClientSelected('c-1');

    component.onSubmit();

    expect(convertSpy).toHaveBeenCalledWith(
      'iq-1',
      expect.objectContaining({ clientId: 'c-1', serviceTypeId: 'st-1' }),
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should show error toast and not close when convert fails', () => {
    convertSpy.mockReturnValue(throwError(() => new Error('fail')));
    component.model.update((m) => ({ ...m, serviceTypeId: 'st-1' }));
    component.clientMode.set('existing');
    component.onClientSelected('c-1');

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(toast.show).toHaveBeenCalledWith('common.toast.errorCreated', 'error');
  });
});
