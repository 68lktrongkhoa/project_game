"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const router_1 = require("@angular/router");
const http_1 = require("@angular/common/http");
const app_routes_1 = require("./app.routes");
exports.appConfig = {
    providers: [
        (0, router_1.provideRouter)(app_routes_1.routes),
        (0, http_1.provideHttpClient)((0, http_1.withInterceptorsFromDi)(), (0, http_1.withFetch)()),
    ]
};
