import React, { useState, useEffect, useRef } from 'react';
import { Trade, SystemLog, Agent, Mission } from '../types';
import { formatBaht } from '../utils';
import { 
  Terminal, 
  Users, 
  Send, 
  CheckCircle, 
  ShieldAlert, 
  Play, 
  Sparkles, 
  RefreshCw, 
  Mail, 
  AlertTriangle,
  UserCheck,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

interface CommandCenterProps {
  trades: Trade[];
  logs: SystemLog[];
  onAddLog: (msg: string, dept: SystemLog['department'], level: SystemLog['level']) => void;
  agents: Agent[];
  missions: Mission[];
  onDeployAgent: (missionId: string, agentName: string) => void;
  onUpdateMissionProgress: (missionId: string, progress: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'system' | 'ai';
  senderName: string;
  text: string;
  time: string;
  avatar?: string;
}

export default function CommandCenter({ 
  trades, 
  logs, 
  onAddLog, 
  agents, 
  missions, 
  onDeployAgent,
  onUpdateMissionProgress
}: CommandCenterProps) {
  
  // 1. Chat Room State & Setup
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('feline_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return [
      {
        id: 'c1',
        sender: 'ai',
        senderName: 'CEO Whiskers 🐾',
        text: 'ยินดีต้อนรับเอเจนต์ทุกท่านเข้าสู่ห้องความมั่นคงสูงสุดเนี้ยว! วันนี้สถานะกองกำลังพร้อมลุยตลาดสกินเต็มร้อย มีข้อสงสัยหรือแผนลับเรื่องใดพิมพ์คุยกันได้เลยนะเนี้ยว 😺',
        time: '12:00',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq'
      },
      {
        id: 'c2',
        sender: 'ai',
        senderName: 'Grumpy Persy 😼',
        text: 'โว้ยยยยยยยยยยย! ใครมาเปิดคอมพิวเตอร์สปริงแชทตอนนี้ห๊าาา!? ห้องเก็บเสบียงปลาทูน่ากระป๋องเหลือน้อยกว่าร้อยกล่องแล้วเนี่ยยย!! ปล่อยให้สายลับสเปรดชีตอย่างฉันปวดหลังอยู่นั่นแหละ ไม่คุยด้วยแล้วโว้ยยยยยยยย!!! 😤',
        time: '12:02',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTRjQu_AY4ENFxkmL00xmE5Tw5vPVE7fVavu8tsmCY3yGlwjF-2nClubDsKv9evPawooQ3d9F_odjTnfeYsKYYvh_qzNAj_rF6a_om2QRkqdNfN7PEX6ElbSAPxLMEk6DJbzhlRK_9Wm_DgbQuI_sTn5rgdZfa_SL5yNU7U-DEwrHPua86-Ts3egRj36Kb1lSY2HzHd1DKovUFqSKZK4wBvfOlWwhBV7e7igxvafG8_IjH5Idn4g5G8N-zs4aZuAUPb-fNERcfT0JO'
      }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Save chat to local storage
  useEffect(() => {
    localStorage.setItem('feline_chat_messages', JSON.stringify(chatMessages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // 2. Active / Ready Agent Counts based on REAL DATA
  const activeAgents = agents.filter(a => a.status === 'on_mission');
  const readyAgents = agents.filter(a => a.status === 'idle');

  // Deployment Helpers inside Command Center
  const [deployMissionId, setDeployMissionId] = useState<string>('');
  const [deployAgentName, setDeployAgentName] = useState<string>('');

  // 3. Dynamic Mission tracking with repeating updates every 10 seconds
  const [syncTick, setSyncTick] = useState(0);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 1500);

      // Randomly update progress of active missions
      const activeMissions = missions.filter(m => m.progress < 100 && m.agent !== 'Unassigned');
      if (activeMissions.length > 0) {
        const randomMission = activeMissions[Math.floor(Math.random() * activeMissions.length)];
        const increment = Math.floor(Math.random() * 5) + 3; // 3% to 7%
        const nextProgress = Math.min(randomMission.progress + increment, 100);
        
        onUpdateMissionProgress(randomMission.id, nextProgress);

        if (nextProgress >= 100) {
          // Mission Complete! Log it and release agent
          onAddLog(`MISSION COMPLETED: "${randomMission.title}" finished successfully by ${randomMission.agent}! Payout ฿${randomMission.payout.toLocaleString()} secure.`, 'Command', 'success');
          // Reset agent status to idle
          const savedAgents = localStorage.getItem('feline_agents');
          if (savedAgents) {
            try {
              const parsedAgents = JSON.parse(savedAgents) as Agent[];
              const updatedAgents = parsedAgents.map(a => a.name === randomMission.agent ? { ...a, status: 'idle' as const } : a);
              localStorage.setItem('feline_agents', JSON.stringify(updatedAgents));
              // Refresh window/state naturally or reload
            } catch {}
          }
        } else {
          onAddLog(`LOGISTICS DATA SYNC: Mission "${randomMission.title.split(': ')[1]}" progress updated to ${nextProgress}% by ${randomMission.agent}.`, 'Operations', 'info');
        }
      } else {
        // Idle ambient logs
        onAddLog("AMBIENT ENCRYPTED BROADCAST: Signal channels clear. Scanning for laser targets.", "System", "success");
      }

      setSyncTick(prev => prev + 1);
    }, 10 * 1000); // Strict 10-second requirement

    return () => clearInterval(interval);
  }, [missions, onUpdateMissionProgress, onAddLog]);

  // Send message handler to Gemini AI backend API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    setInputText('');

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Append user message
    const userMsg: ChatMessage = {
      id: `chat-usr-${Date.now()}`,
      sender: 'user',
      senderName: localStorage.getItem('feline_profile_name') || 'You',
      text: userMsgText,
      time: timeStr,
      avatar: localStorage.getItem('feline_profile_image') || undefined
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsgText })
      });

      if (!res.ok) throw new Error("Failed to reach Gemini command");

      const data = await res.json();
      
      // Append AI response
      const aiResponseMsg: ChatMessage = {
        id: `chat-ai-${Date.now()}`,
        sender: 'ai',
        senderName: 'AI Feline Command 🤖',
        text: data.response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80'
      };

      setChatMessages(prev => [...prev, aiResponseMsg]);
    } catch (err) {
      console.error(err);
      // Fallback response if offline/server failure
      const fallbackMsg: ChatMessage = {
        id: `chat-err-${Date.now()}`,
        sender: 'ai',
        senderName: 'Grumpy Persy 😼 (ERROR_HANDLER)',
        text: 'โว้ยยยยยยยย! เน็ตหลุด เซิร์ฟเวอร์ออฟไลน์ หรือไม่ได้ตั้งค่า API Key แน่ๆ เลย! ฉันบอกแล้วไงว่าคอมพิวเตอร์มันรวนนนน! ไปให้อาหารพวกเราก่อนแล้วค่อยมาแชทใหม่ โวยวายยยย!! 😤🔌',
        time: timeStr,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTRjQu_AY4ENFxkmL00xmE5Tw5vPVE7fVavu8tsmCY3yGlwjF-2nClubDsKv9evPawooQ3d9F_odjTnfeYsKYYvh_qzNAj_rF6a_om2QRkqdNfN7PEX6ElbSAPxLMEk6DJbzhlRK_9Wm_DgbQuI_sTn5rgdZfa_SL5yNU7U-DEwrHPua86-Ts3egRj36Kb1lSY2HzHd1DKovUFqSKZK4wBvfOlWwhBV7e7igxvafG8_IjH5Idn4g5G8N-zs4aZuAUPb-fNERcfT0JO'
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleQuickDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deployMissionId || !deployAgentName) return;

    onDeployAgent(deployMissionId, deployAgentName);
    onAddLog(`DEPLOYED: Quick mission command assigned to ${deployAgentName}`, 'Operations', 'success');
    
    setDeployMissionId('');
    setDeployAgentName('');
    alert(`สั่งการเรียบร้อย! มอบหมายภารกิจสำเร็จ 🐾`);
  };

  const getAgentAvatar = (type: string) => {
    switch (type) {
      case 'tuxedo': return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq';
      case 'ginger': return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY2-l7bvJNXGutOJyFIIYffeqe2F3HkSW4ub0MdCMf3mxd70FqJr_f2orFTI6G7CK-uTI1lx2_mnsVGiYASjMvQOacLrHu6vuOg7J-SzPLotaUN--KPCCFZw8wLnSO3x8bcgiDAAw0SyMcN-Ozdi0x_1bpiVXgBQDxyvI6xtUpNI1MQ3tE0tBwNGGtFdVRkUyjai6c7_BFfgTh0fWojJSinxQobAHL_GW6U3XiWdfdpOT1cNQmWh5y2Bey65HgWrtOV7FOq9KDgSst';
      case 'calico': return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZO8rTnSxuzGK-c4bvP_bKC4uyLaBA6ZnDw_K7KUyNdXNfAise5p1glDXi9pze2KGl5733adBT7wpmZQ6ftszjFe29SaVjaCmLbJghmmR58nfcs_CVjLIcHLurWXJlFEto9VZ9OzkXlyYMH49YzkMWtPE40SKa-K8g-zVdMEm0P2_F8tA9vlY-BoGH645juP_wkjvB0ZQyrT9UQHWR60S_03qoB75EjbSI0dW62bUIIUuh38uwhusyKxBiWXPH2bVuCn8Ouxg4MmJv';
      default: return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTRjQu_AY4ENFxkmL00xmE5Tw5vPVE7fVavu8tsmCY3yGlwjF-2nClubDsKv9evPawooQ3d9F_odjTnfeYsKYYvh_qzNAj_rF6a_om2QRkqdNfN7PEX6ElbSAPxLMEk6DJbzhlRK_9Wm_DgbQuI_sTn5rgdZfa_SL5yNU7U-DEwrHPua86-Ts3egRj36Kb1lSY2HzHd1DKovUFqSKZK4wBvfOlWwhBV7e7igxvafG8_IjH5Idn4g5G8N-zs4aZuAUPb-fNERcfT0JO';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanline CRT overlay effect */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* 1. Tactical Agent Dashboard (replaces Global Performance) */}
        <section className="col-span-12 xl:col-span-8 bg-[#1A1D27]/90 backdrop-blur-md border-2 border-[#484555] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#cabeff]" />
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="text-[#cabeff] w-5 h-5 animate-pulse" />
              <h3 className="font-sans text-base font-bold text-[#cabeff] tracking-tight">Tactical Agent Force Dashboard</h3>
            </div>
            <span className="px-2 py-0.5 bg-[#14121b] text-[9px] font-mono text-[#22C55E] border border-[#22C55E]/30 rounded">
              REAL-TIME ROSTER ACTIVE
            </span>
          </div>

          {/* REAL STATE OVERVIEW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="bg-[#0F1117] border border-[#484555]/40 p-3.5 rounded text-center relative overflow-hidden group">
              <div className="absolute -right-2 -bottom-2 opacity-10 text-white font-bold text-3xl font-mono">{agents.length}</div>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">กำลังพลแมวทั้งหมด</p>
              <p className="text-2xl font-black text-white mt-1 font-mono">{agents.length}</p>
            </div>

            <div className="bg-[#0F1117] border border-[#484555]/40 p-3.5 rounded text-center relative overflow-hidden group">
              <div className="absolute -right-2 -bottom-2 opacity-10 text-[#22C55E] font-bold text-3xl font-mono">{readyAgents.length}</div>
              <p className="text-[10px] text-[#22C55E] font-mono uppercase tracking-wider">รอรับมอบหมายงาน</p>
              <p className="text-2xl font-black text-[#22C55E] mt-1 font-mono">{readyAgents.length}</p>
            </div>

            <div className="bg-[#0F1117] border border-[#484555]/40 p-3.5 rounded text-center relative overflow-hidden group">
              <div className="absolute -right-2 -bottom-2 opacity-10 text-[#EF4444] font-bold text-3xl font-mono">{activeAgents.length}</div>
              <p className="text-[10px] text-[#EF4444] font-mono uppercase tracking-wider">ปฏิบัติหน้าที่อยู่</p>
              <p className="text-2xl font-black text-[#EF4444] mt-1 font-mono">{activeAgents.length}</p>
            </div>

            <div className="bg-[#0F1117] border border-[#484555]/40 p-3.5 rounded text-center relative overflow-hidden group">
              <p className="text-[10px] text-[#F59E0B] font-mono uppercase tracking-wider">ประสิทธิภาพกองพล</p>
              <p className="text-2xl font-black text-[#F59E0B] mt-1 font-mono">
                {agents.length > 0 ? Math.round((activeAgents.length / agents.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* REAL-TIME LIST OF AGENTS */}
          <div className="bg-[#0F1117] border border-[#484555]/50 p-3 rounded-lg max-h-[160px] overflow-y-auto mb-4">
            <h4 className="text-[11px] text-gray-400 font-mono uppercase mb-2">รายชื่อกองกำลังแมว (อ้างอิงข้อมูลจริง)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-600 bg-gray-900">
                      <img src={getAgentAvatar(agent.avatarType)} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{agent.name}</span>
                      <span className="text-[9px] text-gray-500 font-mono">{agent.role}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-bold ${
                    agent.status === 'on_mission' 
                      ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20' 
                      : 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/20'
                  }`}>
                    {agent.status === 'on_mission' ? 'ON MISSION 🚨' : 'WAITING 💤'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* REAL-TIME MISSION DEPLOYER BOX */}
          <form onSubmit={handleQuickDeploy} className="bg-[#14121b] border-t border-[#484555]/50 pt-3.5 flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 w-full text-left">
              <label className="block text-[10px] font-mono text-[#cabeff] uppercase mb-1">เลือกภารกิจที่เว้นว่าง</label>
              <select 
                value={deployMissionId}
                onChange={(e) => setDeployMissionId(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded text-white py-1.5 px-2.5 font-mono text-xs focus:outline-none focus:border-[#cabeff]"
              >
                <option value="">-- เลือกภารกิจ --</option>
                {missions.filter(m => !m.agent || m.agent === 'Unassigned').map(m => (
                  <option key={m.id} value={m.id}>{m.title} (฿{m.payout.toLocaleString()})</option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full text-left">
              <label className="block text-[10px] font-mono text-[#cabeff] uppercase mb-1">เลือกสายลับที่พร้อมสั่งการ</label>
              <select 
                value={deployAgentName}
                onChange={(e) => setDeployAgentName(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded text-white py-1.5 px-2.5 font-mono text-xs focus:outline-none focus:border-[#cabeff]"
              >
                <option value="">-- เลือกสายลับ --</option>
                {readyAgents.map(a => (
                  <option key={a.id} value={a.name}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              disabled={!deployMissionId || !deployAgentName}
              className="w-full md:w-auto px-5 py-2.5 bg-[#cabeff] text-[#32009a] font-sans font-black text-xs uppercase tracking-wider rounded cursor-pointer hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> มอบหมายภารกิจจริง
            </button>
          </form>
        </section>

        {/* 2. Chat Room (replaces SYSTEM_logs.exe) */}
        <section className="col-span-12 xl:col-span-4 bg-[#1A1D27]/90 backdrop-blur-md border-2 border-[#484555] flex flex-col h-[420px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-lg relative overflow-hidden">
          <div className="p-3.5 bg-[#2b2932] border-b-2 border-[#484555] flex items-center justify-between">
            <span className="font-sans text-xs font-bold text-[#e6e0ee] flex items-center gap-1.5 uppercase">
              <Terminal className="w-4 h-4 text-[#cabeff] animate-pulse" /> Feline Secure Chat Room 💬
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
              <span className="text-[10px] font-mono text-[#22C55E]">GEMINI_ONLINE</span>
            </span>
          </div>
          
          {/* Scrollable messages core */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto max-h-[310px] bg-black/40 flex flex-col">
            {chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className="w-7 h-7 rounded-full border border-gray-600 bg-gray-900 overflow-hidden shrink-0 mt-0.5">
                    <img 
                      src={msg.avatar || 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150&auto=format&fit=crop&q=80'} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[9px] font-bold ${isAi ? 'text-[#cabeff]' : 'text-[#FF61D2]'}`}>{msg.senderName}</span>
                      <span className="text-[8px] text-gray-500 font-mono">{msg.time}</span>
                    </div>
                    <div className={`p-2 rounded text-[11px] font-mono leading-relaxed whitespace-pre-wrap text-left ${
                      msg.sender === 'user' 
                        ? 'bg-[#7c5cfc]/20 text-white border border-[#7c5cfc]/30 rounded-tr-none' 
                        : 'bg-[#1e1c25] text-gray-200 border border-[#484555]/50 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isAiTyping && (
              <div className="self-start flex gap-2">
                <div className="w-7 h-7 rounded-full border border-gray-600 bg-gray-900 overflow-hidden flex items-center justify-center">
                  <span className="text-[10px] animate-bounce">💬</span>
                </div>
                <div className="bg-[#1e1c25] p-2 rounded rounded-tl-none border border-[#484555]/50 text-xs font-mono text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span>แมวกำลังคิดมุกตลกเนี้ยว...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message input bar */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-[#14121b] border-t border-[#484555]/60 flex gap-1.5">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ถามแผนงาน/ขอมุกตลก หรือคุยกับสายลับ..."
              className="flex-1 bg-black/40 border border-[#484555] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cabeff] font-mono"
            />
            <button 
              type="submit"
              className="px-3.5 bg-[#cabeff] hover:brightness-110 text-[#32009a] rounded flex items-center justify-center transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        {/* 3. Mission Status Board (replaces GLOBAL LOGISTICS MAP) */}
        <section className="col-span-12 bg-[#14121b] border-2 border-[#484555] p-4 relative rounded-lg shadow-inner overflow-hidden">
          <div className="absolute top-0 right-0 p-2 z-10 flex items-center gap-1.5">
            {pulseActive && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              DYNAMIC AUTO-TRACKING SYSTEM // UPDATING EVERY 10S ({syncTick})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-[#F59E0B] w-4 h-4 animate-bounce" />
            <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider">Mission Status Board & Tracker</h3>
          </div>

          {/* MISSION TILES IN A ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missions.map((mission) => {
              const isUnassigned = !mission.agent || mission.agent === 'Unassigned';
              return (
                <div 
                  key={mission.id} 
                  className={`bg-[#1A1D27]/80 border p-3.5 rounded-md relative transition-all ${
                    pulseActive && !isUnassigned ? 'border-cyan-500/40 shadow-sm shadow-cyan-500/10' : 'border-[#484555]/60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-white font-bold text-xs truncate font-sans">{mission.title}</h4>
                    <span className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[8px] font-bold ${
                      mission.priority === 'CRITICAL' ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30' :
                      mission.priority === 'HIGH' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30' :
                      'bg-[#cabeff]/15 text-[#cabeff] border border-[#cabeff]/30'
                    }`}>
                      {mission.priority}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 font-mono mt-1 h-8 overflow-hidden line-clamp-2 leading-relaxed">
                    {mission.objective}
                  </p>

                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-[9px] font-mono text-gray-400 border-t border-white/5 pt-2">
                    <div>
                      <span>AGENT:</span>
                      <span className={`block font-bold text-xs ${isUnassigned ? 'text-gray-600' : 'text-[#cabeff]'}`}>
                        {isUnassigned ? 'Unassigned' : mission.agent}
                      </span>
                    </div>
                    <div className="text-right">
                      <span>EST. PAYOUT:</span>
                      <span className="block font-bold text-[#22C55E] text-xs">฿{mission.payout.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between font-mono text-[8px] text-gray-400">
                      <span>TRACKING PROGRESS</span>
                      <span className="text-white font-bold">{mission.progress}%</span>
                    </div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden p-0.5 border border-[#484555]/30">
                      <div 
                        className="h-full bg-gradient-to-r from-[#7c5cfc] to-[#cabeff] rounded-full transition-all duration-1000"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
