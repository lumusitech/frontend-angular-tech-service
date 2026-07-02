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
import { Service, inject, signal, effect } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';
import { AuthService } from './auth.service';
export type Theme = 'light' | 'dark';
const THEME_KEY = stryMutAct_9fa48("1039") ? "" : (stryCov_9fa48("1039"), 'theme_preference');
@Service()
export class ThemeService {
  private readonly prefsService = inject(UserPreferencesService);
  private readonly authService = inject(AuthService);
  readonly theme = signal<Theme>(stryMutAct_9fa48("1040") ? "" : (stryCov_9fa48("1040"), 'light'));
  readonly isDark = signal(stryMutAct_9fa48("1041") ? true : (stryCov_9fa48("1041"), false));
  private updateTimeout: ReturnType<typeof setTimeout> | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private osChangeListener: ((e: MediaQueryListEvent) => void) | null = null;
  constructor() {
    if (stryMutAct_9fa48("1042")) {
      {}
    } else {
      stryCov_9fa48("1042");
      effect(() => {
        if (stryMutAct_9fa48("1043")) {
          {}
        } else {
          stryCov_9fa48("1043");
          const t = this.theme();
          this.applyTheme(t);
        }
      });
    }
  }
  init(): void {
    if (stryMutAct_9fa48("1044")) {
      {}
    } else {
      stryCov_9fa48("1044");
      if (stryMutAct_9fa48("1047") ? typeof window !== 'undefined' : stryMutAct_9fa48("1046") ? false : stryMutAct_9fa48("1045") ? true : (stryCov_9fa48("1045", "1046", "1047"), typeof window === (stryMutAct_9fa48("1048") ? "" : (stryCov_9fa48("1048"), 'undefined')))) return;
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stryMutAct_9fa48("1051") ? stored === 'light' && stored === 'dark' : stryMutAct_9fa48("1050") ? false : stryMutAct_9fa48("1049") ? true : (stryCov_9fa48("1049", "1050", "1051"), (stryMutAct_9fa48("1053") ? stored !== 'light' : stryMutAct_9fa48("1052") ? false : (stryCov_9fa48("1052", "1053"), stored === (stryMutAct_9fa48("1054") ? "" : (stryCov_9fa48("1054"), 'light')))) || (stryMutAct_9fa48("1056") ? stored !== 'dark' : stryMutAct_9fa48("1055") ? false : (stryCov_9fa48("1055", "1056"), stored === (stryMutAct_9fa48("1057") ? "" : (stryCov_9fa48("1057"), 'dark')))))) {
        if (stryMutAct_9fa48("1058")) {
          {}
        } else {
          stryCov_9fa48("1058");
          this.setTheme(stored, stryMutAct_9fa48("1059") ? true : (stryCov_9fa48("1059"), false));
        }
      } else {
        if (stryMutAct_9fa48("1060")) {
          {}
        } else {
          stryCov_9fa48("1060");
          this.setTheme(this.getOsPreference(), stryMutAct_9fa48("1061") ? true : (stryCov_9fa48("1061"), false));
        }
      }
      this.listenForOsChanges();
    }
  }
  setTheme(name: Theme, persist = stryMutAct_9fa48("1062") ? false : (stryCov_9fa48("1062"), true)): void {
    if (stryMutAct_9fa48("1063")) {
      {}
    } else {
      stryCov_9fa48("1063");
      this.theme.set(name);
      this.isDark.set(stryMutAct_9fa48("1066") ? name !== 'dark' : stryMutAct_9fa48("1065") ? false : stryMutAct_9fa48("1064") ? true : (stryCov_9fa48("1064", "1065", "1066"), name === (stryMutAct_9fa48("1067") ? "" : (stryCov_9fa48("1067"), 'dark'))));
      if (stryMutAct_9fa48("1069") ? false : stryMutAct_9fa48("1068") ? true : (stryCov_9fa48("1068", "1069"), persist)) {
        if (stryMutAct_9fa48("1070")) {
          {}
        } else {
          stryCov_9fa48("1070");
          localStorage.setItem(THEME_KEY, name);
          this.persistTheme(name);
        }
      }
    }
  }
  toggle(): void {
    if (stryMutAct_9fa48("1071")) {
      {}
    } else {
      stryCov_9fa48("1071");
      const next = (stryMutAct_9fa48("1074") ? this.theme() !== 'light' : stryMutAct_9fa48("1073") ? false : stryMutAct_9fa48("1072") ? true : (stryCov_9fa48("1072", "1073", "1074"), this.theme() === (stryMutAct_9fa48("1075") ? "" : (stryCov_9fa48("1075"), 'light')))) ? stryMutAct_9fa48("1076") ? "" : (stryCov_9fa48("1076"), 'dark') : stryMutAct_9fa48("1077") ? "" : (stryCov_9fa48("1077"), 'light');
      this.setTheme(next);
    }
  }
  resetToSystem(): void {
    if (stryMutAct_9fa48("1078")) {
      {}
    } else {
      stryCov_9fa48("1078");
      localStorage.removeItem(THEME_KEY);
      this.setTheme(this.getOsPreference(), stryMutAct_9fa48("1079") ? false : (stryCov_9fa48("1079"), true));
    }
  }
  private getOsPreference(): Theme {
    if (stryMutAct_9fa48("1080")) {
      {}
    } else {
      stryCov_9fa48("1080");
      return window.matchMedia(stryMutAct_9fa48("1081") ? "" : (stryCov_9fa48("1081"), '(prefers-color-scheme: dark)')).matches ? stryMutAct_9fa48("1082") ? "" : (stryCov_9fa48("1082"), 'dark') : stryMutAct_9fa48("1083") ? "" : (stryCov_9fa48("1083"), 'light');
    }
  }
  private listenForOsChanges(): void {
    if (stryMutAct_9fa48("1084")) {
      {}
    } else {
      stryCov_9fa48("1084");
      this.mediaQuery = window.matchMedia(stryMutAct_9fa48("1085") ? "" : (stryCov_9fa48("1085"), '(prefers-color-scheme: dark)'));
      this.osChangeListener = (e: MediaQueryListEvent) => {
        if (stryMutAct_9fa48("1086")) {
          {}
        } else {
          stryCov_9fa48("1086");
          const hasExplicitChoice = stryMutAct_9fa48("1089") ? localStorage.getItem(THEME_KEY) === null : stryMutAct_9fa48("1088") ? false : stryMutAct_9fa48("1087") ? true : (stryCov_9fa48("1087", "1088", "1089"), localStorage.getItem(THEME_KEY) !== null);
          if (stryMutAct_9fa48("1092") ? false : stryMutAct_9fa48("1091") ? true : stryMutAct_9fa48("1090") ? hasExplicitChoice : (stryCov_9fa48("1090", "1091", "1092"), !hasExplicitChoice)) {
            if (stryMutAct_9fa48("1093")) {
              {}
            } else {
              stryCov_9fa48("1093");
              this.setTheme(e.matches ? stryMutAct_9fa48("1094") ? "" : (stryCov_9fa48("1094"), 'dark') : stryMutAct_9fa48("1095") ? "" : (stryCov_9fa48("1095"), 'light'), stryMutAct_9fa48("1096") ? true : (stryCov_9fa48("1096"), false));
            }
          }
        }
      };
      this.mediaQuery.addEventListener(stryMutAct_9fa48("1097") ? "" : (stryCov_9fa48("1097"), 'change'), this.osChangeListener);
    }
  }
  private applyTheme(theme: Theme): void {
    if (stryMutAct_9fa48("1098")) {
      {}
    } else {
      stryCov_9fa48("1098");
      if (stryMutAct_9fa48("1101") ? typeof document !== 'undefined' : stryMutAct_9fa48("1100") ? false : stryMutAct_9fa48("1099") ? true : (stryCov_9fa48("1099", "1100", "1101"), typeof document === (stryMutAct_9fa48("1102") ? "" : (stryCov_9fa48("1102"), 'undefined')))) return;
      const html = document.documentElement;
      html.classList.toggle(stryMutAct_9fa48("1103") ? "" : (stryCov_9fa48("1103"), 'dark'), stryMutAct_9fa48("1106") ? theme !== 'dark' : stryMutAct_9fa48("1105") ? false : stryMutAct_9fa48("1104") ? true : (stryCov_9fa48("1104", "1105", "1106"), theme === (stryMutAct_9fa48("1107") ? "" : (stryCov_9fa48("1107"), 'dark'))));
      html.setAttribute(stryMutAct_9fa48("1108") ? "" : (stryCov_9fa48("1108"), 'data-theme'), theme);
    }
  }
  private persistTheme(theme: Theme): void {
    if (stryMutAct_9fa48("1109")) {
      {}
    } else {
      stryCov_9fa48("1109");
      if (stryMutAct_9fa48("1111") ? false : stryMutAct_9fa48("1110") ? true : (stryCov_9fa48("1110", "1111"), this.updateTimeout)) {
        if (stryMutAct_9fa48("1112")) {
          {}
        } else {
          stryCov_9fa48("1112");
          clearTimeout(this.updateTimeout);
        }
      }
      this.updateTimeout = setTimeout(() => {
        if (stryMutAct_9fa48("1113")) {
          {}
        } else {
          stryCov_9fa48("1113");
          if (stryMutAct_9fa48("1115") ? false : stryMutAct_9fa48("1114") ? true : (stryCov_9fa48("1114", "1115"), this.authService.isAuthenticated())) {
            if (stryMutAct_9fa48("1116")) {
              {}
            } else {
              stryCov_9fa48("1116");
              this.prefsService.update(stryMutAct_9fa48("1117") ? {} : (stryCov_9fa48("1117"), {
                theme
              })).subscribe(stryMutAct_9fa48("1118") ? {} : (stryCov_9fa48("1118"), {
                error: () => {}
              }));
            }
          }
        }
      }, 500);
    }
  }
}