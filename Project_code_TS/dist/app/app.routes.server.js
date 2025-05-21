"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRoutes = void 0;
const ssr_1 = require("@angular/ssr");
exports.serverRoutes = [
    {
        path: '**',
        renderMode: ssr_1.RenderMode.Prerender
    }
];
