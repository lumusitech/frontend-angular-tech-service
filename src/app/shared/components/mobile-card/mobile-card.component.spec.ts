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

  describe('swipe actions', () => {
    function getSwipeRoot(): HTMLElement {
      return fixture.nativeElement.querySelector('.swipe-root') as HTMLElement;
    }

    function getSwipeCard(): HTMLElement {
      return fixture.nativeElement.querySelector('.swipe-card') as HTMLElement;
    }

    function dispatchTouch(eventType: string, clientX: number): void {
      const event = new TouchEvent(eventType, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', {
        value: [{ clientX }],
        configurable: true,
      });
      getSwipeRoot().dispatchEvent(event);
    }

    function touchStart(clientX: number): void {
      dispatchTouch('touchstart', clientX);
    }

    function touchMove(clientX: number): void {
      dispatchTouch('touchmove', clientX);
    }

    function touchEnd(): void {
      getSwipeRoot().dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
    }

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call onDelete when swiping left past the threshold', () => {
      const deleteSpy = vi.fn();
      fixture.componentRef.setInput('canSwipe', true);
      fixture.componentRef.setInput('onDelete', deleteSpy);
      fixture.detectChanges();

      touchStart(200);
      touchMove(180);
      touchMove(140);
      touchMove(100);
      touchMove(80);
      touchEnd();

      vi.advanceTimersByTime(300);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(expect.any(Event));
      expect(getSwipeCard().style.transform).toBe('translateX(0)');
    });

    it('should call onEdit when swiping right past the threshold', () => {
      const editSpy = vi.fn();
      fixture.componentRef.setInput('canSwipe', true);
      fixture.componentRef.setInput('onEdit', editSpy);
      fixture.detectChanges();

      touchStart(80);
      touchMove(100);
      touchMove(140);
      touchMove(180);
      touchMove(200);
      touchEnd();

      vi.advanceTimersByTime(300);

      expect(editSpy).toHaveBeenCalledTimes(1);
      expect(editSpy).toHaveBeenCalledWith(expect.any(Event));
    });

    it('should not invoke callbacks when canSwipe is false', () => {
      const deleteSpy = vi.fn();
      const editSpy = vi.fn();
      fixture.componentRef.setInput('onDelete', deleteSpy);
      fixture.componentRef.setInput('onEdit', editSpy);
      fixture.detectChanges();

      touchStart(200);
      touchMove(80);
      touchEnd();

      vi.advanceTimersByTime(300);

      expect(deleteSpy).not.toHaveBeenCalled();
      expect(editSpy).not.toHaveBeenCalled();
    });

    it('should snap back without invoking callbacks on a small drag', () => {
      const deleteSpy = vi.fn();
      fixture.componentRef.setInput('canSwipe', true);
      fixture.componentRef.setInput('onDelete', deleteSpy);
      fixture.detectChanges();

      touchStart(200);
      touchMove(195);
      touchMove(190);
      touchEnd();

      vi.advanceTimersByTime(300);

      expect(deleteSpy).not.toHaveBeenCalled();
      expect(getSwipeCard().style.transform).toBe('translateX(0)');
    });
  });
});
