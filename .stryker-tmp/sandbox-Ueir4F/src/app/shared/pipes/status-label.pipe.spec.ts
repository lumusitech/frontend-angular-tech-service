// @ts-nocheck
import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../../core/services/translation.service';
import { StatusLabelPipe } from './status-label.pipe';

describe('StatusLabelPipe', () => {
  let pipe: StatusLabelPipe;
  let translationService: TranslationService;

  const mockTranslations: Record<string, unknown> = {
    statusLabels: {
      pending: 'Pendiente',
      assigned: 'Asignada',
      in_progress: 'En progreso',
      postponed: 'Pospuesta',
      completed: 'Completada',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      refunded: 'Reembolsado',
      cash: 'Efectivo',
      transfer: 'Transferencia',
      credit_card: 'Tarjeta de crédito',
      debit_card: 'Tarjeta de débito',
      rent: 'Alquiler',
      utilities: 'Servicios',
      salaries: 'Sueldos',
      tools: 'Herramientas',
      transport: 'Transporte',
      advertising: 'Publicidad',
      supplies: 'Insumos',
      maintenance: 'Mantenimiento',
      hosting: 'Hosting',
      other: 'Otro',
      diagnosis: 'Diagnóstico',
      issue: 'Problema',
      observation: 'Observación',
      internal: 'Interno',
      workshop: 'Taller',
      on_site: 'En sitio',
      draft: 'Borrador',
      issued: 'Emitida',
      invoiceTypeA: 'Factura A',
      invoiceTypeB: 'Factura B',
      invoiceTypeC: 'Factura C',
    },
    common: {
      active: 'Activo',
      inactive: 'Inactivo',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusLabelPipe, TranslationService],
    });

    translationService = TestBed.inject(TranslationService);
    translationService.translations.set(mockTranslations);
    pipe = TestBed.inject(StatusLabelPipe);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('workOrderStatus labels', () => {
    it('should return "Pendiente" for pending', () => {
      expect(pipe.transform('pending', 'workOrderStatus')).toBe('Pendiente');
    });

    it('should return "Asignada" for assigned', () => {
      expect(pipe.transform('assigned', 'workOrderStatus')).toBe('Asignada');
    });

    it('should return "En progreso" for in_progress', () => {
      expect(pipe.transform('in_progress', 'workOrderStatus')).toBe('En progreso');
    });

    it('should return "Pospuesta" for postponed', () => {
      expect(pipe.transform('postponed', 'workOrderStatus')).toBe('Pospuesta');
    });

    it('should return "Completada" for completed', () => {
      expect(pipe.transform('completed', 'workOrderStatus')).toBe('Completada');
    });

    it('should return "Entregada" for delivered', () => {
      expect(pipe.transform('delivered', 'workOrderStatus')).toBe('Entregada');
    });

    it('should return "Cancelada" for cancelled', () => {
      expect(pipe.transform('cancelled', 'workOrderStatus')).toBe('Cancelada');
    });
  });

  describe('workOrderPriority labels', () => {
    it('should return "Baja" for low', () => {
      expect(pipe.transform('low', 'workOrderPriority')).toBe('Baja');
    });

    it('should return "Media" for medium', () => {
      expect(pipe.transform('medium', 'workOrderPriority')).toBe('Media');
    });

    it('should return "Alta" for high', () => {
      expect(pipe.transform('high', 'workOrderPriority')).toBe('Alta');
    });

    it('should return "Urgente" for urgent', () => {
      expect(pipe.transform('urgent', 'workOrderPriority')).toBe('Urgente');
    });
  });

  describe('paymentStatus labels', () => {
    it('should return "Aprobado" for approved', () => {
      expect(pipe.transform('approved', 'paymentStatus')).toBe('Aprobado');
    });

    it('should return "Rechazado" for rejected', () => {
      expect(pipe.transform('rejected', 'paymentStatus')).toBe('Rechazado');
    });

    it('should return "Reembolsado" for refunded', () => {
      expect(pipe.transform('refunded', 'paymentStatus')).toBe('Reembolsado');
    });
  });

  describe('paymentMethod labels', () => {
    it('should return "Efectivo" for cash', () => {
      expect(pipe.transform('cash', 'paymentMethod')).toBe('Efectivo');
    });

    it('should return "Transferencia" for transfer', () => {
      expect(pipe.transform('transfer', 'paymentMethod')).toBe('Transferencia');
    });

    it('should return "Tarjeta de crédito" for credit_card', () => {
      expect(pipe.transform('credit_card', 'paymentMethod')).toBe('Tarjeta de crédito');
    });

    it('should return "Tarjeta de débito" for debit_card', () => {
      expect(pipe.transform('debit_card', 'paymentMethod')).toBe('Tarjeta de débito');
    });
  });

  describe('expenseCategory labels', () => {
    it('should return correct label for each category', () => {
      expect(pipe.transform('rent', 'expenseCategory')).toBe('Alquiler');
      expect(pipe.transform('utilities', 'expenseCategory')).toBe('Servicios');
      expect(pipe.transform('salaries', 'expenseCategory')).toBe('Sueldos');
      expect(pipe.transform('tools', 'expenseCategory')).toBe('Herramientas');
      expect(pipe.transform('transport', 'expenseCategory')).toBe('Transporte');
      expect(pipe.transform('advertising', 'expenseCategory')).toBe('Publicidad');
      expect(pipe.transform('supplies', 'expenseCategory')).toBe('Insumos');
      expect(pipe.transform('maintenance', 'expenseCategory')).toBe('Mantenimiento');
      expect(pipe.transform('hosting', 'expenseCategory')).toBe('Hosting');
      expect(pipe.transform('other', 'expenseCategory')).toBe('Otro');
    });
  });

  describe('noteType labels', () => {
    it('should return "Diagnóstico" for diagnosis', () => {
      expect(pipe.transform('diagnosis', 'noteType')).toBe('Diagnóstico');
    });

    it('should return "Problema" for issue', () => {
      expect(pipe.transform('issue', 'noteType')).toBe('Problema');
    });

    it('should return "Observación" for observation', () => {
      expect(pipe.transform('observation', 'noteType')).toBe('Observación');
    });

    it('should return "Interno" for internal', () => {
      expect(pipe.transform('internal', 'noteType')).toBe('Interno');
    });
  });

  describe('activeInactive labels', () => {
    it('should return "Activo" for true', () => {
      expect(pipe.transform(true, 'activeInactive')).toBe('Activo');
    });

    it('should return "Inactivo" for false', () => {
      expect(pipe.transform(false, 'activeInactive')).toBe('Inactivo');
    });
  });

  describe('invoiceStatus labels', () => {
    it('should return "Borrador" for draft', () => {
      expect(pipe.transform('draft', 'invoiceStatus')).toBe('Borrador');
    });

    it('should return "Emitida" for issued', () => {
      expect(pipe.transform('issued', 'invoiceStatus')).toBe('Emitida');
    });
  });

  describe('invoiceType labels', () => {
    it('should return "Factura A" for A', () => {
      expect(pipe.transform('A', 'invoiceType')).toBe('Factura A');
    });

    it('should return "Factura B" for B', () => {
      expect(pipe.transform('B', 'invoiceType')).toBe('Factura B');
    });

    it('should return "Factura C" for C', () => {
      expect(pipe.transform('C', 'invoiceType')).toBe('Factura C');
    });
  });

  describe('edge cases', () => {
    it('should return the raw value for unknown status', () => {
      expect(pipe.transform('unknown_status', 'workOrderStatus')).toBe('unknown_status');
    });

    it('should return empty string for empty input', () => {
      expect(pipe.transform('', 'workOrderStatus')).toBe('');
    });
  });
});
