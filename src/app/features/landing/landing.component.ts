import { Component } from '@angular/core';
import { LandingHeaderComponent } from './landing-header.component';
import { LandingHeroComponent } from './landing-hero.component';
import { LandingStatsComponent } from './landing-stats.component';
import { LandingFeaturesComponent } from './landing-features.component';
import { LandingHowItWorksComponent } from './landing-how-it-works.component';
import { LandingCtaComponent } from './landing-cta.component';
import { LandingFooterComponent } from './landing-footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    LandingHeroComponent,
    LandingStatsComponent,
    LandingFeaturesComponent,
    LandingHowItWorksComponent,
    LandingCtaComponent,
    LandingFooterComponent,
  ],
  template: `
    <div class="min-h-svh bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <app-landing-header />
      <main class="flex-1">
        <app-landing-hero />
        <app-landing-stats />
        <app-landing-features />
        <app-landing-how-it-works />
        <app-landing-cta />
      </main>
      <app-landing-footer />
    </div>
  `,
})
export class LandingComponent {}
