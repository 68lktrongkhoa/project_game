// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, TooltipItem ,RadialLinearScaleOptions} from 'chart.js';

import { EloService } from './elo.service';
import { Player } from './player.model';
import { Match, GameTimelineEvent, MatchPlayerInfo } from './match.model';
import { Champion, ChampionClass } from './champion.model';
import { ChampionService } from './champion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  players: Player[] = [];
  matches: Match[] = [];
  searchTerm: string = ''; 
  showAggregateStatsChart: boolean = false;
  selectedPlayer: Player | null = null;
  selectedMatch: Match | null = null;
  p1DamageDisplay: number = 0;
  p2DamageDisplay: number = 0;
  p1DamagePercentDisplay: number = 0;
  p2DamagePercentDisplay: number = 0;
  totalDamageDisplay: number = 0;
  canDisplayDamageRatio: boolean = false;
  public ChampionClass = ChampionClass;
  aggregateRadarChartOptions!: ChartConfiguration['options'];
  

  matchesPlayed: number = 0;
  wins: number = 0;
  winRate: number = 0;
  loseRate: number = 0;
  aggregateRadarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  isFindingOpponent: boolean = false;
  potentialOpponent: Player | null = null;
  readonly ELO_MATCH_RANGE: number = 75;

  champions: Champion[] = [];
  selectedChampion: Champion | null = null;
  showChampionList: boolean = false;
  championClasses = Object.values(ChampionClass);
  selectedChampionClassFilter: ChampionClass | null = null;

  // Player Radar Chart
  playerRadarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  playerRadarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: { font: { size: 11 } },
        ticks: { stepSize: 20 }
      }
    },
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      tooltip: { callbacks: { label: this.radarTooltipLabelCallback } }
    }
  };

  public radarChartType: ChartType = 'radar';

  // Match Detail Charts
  matchRadarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  matchLineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  matchBarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  // Shared options for match charts
  baseMatchChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      tooltip: { mode: 'index', intersect: false }
    }
  };

  // Specific options derived from base
  matchRadarChartOptions: ChartConfiguration['options'];
  matchLineChartOptions: ChartConfiguration['options'];
  matchBarChartOptions: ChartConfiguration['options'];

  public selectedMatchChartType: ChartType = 'radar';

  constructor(
    private eloService: EloService,
    private championService: ChampionService
  ) {
    // Initialize specific chart options
    this.matchRadarChartOptions = this.createMatchRadarOptions();
    this.matchLineChartOptions = this.createMatchLineBarOptions('Gold', 'Time (Minutes)');
    this.matchBarChartOptions = this.createMatchLineBarOptions('Gold', 'Time (Minutes)');
    this.aggregateRadarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: { // Khởi tạo scales ở đây
        r: { // Khởi tạo trục 'r' ở đây
          angleLines: { display: true },
          suggestedMin: 0,
          pointLabels: { font: { size: 11, weight: 'bold' } },
          ticks: { stepSize: 20, backdropColor: 'rgba(0,0,0,0.05)' }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { font: { size: 12 } } },
        tooltip: { callbacks: { label: this.radarTooltipLabelCallback } }
      }
    };
  }

  ngOnInit(): void {
    this.loadChampions(); // Load champions first
    this.loadPlayers();
    this.loadMatches();
  }

  // Helper for tooltip
  radarTooltipLabelCallback(context: TooltipItem<'radar'>): string {
    let label = context.dataset.label || '';
    if (label) { label += ': '; }
    if (context.parsed.r !== null) { label += context.parsed.r.toFixed(0); }
    return label;
  }

  createMatchRadarOptions(): ChartConfiguration['options'] {
    const options = JSON.parse(JSON.stringify(this.baseMatchChartOptions));
    options.scales = {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        pointLabels: { font: { size: 10 } },
        ticks: { backdropPadding: 0 }
      }
    };
    options.plugins.tooltip.callbacks = { label: this.radarTooltipLabelCallback };
    return options;
  }

  createMatchLineBarOptions(yAxisLabel: string, xAxisLabel: string): ChartConfiguration['options'] {
    const options = JSON.parse(JSON.stringify(this.baseMatchChartOptions));
    options.scales = {
      y: { beginAtZero: true, title: { display: true, text: yAxisLabel } },
      x: { title: { display: true, text: xAxisLabel } }
    };
    return options;
  }

  loadPlayers(): void {
    this.players = this.eloService.getPlayers();
  }

  loadMatches(): void {
    this.matches = this.eloService.getMatches();
    this.matches.forEach(match => {
      // Ensure champion data is properly set
      // if (match.player1Info && match.player1Info.championId && !match.player1Info.championUsed) {
      //   match.player1Info.championUsed = this.champions.find(c => c.id === match.player1Info.championId) || this.champions[0];
      // }
      // if (match.player2Info && match.player2Info.championId && !match.player2Info.championUsed) {
      //   match.player2Info.championUsed = this.champions.find(c => c.id === match.player2Info.championId) || this.champions[0];
      // }

      // Generate timeline data if missing
      if (!match.timelineData && match.player1Info?.championUsed && match.player2Info?.championUsed) {
        match.timelineData = this.generateMockTimelineData(
          match.player1Info.championUsed,
          match.player2Info.championUsed
        );
      }
    });
  }
  toggleAggregateStatsChart(): void {
    
    this.showAggregateStatsChart = !this.showAggregateStatsChart;
    if (this.showAggregateStatsChart) {
      this.showChampionList = false; // Ẩn danh sách tướng nếu đang xem chart này
      this.selectedPlayer = null;
      this.selectedMatch = null;
      this.potentialOpponent = null;
      this.selectedChampion = null;
      this.prepareAggregateStatsChart(); // Chuẩn bị dữ liệu khi hiển thị
    }
  }

  // toggleChampionList(): void {
  //   this.showChampionList = !this.showChampionList;
  //   if (this.showChampionList) {
  //     this.selectedPlayer = null;
  //     this.showAggregateStatsChart = false; 
  //     this.selectedMatch = null;
  //     this.potentialOpponent = null;
  //     this.selectedChampion = null;
  //   }
  // }
  prepareAggregateStatsChart(): void {
    if (this.matches.length === 0) {
      this.aggregateRadarChartData = { labels: [], datasets: [] };
      console.warn("No matches available to generate aggregate stats chart.");
      return;
    }
  
    // --- Logic ví dụ: Trung bình chỉ số của các tướng được sử dụng ---
    // Bạn có thể thay đổi logic này để phù hợp với nhu cầu phân tích của mình
    // Ví dụ:
    // - Tỉ lệ thắng của từng Class Champion
    // - Trung bình KDA theo Class Champion
    // - Phân bố các chỉ số của tướng được chọn nhiều nhất
  
    const championStatsSum: { [key: string]: { count: number; health: number; ad: number; armor: number; mr: number; ms: number } } = {};
    let totalMatchesWithValidChamps = 0;
  
    this.matches.forEach(match => {
      const processPlayerInfo = (playerInfo: MatchPlayerInfo) => {
        if (playerInfo && playerInfo.championUsed && playerInfo.championUsed.baseStats) {
          const champName = playerInfo.championUsed.name;
          const stats = playerInfo.championUsed.baseStats;
          if (!championStatsSum[champName]) {
            championStatsSum[champName] = { count: 0, health: 0, ad: 0, armor: 0, mr: 0, ms: 0 };
          }
          championStatsSum[champName].count++;
          championStatsSum[champName].health += stats.health || 0;
          championStatsSum[champName].ad += stats.attackDamage || 0;
          championStatsSum[champName].armor += stats.armor || 0;
          championStatsSum[champName].mr += stats.magicResist || 0;
          championStatsSum[champName].ms += stats.movementSpeed || 0;
          return true;
        }
        return false;
      };
  
      let p1Valid = processPlayerInfo(match.player1Info);
      let p2Valid = processPlayerInfo(match.player2Info);
      if (p1Valid || p2Valid) totalMatchesWithValidChamps++;
    });
  
    if (Object.keys(championStatsSum).length === 0) {
        this.aggregateRadarChartData = { labels: [], datasets: [] };
        console.warn("No valid champion stats found in matches.");
        return;
    }
  
    // Lấy top N tướng được chơi nhiều nhất để hiển thị (ví dụ: top 5)
    const sortedChampions = Object.entries(championStatsSum)
                                .sort(([,a],[,b]) => b.count - a.count)
                                .slice(0, 5);
  
    const labels = ['Avg HP', 'Avg AD', 'Avg Armor', 'Avg MR', 'Avg MS'];
    const datasets: ChartConfiguration['data']['datasets'] = [];
    const colors = [
      'rgba(255, 99, 132, 0.7)',  // Red
      'rgba(54, 162, 235, 0.7)',  // Blue
      'rgba(255, 206, 86, 0.7)', // Yellow
      'rgba(75, 192, 192, 0.7)', // Green
      'rgba(153, 102, 255, 0.7)' // Purple
    ];
  
    sortedChampions.forEach(([champName, data], index) => {
      if (data.count > 0) {
        datasets.push({
          label: `${champName} (Played: ${data.count})`,
          data: [
            data.health / data.count,
            data.ad / data.count,
            data.armor / data.count,
            data.mr / data.count,
            data.ms / data.count,
          ],
          borderColor: colors[index % colors.length].replace('0.7', '1'), // Full opacity for border
          backgroundColor: colors[index % colors.length], // Semi-transparent for fill
          pointBackgroundColor: colors[index % colors.length].replace('0.7', '1'),
        });
      }
    });
  
    // Nếu bạn muốn normalize các giá trị trung bình này, bạn cần xác định min/max cho các giá trị trung bình.
    // Ví dụ: nếu bạn normalize, bạn cần cập nhật lại data trong datasets
    // và có thể cần điều chỉnh aggregateRadarChartOptions.scales.r.suggestedMax
  
    this.aggregateRadarChartData = { labels, datasets };
  
    // Điều chỉnh suggestedMax nếu cần, dựa trên giá trị lớn nhất trong data
    let maxStatValue = 0;
    datasets.forEach(ds => {
      ds.data.forEach(val => {
          if (typeof val === 'number' && val > maxStatValue) maxStatValue = val;
      });
    });
    if (this.aggregateRadarChartOptions?.scales) {
      // Truy cập 'r' bằng dấu ngoặc vuông và ép kiểu
      const radarScale = this.aggregateRadarChartOptions.scales['r'] as RadialLinearScaleOptions | undefined;

      if (radarScale) { // Kiểm tra xem radarScale có tồn tại không sau khi truy cập và ép kiểu
        radarScale.suggestedMax = Math.ceil(maxStatValue / 100) * 100 + 50;
      } else {
        // Trường hợp này không nên xảy ra nếu bạn đã khởi tạo 'r' trong constructor
        console.warn("Radar scale 'r' not found in aggregateRadarChartOptions.scales.");
      }
    } else {
      console.warn("aggregateRadarChartOptions.scales is undefined.");
    }
  
  }

  generateMockTimelineData(p1Champion: Champion, p2Champion: Champion): GameTimelineEvent[] {
    const timeline: GameTimelineEvent[] = [];
    let p1Gold = 500, p2Gold = 500;
    let p1CS = 0, p2CS = 0;
    let p1Kills = 0, p2Kills = 0;
    let p1Deaths = 0, p2Deaths = 0;
    let p1Assists = 0, p2Assists = 0;

    for (let min = 5; min <= 30; min += 5) {
      p1Gold += Math.floor(Math.random() * 600) + 250;
      p2Gold += Math.floor(Math.random() * 600) + 250;
      p1CS += Math.floor(Math.random() * 12) + 8;
      p2CS += Math.floor(Math.random() * 12) + 8;
      
      if (Math.random() > 0.7) p1Kills++;
      if (Math.random() > 0.7) p2Kills++;
      if (Math.random() > 0.85) p1Deaths++;
      if (Math.random() > 0.85) p2Deaths++;

      timeline.push({
        timestamp: min,
        participantStats: [
          { 
            championId: p1Champion.id, 
            gold: p1Gold, 
            cs: p1CS, 
            kills: p1Kills, 
            deaths: p1Deaths, 
            assists: p1Assists,
            level: Math.min(18, 3 + min/3),
            xp: 0,
            damageDealtToChampions: p1Kills * 500 + p1CS * 10 
          },
          { 
            championId: p2Champion.id, 
            gold: p2Gold, 
            cs: p2CS, 
            kills: p2Kills, 
            deaths: p2Deaths, 
            assists: p2Assists,
            level: Math.min(18, 3 + min/3),
            xp: 0,
            damageDealtToChampions: p2Kills * 500 + p2CS * 10 
          }
        ]
      });
    }
    return timeline;
  }

  loadChampions(): void {
    this.champions = this.championService.getChampions();
    if (this.champions.length === 0) {
      console.error("No champions loaded!");
    }
  }

  filterPlayers(): Player[] {
    if (!this.searchTerm) return this.players;
    return this.players.filter(player => 
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
    this.calculatePlayerStats(player);
    this.generatePlayerRadarChartData(player);
  }

  calculatePlayerStats(player: Player): void {
    if (!player) return;
    const playerMatches = this.eloService.getPlayerMatchHistory(player.id);
    this.matchesPlayed = playerMatches.length;
    this.wins = playerMatches.filter(m => m.winnerId === player.id).length;
    this.winRate = this.matchesPlayed > 0 ? (this.wins / this.matchesPlayed) * 100 : 0;
    this.loseRate = this.matchesPlayed > 0 ? ((this.matchesPlayed - this.wins) / this.matchesPlayed) * 100 : 0;
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
      }]
    };
  }

  selectMatch(match: Match): void {
    this.selectedMatch = match;
    this.selectedPlayer = null;
    this.showChampionList = false;
    this.showAggregateStatsChart = false;
    this.selectedChampion = null;
    this.selectedMatchChartType = 'radar';
    this.prepareAllMatchChartsData(match);
    this.calculateDamageRatioForSelectedMatch();
  }

  prepareAllMatchChartsData(match: Match): void {
    if (!match) {
      this.matchRadarChartData = { labels: [], datasets: [] };
      this.matchLineChartData = { labels: [], datasets: [] };
      this.matchBarChartData = { labels: [], datasets: [] };
      return;
    }
    this.prepareMatchRadarData(match);
    this.prepareMatchTimelineChartsData(match);
  }

  prepareMatchRadarData(match: Match): void {
    if (!match.player1Info?.championUsed?.baseStats || !match.player2Info?.championUsed?.baseStats) {
      this.matchRadarChartData = { labels: [], datasets: [] };
      return;
    }

    const p1Stats = match.player1Info.championUsed.baseStats;
    const p2Stats = match.player2Info.championUsed.baseStats;
    const labels = ['HP', 'AD', 'Armor', 'MR', 'MS'];

    // Normalize values for radar chart (0-100 scale)
    const normalize = (value: number, min: number, max: number) => {
      if (max === min) return 50;
      return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    };

    // Define reasonable bounds for champion stats
    const statsBounds = {
      health: { min: 2800, max: 4500 },
      attackDamage: { min: 140, max: 180 },
      armor: { min: 70, max: 130 },
      magicResist: { min: 40, max: 60 },
      movementSpeed: { min: 340, max: 400 }
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
          label: `${match.player1Info.player.name} (${match.player1Info.championUsed.name})`,
          borderColor: 'rgba(54, 162, 235, 0.8)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
        {
          data: [
            normalize(p2Stats.health, statsBounds.health.min, statsBounds.health.max),
            normalize(p2Stats.attackDamage, statsBounds.attackDamage.min, statsBounds.attackDamage.max),
            normalize(p2Stats.armor, statsBounds.armor.min, statsBounds.armor.max),
            normalize(p2Stats.magicResist, statsBounds.magicResist.min, statsBounds.magicResist.max),
            normalize(p2Stats.movementSpeed, statsBounds.movementSpeed.min, statsBounds.movementSpeed.max)
          ],
          label: `${match.player2Info.player.name} (${match.player2Info.championUsed.name})`,
          borderColor: 'rgba(255, 99, 132, 0.8)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        }
      ]
    };
  }

  prepareMatchTimelineChartsData(match: Match): void {
    if (!match.timelineData || match.timelineData.length === 0) {
      this.matchLineChartData = { labels: [], datasets: [] };
      this.matchBarChartData = { labels: [], datasets: [] };
      return;
    }

    const timestamps = match.timelineData.map(event => `Min ${event.timestamp}`);
    const p1Id = match.player1Info?.championUsed?.id;
    const p2Id = match.player2Info?.championUsed?.id;

    if (!p1Id || !p2Id) {
      console.error("Missing champion IDs in match data");
      return;
    }

    const getStatTimeline = (championId: number, statKey: keyof GameTimelineEvent['participantStats'][0]) => {
      return match.timelineData!.map(event => {
        const pStat = event.participantStats.find(p => p.championId === championId);
        return pStat ? pStat[statKey] as number : 0;
      });
    };

    const goldDatasetP1 = {
      data: getStatTimeline(p1Id, 'gold'),
      label: `${match.player1Info?.player.name} - Gold`,
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      fill: false,
      tension: 0.1
    };

    const goldDatasetP2 = {
      data: getStatTimeline(p2Id, 'gold'),
      label: `${match.player2Info?.player.name} - Gold`,
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill: false,
      tension: 0.1
    };

    const damageDatasetP1 = {
      data: getStatTimeline(p1Id, 'damageDealtToChampions'),
      label: `${match.player1Info?.player.name} - Damage`,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      fill: false,
      tension: 0.1,
      yAxisID: 'yDamage'
    };

    const damageDatasetP2 = {
      data: getStatTimeline(p2Id, 'damageDealtToChampions'),
      label: `${match.player2Info?.player.name} - Damage`,
      borderColor: 'rgba(255, 159, 64, 1)',
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      fill: false,
      tension: 0.1,
      yAxisID: 'yDamage'
    };

    this.matchLineChartData = { 
      labels: timestamps, 
      datasets: [goldDatasetP1, goldDatasetP2, damageDatasetP1, damageDatasetP2] 
    };
    
    this.matchBarChartData = { 
      labels: timestamps, 
      datasets: [goldDatasetP1, goldDatasetP2] 
    };

    // Update chart options for dual axis
    this.matchLineChartOptions = this.createMatchLineBarOptions('Gold', 'Time (Minutes)');
    if (this.matchLineChartOptions!.scales) { // This guard is correct
      (this.matchLineChartOptions!.scales as Record<string, any>)['yDamage'] = { // Cast to Record<string, any> or use a more specific type if yDamage is a custom scale
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Damage' },
        grid: { drawOnChartArea: false },
        beginAtZero: true
      };
    }
  }

  setMatchChartType(type: ChartType): void {
    this.selectedMatchChartType = type;
  }

  initiateFindOpponent(): void {
    if (!this.selectedPlayer || this.champions.length === 0) {
      if (this.champions.length === 0) alert("Champions not loaded yet. Please wait.");
      return;
    }
    this.isFindingOpponent = true;
    this.potentialOpponent = null;
    
    setTimeout(() => {
      const opponent = this.eloService.findOpponent(this.selectedPlayer!.id, this.ELO_MATCH_RANGE);
      if (opponent) {
        this.potentialOpponent = opponent;
      } else {
        alert(`No opponent found for ${this.selectedPlayer!.name} within +/- ${this.ELO_MATCH_RANGE} ELO.`);
      }
      this.isFindingOpponent = false;
    }, 1000);
  }

  startMatchWithOpponent(): void {
    if (!this.selectedPlayer || !this.potentialOpponent || this.champions.length === 0) {
      alert("Cannot start match. Player, opponent or champion data missing.");
      return;
    }

    const p1Champion = this.champions[Math.floor(Math.random() * this.champions.length)];
    const p2Champion = this.champions[Math.floor(Math.random() * this.champions.length)];
    const winnerId = Math.random() > 0.5 ? this.selectedPlayer.id : this.potentialOpponent.id;

    const player1Info: MatchPlayerInfo = {
      player: this.selectedPlayer!, // Added ! as selectedPlayer is checked before
      championUsed: p1Champion,
      // championId: p1Champion.id // REMOVE THIS LINE (TS2561)
    };
    const player2Info: MatchPlayerInfo = { 
      player: this.potentialOpponent, 
      championUsed: p2Champion,
      // championId: p2Champion.id
    };

    const newMatch = this.eloService.createMatch(
      this.selectedPlayer!.id,
      this.potentialOpponent!.id,
      winnerId,
      p1Champion.id, // Pass champion ID for player 1
      p2Champion.id  // Pass champion ID for player 2
  );

    if (newMatch) {
      newMatch.timelineData = this.generateMockTimelineData(p1Champion, p2Champion);
      this.loadPlayers(); // Refresh players to get updated ELO
      this.matches.unshift(newMatch);
      this.matches = this.matches.slice(0, 100);

      // Update selected player with new data
      const updatedSelectedPlayer = this.players.find(p => p.id === this.selectedPlayer!.id);
      if (updatedSelectedPlayer) {
        this.selectedPlayer = updatedSelectedPlayer;
        this.calculatePlayerStats(this.selectedPlayer);
        this.generatePlayerRadarChartData(this.selectedPlayer);
      }

      this.selectMatch(newMatch); // Show the new match details
    } else {
      alert('Error: Could not start the match.');
    }
    
    this.potentialOpponent = null;
    this.isFindingOpponent = false;
  }

  cancelMatchmaking(): void {
    this.potentialOpponent = null;
    this.isFindingOpponent = false;
  }

  toggleChampionList(): void {
    this.showChampionList = !this.showChampionList;
    if (this.showChampionList) {
      this.selectedPlayer = null;
      this.showAggregateStatsChart = false; 
      this.selectedMatch = null;
      this.potentialOpponent = null;
      this.selectedChampion = null;
      this.canDisplayDamageRatio = false;
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
    if (!champion) return 'https://via.placeholder.com/60x60.png?text=_';
    return champion.imageUrl || `https://via.placeholder.com/120x222.png?text=${champion.name.replace(' ','+')}`;
  }

  getWinnerName(match: Match): string {
    if (!match || !match.player1Info || !match.player2Info) return 'N/A';
    return match.winnerId === match.player1Info.player.id 
      ? match.player1Info.player.name 
      : match.player2Info.player.name;
  }
  calculateDamageRatioForSelectedMatch(): void {
    this.canDisplayDamageRatio = false;
    if (this.selectedMatch && this.selectedMatch.timelineData && this.selectedMatch.timelineData.length > 0 &&
        this.selectedMatch.player1Info.championUsed && this.selectedMatch.player2Info.championUsed) {
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
        this.p1DamagePercentDisplay = 50; 
        this.p2DamagePercentDisplay = 50; 
      }
      
      // Điều chỉnh logic cho thanh progress bar
      if (this.p1DamagePercentDisplay === 0 && this.p2DamagePercentDisplay === 100) this.p1DamagePercentDisplay = 0;
      else if (this.p2DamagePercentDisplay === 0 && this.p1DamagePercentDisplay === 100) this.p2DamagePercentDisplay = 0;
      // Không cần trường hợp cả hai 0% ở đây vì đã xử lý ở trên nếu totalDamageDisplay = 0

      this.canDisplayDamageRatio = true;
    }
  }

}