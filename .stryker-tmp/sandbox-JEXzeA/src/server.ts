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
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
const browserDistFolder = join(import.meta.dirname, stryMutAct_9fa48("6507") ? "" : (stryCov_9fa48("6507"), '../browser'));
const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(express.static(browserDistFolder, stryMutAct_9fa48("6508") ? {} : (stryCov_9fa48("6508"), {
  maxAge: stryMutAct_9fa48("6509") ? "" : (stryCov_9fa48("6509"), '1y'),
  index: stryMutAct_9fa48("6510") ? true : (stryCov_9fa48("6510"), false),
  redirect: stryMutAct_9fa48("6511") ? true : (stryCov_9fa48("6511"), false)
})));

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  if (stryMutAct_9fa48("6512")) {
    {}
  } else {
    stryCov_9fa48("6512");
    angularApp.handle(req).then(stryMutAct_9fa48("6513") ? () => undefined : (stryCov_9fa48("6513"), response => response ? writeResponseToNodeResponse(response, res) : next())).catch(next);
  }
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (stryMutAct_9fa48("6516") ? isMainModule(import.meta.url) && process.env['pm_id'] : stryMutAct_9fa48("6515") ? false : stryMutAct_9fa48("6514") ? true : (stryCov_9fa48("6514", "6515", "6516"), isMainModule(import.meta.url) || process.env[stryMutAct_9fa48("6517") ? "" : (stryCov_9fa48("6517"), 'pm_id')])) {
  if (stryMutAct_9fa48("6518")) {
    {}
  } else {
    stryCov_9fa48("6518");
    const port = stryMutAct_9fa48("6521") ? process.env['PORT'] && 4000 : stryMutAct_9fa48("6520") ? false : stryMutAct_9fa48("6519") ? true : (stryCov_9fa48("6519", "6520", "6521"), process.env[stryMutAct_9fa48("6522") ? "" : (stryCov_9fa48("6522"), 'PORT')] || 4000);
    app.listen(port, error => {
      if (stryMutAct_9fa48("6523")) {
        {}
      } else {
        stryCov_9fa48("6523");
        if (stryMutAct_9fa48("6525") ? false : stryMutAct_9fa48("6524") ? true : (stryCov_9fa48("6524", "6525"), error)) {
          if (stryMutAct_9fa48("6526")) {
            {}
          } else {
            stryCov_9fa48("6526");
            throw error;
          }
        }
        console.log(stryMutAct_9fa48("6527") ? `` : (stryCov_9fa48("6527"), `Node Express server listening on http://localhost:${port}`));
      }
    });
  }
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);