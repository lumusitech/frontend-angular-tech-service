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
import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
const VAPID_KEY_ENDPOINT = stryMutAct_9fa48("792") ? "" : (stryCov_9fa48("792"), '/api/push/vapid-key');
const SUBSCRIBE_ENDPOINT = stryMutAct_9fa48("793") ? "" : (stryCov_9fa48("793"), '/api/push/subscribe');
const UNSUBSCRIBE_ENDPOINT = stryMutAct_9fa48("794") ? "" : (stryCov_9fa48("794"), '/api/push/unsubscribe');
@Service()
export class PushNotificationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly swPush = inject(SwPush);
  private readonly authService = inject(AuthService);
  readonly permission = signal<NotificationPermission>(stryMutAct_9fa48("795") ? "" : (stryCov_9fa48("795"), 'default'));
  readonly isSubscribed = signal(stryMutAct_9fa48("796") ? true : (stryCov_9fa48("796"), false));
  readonly supported = signal(stryMutAct_9fa48("797") ? true : (stryCov_9fa48("797"), false));
  constructor() {
    if (stryMutAct_9fa48("798")) {
      {}
    } else {
      stryCov_9fa48("798");
      if (stryMutAct_9fa48("801") ? isPlatformBrowser(this.platformId) || 'Notification' in window : stryMutAct_9fa48("800") ? false : stryMutAct_9fa48("799") ? true : (stryCov_9fa48("799", "800", "801"), isPlatformBrowser(this.platformId) && (stryMutAct_9fa48("802") ? "" : (stryCov_9fa48("802"), 'Notification')) in window)) {
        if (stryMutAct_9fa48("803")) {
          {}
        } else {
          stryCov_9fa48("803");
          this.supported.set(stryMutAct_9fa48("804") ? false : (stryCov_9fa48("804"), true));
          this.permission.set(Notification.permission);
          this.listenForMessages();
          this.listenForClicks();
        }
      }
    }
  }
  async subscribe(): Promise<void> {
    if (stryMutAct_9fa48("805")) {
      {}
    } else {
      stryCov_9fa48("805");
      if (stryMutAct_9fa48("808") ? !this.supported() && !this.swPush.isEnabled : stryMutAct_9fa48("807") ? false : stryMutAct_9fa48("806") ? true : (stryCov_9fa48("806", "807", "808"), (stryMutAct_9fa48("809") ? this.supported() : (stryCov_9fa48("809"), !this.supported())) || (stryMutAct_9fa48("810") ? this.swPush.isEnabled : (stryCov_9fa48("810"), !this.swPush.isEnabled)))) return;
      if (stryMutAct_9fa48("813") ? false : stryMutAct_9fa48("812") ? true : stryMutAct_9fa48("811") ? this.authService.isAuthenticated() : (stryCov_9fa48("811", "812", "813"), !this.authService.isAuthenticated())) return;
      try {
        if (stryMutAct_9fa48("814")) {
          {}
        } else {
          stryCov_9fa48("814");
          const permission = await Notification.requestPermission();
          this.permission.set(permission);
          if (stryMutAct_9fa48("817") ? permission === 'granted' : stryMutAct_9fa48("816") ? false : stryMutAct_9fa48("815") ? true : (stryCov_9fa48("815", "816", "817"), permission !== (stryMutAct_9fa48("818") ? "" : (stryCov_9fa48("818"), 'granted')))) return;
          const response = await firstValueFrom(this.http.get<{
            publicKey: string;
          }>(VAPID_KEY_ENDPOINT));
          if (stryMutAct_9fa48("821") ? false : stryMutAct_9fa48("820") ? true : stryMutAct_9fa48("819") ? response?.publicKey : (stryCov_9fa48("819", "820", "821"), !(stryMutAct_9fa48("822") ? response.publicKey : (stryCov_9fa48("822"), response?.publicKey)))) return;
          const subscription = await this.swPush.requestSubscription(stryMutAct_9fa48("823") ? {} : (stryCov_9fa48("823"), {
            serverPublicKey: response.publicKey
          }));
          if (stryMutAct_9fa48("826") ? false : stryMutAct_9fa48("825") ? true : stryMutAct_9fa48("824") ? subscription : (stryCov_9fa48("824", "825", "826"), !subscription)) return;
          const json = subscription.toJSON() as Record<string, any>;
          const keys = json['keys'] as Record<string, string> | undefined;
          await firstValueFrom(this.http.post(SUBSCRIBE_ENDPOINT, stryMutAct_9fa48("827") ? {} : (stryCov_9fa48("827"), {
            endpoint: subscription.endpoint,
            p256dh: stryMutAct_9fa48("828") ? keys?.['p256dh'] && '' : (stryCov_9fa48("828"), (stryMutAct_9fa48("829") ? keys['p256dh'] : (stryCov_9fa48("829"), keys?.[stryMutAct_9fa48("830") ? "" : (stryCov_9fa48("830"), 'p256dh')])) ?? (stryMutAct_9fa48("831") ? "Stryker was here!" : (stryCov_9fa48("831"), ''))),
            auth: stryMutAct_9fa48("832") ? keys?.['auth'] && '' : (stryCov_9fa48("832"), (stryMutAct_9fa48("833") ? keys['auth'] : (stryCov_9fa48("833"), keys?.[stryMutAct_9fa48("834") ? "" : (stryCov_9fa48("834"), 'auth')])) ?? (stryMutAct_9fa48("835") ? "Stryker was here!" : (stryCov_9fa48("835"), ''))),
            userAgent: navigator.userAgent
          })));
          this.isSubscribed.set(stryMutAct_9fa48("836") ? false : (stryCov_9fa48("836"), true));
        }
      } catch (error) {
        if (stryMutAct_9fa48("837")) {
          {}
        } else {
          stryCov_9fa48("837");
          console.warn(stryMutAct_9fa48("838") ? "" : (stryCov_9fa48("838"), 'Push subscription failed:'), error);
        }
      }
    }
  }
  async unsubscribe(): Promise<void> {
    if (stryMutAct_9fa48("839")) {
      {}
    } else {
      stryCov_9fa48("839");
      if (stryMutAct_9fa48("842") ? false : stryMutAct_9fa48("841") ? true : stryMutAct_9fa48("840") ? this.swPush.isEnabled : (stryCov_9fa48("840", "841", "842"), !this.swPush.isEnabled)) return;
      try {
        if (stryMutAct_9fa48("843")) {
          {}
        } else {
          stryCov_9fa48("843");
          const subscription = await firstValueFrom(this.swPush.subscription);
          if (stryMutAct_9fa48("845") ? false : stryMutAct_9fa48("844") ? true : (stryCov_9fa48("844", "845"), subscription)) {
            if (stryMutAct_9fa48("846")) {
              {}
            } else {
              stryCov_9fa48("846");
              await firstValueFrom(this.http.delete(UNSUBSCRIBE_ENDPOINT, stryMutAct_9fa48("847") ? {} : (stryCov_9fa48("847"), {
                body: stryMutAct_9fa48("848") ? {} : (stryCov_9fa48("848"), {
                  endpoint: subscription.endpoint
                })
              })));
              await subscription.unsubscribe();
            }
          }
          this.isSubscribed.set(stryMutAct_9fa48("849") ? true : (stryCov_9fa48("849"), false));
        }
      } catch (error) {
        if (stryMutAct_9fa48("850")) {
          {}
        } else {
          stryCov_9fa48("850");
          console.warn(stryMutAct_9fa48("851") ? "" : (stryCov_9fa48("851"), 'Push unsubscribe failed:'), error);
        }
      }
    }
  }
  private listenForMessages(): void {
    if (stryMutAct_9fa48("852")) {
      {}
    } else {
      stryCov_9fa48("852");
      this.swPush.messages.subscribe((message: any) => {
        if (stryMutAct_9fa48("853")) {
          {}
        } else {
          stryCov_9fa48("853");
          const data = message as {
            title?: string;
            body?: string;
            url?: string;
          };
          if (stryMutAct_9fa48("856") ? data.title || data.body : stryMutAct_9fa48("855") ? false : stryMutAct_9fa48("854") ? true : (stryCov_9fa48("854", "855", "856"), data.title && data.body)) {
            if (stryMutAct_9fa48("857")) {
              {}
            } else {
              stryCov_9fa48("857");
              new Notification(data.title, stryMutAct_9fa48("858") ? {} : (stryCov_9fa48("858"), {
                body: data.body,
                icon: stryMutAct_9fa48("859") ? "" : (stryCov_9fa48("859"), '/assets/icons/icon-192x192.png'),
                badge: stryMutAct_9fa48("860") ? "" : (stryCov_9fa48("860"), '/assets/icons/icon-72x72.png'),
                data: stryMutAct_9fa48("861") ? {} : (stryCov_9fa48("861"), {
                  url: stryMutAct_9fa48("862") ? data.url && '/' : (stryCov_9fa48("862"), data.url ?? (stryMutAct_9fa48("863") ? "" : (stryCov_9fa48("863"), '/')))
                })
              }));
            }
          }
        }
      });
    }
  }
  private listenForClicks(): void {
    if (stryMutAct_9fa48("864")) {
      {}
    } else {
      stryCov_9fa48("864");
      this.swPush.notificationClicks.subscribe(event => {
        if (stryMutAct_9fa48("865")) {
          {}
        } else {
          stryCov_9fa48("865");
          const url = stryMutAct_9fa48("866") ? (event.notification.data as any)?.url && '/' : (stryCov_9fa48("866"), (stryMutAct_9fa48("867") ? (event.notification.data as any).url : (stryCov_9fa48("867"), (event.notification.data as any)?.url)) ?? (stryMutAct_9fa48("868") ? "" : (stryCov_9fa48("868"), '/')));
          window.open(url, stryMutAct_9fa48("869") ? "" : (stryCov_9fa48("869"), '_blank'));
        }
      });
    }
  }
  autoSubscribe(): void {
    if (stryMutAct_9fa48("870")) {
      {}
    } else {
      stryCov_9fa48("870");
      if (stryMutAct_9fa48("873") ? !this.supported() && !this.authService.isAuthenticated() : stryMutAct_9fa48("872") ? false : stryMutAct_9fa48("871") ? true : (stryCov_9fa48("871", "872", "873"), (stryMutAct_9fa48("874") ? this.supported() : (stryCov_9fa48("874"), !this.supported())) || (stryMutAct_9fa48("875") ? this.authService.isAuthenticated() : (stryCov_9fa48("875"), !this.authService.isAuthenticated())))) return;
      if (stryMutAct_9fa48("878") ? Notification.permission !== 'granted' : stryMutAct_9fa48("877") ? false : stryMutAct_9fa48("876") ? true : (stryCov_9fa48("876", "877", "878"), Notification.permission === (stryMutAct_9fa48("879") ? "" : (stryCov_9fa48("879"), 'granted')))) {
        if (stryMutAct_9fa48("880")) {
          {}
        } else {
          stryCov_9fa48("880");
          this.subscribe();
        }
      }
    }
  }
}