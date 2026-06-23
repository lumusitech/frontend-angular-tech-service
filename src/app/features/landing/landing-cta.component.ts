import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing-cta',
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <section class="py-16 md:py-24">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ 'landing.cta.title' | translate }}</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">{{ 'landing.cta.subtitle' | translate }}</p>
        <a mat-flat-button routerLink="/login" class="!bg-blue-600 !text-white !px-8 !py-3 !text-base !rounded-xl !font-medium">
          {{ 'landing.cta.button' | translate }}
          <mat-icon class="!ml-1">arrow_forward</mat-icon>
        </a>
      </div>
    </section>
  `,
})
export class LandingCtaComponent {}
