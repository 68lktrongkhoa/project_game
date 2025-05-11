// src/app/champion.model.ts

export enum ChampionClass {
    WARRIOR = 'Warrior',
    MAGE = 'Mage',
    ASSASSIN = 'Assassin',
    TANK = 'Tank',
    MARKSMAN = 'Marksman',
    SUPPORT = 'Support'
  }
  
  export interface ChampionAbility { // Kỹ năng của tướng (ví dụ)
    name: string;
    description: string;
    cooldown?: number;
    damageType?: string; // Physical, Magical, True
    iconUrl?: string;
  }
  
  export interface Champion {
    id: number;
    name: string;
    title: string; // Danh hiệu, ví dụ: "the Dark Child"
    championClass: ChampionClass; // Phân loại tướng
    imageUrl?: string; // URL hình ảnh tướng (nếu có)
    description: string; // Mô tả ngắn về tướng
    
    abilities: ChampionAbility[]; // Danh sách kỹ năng
    
    baseStats: { // Chỉ số cơ bản của tướng (có thể ảnh hưởng đến player stats khi chọn tướng)
      health: number;
      mana?: number;
      attackDamage: number;
      abilityPower: number;
      armor: number;
      magicResist: number;
      movementSpeed: number;
      attackSpeed?: number;
      critChance?: number;
    };
  }