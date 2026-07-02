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
import { Service, inject, signal, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { NotificationsService } from './notifications.service';
import { AppNotification } from '../models/notification.interfaces';
import { environment } from '../../../environments/environment';
@Service()
export class WebsocketService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  private socket: Socket | null = null;
  readonly connected = signal(stryMutAct_9fa48("1225") ? true : (stryCov_9fa48("1225"), false));
  readonly lastNotification = signal<AppNotification | null>(null);
  connect(): void {
    if (stryMutAct_9fa48("1226")) {
      {}
    } else {
      stryCov_9fa48("1226");
      if (stryMutAct_9fa48("1229") ? this.socket.connected : stryMutAct_9fa48("1228") ? false : stryMutAct_9fa48("1227") ? true : (stryCov_9fa48("1227", "1228", "1229"), this.socket?.connected)) return;
      const token = this.authService.token();
      if (stryMutAct_9fa48("1232") ? false : stryMutAct_9fa48("1231") ? true : stryMutAct_9fa48("1230") ? token : (stryCov_9fa48("1230", "1231", "1232"), !token)) return;
      this.socket = io(environment.wsUrl, stryMutAct_9fa48("1233") ? {} : (stryCov_9fa48("1233"), {
        auth: stryMutAct_9fa48("1234") ? {} : (stryCov_9fa48("1234"), {
          token
        }),
        transports: stryMutAct_9fa48("1235") ? [] : (stryCov_9fa48("1235"), [stryMutAct_9fa48("1236") ? "" : (stryCov_9fa48("1236"), 'websocket'), stryMutAct_9fa48("1237") ? "" : (stryCov_9fa48("1237"), 'polling')])
      }));
      this.socket.on(stryMutAct_9fa48("1238") ? "" : (stryCov_9fa48("1238"), 'connect'), () => {
        if (stryMutAct_9fa48("1239")) {
          {}
        } else {
          stryCov_9fa48("1239");
          this.connected.set(stryMutAct_9fa48("1240") ? false : (stryCov_9fa48("1240"), true));
        }
      });
      this.socket.on(stryMutAct_9fa48("1241") ? "" : (stryCov_9fa48("1241"), 'disconnect'), () => {
        if (stryMutAct_9fa48("1242")) {
          {}
        } else {
          stryCov_9fa48("1242");
          this.connected.set(stryMutAct_9fa48("1243") ? true : (stryCov_9fa48("1243"), false));
        }
      });
      this.socket.on(stryMutAct_9fa48("1244") ? "" : (stryCov_9fa48("1244"), 'notification'), (data: AppNotification) => {
        if (stryMutAct_9fa48("1245")) {
          {}
        } else {
          stryCov_9fa48("1245");
          this.lastNotification.set(data);
          this.notificationsService.incrementUnread();
        }
      });
      this.socket.on(stryMutAct_9fa48("1246") ? "" : (stryCov_9fa48("1246"), 'connect_error'), () => {
        if (stryMutAct_9fa48("1247")) {
          {}
        } else {
          stryCov_9fa48("1247");
          this.connected.set(stryMutAct_9fa48("1248") ? true : (stryCov_9fa48("1248"), false));
        }
      });
    }
  }
  disconnect(): void {
    if (stryMutAct_9fa48("1249")) {
      {}
    } else {
      stryCov_9fa48("1249");
      if (stryMutAct_9fa48("1251") ? false : stryMutAct_9fa48("1250") ? true : (stryCov_9fa48("1250", "1251"), this.socket)) {
        if (stryMutAct_9fa48("1252")) {
          {}
        } else {
          stryCov_9fa48("1252");
          this.socket.disconnect();
          this.socket = null;
          this.connected.set(stryMutAct_9fa48("1253") ? true : (stryCov_9fa48("1253"), false));
        }
      }
    }
  }
  ngOnDestroy(): void {
    if (stryMutAct_9fa48("1254")) {
      {}
    } else {
      stryCov_9fa48("1254");
      this.disconnect();
    }
  }
}