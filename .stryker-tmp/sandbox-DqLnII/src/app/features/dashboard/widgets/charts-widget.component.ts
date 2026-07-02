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
import { Component, computed, inject, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardSummary } from '../../../core/models/dashboard.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ThemeService } from '../../../core/services/theme.service';
@Component({
  selector: 'app-charts-widget',
  imports: [BaseChartDirective, TranslatePipe],
  styles: `
    @keyframes chartEntry {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .chart-entry {
      animation: chartEntry 0.5s ease-out both;
    }
    .chart-entry:nth-child(2) { animation-delay: 0.1s; }
    .chart-entry:nth-child(3) { animation-delay: 0.2s; }
  `,
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6 chart-entry" [style.border-left-color]="borderColor()">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.monthlyTrend' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="lineChartData()" [options]="lineChartOptions()" type="line"></canvas>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6 chart-entry" [style.border-left-color]="borderColor()">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.ordersByStatus' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="donutChartData()" [options]="donutChartOptions()" type="doughnut"></canvas>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6 chart-entry" [style.border-left-color]="borderColor()">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ 'dashboard.topServices' | translate }}
        </h3>
        <div class="h-64">
          <canvas baseChart [data]="barChartData()" [options]="barChartOptions()" type="bar"></canvas>
        </div>
      </div>
    </div>
  `
})
export class ChartsWidgetComponent {
  private static readonly ANIMATION = stryMutAct_9fa48("2088") ? {} : (stryCov_9fa48("2088"), {
    duration: 750,
    easing: 'easeInOutQuart' as const
  });
  private readonly themeService = inject(ThemeService);
  readonly summary = input.required<DashboardSummary>();
  readonly primaryColor = input<string>(stryMutAct_9fa48("2089") ? "" : (stryCov_9fa48("2089"), '#1E40AF'));
  readonly secondaryColor = input<string>(stryMutAct_9fa48("2090") ? "" : (stryCov_9fa48("2090"), '#059669'));
  readonly borderColor = input<string>(stryMutAct_9fa48("2091") ? "" : (stryCov_9fa48("2091"), '#1E40AF'));
  private readonly isDark = this.themeService.isDark;
  private readonly labelColor = computed(stryMutAct_9fa48("2092") ? () => undefined : (stryCov_9fa48("2092"), () => this.isDark() ? stryMutAct_9fa48("2093") ? "" : (stryCov_9fa48("2093"), '#e5e7eb') : stryMutAct_9fa48("2094") ? "" : (stryCov_9fa48("2094"), '#374151')));
  private readonly chartBgColor = computed(stryMutAct_9fa48("2095") ? () => undefined : (stryCov_9fa48("2095"), () => this.isDark() ? stryMutAct_9fa48("2096") ? "" : (stryCov_9fa48("2096"), '#1f2937') : stryMutAct_9fa48("2097") ? "" : (stryCov_9fa48("2097"), '#ffffff')));
  private readonly tooltipBg = computed(stryMutAct_9fa48("2098") ? () => undefined : (stryCov_9fa48("2098"), () => this.isDark() ? stryMutAct_9fa48("2099") ? "" : (stryCov_9fa48("2099"), '#374151') : stryMutAct_9fa48("2100") ? "" : (stryCov_9fa48("2100"), '#1f2937')));
  private readonly gridColor = stryMutAct_9fa48("2101") ? "" : (stryCov_9fa48("2101"), 'rgba(156,163,175,0.15)');
  lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    if (stryMutAct_9fa48("2102")) {
      {}
    } else {
      stryCov_9fa48("2102");
      const s = this.summary();
      const color = this.primaryColor();
      const sColor = this.secondaryColor();
      return stryMutAct_9fa48("2103") ? {} : (stryCov_9fa48("2103"), {
        labels: s.monthlyTrend.labels,
        datasets: stryMutAct_9fa48("2104") ? [] : (stryCov_9fa48("2104"), [stryMutAct_9fa48("2105") ? {} : (stryCov_9fa48("2105"), {
          data: s.monthlyTrend.income,
          label: stryMutAct_9fa48("2106") ? "" : (stryCov_9fa48("2106"), 'Ingresos'),
          borderColor: color,
          backgroundColor: color + (stryMutAct_9fa48("2107") ? "" : (stryCov_9fa48("2107"), '1a')),
          fill: stryMutAct_9fa48("2108") ? false : (stryCov_9fa48("2108"), true),
          tension: 0.4
        }), stryMutAct_9fa48("2109") ? {} : (stryCov_9fa48("2109"), {
          data: s.monthlyTrend.expenses,
          label: stryMutAct_9fa48("2110") ? "" : (stryCov_9fa48("2110"), 'Gastos'),
          borderColor: stryMutAct_9fa48("2111") ? "" : (stryCov_9fa48("2111"), '#EF4444'),
          backgroundColor: stryMutAct_9fa48("2112") ? "" : (stryCov_9fa48("2112"), 'rgba(239, 68, 68, 0.1)'),
          fill: stryMutAct_9fa48("2113") ? false : (stryCov_9fa48("2113"), true),
          tension: 0.4
        }), stryMutAct_9fa48("2114") ? {} : (stryCov_9fa48("2114"), {
          data: s.monthlyTrend.profit,
          label: stryMutAct_9fa48("2115") ? "" : (stryCov_9fa48("2115"), 'Ganancia'),
          borderColor: sColor,
          backgroundColor: stryMutAct_9fa48("2116") ? "" : (stryCov_9fa48("2116"), 'transparent'),
          borderDash: stryMutAct_9fa48("2117") ? [] : (stryCov_9fa48("2117"), [5, 5]),
          tension: 0.4
        })])
      });
    }
  });
  donutChartData = computed<ChartData<'doughnut'>>(() => {
    if (stryMutAct_9fa48("2118")) {
      {}
    } else {
      stryCov_9fa48("2118");
      const s = this.summary();
      const pColor = this.primaryColor();
      const sColor = this.secondaryColor();
      return stryMutAct_9fa48("2119") ? {} : (stryCov_9fa48("2119"), {
        labels: s.workOrdersByStatus.map(stryMutAct_9fa48("2120") ? () => undefined : (stryCov_9fa48("2120"), st => st.label)),
        datasets: stryMutAct_9fa48("2121") ? [] : (stryCov_9fa48("2121"), [stryMutAct_9fa48("2122") ? {} : (stryCov_9fa48("2122"), {
          data: s.workOrdersByStatus.map(stryMutAct_9fa48("2123") ? () => undefined : (stryCov_9fa48("2123"), st => st.count)),
          backgroundColor: stryMutAct_9fa48("2124") ? [] : (stryCov_9fa48("2124"), [pColor, sColor, stryMutAct_9fa48("2125") ? "" : (stryCov_9fa48("2125"), '#FCD34D'), stryMutAct_9fa48("2126") ? "" : (stryCov_9fa48("2126"), '#818CF8'), stryMutAct_9fa48("2127") ? "" : (stryCov_9fa48("2127"), '#F87171'), stryMutAct_9fa48("2128") ? "" : (stryCov_9fa48("2128"), '#A78BFA'), stryMutAct_9fa48("2129") ? "" : (stryCov_9fa48("2129"), '#9CA3AF')]),
          borderColor: this.chartBgColor(),
          borderWidth: 2
        })])
      });
    }
  });
  barChartData = computed<ChartData<'bar'>>(() => {
    if (stryMutAct_9fa48("2130")) {
      {}
    } else {
      stryCov_9fa48("2130");
      const s = this.summary();
      return stryMutAct_9fa48("2131") ? {} : (stryCov_9fa48("2131"), {
        labels: s.topServices.map(stryMutAct_9fa48("2132") ? () => undefined : (stryCov_9fa48("2132"), svc => svc.name)),
        datasets: stryMutAct_9fa48("2133") ? [] : (stryCov_9fa48("2133"), [stryMutAct_9fa48("2134") ? {} : (stryCov_9fa48("2134"), {
          data: s.topServices.map(stryMutAct_9fa48("2135") ? () => undefined : (stryCov_9fa48("2135"), svc => svc.count)),
          label: stryMutAct_9fa48("2136") ? "" : (stryCov_9fa48("2136"), 'Servicios'),
          backgroundColor: this.primaryColor()
        })])
      });
    }
  });
  lineChartOptions = computed<ChartConfiguration<'line'>['options']>(stryMutAct_9fa48("2137") ? () => undefined : (stryCov_9fa48("2137"), () => stryMutAct_9fa48("2138") ? {} : (stryCov_9fa48("2138"), {
    responsive: stryMutAct_9fa48("2139") ? false : (stryCov_9fa48("2139"), true),
    maintainAspectRatio: stryMutAct_9fa48("2140") ? true : (stryCov_9fa48("2140"), false),
    animation: ChartsWidgetComponent.ANIMATION,
    scales: stryMutAct_9fa48("2141") ? {} : (stryCov_9fa48("2141"), {
      x: stryMutAct_9fa48("2142") ? {} : (stryCov_9fa48("2142"), {
        ticks: stryMutAct_9fa48("2143") ? {} : (stryCov_9fa48("2143"), {
          color: this.labelColor(),
          font: stryMutAct_9fa48("2144") ? {} : (stryCov_9fa48("2144"), {
            size: 11
          })
        }),
        grid: stryMutAct_9fa48("2145") ? {} : (stryCov_9fa48("2145"), {
          color: this.gridColor
        })
      }),
      y: stryMutAct_9fa48("2146") ? {} : (stryCov_9fa48("2146"), {
        beginAtZero: stryMutAct_9fa48("2147") ? false : (stryCov_9fa48("2147"), true),
        ticks: stryMutAct_9fa48("2148") ? {} : (stryCov_9fa48("2148"), {
          color: this.labelColor(),
          font: stryMutAct_9fa48("2149") ? {} : (stryCov_9fa48("2149"), {
            size: 11
          })
        }),
        grid: stryMutAct_9fa48("2150") ? {} : (stryCov_9fa48("2150"), {
          color: this.gridColor
        })
      })
    }),
    plugins: stryMutAct_9fa48("2151") ? {} : (stryCov_9fa48("2151"), {
      legend: stryMutAct_9fa48("2152") ? {} : (stryCov_9fa48("2152"), {
        position: stryMutAct_9fa48("2153") ? "" : (stryCov_9fa48("2153"), 'bottom'),
        labels: stryMutAct_9fa48("2154") ? {} : (stryCov_9fa48("2154"), {
          color: this.labelColor(),
          padding: 16,
          font: stryMutAct_9fa48("2155") ? {} : (stryCov_9fa48("2155"), {
            size: 12
          })
        })
      }),
      tooltip: stryMutAct_9fa48("2156") ? {} : (stryCov_9fa48("2156"), {
        backgroundColor: this.tooltipBg(),
        titleColor: stryMutAct_9fa48("2157") ? "" : (stryCov_9fa48("2157"), '#f9fafb'),
        bodyColor: stryMutAct_9fa48("2158") ? "" : (stryCov_9fa48("2158"), '#e5e7eb'),
        padding: 12,
        cornerRadius: 8
      })
    })
  })));
  donutChartOptions = computed<ChartConfiguration<'doughnut'>['options']>(stryMutAct_9fa48("2159") ? () => undefined : (stryCov_9fa48("2159"), () => stryMutAct_9fa48("2160") ? {} : (stryCov_9fa48("2160"), {
    responsive: stryMutAct_9fa48("2161") ? false : (stryCov_9fa48("2161"), true),
    maintainAspectRatio: stryMutAct_9fa48("2162") ? true : (stryCov_9fa48("2162"), false),
    animation: stryMutAct_9fa48("2163") ? {} : (stryCov_9fa48("2163"), {
      animateRotate: stryMutAct_9fa48("2164") ? false : (stryCov_9fa48("2164"), true),
      animateScale: stryMutAct_9fa48("2165") ? false : (stryCov_9fa48("2165"), true),
      ...ChartsWidgetComponent.ANIMATION
    }),
    cutout: stryMutAct_9fa48("2166") ? "" : (stryCov_9fa48("2166"), '55%'),
    spacing: 2,
    plugins: stryMutAct_9fa48("2167") ? {} : (stryCov_9fa48("2167"), {
      legend: stryMutAct_9fa48("2168") ? {} : (stryCov_9fa48("2168"), {
        position: stryMutAct_9fa48("2169") ? "" : (stryCov_9fa48("2169"), 'bottom'),
        labels: stryMutAct_9fa48("2170") ? {} : (stryCov_9fa48("2170"), {
          color: this.labelColor(),
          padding: 16,
          font: stryMutAct_9fa48("2171") ? {} : (stryCov_9fa48("2171"), {
            size: 12
          }),
          usePointStyle: stryMutAct_9fa48("2172") ? false : (stryCov_9fa48("2172"), true)
        })
      }),
      tooltip: stryMutAct_9fa48("2173") ? {} : (stryCov_9fa48("2173"), {
        backgroundColor: this.tooltipBg(),
        titleColor: stryMutAct_9fa48("2174") ? "" : (stryCov_9fa48("2174"), '#f9fafb'),
        bodyColor: stryMutAct_9fa48("2175") ? "" : (stryCov_9fa48("2175"), '#e5e7eb'),
        padding: 12,
        cornerRadius: 8
      })
    })
  })));
  barChartOptions = computed<ChartConfiguration<'bar'>['options']>(stryMutAct_9fa48("2176") ? () => undefined : (stryCov_9fa48("2176"), () => stryMutAct_9fa48("2177") ? {} : (stryCov_9fa48("2177"), {
    responsive: stryMutAct_9fa48("2178") ? false : (stryCov_9fa48("2178"), true),
    maintainAspectRatio: stryMutAct_9fa48("2179") ? true : (stryCov_9fa48("2179"), false),
    animation: ChartsWidgetComponent.ANIMATION,
    plugins: stryMutAct_9fa48("2180") ? {} : (stryCov_9fa48("2180"), {
      legend: stryMutAct_9fa48("2181") ? {} : (stryCov_9fa48("2181"), {
        display: stryMutAct_9fa48("2182") ? true : (stryCov_9fa48("2182"), false)
      }),
      tooltip: stryMutAct_9fa48("2183") ? {} : (stryCov_9fa48("2183"), {
        backgroundColor: this.tooltipBg(),
        titleColor: stryMutAct_9fa48("2184") ? "" : (stryCov_9fa48("2184"), '#f9fafb'),
        bodyColor: stryMutAct_9fa48("2185") ? "" : (stryCov_9fa48("2185"), '#e5e7eb'),
        padding: 12,
        cornerRadius: 8
      })
    })
  })));
}