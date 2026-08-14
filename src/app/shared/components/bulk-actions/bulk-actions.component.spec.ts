import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService } from '../../../core/services/translation.service';
import { BulkActionsComponent } from './bulk-actions.component';

function createTranslationMock() {
  return { instant: vi.fn().mockImplementation((key: string) => key) };
}

describe('BulkActionsComponent', () => {
  let fixture: ComponentFixture<BulkActionsComponent>;
  let component: BulkActionsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkActionsComponent],
      providers: [{ provide: TranslationService, useValue: createTranslationMock() }],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function setSelected(count: number, total = count): void {
    fixture.componentRef.setInput('selectedCount', count);
    fixture.componentRef.setInput('totalCount', total);
    fixture.detectChanges();
  }

  function buttonByText(text: string): HTMLButtonElement | null {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    return (
      Array.from(buttons as HTMLButtonElement[]).find((b) =>
        b.textContent?.trim().includes(text),
      ) ?? null
    );
  }

  function toggleSelectAll(): void {
    const input = fixture.nativeElement.querySelector(
      'mat-checkbox input[type="checkbox"]',
    ) as HTMLInputElement;
    input.click();
    fixture.detectChanges();
  }

  function clearButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector(
      'button[aria-label="bulk.clearSelection"]',
    ) as HTMLButtonElement | null;
  }

  function mobileToolbar(): HTMLElement | null {
    return fixture.nativeElement.querySelector('[role="toolbar"]') as HTMLElement | null;
  }

  describe('computeds', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have allSelected false when nothing selected', () => {
      setSelected(0, 5);
      expect(component.allSelected()).toBe(false);
      expect(component.someSelected()).toBe(false);
    });

    it('should have allSelected true when selected equals total', () => {
      setSelected(5, 5);
      expect(component.allSelected()).toBe(true);
      expect(component.someSelected()).toBe(false);
    });

    it('should have someSelected true on partial selection', () => {
      setSelected(2, 5);
      expect(component.allSelected()).toBe(false);
      expect(component.someSelected()).toBe(true);
    });
  });

  describe('select all checkbox', () => {
    it('should emit selectAll with true', () => {
      const spy = vi.fn();
      component.selectAll.subscribe(spy);

      setSelected(0, 5);
      toggleSelectAll();

      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should emit selectAll with false', () => {
      const spy = vi.fn();
      component.selectAll.subscribe(spy);

      setSelected(5, 5);
      toggleSelectAll();

      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('count label', () => {
    it('should render the selected count', () => {
      setSelected(3);
      const label = Array.from(fixture.nativeElement.querySelectorAll('span')).find((s) =>
        (s as HTMLElement).textContent?.includes('3'),
      ) as HTMLElement;
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('3');
    });
  });

  describe('idle state (no selection)', () => {
    it('should render the select-all checkbox and a hint, but no action buttons', () => {
      setSelected(0);
      expect(
        fixture.nativeElement.querySelector('mat-checkbox input[type="checkbox"]'),
      ).toBeTruthy();

      const hint = fixture.nativeElement.querySelector('.select-hint') as HTMLElement;
      expect(hint).toBeTruthy();
      expect(hint.textContent).toContain('bulk.selectHint');

      expect(buttonByText('bulk.clearSelection')).toBeNull();
      expect(buttonByText('bulk.exportCsv')).toBeNull();
      expect(buttonByText('bulk.deleteSelected')).toBeNull();
      expect(clearButton()).toBeNull();
    });

    it('should not render the mobile toolbar without selection', () => {
      setSelected(0);
      expect(mobileToolbar()).toBeNull();
    });
  });

  describe('active selection', () => {
    it('should replace the hint with the action buttons and show the mobile toolbar', () => {
      setSelected(2);
      expect(fixture.nativeElement.querySelector('.select-hint')).toBeNull();
      expect(buttonByText('bulk.exportCsv')).toBeTruthy();
      expect(buttonByText('bulk.deleteSelected')).toBeTruthy();
      expect(clearButton()).toBeTruthy();
      expect(mobileToolbar()).toBeTruthy();
    });

    it('should hide the menu again when selection returns to zero', () => {
      setSelected(2);
      expect(mobileToolbar()).toBeTruthy();

      setSelected(0);
      expect(fixture.nativeElement.querySelector('.select-hint')).toBeTruthy();
      expect(buttonByText('bulk.exportCsv')).toBeNull();
      expect(mobileToolbar()).toBeNull();
    });

    it('should render the count chip with aria-live when items are selected', () => {
      setSelected(4);
      const chip = fixture.nativeElement.querySelector('.count-chip') as HTMLElement;
      expect(chip).toBeTruthy();
      expect(chip.getAttribute('aria-live')).toBe('polite');
      expect(chip.textContent).toContain('4');
    });
  });

  describe('clear selection', () => {
    it('should be absent with no selection', () => {
      setSelected(0);
      expect(clearButton()).toBeNull();
    });

    it('should emit clearSelection when clicked with selection', () => {
      const spy = vi.fn();
      component.clearSelection.subscribe(spy);

      setSelected(2);
      clearButton()?.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should be disabled while loading', () => {
      fixture.componentRef.setInput('loading', true);
      setSelected(2);
      expect(clearButton()?.disabled).toBe(true);
    });
  });

  describe('export CSV', () => {
    it('should show export button by default', () => {
      setSelected(1);
      expect(buttonByText('bulk.exportCsv')).toBeTruthy();
    });

    it('should hide export button when showExport is false', () => {
      fixture.componentRef.setInput('showExport', false);
      setSelected(1);
      expect(buttonByText('bulk.exportCsv')).toBeNull();
    });

    it('should emit exportCsv when clicked with selection', () => {
      const spy = vi.fn();
      component.exportCsv.subscribe(spy);

      setSelected(2);
      buttonByText('bulk.exportCsv')?.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should be hidden with no selection', () => {
      setSelected(0);
      expect(buttonByText('bulk.exportCsv')).toBeNull();
    });
  });

  describe('status change', () => {
    it('should hide status change button by default', () => {
      setSelected(1);
      expect(buttonByText('bulk.changeStatus')).toBeNull();
    });

    it('should show status change button and custom label when enabled', () => {
      fixture.componentRef.setInput('showStatusChange', true);
      fixture.componentRef.setInput('statusChangeLabel', 'Cambiar estado');
      setSelected(1);
      expect(buttonByText('Cambiar estado')).toBeTruthy();
    });

    it('should emit statusChange when clicked with selection', () => {
      const spy = vi.fn();
      component.statusChange.subscribe(spy);

      fixture.componentRef.setInput('showStatusChange', true);
      fixture.componentRef.setInput('statusChangeLabel', 'bulk.changeStatus');
      setSelected(2);
      buttonByText('bulk.changeStatus')?.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('activate / deactivate', () => {
    it('should hide activate buttons by default', () => {
      setSelected(1);
      expect(buttonByText('bulk.activate')).toBeNull();
      expect(buttonByText('bulk.deactivate')).toBeNull();
    });

    it('should emit activate true and false', () => {
      const spy = vi.fn();
      component.activate.subscribe(spy);

      fixture.componentRef.setInput('showActivateDeactivate', true);
      setSelected(2);

      buttonByText('bulk.activate')?.click();
      expect(spy).toHaveBeenLastCalledWith(true);

      buttonByText('bulk.deactivate')?.click();
      expect(spy).toHaveBeenLastCalledWith(false);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('delete', () => {
    it('should show delete button by default', () => {
      setSelected(1);
      expect(buttonByText('bulk.deleteSelected')).toBeTruthy();
    });

    it('should hide delete button when showDelete is false', () => {
      fixture.componentRef.setInput('showDelete', false);
      setSelected(1);
      expect(buttonByText('bulk.deleteSelected')).toBeNull();
    });

    it('should emit deleteSelected when clicked with selection', () => {
      const spy = vi.fn();
      component.deleteSelected.subscribe(spy);

      setSelected(2);
      buttonByText('bulk.deleteSelected')?.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading', () => {
    it('should show the progress bar when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeTruthy();
    });

    it('should not show the progress bar when not loading', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeNull();
    });

    it('should disable action buttons while loading', () => {
      fixture.componentRef.setInput('loading', true);
      setSelected(2);
      expect(buttonByText('bulk.exportCsv')?.disabled).toBe(true);
      expect(clearButton()?.disabled).toBe(true);
    });
  });
});
