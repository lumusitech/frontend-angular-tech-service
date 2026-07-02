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
import { Service, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/auth.interfaces';
import { LoginPreferencesResponse } from '../models/user-preferences.interfaces';
const TOKEN_KEY = stryMutAct_9fa48("320") ? "" : (stryCov_9fa48("320"), 'auth_token');
const USER_KEY = stryMutAct_9fa48("321") ? "" : (stryCov_9fa48("321"), 'auth_user');
const PREFS_KEY = stryMutAct_9fa48("322") ? "" : (stryCov_9fa48("322"), 'auth_preferences');
@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly userSignal = signal<User | null>(this.getStoredUser());
  private readonly preferencesSignal = signal<LoginPreferencesResponse | null>(this.getStoredPreferences());
  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly preferences = this.preferencesSignal.asReadonly();
  readonly isAuthenticated = computed(stryMutAct_9fa48("323") ? () => undefined : (stryCov_9fa48("323"), () => stryMutAct_9fa48("324") ? !this.tokenSignal() : (stryCov_9fa48("324"), !(stryMutAct_9fa48("325") ? this.tokenSignal() : (stryCov_9fa48("325"), !this.tokenSignal())))));
  readonly isAdmin = computed(stryMutAct_9fa48("326") ? () => undefined : (stryCov_9fa48("326"), () => stryMutAct_9fa48("329") ? this.userSignal()?.role !== 'admin' : stryMutAct_9fa48("328") ? false : stryMutAct_9fa48("327") ? true : (stryCov_9fa48("327", "328", "329"), (stryMutAct_9fa48("330") ? this.userSignal().role : (stryCov_9fa48("330"), this.userSignal()?.role)) === (stryMutAct_9fa48("331") ? "" : (stryCov_9fa48("331"), 'admin')))));
  readonly isTechnician = computed(stryMutAct_9fa48("332") ? () => undefined : (stryCov_9fa48("332"), () => stryMutAct_9fa48("335") ? this.userSignal()?.role !== 'technician' : stryMutAct_9fa48("334") ? false : stryMutAct_9fa48("333") ? true : (stryCov_9fa48("333", "334", "335"), (stryMutAct_9fa48("336") ? this.userSignal().role : (stryCov_9fa48("336"), this.userSignal()?.role)) === (stryMutAct_9fa48("337") ? "" : (stryCov_9fa48("337"), 'technician')))));
  readonly isSeller = computed(stryMutAct_9fa48("338") ? () => undefined : (stryCov_9fa48("338"), () => stryMutAct_9fa48("341") ? this.userSignal()?.role !== 'seller' : stryMutAct_9fa48("340") ? false : stryMutAct_9fa48("339") ? true : (stryCov_9fa48("339", "340", "341"), (stryMutAct_9fa48("342") ? this.userSignal().role : (stryCov_9fa48("342"), this.userSignal()?.role)) === (stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), 'seller')))));
  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (stryMutAct_9fa48("344")) {
      {}
    } else {
      stryCov_9fa48("344");
      return this.http.post<LoginResponse>(stryMutAct_9fa48("345") ? "" : (stryCov_9fa48("345"), '/api/auth/login'), credentials).pipe(tap((response: LoginResponse) => {
        if (stryMutAct_9fa48("346")) {
          {}
        } else {
          stryCov_9fa48("346");
          const {
            accessToken,
            user,
            preferences
          } = response;
          this.tokenSignal.set(accessToken);
          this.userSignal.set(user);
          this.preferencesSignal.set(stryMutAct_9fa48("349") ? preferences && null : stryMutAct_9fa48("348") ? false : stryMutAct_9fa48("347") ? true : (stryCov_9fa48("347", "348", "349"), preferences || null));
          if (stryMutAct_9fa48("352") ? typeof window === 'undefined' : stryMutAct_9fa48("351") ? false : stryMutAct_9fa48("350") ? true : (stryCov_9fa48("350", "351", "352"), typeof window !== (stryMutAct_9fa48("353") ? "" : (stryCov_9fa48("353"), 'undefined')))) {
            if (stryMutAct_9fa48("354")) {
              {}
            } else {
              stryCov_9fa48("354");
              localStorage.setItem(TOKEN_KEY, accessToken);
              localStorage.setItem(USER_KEY, JSON.stringify(user));
              if (stryMutAct_9fa48("356") ? false : stryMutAct_9fa48("355") ? true : (stryCov_9fa48("355", "356"), preferences)) {
                if (stryMutAct_9fa48("357")) {
                  {}
                } else {
                  stryCov_9fa48("357");
                  localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
                }
              }
            }
          }
        }
      }), catchError((error: unknown) => {
        if (stryMutAct_9fa48("358")) {
          {}
        } else {
          stryCov_9fa48("358");
          return throwError(stryMutAct_9fa48("359") ? () => undefined : (stryCov_9fa48("359"), () => error));
        }
      }));
    }
  }
  logout(): void {
    if (stryMutAct_9fa48("360")) {
      {}
    } else {
      stryCov_9fa48("360");
      this.tokenSignal.set(null);
      this.userSignal.set(null);
      this.preferencesSignal.set(null);
      if (stryMutAct_9fa48("363") ? typeof window === 'undefined' : stryMutAct_9fa48("362") ? false : stryMutAct_9fa48("361") ? true : (stryCov_9fa48("361", "362", "363"), typeof window !== (stryMutAct_9fa48("364") ? "" : (stryCov_9fa48("364"), 'undefined')))) {
        if (stryMutAct_9fa48("365")) {
          {}
        } else {
          stryCov_9fa48("365");
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(PREFS_KEY);
        }
      }
      this.router.navigate(stryMutAct_9fa48("366") ? [] : (stryCov_9fa48("366"), [stryMutAct_9fa48("367") ? "" : (stryCov_9fa48("367"), '/login')]));
    }
  }
  getToken(): string | null {
    if (stryMutAct_9fa48("368")) {
      {}
    } else {
      stryCov_9fa48("368");
      return this.tokenSignal();
    }
  }
  updateAvatar(avatar: string): void {
    if (stryMutAct_9fa48("369")) {
      {}
    } else {
      stryCov_9fa48("369");
      const current = this.userSignal();
      if (stryMutAct_9fa48("371") ? false : stryMutAct_9fa48("370") ? true : (stryCov_9fa48("370", "371"), current)) {
        if (stryMutAct_9fa48("372")) {
          {}
        } else {
          stryCov_9fa48("372");
          const updated = stryMutAct_9fa48("373") ? {} : (stryCov_9fa48("373"), {
            ...current,
            avatar
          });
          this.userSignal.set(updated);
          if (stryMutAct_9fa48("376") ? typeof window === 'undefined' : stryMutAct_9fa48("375") ? false : stryMutAct_9fa48("374") ? true : (stryCov_9fa48("374", "375", "376"), typeof window !== (stryMutAct_9fa48("377") ? "" : (stryCov_9fa48("377"), 'undefined')))) {
            if (stryMutAct_9fa48("378")) {
              {}
            } else {
              stryCov_9fa48("378");
              localStorage.setItem(USER_KEY, JSON.stringify(updated));
            }
          }
        }
      }
    }
  }
  private getStoredToken(): string | null {
    if (stryMutAct_9fa48("379")) {
      {}
    } else {
      stryCov_9fa48("379");
      if (stryMutAct_9fa48("382") ? typeof window === 'undefined' : stryMutAct_9fa48("381") ? false : stryMutAct_9fa48("380") ? true : (stryCov_9fa48("380", "381", "382"), typeof window !== (stryMutAct_9fa48("383") ? "" : (stryCov_9fa48("383"), 'undefined')))) {
        if (stryMutAct_9fa48("384")) {
          {}
        } else {
          stryCov_9fa48("384");
          return localStorage.getItem(TOKEN_KEY);
        }
      }
      return null;
    }
  }
  private getStoredUser(): User | null {
    if (stryMutAct_9fa48("385")) {
      {}
    } else {
      stryCov_9fa48("385");
      if (stryMutAct_9fa48("388") ? typeof window === 'undefined' : stryMutAct_9fa48("387") ? false : stryMutAct_9fa48("386") ? true : (stryCov_9fa48("386", "387", "388"), typeof window !== (stryMutAct_9fa48("389") ? "" : (stryCov_9fa48("389"), 'undefined')))) {
        if (stryMutAct_9fa48("390")) {
          {}
        } else {
          stryCov_9fa48("390");
          const user = localStorage.getItem(USER_KEY);
          if (stryMutAct_9fa48("393") ? (!user || user === 'undefined') && user === 'null' : stryMutAct_9fa48("392") ? false : stryMutAct_9fa48("391") ? true : (stryCov_9fa48("391", "392", "393"), (stryMutAct_9fa48("395") ? !user && user === 'undefined' : stryMutAct_9fa48("394") ? false : (stryCov_9fa48("394", "395"), (stryMutAct_9fa48("396") ? user : (stryCov_9fa48("396"), !user)) || (stryMutAct_9fa48("398") ? user !== 'undefined' : stryMutAct_9fa48("397") ? false : (stryCov_9fa48("397", "398"), user === (stryMutAct_9fa48("399") ? "" : (stryCov_9fa48("399"), 'undefined')))))) || (stryMutAct_9fa48("401") ? user !== 'null' : stryMutAct_9fa48("400") ? false : (stryCov_9fa48("400", "401"), user === (stryMutAct_9fa48("402") ? "" : (stryCov_9fa48("402"), 'null')))))) {
            if (stryMutAct_9fa48("403")) {
              {}
            } else {
              stryCov_9fa48("403");
              return null;
            }
          }
          try {
            if (stryMutAct_9fa48("404")) {
              {}
            } else {
              stryCov_9fa48("404");
              return JSON.parse(user) as User;
            }
          } catch {
            if (stryMutAct_9fa48("405")) {
              {}
            } else {
              stryCov_9fa48("405");
              return null;
            }
          }
        }
      }
      return null;
    }
  }
  private getStoredPreferences(): LoginPreferencesResponse | null {
    if (stryMutAct_9fa48("406")) {
      {}
    } else {
      stryCov_9fa48("406");
      if (stryMutAct_9fa48("409") ? typeof window === 'undefined' : stryMutAct_9fa48("408") ? false : stryMutAct_9fa48("407") ? true : (stryCov_9fa48("407", "408", "409"), typeof window !== (stryMutAct_9fa48("410") ? "" : (stryCov_9fa48("410"), 'undefined')))) {
        if (stryMutAct_9fa48("411")) {
          {}
        } else {
          stryCov_9fa48("411");
          const prefs = localStorage.getItem(PREFS_KEY);
          if (stryMutAct_9fa48("414") ? (!prefs || prefs === 'undefined') && prefs === 'null' : stryMutAct_9fa48("413") ? false : stryMutAct_9fa48("412") ? true : (stryCov_9fa48("412", "413", "414"), (stryMutAct_9fa48("416") ? !prefs && prefs === 'undefined' : stryMutAct_9fa48("415") ? false : (stryCov_9fa48("415", "416"), (stryMutAct_9fa48("417") ? prefs : (stryCov_9fa48("417"), !prefs)) || (stryMutAct_9fa48("419") ? prefs !== 'undefined' : stryMutAct_9fa48("418") ? false : (stryCov_9fa48("418", "419"), prefs === (stryMutAct_9fa48("420") ? "" : (stryCov_9fa48("420"), 'undefined')))))) || (stryMutAct_9fa48("422") ? prefs !== 'null' : stryMutAct_9fa48("421") ? false : (stryCov_9fa48("421", "422"), prefs === (stryMutAct_9fa48("423") ? "" : (stryCov_9fa48("423"), 'null')))))) {
            if (stryMutAct_9fa48("424")) {
              {}
            } else {
              stryCov_9fa48("424");
              return null;
            }
          }
          try {
            if (stryMutAct_9fa48("425")) {
              {}
            } else {
              stryCov_9fa48("425");
              return JSON.parse(prefs) as LoginPreferencesResponse;
            }
          } catch {
            if (stryMutAct_9fa48("426")) {
              {}
            } else {
              stryCov_9fa48("426");
              return null;
            }
          }
        }
      }
      return null;
    }
  }
}