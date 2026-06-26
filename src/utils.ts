import { Trade } from './types';

/**
 * Robust CSV string parser that handles quotes and commas correctly
 */
export function parseCSV(csvText: string): Trade[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const trades: Trade[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by commas but respect quotes
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
    const values = matches.map(val => val.replace(/^"|"$/g, '').trim());

    if (values.length < 6) continue;

    const itemName = values[0] || 'Unknown Skin';
    const wear = values[1] || 'Field-Tested';
    
    // Type mapping
    let type: Trade['type'] = 'other';
    const rawType = (values[2] || '').toLowerCase();
    if (rawType.includes('knife') || rawType.includes('bayonet') || rawType.includes('karambit')) {
      type = 'knife';
    } else if (rawType.includes('glove')) {
      type = 'gloves';
    } else if (rawType.includes('rifle') || rawType.includes('ak') || rawType.includes('m4') || rawType.includes('awp')) {
      type = 'rifle';
    } else if (rawType.includes('pistol') || rawType.includes('glock') || rawType.includes('deagle')) {
      type = 'pistol';
    }

    const buyDate = values[3] || new Date().toISOString().split('T')[0];
    const targetSellDate = values[4] || new Date().toISOString().split('T')[0];
    const buyPrice = parseFloat(values[5]) || 0;
    const buyFeePct = parseFloat(values[6]) || 2.0;
    const sellPrice = values[7] ? parseFloat(values[7]) : null;
    const sellFeePct = parseFloat(values[8]) || 5.0;
    
    // Status mapping
    let status: Trade['status'] = 'holding';
    const rawStatus = (values[9] || '').toLowerCase().trim();
    if (rawStatus === 'sold' || rawStatus === 'ขายแล้ว') {
      status = 'sold';
    } else if (rawStatus === 'overdue' || rawStatus === 'หมดสัญญา' || rawStatus === 'ค้างชำระ') {
      status = 'overdue';
    } else {
      status = 'holding';
    }

    trades.push({
      id: `sheet-${i}-${Date.now()}`,
      itemName,
      wear,
      type,
      buyDate,
      targetSellDate,
      buyPrice,
      buyFeePct,
      sellPrice,
      sellFeePct,
      status
    });
  }

  return trades;
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
}

export function formatBaht(val: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(val).replace('THB', '฿');
}

export function formatThaiDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  } catch {
    return dateStr;
  }
}
