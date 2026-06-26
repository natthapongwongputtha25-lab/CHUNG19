import React, { useState } from 'react';
import { Trade } from '../types';
import { formatCurrency, formatBaht, formatThaiDate } from '../utils';
import { Plus, Sliders, Database, Calculator, ArrowRight, ShieldAlert, Trash, Check, X } from 'lucide-react';

interface FinancePageProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onUpdateTrade: (id: string, updated: Partial<Trade>) => void;
  onDeleteTrade: (id: string) => void;
  onSimulateTrade: (buyPrice: number, sellPrice: number) => void;
}

export default function FinancePage({ trades, onAddTrade, onUpdateTrade, onDeleteTrade, onSimulateTrade }: FinancePageProps) {
  const [filter, setFilter] = useState<'all' | 'holding' | 'sold' | 'overdue'>('all');
  
  // Custom Slider / Config Fees
  const [buyFee, setBuyFee] = useState<number>(2.0);
  const [sellFee, setSellFee] = useState<number>(5.0);

  // Calculator State
  const [calcBuy, setCalcBuy] = useState<string>('100.00');
  const [calcSell, setCalcSell] = useState<string>('125.00');
  const [calcBuyFee, setCalcBuyFee] = useState<number>(2.0);
  const [calcSellFee, setCalcSellFee] = useState<number>(5.0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formWear, setFormWear] = useState('Factory New (0.01)');
  const [formType, setFormType] = useState<Trade['type']>('knife');
  const [formCost, setFormCost] = useState('');
  const [formSell, setFormSell] = useState('');
  const [formBuyDate, setFormBuyDate] = useState('2026-06-26');
  const [formSellDate, setFormSellDate] = useState('2026-07-10');
  const [formStatus, setFormStatus] = useState<Trade['status']>('holding');

  // Compute Metrics dynamically
  const filteredTrades = trades.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const holdingSkins = trades.filter(t => t.status === 'holding' || t.status === 'overdue');
  const soldSkins = trades.filter(t => t.status === 'sold');

  const portfolioValue = holdingSkins.reduce((sum, t) => sum + t.buyPrice, 0);
  
  // Net Profit: Sell*(1 - fee) - Buy*(1 + fee)
  const netProfit = soldSkins.reduce((sum, t) => {
    const trueCost = t.buyPrice * (1 + buyFee / 100);
    const netReceive = (t.sellPrice || 0) * (1 - sellFee / 100);
    return sum + (netReceive - trueCost);
  }, 0);

  const avgRoi = soldSkins.length 
    ? soldSkins.reduce((sum, t) => {
        const trueCost = t.buyPrice * (1 + buyFee / 100);
        const profit = (t.sellPrice || 0) * (1 - sellFee / 100) - trueCost;
        return sum + (trueCost > 0 ? (profit / trueCost) * 100 : 0);
      }, 0) / soldSkins.length
    : 0;

  // Calculator Math
  const bPrice = parseFloat(calcBuy) || 0;
  const sPrice = parseFloat(calcSell) || 0;
  
  const buyFeeAmt = bPrice * (calcBuyFee / 100);
  const trueCost = bPrice + buyFeeAmt;

  const sellFeeAmt = sPrice * (calcSellFee / 100);
  const netReceive = sPrice - sellFeeAmt;

  const calcNetProfit = netReceive - trueCost;
  const calcEstimatedRoi = trueCost > 0 ? (calcNetProfit / trueCost) * 100 : 0;
  const breakEvenPrice = calcSellFee < 100 ? trueCost / (1 - calcSellFee / 100) : 0;

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingTrade(null);
    setFormName('');
    setFormWear('Factory New (0.01)');
    setFormType('knife');
    setFormCost('100.00');
    setFormSell('');
    setFormBuyDate(new Date().toISOString().split('T')[0]);
    setFormSellDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setFormStatus('holding');
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setFormName(trade.itemName);
    setFormWear(trade.wear);
    setFormType(trade.type);
    setFormCost(trade.buyPrice.toString());
    setFormSell(trade.sellPrice ? trade.sellPrice.toString() : '');
    setFormBuyDate(trade.buyDate);
    setFormSellDate(trade.targetSellDate);
    setFormStatus(trade.status);
    setIsModalOpen(true);
  };

  // Submit form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("กรุณากรอกชื่อสกิน");
      return;
    }

    const payload = {
      itemName: formName,
      wear: formWear,
      type: formType,
      buyDate: formBuyDate,
      targetSellDate: formSellDate,
      buyPrice: parseFloat(formCost) || 0,
      buyFeePct: buyFee,
      sellPrice: formSell ? parseFloat(formSell) : null,
      sellFeePct: sellFee,
      status: formStatus
    };

    if (editingTrade) {
      onUpdateTrade(editingTrade.id, payload);
    } else {
      onAddTrade(payload);
    }
    setIsModalOpen(false);
  };

  // Quick save calculation
  const handleSimulateToTrade = () => {
    onAddTrade({
      itemName: 'Simulated Skin Trade',
      wear: 'Field-Tested (Calculated)',
      type: 'other',
      buyDate: new Date().toISOString().split('T')[0],
      targetSellDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      buyPrice: bPrice,
      buyFeePct: calcBuyFee,
      sellPrice: sPrice,
      sellFeePct: calcSellFee,
      status: 'sold'
    });
    alert("จำลองการขาย และเพิ่มเข้ารายการเทรดสำเร็จ!");
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 border-t-4 border-t-[#7c5cfc] rounded shadow">
          <span className="text-[10px] font-mono text-[#c9c4d8]/60 uppercase font-bold">PORTFOLIO VALUE</span>
          <div className="text-xl font-bold text-[#cabeff] font-mono mt-1">{formatCurrency(portfolioValue)}</div>
          <div className="text-[10px] text-gray-400 mt-1">มูลค่าคลังสินค้าปัจจุบัน</div>
        </div>

        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 border-t-4 border-t-[#22C55E] rounded shadow">
          <span className="text-[10px] font-mono text-[#c9c4d8]/60 uppercase font-bold">NET PROFIT (FEES INCL.)</span>
          <div className={`text-xl font-bold font-mono mt-1 ${netProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">กำไรสุทธิหลังหักค่าธรรมเนียม</div>
        </div>

        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 border-t-4 border-t-[#F59E0B] rounded shadow">
          <span className="text-[10px] font-mono text-[#c9c4d8]/60 uppercase font-bold">AVG ROI PER SKIN</span>
          <div className="text-xl font-bold text-[#F59E0B] font-mono mt-1">+{avgRoi.toFixed(1)}%</div>
          <div className="text-[10px] text-gray-400 mt-1">อัตราผลตอบแทนเฉลี่ยต่อชิ้น</div>
        </div>

        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 border-t-4 border-t-[#60a5fa] rounded shadow">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#c9c4d8]/60 uppercase font-bold">
            <span>MONTHLY TARGET</span>
            <span className="text-[#60a5fa]">72%</span>
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">$2,000.00</div>
          <div className="h-1.5 bg-black/60 border border-[#484555] rounded-full overflow-hidden mt-1 p-0.5">
            <div className="h-full bg-[#60a5fa] rounded-full" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      {/* Global Slider Config Panel */}
      <div className="bg-[#1A1D27]/90 border border-[#484555] p-4 flex flex-wrap items-center justify-between gap-5 rounded">
        <span className="font-mono text-xs text-[#c9c4d8] font-bold flex items-center gap-1.5"><Sliders className="w-4 h-4 text-[#cabeff]" /> GLOBAL FEE SETTINGS</span>
        <div className="flex items-center gap-6 flex-wrap flex-1 md:justify-end">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">CSFloat (ซื้อ):</span>
            <input 
              type="range" 
              min="0" 
              max="10" 
              step="0.5" 
              value={buyFee} 
              onChange={e => setBuyFee(parseFloat(e.target.value))}
              className="accent-[#7c5cfc] h-1.5 w-24 bg-black rounded"
            />
            <span className="text-xs font-bold text-[#7c5cfc] font-mono w-8">{buyFee.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">CSGOEmpire (ขาย):</span>
            <input 
              type="range" 
              min="0" 
              max="15" 
              step="0.5" 
              value={sellFee} 
              onChange={e => setSellFee(parseFloat(e.target.value))}
              className="accent-[#22C55E] h-1.5 w-24 bg-black rounded"
            />
            <span className="text-xs font-bold text-[#22C55E] font-mono w-8">{sellFee.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Database list and calculator row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Trading log table */}
        <div className="xl:col-span-2 bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] flex flex-col h-[520px] rounded overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#484555] bg-black/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Database className="text-[#F59E0B] w-4 h-4" />
              <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider">SKIN TRADING LOG</h3>
              <span className="text-[10px] font-mono text-gray-400">// บันทึกรายการเทรด</span>
            </div>
            <button 
              onClick={handleOpenAdd}
              className="bg-[#cabeff] text-[#32009a] hover:brightness-110 font-mono text-[10px] font-bold px-3 py-1.5 flex items-center gap-1 rounded cursor-pointer transition-all active:translate-y-px"
            >
              <Plus className="w-3 h-3" /> NEW TRADE
            </button>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto bg-[#0F1117]/30">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#1A1D27] text-gray-400 border-b border-[#484555]/60 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider">SKIN NAME</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider">BUY DATE</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider">BUY (FEE INCL)</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider">SELL (FEE INCL)</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider">NET PROFIT</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider">STATUS</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#484555]/30">
                {filteredTrades.map((t, idx) => {
                  const trueBuyPrice = t.buyPrice * (1 + t.buyFeePct / 100);
                  const trueSellPrice = t.sellPrice ? t.sellPrice * (1 - t.sellFeePct / 100) : null;
                  const profitVal = trueSellPrice !== null ? trueSellPrice - trueBuyPrice : null;

                  return (
                    <tr key={t.id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-black/40 border border-[#484555]/60 flex items-center justify-center text-lg rounded">
                          {t.type === 'knife' ? '🔪' : t.type === 'gloves' ? '🧤' : t.type === 'rifle' ? '🔫' : t.type === 'pistol' ? '🔫' : '🎯'}
                        </div>
                        <div>
                          <div className="text-white font-bold text-xs">{t.itemName}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{t.wear}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-[11px]">{formatThaiDate(t.buyDate)}</td>
                      <td className="px-4 py-4">
                        <div className="text-white font-bold">{formatCurrency(t.buyPrice)}</div>
                        <div className="text-[9px] text-[#7c5cfc] font-bold">Fee: {t.buyFeePct}%</div>
                      </td>
                      <td className="px-4 py-4">
                        {t.sellPrice ? (
                          <>
                            <div className="text-[#F59E0B] font-bold">{formatCurrency(t.sellPrice)}</div>
                            <div className="text-[9px] text-[#22C55E] font-bold">Fee: {t.sellFeePct}%</div>
                          </>
                        ) : (
                          <span className="text-gray-500 italic">Holding...</span>
                        )}
                      </td>
                      <td className={`px-4 py-4 font-bold ${profitVal === null ? 'text-gray-500' : profitVal >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {profitVal !== null ? `${profitVal >= 0 ? '+' : ''}${formatCurrency(profitVal)}` : '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 border rounded-[2px] text-[10px] font-bold ${
                          t.status === 'sold' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/40' :
                          t.status === 'overdue' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40' :
                          'bg-[#7c5cfc]/10 text-[#7c5cfc] border-[#7c5cfc]/40'
                        }`}>
                          {t.status === 'sold' ? 'SOLD (ขายแล้ว)' : t.status === 'overdue' ? 'OVERDUE (หมดสัญญา)' : 'HOLDING (ถือครอง)'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => handleOpenEdit(t)}
                          className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
                        >
                          ✏
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Filter Footer */}
          <div className="p-3 border-t border-[#484555] bg-black/10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'holding', 'sold', 'overdue'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 font-mono text-[10px] font-bold rounded cursor-pointer border ${
                    filter === f 
                      ? 'bg-[#cabeff] text-[#32009a] border-[#cabeff]' 
                      : 'bg-black/40 text-gray-400 border-[#484555]/80 hover:text-white'
                  }`}
                >
                  {f === 'all' ? '☰ ALL TRADES' : f === 'holding' ? '📦 HOLDING' : f === 'sold' ? '✔ SOLD' : '▲ OVERDUE'}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] text-gray-400">{filteredTrades.length} ITEMS FOUND</span>
          </div>
        </div>

        {/* ROI Calculator Sidebar */}
        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-5 rounded overflow-hidden flex flex-col shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#484555] pb-3 mb-4">
            <Calculator className="text-[#cabeff] w-4.5 h-4.5" />
            <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider">ROI CALCULATOR</h3>
          </div>

          <div className="space-y-4 flex-1">
            {/* Purchase price input */}
            <div>
              <label className="block font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">PURCHASE PRICE (CSFLOAT)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c5cfc] font-bold font-mono">$</span>
                <input 
                  type="number" 
                  value={calcBuy} 
                  onChange={e => setCalcBuy(e.target.value)}
                  className="w-full bg-[#0F1117] border-2 border-[#484555] rounded text-lg font-bold font-mono pl-7 pr-3 py-1.5 focus:border-[#cabeff] focus:outline-none"
                />
              </div>
            </div>

            {/* Target Sell price input */}
            <div>
              <label className="block font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">TARGET SELL PRICE (EMPIRE)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F59E0B] font-bold font-mono">$</span>
                <input 
                  type="number" 
                  value={calcSell} 
                  onChange={e => setCalcSell(e.target.value)}
                  className="w-full bg-[#0F1117] border-2 border-[#484555] rounded text-lg font-bold font-mono pl-7 pr-3 py-1.5 focus:border-[#F59E0B] focus:outline-none"
                />
              </div>
            </div>

            {/* Sub Sliders */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 font-bold mb-1">
                  <span>CSFloat Buyer Fee</span>
                  <span className="text-[#7c5cfc]">{calcBuyFee.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="0.5" 
                  value={calcBuyFee} 
                  onChange={e => setCalcBuyFee(parseFloat(e.target.value))}
                  className="w-full accent-[#7c5cfc] h-1 bg-black rounded"
                />
              </div>
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 font-bold mb-1">
                  <span>CSGO Empire Seller Fee</span>
                  <span className="text-[#F59E0B]">{calcSellFee.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  step="0.5" 
                  value={calcSellFee} 
                  onChange={e => setCalcSellFee(parseFloat(e.target.value))}
                  className="w-full accent-[#F59E0B] h-1 bg-black rounded"
                />
              </div>
            </div>

            {/* Results Calculations Area */}
            <div className="bg-black/40 border border-[#484555]/50 p-3 rounded font-mono text-xs space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Cost:</span>
                <span className="text-white font-bold">{formatCurrency(trueCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payout (After Fee):</span>
                <span className="text-[#F59E0B] font-bold">{formatCurrency(netReceive)}</span>
              </div>
              <div className="border-t border-[#484555]/30 pt-1.5 mt-1.5 flex justify-between items-center">
                <span className="font-bold text-gray-300">NET PROFIT:</span>
                <span className={`text-base font-bold ${calcNetProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {calcNetProfit >= 0 ? '+' : ''}{formatCurrency(calcNetProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ESTIMATED ROI:</span>
                <span className={`font-bold ${calcNetProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {calcEstimatedRoi.toFixed(2)}%
                </span>
              </div>
            </div>

            <button 
              onClick={handleSimulateToTrade}
              className="w-full mt-2 py-3.5 bg-[#cabeff] text-[#32009a] font-sans font-bold text-xs uppercase shadow-[0_4px_0_0_#4918c8] hover:translate-y-px hover:shadow-[0_2px_0_0_#4918c8] active:translate-y-0.5 active:shadow-none transition-all rounded"
            >
              SIMULATE & ADD TO DB
            </button>
          </div>
        </div>

      </div>

      {/* NEW/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#1A1D27] border-2 border-[#484555] rounded-lg shadow-2xl p-6 w-full max-w-md relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#cabeff]" />
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-sans text-base font-bold text-[#cabeff] border-b border-[#484555] pb-3 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-[#cabeff]" />
              {editingTrade ? 'แก้ไข Trade Details' : 'เพิ่ม Trade รายการใหม่'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-gray-400 font-bold mb-1.5">ชื่อ Skin</label>
                <input 
                  type="text"
                  required
                  placeholder="เช่น M9 Bayonet | Gamma Doppler"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1.5">คุณภาพ / Float</label>
                  <input 
                    type="text"
                    required
                    placeholder="เช่น Factory New (0.01)"
                    value={formWear}
                    onChange={e => setFormWear(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1.5">ชนิดสกิน</label>
                  <select 
                    value={formType}
                    onChange={e => setFormType(e.target.value as Trade['type'])}
                    className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                  >
                    <option value="knife">🔪 Knife</option>
                    <option value="gloves">🧤 Gloves</option>
                    <option value="rifle">🔫 Rifle</option>
                    <option value="pistol">🔫 Pistol</option>
                    <option value="other">🎯 Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1.5">ราคาซื้อ ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={formCost}
                    onChange={e => setFormCost(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1.5">ราคาขาย ($) ถ้ามี</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="ยังไม่ขาย"
                    value={formSell}
                    onChange={e => setFormSell(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold mb-1.5">วันที่ซื้อ</label>
                  <input 
                    type="date"
                    required
                    value={formBuyDate}
                    onChange={e => setFormBuyDate(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold mb-1.5">วันที่ขาย/เป้าสัญญา</label>
                  <input 
                    type="date"
                    required
                    value={formSellDate}
                    onChange={e => setFormSellDate(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1.5">สถานะการเทรด</label>
                <select 
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value as Trade['status'])}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                >
                  <option value="holding">Holding (ถือครอง)</option>
                  <option value="sold">Sold (ขายแล้ว)</option>
                  <option value="overdue">Overdue (หมดสัญญา)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#484555] flex justify-end gap-2.5">
                {editingTrade && (
                  <button 
                    type="button"
                    onClick={() => {
                      if (confirm("คุณแน่ใจว่าต้องการลบรายการนี้?")) {
                        onDeleteTrade(editingTrade.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="bg-[#EF4444] hover:bg-[#EF4444]/80 text-white font-bold px-4 py-2 rounded flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Trash className="w-3.5 h-3.5" /> ลบข้อมูล
                  </button>
                )}
                <button 
                  type="submit"
                  className="bg-[#cabeff] hover:brightness-110 text-[#32009a] font-bold px-5 py-2 rounded cursor-pointer transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
