import React, { useState } from 'react';
import { formatCurrency, formatBaht } from '../utils';
import { Shield, Sliders, TrendingUp, HelpCircle, ArrowRight, Target, RotateCcw } from 'lucide-react';

export default function RiskPage() {
  // Buy Side
  const [buyPrice, setBuyPrice] = useState<number>(1000);
  const [buyFee, setBuyFee] = useState<number>(2.0);

  // Sell Side
  const [sellPrice, setSellPrice] = useState<number>(1250);
  const [sellFee, setSellFee] = useState<number>(5.0);

  // Income Planner
  const [targetProfit, setTargetProfit] = useState<number>(50000); // Default 50k Baht target
  const [holdPeriod, setHoldPeriod] = useState<number>(8); // Default 8 days hold

  // Conversions & Math
  const usdToThb = 36.5; // Constant exchange rate for pristine local accuracy

  const totalBuyFee = buyPrice * (buyFee / 100);
  const trueCostUsd = buyPrice + totalBuyFee;
  const trueCostThb = trueCostUsd * usdToThb;

  const totalSellFee = sellPrice * (sellFee / 100);
  const netReceivedUsd = sellPrice - totalSellFee;
  const netReceivedThb = netReceivedUsd * usdToThb;

  const netProfitUsd = netReceivedUsd - trueCostUsd;
  const netProfitThb = netProfitUsd * usdToThb;
  const roiPct = trueCostUsd > 0 ? (netProfitUsd / trueCostUsd) * 100 : 0;

  // Break-even formula
  const breakEvenPrice = sellFee < 100 ? trueCostUsd / (1 - (sellFee / 100)) : 0;

  // Planner Outputs
  const itemsToSellPerMonth = netProfitThb > 0 ? Math.ceil(targetProfit / netProfitThb) : 0;
  const capitalNeededThb = itemsToSellPerMonth * trueCostThb;
  const rotationsPerMonth = holdPeriod > 0 ? 30 / holdPeriod : 0;
  const workingCapitalThb = rotationsPerMonth > 0 ? capitalNeededThb / rotationsPerMonth : 0;

  return (
    <div className="space-y-6">
      {/* Visual CRT Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#938ea1] font-mono text-[10px] mb-1">
            <span>HQ</span>
            <span className="text-[12px]">&gt;</span>
            <span className="text-[#EF4444] uppercase font-bold">Risk Management (บริหารความเสี่ยง)</span>
          </div>
          <h2 className="font-sans text-xl font-bold text-white tracking-tight">Risk & ROI Analyzer</h2>
        </div>
        <div className="bg-[#14121b] border border-[#484555] px-4 py-1.5 flex items-center gap-2.5 rounded">
          <Shield className="w-4 h-4 text-[#F59E0B] animate-pulse" />
          <span className="font-mono text-xs text-[#e6e0ee]">VOLATILITY INDEX: LOW</span>
        </div>
      </div>

      {/* Main Dual Side Configuration Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        
        {/* Left Side: CSFLOAT Buy Side */}
        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-5 relative overflow-hidden rounded shadow-lg">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#7c5cfc]" />
          <h3 className="font-sans text-sm font-bold text-[#cabeff] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span className="text-base">🛒</span> ฝั่งซื้อ — CSFLOAT
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] text-gray-400 font-bold mb-1.5">ราคาซื้อสินค้า (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#7c5cfc]">$</span>
                <input 
                  type="number" 
                  value={buyPrice} 
                  onChange={e => setBuyPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0F1117] border-2 border-[#484555] rounded text-lg font-bold font-mono pl-7 pr-3 py-2 text-white focus:border-[#7c5cfc] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center font-mono text-[10px] text-gray-400 font-bold mb-1.5">
                <span>ค่าธรรมเนียมผู้ซื้อ (CSFLOAT Buyer Fee)</span>
                <span className="text-[#7c5cfc] text-xs">{buyFee.toFixed(1)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.5" 
                value={buyFee} 
                onChange={e => setBuyFee(parseFloat(e.target.value))}
                className="w-full accent-[#7c5cfc] h-1.5 bg-black rounded"
              />
            </div>

            <div className="bg-black/30 border border-[#484555]/40 p-4 rounded font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">ราคาป้ายสินค้า (Listed Price):</span>
                <span className="text-white font-bold">{formatCurrency(buyPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">รวมค่าธรรมเนียมระบบ (Fee Total):</span>
                <span className="text-[#7c5cfc] font-bold">+{formatCurrency(totalBuyFee)}</span>
              </div>
              <div className="border-t border-[#484555]/30 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-gray-300">ต้นทุนจริง (True Cost USD):</span>
                <span className="text-base font-bold text-white">{formatCurrency(trueCostUsd)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#c9c4d8]/60 italic">
                <span>แปลงเป็นเงินบาท (THB @ {usdToThb}):</span>
                <span>{formatBaht(trueCostThb)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: CSGOEMPIRE Sell Side */}
        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-5 relative overflow-hidden rounded shadow-lg">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#22C55E]" />
          <h3 className="font-sans text-sm font-bold text-[#22C55E] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span className="text-base">💰</span> ฝั่งขาย — CSGOEMPIRE
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] text-gray-400 font-bold mb-1.5">ราคาขายสินค้า (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#22C55E]">$</span>
                <input 
                  type="number" 
                  value={sellPrice} 
                  onChange={e => setSellPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#0F1117] border-2 border-[#484555] rounded text-lg font-bold font-mono pl-7 pr-3 py-2 text-white focus:border-[#22C55E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center font-mono text-[10px] text-gray-400 font-bold mb-1.5">
                <span>ค่าธรรมเนียมผู้ขาย (CSGOEmpire Seller Fee)</span>
                <span className="text-[#22C55E] text-xs">{sellFee.toFixed(1)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15" 
                step="0.5" 
                value={sellFee} 
                onChange={e => setSellFee(parseFloat(e.target.value))}
                className="w-full accent-[#22C55E] h-1.5 bg-black rounded"
              />
            </div>

            <div className="bg-black/30 border border-[#484555]/40 p-4 rounded font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">ราคาขายตั้งหน้าร้าน (Listed Sell):</span>
                <span className="text-white font-bold">{formatCurrency(sellPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">หักค่าบริการแพลตฟอร์ม (Fee Total):</span>
                <span className="text-[#EF4444] font-bold">-{formatCurrency(totalSellFee)}</span>
              </div>
              <div className="border-t border-[#484555]/30 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-gray-300">รายรับสุทธิ (Net Received USD):</span>
                <span className="text-base font-bold text-white">{formatCurrency(netReceivedUsd)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#c9c4d8]/60 italic">
                <span>แปลงเป็นเงินบาท (THB @ {usdToThb}):</span>
                <span>{formatBaht(netReceivedThb)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Central Interactive Analysis Summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Profit */}
        <div className="bg-[#1A1D27] border-2 border-[#484555] p-4 text-center rounded">
          <p className="font-mono text-[10px] text-gray-400 font-bold uppercase">NET PROFIT (USD)</p>
          <p className={`text-xl font-bold font-mono mt-1 ${netProfitUsd >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {netProfitUsd >= 0 ? '+' : ''}{formatCurrency(netProfitUsd)}
          </p>
        </div>

        {/* Card 2: Profit Baht */}
        <div className="bg-[#1A1D27] border-2 border-[#484555] p-4 text-center rounded">
          <p className="font-mono text-[10px] text-gray-400 font-bold uppercase">NET PROFIT (THB)</p>
          <p className={`text-xl font-bold font-mono mt-1 ${netProfitThb >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {netProfitThb >= 0 ? '+' : ''}{formatBaht(netProfitThb)}
          </p>
        </div>

        {/* Card 3: ROI */}
        <div className="bg-[#1A1D27] border-2 border-[#484555] p-4 text-center rounded">
          <p className="font-mono text-[10px] text-gray-400 font-bold uppercase">ESTIMATED ROI (%)</p>
          <p className={`text-xl font-bold font-mono mt-1 ${netProfitUsd >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {netProfitUsd >= 0 ? '+' : ''}{roiPct.toFixed(2)}%
          </p>
        </div>

        {/* Card 4: Break Even */}
        <div className="bg-[#1A1D27] border-2 border-[#484555] p-4 text-center rounded">
          <p className="font-mono text-[10px] text-gray-400 font-bold uppercase">⚖ Break-even Price</p>
          <p className="text-xl font-bold font-mono text-[#F59E0B] mt-1">
            {formatCurrency(breakEvenPrice)}
          </p>
        </div>

      </div>

      {/* Break Even Info Banner */}
      <div className="bg-[#1A1D27]/90 border border-[#F59E0B]/30 p-3.5 text-xs font-mono text-gray-300 flex items-center gap-3 rounded">
        <HelpCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 animate-pulse" />
        <div>
          <span className="font-bold text-[#F59E0B]">ราคาขายขั้นต่ำเพื่อไม่ขาดทุน: </span>
          คุณต้องลงประกาศขายสกินนี้ในราคาอย่างน้อย <span className="text-[#F59E0B] font-bold">{formatCurrency(breakEvenPrice)}</span> เพื่อให้รายรับหักลบค่าธรรมเนียมกลับมาเท่าทุนพอดี
        </div>
      </div>

      {/* Monthly Income Planner */}
      <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-5 rounded shadow-lg relative">
        <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#F59E0B] text-[#32009a] font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-[#484555]">
          STRATEGY GENERATOR
        </div>
        <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#F59E0B]" /> Monthly Income Planner (วางแผนรายได้รายเดือน)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block font-mono text-[10px] text-gray-400 font-bold mb-1.5">เป้าหมายกำไร/เดือน (บาท)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#F59E0B]">฿</span>
              <input 
                type="number" 
                step="5000"
                value={targetProfit} 
                onChange={e => setTargetProfit(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#0F1117] border border-[#484555] rounded font-bold font-mono pl-7 pr-3 py-1.5 text-white focus:border-[#F59E0B] focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] text-gray-400 font-bold mb-1.5">ระยะเวลาถือครองเฉลี่ย (วัน)</label>
            <div className="relative">
              <input 
                type="number" 
                value={holdPeriod} 
                onChange={e => setHoldPeriod(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0F1117] border border-[#484555] rounded font-bold font-mono px-3 py-1.5 text-white focus:border-[#F59E0B] focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">วัน</span>
            </div>
          </div>
        </div>

        {/* Actionable Strategic Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#14121b] border border-[#484555] p-4 text-center rounded">
            <span className="font-mono text-[10px] text-gray-400">ชิ้นที่ต้องขาย/เดือน</span>
            <p className="text-xl font-bold font-mono text-white mt-1.5">{itemsToSellPerMonth} ชิ้น</p>
            <span className="text-[9px] text-[#22C55E] mt-1 block">เฉลี่ย 1 ชิ้น ทุก {Math.max(1, Math.round(30 / Math.max(1, itemsToSellPerMonth)))} วัน</span>
          </div>

          <div className="bg-[#14121b] border border-[#484555] p-4 text-center rounded">
            <span className="font-mono text-[10px] text-gray-400">ทุนหมุนเวียนทั้งหมด</span>
            <p className="text-xl font-bold font-mono text-[#F59E0B] mt-1.5">{formatBaht(capitalNeededThb)}</p>
            <span className="text-[9px] text-gray-500 mt-1 block">ทุนรวมที่ใช้ซื้อสินค้าในระบบ</span>
          </div>

          <div className="bg-[#14121b] border border-[#484555] p-4 text-center rounded">
            <span className="font-mono text-[10px] text-gray-400">ทุนที่ใช้จริงในการหมุนรอบ</span>
            <p className="text-xl font-bold font-mono text-[#cabeff] mt-1.5">{formatBaht(workingCapitalThb)}</p>
            <span className="text-[9px] text-[#cabeff]/70 mt-1 block">รอบหมุนเวียน {rotationsPerMonth.toFixed(1)} รอบ/เดือน</span>
          </div>
        </div>

      </div>
    </div>
  );
}
