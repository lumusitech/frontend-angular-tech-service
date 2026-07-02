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
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inquiry, CreateInquiryDto, UpdateInquiryDto, ContactInquiryDto, InquiryFilters, PaginatedResponse } from '../models/inquiry.interfaces';
@Service()
export class InquiriesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("586") ? "" : (stryCov_9fa48("586"), '/api/inquiries');
  getAll(filters?: InquiryFilters): Observable<PaginatedResponse<Inquiry>> {
    if (stryMutAct_9fa48("587")) {
      {}
    } else {
      stryCov_9fa48("587");
      let params = new HttpParams();
      if (stryMutAct_9fa48("590") ? filters.status : stryMutAct_9fa48("589") ? false : stryMutAct_9fa48("588") ? true : (stryCov_9fa48("588", "589", "590"), filters?.status)) params = params.set(stryMutAct_9fa48("591") ? "" : (stryCov_9fa48("591"), 'status'), filters.status);
      if (stryMutAct_9fa48("594") ? filters.priority : stryMutAct_9fa48("593") ? false : stryMutAct_9fa48("592") ? true : (stryCov_9fa48("592", "593", "594"), filters?.priority)) params = params.set(stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), 'priority'), filters.priority);
      if (stryMutAct_9fa48("598") ? filters.source : stryMutAct_9fa48("597") ? false : stryMutAct_9fa48("596") ? true : (stryCov_9fa48("596", "597", "598"), filters?.source)) params = params.set(stryMutAct_9fa48("599") ? "" : (stryCov_9fa48("599"), 'source'), filters.source);
      if (stryMutAct_9fa48("602") ? filters.assignedToId : stryMutAct_9fa48("601") ? false : stryMutAct_9fa48("600") ? true : (stryCov_9fa48("600", "601", "602"), filters?.assignedToId)) params = params.set(stryMutAct_9fa48("603") ? "" : (stryCov_9fa48("603"), 'assignedToId'), filters.assignedToId);
      if (stryMutAct_9fa48("606") ? filters.dateFrom : stryMutAct_9fa48("605") ? false : stryMutAct_9fa48("604") ? true : (stryCov_9fa48("604", "605", "606"), filters?.dateFrom)) params = params.set(stryMutAct_9fa48("607") ? "" : (stryCov_9fa48("607"), 'dateFrom'), filters.dateFrom);
      if (stryMutAct_9fa48("610") ? filters.dateTo : stryMutAct_9fa48("609") ? false : stryMutAct_9fa48("608") ? true : (stryCov_9fa48("608", "609", "610"), filters?.dateTo)) params = params.set(stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), 'dateTo'), filters.dateTo);
      if (stryMutAct_9fa48("614") ? filters.page : stryMutAct_9fa48("613") ? false : stryMutAct_9fa48("612") ? true : (stryCov_9fa48("612", "613", "614"), filters?.page)) params = params.set(stryMutAct_9fa48("615") ? "" : (stryCov_9fa48("615"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("618") ? filters.limit : stryMutAct_9fa48("617") ? false : stryMutAct_9fa48("616") ? true : (stryCov_9fa48("616", "617", "618"), filters?.limit)) params = params.set(stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), 'limit'), filters.limit.toString());
      if (stryMutAct_9fa48("622") ? filters.sortBy : stryMutAct_9fa48("621") ? false : stryMutAct_9fa48("620") ? true : (stryCov_9fa48("620", "621", "622"), filters?.sortBy)) params = params.set(stryMutAct_9fa48("623") ? "" : (stryCov_9fa48("623"), 'sortBy'), filters.sortBy);
      if (stryMutAct_9fa48("626") ? filters.order : stryMutAct_9fa48("625") ? false : stryMutAct_9fa48("624") ? true : (stryCov_9fa48("624", "625", "626"), filters?.order)) params = params.set(stryMutAct_9fa48("627") ? "" : (stryCov_9fa48("627"), 'order'), filters.order);
      return this.http.get<PaginatedResponse<Inquiry>>(this.apiUrl, stryMutAct_9fa48("628") ? {} : (stryCov_9fa48("628"), {
        params
      }));
    }
  }
  getById(id: string): Observable<Inquiry> {
    if (stryMutAct_9fa48("629")) {
      {}
    } else {
      stryCov_9fa48("629");
      return this.http.get<Inquiry>(stryMutAct_9fa48("630") ? `` : (stryCov_9fa48("630"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreateInquiryDto): Observable<Inquiry> {
    if (stryMutAct_9fa48("631")) {
      {}
    } else {
      stryCov_9fa48("631");
      return this.http.post<Inquiry>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdateInquiryDto): Observable<Inquiry> {
    if (stryMutAct_9fa48("632")) {
      {}
    } else {
      stryCov_9fa48("632");
      return this.http.patch<Inquiry>(stryMutAct_9fa48("633") ? `` : (stryCov_9fa48("633"), `${this.apiUrl}/${id}`), dto);
    }
  }
  contact(id: string, dto: ContactInquiryDto): Observable<Inquiry> {
    if (stryMutAct_9fa48("634")) {
      {}
    } else {
      stryCov_9fa48("634");
      return this.http.patch<Inquiry>(stryMutAct_9fa48("635") ? `` : (stryCov_9fa48("635"), `${this.apiUrl}/${id}/contact`), dto);
    }
  }
  review(id: string, dto: {
    adminDecision: 'approved' | 'rejected';
    adminNotes?: string;
  }): Observable<Inquiry> {
    if (stryMutAct_9fa48("636")) {
      {}
    } else {
      stryCov_9fa48("636");
      return this.http.patch<Inquiry>(stryMutAct_9fa48("637") ? `` : (stryCov_9fa48("637"), `${this.apiUrl}/${id}/review`), dto);
    }
  }
  convert(id: string, clientId: string, serviceTypeId: string): Observable<Inquiry> {
    if (stryMutAct_9fa48("638")) {
      {}
    } else {
      stryCov_9fa48("638");
      return this.http.post<Inquiry>(stryMutAct_9fa48("639") ? `` : (stryCov_9fa48("639"), `${this.apiUrl}/${id}/convert`), stryMutAct_9fa48("640") ? {} : (stryCov_9fa48("640"), {
        clientId,
        serviceTypeId
      }));
    }
  }
  delete(id: string): Observable<void> {
    if (stryMutAct_9fa48("641")) {
      {}
    } else {
      stryCov_9fa48("641");
      return this.http.delete<void>(stryMutAct_9fa48("642") ? `` : (stryCov_9fa48("642"), `${this.apiUrl}/${id}`));
    }
  }
}