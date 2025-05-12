import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, TooltipItem, RadialLinearScaleOptions, Plugin } from 'chart.js';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; 
import { EloService } from './features/players/services/elo.service';
import { Player } from './features/players/model/player.model';
import { Match, GameTimelineEvent, MatchPlayerInfo, KdaStats } from './features/matchs/models/match.model';
import { Champion, ChampionClass } from './features/champions/model/champion.model';
import { ChampionService } from './features/champions/services/champion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, HttpClientModule,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  matches: Match[] = [];
  champions: Champion[] = [];

  isLoadingPlayers = false;
  isLoadingMatches = false;
  isLoadingChampions = false;
  errorPlayers: string | null = null;
  errorMatches: string | null = null;
  errorChampions: string | null = null;

  searchTerm: string = '';
  showAggregateStatsChart: boolean = false;
  selectedPlayer: Player | null = null;
  selectedMatch: Match | null = null;
  selectedChampion: Champion | null = null;
  showChampionList: boolean = false;

  matchesPlayed: number = 0;
  wins: number = 0;
  winRate: number = 0;
  loseRate: number = 0;

  isFindingOpponent: boolean = false;
  potentialOpponent: Player | null = null;
  readonly ELO_MATCH_RANGE: number = 75;

  private findOpponentSubscription: Subscription | undefined;
  private createMatchSubscription: Subscription | undefined;
  public ChampionClass = ChampionClass;
  championClasses = Object.values(ChampionClass);
  selectedChampionClassFilter: ChampionClass | null = null;

  public radarChartType: ChartType = 'radar';
  public lineChartType: ChartType = 'line';
  public barChartType: ChartType = 'bar';

  aggregateRadarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  aggregateRadarChartOptions!: ChartConfiguration['options'];

  playerRadarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  playerRadarChartOptions!: ChartConfiguration['options'];

  matchRadarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  matchLineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  matchBarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  baseMatchChartOptions!: ChartConfiguration['options'];
  matchRadarChartOptions!: ChartConfiguration['options'];
  matchLineChartOptions!: ChartConfiguration['options'];
  matchBarChartOptions!: ChartConfiguration['options'];
  public selectedMatchChartType: ChartType = 'radar';

  p1DamageDisplay: number = 0;
  p2DamageDisplay: number = 0;
  p1DamagePercentDisplay: number = 0;
  p2DamagePercentDisplay: number = 0;
  totalDamageDisplay: number = 0;
  canDisplayDamageRatio: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public eloService: EloService,
    private championService: ChampionService
  ) {
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    this.loadChampions();
    this.loadPlayers();
    this.loadMatches();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeChartOptions(): void {
    const radarTooltipCb = (context: TooltipItem<'radar'>): string => {
      let label = context.dataset.label || '';
      if (label) { label += ': '; }
      if (context.parsed.r !== null) { label += context.parsed.r.toFixed(0); }
      return label;
    };

    this.playerRadarChartOptions = {
      responsive: true, maintainAspectRatio: false,
      scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 11 } }, ticks: { stepSize: 20 } } as RadialLinearScaleOptions },
      plugins: { legend: { position: 'top', labels: { font: { size: 12 } } }, tooltip: { callbacks: { label: radarTooltipCb } } }
    };

    this.baseMatchChartOptions = {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { font: { size: 12 } } }, tooltip: { mode: 'index', intersect: false } }
    };

    this.matchRadarChartOptions = {
      ...JSON.parse(JSON.stringify(this.baseMatchChartOptions)),
      scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 10 } }, ticks: { backdropPadding: 0 } } as RadialLinearScaleOptions },
      plugins: { ...this.baseMatchChartOptions.plugins, tooltip: { ...this.baseMatchChartOptions.plugins?.tooltip, callbacks: { label: radarTooltipCb } } }
    };

    this.matchLineChartOptions = this.createLineBarOptions('Gold', 'Time (Minutes)', 'yGold', 'yDamage', 'Damage');
    this.matchBarChartOptions = this.createLineBarOptions('Gold', 'Time (Minutes)', 'yGold');

    this.aggregateRadarChartOptions = {
      responsive: true, maintainAspectRatio: false,
      scales: { r: { angleLines: { display: true }, suggestedMin: 0, pointLabels: { font: { size: 11, weight: 'bold' } }, ticks: { stepSize: 20, backdropColor: 'rgba(0,0,0,0.05)' } } as RadialLinearScaleOptions},
      plugins: { legend: { position: 'top', labels: { font: { size: 12 } } }, tooltip: { callbacks: { label: radarTooltipCb } } }
    };
  }

  private createLineBarOptions(yAxisLabel: string, xAxisLabel: string, yPrimaryAxisID: string, ySecondaryAxisID?: string, ySecondaryAxisLabel?: string): ChartConfiguration['options'] {
    const options: ChartConfiguration['options'] = {
        ...JSON.parse(JSON.stringify(this.baseMatchChartOptions)),
        scales: {
            x: { title: { display: true, text: xAxisLabel } },
            [yPrimaryAxisID]: { type: 'linear', display: true, position: 'left', title: { display: true, text: yAxisLabel }, beginAtZero: true }
        }
    };

    if (ySecondaryAxisID && ySecondaryAxisLabel && options?.scales) {
        (options?.scales as Record<string, any>)[ySecondaryAxisID] = {
            type: 'linear', display: true, position: 'right',
            title: { display: true, text: ySecondaryAxisLabel },
            grid: { drawOnChartArea: false }, beginAtZero: true
        };
    }
    return options;
}

  loadPlayers(): void {
    this.isLoadingPlayers = true;
    this.errorPlayers = null;
    const sub = this.eloService.getPlayers()
      .pipe(finalize(() => this.isLoadingPlayers = false))
      .subscribe({
        next: (data) => this.players = data,
        error: (err) => this.errorPlayers = err.message || 'Failed to load players.'
      });
    this.subscriptions.push(sub);
  }

  loadMatches(): void {
    this.isLoadingMatches = true;
    this.errorMatches = null;
    const sub = this.eloService.getMatches()
      .pipe(finalize(() => this.isLoadingMatches = false))
      .subscribe({
        next: (data) => {
          this.matches = data.map(match => ({
            ...match,
            timelineData: (!match.timelineData && match.player1Info?.championUsed && match.player2Info?.championUsed)
                          ? this.generateMockTimelineData(match.player1Info.championUsed, match.player2Info.championUsed)
                          : match.timelineData
          }));
        },
        error: (err) => this.errorMatches = err.message || 'Failed to load matches.'
      });
    this.subscriptions.push(sub);
  }

  loadChampions(): void {
  this.isLoadingChampions = true;
  this.errorChampions = null;
  const sub = this.championService.getChampions() 
    .pipe(finalize(() => this.isLoadingChampions = false))
    .subscribe({
      next: (data: Champion[]) => this.champions = data, 
      error: (err: any) => { 
        this.errorChampions = err.message || 'Failed to load champions.';
        console.error('Failed to load champions:', err);
      }
    });
  this.subscriptions.push(sub);
}
  filterPlayers(): Player[] {
    if (!this.searchTerm) return this.players;
    const lowerSearchTerm = this.searchTerm.toLowerCase();
    return this.players.filter(player => player.name.toLowerCase().includes(lowerSearchTerm));
  }

  getTopPlayers(): Player[] {
    return this.players.slice(0, 3); 
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
    this.selectedMatch = null;
    this.potentialOpponent = null;
    this.isFindingOpponent = false;
    this.showChampionList = false;
    this.selectedChampion = null;
    this.showAggregateStatsChart = false;
    this.calculateAndDisplayPlayerStats(player);
    this.generatePlayerRadarChartData(player);
  }

  calculateAndDisplayPlayerStats(player: Player): void {
    if (!player || !player.id) {
      this.resetPlayerCalculatedStats();
      return;
    }
    this.matchesPlayed = player.matchesPlayed || 0;
    this.wins = player.wins || 0;
    const losses = player.losses || (this.matchesPlayed - this.wins);

    this.winRate = this.matchesPlayed > 0 ? (this.wins / this.matchesPlayed) * 100 : 0;
    this.loseRate = this.matchesPlayed > 0 ? (losses / this.matchesPlayed) * 100 : 0;
  }

  private resetPlayerCalculatedStats(): void {
    this.matchesPlayed = 0; this.wins = 0; this.winRate = 0; this.loseRate = 0;
  }

  generatePlayerRadarChartData(player: Player): void {
    if (!player) return;
    this.playerRadarChartData = {
      labels: ['Attack', 'Defense', 'Speed', 'Magic', 'Support'],
      datasets: [{
        data: [player.attack, player.defense, player.speed, player.magic, player.support],
        label: player.name,
        borderColor: 'rgba(0,123,255,0.8)',
        backgroundColor: 'rgba(0,123,255,0.2)',
        pointBackgroundColor: 'rgba(0,123,255,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0,123,255,1)'
      }]
    };
  }

  selectMatch(match: Match): void {
    this.selectedMatch = match;
    this.selectedPlayer = null;
    this.showChampionList = false;
    this.showAggregateStatsChart = false;
    this.selectedChampion = null;
    this.potentialOpponent = null;
    this.selectedMatchChartType = 'radar';
    this.prepareAllMatchChartsData(match);
    this.calculateDamageRatioForSelectedMatch();
  }

  prepareAggregateStatsChart(): void {
    if (this.matches.length === 0 || this.champions.length === 0) {
      this.aggregateRadarChartData = { labels: [], datasets: [] };
      return;
    }
    const championPlayStats: { [champId: string]: { name: string, count: number, statsSum: Champion['baseStats'], championClass: ChampionClass } } = {};

    this.matches.forEach(match => {
      const processParticipant = (info: MatchPlayerInfo) => {
        if (info?.championUsed?.id && info.championUsed.baseStats) {
          const champId = info.championUsed.id;
          if (!championPlayStats[champId]) {
            championPlayStats[champId] = {
              name: info.championUsed.name,
              count: 0,
              statsSum: { health: 0, attackDamage: 0, armor: 0, magicResist: 0, movementSpeed: 0, ...({} as any) }, // Initialize all expected baseStats
              championClass: info.championUsed.championClass
            };
          }
          championPlayStats[champId].count++;
          Object.keys(info.championUsed.baseStats).forEach(key => {
            const statKey = key as keyof Champion['baseStats'];
            if (typeof info.championUsed.baseStats![statKey] === 'number') {
                 (championPlayStats[champId].statsSum as Record<string, number>)[statKey] += info.championUsed.baseStats![statKey] as number;
            }
          });
        }
      };
      processParticipant(match.player1Info);
      processParticipant(match.player2Info);
    });

    const sortedChampions = Object.values(championPlayStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5

    const labels = ['Avg HP', 'Avg AD', 'Avg Armor', 'Avg MR', 'Avg MS']; // Match baseStats keys
    const datasets: ChartConfiguration['data']['datasets'] = [];
    const colors = ['rgba(255, 99, 132, 0.7)','rgba(54, 162, 235, 0.7)','rgba(255, 206, 86, 0.7)','rgba(75, 192, 192, 0.7)','rgba(153, 102, 255, 0.7)'];

    sortedChampions.forEach((champData, index) => {
      if (champData.count > 0) {
        datasets.push({
          label: `${champData.name} (Played: ${champData.count})`,
          data: [
            champData.statsSum.health! / champData.count,
            champData.statsSum.attackDamage! / champData.count,
            champData.statsSum.armor! / champData.count,
            champData.statsSum.magicResist! / champData.count,
            champData.statsSum.movementSpeed! / champData.count
          ],
          borderColor: colors[index % colors.length].replace('0.7', '1'),
          backgroundColor: colors[index % colors.length],
          pointBackgroundColor: colors[index % colors.length].replace('0.7', '1'),
        });
      }
    });
    this.aggregateRadarChartData = { labels, datasets };

    let maxStatValue = 0;
    datasets.forEach(ds => { ds.data.forEach(val => { if (typeof val === 'number' && val > maxStatValue) maxStatValue = val; }); });
    if (this.aggregateRadarChartOptions?.scales?.['r']) {
        (this.aggregateRadarChartOptions.scales['r'] as RadialLinearScaleOptions).suggestedMax = Math.ceil(maxStatValue / 50) * 50 + 20 || 100;
    }
  }

  prepareAllMatchChartsData(match: Match): void {
    this.prepareMatchRadarData(match);
    this.prepareMatchTimelineChartsData(match);
  }

  prepareMatchRadarData(match: Match): void {
    if (!match?.player1Info?.championUsed?.baseStats || !match?.player2Info?.championUsed?.baseStats) {
      this.matchRadarChartData = { labels: [], datasets: [] };
      return;
    }
    const p1 = match.player1Info;
    const p2 = match.player2Info;
    const p1Stats = p1.championUsed.baseStats;
    const p2Stats = p2.championUsed.baseStats;

    const labels = ['HP', 'AD', 'Armor', 'MR', 'MS'];
    const normalize = (value: number = 0, min: number, max: number) => {
      if (max === min) return 50; 
      return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    };

    const statsBounds = {
      health: { min: 1800, max: 4500 },
      attackDamage: { min: 80, max: 150 },
      armor: { min: 70, max: 130 },
      magicResist: { min: 35, max: 60 },
      movementSpeed: { min: 325, max: 355 }
    };

    this.matchRadarChartData = {
      labels,
      datasets: [
        {
          data: [
            normalize(p1Stats.health, statsBounds.health.min, statsBounds.health.max),
            normalize(p1Stats.attackDamage, statsBounds.attackDamage.min, statsBounds.attackDamage.max),
            normalize(p1Stats.armor, statsBounds.armor.min, statsBounds.armor.max),
            normalize(p1Stats.magicResist, statsBounds.magicResist.min, statsBounds.magicResist.max),
            normalize(p1Stats.movementSpeed, statsBounds.movementSpeed.min, statsBounds.movementSpeed.max)
          ],
          label: `${p1.player.name} (${p1.championUsed.name})`,
          borderColor: 'rgba(54, 162, 235, 0.8)', backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
        {
          data: [
            normalize(p2Stats.health, statsBounds.health.min, statsBounds.health.max),
            normalize(p2Stats.attackDamage, statsBounds.attackDamage.min, statsBounds.attackDamage.max),
            normalize(p2Stats.armor, statsBounds.armor.min, statsBounds.armor.max),
            normalize(p2Stats.magicResist, statsBounds.magicResist.min, statsBounds.magicResist.max),
            normalize(p2Stats.movementSpeed, statsBounds.movementSpeed.min, statsBounds.movementSpeed.max)
          ],
          label: `${p2.player.name} (${p2.championUsed.name})`,
          borderColor: 'rgba(255, 99, 132, 0.8)', backgroundColor: 'rgba(255, 99, 132, 0.2)',
        }
      ]
    };
  }

  setMatchChartType(type: ChartType): void {
  this.selectedMatchChartType = type;
}

  prepareMatchTimelineChartsData(match: Match): void {
    if (!match.timelineData || match.timelineData.length === 0 || !match.player1Info?.championUsed || !match.player2Info?.championUsed) {
      this.matchLineChartData = { labels: [], datasets: [] };
      this.matchBarChartData = { labels: [], datasets: [] };
      return;
    }
    const timestamps = match.timelineData.map(event => `Min ${event.timestamp}`);
    const p1ChampId = match.player1Info.championUsed.id;
    const p2ChampId = match.player2Info.championUsed.id;

    const getStatTimeline = (championId: string, statKey: keyof GameTimelineEvent['participantStats'][0]): number[] => {
        return match.timelineData!.map(event => {
            const pStat = event.participantStats.find(p => p.championId === championId);
            const value = pStat ? pStat[statKey] : 0;
            return typeof value === 'number' ? value : 0;
        });
    };

    const goldDataset = (playerInfo: MatchPlayerInfo, color: string, champId: string) => ({
      data: getStatTimeline(champId, 'gold'),
      label: `${playerInfo.player.name} - Gold`,
      borderColor: color.replace('0.5', '1'), backgroundColor: color, fill: false, tension: 0.1, yAxisID: 'yGold'
    });
    const damageDataset = (playerInfo: MatchPlayerInfo, color: string, champId: string) => ({
      data: getStatTimeline(champId, 'damageDealtToChampions'),
      label: `${playerInfo.player.name} - Damage`,
      borderColor: color.replace('0.5', '1'), backgroundColor: color, fill: false, tension: 0.1, yAxisID: 'yDamage'
    });

    this.matchLineChartData = {
      labels: timestamps,
      datasets: [
        goldDataset(match.player1Info, 'rgba(54, 162, 235, 0.5)', p1ChampId),
        goldDataset(match.player2Info, 'rgba(255, 99, 132, 0.5)', p2ChampId),
        damageDataset(match.player1Info, 'rgba(75, 192, 192, 0.5)', p1ChampId),
        damageDataset(match.player2Info, 'rgba(255, 159, 64, 0.5)', p2ChampId)
      ]
    };
    this.matchBarChartData = { // Bar chart might just show gold or damage, not both with different axes easily
      labels: timestamps,
      datasets: [
        goldDataset(match.player1Info, 'rgba(54, 162, 235, 0.7)', p1ChampId),
        goldDataset(match.player2Info, 'rgba(255, 99, 132, 0.7)', p2ChampId)
      ]
    };
  }

  toggleAggregateStatsChart(): void {
  this.showAggregateStatsChart = !this.showAggregateStatsChart;
  if (this.showAggregateStatsChart) {
    this.showChampionList = false;
    this.selectedPlayer = null;
    this.selectedMatch = null;
    this.potentialOpponent = null;
    this.selectedChampion = null;
    this.prepareAggregateStatsChart(); 
  }
}

  calculateDamageRatioForSelectedMatch(): void {
    this.canDisplayDamageRatio = false;
    if (this.selectedMatch?.timelineData?.length && this.selectedMatch.player1Info?.championUsed && this.selectedMatch.player2Info?.championUsed) {
      const lastEvent = this.selectedMatch.timelineData[this.selectedMatch.timelineData.length - 1];
      const p1ChampId = this.selectedMatch.player1Info.championUsed.id;
      const p2ChampId = this.selectedMatch.player2Info.championUsed.id;

      const p1Stats = lastEvent.participantStats.find(p => p.championId === p1ChampId);
      const p2Stats = lastEvent.participantStats.find(p => p.championId === p2ChampId);

      this.p1DamageDisplay = p1Stats?.damageDealtToChampions || 0;
      this.p2DamageDisplay = p2Stats?.damageDealtToChampions || 0;
      this.totalDamageDisplay = this.p1DamageDisplay + this.p2DamageDisplay;

      if (this.totalDamageDisplay > 0) {
        this.p1DamagePercentDisplay = (this.p1DamageDisplay / this.totalDamageDisplay) * 100;
        this.p2DamagePercentDisplay = (this.p2DamageDisplay / this.totalDamageDisplay) * 100;
      } else {
        this.p1DamagePercentDisplay = 0; // Hoặc 50 nếu muốn chia đều khi không có damage
        this.p2DamagePercentDisplay = 0; // Hoặc 50
      }
      this.canDisplayDamageRatio = true;
    }
  }

  // --- Matchmaking Methods ---
  initiateFindOpponent(): void {
    if (!this.selectedPlayer?.id) {
      alert("Please select a player first.");
      return;
    }
    this.isFindingOpponent = true;
    this.potentialOpponent = null;
    this.findOpponentSubscription?.unsubscribe();
    this.findOpponentSubscription = this.eloService.findOpponent(this.selectedPlayer.id, this.ELO_MATCH_RANGE)
      .pipe(finalize(() => this.isFindingOpponent = false))
      .subscribe({
        next: (opponent) => {
          if (opponent) this.potentialOpponent = opponent;
          else alert(`No opponent found for ${this.selectedPlayer!.name} within +/- ${this.ELO_MATCH_RANGE} ELO.`);
        },
        error: (err) => alert(err.message || 'Error finding opponent.')
      });
    this.subscriptions.push(this.findOpponentSubscription);
  }

  startMatchWithOpponent(): void {
    if (!this.selectedPlayer?.id || !this.potentialOpponent?.id || this.champions.length === 0) {
      alert("Cannot start match. Player, opponent, or champion data missing.");
      return;
    }
    const p1Champion = this.champions[Math.floor(Math.random() * this.champions.length)];
    const p2Champion = this.champions[Math.floor(Math.random() * this.champions.length)];
    if (!p1Champion?.id || !p2Champion?.id) {
      alert("Failed to select random champions for the match."); return;
    }
    const winnerId = Math.random() > 0.5 ? this.selectedPlayer.id : this.potentialOpponent.id;
    const kdaP1: KdaStats = { kills: Math.floor(Math.random()*11), deaths: Math.floor(Math.random()*11), assists: Math.floor(Math.random()*16) };
    const kdaP2: KdaStats = { kills: Math.floor(Math.random()*11), deaths: Math.floor(Math.random()*11), assists: Math.floor(Math.random()*16) };

    this.createMatchSubscription?.unsubscribe();
    this.createMatchSubscription = this.eloService.createMatch(
      this.selectedPlayer.id, this.potentialOpponent.id, winnerId,
      p1Champion.id, p2Champion.id, kdaP1, kdaP2
    )
    .pipe(finalize(() => {
        this.potentialOpponent = null;
        this.isFindingOpponent = false;
    }))
    .subscribe({
      next: (newMatch) => {
        this.loadPlayers(); // Reload players to get updated ELOs
        this.matches.unshift({ // Add new match to the top
            ...newMatch,
            timelineData: this.generateMockTimelineData(p1Champion, p2Champion) // Add mock timeline if needed
        });
        this.matches = this.matches.slice(0, 100); // Keep latest 100

        const updatedPlayer = this.players.find(p => p.id === this.selectedPlayer!.id);
        if (updatedPlayer) {
            this.selectPlayer(updatedPlayer); // Re-select to update stats and chart
        } else {
            this.selectedPlayer = null; // Or handle if player not found after update
        }
        this.selectMatch(newMatch); // Show details of the new match
      },
      error: (err) => alert(err.message || 'Error: Could not start the match.')
    });
    this.subscriptions.push(this.createMatchSubscription);
  }

  cancelMatchmaking(): void {
    this.potentialOpponent = null;
    this.isFindingOpponent = false;
    this.findOpponentSubscription?.unsubscribe();
  }

  // --- Champion List Methods ---
  toggleChampionList(): void {
    this.showChampionList = !this.showChampionList;
    if (this.showChampionList) {
      this.selectedPlayer = null; this.selectedMatch = null; this.potentialOpponent = null;
      this.showAggregateStatsChart = false; this.selectedChampion = null; this.canDisplayDamageRatio = false;
    }
  }

  selectChampion(champion: Champion): void {
    this.selectedChampion = (this.selectedChampion?.id === champion.id) ? null : champion;
  }

  filterChampions(): Champion[] {
    if (!this.selectedChampionClassFilter) return this.champions;
    return this.champions.filter(c => c.championClass === this.selectedChampionClassFilter);
  }

  clearChampionFilter(): void {
    this.selectedChampionClassFilter = null;
  }

  getChampionImageUrl(champion?: Champion): string {
    if (!champion) return 'assets/icons/placeholder-champion-24.png';
    return champion.imageUrl || `https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/${champion.name.replace(/[^a-zA-Z0-9]/g, '')}.png`;
  }

  getWinnerName(match: Match): string {
    if (!match?.player1Info?.player || !match?.player2Info?.player) return 'N/A';
    return match.winnerId === match.player1Info.player.id
      ? match.player1Info.player.name
      : match.player2Info.player.name;
  }
  generateMockTimelineData(p1Champion: Champion, p2Champion: Champion): GameTimelineEvent[] {
    if (!p1Champion?.id || !p2Champion?.id) return [];
    const timeline: GameTimelineEvent[] = [];
    let p1Data = { gold: 500, cs: 0, kills: 0, deaths: 0, assists: 0, level: 1, damageDealtToChampions: 0, xp: 0 };
    let p2Data = { gold: 500, cs: 0, kills: 0, deaths: 0, assists: 0, level: 1, damageDealtToChampions: 0, xp: 0 };

    for (let min = 1; min <= 30; min += 2) {
      p1Data.gold += Math.floor(Math.random() * 250) + 150; 
      p2Data.gold += Math.floor(Math.random() * 250) + 150;
      p1Data.cs += Math.floor(Math.random() * 10) + 6;
      p2Data.cs += Math.floor(Math.random() * 10) + 6;
      p1Data.level = Math.min(18, Math.floor(1 + min / 1.8));
      p2Data.level = Math.min(18, Math.floor(1 + min / 1.8));
      p1Data.xp = p1Data.level * 1000;
      p2Data.xp = p2Data.level * 1000;

      const p1KillChance = 0.10; 
      const p2KillChance = 0.10;
      const p1AssistChance = 0.20;
      const p2AssistChance = 0.20;

      if (Math.random() < p1KillChance) {
        p1Data.kills++;
        p2Data.deaths++;
        p1Data.gold += 300; 
        p1Data.damageDealtToChampions += Math.floor(Math.random() * 300) + 200; 
      }
      if (Math.random() < p2KillChance) {
        p2Data.kills++;
        p1Data.deaths++;
        p2Data.gold += 300;
        p2Data.damageDealtToChampions += Math.floor(Math.random() * 300) + 200;
      }
      if (Math.random() < p1AssistChance && p2Data.deaths > (timeline.find(t=>t.timestamp === min-2)?.participantStats[1].deaths || 0) ) p1Data.assists++;
      if (Math.random() < p2AssistChance && p1Data.deaths > (timeline.find(t=>t.timestamp === min-2)?.participantStats[0].deaths || 0) ) p2Data.assists++;

      p1Data.damageDealtToChampions += Math.floor(Math.random() * 150) + 50;
      p2Data.damageDealtToChampions += Math.floor(Math.random() * 150) + 50;


      timeline.push({
        timestamp: min,
        participantStats: [
          {
            championId: p1Champion.id,
            gold: p1Data.gold,
            cs: p1Data.cs,
            kills: p1Data.kills,
            deaths: p1Data.deaths,
            assists: p1Data.assists,
            level: p1Data.level,
            xp: p1Data.xp,
            damageDealtToChampions: p1Data.damageDealtToChampions
          },
          {
            championId: p2Champion.id,
            gold: p2Data.gold,
            cs: p2Data.cs,
            kills: p2Data.kills,
            deaths: p2Data.deaths,
            assists: p2Data.assists,
            level: p2Data.level,
            xp: p2Data.xp,
            damageDealtToChampions: p2Data.damageDealtToChampions
          }
        ]
      });
    }
    return timeline;
  }
}