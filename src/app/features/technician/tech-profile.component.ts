import { Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../core/models/user.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tech-profile',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
        {{ 'technician.profile.title' | translate }}
      </h1>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
        </div>
      } @else if (resource.value(); as profile) {
        <div
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div class="p-6 space-y-4">
            <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xl font-bold">{{ profile.name.charAt(0) }}</span>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {{ profile.name }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ profile.email }}</p>
                @if (profile.phone) {
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ profile.phone }}</p>
                }
              </div>
            </div>

            @if (profile.experience) {
              <div>
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {{ 'technician.profile.experience' | translate }}
                </p>
                <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {{ profile.experience }}
                </p>
              </div>
            }

            @if (profile.trustRating !== null) {
              <div>
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {{ 'technician.profile.trust' | translate }}
                </p>
                <div class="flex items-center gap-1 mt-1">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <mat-icon
                      class="!w-5 !h-5 text-[1.25rem]"
                      [class]="
                        star <= roundedRating()
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      "
                    >
                      {{ star <= roundedRating() ? 'star' : 'star_border' }}
                    </mat-icon>
                  }
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{
                    profile.trustRating
                  }}</span>
                </div>
              </div>
            }

            @if (profile.skills && profile.skills.length > 0) {
              <div>
                <p
                  class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {{ 'technician.profile.skills' | translate }}
                </p>
                <div class="flex flex-wrap gap-2 mt-2">
                  @for (skill of profile.skills; track skill.id) {
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {{ skill.name }}
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class TechProfileComponent {
  readonly resource = httpResource<User>(() => '/api/auth/profile');

  readonly roundedRating = computed(() => Math.round(this.resource.value()?.trustRating ?? 0));
}
