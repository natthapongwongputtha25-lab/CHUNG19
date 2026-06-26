import React, { useState } from 'react';
import { Agent, Mission } from '../types';
import { 
  Wrench, 
  UserCheck, 
  Target, 
  PlayCircle, 
  MapPin, 
  Sparkles, 
  Navigation, 
  PlusCircle, 
  Mail, 
  CheckCircle2, 
  Sliders,
  AlertTriangle
} from 'lucide-react';

interface OperationsPageProps {
  agents: Agent[];
  missions: Mission[];
  onDeployAgent: (missionId: string, agentName: string) => void;
  onAddLog: (msg: string, dept: 'Operations' | 'Command', level: 'info' | 'success' | 'warn' | 'error') => void;
  onAddMission: (mission: Mission) => void;
  onUpdateMission: (missionId: string, updatedFields: Partial<Mission>) => void;
}

export default function OperationsPage({ 
  agents, 
  missions, 
  onDeployAgent, 
  onAddLog,
  onAddMission,
  onUpdateMission
}: OperationsPageProps) {
  
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0] || null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(missions[0] || null);

  // Form State for creating custom mission
  const [newTitle, setNewTitle] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newPriority, setNewPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newPayout, setNewPayout] = useState(1200);
  const [newDeadline, setNewDeadline] = useState('04h 30m');
  const [newAgent, setNewAgent] = useState('Unassigned');
  const [notifyEmail, setNotifyEmail] = useState('');

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [emailAlertStatus, setEmailAlertStatus] = useState<string | null>(null);

  const handleDeploy = () => {
    if (!selectedMission || !selectedAgent) return;
    
    if (selectedAgent.status === 'on_mission') {
      alert("เอเจนท์แมวตัวนี้กำลังติดภารกิจอื่นอยู่เนี้ยว!");
      return;
    }

    onDeployAgent(selectedMission.id, selectedAgent.name);
    onAddLog(`DEPLOYED: ${selectedAgent.name} assigned to "${selectedMission.title}"`, 'Operations', 'success');
    
    // Update local state copy
    setSelectedMission(prev => prev ? { ...prev, agent: selectedAgent.name, progress: Math.min(prev.progress + 10, 100) } : null);
    alert(`ส่งตัวสายลับ ${selectedAgent.name} ไปปฏิบัติภารกิจ "${selectedMission.title}" สำเร็จเนี้ยว!`);
  };

  // Submit new custom mission
  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newObjective.trim()) {
      alert("กรุณากรอกข้อมูลขอบเขตงานให้ครบถ้วนด้วยเนี้ยว!");
      return;
    }

    const createdMission: Mission = {
      id: `mission-${Date.now()}`,
      title: `Mission: ${newTitle.trim()}`,
      objective: newObjective.trim(),
      priority: newPriority,
      payout: Number(newPayout) || 1000,
      deadline: newDeadline.trim() || '05h 00m',
      agent: newAgent,
      progress: 0
    };

    onAddMission(createdMission);
    onAddLog(`CREATION: New mission "${createdMission.title}" registered in HQ database.`, 'Operations', 'success');

    // Simulate sending email notification to member
    if (notifyEmail.trim()) {
      try {
        const res = await fetch('/api/notify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: notifyEmail.trim(),
            subject: `🚨 Feline Command: ภารกิจใหม่มอบหมายถึงคุณ [${createdMission.title}]`,
            text: `สวัสดีสายลับแห่งกองกำลัง Feline!\n\nคุณได้รับมอบหมายภารกิจสำคัญ:\n- ภารกิจ: ${createdMission.title}\n- ขอบเขตภารกิจ: ${createdMission.objective}\n- ระดับความสำคัญ: ${createdMission.priority}\n- ค่าตอบแทน: ฿${createdMission.payout.toLocaleString()}\n- เวลาส่งมอบงาน: ${createdMission.deadline}\n\nกรุณาเข้าสู่ระบบ Feline Command Terminal เพื่อยืนยันคำสั่ง.\n\n[สมาคมลับสายลับเหมียว HQ]`,
            senderEmail: 'feline-hq@felinecommand.org'
          })
        });
        
        if (res.ok) {
          onAddLog(`EMAIL ALERT: Simulated notification dispatched to ${notifyEmail.trim()}`, 'Operations', 'info');
          setEmailAlertStatus(`Simulated Google Alert sent successfully to ${notifyEmail.trim()}!`);
          setTimeout(() => setEmailAlertStatus(null), 5000);
        }
      } catch (err) {
        console.error("Failed to simulate email notification", err);
      }
    }

    // Reset Form
    setNewTitle('');
    setNewObjective('');
    setNotifyEmail('');
    setIsFormOpen(false);
    setSelectedMission(createdMission);
    alert("ลงทะเบียนภารกิจใหม่และส่งแจ้งเตือนอีเมลสำเร็จเนี้ยว!");
  };

  // Update selected mission progress slider (สถานะการติดตามงาน)
  const handleProgressChange = (newVal: number) => {
    if (!selectedMission) return;
    onUpdateMission(selectedMission.id, { progress: newVal });
    setSelectedMission(prev => prev ? { ...prev, progress: newVal } : null);
  };

  // Update selected mission agent dropdown
  const handleMissionAgentChange = (agentName: string) => {
    if (!selectedMission) return;
    onUpdateMission(selectedMission.id, { agent: agentName });
    setSelectedMission(prev => prev ? { ...prev, agent: agentName } : null);
    
    if (agentName !== 'Unassigned') {
      // Also update agent status in system logs
      onAddLog(`REASSIGNMENT: Mission "${selectedMission.title}" reassigned to ${agentName}.`, 'Operations', 'info');
    }
  };

  const getAvatarUrl = (type: string) => {
    switch (type) {
      case 'tuxedo': return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq';
      case 'ginger': return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY2-l7bvJNXGutOJyFIIYffeqe2F3HkSW4ub0MdCMf3mxd70FqJr_f2orFTI6G7CK-uTI1lx2_mnsVGiYASjMvQOacLrHu6vuOg7J-SzPLotaUN--KPCCFZw8wLnSO3x8bcgiDAAw0SyMcN-Ozdi0x_1bpiVXgBQDxyvI6xtUpNI1MQ3tE0tBwNGGtFdVRkUyjai6c7_BFfgTh0fWojJSinxQobAHL_GW6U3XiWdfdpOT1cNQmWh5y2Bey65HgWrtOV7FOq9KDgSst';
      case 'calico': return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZO8rTnSxuzGK-c4bvP_bKC4uyLaBA6ZnDw_K7KUyNdXNfAise5p1glDXi9pze2KGl5733adBT7wpmZQ6ftszjFe29SaVjaCmLbJghmmR58nfcs_CVjLIcHLurWXJlFEto9VZ9OzkXlyYMH49YzkMWtPE40SKa-K8g-zVdMEm0P2_F8tA9vlY-BoGH645juP_wkjvB0ZQyrT9UQHWR60S_03qoB75EjbSI0dW62bUIIUuh38uwhusyKxBiWXPH2bVuCn8Ouxg4MmJv';
      default: return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTRjQu_AY4ENFxkmL00xmE5Tw5vPVE7fVavu8tsmCY3yGlwjF-2nClubDsKv9evPawooQ3d9F_odjTnfeYsKYYvh_qzNAj_rF6a_om2QRkqdNfN7PEX6ElbSAPxLMEk6DJbzhlRK_9Wm_DgbQuI_sTn5rgdZfa_SL5yNU7U-DEwrHPua86-Ts3egRj36Kb1lSY2HzHd1DKovUFqSKZK4wBvfOlWwhBV7e7igxvafG8_IjH5Idn4g5G8N-zs4aZuAUPb-fNERcfT0JO';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#938ea1] font-mono text-[10px] mb-1">
            <span>HQ</span>
            <span className="text-[12px]">&gt;</span>
            <span className="text-[#3b82f6] uppercase font-bold">Operations Hub (ศูนย์ยุทธการมอบหมายงาน)</span>
          </div>
          <h2 className="font-sans text-xl font-bold text-white tracking-tight">Tactical Roster & Custom Briefings</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 bg-[#22C55E] text-black font-sans font-black text-xs uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer shadow-[0_3px_0_0_#15803d]"
          >
            <PlusCircle className="w-4 h-4 text-black" /> มอบหมายภารกิจใหม่
          </button>
          
          <div className="bg-[#14121b] border border-[#484555] px-4 py-1.5 flex items-center gap-2.5 rounded hidden md:flex">
            <Wrench className="w-4 h-4 text-[#3b82f6]" />
            <span className="font-mono text-xs text-[#e6e0ee]">REALTIME PORT</span>
          </div>
        </div>
      </div>

      {/* Email Alert Banner Toast */}
      {emailAlertStatus && (
        <div className="bg-[#10B981]/25 border-l-4 border-[#10B981] p-3 text-xs font-mono text-emerald-300 rounded flex items-center gap-2 animate-bounce">
          <Mail className="w-4 h-4" />
          <span>{emailAlertStatus}</span>
        </div>
      )}

      {/* Create custom mission panel (ขยายกรอกข้อมูลขอบเขตงาน) */}
      {isFormOpen && (
        <div className="bg-[#1A1D27] border-2 border-[#22C55E]/60 p-5 rounded-lg shadow-xl relative font-mono text-xs text-[#e6e0ee]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#22C55E]" />
          <h3 className="font-sans text-sm font-black text-[#22C55E] mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>📋 สร้างขอบเขตภารกิจใหม่ & แจ้งเตือนสมาชิกลับ</span>
          </h3>

          <form onSubmit={handleCreateMission} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">ชื่อภารกิจ / Mission Title</label>
              <input 
                type="text" 
                placeholder="เช่น แฮกไฟล์ความรู้สกิน หรือ นั่งทับคีย์บอร์ดความถี่สูง" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#22C55E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">สายลับปฏิบัติการหลัก</label>
              <select 
                value={newAgent}
                onChange={(e) => setNewAgent(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2.5 text-white focus:border-[#22C55E] focus:outline-none"
              >
                <option value="Unassigned">ยังไม่ระบุเอเจนต์ (Unassigned)</option>
                {agents.map(a => (
                  <option key={a.id} value={a.name}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">ขอบเขตงานและรายละเอียดเป้าหมาย / Scope of Work</label>
              <textarea 
                rows={3}
                placeholder="กรอกรายละเอียดเป้าหมาย ขอบเขตงาน และสิ่งที่สายลับแมวต้องทำอย่างเป็นขั้นตอน..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#22C55E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">ระดับความเร่งด่วน / Priority</label>
              <select 
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#22C55E] focus:outline-none"
              >
                <option value="LOW">LOW (ความสำคัญระดับต่ำ - นอนกลิ้ง)</option>
                <option value="MEDIUM">MEDIUM (สำคัญปานกลาง - ขโมยขนม)</option>
                <option value="HIGH">HIGH (ความสำคัญสูง - คลุกฝุ่นข้อมูล)</option>
                <option value="CRITICAL">CRITICAL (ฉุกเฉินสูงสุด - ประธานตามด่วน!)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">ค่าตอบแทนกองกลาง (฿) / Payout</label>
              <input 
                type="number" 
                value={newPayout}
                onChange={(e) => setNewPayout(Number(e.target.value))}
                className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#22C55E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">เป้าหมายเวลาเสร็จสิ้น / Target Deadline</label>
              <input 
                type="text" 
                placeholder="เช่น 02h 45m หรือ 12h 00m" 
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#22C55E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">ส่งอีเมลแจ้งเตือนไปยังสมาชิก (Gmail)</label>
              <input 
                type="email" 
                placeholder="เช่น support.agent@gmail.com" 
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-[#22C55E] focus:border-[#22C55E] focus:outline-none font-bold"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-[#484555] text-gray-400 hover:text-white rounded hover:bg-white/5 font-sans"
              >
                ยกเลิก / Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-[#22C55E] text-black hover:brightness-110 font-bold rounded font-sans"
              >
                ลงทะเบียน & แจ้งเตือนสมาชิกลับ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Left Roster, Center Detailed Tracking, Right Map */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left Column: Agent Roster */}
        <div className="xl:col-span-4 bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-black/25 border-b border-[#484555] flex justify-between items-center">
            <span className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#cabeff]" /> Feline Agent Roster
            </span>
            <span className="font-mono text-[10px] text-gray-400">({agents.length} AGENTS)</span>
          </div>

          <div className="p-4 space-y-3">
            {agents.map(a => (
              <div 
                key={a.id}
                onClick={() => setSelectedAgent(a)}
                className={`p-3 border-2 rounded-md flex items-center gap-3 cursor-pointer transition-all ${
                  selectedAgent?.id === a.id 
                    ? 'bg-[#201e28] border-[#cabeff]' 
                    : 'bg-[#14121b] border-[#484555]/60 hover:border-gray-500'
                }`}
              >
                <div className="w-10 h-10 border-2 border-[#484555]/80 overflow-hidden relative bg-[#0F1117] rounded-full">
                  <img src={getAvatarUrl(a.avatarType)} className="w-full h-full object-cover" alt={a.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold font-sans text-sm truncate">{a.name}</h4>
                  <p className="text-gray-400 font-mono text-[10px] truncate">{a.role}</p>
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-bold ${
                    a.status === 'on_mission' 
                      ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30' 
                      : 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                  }`}>
                    {a.status === 'on_mission' ? 'DEPLOYED' : 'READY'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Interactive Mission Control (กรอกข้อมูลขอบเขตงานและสถานะการติดตามงานได้) */}
        <div className="xl:col-span-5 bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] rounded-lg shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 bg-black/25 border-b border-[#484555] flex justify-between items-center">
              <span className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-[#F59E0B]" /> ACTIVE MISSION TRACKER & LAUNCHER
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Mission Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[110px] overflow-y-auto pr-1">
                {missions.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setSelectedMission(m)}
                    className={`p-2 font-mono text-[10px] font-bold border rounded-md transition-all truncate text-center ${
                      selectedMission?.id === m.id 
                        ? 'bg-[#cabeff] text-[#32009a] border-[#cabeff]' 
                        : 'bg-black/30 text-gray-400 border-[#484555]/80 hover:text-white'
                    }`}
                  >
                    {m.title.split(': ')[1] || m.title}
                  </button>
                ))}
              </div>

              {selectedMission ? (
                <div className="space-y-4 bg-black/30 p-4 border border-[#484555]/50 rounded-md">
                  <div>
                    <h3 className="font-sans text-base font-bold text-white">{selectedMission.title}</h3>
                    <p className="text-gray-400 font-mono text-xs mt-1.5 leading-relaxed bg-[#0c0a12] p-2.5 rounded border border-white/5">
                      <span className="text-[#22C55E] block text-[9px] uppercase font-bold mb-1">ขอบเขตงาน / SCOPE:</span>
                      {selectedMission.objective}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-gray-400 block text-[10px]">เอเจนต์คุมงาน / OFFICER</span>
                      <select 
                        value={selectedMission.agent}
                        onChange={(e) => handleMissionAgentChange(e.target.value)}
                        className="bg-[#0F1117] border border-[#484555] text-[#cabeff] rounded font-bold px-1.5 py-1 text-xs focus:outline-none focus:border-[#cabeff] mt-1"
                      >
                        <option value="Unassigned">ยังไม่มอบหมาย</option>
                        {agents.map(a => (
                          <option key={a.id} value={a.name}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">MISSION PRIORITY</span>
                      <span className={`font-bold block mt-1.5 ${
                        selectedMission.priority === 'CRITICAL' ? 'text-[#EF4444]' :
                        selectedMission.priority === 'HIGH' ? 'text-[#F59E0B]' :
                        'text-[#cabeff]'
                      }`}>{selectedMission.priority}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-gray-400 block text-[10px]">EST. PAYOUT</span>
                      <span className="text-[#22C55E] font-bold block mt-0.5">฿{selectedMission.payout.toLocaleString()}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-gray-400 block text-[10px]">DEADLINE TARGET</span>
                      <span className="text-white font-bold block mt-0.5">{selectedMission.deadline}</span>
                    </div>
                  </div>

                  {/* EDIT INTERACTIVE PROGRESS (สถานะการติดตามงาน) */}
                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <div className="flex justify-between font-mono text-[10px] text-[#cabeff] uppercase font-bold">
                      <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> ปรับปรุงความคืบหน้าติดตามงาน</span>
                      <span>{selectedMission.progress}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={selectedMission.progress}
                        onChange={(e) => handleProgressChange(Number(e.target.value))}
                        className="flex-1 accent-[#cabeff] h-1.5 bg-[#0c0a12] rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="font-mono text-xs text-white font-bold">{selectedMission.progress}%</span>
                    </div>
                    <div className="h-3.5 bg-black/50 border border-[#484555] rounded-full p-0.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#7c5cfc] to-[#cabeff] rounded-full transition-all duration-300" 
                        style={{ width: `${selectedMission.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10 font-mono">กรุณาเลือกหรือสร้างภารกิจเพื่อควบคุมเนี้ยว</div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-[#484555] bg-black/15">
            <button 
              onClick={handleDeploy}
              disabled={!selectedAgent || !selectedMission || selectedMission.agent !== 'Unassigned'}
              className="w-full py-3 bg-[#cabeff] text-[#32009a] font-sans font-black text-xs uppercase shadow-[0_4px_0_0_#4918c8] hover:translate-y-px hover:shadow-[0_2px_0_0_#4918c8] active:translate-y-0.5 active:shadow-none transition-all rounded disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> DEPLOY AGENT TO CHOSEN TARGET
            </button>
          </div>
        </div>

        {/* Right: Operations plan map with coordinates */}
        <div className="xl:col-span-3 bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] rounded-lg shadow-lg overflow-hidden flex flex-col h-[480px]">
          <div className="p-4 bg-black/25 border-b border-[#484555]">
            <span className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#cabeff]" /> RADAR TRACKING MAP
            </span>
          </div>

          <div className="flex-1 relative bg-[#0c0a12] overflow-hidden">
            <div 
              className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCycZYGjEBETSSgWn8OaQAKfZ2Ya2u8fE6B3HWOmKK8nggLS1P_wYsROvPj47CJPwEKrvR9hOhqvkhVBGtlBAjkrY0X0FioB2wSiOmGhvF7BfHrNAOMB3kTThiH1wZPEvXG3f7kTe5mvCzF_V50LlbC2LiQFXXW8OmQ_ujUhee_GQPnp4Mb6xjIKxa0VKETh3J_a1k_1cG5Vz4B9_qkXx75FonEEHRJVY_NMWsSVIX4-Z-6LUaSq-K519psOiqfIvrc4ANsZEJLGctX')` }}
            />
            
            {/* Pulsing pins */}
            <div className="absolute top-[28%] left-[32%] cursor-pointer group">
              <div className="w-3.5 h-3.5 bg-[#EF4444] rounded-full animate-ping absolute" />
              <div className="w-3.5 h-3.5 bg-[#EF4444] border-2 border-white rounded-full relative z-10" />
              <div className="absolute hidden group-hover:block bg-[#1A1D27] text-[10px] font-mono text-white p-1 rounded -top-8 -left-8 border border-white/25 whitespace-nowrap z-30 shadow-xl">
                BKK SECTOR: CATNIP LAB
              </div>
            </div>

            <div className="absolute top-[58%] left-[68%] cursor-pointer group">
              <div className="w-3.5 h-3.5 bg-[#22C55E] rounded-full animate-ping absolute" />
              <div className="w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full relative z-10" />
              <div className="absolute hidden group-hover:block bg-[#1A1D27] text-[10px] font-mono text-white p-1 rounded -top-8 -left-8 border border-white/25 whitespace-nowrap z-30 shadow-xl">
                TKY SECTOR: BOX ARCHIVE
              </div>
            </div>

            <div className="absolute top-[43%] left-[51%] cursor-pointer group">
              <div className="w-3.5 h-3.5 bg-[#F59E0B] rounded-full animate-ping absolute" />
              <div className="w-3.5 h-3.5 bg-[#F59E0B] border-2 border-white rounded-full relative z-10" />
              <div className="absolute hidden group-hover:block bg-[#1A1D27] text-[10px] font-mono text-white p-1 rounded -top-8 -left-8 border border-white/25 whitespace-nowrap z-30 shadow-xl">
                NYC SECTOR: ZEN LOFT
              </div>
            </div>

            {/* Feline compass bottom-right */}
            <div className="absolute bottom-3 right-3 bg-black/65 p-2 rounded border border-[#484555] font-mono text-[9px] text-[#cabeff]">
              <p>COORD_LAT: 13.7563° N</p>
              <p>COORD_LNG: 100.5018° E</p>
              <p>SATELLITE: ACTIVE</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
