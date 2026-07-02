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
import { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto, CreateWorkOrderNoteDto, CreateWorkOrderMaterialDto, CreateTaskDto, UpdateTaskDto, WorkOrderFilters } from '../models/work-order.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';
@Service()
export class WorkOrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = stryMutAct_9fa48("1255") ? "" : (stryCov_9fa48("1255"), '/api/work-orders');
  getAll(filters?: WorkOrderFilters): Observable<PaginatedResponse<WorkOrder>> {
    if (stryMutAct_9fa48("1256")) {
      {}
    } else {
      stryCov_9fa48("1256");
      let params = new HttpParams();
      if (stryMutAct_9fa48("1259") ? filters.search : stryMutAct_9fa48("1258") ? false : stryMutAct_9fa48("1257") ? true : (stryCov_9fa48("1257", "1258", "1259"), filters?.search)) params = params.set(stryMutAct_9fa48("1260") ? "" : (stryCov_9fa48("1260"), 'search'), filters.search);
      if (stryMutAct_9fa48("1263") ? filters.status : stryMutAct_9fa48("1262") ? false : stryMutAct_9fa48("1261") ? true : (stryCov_9fa48("1261", "1262", "1263"), filters?.status)) params = params.set(stryMutAct_9fa48("1264") ? "" : (stryCov_9fa48("1264"), 'status'), filters.status);
      if (stryMutAct_9fa48("1267") ? filters.priority : stryMutAct_9fa48("1266") ? false : stryMutAct_9fa48("1265") ? true : (stryCov_9fa48("1265", "1266", "1267"), filters?.priority)) params = params.set(stryMutAct_9fa48("1268") ? "" : (stryCov_9fa48("1268"), 'priority'), filters.priority);
      if (stryMutAct_9fa48("1271") ? filters.technicianId : stryMutAct_9fa48("1270") ? false : stryMutAct_9fa48("1269") ? true : (stryCov_9fa48("1269", "1270", "1271"), filters?.technicianId)) params = params.set(stryMutAct_9fa48("1272") ? "" : (stryCov_9fa48("1272"), 'technicianId'), filters.technicianId);
      if (stryMutAct_9fa48("1275") ? filters.sellerId : stryMutAct_9fa48("1274") ? false : stryMutAct_9fa48("1273") ? true : (stryCov_9fa48("1273", "1274", "1275"), filters?.sellerId)) params = params.set(stryMutAct_9fa48("1276") ? "" : (stryCov_9fa48("1276"), 'sellerId'), filters.sellerId);
      if (stryMutAct_9fa48("1279") ? filters.clientId : stryMutAct_9fa48("1278") ? false : stryMutAct_9fa48("1277") ? true : (stryCov_9fa48("1277", "1278", "1279"), filters?.clientId)) params = params.set(stryMutAct_9fa48("1280") ? "" : (stryCov_9fa48("1280"), 'clientId'), filters.clientId);
      if (stryMutAct_9fa48("1283") ? filters.page : stryMutAct_9fa48("1282") ? false : stryMutAct_9fa48("1281") ? true : (stryCov_9fa48("1281", "1282", "1283"), filters?.page)) params = params.set(stryMutAct_9fa48("1284") ? "" : (stryCov_9fa48("1284"), 'page'), filters.page.toString());
      if (stryMutAct_9fa48("1287") ? filters.limit : stryMutAct_9fa48("1286") ? false : stryMutAct_9fa48("1285") ? true : (stryCov_9fa48("1285", "1286", "1287"), filters?.limit)) params = params.set(stryMutAct_9fa48("1288") ? "" : (stryCov_9fa48("1288"), 'limit'), filters.limit.toString());
      return this.http.get<PaginatedResponse<WorkOrder>>(this.apiUrl, stryMutAct_9fa48("1289") ? {} : (stryCov_9fa48("1289"), {
        params
      }));
    }
  }
  getById(id: string): Observable<WorkOrder> {
    if (stryMutAct_9fa48("1290")) {
      {}
    } else {
      stryCov_9fa48("1290");
      return this.http.get<WorkOrder>(stryMutAct_9fa48("1291") ? `` : (stryCov_9fa48("1291"), `${this.apiUrl}/${id}`));
    }
  }
  create(dto: CreateWorkOrderDto): Observable<WorkOrder> {
    if (stryMutAct_9fa48("1292")) {
      {}
    } else {
      stryCov_9fa48("1292");
      return this.http.post<WorkOrder>(this.apiUrl, dto);
    }
  }
  update(id: string, dto: UpdateWorkOrderDto): Observable<WorkOrder> {
    if (stryMutAct_9fa48("1293")) {
      {}
    } else {
      stryCov_9fa48("1293");
      return this.http.patch<WorkOrder>(stryMutAct_9fa48("1294") ? `` : (stryCov_9fa48("1294"), `${this.apiUrl}/${id}`), dto);
    }
  }
  addNote(workOrderId: string, dto: CreateWorkOrderNoteDto): Observable<void> {
    if (stryMutAct_9fa48("1295")) {
      {}
    } else {
      stryCov_9fa48("1295");
      return this.http.post<void>(stryMutAct_9fa48("1296") ? `` : (stryCov_9fa48("1296"), `${this.apiUrl}/${workOrderId}/notes`), dto);
    }
  }
  addMaterial(workOrderId: string, dto: CreateWorkOrderMaterialDto): Observable<void> {
    if (stryMutAct_9fa48("1297")) {
      {}
    } else {
      stryCov_9fa48("1297");
      return this.http.post<void>(stryMutAct_9fa48("1298") ? `` : (stryCov_9fa48("1298"), `${this.apiUrl}/${workOrderId}/materials`), dto);
    }
  }
  addTask(workOrderId: string, dto: CreateTaskDto): Observable<void> {
    if (stryMutAct_9fa48("1299")) {
      {}
    } else {
      stryCov_9fa48("1299");
      return this.http.post<void>(stryMutAct_9fa48("1300") ? `` : (stryCov_9fa48("1300"), `${this.apiUrl}/${workOrderId}/tasks`), dto);
    }
  }
  updateTask(workOrderId: string, taskId: string, dto: UpdateTaskDto): Observable<void> {
    if (stryMutAct_9fa48("1301")) {
      {}
    } else {
      stryCov_9fa48("1301");
      return this.http.patch<void>(stryMutAct_9fa48("1302") ? `` : (stryCov_9fa48("1302"), `${this.apiUrl}/${workOrderId}/tasks/${taskId}`), dto);
    }
  }
  replaceTechnicians(workOrderId: string, technicianIds: string[]): Observable<void> {
    if (stryMutAct_9fa48("1303")) {
      {}
    } else {
      stryCov_9fa48("1303");
      return this.http.put<void>(stryMutAct_9fa48("1304") ? `` : (stryCov_9fa48("1304"), `${this.apiUrl}/${workOrderId}/technicians`), stryMutAct_9fa48("1305") ? {} : (stryCov_9fa48("1305"), {
        technicianIds
      }));
    }
  }
}