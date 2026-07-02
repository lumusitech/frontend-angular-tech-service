// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, inject, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../core/models/user.interfaces';
@Component({
  selector: 'app-tech-profile',
  imports: [MatIconModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">Perfil</h1>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
        </div>
      } @else if (resource.value(); as profile) {
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="p-6 space-y-4">
            <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xl font-bold">{{ profile.name.charAt(0) }}</span>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ profile.name }}</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ profile.email }}</p>
                @if (profile.phone) {
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ profile.phone }}</p>
                }
              </div>
            </div>

            @if (profile.experience) {
              <div>
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Experiencia</label>
                <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">{{ profile.experience }}</p>
              </div>
            }

            @if (profile.trustRating != null) {
              <div>
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Confianza</label>
                <div class="flex items-center gap-1 mt-1">
                  @for (star of [1,2,3,4,5]; track star) {
                    <mat-icon class="!w-5 !h-5 text-[1.25rem]"
                      [class]="star <= roundedRating() ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'">
                      {{ star <= roundedRating() ? 'star' : 'star_border' }}
                    </mat-icon>
                  }
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ profile.trustRating }}</span>
                </div>
              </div>
            }

            @if (profile.skills && profile.skills.length > 0) {
              <div>
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Habilidades</label>
                <div class="flex flex-wrap gap-2 mt-2">
                  @for (skill of profile.skills; track skill.id) {
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
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
  `
})
export class TechProfileComponent {
  readonly resource = httpResource<User>(stryMutAct_9fa48("4870") ? () => undefined : (stryCov_9fa48("4870"), () => stryMutAct_9fa48("4871") ? "" : (stryCov_9fa48("4871"), '/api/auth/profile')));
  readonly roundedRating = computed(stryMutAct_9fa48("4872") ? () => undefined : (stryCov_9fa48("4872"), () => Math.round(stryMutAct_9fa48("4873") ? this.resource.value()?.trustRating && 0 : (stryCov_9fa48("4873"), (stryMutAct_9fa48("4874") ? this.resource.value().trustRating : (stryCov_9fa48("4874"), this.resource.value()?.trustRating)) ?? 0))));
}