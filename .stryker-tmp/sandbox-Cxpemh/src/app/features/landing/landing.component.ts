// @ts-nocheck
import { Component } from '@angular/core';
import { LandingHeaderComponent } from './landing-header.component';
import { LandingHeroComponent } from './landing-hero.component';
import { LandingFeaturesComponent } from './landing-features.component';
import { LandingHowItWorksComponent } from './landing-how-it-works.component';
import { LandingCtaComponent } from './landing-cta.component';
import { LandingFooterComponent } from './landing-footer.component';
@Component({
  selector: 'app-landing',
  imports: [LandingHeaderComponent, LandingHeroComponent, LandingFeaturesComponent, LandingHowItWorksComponent, LandingCtaComponent, LandingFooterComponent],
  template: `
    <div class="min-h-svh bg-white dark:bg-gray-950 flex flex-col">
      <app-landing-header />
      <main class="flex-1">
        <app-landing-hero />
        <app-landing-features />
        <app-landing-how-it-works />
        <app-landing-cta />
      </main>
      <app-landing-footer />
    </div>
  `
})
export class LandingComponent {}