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
import { IncomeReport } from '../../core/models/report.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-income-chart',
  imports: [BaseChartDirective, DecimalPipe, TranslatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6" [style.border-left-color]="'var(--color-primary)'">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ 'reports.income' | translate }}
        </h3>
        <div class="text-right">
          <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ data().totalIncome | number: '1.0-0' }}
          </p>
          <p class="text-xs" [class]="data().changePercentage >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ data().changePercentage >= 0 ? '+' : '' }}{{ data().changePercentage | number: '1.1-1' }}%
          </p>
        </div>
      </div>
      <div class="h-64">
        <canvas
          baseChart
          [data]="chartData"
          [options]="chartOptions"
          type="line"
        ></canvas>
      </div>
    </div>
  `
})
export class IncomeChartComponent {
  data = input.required<IncomeReport>();
  chartData: ChartConfiguration<'line'>['data'] = stryMutAct_9fa48("3888") ? {} : (stryCov_9fa48("3888"), {
    labels: stryMutAct_9fa48("3889") ? ["Stryker was here"] : (stryCov_9fa48("3889"), []),
    datasets: stryMutAct_9fa48("3890") ? ["Stryker was here"] : (stryCov_9fa48("3890"), [])
  });
  chartOptions: ChartConfiguration<'line'>['options'] = stryMutAct_9fa48("3891") ? {} : (stryCov_9fa48("3891"), {
    responsive: stryMutAct_9fa48("3892") ? false : (stryCov_9fa48("3892"), true),
    maintainAspectRatio: stryMutAct_9fa48("3893") ? true : (stryCov_9fa48("3893"), false),
    plugins: stryMutAct_9fa48("3894") ? {} : (stryCov_9fa48("3894"), {
      legend: stryMutAct_9fa48("3895") ? {} : (stryCov_9fa48("3895"), {
        display: stryMutAct_9fa48("3896") ? true : (stryCov_9fa48("3896"), false)
      })
    }),
    scales: stryMutAct_9fa48("3897") ? {} : (stryCov_9fa48("3897"), {
      y: stryMutAct_9fa48("3898") ? {} : (stryCov_9fa48("3898"), {
        beginAtZero: stryMutAct_9fa48("3899") ? false : (stryCov_9fa48("3899"), true),
        ticks: stryMutAct_9fa48("3900") ? {} : (stryCov_9fa48("3900"), {
          callback: stryMutAct_9fa48("3901") ? () => undefined : (stryCov_9fa48("3901"), v => (stryMutAct_9fa48("3902") ? "" : (stryCov_9fa48("3902"), '$')) + Number(v).toLocaleString(stryMutAct_9fa48("3903") ? "" : (stryCov_9fa48("3903"), 'es-AR')))
        })
      })
    })
  });
  constructor() {
    if (stryMutAct_9fa48("3904")) {
      {}
    } else {
      stryCov_9fa48("3904");
      effect(() => {
        if (stryMutAct_9fa48("3905")) {
          {}
        } else {
          stryCov_9fa48("3905");
          const report = this.data();
          const primaryColor = this.getPrimaryColor();
          this.chartData = stryMutAct_9fa48("3906") ? {} : (stryCov_9fa48("3906"), {
            labels: report.byDay.map(stryMutAct_9fa48("3907") ? () => undefined : (stryCov_9fa48("3907"), d => d.date)),
            datasets: stryMutAct_9fa48("3908") ? [] : (stryCov_9fa48("3908"), [stryMutAct_9fa48("3909") ? {} : (stryCov_9fa48("3909"), {
              data: report.byDay.map(stryMutAct_9fa48("3910") ? () => undefined : (stryCov_9fa48("3910"), d => d.total)),
              label: stryMutAct_9fa48("3911") ? "" : (stryCov_9fa48("3911"), 'Ingresos'),
              borderColor: primaryColor,
              backgroundColor: primaryColor + (stryMutAct_9fa48("3912") ? "" : (stryCov_9fa48("3912"), '1a')),
              fill: stryMutAct_9fa48("3913") ? false : (stryCov_9fa48("3913"), true),
              tension: 0.4
            })])
          });
        }
      });
    }
  }
  private getPrimaryColor(): string {
    if (stryMutAct_9fa48("3914")) {
      {}
    } else {
      stryCov_9fa48("3914");
      if (stryMutAct_9fa48("3917") ? typeof document !== 'undefined' : stryMutAct_9fa48("3916") ? false : stryMutAct_9fa48("3915") ? true : (stryCov_9fa48("3915", "3916", "3917"), typeof document === (stryMutAct_9fa48("3918") ? "" : (stryCov_9fa48("3918"), 'undefined')))) return stryMutAct_9fa48("3919") ? "" : (stryCov_9fa48("3919"), '#1E40AF');
      return stryMutAct_9fa48("3922") ? getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() && '#1E40AF' : stryMutAct_9fa48("3921") ? false : stryMutAct_9fa48("3920") ? true : (stryCov_9fa48("3920", "3921", "3922"), (stryMutAct_9fa48("3923") ? getComputedStyle(document.documentElement).getPropertyValue('--color-primary') : (stryCov_9fa48("3923"), getComputedStyle(document.documentElement).getPropertyValue(stryMutAct_9fa48("3924") ? "" : (stryCov_9fa48("3924"), '--color-primary')).trim())) || (stryMutAct_9fa48("3925") ? "" : (stryCov_9fa48("3925"), '#1E40AF')));
    }
  }
}