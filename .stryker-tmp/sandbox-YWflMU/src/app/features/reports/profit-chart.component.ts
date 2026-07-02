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
import { Component, input, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ProfitReport } from '../../core/models/report.interfaces';
import { ThemeService } from '../../core/services/theme.service';
import { inject } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
@Component({
  selector: 'app-profit-chart',
  imports: [BaseChartDirective, DecimalPipe, TranslatePipe, CurrencyArsPipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6" [style.border-left-color]="'var(--color-primary)'">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ 'reports.profit.title' | translate }}
        </h3>
        <div class="text-right">
          <p class="text-sm font-semibold" [class]="data().netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ data().netProfit | currencyArs: '1.0-0' }}
          </p>
          <p class="text-xs" [class]="data().changePercentage >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ data().changePercentage >= 0 ? '+' : '' }}{{ data().changePercentage | number: '1.1-1' }}%
          </p>
        </div>
      </div>
      <div class="h-64">
        <canvas baseChart [data]="chartData()" [options]="chartOptions()" type="bar"></canvas>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'reports.profit.income' | translate }}</p>
          <p class="text-sm font-semibold text-green-600 dark:text-green-400">{{ data().income | currencyArs: '1.0-0' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'reports.profit.materials' | translate }}</p>
          <p class="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{{ data().materialCosts | currencyArs: '1.0-0' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ 'reports.profit.expenses' | translate }}</p>
          <p class="text-sm font-semibold text-red-600 dark:text-red-400">{{ data().operationalExpenses | currencyArs: '1.0-0' }}</p>
        </div>
      </div>
    </div>
  `
})
export class ProfitChartComponent {
  private readonly themeService = inject(ThemeService);
  data = input.required<ProfitReport>();
  private readonly isDark = this.themeService.isDark;
  private readonly labelColor = computed(stryMutAct_9fa48("3926") ? () => undefined : (stryCov_9fa48("3926"), () => this.isDark() ? stryMutAct_9fa48("3927") ? "" : (stryCov_9fa48("3927"), '#e5e7eb') : stryMutAct_9fa48("3928") ? "" : (stryCov_9fa48("3928"), '#374151')));
  private readonly tooltipBg = computed(stryMutAct_9fa48("3929") ? () => undefined : (stryCov_9fa48("3929"), () => this.isDark() ? stryMutAct_9fa48("3930") ? "" : (stryCov_9fa48("3930"), '#374151') : stryMutAct_9fa48("3931") ? "" : (stryCov_9fa48("3931"), '#1f2937')));
  chartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    if (stryMutAct_9fa48("3932")) {
      {}
    } else {
      stryCov_9fa48("3932");
      const d = this.data();
      return stryMutAct_9fa48("3933") ? {} : (stryCov_9fa48("3933"), {
        labels: stryMutAct_9fa48("3934") ? [] : (stryCov_9fa48("3934"), [d.period.label]),
        datasets: stryMutAct_9fa48("3935") ? [] : (stryCov_9fa48("3935"), [stryMutAct_9fa48("3936") ? {} : (stryCov_9fa48("3936"), {
          data: stryMutAct_9fa48("3937") ? [] : (stryCov_9fa48("3937"), [d.income]),
          label: stryMutAct_9fa48("3938") ? "" : (stryCov_9fa48("3938"), 'Ingresos'),
          backgroundColor: stryMutAct_9fa48("3939") ? "" : (stryCov_9fa48("3939"), '#059669')
        }), stryMutAct_9fa48("3940") ? {} : (stryCov_9fa48("3940"), {
          data: stryMutAct_9fa48("3941") ? [] : (stryCov_9fa48("3941"), [d.materialCosts]),
          label: stryMutAct_9fa48("3942") ? "" : (stryCov_9fa48("3942"), 'Materiales'),
          backgroundColor: stryMutAct_9fa48("3943") ? "" : (stryCov_9fa48("3943"), '#FCD34D')
        }), stryMutAct_9fa48("3944") ? {} : (stryCov_9fa48("3944"), {
          data: stryMutAct_9fa48("3945") ? [] : (stryCov_9fa48("3945"), [d.operationalExpenses]),
          label: stryMutAct_9fa48("3946") ? "" : (stryCov_9fa48("3946"), 'Gastos Operativos'),
          backgroundColor: stryMutAct_9fa48("3947") ? "" : (stryCov_9fa48("3947"), '#EF4444')
        })])
      });
    }
  });
  chartOptions = computed<ChartConfiguration<'bar'>['options']>(stryMutAct_9fa48("3948") ? () => undefined : (stryCov_9fa48("3948"), () => stryMutAct_9fa48("3949") ? {} : (stryCov_9fa48("3949"), {
    responsive: stryMutAct_9fa48("3950") ? false : (stryCov_9fa48("3950"), true),
    maintainAspectRatio: stryMutAct_9fa48("3951") ? true : (stryCov_9fa48("3951"), false),
    animation: stryMutAct_9fa48("3952") ? {} : (stryCov_9fa48("3952"), {
      duration: 750,
      easing: 'easeInOutQuart' as const
    }),
    scales: stryMutAct_9fa48("3953") ? {} : (stryCov_9fa48("3953"), {
      x: stryMutAct_9fa48("3954") ? {} : (stryCov_9fa48("3954"), {
        stacked: stryMutAct_9fa48("3955") ? false : (stryCov_9fa48("3955"), true),
        ticks: stryMutAct_9fa48("3956") ? {} : (stryCov_9fa48("3956"), {
          color: this.labelColor(),
          font: stryMutAct_9fa48("3957") ? {} : (stryCov_9fa48("3957"), {
            size: 11
          })
        }),
        grid: stryMutAct_9fa48("3958") ? {} : (stryCov_9fa48("3958"), {
          display: stryMutAct_9fa48("3959") ? true : (stryCov_9fa48("3959"), false)
        })
      }),
      y: stryMutAct_9fa48("3960") ? {} : (stryCov_9fa48("3960"), {
        stacked: stryMutAct_9fa48("3961") ? false : (stryCov_9fa48("3961"), true),
        beginAtZero: stryMutAct_9fa48("3962") ? false : (stryCov_9fa48("3962"), true),
        ticks: stryMutAct_9fa48("3963") ? {} : (stryCov_9fa48("3963"), {
          color: this.labelColor(),
          font: stryMutAct_9fa48("3964") ? {} : (stryCov_9fa48("3964"), {
            size: 11
          })
        }),
        grid: stryMutAct_9fa48("3965") ? {} : (stryCov_9fa48("3965"), {
          color: stryMutAct_9fa48("3966") ? "" : (stryCov_9fa48("3966"), 'rgba(156,163,175,0.15)')
        })
      })
    }),
    plugins: stryMutAct_9fa48("3967") ? {} : (stryCov_9fa48("3967"), {
      legend: stryMutAct_9fa48("3968") ? {} : (stryCov_9fa48("3968"), {
        position: stryMutAct_9fa48("3969") ? "" : (stryCov_9fa48("3969"), 'bottom'),
        labels: stryMutAct_9fa48("3970") ? {} : (stryCov_9fa48("3970"), {
          color: this.labelColor(),
          padding: 16,
          font: stryMutAct_9fa48("3971") ? {} : (stryCov_9fa48("3971"), {
            size: 12
          })
        })
      }),
      tooltip: stryMutAct_9fa48("3972") ? {} : (stryCov_9fa48("3972"), {
        backgroundColor: this.tooltipBg(),
        titleColor: stryMutAct_9fa48("3973") ? "" : (stryCov_9fa48("3973"), '#f9fafb'),
        bodyColor: stryMutAct_9fa48("3974") ? "" : (stryCov_9fa48("3974"), '#e5e7eb'),
        padding: 12,
        cornerRadius: 8
      })
    })
  })));
}