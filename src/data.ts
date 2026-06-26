import { Trade, SystemLog, Agent, Mission } from './types';

export const INITIAL_TRADES: Trade[] = [
  {
    id: 't1',
    itemName: 'M9 Bayonet | Gamma Doppler',
    wear: 'Factory New (0.007)',
    type: 'knife',
    buyDate: '2026-06-24',
    targetSellDate: '2026-07-02',
    buyPrice: 1150.00,
    buyFeePct: 1.5,
    sellPrice: 1480.00,
    sellFeePct: 5.0,
    status: 'sold'
  },
  {
    id: 't2',
    itemName: 'Specialist Gloves | Crimson Kimono',
    wear: 'Field-Tested (0.15)',
    type: 'gloves',
    buyDate: '2026-06-02',
    targetSellDate: '2026-07-15',
    buyPrice: 920.00,
    buyFeePct: 1.0,
    sellPrice: 1150.00,
    sellFeePct: 5.0,
    status: 'holding'
  },
  {
    id: 't3',
    itemName: 'AK-47 | Empress',
    wear: 'Minimal Wear',
    type: 'rifle',
    buyDate: '2026-06-15',
    targetSellDate: '2026-06-24', // Target passed -> overdue
    buyPrice: 85.00,
    buyFeePct: 1.5,
    sellPrice: 92.00,
    sellFeePct: 10.0,
    status: 'overdue'
  },
  {
    id: 't4',
    itemName: 'Desert Eagle | Printstream',
    wear: 'Field-Tested (0.20)',
    type: 'pistol',
    buyDate: '2026-06-20',
    targetSellDate: '2026-07-10',
    buyPrice: 65.00,
    buyFeePct: 2.0,
    sellPrice: null,
    sellFeePct: 5.0,
    status: 'holding'
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    time: '14:22',
    department: 'Marketing',
    message: 'Campaign "YARN_DOMINATION" updated: +150K clicks from Meow-tube.',
    level: 'success'
  },
  {
    time: '14:18',
    department: 'Marketing',
    message: 'Sentiment analysis complete: 98% positive on Cat-stagram.',
    level: 'success'
  },
  {
    time: '14:05',
    department: 'Risk',
    message: 'Warning: Catnip prices fluctuating. AD adjustment needed.',
    level: 'warn'
  },
  {
    time: '13:55',
    department: 'Operations',
    message: 'AI_KITTY bot deployed to X-Feeder channels.',
    level: 'info'
  },
  {
    time: '13:30',
    department: 'Finance',
    message: 'Revenue sync: Marketing spend ROI at 4.2x per paw.',
    level: 'info'
  },
  {
    time: '13:12',
    department: 'Command',
    message: 'New mission: PROJECT_CRUNCHY_TREATS initialized.',
    level: 'info'
  },
  {
    time: '12:00',
    department: 'System',
    message: 'Firmware update KITTY-OS v2.4 stable.',
    level: 'success'
  },
  {
    time: '11:15',
    department: 'Risk',
    message: 'Intruder detected (Laser Pointer) in Sector 2.',
    level: 'error'
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'Tactical Tuxedo',
    role: 'Lobby Security Head',
    status: 'idle',
    avatarType: 'tuxedo'
  },
  {
    id: 'a2',
    name: 'Data Ginger',
    role: 'Chief Data Analyst',
    status: 'idle',
    avatarType: 'ginger'
  },
  {
    id: 'a3',
    name: 'Stealth Calico',
    role: 'Special Recon Agent',
    status: 'on_mission',
    avatarType: 'calico'
  },
  {
    id: 'a4',
    name: 'Heavy Maine Coon',
    role: 'Logistics Supervisor',
    status: 'idle',
    avatarType: 'coon'
  },
  {
    id: 'a5',
    name: 'Grumpy Persy',
    role: 'Chief Complain Officer (ขี้โวยวาย)',
    status: 'idle',
    avatarType: 'grumpy'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Mission: Nap Optimization',
    objective: 'Maximize daily feline sleeping efficiency in Central Lobby.',
    agent: 'Tactical Tuxedo',
    priority: 'CRITICAL',
    payout: 1500,
    deadline: '02h 45m',
    progress: 75
  },
  {
    id: 'm2',
    title: 'Mission: Yarn Tangle Resolution',
    objective: 'Safely de-tangle data cables and fiber ropes in Data Core.',
    agent: 'Data Ginger',
    priority: 'HIGH',
    payout: 2200,
    deadline: '05h 12m',
    progress: 40
  },
  {
    id: 'm3',
    title: 'Mission: Stealth Stretch',
    objective: 'Instruct yoga routines and quiet flexibility poses in Zen Dojo.',
    agent: 'Stealth Calico',
    priority: 'MEDIUM',
    payout: 800,
    deadline: '14h 22m',
    progress: 90
  }
];

// Mock Google Sheet published CSV content
// Format: Item Name, Wear/Details, Type (knife/gloves/rifle/pistol/other), Buy Date, Target Sell Date, Buy Price, Buy Fee %, Sell Price, Sell Fee %, Status
export const DEMO_SHEET_CSV = `Item Name,Wear/Details,Type,Buy Date,Target Sell Date,Buy Price,Buy Fee %,Sell Price,Sell Fee %,Status
Karambit | Doppler,Factory New (0.01),knife,2026-06-25,2026-07-05,1850.00,2.0,2250.00,5.0,sold
AWP | Dragon Lore,Minimal Wear (0.09),rifle,2026-06-10,2026-07-01,9500.00,1.5,12000.00,5.0,holding
Sport Gloves | Pandora's Box,Field-Tested (0.24),gloves,2026-06-01,2026-06-20,3800.00,1.0,4100.00,5.0,overdue
Glock-18 | Fade,Factory New (0.03),pistol,2026-06-18,2026-07-12,980.00,2.0,,5.0,holding
Butterfly Knife | Marble Fade,Factory New (0.009),knife,2026-06-22,2026-07-08,2100.00,1.5,2450.00,5.0,sold
M4A1-S | Printstream,Factory New,rifle,2026-06-24,2026-07-15,380.00,2.0,,5.0,holding`;
