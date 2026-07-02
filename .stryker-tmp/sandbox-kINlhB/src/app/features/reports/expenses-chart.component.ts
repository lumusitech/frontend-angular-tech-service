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
import { Component, input, effect } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ExpenseReport } from '../../core/models/report.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-expenses-chart',
  imports: [BaseChartDirective, DecimalPipe, TranslatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6" [style.border-left-color]="'var(--color-secondary)'">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ 'reports.expenses' | translate }}
        </h3>
        <div class="text-right">
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ data().totalExpenses | number: '1.0-0' }}
          </p>
          <p class="text-xs" [class]="data().changePercentage <= 0 ? 'text-green-600' : 'text-red-600'">
            {{ data().changePercentage >= 0 ? '+' : '' }}{{ data().changePercentage | number: '1.1-1' }}%
          </p>
        </div>
      </div>
      <div class="h-64">
        <canvas
          baseChart
          [data]="chartData"
          [options]="chartOptions"
          type="bar"
        ></canvas>
      </div>
    </div>
  `
})
export class ExpensesChartComponent {
  data = input.required<ExpenseReport>();
  chartData: ChartConfiguration<'bar'>['data'] = stryMutAct_9fa48("3853") ? {} : (stryCov_9fa48("3853"), {
    labels: stryMutAct_9fa48("3854") ? ["Stryker was here"] : (stryCov_9fa48("3854"), []),
    datasets: stryMutAct_9fa48("3855") ? ["Stryker was here"] : (stryCov_9fa48("3855"), [])
  });
  chartOptions: ChartConfiguration<'bar'>['options'] = stryMutAct_9fa48("3856") ? {} : (stryCov_9fa48("3856"), {
    responsive: stryMutAct_9fa48("3857") ? false : (stryCov_9fa48("3857"), true),
    maintainAspectRatio: stryMutAct_9fa48("3858") ? true : (stryCov_9fa48("3858"), false),
    plugins: stryMutAct_9fa48("3859") ? {} : (stryCov_9fa48("3859"), {
      legend: stryMutAct_9fa48("3860") ? {} : (stryCov_9fa48("3860"), {
        display: stryMutAct_9fa48("3861") ? true : (stryCov_9fa48("3861"), false)
      })
    }),
    scales: stryMutAct_9fa48("3862") ? {} : (stryCov_9fa48("3862"), {
      y: stryMutAct_9fa48("3863") ? {} : (stryCov_9fa48("3863"), {
        beginAtZero: stryMutAct_9fa48("3864") ? false : (stryCov_9fa48("3864"), true),
        ticks: stryMutAct_9fa48("3865") ? {} : (stryCov_9fa48("3865"), {
          callback: stryMutAct_9fa48("3866") ? () => undefined : (stryCov_9fa48("3866"), v => (stryMutAct_9fa48("3867") ? "" : (stryCov_9fa48("3867"), '$')) + Number(v).toLocaleString(stryMutAct_9fa48("3868") ? "" : (stryCov_9fa48("3868"), 'es-AR')))
        })
      })
    })
  });
  private readonly colors = stryMutAct_9fa48("3869") ? [] : (stryCov_9fa48("3869"), [stryMutAct_9fa48("3870") ? "" : (stryCov_9fa48("3870"), '#EF4444'), stryMutAct_9fa48("3871") ? "" : (stryCov_9fa48("3871"), '#F59E0B'), stryMutAct_9fa48("3872") ? "" : (stryCov_9fa48("3872"), '#1E40AF'), stryMutAct_9fa48("3873") ? "" : (stryCov_9fa48("3873"), '#059669'), stryMutAct_9fa48("3874") ? "" : (stryCov_9fa48("3874"), '#8B5CF6'), stryMutAct_9fa48("3875") ? "" : (stryCov_9fa48("3875"), '#EC4899'), stryMutAct_9fa48("3876") ? "" : (stryCov_9fa48("3876"), '#6366F1'), stryMutAct_9fa48("3877") ? "" : (stryCov_9fa48("3877"), '#14B8A6'), stryMutAct_9fa48("3878") ? "" : (stryCov_9fa48("3878"), '#F97316'), stryMutAct_9fa48("3879") ? "" : (stryCov_9fa48("3879"), '#6B7280')]);
  constructor() {
    if (stryMutAct_9fa48("3880")) {
      {}
    } else {
      stryCov_9fa48("3880");
      effect(() => {
        if (stryMutAct_9fa48("3881")) {
          {}
        } else {
          stryCov_9fa48("3881");
          const report = this.data();
          this.chartData = stryMutAct_9fa48("3882") ? {} : (stryCov_9fa48("3882"), {
            labels: report.byCategory.map(stryMutAct_9fa48("3883") ? () => undefined : (stryCov_9fa48("3883"), c => c.label)),
            datasets: stryMutAct_9fa48("3884") ? [] : (stryCov_9fa48("3884"), [stryMutAct_9fa48("3885") ? {} : (stryCov_9fa48("3885"), {
              data: report.byCategory.map(stryMutAct_9fa48("3886") ? () => undefined : (stryCov_9fa48("3886"), c => c.total)),
              backgroundColor: stryMutAct_9fa48("3887") ? this.colors : (stryCov_9fa48("3887"), this.colors.slice(0, report.byCategory.length))
            })])
          });
        }
      });
    }
  }
}