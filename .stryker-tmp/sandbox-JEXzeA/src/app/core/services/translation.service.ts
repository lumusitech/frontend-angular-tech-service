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
import { Service, signal } from '@angular/core';
@Service()
export class TranslationService {
  readonly locale = signal<string>(stryMutAct_9fa48("1135") ? "" : (stryCov_9fa48("1135"), 'es'));
  readonly translations = signal<Record<string, unknown>>({});
  private cache = new Map<string, Record<string, unknown>>();
  async init(locale = stryMutAct_9fa48("1136") ? "" : (stryCov_9fa48("1136"), 'es')): Promise<void> {
    if (stryMutAct_9fa48("1137")) {
      {}
    } else {
      stryCov_9fa48("1137");
      const stored = (stryMutAct_9fa48("1140") ? typeof window === 'undefined' : stryMutAct_9fa48("1139") ? false : stryMutAct_9fa48("1138") ? true : (stryCov_9fa48("1138", "1139", "1140"), typeof window !== (stryMutAct_9fa48("1141") ? "" : (stryCov_9fa48("1141"), 'undefined')))) ? localStorage.getItem(stryMutAct_9fa48("1142") ? "" : (stryCov_9fa48("1142"), 'locale')) : null;
      const target = stryMutAct_9fa48("1145") ? stored && locale : stryMutAct_9fa48("1144") ? false : stryMutAct_9fa48("1143") ? true : (stryCov_9fa48("1143", "1144", "1145"), stored || locale);
      await this.loadLocale(target);
    }
  }
  async loadLocale(locale: string): Promise<void> {
    if (stryMutAct_9fa48("1146")) {
      {}
    } else {
      stryCov_9fa48("1146");
      if (stryMutAct_9fa48("1149") ? typeof window !== 'undefined' : stryMutAct_9fa48("1148") ? false : stryMutAct_9fa48("1147") ? true : (stryCov_9fa48("1147", "1148", "1149"), typeof window === (stryMutAct_9fa48("1150") ? "" : (stryCov_9fa48("1150"), 'undefined')))) return;
      const cached = this.cache.get(locale);
      if (stryMutAct_9fa48("1152") ? false : stryMutAct_9fa48("1151") ? true : (stryCov_9fa48("1151", "1152"), cached)) {
        if (stryMutAct_9fa48("1153")) {
          {}
        } else {
          stryCov_9fa48("1153");
          this.translations.set(cached);
          this.locale.set(locale);
          try {
            if (stryMutAct_9fa48("1154")) {
              {}
            } else {
              stryCov_9fa48("1154");
              localStorage.setItem(stryMutAct_9fa48("1155") ? "" : (stryCov_9fa48("1155"), 'locale'), locale);
            }
          } catch {}
          return;
        }
      }
      await this.doLoad(locale);
    }
  }
  private async doLoad(locale: string): Promise<void> {
    if (stryMutAct_9fa48("1156")) {
      {}
    } else {
      stryCov_9fa48("1156");
      try {
        if (stryMutAct_9fa48("1157")) {
          {}
        } else {
          stryCov_9fa48("1157");
          const response = await fetch(stryMutAct_9fa48("1158") ? `` : (stryCov_9fa48("1158"), `/i18n/${locale}.json`));
          if (stryMutAct_9fa48("1161") ? false : stryMutAct_9fa48("1160") ? true : stryMutAct_9fa48("1159") ? response.ok : (stryCov_9fa48("1159", "1160", "1161"), !response.ok)) {
            if (stryMutAct_9fa48("1162")) {
              {}
            } else {
              stryCov_9fa48("1162");
              console.warn(stryMutAct_9fa48("1163") ? `` : (stryCov_9fa48("1163"), `Translation file not found: ${locale}`));
              return;
            }
          }
          const data = (await response.json()) as Record<string, unknown>;
          this.cache.set(locale, data);
          this.translations.set(data);
          this.locale.set(locale);
          try {
            if (stryMutAct_9fa48("1164")) {
              {}
            } else {
              stryCov_9fa48("1164");
              localStorage.setItem(stryMutAct_9fa48("1165") ? "" : (stryCov_9fa48("1165"), 'locale'), locale);
            }
          } catch {}
        }
      } catch (err) {
        if (stryMutAct_9fa48("1166")) {
          {}
        } else {
          stryCov_9fa48("1166");
          console.warn(stryMutAct_9fa48("1167") ? `` : (stryCov_9fa48("1167"), `Failed to load translations for ${locale}`), err);
        }
      }
    }
  }
  async setLocale(locale: string): Promise<void> {
    if (stryMutAct_9fa48("1168")) {
      {}
    } else {
      stryCov_9fa48("1168");
      this.locale.set(locale);
      await this.loadLocale(locale);
    }
  }
  instant(key: string, params?: Record<string, string>): string {
    if (stryMutAct_9fa48("1169")) {
      {}
    } else {
      stryCov_9fa48("1169");
      const translations = this.translations();
      const value = this.getNestedValue(translations, key);
      if (stryMutAct_9fa48("1172") ? value === undefined && value === null : stryMutAct_9fa48("1171") ? false : stryMutAct_9fa48("1170") ? true : (stryCov_9fa48("1170", "1171", "1172"), (stryMutAct_9fa48("1174") ? value !== undefined : stryMutAct_9fa48("1173") ? false : (stryCov_9fa48("1173", "1174"), value === undefined)) || (stryMutAct_9fa48("1176") ? value !== null : stryMutAct_9fa48("1175") ? false : (stryCov_9fa48("1175", "1176"), value === null)))) {
        if (stryMutAct_9fa48("1177")) {
          {}
        } else {
          stryCov_9fa48("1177");
          return key;
        }
      }
      let result = String(value);
      if (stryMutAct_9fa48("1179") ? false : stryMutAct_9fa48("1178") ? true : (stryCov_9fa48("1178", "1179"), params)) {
        if (stryMutAct_9fa48("1180")) {
          {}
        } else {
          stryCov_9fa48("1180");
          for (const [paramKey, paramValue] of Object.entries(params)) {
            if (stryMutAct_9fa48("1181")) {
              {}
            } else {
              stryCov_9fa48("1181");
              result = result.replace(new RegExp(stryMutAct_9fa48("1182") ? `` : (stryCov_9fa48("1182"), `\\{\\{${paramKey}\\}\\}`), stryMutAct_9fa48("1183") ? "" : (stryCov_9fa48("1183"), 'g')), paramValue);
            }
          }
        }
      }
      return result;
    }
  }
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    if (stryMutAct_9fa48("1184")) {
      {}
    } else {
      stryCov_9fa48("1184");
      const keys = path.split(stryMutAct_9fa48("1185") ? "" : (stryCov_9fa48("1185"), '.'));
      let current: unknown = obj;
      for (const k of keys) {
        if (stryMutAct_9fa48("1186")) {
          {}
        } else {
          stryCov_9fa48("1186");
          if (stryMutAct_9fa48("1189") ? (current === null || current === undefined) && typeof current !== 'object' : stryMutAct_9fa48("1188") ? false : stryMutAct_9fa48("1187") ? true : (stryCov_9fa48("1187", "1188", "1189"), (stryMutAct_9fa48("1191") ? current === null && current === undefined : stryMutAct_9fa48("1190") ? false : (stryCov_9fa48("1190", "1191"), (stryMutAct_9fa48("1193") ? current !== null : stryMutAct_9fa48("1192") ? false : (stryCov_9fa48("1192", "1193"), current === null)) || (stryMutAct_9fa48("1195") ? current !== undefined : stryMutAct_9fa48("1194") ? false : (stryCov_9fa48("1194", "1195"), current === undefined)))) || (stryMutAct_9fa48("1197") ? typeof current === 'object' : stryMutAct_9fa48("1196") ? false : (stryCov_9fa48("1196", "1197"), typeof current !== (stryMutAct_9fa48("1198") ? "" : (stryCov_9fa48("1198"), 'object')))))) {
            if (stryMutAct_9fa48("1199")) {
              {}
            } else {
              stryCov_9fa48("1199");
              return undefined;
            }
          }
          current = (current as Record<string, unknown>)[k];
        }
      }
      return current;
    }
  }
}