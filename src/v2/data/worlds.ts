export interface WorldTheme {
  bg: string;
  primary: string;
  glow: string;
  accent: string;
  grid: string;
}

export interface LanePath {
  // Waypoints as fractions [0..1] of the preview canvas dimensions.
  // First point = enemy spawn (entry end), last point ≈ core (exit end).
  points: Array<{ x: number; y: number }>;
}

export interface WorldDef {
  id: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  lanes: LanePath[];
  core: { x: number; y: number };      // core position as fraction [0..1]
  towerStart: { x: number; y: number }; // suggested first tower [0..1]
  theme: WorldTheme;
  bpm: number;
  unlocked: boolean;
  secret?: boolean;
  summary?: string;
}

export const WORLDS: WorldDef[] = [
  {
    id: 'rubble',
    name: 'Rubble World',
    gridWidth: 20,
    gridHeight: 20,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.3, y: 0.42 },
    lanes: [
      { points: [{ x: 0.04, y: 0.5 }, { x: 0.3, y: 0.5 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.5, y: 0.04 }, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#04050a',
      primary: '#27e0ff',
      glow: '#00ccff',
      accent: '#33ffbb',
      grid: 'rgba(40,80,120,0.25)',
    },
    bpm: 120,
    unlocked: true,
    summary: 'Base defense · Wave survival',
  },
  {
    id: 'crystal',
    name: 'Crystal Ridge',
    gridWidth: 18,
    gridHeight: 18,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.38, y: 0.38 },
    lanes: [
      { points: [{ x: 0.04, y: 0.22 }, { x: 0.28, y: 0.35 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.78 }, { x: 0.72, y: 0.65 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.45, y: 0.04 }, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#080412',
      primary: '#cc44ff',
      glow: '#aa22ee',
      accent: '#ff88ff',
      grid: 'rgba(100,40,140,0.2)',
    },
    bpm: 135,
    unlocked: false,
    summary: 'Crystal resources · Prism paths',
  },
  {
    id: 'water',
    name: 'Caustic Water',
    gridWidth: 22,
    gridHeight: 16,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.35, y: 0.5 },
    lanes: [
      { points: [{ x: 0.04, y: 0.3 }, { x: 0.22, y: 0.48 }, { x: 0.38, y: 0.42 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.04, y: 0.7 }, { x: 0.22, y: 0.52 }, { x: 0.38, y: 0.58 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.5 }, { x: 0.72, y: 0.5 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#020810',
      primary: '#0088ff',
      glow: '#0066dd',
      accent: '#44bbff',
      grid: 'rgba(20,60,100,0.2)',
    },
    bpm: 110,
    unlocked: false,
    summary: 'Liquid motes · Pipe routing',
  },
  {
    id: 'verdant',
    name: 'Verdant Growth',
    gridWidth: 18,
    gridHeight: 22,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.5, y: 0.38 },
    lanes: [
      { points: [{ x: 0.04, y: 0.5 }, { x: 0.2, y: 0.42 }, { x: 0.32, y: 0.5 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.5, y: 0.04 }, { x: 0.52, y: 0.24 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.5 }, { x: 0.78, y: 0.44 }, { x: 0.62, y: 0.5 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#020a04',
      primary: '#44ff88',
      glow: '#22ee66',
      accent: '#88ffaa',
      grid: 'rgba(20,80,40,0.2)',
    },
    bpm: 100,
    unlocked: false,
    summary: 'Overgrowth hazards · Bio routing',
  },
  {
    id: 'volcanic',
    name: 'Volcanic Heat',
    gridWidth: 16,
    gridHeight: 16,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.38, y: 0.42 },
    lanes: [
      { points: [{ x: 0.04, y: 0.35 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.04, y: 0.65 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.35 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.65 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#0a0400',
      primary: '#ff6622',
      glow: '#ee4411',
      accent: '#ffaa44',
      grid: 'rgba(120,40,0,0.2)',
    },
    bpm: 150,
    unlocked: false,
    summary: 'Lava motes · Heat pressure',
  },
  {
    id: 'void',
    name: 'Astral Void',
    gridWidth: 24,
    gridHeight: 24,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.42, y: 0.42 },
    lanes: [
      { points: [{ x: 0.04, y: 0.2 }, { x: 0.22, y: 0.5 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.04, y: 0.8 }, { x: 0.22, y: 0.5 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.5, y: 0.04 }, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.2 }, { x: 0.78, y: 0.5 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.8 }, { x: 0.78, y: 0.5 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#020010',
      primary: '#8844ff',
      glow: '#6622ee',
      accent: '#cc88ff',
      grid: 'rgba(60,20,100,0.2)',
    },
    bpm: 80,
    unlocked: false,
    secret: true,
    summary: 'Void signal · Phase routing',
  },
  {
    id: 'deepore',
    name: 'Deep Ore',
    gridWidth: 20,
    gridHeight: 20,
    core: { x: 0.5, y: 0.65 },
    towerStart: { x: 0.5, y: 0.52 },
    lanes: [
      { points: [{ x: 0.25, y: 0.04 }, { x: 0.35, y: 0.4 }, { x: 0.5, y: 0.65 }] },
      { points: [{ x: 0.75, y: 0.04 }, { x: 0.65, y: 0.4 }, { x: 0.5, y: 0.65 }] },
      { points: [{ x: 0.5, y: 0.96 }, { x: 0.5, y: 0.65 }] },
    ],
    theme: {
      bg: '#060402',
      primary: '#f0a600',
      glow: '#cc8800',
      accent: '#ffcc44',
      grid: 'rgba(80,60,0,0.2)',
    },
    bpm: 125,
    unlocked: false,
    summary: 'Deep veins · Ore extraction',
  },
  {
    id: 'desert',
    name: 'Neon Desert',
    gridWidth: 24,
    gridHeight: 20,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.32, y: 0.3 },
    lanes: [
      { points: [{ x: 0.04, y: 0.15 }, { x: 0.25, y: 0.75 }, { x: 0.45, y: 0.35 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.04, y: 0.85 }, { x: 0.25, y: 0.25 }, { x: 0.45, y: 0.65 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#080604',
      primary: '#ffee44',
      glow: '#ddcc22',
      accent: '#fff088',
      grid: 'rgba(80,70,20,0.2)',
    },
    bpm: 130,
    unlocked: false,
    summary: 'Sand motes · Winding routes',
  },
  {
    id: 'null',
    name: 'Null Signal',
    gridWidth: 20,
    gridHeight: 20,
    core: { x: 0.5, y: 0.5 },
    towerStart: { x: 0.5, y: 0.5 },
    lanes: [
      { points: [{ x: 0.04, y: 0.04 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.04 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.04, y: 0.96 }, { x: 0.5, y: 0.5 }] },
      { points: [{ x: 0.96, y: 0.96 }, { x: 0.5, y: 0.5 }] },
    ],
    theme: {
      bg: '#020202',
      primary: '#446688',
      glow: '#334466',
      accent: '#668899',
      grid: 'rgba(40,50,60,0.15)',
    },
    bpm: 60,
    unlocked: false,
    secret: true,
    summary: 'Unknown signal · Data corruption',
  },
];
