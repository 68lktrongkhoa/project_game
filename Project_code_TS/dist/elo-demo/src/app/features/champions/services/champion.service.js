"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionService = void 0;
const core_1 = require("@angular/core");
const champion_data_1 = require("../data/champion.data");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let ChampionService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ChampionService = _classThis = class {
        constructor(http) {
            this.http = http;
            this.apiUrl = 'http://localhost:5000/api/champions';
            this.champions = champion_data_1.LEAGUE_OF_LEGENDS_CHAMPIONS;
            this.champions.sort((a, b) => a.name.localeCompare(b.name));
        }
        handleError(error) {
            console.error('Champion API Error:', error);
            let errorMessage = 'An unknown error occurred with Champion API!';
            if (error.error instanceof ErrorEvent) {
                errorMessage = `Client-side/Network error: ${error.error.message}`;
            }
            else {
                errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error) || error.message}`;
            }
            return (0, rxjs_1.throwError)(() => new Error(errorMessage));
        }
        getChampions() {
            return (0, rxjs_1.of)(champion_data_1.LEAGUE_OF_LEGENDS_CHAMPIONS);
        }
        getChampionById(championId) {
            return this.http.get(`${this.apiUrl}/${championId}`)
                .pipe((0, operators_1.tap)(champion => console.log(`Fetched champion by ID ${championId}:`, champion)), (0, operators_1.catchError)(this.handleError));
        }
        getRandomChampion() {
            if (this.champions.length === 0) {
                throw new Error("No champions available to select randomly.");
            }
            const randomIndex = Math.floor(Math.random() * this.champions.length);
            return this.champions[randomIndex];
        }
        getChampionsByClass(championClass) {
            return this.champions.filter(c => c.championClass === championClass);
        }
    };
    __setFunctionName(_classThis, "ChampionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChampionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChampionService = _classThis;
})();
exports.ChampionService = ChampionService;
