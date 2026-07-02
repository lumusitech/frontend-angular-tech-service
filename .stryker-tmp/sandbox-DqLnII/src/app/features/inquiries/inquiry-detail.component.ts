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
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { InquiriesService } from '../../core/services/inquiries.service';
import { Inquiry, InquiryStatus, InquiryDecision } from '../../core/models/inquiry.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { InquiryContactFormComponent } from './inquiry-contact-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
const STATUS_COLORS: Record<string, string> = stryMutAct_9fa48("2628") ? {} : (stryCov_9fa48("2628"), {
  new: stryMutAct_9fa48("2629") ? "" : (stryCov_9fa48("2629"), 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'),
  contacted: stryMutAct_9fa48("2630") ? "" : (stryCov_9fa48("2630"), 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'),
  reviewed: stryMutAct_9fa48("2631") ? "" : (stryCov_9fa48("2631"), 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'),
  approved: stryMutAct_9fa48("2632") ? "" : (stryCov_9fa48("2632"), 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'),
  rejected: stryMutAct_9fa48("2633") ? "" : (stryCov_9fa48("2633"), 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'),
  converted: stryMutAct_9fa48("2634") ? "" : (stryCov_9fa48("2634"), 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700')
});
@Component({
  selector: 'app-inquiry-detail',
  imports: [MatIconModule, MatButtonModule, MatCardModule, MatDialogModule, MatProgressSpinnerModule, PageHeaderComponent, ErrorStateComponent, DecimalPipe, TranslatePipe, RelativeDatePipe],
  template: `
    @if (resource.status() === 'loading' && !resource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (resource.error()) {
      <app-error-state (retry)="resource.reload()" />
    } @else if (resource.hasValue()) {
      @let inquiry = resource.value();

      <div class="space-y-6">
        <app-page-header
          [title]="getPageTitle(inquiry.clientName)"
          [subtitle]="'inquiries.subtitle' | translate"
        >
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            {{ 'common.back' | translate }}
          </button>
        </app-page-header>

        <!-- Workflow actions -->
        <div class="flex gap-2 flex-wrap">
          @if (inquiry.status === 'new') {
            <button mat-flat-button color="primary" (click)="openContactForm()">
              <mat-icon>phone</mat-icon>
              {{ 'inquiries.contactClient' | translate }}
            </button>
          }
          @if (inquiry.status === 'contacted') {
            <button mat-flat-button color="accent" (click)="review('approved')">
              <mat-icon>check_circle</mat-icon>
              {{ 'inquiries.approve' | translate }}
            </button>
            <button mat-flat-button color="warn" (click)="review('rejected')">
              <mat-icon>cancel</mat-icon>
              {{ 'inquiries.reject' | translate }}
            </button>
          }
          @if (inquiry.status === 'reviewed' && inquiry.adminDecision === 'approved') {
            <button mat-flat-button color="primary" (click)="convertToWorkOrder()">
              <mat-icon>construction</mat-icon>
              {{ 'inquiries.convertToOrder' | translate }}
            </button>
          }
        </div>

        <!-- Status badge -->
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            [class]="getStatusColor(inquiry.status)"
          >
            {{ 'statusLabels.' + inquiry.status | translate }}
          </span>
          @if (inquiry.adminDecision !== 'pending') {
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              [class]="inquiry.adminDecision === 'approved' ? 'text-green-400 bg-green-500/15' : 'text-red-400 bg-red-500/15'"
            >
              {{ 'statusLabels.' + inquiry.adminDecision | translate }}
            </span>
          }
        </div>

        <!-- Client info card -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            <mat-icon class="mr-1 align-middle">person</mat-icon>
            {{ 'inquiries.clientData' | translate }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.clientName' | translate }}</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientName }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.phone' | translate }}</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientPhone || '-' }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.email' | translate }}</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientEmail || '-' }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.address' | translate }}</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientAddress || '-' }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.source' | translate }}</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ 'statusLabels.' + inquiry.source | translate }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.assignedTo' | translate }}</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.assignedTo?.name || '-' }}</p>
            </div>
          </div>
        </mat-card>

        <!-- Description -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            <mat-icon class="mr-1 align-middle">description</mat-icon>
            {{ 'inquiries.problemDescription' | translate }}
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ inquiry.description }}</p>
        </mat-card>

        <!-- Technician notes (if contacted) -->
        @if (inquiry.technicianNotes) {
          <mat-card class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              <mat-icon class="mr-1 align-middle">build</mat-icon>
              {{ 'inquiries.technicianNotesSection' | translate }}
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ inquiry.technicianNotes }}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              @if (inquiry.estimatedCost) {
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.estimatedCost' | translate }}</span>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.estimatedCost | number: '1.2-2' }}</p>
                </div>
              }
              @if (inquiry.estimatedDuration) {
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.estimatedDuration' | translate }}</span>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.estimatedDuration }}h</p>
                </div>
              }
              @if (inquiry.recommendation) {
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.recommendation' | translate }}</span>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ 'statusLabels.' + inquiry.recommendation | translate }}</p>
                </div>
              }
            </div>
            @if (inquiry.materialsNeeded) {
              <div class="mt-4">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.materialsNeeded' | translate }}</span>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ inquiry.materialsNeeded }}</p>
              </div>
            }
          </mat-card>
        }

        <!-- Admin decision (if reviewed) -->
        @if (inquiry.adminNotes) {
          <mat-card class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              <mat-icon class="mr-1 align-middle">admin_panel_settings</mat-icon>
              {{ 'inquiries.adminDecision' | translate }}
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ inquiry.adminNotes }}</p>
          </mat-card>
        }

        <!-- Timestamps -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            <mat-icon class="mr-1 align-middle">schedule</mat-icon>
            {{ 'inquiries.dates' | translate }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.created' | translate }}</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.createdAt | relativeDate }}</p>
            </div>
            @if (inquiry.contactedAt) {
              <div>
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.contactedAt' | translate }}</span>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.contactedAt | relativeDate }}</p>
              </div>
            }
            @if (inquiry.reviewedAt) {
              <div>
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ 'inquiries.reviewedAt' | translate }}</span>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.reviewedAt | relativeDate }}</p>
              </div>
            }
          </div>
        </mat-card>
      </div>
    }
  `
})
export class InquiryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly dialog = inject(MatDialog);
  readonly resource = httpResource<Inquiry>(() => {
    if (stryMutAct_9fa48("2635")) {
      {}
    } else {
      stryCov_9fa48("2635");
      const id = this.route.snapshot.paramMap.get(stryMutAct_9fa48("2636") ? "" : (stryCov_9fa48("2636"), 'id'));
      return id ? stryMutAct_9fa48("2637") ? `` : (stryCov_9fa48("2637"), `/api/inquiries/${id}`) : stryMutAct_9fa48("2638") ? "Stryker was here!" : (stryCov_9fa48("2638"), '');
    }
  });
  getStatusColor(status: string): string {
    if (stryMutAct_9fa48("2639")) {
      {}
    } else {
      stryCov_9fa48("2639");
      return stryMutAct_9fa48("2642") ? STATUS_COLORS[status] && 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700' : stryMutAct_9fa48("2641") ? false : stryMutAct_9fa48("2640") ? true : (stryCov_9fa48("2640", "2641", "2642"), STATUS_COLORS[status] || (stryMutAct_9fa48("2643") ? "" : (stryCov_9fa48("2643"), 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700')));
    }
  }
  getPageTitle(clientName: string): string {
    if (stryMutAct_9fa48("2644")) {
      {}
    } else {
      stryCov_9fa48("2644");
      return stryMutAct_9fa48("2645") ? `` : (stryCov_9fa48("2645"), `Consulta — ${clientName}`);
    }
  }
  goBack(): void {
    if (stryMutAct_9fa48("2646")) {
      {}
    } else {
      stryCov_9fa48("2646");
      this.router.navigate(stryMutAct_9fa48("2647") ? [] : (stryCov_9fa48("2647"), [stryMutAct_9fa48("2648") ? "" : (stryCov_9fa48("2648"), '/admin/inquiries')]));
    }
  }
  openContactForm(): void {
    if (stryMutAct_9fa48("2649")) {
      {}
    } else {
      stryCov_9fa48("2649");
      const dialogRef = this.dialog.open(InquiryContactFormComponent, stryMutAct_9fa48("2650") ? {} : (stryCov_9fa48("2650"), {
        width: stryMutAct_9fa48("2651") ? "" : (stryCov_9fa48("2651"), '600px'),
        data: stryMutAct_9fa48("2652") ? {} : (stryCov_9fa48("2652"), {
          inquiryId: stryMutAct_9fa48("2653") ? this.resource.value().id : (stryCov_9fa48("2653"), this.resource.value()?.id)
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("2654")) {
          {}
        } else {
          stryCov_9fa48("2654");
          if (stryMutAct_9fa48("2656") ? false : stryMutAct_9fa48("2655") ? true : (stryCov_9fa48("2655", "2656"), result)) this.resource.reload();
        }
      });
    }
  }
  review(decision: 'approved' | 'rejected'): void {
    if (stryMutAct_9fa48("2657")) {
      {}
    } else {
      stryCov_9fa48("2657");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("2658") ? {} : (stryCov_9fa48("2658"), {
        width: stryMutAct_9fa48("2659") ? "" : (stryCov_9fa48("2659"), '400px'),
        data: stryMutAct_9fa48("2660") ? {} : (stryCov_9fa48("2660"), {
          titleKey: (stryMutAct_9fa48("2663") ? decision !== 'approved' : stryMutAct_9fa48("2662") ? false : stryMutAct_9fa48("2661") ? true : (stryCov_9fa48("2661", "2662", "2663"), decision === (stryMutAct_9fa48("2664") ? "" : (stryCov_9fa48("2664"), 'approved')))) ? stryMutAct_9fa48("2665") ? "" : (stryCov_9fa48("2665"), 'inquiries.approveTitle') : stryMutAct_9fa48("2666") ? "" : (stryCov_9fa48("2666"), 'inquiries.rejectTitle'),
          messageKey: (stryMutAct_9fa48("2669") ? decision !== 'approved' : stryMutAct_9fa48("2668") ? false : stryMutAct_9fa48("2667") ? true : (stryCov_9fa48("2667", "2668", "2669"), decision === (stryMutAct_9fa48("2670") ? "" : (stryCov_9fa48("2670"), 'approved')))) ? stryMutAct_9fa48("2671") ? "" : (stryCov_9fa48("2671"), 'inquiries.approveMessage') : stryMutAct_9fa48("2672") ? "" : (stryCov_9fa48("2672"), 'inquiries.rejectMessage'),
          confirmLabel: (stryMutAct_9fa48("2675") ? decision !== 'approved' : stryMutAct_9fa48("2674") ? false : stryMutAct_9fa48("2673") ? true : (stryCov_9fa48("2673", "2674", "2675"), decision === (stryMutAct_9fa48("2676") ? "" : (stryCov_9fa48("2676"), 'approved')))) ? stryMutAct_9fa48("2677") ? "" : (stryCov_9fa48("2677"), 'Approve') : stryMutAct_9fa48("2678") ? "" : (stryCov_9fa48("2678"), 'Reject'),
          color: (stryMutAct_9fa48("2681") ? decision !== 'approved' : stryMutAct_9fa48("2680") ? false : stryMutAct_9fa48("2679") ? true : (stryCov_9fa48("2679", "2680", "2681"), decision === (stryMutAct_9fa48("2682") ? "" : (stryCov_9fa48("2682"), 'approved')))) ? stryMutAct_9fa48("2683") ? "" : (stryCov_9fa48("2683"), 'primary') : stryMutAct_9fa48("2684") ? "" : (stryCov_9fa48("2684"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("2685")) {
          {}
        } else {
          stryCov_9fa48("2685");
          if (stryMutAct_9fa48("2688") ? confirmed || this.resource.hasValue() : stryMutAct_9fa48("2687") ? false : stryMutAct_9fa48("2686") ? true : (stryCov_9fa48("2686", "2687", "2688"), confirmed && this.resource.hasValue())) {
            if (stryMutAct_9fa48("2689")) {
              {}
            } else {
              stryCov_9fa48("2689");
              this.inquiriesService.review(this.resource.value()!.id, stryMutAct_9fa48("2690") ? {} : (stryCov_9fa48("2690"), {
                adminDecision: decision
              })).subscribe(stryMutAct_9fa48("2691") ? {} : (stryCov_9fa48("2691"), {
                next: stryMutAct_9fa48("2692") ? () => undefined : (stryCov_9fa48("2692"), () => this.resource.reload())
              }));
            }
          }
        }
      });
    }
  }
  convertToWorkOrder(): void {
    if (stryMutAct_9fa48("2693")) {
      {}
    } else {
      stryCov_9fa48("2693");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("2694") ? {} : (stryCov_9fa48("2694"), {
        width: stryMutAct_9fa48("2695") ? "" : (stryCov_9fa48("2695"), '400px'),
        data: stryMutAct_9fa48("2696") ? {} : (stryCov_9fa48("2696"), {
          titleKey: stryMutAct_9fa48("2697") ? "" : (stryCov_9fa48("2697"), 'inquiries.convertTitle'),
          messageKey: stryMutAct_9fa48("2698") ? "" : (stryCov_9fa48("2698"), 'inquiries.convertMessage'),
          confirmLabel: stryMutAct_9fa48("2699") ? "" : (stryCov_9fa48("2699"), 'Convert'),
          color: stryMutAct_9fa48("2700") ? "" : (stryCov_9fa48("2700"), 'primary')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("2701")) {
          {}
        } else {
          stryCov_9fa48("2701");
          if (stryMutAct_9fa48("2704") ? confirmed || this.resource.hasValue() : stryMutAct_9fa48("2703") ? false : stryMutAct_9fa48("2702") ? true : (stryCov_9fa48("2702", "2703", "2704"), confirmed && this.resource.hasValue())) {
            if (stryMutAct_9fa48("2705")) {
              {}
            } else {
              stryCov_9fa48("2705");
              const inquiry = this.resource.value()!;
              this.inquiriesService.convert(inquiry.id, stryMutAct_9fa48("2706") ? "Stryker was here!" : (stryCov_9fa48("2706"), ''), stryMutAct_9fa48("2707") ? "Stryker was here!" : (stryCov_9fa48("2707"), '')).subscribe(stryMutAct_9fa48("2708") ? {} : (stryCov_9fa48("2708"), {
                next: stryMutAct_9fa48("2709") ? () => undefined : (stryCov_9fa48("2709"), () => this.resource.reload())
              }));
            }
          }
        }
      });
    }
  }
}