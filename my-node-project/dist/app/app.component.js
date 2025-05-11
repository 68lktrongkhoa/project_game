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
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const ng2_charts_1 = require("ng2-charts");
const forms_1 = require("@angular/forms");
let AppComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-root',
            standalone: true,
            imports: [common_1.CommonModule, ng2_charts_1.NgChartsModule, forms_1.FormsModule],
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppComponent = _classThis = class {
        constructor(eloService) {
            this.eloService = eloService;
            this.players = [];
            this.matches = [];
            this.selectedPlayer = null;
            this.selectedMatch = null;
            this.matchesPlayed = 0;
            this.wins = 0;
            this.winRate = 0;
            this.loseRate = 0;
            this.searchTerm = '';
            this.radarChartLabels = ['Attack', 'Defense', 'Speed', 'Magic', 'Support'];
            this.playerRadarChartData = {
                labels: this.radarChartLabels,
                datasets: []
            };
            this.matchRadarChartData = {
                labels: this.radarChartLabels,
                datasets: []
            };
            this.radarChartOptions = {
                responsive: true,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { stepSize: 20 },
                        pointLabels: {
                            font: { size: 14 }
                        }
                    }
                },
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { enabled: true }
                }
            };
            this.loadPlayers();
            this.loadMatches();
        }
        // Lấy danh sách người chơi từ dịch vụ
        loadPlayers() {
            this.players = this.eloService.getPlayers();
        }
        // Lấy danh sách trận đấu từ dịch vụ
        loadMatches() {
            this.matches = this.eloService.getMatches();
        }
        // Lấy top 3 người chơi
        getTopPlayers() {
            return this.players
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3);
        }
        // Chọn một trận đấu và hiển thị dữ liệu radar
        selectMatch(match) {
            this.selectedMatch = match;
            const player1Data = [
                match.player1.attack,
                match.player1.defense,
                match.player1.speed,
                match.player1.magic,
                match.player1.support
            ];
            const player2Data = [
                match.player2.attack,
                match.player2.defense,
                match.player2.speed,
                match.player2.magic,
                match.player2.support
            ];
            this.matchRadarChartData = {
                labels: this.radarChartLabels,
                datasets: [
                    {
                        data: player1Data,
                        label: match.player1.name,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                    },
                    {
                        data: player2Data,
                        label: match.player2.name,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                    }
                ]
            };
        }
        // Lọc danh sách người chơi theo từ khóa tìm kiếm
        filterPlayers() {
            return this.players
                .filter(player => player.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
                .sort((a, b) => b.rating - a.rating);
        }
        // Chọn một người chơi và hiển thị dữ liệu radar
        selectPlayer(player) {
            this.selectedPlayer = player;
            const matchHistory = this.eloService.getPlayerMatchHistory(player.id);
            this.matchesPlayed = matchHistory.length;
            this.wins = matchHistory.filter(match => match.winner.id === player.id).length;
            this.winRate = this.matchesPlayed > 0 ? (this.wins / this.matchesPlayed) * 100 : 0;
            const losses = this.matchesPlayed - this.wins;
            this.loseRate = this.matchesPlayed > 0 ? (losses / this.matchesPlayed) * 100 : 0;
            const playerData = [
                player.attack,
                player.defense,
                player.speed,
                player.magic,
                player.support
            ];
            this.playerRadarChartData = {
                labels: this.radarChartLabels,
                datasets: [
                    {
                        data: playerData,
                        label: player.name,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                    }
                ]
            };
        }
    };
    __setFunctionName(_classThis, "AppComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppComponent = _classThis;
})();
exports.AppComponent = AppComponent;
