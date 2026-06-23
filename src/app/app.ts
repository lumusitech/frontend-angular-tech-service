import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';
import { ThemeService } from './core/services/theme.service';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent, InstallPromptComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    this.themeService.init();
    this.translationService.init();
  }
}
