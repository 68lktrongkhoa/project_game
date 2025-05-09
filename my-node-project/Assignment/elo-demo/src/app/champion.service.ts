// src/app/champion.service.ts
import { Injectable } from '@angular/core';
import { Champion, ChampionClass } from './champion.model';
import { LEAGUE_OF_LEGENDS_CHAMPIONS } from './champion.data'; // Import dữ liệu tướng

@Injectable({
  providedIn: 'root'
})
export class ChampionService {
  private champions: Champion[] = LEAGUE_OF_LEGENDS_CHAMPIONS; // Sử dụng dữ liệu đã import

  constructor() {
    // Bạn có thể sắp xếp lại mảng champions ở đây nếu muốn, ví dụ theo tên
    this.champions.sort((a, b) => a.name.localeCompare(b.name));
  }

  getChampions(): Champion[] {
    return [...this.champions]; // Trả về bản sao
  }

  getChampionById(id: number): Champion | undefined {
    return this.champions.find(c => c.id === id);
  }

  getRandomChampion(): Champion {
    if (this.champions.length === 0) {
      // Xử lý trường hợp không có tướng nào (mặc dù khó xảy ra nếu bạn đã thêm dữ liệu)
      throw new Error("No champions available to select randomly.");
    }
    const randomIndex = Math.floor(Math.random() * this.champions.length);
    return this.champions[randomIndex];
  }

  getChampionsByClass(championClass: ChampionClass): Champion[] {
    return this.champions.filter(c => c.championClass === championClass);
  }
}