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
import { Routes } from '@angular/router';
import { adminGuard, technicianGuard, sellerGuard } from './core/guards/auth.guard';
export const routes: Routes = stryMutAct_9fa48("27") ? [] : (stryCov_9fa48("27"), [stryMutAct_9fa48("28") ? {} : (stryCov_9fa48("28"), {
  path: stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), 'login'),
  loadComponent: stryMutAct_9fa48("30") ? () => undefined : (stryCov_9fa48("30"), () => import('./features/auth/login/login.component').then(stryMutAct_9fa48("31") ? () => undefined : (stryCov_9fa48("31"), m => m.LoginComponent)))
}), stryMutAct_9fa48("32") ? {} : (stryCov_9fa48("32"), {
  path: stryMutAct_9fa48("33") ? "" : (stryCov_9fa48("33"), 'track'),
  loadComponent: stryMutAct_9fa48("34") ? () => undefined : (stryCov_9fa48("34"), () => import('./layouts/portal-layout/portal-layout.component').then(stryMutAct_9fa48("35") ? () => undefined : (stryCov_9fa48("35"), m => m.PortalLayoutComponent))),
  children: stryMutAct_9fa48("36") ? [] : (stryCov_9fa48("36"), [stryMutAct_9fa48("37") ? {} : (stryCov_9fa48("37"), {
    path: stryMutAct_9fa48("38") ? "Stryker was here!" : (stryCov_9fa48("38"), ''),
    loadComponent: stryMutAct_9fa48("39") ? () => undefined : (stryCov_9fa48("39"), () => import('./features/portal/portal-tracking.component').then(stryMutAct_9fa48("40") ? () => undefined : (stryCov_9fa48("40"), m => m.PortalTrackingComponent)))
  }), stryMutAct_9fa48("41") ? {} : (stryCov_9fa48("41"), {
    path: stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), ':code'),
    loadComponent: stryMutAct_9fa48("43") ? () => undefined : (stryCov_9fa48("43"), () => import('./features/portal/portal-tracking.component').then(stryMutAct_9fa48("44") ? () => undefined : (stryCov_9fa48("44"), m => m.PortalTrackingComponent)))
  })])
}), stryMutAct_9fa48("45") ? {} : (stryCov_9fa48("45"), {
  path: stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), 'admin'),
  canActivate: stryMutAct_9fa48("47") ? [] : (stryCov_9fa48("47"), [adminGuard]),
  loadComponent: stryMutAct_9fa48("48") ? () => undefined : (stryCov_9fa48("48"), () => import('./layouts/admin-layout/admin-layout.component').then(stryMutAct_9fa48("49") ? () => undefined : (stryCov_9fa48("49"), m => m.AdminLayoutComponent))),
  children: stryMutAct_9fa48("50") ? [] : (stryCov_9fa48("50"), [stryMutAct_9fa48("51") ? {} : (stryCov_9fa48("51"), {
    path: stryMutAct_9fa48("52") ? "" : (stryCov_9fa48("52"), 'dashboard'),
    loadComponent: stryMutAct_9fa48("53") ? () => undefined : (stryCov_9fa48("53"), () => import('./features/dashboard/dashboard.component').then(stryMutAct_9fa48("54") ? () => undefined : (stryCov_9fa48("54"), m => m.DashboardComponent)))
  }), stryMutAct_9fa48("55") ? {} : (stryCov_9fa48("55"), {
    path: stryMutAct_9fa48("56") ? "" : (stryCov_9fa48("56"), 'clients'),
    children: stryMutAct_9fa48("57") ? [] : (stryCov_9fa48("57"), [stryMutAct_9fa48("58") ? {} : (stryCov_9fa48("58"), {
      path: stryMutAct_9fa48("59") ? "Stryker was here!" : (stryCov_9fa48("59"), ''),
      loadComponent: stryMutAct_9fa48("60") ? () => undefined : (stryCov_9fa48("60"), () => import('./features/clients/clients-list.component').then(stryMutAct_9fa48("61") ? () => undefined : (stryCov_9fa48("61"), m => m.ClientsListComponent)))
    }), stryMutAct_9fa48("62") ? {} : (stryCov_9fa48("62"), {
      path: stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), ':id'),
      loadComponent: stryMutAct_9fa48("64") ? () => undefined : (stryCov_9fa48("64"), () => import('./features/clients/client-detail.component').then(stryMutAct_9fa48("65") ? () => undefined : (stryCov_9fa48("65"), m => m.ClientDetailComponent)))
    })])
  }), stryMutAct_9fa48("66") ? {} : (stryCov_9fa48("66"), {
    path: stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), 'suppliers'),
    loadComponent: stryMutAct_9fa48("68") ? () => undefined : (stryCov_9fa48("68"), () => import('./features/suppliers/suppliers-list.component').then(stryMutAct_9fa48("69") ? () => undefined : (stryCov_9fa48("69"), m => m.SuppliersListComponent)))
  }), stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
    path: stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), 'service-types'),
    loadComponent: stryMutAct_9fa48("72") ? () => undefined : (stryCov_9fa48("72"), () => import('./features/service-types/service-types-list.component').then(stryMutAct_9fa48("73") ? () => undefined : (stryCov_9fa48("73"), m => m.ServiceTypesListComponent)))
  }), stryMutAct_9fa48("74") ? {} : (stryCov_9fa48("74"), {
    path: stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), 'skills'),
    loadComponent: stryMutAct_9fa48("76") ? () => undefined : (stryCov_9fa48("76"), () => import('./features/skills/skills-list.component').then(stryMutAct_9fa48("77") ? () => undefined : (stryCov_9fa48("77"), m => m.SkillsListComponent)))
  }), stryMutAct_9fa48("78") ? {} : (stryCov_9fa48("78"), {
    path: stryMutAct_9fa48("79") ? "" : (stryCov_9fa48("79"), 'users'),
    loadComponent: stryMutAct_9fa48("80") ? () => undefined : (stryCov_9fa48("80"), () => import('./features/users/users-list.component').then(stryMutAct_9fa48("81") ? () => undefined : (stryCov_9fa48("81"), m => m.UsersListComponent)))
  }), stryMutAct_9fa48("82") ? {} : (stryCov_9fa48("82"), {
    path: stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), 'work-orders'),
    children: stryMutAct_9fa48("84") ? [] : (stryCov_9fa48("84"), [stryMutAct_9fa48("85") ? {} : (stryCov_9fa48("85"), {
      path: stryMutAct_9fa48("86") ? "Stryker was here!" : (stryCov_9fa48("86"), ''),
      loadComponent: stryMutAct_9fa48("87") ? () => undefined : (stryCov_9fa48("87"), () => import('./features/work-orders/work-orders-list.component').then(stryMutAct_9fa48("88") ? () => undefined : (stryCov_9fa48("88"), m => m.WorkOrdersListComponent)))
    }), stryMutAct_9fa48("89") ? {} : (stryCov_9fa48("89"), {
      path: stryMutAct_9fa48("90") ? "" : (stryCov_9fa48("90"), ':id'),
      loadComponent: stryMutAct_9fa48("91") ? () => undefined : (stryCov_9fa48("91"), () => import('./features/work-orders/work-order-detail.component').then(stryMutAct_9fa48("92") ? () => undefined : (stryCov_9fa48("92"), m => m.WorkOrderDetailComponent)))
    })])
  }), stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
    path: stryMutAct_9fa48("94") ? "" : (stryCov_9fa48("94"), 'payments'),
    loadComponent: stryMutAct_9fa48("95") ? () => undefined : (stryCov_9fa48("95"), () => import('./features/payments/payments-list.component').then(stryMutAct_9fa48("96") ? () => undefined : (stryCov_9fa48("96"), m => m.PaymentsListComponent)))
  }), stryMutAct_9fa48("97") ? {} : (stryCov_9fa48("97"), {
    path: stryMutAct_9fa48("98") ? "" : (stryCov_9fa48("98"), 'expenses'),
    loadComponent: stryMutAct_9fa48("99") ? () => undefined : (stryCov_9fa48("99"), () => import('./features/expenses/expenses-list.component').then(stryMutAct_9fa48("100") ? () => undefined : (stryCov_9fa48("100"), m => m.ExpensesListComponent)))
  }), stryMutAct_9fa48("101") ? {} : (stryCov_9fa48("101"), {
    path: stryMutAct_9fa48("102") ? "" : (stryCov_9fa48("102"), 'billing'),
    children: stryMutAct_9fa48("103") ? [] : (stryCov_9fa48("103"), [stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
      path: stryMutAct_9fa48("105") ? "Stryker was here!" : (stryCov_9fa48("105"), ''),
      loadComponent: stryMutAct_9fa48("106") ? () => undefined : (stryCov_9fa48("106"), () => import('./features/billing/invoices-list.component').then(stryMutAct_9fa48("107") ? () => undefined : (stryCov_9fa48("107"), m => m.InvoicesListComponent)))
    }), stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
      path: stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), ':id'),
      loadComponent: stryMutAct_9fa48("110") ? () => undefined : (stryCov_9fa48("110"), () => import('./features/billing/invoice-detail.component').then(stryMutAct_9fa48("111") ? () => undefined : (stryCov_9fa48("111"), m => m.InvoiceDetailComponent)))
    })])
  }), stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
    path: stryMutAct_9fa48("113") ? "" : (stryCov_9fa48("113"), 'reports'),
    children: stryMutAct_9fa48("114") ? [] : (stryCov_9fa48("114"), [stryMutAct_9fa48("115") ? {} : (stryCov_9fa48("115"), {
      path: stryMutAct_9fa48("116") ? "Stryker was here!" : (stryCov_9fa48("116"), ''),
      loadComponent: stryMutAct_9fa48("117") ? () => undefined : (stryCov_9fa48("117"), () => import('./features/reports/reports-dashboard.component').then(stryMutAct_9fa48("118") ? () => undefined : (stryCov_9fa48("118"), m => m.ReportsDashboardComponent)))
    }), stryMutAct_9fa48("119") ? {} : (stryCov_9fa48("119"), {
      path: stryMutAct_9fa48("120") ? "" : (stryCov_9fa48("120"), 'technicians/:id'),
      loadComponent: stryMutAct_9fa48("121") ? () => undefined : (stryCov_9fa48("121"), () => import('./features/reports/technician-detail.component').then(stryMutAct_9fa48("122") ? () => undefined : (stryCov_9fa48("122"), m => m.TechnicianDetailComponent)))
    }), stryMutAct_9fa48("123") ? {} : (stryCov_9fa48("123"), {
      path: stryMutAct_9fa48("124") ? "" : (stryCov_9fa48("124"), 'clients/:id'),
      loadComponent: stryMutAct_9fa48("125") ? () => undefined : (stryCov_9fa48("125"), () => import('./features/reports/client-report.component').then(stryMutAct_9fa48("126") ? () => undefined : (stryCov_9fa48("126"), m => m.ClientReportComponent)))
    })])
  }), stryMutAct_9fa48("127") ? {} : (stryCov_9fa48("127"), {
    path: stryMutAct_9fa48("128") ? "" : (stryCov_9fa48("128"), 'settings'),
    loadComponent: stryMutAct_9fa48("129") ? () => undefined : (stryCov_9fa48("129"), () => import('./features/settings/settings.component').then(stryMutAct_9fa48("130") ? () => undefined : (stryCov_9fa48("130"), m => m.SettingsComponent)))
  }), stryMutAct_9fa48("131") ? {} : (stryCov_9fa48("131"), {
    path: stryMutAct_9fa48("132") ? "" : (stryCov_9fa48("132"), 'profile'),
    loadComponent: stryMutAct_9fa48("133") ? () => undefined : (stryCov_9fa48("133"), () => import('./features/profile/profile-settings.component').then(stryMutAct_9fa48("134") ? () => undefined : (stryCov_9fa48("134"), m => m.ProfileSettingsComponent)))
  }), stryMutAct_9fa48("135") ? {} : (stryCov_9fa48("135"), {
    path: stryMutAct_9fa48("136") ? "" : (stryCov_9fa48("136"), 'pending-items'),
    loadComponent: stryMutAct_9fa48("137") ? () => undefined : (stryCov_9fa48("137"), () => import('./features/pending-items/pending-items-list.component').then(stryMutAct_9fa48("138") ? () => undefined : (stryCov_9fa48("138"), m => m.PendingItemsListComponent)))
  }), stryMutAct_9fa48("139") ? {} : (stryCov_9fa48("139"), {
    path: stryMutAct_9fa48("140") ? "" : (stryCov_9fa48("140"), 'inquiries'),
    children: stryMutAct_9fa48("141") ? [] : (stryCov_9fa48("141"), [stryMutAct_9fa48("142") ? {} : (stryCov_9fa48("142"), {
      path: stryMutAct_9fa48("143") ? "Stryker was here!" : (stryCov_9fa48("143"), ''),
      loadComponent: stryMutAct_9fa48("144") ? () => undefined : (stryCov_9fa48("144"), () => import('./features/inquiries/inquiries-list.component').then(stryMutAct_9fa48("145") ? () => undefined : (stryCov_9fa48("145"), m => m.InquiriesListComponent)))
    }), stryMutAct_9fa48("146") ? {} : (stryCov_9fa48("146"), {
      path: stryMutAct_9fa48("147") ? "" : (stryCov_9fa48("147"), ':id'),
      loadComponent: stryMutAct_9fa48("148") ? () => undefined : (stryCov_9fa48("148"), () => import('./features/inquiries/inquiry-detail.component').then(stryMutAct_9fa48("149") ? () => undefined : (stryCov_9fa48("149"), m => m.InquiryDetailComponent)))
    })])
  }), stryMutAct_9fa48("150") ? {} : (stryCov_9fa48("150"), {
    path: stryMutAct_9fa48("151") ? "" : (stryCov_9fa48("151"), 'notifications'),
    loadComponent: stryMutAct_9fa48("152") ? () => undefined : (stryCov_9fa48("152"), () => import('./features/notifications/notifications-page.component').then(stryMutAct_9fa48("153") ? () => undefined : (stryCov_9fa48("153"), m => m.NotificationsPageComponent)))
  }), stryMutAct_9fa48("154") ? {} : (stryCov_9fa48("154"), {
    path: stryMutAct_9fa48("155") ? "Stryker was here!" : (stryCov_9fa48("155"), ''),
    redirectTo: stryMutAct_9fa48("156") ? "" : (stryCov_9fa48("156"), 'dashboard'),
    pathMatch: stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), 'full')
  })])
}), stryMutAct_9fa48("158") ? {} : (stryCov_9fa48("158"), {
  path: stryMutAct_9fa48("159") ? "" : (stryCov_9fa48("159"), 'tech'),
  canActivate: stryMutAct_9fa48("160") ? [] : (stryCov_9fa48("160"), [technicianGuard]),
  loadComponent: stryMutAct_9fa48("161") ? () => undefined : (stryCov_9fa48("161"), () => import('./layouts/tech-layout/tech-layout.component').then(stryMutAct_9fa48("162") ? () => undefined : (stryCov_9fa48("162"), m => m.TechLayoutComponent))),
  children: stryMutAct_9fa48("163") ? [] : (stryCov_9fa48("163"), [stryMutAct_9fa48("164") ? {} : (stryCov_9fa48("164"), {
    path: stryMutAct_9fa48("165") ? "Stryker was here!" : (stryCov_9fa48("165"), ''),
    loadComponent: stryMutAct_9fa48("166") ? () => undefined : (stryCov_9fa48("166"), () => import('./features/technician/tech-work-orders.component').then(stryMutAct_9fa48("167") ? () => undefined : (stryCov_9fa48("167"), m => m.TechWorkOrdersComponent)))
  }), stryMutAct_9fa48("168") ? {} : (stryCov_9fa48("168"), {
    path: stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), 'notifications'),
    loadComponent: stryMutAct_9fa48("170") ? () => undefined : (stryCov_9fa48("170"), () => import('./features/notifications/notifications-page.component').then(stryMutAct_9fa48("171") ? () => undefined : (stryCov_9fa48("171"), m => m.NotificationsPageComponent)))
  }), stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
    path: stryMutAct_9fa48("173") ? "" : (stryCov_9fa48("173"), 'profile'),
    loadComponent: stryMutAct_9fa48("174") ? () => undefined : (stryCov_9fa48("174"), () => import('./features/profile/profile-settings.component').then(stryMutAct_9fa48("175") ? () => undefined : (stryCov_9fa48("175"), m => m.ProfileSettingsComponent)))
  }), stryMutAct_9fa48("176") ? {} : (stryCov_9fa48("176"), {
    path: stryMutAct_9fa48("177") ? "" : (stryCov_9fa48("177"), 'settings'),
    loadComponent: stryMutAct_9fa48("178") ? () => undefined : (stryCov_9fa48("178"), () => import('./features/settings/settings.component').then(stryMutAct_9fa48("179") ? () => undefined : (stryCov_9fa48("179"), m => m.SettingsComponent)))
  }), stryMutAct_9fa48("180") ? {} : (stryCov_9fa48("180"), {
    path: stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), ':id'),
    loadComponent: stryMutAct_9fa48("182") ? () => undefined : (stryCov_9fa48("182"), () => import('./features/technician/tech-work-order-detail.component').then(stryMutAct_9fa48("183") ? () => undefined : (stryCov_9fa48("183"), m => m.TechWorkOrderDetailComponent)))
  })])
}), stryMutAct_9fa48("184") ? {} : (stryCov_9fa48("184"), {
  path: stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), 'seller'),
  canActivate: stryMutAct_9fa48("186") ? [] : (stryCov_9fa48("186"), [sellerGuard]),
  loadComponent: stryMutAct_9fa48("187") ? () => undefined : (stryCov_9fa48("187"), () => import('./layouts/seller-layout/seller-layout.component').then(stryMutAct_9fa48("188") ? () => undefined : (stryCov_9fa48("188"), m => m.SellerLayoutComponent))),
  children: stryMutAct_9fa48("189") ? [] : (stryCov_9fa48("189"), [stryMutAct_9fa48("190") ? {} : (stryCov_9fa48("190"), {
    path: stryMutAct_9fa48("191") ? "Stryker was here!" : (stryCov_9fa48("191"), ''),
    loadComponent: stryMutAct_9fa48("192") ? () => undefined : (stryCov_9fa48("192"), () => import('./features/seller/seller-dashboard.component').then(stryMutAct_9fa48("193") ? () => undefined : (stryCov_9fa48("193"), m => m.SellerDashboardComponent)))
  }), stryMutAct_9fa48("194") ? {} : (stryCov_9fa48("194"), {
    path: stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'orders'),
    loadComponent: stryMutAct_9fa48("196") ? () => undefined : (stryCov_9fa48("196"), () => import('./features/seller/seller-work-orders.component').then(stryMutAct_9fa48("197") ? () => undefined : (stryCov_9fa48("197"), m => m.SellerWorkOrdersComponent)))
  }), stryMutAct_9fa48("198") ? {} : (stryCov_9fa48("198"), {
    path: stryMutAct_9fa48("199") ? "" : (stryCov_9fa48("199"), 'settings'),
    loadComponent: stryMutAct_9fa48("200") ? () => undefined : (stryCov_9fa48("200"), () => import('./features/seller/seller-settings.component').then(stryMutAct_9fa48("201") ? () => undefined : (stryCov_9fa48("201"), m => m.SellerSettingsComponent)))
  })])
}), stryMutAct_9fa48("202") ? {} : (stryCov_9fa48("202"), {
  path: stryMutAct_9fa48("203") ? "Stryker was here!" : (stryCov_9fa48("203"), ''),
  loadComponent: stryMutAct_9fa48("204") ? () => undefined : (stryCov_9fa48("204"), () => import('./features/landing/landing.component').then(stryMutAct_9fa48("205") ? () => undefined : (stryCov_9fa48("205"), m => m.LandingComponent)))
}), stryMutAct_9fa48("206") ? {} : (stryCov_9fa48("206"), {
  path: stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), '**'),
  redirectTo: stryMutAct_9fa48("208") ? "" : (stryCov_9fa48("208"), '/login')
})]);