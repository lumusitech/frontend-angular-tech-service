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
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interfaces';
export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);
  getProfile(): Observable<User> {
    if (stryMutAct_9fa48("786")) {
      {}
    } else {
      stryCov_9fa48("786");
      return this.http.get<User>(stryMutAct_9fa48("787") ? "" : (stryCov_9fa48("787"), '/api/auth/profile'));
    }
  }
  updateProfile(dto: UpdateProfileDto): Observable<User> {
    if (stryMutAct_9fa48("788")) {
      {}
    } else {
      stryCov_9fa48("788");
      return this.http.patch<User>(stryMutAct_9fa48("789") ? "" : (stryCov_9fa48("789"), '/api/auth/profile'), dto);
    }
  }
  changePassword(dto: ChangePasswordDto): Observable<void> {
    if (stryMutAct_9fa48("790")) {
      {}
    } else {
      stryCov_9fa48("790");
      return this.http.post<void>(stryMutAct_9fa48("791") ? "" : (stryCov_9fa48("791"), '/api/auth/change-password'), dto);
    }
  }
}