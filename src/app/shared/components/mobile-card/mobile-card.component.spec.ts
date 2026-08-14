import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService } from '../../../core/services/translation.service';
import { MobileCardComponent } from './mobile-card.component';

describe('MobileCardComponent', () => {
  let fixture: ComponentFixture<MobileCardComponent>;
  let component: MobileCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCardComponent],
      providers: [
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((k: string) => k) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Card title');
    fixture.componentRef.setInput('fields', []);
    fixture.detectChanges();
  });

  function getCheckbox(): HTMLElement | null {
    return fixture.nativeElement.querySelector('mat-checkbox');
  }

  function toggleCheckbox(): void {
    const input = fixture.nativeElement.querySelector(
      'mat-checkbox input[type="checkbox"]',
    ) as HTMLInputElement;
    input.click();
    fixture.detectChanges();
  }

  describe('selectable', () => {
    it('should not render checkbox by default', () => {
      expect(getCheckbox()).toBeNull();
    });

    it('should render checkbox when selectable is true', () => {
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();
      expect(getCheckbox()).toBeTruthy();
    });

    it('should reflect checked state', () => {
      fixture.componentRef.setInput('selectable', true);
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const checkbox = getCheckbox();
      expect(checkbox?.classList).toContain('mat-mdc-checkbox-checked');
    });
  });

  describe('selectionChange', () => {
    it('should emit selectionChange when checkbox changes', () => {
      const spy = vi.fn();
      component.selectionChange.subscribe(spy);

      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      toggleCheckbox();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not emit selectionChange when not selectable', () => {
      const spy = vi.fn();
      component.selectionChange.subscribe(spy);

      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
