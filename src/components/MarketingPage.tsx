import React, { useState } from 'react';
import { Megaphone, Rocket, Heart, Smile, Users, Download, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function MarketingPage() {
  const [campaignProgress, setCampaignProgress] = useState({
    tuna: 82,
    yarn: 45,
    catnip: 15
  });

  const handleCampaignClick = (key: 'tuna' | 'yarn' | 'catnip') => {
    setCampaignProgress(prev => {
      const current = prev[key];
      const next = current >= 100 ? 10 : current + 15;
      return { ...prev, [key]: Math.min(next, 100) };
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual CRT Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Header section with breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#938ea1] font-mono text-[10px] mb-1">
            <span>HQ</span>
            <span className="text-[12px]">&gt;</span>
            <span className="text-[#FF61D2] uppercase font-bold">Marketing Strategy (แผนกการตลาด)</span>
          </div>
          <h2 className="font-sans text-xl font-bold text-white tracking-tight">Marketing Command Center</h2>
        </div>
        <div className="bg-[#0f0d16] border border-[#484555] px-4 py-2 flex items-center gap-3 rounded">
          <span className="w-2 h-2 rounded-full bg-[#FF61D2] animate-pulse"></span>
          <span className="font-mono text-xs text-[#c9c4d8] uppercase tracking-wider">Real-time Data Stream Enabled</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat 1: Total Engagement */}
        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 flex items-center gap-4 rounded shadow-[0_0_15px_rgba(255,97,210,0.1)]">
          <div className="bg-[#2D1B4E] p-3 border-2 border-[#FF61D2] rounded">
            <Smile className="text-[#FF61D2] w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#c9c4d8] uppercase font-bold">Total Engagement</p>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-lg font-bold text-white">2.4M Clicks</span>
              <span className="font-mono text-xs text-[#22C55E]">+12.4%</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Active Campaigns */}
        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 flex items-center gap-4 rounded">
          <div className="bg-[#2D1B4E] p-3 border-2 border-[#cabeff] rounded">
            <Rocket className="text-[#cabeff] w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#c9c4d8] uppercase font-bold">Active Campaigns</p>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-lg font-bold text-white">4 Live Missions</span>
              <span className="font-mono text-xs text-[#cabeff]">In Orbit</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Brand Sentiment */}
        <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 flex items-center gap-4 rounded">
          <div className="bg-[#2D1B4E] p-3 border-2 border-[#F59E0B] rounded">
            <Users className="text-[#F59E0B] w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#c9c4d8] uppercase font-bold">Brand Sentiment</p>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-lg font-bold text-white">98% Purr-fect</span>
              <span className="font-mono text-[10px] text-[#F59E0B] flex items-center gap-0.5">★★★★★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Campaign Mission Board */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] rounded overflow-hidden shadow-lg">
            <div className="bg-[#1A1D27] px-4 py-3 border-b-2 border-[#484555] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone className="text-[#FF61D2] w-4 h-4" />
                <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider">Campaign Mission Board</h3>
              </div>
              <span className="font-mono text-[9px] bg-[#FF61D2]/20 text-[#FF61D2] px-2 py-0.5 rounded font-bold border border-[#FF61D2]/30">PRIORITY: HIGH</span>
            </div>
            
            <div className="p-4 space-y-4">
              
              {/* Campaign 1 */}
              <div 
                onClick={() => handleCampaignClick('tuna')}
                className="p-4 bg-[#1c1a24] border-2 border-[#484555] rounded cursor-pointer hover:border-[#FF61D2] transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-sans text-base font-bold text-white">Project Tuna Delish</h4>
                    <p className="text-[#c9c4d8]/60 font-mono text-[11px]">Global Gourmet Sourcing Awareness</p>
                  </div>
                  <span className="bg-[#22C55E]/15 text-[#22C55E] px-2 py-1 font-mono text-[10px] border border-[#22C55E]/30 rounded">
                    {campaignProgress.tuna === 100 ? 'COMPLETE' : 'RUNNING'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[10px] text-gray-400 uppercase">
                    <span>Completion progress (Click to iterate)</span>
                    <span className="text-[#FF61D2] font-bold">{campaignProgress.tuna}%</span>
                  </div>
                  <div className="h-4 bg-black/60 border border-[#484555] p-0.5 rounded overflow-hidden">
                    <div 
                      className="h-full bg-[#FF61D2] transition-all duration-300 shadow-[0_0_8px_rgba(255,97,210,0.8)]"
                      style={{ width: `${campaignProgress.tuna}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Campaign 2 */}
              <div 
                onClick={() => handleCampaignClick('yarn')}
                className="p-4 bg-[#1c1a24] border-2 border-[#484555] rounded cursor-pointer hover:border-[#FF61D2] transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-sans text-base font-bold text-white">Viral Yarn Video</h4>
                    <p className="text-[#c9c4d8]/60 font-mono text-[11px]">Social Media Dominance Strategy</p>
                  </div>
                  <span className="bg-[#cabeff]/15 text-[#cabeff] px-2 py-1 font-mono text-[10px] border border-[#cabeff]/30 rounded">
                    {campaignProgress.yarn === 100 ? 'COMPLETE' : 'OPTIMIZING'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[10px] text-gray-400 uppercase">
                    <span>Completion progress (Click to iterate)</span>
                    <span className="text-[#cabeff] font-bold">{campaignProgress.yarn}%</span>
                  </div>
                  <div className="h-4 bg-black/60 border border-[#484555] p-0.5 rounded overflow-hidden">
                    <div 
                      className="h-full bg-[#cabeff] transition-all duration-300 shadow-[0_0_8px_rgba(202,190,255,0.8)]"
                      style={{ width: `${campaignProgress.yarn}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Campaign 3 */}
              <div 
                onClick={() => handleCampaignClick('catnip')}
                className="p-4 bg-[#1c1a24] border-2 border-[#484555] rounded cursor-pointer hover:border-[#FF61D2] transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-sans text-base font-bold text-white">Influencer Catnip</h4>
                    <p className="text-[#c9c4d8]/60 font-mono text-[11px]">PR Outreach to Level 100 Pets</p>
                  </div>
                  <span className="bg-[#F59E0B]/15 text-[#F59E0B] px-2 py-1 font-mono text-[10px] border border-[#F59E0B]/30 rounded">
                    {campaignProgress.catnip === 100 ? 'ACTIVE' : 'ON HOLD'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[10px] text-gray-400 uppercase">
                    <span>Completion progress (Click to iterate)</span>
                    <span className="text-[#F59E0B] font-bold">{campaignProgress.catnip}%</span>
                  </div>
                  <div className="h-4 bg-black/60 border border-[#484555] p-0.5 rounded overflow-hidden">
                    <div 
                      className="h-full bg-[#F59E0B] transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      style={{ width: `${campaignProgress.catnip}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Assets */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Social Analytics Card */}
          <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-4 rounded shadow-lg">
            <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FF61D2]" /> Social Analytics
            </h3>
            
            <div className="space-y-5">
              {/* Cat-stagram */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs text-gray-300">Cat-stagram</span>
                  <span className="font-mono text-xs text-[#22C55E]">+8.5k clicks/hr</span>
                </div>
                {/* Bar chart simulation */}
                <div className="flex items-end gap-1.5 h-16 bg-[#0F1117] p-2 border border-[#484555]/50 rounded">
                  <div className="w-full bg-[#FF61D2]/20 h-[30%] hover:bg-[#FF61D2] rounded transition-all" />
                  <div className="w-full bg-[#FF61D2]/20 h-[55%] hover:bg-[#FF61D2] rounded transition-all" />
                  <div className="w-full bg-[#FF61D2]/20 h-[45%] hover:bg-[#FF61D2] rounded transition-all" />
                  <div className="w-full bg-[#FF61D2]/20 h-[80%] hover:bg-[#FF61D2] rounded transition-all" />
                  <div className="w-full bg-[#FF61D2]/20 h-[70%] hover:bg-[#FF61D2] rounded transition-all" />
                  <div className="w-full bg-[#FF61D2]/20 h-[60%] hover:bg-[#FF61D2] rounded transition-all" />
                  <div className="w-full bg-[#FF61D2] h-[100%] rounded shadow-[0_0_8px_#FF61D2]" />
                </div>
              </div>

              {/* Meow-tube */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs text-gray-300">Meow-tube</span>
                  <span className="font-mono text-xs text-[#22C55E]">+22.1k views/hr</span>
                </div>
                {/* Line chart simulation */}
                <div className="relative h-16 bg-[#0F1117] p-1 border border-[#484555]/50 rounded overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path
                      d="M 0,35 Q 20,10 40,28 T 80,12 T 100,5"
                      fill="none"
                      stroke="#FF61D2"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 0,35 Q 20,10 40,28 T 80,12 T 100,5 L 100,40 L 0,40 Z"
                      fill="rgba(255, 97, 210, 0.15)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Department Asset Preview */}
          <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] rounded overflow-hidden shadow-lg">
            <div className="bg-[#201e28] px-4 py-2 border-b border-[#484555] flex justify-between items-center">
              <span className="font-mono text-[10px] font-bold text-gray-300">LATEST MEDIA ASSET</span>
              <Maximize2 className="w-3.5 h-3.5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <div className="p-4">
              <div className="aspect-video bg-black border-2 border-[#484555] overflow-hidden group cursor-pointer relative rounded">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="Robot Cat Waiting Tuna"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM2gNhdZLvK6bnpEw16EqpW00XEdPQQxRFCuv6ciHgc7pHUe7DPfcJRLxRLNmI261PKKfL_xNXZCnvpRP-IPgTn0cFd391Og-BGWDcrHQ8mp_LA6VoglVGb2Kkd91BMoayoobJOIcBQk48VIcvK0C3tPZf3-jnsFkRjjHh1DKBdOi8xdBAHaNrwres33Uwje7T2cc4oI4V-Dorb5q5V6kb4ZJr_eNXwagyaCsbxAxqQHESMPXUXNSF0I9nOcRogGj3ui4fGiUYfDAo"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="text-white w-12 h-12" />
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <p className="font-mono text-[10px] text-gray-400">FILE: TUNA_PROMO_V1.MP4</p>
                <button 
                  onClick={() => alert("ระบบได้เตรียมไฟล์ดาวน์โหลด (TUNA_PROMO_V1.MP4) ความละเอียด Full HD เรียบร้อย!")}
                  className="text-[#FF61D2] hover:text-white font-mono text-[10px] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> DOWNLOAD_RAW
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function PlayCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}
