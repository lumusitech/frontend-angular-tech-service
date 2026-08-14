import { Directive, inject, input, HostListener } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';

@Directive({ selector: '[appCopyToClipboard]' })
export class CopyToClipboardDirective {
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  readonly appCopyToClipboard = input.required<string>();

  @HostListener('click', ['$event'])
  async onClick(event: Event): Promise<void> {
    event.stopPropagation();
    const text = this.appCopyToClipboard();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      this.toastService.show(this.translationService.instant('common.copied'), 'success');
    } catch {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.toastService.show(this.translationService.instant('common.copied'), 'success');
    } catch {
      this.toastService.show(this.translationService.instant('common.copyError'), 'error');
    }
    document.body.removeChild(textarea);
  }
}
