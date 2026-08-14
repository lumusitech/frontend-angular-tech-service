import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CopyToClipboardDirective } from './copy-to-clipboard.directive';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  template: `<button [appCopyToClipboard]="textToCopy">Copy</button>`,
  imports: [CopyToClipboardDirective],
})
class TestCopyComponent {
  textToCopy = 'test@email.com';
}

@Component({
  template: `<button [appCopyToClipboard]="emptyText">Copy</button>`,
  imports: [CopyToClipboardDirective],
})
class TestEmptyCopyComponent {
  emptyText = '';
}

describe('CopyToClipboardDirective', () => {
  let showToastSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    showToastSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [TestCopyComponent, TestEmptyCopyComponent],
      providers: [
        {
          provide: ToastService,
          useValue: { show: showToastSpy },
        },
        {
          provide: TranslationService,
          useValue: {
            instant: vi.fn().mockImplementation((key: string) => {
              const translations: Record<string, string> = {
                'common.copied': 'Copiado al portapapeles',
                'common.copyError': 'Error al copiar',
              };
              return translations[key] || key;
            }),
          },
        },
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestCopyComponent);
    expect(fixture).toBeTruthy();
  });

  describe('clipboard API', () => {
    it('should copy text to clipboard on click', async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText: writeTextSpy } });

      const fixture = TestBed.createComponent(TestCopyComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(writeTextSpy).toHaveBeenCalledWith('test@email.com');
    });

    it('should show success toast after copying', async () => {
      Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });

      const fixture = TestBed.createComponent(TestCopyComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      await new Promise((r) => setTimeout(r, 0));

      expect(showToastSpy).toHaveBeenCalledWith('Copiado al portapapeles', 'success');
    });

    it('should stop event propagation', async () => {
      Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });

      const fixture = TestBed.createComponent(TestCopyComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      const clickEvent = new Event('click');
      const stopSpy = vi.spyOn(clickEvent, 'stopPropagation');
      button.dispatchEvent(clickEvent);

      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('empty text', () => {
    it('should not copy when text is empty', async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText: writeTextSpy } });

      const fixture = TestBed.createComponent(TestEmptyCopyComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(writeTextSpy).not.toHaveBeenCalled();
    });

    it('should not show toast when text is empty', async () => {
      Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });

      const fixture = TestBed.createComponent(TestEmptyCopyComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(showToastSpy).not.toHaveBeenCalled();
    });
  });

  describe('fallback copy', () => {
    it('should clean up textarea after fallback execution', async () => {
      Object.assign(navigator, {
        clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) },
      });

      const fixture = TestBed.createComponent(TestCopyComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      await new Promise((r) => setTimeout(r, 100));

      const textarea = document.querySelector('textarea');
      expect(textarea).toBeNull();
    });
  });

  describe('different text types', () => {
    it('should copy phone number', async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText: writeTextSpy } });

      @Component({
        template: `<button [appCopyToClipboard]="phone">Copy</button>`,
        imports: [CopyToClipboardDirective],
      })
      class TestPhoneComponent {
        phone = '+5491123456789';
      }

      TestBed.configureTestingModule({ imports: [TestPhoneComponent] });

      const fixture = TestBed.createComponent(TestPhoneComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(writeTextSpy).toHaveBeenCalledWith('+5491123456789');
    });

    it('should copy tracking code', async () => {
      const writeTextSpy = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText: writeTextSpy } });

      @Component({
        template: `<button [appCopyToClipboard]="code">Copy</button>`,
        imports: [CopyToClipboardDirective],
      })
      class TestTrackingComponent {
        code = 'TS-00001';
      }

      TestBed.configureTestingModule({ imports: [TestTrackingComponent] });

      const fixture = TestBed.createComponent(TestTrackingComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(writeTextSpy).toHaveBeenCalledWith('TS-00001');
    });
  });
});
