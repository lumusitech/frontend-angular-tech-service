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
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PortalNote } from '../../core/models/portal.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
@Component({
  selector: 'app-portal-notes',
  imports: [MatIconModule, MatCardModule, TranslatePipe, RelativeDatePipe],
  template: `
    <mat-card>
      <mat-card-content class="!p-5">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {{ 'portal.notes.title' | translate }}
        </h3>

        <div class="space-y-3">
          @for (note of notes(); track note.createdAt; let last = $last) {
            <div class="flex gap-3">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                [class]="getNoteClasses(note.type)"
              >
                <mat-icon class="!w-3.5 !h-3.5">{{ getNoteIcon(note.type) }}</mat-icon>
              </div>
              <div class="flex-1 min-w-0" [class.pb-3]="!last" [class.border-b]="!last" [class.border-gray-100]="!last" [class.dark:border-gray-800]="!last">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[11px] font-semibold uppercase tracking-wider" [class]="getNoteLabelClasses(note.type)">
                    {{ 'portal.notes.types.' + note.type | translate }}
                  </span>
                  <span class="text-[11px] text-gray-400 dark:text-gray-500">
                    {{ note.createdAt | relativeDate }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ note.content }}</p>
              </div>
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class PortalNotesComponent {
  readonly notes = input.required<PortalNote[]>();
  getNoteIcon(type: string): string {
    if (stryMutAct_9fa48("3541")) {
      {}
    } else {
      stryCov_9fa48("3541");
      const icons: Record<string, string> = stryMutAct_9fa48("3542") ? {} : (stryCov_9fa48("3542"), {
        diagnosis: stryMutAct_9fa48("3543") ? "" : (stryCov_9fa48("3543"), 'healing'),
        issue: stryMutAct_9fa48("3544") ? "" : (stryCov_9fa48("3544"), 'warning_amber'),
        observation: stryMutAct_9fa48("3545") ? "" : (stryCov_9fa48("3545"), 'info')
      });
      return stryMutAct_9fa48("3548") ? icons[type] && 'note' : stryMutAct_9fa48("3547") ? false : stryMutAct_9fa48("3546") ? true : (stryCov_9fa48("3546", "3547", "3548"), icons[type] || (stryMutAct_9fa48("3549") ? "" : (stryCov_9fa48("3549"), 'note')));
    }
  }
  getNoteClasses(type: string): string {
    if (stryMutAct_9fa48("3550")) {
      {}
    } else {
      stryCov_9fa48("3550");
      const classes: Record<string, string> = stryMutAct_9fa48("3551") ? {} : (stryCov_9fa48("3551"), {
        diagnosis: stryMutAct_9fa48("3552") ? "" : (stryCov_9fa48("3552"), 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'),
        issue: stryMutAct_9fa48("3553") ? "" : (stryCov_9fa48("3553"), 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'),
        observation: stryMutAct_9fa48("3554") ? "" : (stryCov_9fa48("3554"), 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400')
      });
      return stryMutAct_9fa48("3557") ? classes[type] && 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : stryMutAct_9fa48("3556") ? false : stryMutAct_9fa48("3555") ? true : (stryCov_9fa48("3555", "3556", "3557"), classes[type] || (stryMutAct_9fa48("3558") ? "" : (stryCov_9fa48("3558"), 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400')));
    }
  }
  getNoteLabelClasses(type: string): string {
    if (stryMutAct_9fa48("3559")) {
      {}
    } else {
      stryCov_9fa48("3559");
      const classes: Record<string, string> = stryMutAct_9fa48("3560") ? {} : (stryCov_9fa48("3560"), {
        diagnosis: stryMutAct_9fa48("3561") ? "" : (stryCov_9fa48("3561"), 'text-blue-600 dark:text-blue-400'),
        issue: stryMutAct_9fa48("3562") ? "" : (stryCov_9fa48("3562"), 'text-amber-600 dark:text-amber-400'),
        observation: stryMutAct_9fa48("3563") ? "" : (stryCov_9fa48("3563"), 'text-gray-500 dark:text-gray-400')
      });
      return stryMutAct_9fa48("3566") ? classes[type] && 'text-gray-500 dark:text-gray-400' : stryMutAct_9fa48("3565") ? false : stryMutAct_9fa48("3564") ? true : (stryCov_9fa48("3564", "3565", "3566"), classes[type] || (stryMutAct_9fa48("3567") ? "" : (stryCov_9fa48("3567"), 'text-gray-500 dark:text-gray-400')));
    }
  }
}