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
import { AppNotification } from '../models/notification.interfaces';
export function getSearchTerm(notification: AppNotification): string {
  if (stryMutAct_9fa48("1311")) {
    {}
  } else {
    stryCov_9fa48("1311");
    const meta = notification.metadata;
    if (stryMutAct_9fa48("1313") ? false : stryMutAct_9fa48("1312") ? true : (stryCov_9fa48("1312", "1313"), meta)) {
      if (stryMutAct_9fa48("1314")) {
        {}
      } else {
        stryCov_9fa48("1314");
        if (stryMutAct_9fa48("1317") ? notification.referenceType === 'work_order' && notification.referenceType === 'task' : stryMutAct_9fa48("1316") ? false : stryMutAct_9fa48("1315") ? true : (stryCov_9fa48("1315", "1316", "1317"), (stryMutAct_9fa48("1319") ? notification.referenceType !== 'work_order' : stryMutAct_9fa48("1318") ? false : (stryCov_9fa48("1318", "1319"), notification.referenceType === (stryMutAct_9fa48("1320") ? "" : (stryCov_9fa48("1320"), 'work_order')))) || (stryMutAct_9fa48("1322") ? notification.referenceType !== 'task' : stryMutAct_9fa48("1321") ? false : (stryCov_9fa48("1321", "1322"), notification.referenceType === (stryMutAct_9fa48("1323") ? "" : (stryCov_9fa48("1323"), 'task')))))) {
          if (stryMutAct_9fa48("1324")) {
            {}
          } else {
            stryCov_9fa48("1324");
            return stryMutAct_9fa48("1327") ? meta['trackingCode'] as string && '' : stryMutAct_9fa48("1326") ? false : stryMutAct_9fa48("1325") ? true : (stryCov_9fa48("1325", "1326", "1327"), meta['trackingCode'] as string || (stryMutAct_9fa48("1328") ? "Stryker was here!" : (stryCov_9fa48("1328"), '')));
          }
        }
        if (stryMutAct_9fa48("1331") ? notification.referenceType !== 'payment' : stryMutAct_9fa48("1330") ? false : stryMutAct_9fa48("1329") ? true : (stryCov_9fa48("1329", "1330", "1331"), notification.referenceType === (stryMutAct_9fa48("1332") ? "" : (stryCov_9fa48("1332"), 'payment')))) {
          if (stryMutAct_9fa48("1333")) {
            {}
          } else {
            stryCov_9fa48("1333");
            return stryMutAct_9fa48("1336") ? meta['trackingCode'] as string && '' : stryMutAct_9fa48("1335") ? false : stryMutAct_9fa48("1334") ? true : (stryCov_9fa48("1334", "1335", "1336"), meta['trackingCode'] as string || (stryMutAct_9fa48("1337") ? "Stryker was here!" : (stryCov_9fa48("1337"), '')));
          }
        }
        if (stryMutAct_9fa48("1340") ? notification.referenceType !== 'pending_item' : stryMutAct_9fa48("1339") ? false : stryMutAct_9fa48("1338") ? true : (stryCov_9fa48("1338", "1339", "1340"), notification.referenceType === (stryMutAct_9fa48("1341") ? "" : (stryCov_9fa48("1341"), 'pending_item')))) {
          if (stryMutAct_9fa48("1342")) {
            {}
          } else {
            stryCov_9fa48("1342");
            return stryMutAct_9fa48("1345") ? meta['title'] as string && '' : stryMutAct_9fa48("1344") ? false : stryMutAct_9fa48("1343") ? true : (stryCov_9fa48("1343", "1344", "1345"), meta['title'] as string || (stryMutAct_9fa48("1346") ? "Stryker was here!" : (stryCov_9fa48("1346"), '')));
          }
        }
        if (stryMutAct_9fa48("1349") ? notification.referenceType !== 'inquiry' : stryMutAct_9fa48("1348") ? false : stryMutAct_9fa48("1347") ? true : (stryCov_9fa48("1347", "1348", "1349"), notification.referenceType === (stryMutAct_9fa48("1350") ? "" : (stryCov_9fa48("1350"), 'inquiry')))) {
          if (stryMutAct_9fa48("1351")) {
            {}
          } else {
            stryCov_9fa48("1351");
            return stryMutAct_9fa48("1354") ? meta['clientName'] as string && '' : stryMutAct_9fa48("1353") ? false : stryMutAct_9fa48("1352") ? true : (stryCov_9fa48("1352", "1353", "1354"), meta['clientName'] as string || (stryMutAct_9fa48("1355") ? "Stryker was here!" : (stryCov_9fa48("1355"), '')));
          }
        }
      }
    }
    const msg = notification.message;
    if (stryMutAct_9fa48("1358") ? (notification.referenceType === 'work_order' || notification.referenceType === 'task') && notification.referenceType === 'payment' : stryMutAct_9fa48("1357") ? false : stryMutAct_9fa48("1356") ? true : (stryCov_9fa48("1356", "1357", "1358"), (stryMutAct_9fa48("1360") ? notification.referenceType === 'work_order' && notification.referenceType === 'task' : stryMutAct_9fa48("1359") ? false : (stryCov_9fa48("1359", "1360"), (stryMutAct_9fa48("1362") ? notification.referenceType !== 'work_order' : stryMutAct_9fa48("1361") ? false : (stryCov_9fa48("1361", "1362"), notification.referenceType === (stryMutAct_9fa48("1363") ? "" : (stryCov_9fa48("1363"), 'work_order')))) || (stryMutAct_9fa48("1365") ? notification.referenceType !== 'task' : stryMutAct_9fa48("1364") ? false : (stryCov_9fa48("1364", "1365"), notification.referenceType === (stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), 'task')))))) || (stryMutAct_9fa48("1368") ? notification.referenceType !== 'payment' : stryMutAct_9fa48("1367") ? false : (stryCov_9fa48("1367", "1368"), notification.referenceType === (stryMutAct_9fa48("1369") ? "" : (stryCov_9fa48("1369"), 'payment')))))) {
      if (stryMutAct_9fa48("1370")) {
        {}
      } else {
        stryCov_9fa48("1370");
        const match = msg.match(stryMutAct_9fa48("1374") ? /\b([A-Z]{2}-\W+)\b/ : stryMutAct_9fa48("1373") ? /\b([A-Z]{2}-\w)\b/ : stryMutAct_9fa48("1372") ? /\b([^A-Z]{2}-\w+)\b/ : stryMutAct_9fa48("1371") ? /\b([A-Z]-\w+)\b/ : (stryCov_9fa48("1371", "1372", "1373", "1374"), /\b([A-Z]{2}-\w+)\b/));
        if (stryMutAct_9fa48("1376") ? false : stryMutAct_9fa48("1375") ? true : (stryCov_9fa48("1375", "1376"), match)) return match[1];
      }
    }
    if (stryMutAct_9fa48("1379") ? notification.referenceType !== 'pending_item' : stryMutAct_9fa48("1378") ? false : stryMutAct_9fa48("1377") ? true : (stryCov_9fa48("1377", "1378", "1379"), notification.referenceType === (stryMutAct_9fa48("1380") ? "" : (stryCov_9fa48("1380"), 'pending_item')))) {
      if (stryMutAct_9fa48("1381")) {
        {}
      } else {
        stryCov_9fa48("1381");
        let match = msg.match(stryMutAct_9fa48("1399") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\S*$)/i : stryMutAct_9fa48("1398") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s$)/i : stryMutAct_9fa48("1397") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*)/i : stryMutAct_9fa48("1396") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\S*|\s*$)/i : stryMutAct_9fa48("1395") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s|\s*$)/i : stryMutAct_9fa48("1394") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1393") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\S]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1392") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[^:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1391") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s])?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1390") ? /Se\s+creó\s+(?:el\s+ítem\S+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1389") ? /Se\s+creó\s+(?:el\s+ítem\spendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1388") ? /Se\s+creó\s+(?:el\S+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1387") ? /Se\s+creó\s+(?:el\sítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1386") ? /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1385") ? /Se\s+creó\S+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1384") ? /Se\s+creó\s(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1383") ? /Se\S+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : stryMutAct_9fa48("1382") ? /Se\screó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i : (stryCov_9fa48("1382", "1383", "1384", "1385", "1386", "1387", "1388", "1389", "1390", "1391", "1392", "1393", "1394", "1395", "1396", "1397", "1398", "1399"), /Se\s+creó\s+(?:el\s+ítem\s+pendiente[:\s]*)?(.+?)(?:\.\s*|\s*$)/i));
        if (stryMutAct_9fa48("1401") ? false : stryMutAct_9fa48("1400") ? true : (stryCov_9fa48("1400", "1401"), match)) return stryMutAct_9fa48("1402") ? match[1] : (stryCov_9fa48("1402"), match[1].trim());
        match = msg.match(stryMutAct_9fa48("1411") ? /^(.+?)\s+(?:vence\s+hoy|está\s+vencid[^oa])/i : stryMutAct_9fa48("1410") ? /^(.+?)\s+(?:vence\s+hoy|está\S+vencid[oa])/i : stryMutAct_9fa48("1409") ? /^(.+?)\s+(?:vence\s+hoy|está\svencid[oa])/i : stryMutAct_9fa48("1408") ? /^(.+?)\s+(?:vence\S+hoy|está\s+vencid[oa])/i : stryMutAct_9fa48("1407") ? /^(.+?)\s+(?:vence\shoy|está\s+vencid[oa])/i : stryMutAct_9fa48("1406") ? /^(.+?)\S+(?:vence\s+hoy|está\s+vencid[oa])/i : stryMutAct_9fa48("1405") ? /^(.+?)\s(?:vence\s+hoy|está\s+vencid[oa])/i : stryMutAct_9fa48("1404") ? /^(.)\s+(?:vence\s+hoy|está\s+vencid[oa])/i : stryMutAct_9fa48("1403") ? /(.+?)\s+(?:vence\s+hoy|está\s+vencid[oa])/i : (stryCov_9fa48("1403", "1404", "1405", "1406", "1407", "1408", "1409", "1410", "1411"), /^(.+?)\s+(?:vence\s+hoy|está\s+vencid[oa])/i));
        if (stryMutAct_9fa48("1413") ? false : stryMutAct_9fa48("1412") ? true : (stryCov_9fa48("1412", "1413"), match)) return stryMutAct_9fa48("1414") ? match[1] : (stryCov_9fa48("1414"), match[1].trim());
      }
    }
    if (stryMutAct_9fa48("1417") ? notification.referenceType !== 'inquiry' : stryMutAct_9fa48("1416") ? false : stryMutAct_9fa48("1415") ? true : (stryCov_9fa48("1415", "1416", "1417"), notification.referenceType === (stryMutAct_9fa48("1418") ? "" : (stryCov_9fa48("1418"), 'inquiry')))) {
      if (stryMutAct_9fa48("1419")) {
        {}
      } else {
        stryCov_9fa48("1419");
        let match = msg.match(stryMutAct_9fa48("1431") ? /(?:Nueva\s+)?consulta\s+(?:de|para)\s+(.+?)(?:\s*[^—–-]|$)/i : stryMutAct_9fa48("1430") ? /(?:Nueva\s+)?consulta\s+(?:de|para)\s+(.+?)(?:\S*[—–-]|$)/i : stryMutAct_9fa48("1429") ? /(?:Nueva\s+)?consulta\s+(?:de|para)\s+(.+?)(?:\s[—–-]|$)/i : stryMutAct_9fa48("1428") ? /(?:Nueva\s+)?consulta\s+(?:de|para)\s+(.+?)(?:\s*[—–-])/i : stryMutAct_9fa48("1427") ? /(?:Nueva\s+)?consulta\s+(?:de|para)\s+(.)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1426") ? /(?:Nueva\s+)?consulta\s+(?:de|para)\S+(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1425") ? /(?:Nueva\s+)?consulta\s+(?:de|para)\s(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1424") ? /(?:Nueva\s+)?consulta\S+(?:de|para)\s+(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1423") ? /(?:Nueva\s+)?consulta\s(?:de|para)\s+(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1422") ? /(?:Nueva\S+)?consulta\s+(?:de|para)\s+(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1421") ? /(?:Nueva\s)?consulta\s+(?:de|para)\s+(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1420") ? /(?:Nueva\s+)consulta\s+(?:de|para)\s+(.+?)(?:\s*[—–-]|$)/i : (stryCov_9fa48("1420", "1421", "1422", "1423", "1424", "1425", "1426", "1427", "1428", "1429", "1430", "1431"), /(?:Nueva\s+)?consulta\s+(?:de|para)\s+(.+?)(?:\s*[—–-]|$)/i));
        if (stryMutAct_9fa48("1433") ? false : stryMutAct_9fa48("1432") ? true : (stryCov_9fa48("1432", "1433"), match)) return stryMutAct_9fa48("1434") ? match[1] : (stryCov_9fa48("1434"), match[1].trim());
        match = msg.match(stryMutAct_9fa48("1443") ? /(?:asignada|contactada)\s+a\s+(.+?)(?:\s*[^—–-]|$)/i : stryMutAct_9fa48("1442") ? /(?:asignada|contactada)\s+a\s+(.+?)(?:\S*[—–-]|$)/i : stryMutAct_9fa48("1441") ? /(?:asignada|contactada)\s+a\s+(.+?)(?:\s[—–-]|$)/i : stryMutAct_9fa48("1440") ? /(?:asignada|contactada)\s+a\s+(.+?)(?:\s*[—–-])/i : stryMutAct_9fa48("1439") ? /(?:asignada|contactada)\s+a\s+(.)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1438") ? /(?:asignada|contactada)\s+a\S+(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1437") ? /(?:asignada|contactada)\s+a\s(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1436") ? /(?:asignada|contactada)\S+a\s+(.+?)(?:\s*[—–-]|$)/i : stryMutAct_9fa48("1435") ? /(?:asignada|contactada)\sa\s+(.+?)(?:\s*[—–-]|$)/i : (stryCov_9fa48("1435", "1436", "1437", "1438", "1439", "1440", "1441", "1442", "1443"), /(?:asignada|contactada)\s+a\s+(.+?)(?:\s*[—–-]|$)/i));
        if (stryMutAct_9fa48("1445") ? false : stryMutAct_9fa48("1444") ? true : (stryCov_9fa48("1444", "1445"), match)) return stryMutAct_9fa48("1446") ? match[1] : (stryCov_9fa48("1446"), match[1].trim());
        match = msg.match(stryMutAct_9fa48("1453") ? /(?:de|a)\s+(.+?)(?:\s*[^—–-]|$)/ : stryMutAct_9fa48("1452") ? /(?:de|a)\s+(.+?)(?:\S*[—–-]|$)/ : stryMutAct_9fa48("1451") ? /(?:de|a)\s+(.+?)(?:\s[—–-]|$)/ : stryMutAct_9fa48("1450") ? /(?:de|a)\s+(.+?)(?:\s*[—–-])/ : stryMutAct_9fa48("1449") ? /(?:de|a)\s+(.)(?:\s*[—–-]|$)/ : stryMutAct_9fa48("1448") ? /(?:de|a)\S+(.+?)(?:\s*[—–-]|$)/ : stryMutAct_9fa48("1447") ? /(?:de|a)\s(.+?)(?:\s*[—–-]|$)/ : (stryCov_9fa48("1447", "1448", "1449", "1450", "1451", "1452", "1453"), /(?:de|a)\s+(.+?)(?:\s*[—–-]|$)/));
        if (stryMutAct_9fa48("1455") ? false : stryMutAct_9fa48("1454") ? true : (stryCov_9fa48("1454", "1455"), match)) return stryMutAct_9fa48("1456") ? match[1] : (stryCov_9fa48("1456"), match[1].trim());
      }
    }
    return stryMutAct_9fa48("1457") ? "Stryker was here!" : (stryCov_9fa48("1457"), '');
  }
}