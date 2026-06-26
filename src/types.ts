export interface Trade {
  id: string;
  itemName: string;
  wear: string;
  type: 'knife' | 'gloves' | 'rifle' | 'pistol' | 'other';
  buyDate: string; // YYYY-MM-DD
  targetSellDate: string; // YYYY-MM-DD
  buyPrice: number;
  buyFeePct: number;
  sellPrice: number | null;
  sellFeePct: number;
  status: 'holding' | 'sold' | 'overdue';
}

export type ActiveTab = 'command' | 'marketing' | 'finance' | 'risk' | 'operations' | 'sheets' | 'members';

export interface SystemLog {
  time: string;
  department: 'Command' | 'Marketing' | 'Finance' | 'Risk' | 'Operations' | 'System';
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'on_mission';
  avatarType: 'tuxedo' | 'ginger' | 'calico' | 'coon' | 'grumpy';
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  agent: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  payout: number;
  deadline: string;
  progress: number;
}
