
export enum ChampionClass {
    WARRIOR = 'Warrior',
    MAGE = 'Mage',
    ASSASSIN = 'Assassin',
    TANK = 'Tank',
    MARKSMAN = 'Marksman',
    SUPPORT = 'Support'
  }
  
  export interface ChampionAbility {
    name: string;
    description: string;
    cooldown?: number;
    damageType?: string; 
    iconUrl?: string;
  }
  
  export interface Champion {
    id: any;
    name: string;
    title: string;
    championClass: ChampionClass;
    imageUrl?: string;
    description: string;
    
    abilities: ChampionAbility[];
    
    baseStats: {
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