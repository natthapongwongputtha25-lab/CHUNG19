import React, { useState, useEffect } from 'react';
import { ActiveTab, Trade, SystemLog, Agent, Mission } from './types';
import { INITIAL_TRADES, INITIAL_LOGS, INITIAL_AGENTS, INITIAL_MISSIONS } from './data';
import { parseCSV } from './utils';

// Page imports
import CommandCenter from './components/CommandCenter';
import MarketingPage from './components/MarketingPage';
import FinancePage from './components/FinancePage';
import RiskPage from './components/RiskPage';
import OperationsPage from './components/OperationsPage';
import SheetsSyncPage from './components/SheetsSyncPage';

import { 
  Terminal, 
  TrendingUp, 
  Megaphone, 
  Shield, 
  Wrench, 
  FileSpreadsheet, 
  Flame, 
  Power, 
  Settings, 
  Bell, 
  Search,
  Sliders,
  Sparkles,
  Users,
  ShieldAlert,
  Key,
  LogOut,
  Mail,
  UserCheck,
  CheckCircle2,
  Trash2,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');
  
  // 1. Google / Gmail Auth State
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('feline_gmail_logged_in') === 'true';
  });
  const [googleEmail, setGoogleEmail] = useState<string>(() => {
    return localStorage.getItem('feline_gmail_address') || '';
  });
  const [memberRank, setMemberRank] = useState<string>(() => {
    return localStorage.getItem('feline_gmail_rank') || 'RECRUIT';
  });
  const [googleName, setGoogleName] = useState<string>(() => {
    return localStorage.getItem('feline_gmail_name') || '';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginNameInput, setLoginNameInput] = useState('');
  
  // 2. Organization Members & Ranks State (ระบบยศสมาชิกลับ)
  const [members, setMembers] = useState<{ email: string; name: string; avatarUrl: string; rank: string; role: string; }[]>(() => {
    const saved = localStorage.getItem('feline_org_members');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { email: 'whiskers.ceo@felinecommand.org', name: 'CEO Whiskers', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq', rank: 'CEO', role: 'Chief Executive Officer (ประธานอาวุโสสูงสุด)' },
      { email: 'tuxedo.agent@felinecommand.org', name: 'Tactical Tuxedo', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq', rank: 'COMMANDER', role: 'Lobby Security Head (ผู้บัญชาการหน่วย)' },
      { email: 'ginger.data@felinecommand.org', name: 'Data Ginger', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY2-l7bvJNXGutOJyFIIYffeqe2F3HkSW4ub0MdCMf3mxd70FqJr_f2orFTI6G7CK-uTI1lx2_mnsVGiYASjMvQOacLrHu6vuOg7J-SzPLotaUN--KPCCFZw8wLnSO3x8bcgiDAAw0SyMcN-Ozdi0x_1bpiVXgBQDxyvI6xtUpNI1MQ3tE0tBwNGGtFdVRkUyjai6c7_BFfgTh0fWojJSinxQobAHL_GW6U3XiWdfdpOT1cNQmWh5y2Bey65HgWrtOV7FOq9KDgSst', rank: 'ELITE', role: 'Chief Data Analyst (สายลับระดับพระกาฬ)' },
      { email: 'calico.stealth@felinecommand.org', name: 'Stealth Calico', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZO8rTnSxuzGK-c4bvP_bKC4uyLaBA6ZnDw_K7KUyNdXNfAise5p1glDXi9pze2KGl5733adBT7wpmZQ6ftszjFe29SaVjaCmLbJghmmR58nfcs_CVjLIcHLurWXJlFEto9VZ9OzkXlyYMH49YzkMWtPE40SKa-K8g-zVdMEm0P2_F8tA9vlY-BoGH645juP_wkjvB0ZQyrT9UQHWR60S_03qoB75EjbSI0dW62bUIIUuh38uwhusyKxBiWXPH2bVuCn8Ouxg4MmJv', rank: 'AGENT', role: 'Special Recon Agent (สายลับเจ้าหน้าที่)' },
      { email: 'grumpy.persy@felinecommand.org', name: 'Grumpy Persy', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTRjQu_AY4ENFxkmL00xmE5Tw5vPVE7fVavu8tsmCY3yGlwjF-2nClubDsKv9evPawooQ3d9F_odjTnfeYsKYYvh_qzNAj_rF6a_om2QRkqdNfN7PEX6ElbSAPxLMEk6DJbzhlRK_9Wm_DgbQuI_sTn5rgdZfa_SL5yNU7U-DEwrHPua86-Ts3egRj36Kb1lSY2HzHd1DKovUFqSKZK4wBvfOlWwhBV7e7igxvafG8_IjH5Idn4g5G8N-zs4aZuAUPb-fNERcfT0JO', rank: 'AGENT', role: 'Chief Complain Officer (เหมียวขี้โวยวาย)' }
    ];
  });
  
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('feline_admin_mode') === 'true';
  });

  // Profile settings state with local storage support
  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem('feline_profile_name') || 'CEO Whiskers';
  });
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('feline_profile_image') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq';
  });
  const [profileRole, setProfileRole] = useState<string>(() => {
    return localStorage.getItem('feline_profile_role') || 'CHIEF EXECUTIVE OFFICER';
  });
  const [profileLevel, setProfileLevel] = useState<string>(() => {
    return localStorage.getItem('feline_profile_level') || 'LVL_99 TYCOON';
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [tempName, setTempName] = useState<string>(profileName);
  const [tempImage, setTempImage] = useState<string>(profileImage);
  const [tempRole, setTempRole] = useState<string>(profileRole);
  const [tempLevel, setTempLevel] = useState<string>(profileLevel);

  // Sync temp state when opening modal
  useEffect(() => {
    if (isProfileModalOpen) {
      setTempName(profileName);
      setTempImage(profileImage);
      setTempRole(profileRole);
      setTempLevel(profileLevel);
    }
  }, [isProfileModalOpen, profileName, profileImage, profileRole, profileLevel]);

  // Sync members list to localStorage
  useEffect(() => {
    localStorage.setItem('feline_org_members', JSON.stringify(members));
  }, [members]);

  // Preset Avatars Feline Gallery
  const PRESET_AVATARS = [
    { name: 'Tuxedo Tycoon', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq' },
    { name: 'Golden Agent', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY2-l7bvJNXGutOJyFIIYffeqe2F3HkSW4ub0MdCMf3mxd70FqJr_f2orFTI6G7CK-uTI1lx2_mnsVGiYASjMvQOacLrHu6vuOg7J-SzPLotaUN--KPCCFZw8wLnSO3x8bcgiDAAw0SyMcN-Ozdi0x_1bpiVXgBQDxyvI6xtUpNI1MQ3tE0tBwNGGtFdVRkUyjai6c7_BFfgTh0fWojJSinxQobAHL_GW6U3XiWdfdpOT1cNQmWh5y2Bey65HgWrtOV7FOq9KDgSst' },
    { name: 'Calico Commander', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZO8rTnSxuzGK-c4bvP_bKC4uyLaBA6ZnDw_K7KUyNdXNfAise5p1glDXi9pze2KGl5733adBT7wpmZQ6ftszjFe29SaVjaCmLbJghmmR58nfcs_CVjLIcHLurWXJlFEto9VZ9OzkXlyYMH49YzkMWtPE40SKa-K8g-zVdMEm0P2_F8tA9vlY-BoGH645juP_wkjvB0ZQyrT9UQHWR60S_03qoB75EjbSI0dW62bUIIUuh38uwhusyKxBiWXPH2bVuCn8Ouxg4MmJv' },
    { name: 'Siamese Operator', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTRjQu_AY4ENFxkmL00xmE5Tw5vPVE7fVavu8tsmCY3yGlwjF-2nClubDsKv9evPawooQ3d9F_odjTnfeYsKYYvh_qzNAj_rF6a_om2QRkqdNfN7PEX6ElbSAPxLMEk6DJbzhlRK_9Wm_DgbQuI_sTn5rgdZfa_SL5yNU7U-DEwrHPua86-Ts3egRj36Kb1lSY2HzHd1DKovUFqSKZK4wBvfOlWwhBV7e7igxvafG8_IjH5Idn4g5G8N-zs4aZuAUPb-fNERcfT0JO' },
    { name: 'Cyber Shades', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150&auto=format&fit=crop&q=80' },
    { name: 'Neko Hacker', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80' }
  ];
  
  // Dynamic persistent states
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  
  // UTC real-time clock
  const [systemTime, setSystemTime] = useState<string>('00:00:00');

  // Load from localStorage on mount
  useEffect(() => {
    const savedTrades = localStorage.getItem('feline_trades');
    if (savedTrades) {
      try { setTrades(JSON.parse(savedTrades)); } catch { setTrades(INITIAL_TRADES); }
    } else { setTrades(INITIAL_TRADES); }

    const savedLogs = localStorage.getItem('feline_logs');
    if (savedLogs) {
      try { setLogs(JSON.parse(savedLogs)); } catch { setLogs(INITIAL_LOGS); }
    } else { setLogs(INITIAL_LOGS); }

    const savedAgents = localStorage.getItem('feline_agents');
    if (savedAgents) {
      try { setAgents(JSON.parse(savedAgents)); } catch { setAgents(INITIAL_AGENTS); }
    } else { setAgents(INITIAL_AGENTS); }

    const savedMissions = localStorage.getItem('feline_missions');
    if (savedMissions) {
      try { setMissions(JSON.parse(savedMissions)); } catch { setMissions(INITIAL_MISSIONS); }
    } else { setMissions(INITIAL_MISSIONS); }

    setSheetUrl(localStorage.getItem('feline_sheet_url') || '');

    // Digital clock interval
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const clockId = setInterval(updateTime, 1000);

    return () => clearInterval(clockId);
  }, []);

  // Save changes helper
  const saveTrades = (newTrades: Trade[]) => {
    setTrades(newTrades);
    localStorage.setItem('feline_trades', JSON.stringify(newTrades));
  };

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    const fresh: Trade = { ...newTrade, id: `trade-${Date.now()}` };
    const updated = [fresh, ...trades];
    saveTrades(updated);
    handleAddLog(`Skin added: ${fresh.itemName} entered portfolio database.`, 'Finance', 'success');
  };

  const handleUpdateTrade = (id: string, updatedFields: Partial<Trade>) => {
    const updated = trades.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    saveTrades(updated);
    handleAddLog(`Skin updated: Modified details for ID ${id.substring(0, 8)}.`, 'Finance', 'info');
  };

  const handleDeleteTrade = (id: string) => {
    const updated = trades.filter(t => t.id !== id);
    saveTrades(updated);
    handleAddLog(`Skin deleted: Removed trade record ID ${id.substring(0, 8)}.`, 'Finance', 'warn');
  };

  const handleDeployAgent = (missionId: string, agentName: string) => {
    const updatedAgents = agents.map(a => a.name === agentName ? { ...a, status: 'on_mission' as const } : a);
    setAgents(updatedAgents);
    localStorage.setItem('feline_agents', JSON.stringify(updatedAgents));

    const updatedMissions = missions.map(m => m.id === missionId ? { ...m, agent: agentName, progress: Math.min(m.progress + 15, 100) } : m);
    setMissions(updatedMissions);
    localStorage.setItem('feline_missions', JSON.stringify(updatedMissions));
  };

  // Add Custom Mission
  const handleAddMission = (newMission: Mission) => {
    const updated = [...missions, newMission];
    setMissions(updated);
    localStorage.setItem('feline_missions', JSON.stringify(updated));
  };

  // Update Custom Mission Fields
  const handleUpdateMission = (id: string, updatedFields: Partial<Mission>) => {
    const updated = missions.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    setMissions(updated);
    localStorage.setItem('feline_missions', JSON.stringify(updated));
  };

  const handleUpdateMissionProgress = (id: string, progress: number) => {
    const updated = missions.map(m => {
      if (m.id === id) {
        return { ...m, progress };
      }
      return m;
    });
    setMissions(updated);
    localStorage.setItem('feline_missions', JSON.stringify(updated));
  };

  const handleSyncCSV = (csvText: string) => {
    const parsed = parseCSV(csvText);
    if (parsed.length > 0) {
      const merged = [...parsed, ...trades];
      saveTrades(merged);
    }
  };

  const handleAddLog = (message: string, department: SystemLog['department'], level: SystemLog['level']) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newLog: SystemLog = { time: timeStr, department, message, level };
    const updated = [newLog, ...logs].slice(0, 30);
    setLogs(updated);
    localStorage.setItem('feline_logs', JSON.stringify(updated));
  };

  // File to Base64 image uploader (can upload their own profile image)
  const handleBase64Upload = (e: React.ChangeEvent<HTMLInputElement>, targetSetter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("รูปภาพต้องมีขนาดต่ำกว่า 2MB เนี้ยว!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        targetSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Google Sign-In Simulation
  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailInput.trim() || !loginEmailInput.includes('@')) {
      alert("กรุณากรอก Gmail ที่ถูกต้อง (เช่น user@gmail.com) เนี้ยว!");
      return;
    }

    const email = loginEmailInput.trim();
    const name = loginNameInput.trim() || 'Feline Member';
    const finalAvatar = tempImage;

    setIsGoogleLoggedIn(true);
    setGoogleEmail(email);
    setGoogleName(name);

    localStorage.setItem('feline_gmail_logged_in', 'true');
    localStorage.setItem('feline_gmail_address', email);
    localStorage.setItem('feline_gmail_name', name);

    // Add user as a Member with RECRUIT rank
    const newUserMember = {
      email,
      name,
      avatarUrl: finalAvatar,
      rank: 'RECRUIT',
      role: 'Recruit Agent (เด็กฝึกงานใหม่)'
    };

    // Filter out duplicate if existing
    const updatedMembers = [newUserMember, ...members.filter(m => m.email !== email)];
    setMembers(updatedMembers);

    // Apply active profile
    setProfileName(name);
    setProfileImage(finalAvatar);
    setProfileRole('Recruit Agent (เด็กฝึกงาน)');
    setProfileLevel('ยศ: RECRUIT (ก้าวแรกสายลับ)');

    localStorage.setItem('feline_profile_name', name);
    localStorage.setItem('feline_profile_image', finalAvatar);
    localStorage.setItem('feline_profile_role', 'Recruit Agent (เด็กฝึกงาน)');
    localStorage.setItem('feline_profile_level', 'ยศ: RECRUIT (ก้าวแรกสายลับ)');

    handleAddLog(`AUTHENTICATION: Google Sign-in successful for ${email}. Joined feline force.`, 'Command', 'success');
    setIsLoginModalOpen(false);
    alert(`เชื่อมต่อ Gmail สำเร็จ! ยินดีต้อนรับท่านยศ RECRUIT แห่งองค์กร 🐾`);
  };

  const handleLogout = () => {
    setIsGoogleLoggedIn(false);
    setGoogleEmail('');
    setGoogleName('');
    localStorage.removeItem('feline_gmail_logged_in');
    localStorage.removeItem('feline_gmail_address');
    localStorage.removeItem('feline_gmail_name');

    setProfileName('CEO Whiskers');
    setProfileImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq');
    setProfileRole('CHIEF EXECUTIVE OFFICER');
    setProfileLevel('LVL_99 TYCOON');

    localStorage.removeItem('feline_profile_name');
    localStorage.removeItem('feline_profile_image');
    localStorage.removeItem('feline_profile_role');
    localStorage.removeItem('feline_profile_level');

    handleAddLog("AUTHENTICATION: Terminated secure user core session.", 'Command', 'warn');
    alert("ลงชื่อออกสำเร็จเนี้ยว!");
  };

  const handleUpdateMemberRank = (email: string, newRank: string) => {
    let rankRole = 'Recruit Agent (เด็กฝึกงาน)';
    let lvlStr = 'ยศ: RECRUIT (ก้าวแรกสายลับ)';

    switch (newRank) {
      case 'AGENT':
        rankRole = 'Field Agent (สายลับเจ้าหน้าที่)';
        lvlStr = 'ยศ: AGENT (เจ้าหน้าที่กังฟู)';
        break;
      case 'ELITE':
        rankRole = 'Elite Operator (สายลับระดับพระกาฬ)';
        lvlStr = 'ยศ: ELITE (ยอดฝีมือปลาทูน่า)';
        break;
      case 'COMMANDER':
        rankRole = 'Commander (ผู้บัญชาการหน่วย)';
        lvlStr = 'ยศ: COMMANDER (ผู้กุมกำลังพล)';
        break;
      case 'CEO':
        rankRole = 'Chief Executive Officer (ประธานอาวุโสสูงสุด)';
        lvlStr = 'ยศ: CEO (ประธานสูงสุดระดับ 99)';
        break;
    }

    const updatedMembers = members.map(m => {
      if (m.email === email) {
        return { ...m, rank: newRank, role: rankRole };
      }
      return m;
    });
    setMembers(updatedMembers);

    // If updating the active logged-in user
    if (email === googleEmail) {
      setProfileRole(rankRole);
      setProfileLevel(lvlStr);
      setMemberRank(newRank);
      localStorage.setItem('feline_profile_role', rankRole);
      localStorage.setItem('feline_profile_level', lvlStr);
      localStorage.setItem('feline_gmail_rank', newRank);
    }

    handleAddLog(`ADMIN PROMOTION: Member ${email} rank updated to [${newRank}] by Administrator.`, 'Command', 'success');
  };

  const triggerEmergencyCatnip = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {}

    handleAddLog("EMERGENCY CATNIP ACTIVATED: Whiskers demanded immediate tuna treat supply!", 'Command', 'error');
    alert("🐱 CEO WHISKERS DEMANDED IMMEDIATE CATNIP & TUNA SUPREME! Emergency systems overloaded with purring.");
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'marketing':
        return <MarketingPage />;
      case 'finance':
        return (
          <FinancePage 
            trades={trades} 
            onAddTrade={handleAddTrade} 
            onUpdateTrade={handleUpdateTrade} 
            onDeleteTrade={handleDeleteTrade}
            onSimulateTrade={(buy, sell) => handleAddTrade({
              itemName: 'Simulated Custom Skin',
              wear: 'Factory New',
              type: 'other',
              buyDate: new Date().toISOString().split('T')[0],
              targetSellDate: new Date().toISOString().split('T')[0],
              buyPrice: buy,
              buyFeePct: 2.0,
              sellPrice: sell,
              sellFeePct: 5.0,
              status: 'holding'
            })}
          />
        );
      case 'risk':
        return <RiskPage />;
      case 'operations':
        return (
          <OperationsPage 
            agents={agents} 
            missions={missions} 
            onDeployAgent={handleDeployAgent} 
            onAddLog={handleAddLog}
            onAddMission={handleAddMission}
            onUpdateMission={handleUpdateMission}
          />
        );
      case 'sheets':
        return (
          <SheetsSyncPage 
            sheetUrl={sheetUrl}
            onSetSheetUrl={(url) => {
              setSheetUrl(url);
              localStorage.setItem('feline_sheet_url', url);
            }}
            onSyncCSV={handleSyncCSV}
            onAddLog={handleAddLog}
          />
        );
      case 'members':
        // NEW dedicated Organization & Rank Appointing interface (ระบบยศสมาชิก)
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#938ea1] font-mono text-[10px] mb-1">
                  <span>SYSTEM_CORE</span>
                  <span className="text-[12px]">&gt;</span>
                  <span className="text-[#cabeff] uppercase font-bold">Organization & Ranks (สารบบยศและสมาชิก)</span>
                </div>
                <h2 className="font-sans text-xl font-bold text-white tracking-tight">Feline Secure Directory</h2>
              </div>
              
              <div className="flex items-center gap-2.5 bg-[#14121b] border border-[#484555] px-3.5 py-1.5 rounded text-xs font-mono">
                <ShieldAlert className={`w-4 h-4 ${isAdminMode ? 'text-[#F59E0B] animate-pulse' : 'text-gray-500'}`} />
                <span className="text-gray-400">ADMIN MODE:</span>
                <button 
                  onClick={() => {
                    const nextMode = !isAdminMode;
                    setIsAdminMode(nextMode);
                    localStorage.setItem('feline_admin_mode', String(nextMode));
                  }}
                  className={`px-2 py-0.5 rounded font-black text-[10px] uppercase transition-all ${
                    isAdminMode ? 'bg-[#F59E0B] text-black' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {isAdminMode ? 'ACTIVE 🔑' : 'OFF 🔒'}
                </button>
              </div>
            </div>

            <div className="bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-5 rounded-lg shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[#cabeff]" />
              
              <div className="flex justify-between items-center border-b border-[#484555]/60 pb-3 mb-4">
                <h3 className="font-sans text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#cabeff]" /> รายชื่อสมาชิกและยศในระดับสมาคมสายลับ
                </h3>
                <span className="font-mono text-[10px] text-gray-400">{members.length} สมาชิกเชื่อมต่อ</span>
              </div>

              {!isAdminMode && (
                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 mb-4 rounded text-xs font-mono text-blue-300 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>คำเตือน: กรุณาเปิดสิทธิ์ "ADMIN MODE" ที่ปุ่มขวาบน เพื่อแต่งตั้ง/ปรับแต่งระบบยศสมาชิกในองค์กรเนี้ยว!</span>
                </div>
              )}

              <div className="space-y-3.5">
                {members.map((member, idx) => {
                  const isSelf = member.email === googleEmail;
                  return (
                    <div 
                      key={idx} 
                      className="p-3.5 bg-[#0F1117] border border-[#484555]/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 border-2 border-[#484555] overflow-hidden rounded-full bg-black shrink-0 relative">
                          <img src={member.avatarUrl} className="w-full h-full object-cover" alt="" />
                          {isSelf && (
                            <span className="absolute -bottom-1 -right-1 bg-[#10B981] text-white text-[7px] font-bold px-1 rounded-full border border-black animate-pulse">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-left">
                          <h4 className="text-white font-bold text-sm flex items-center gap-1.5 font-sans">
                            {member.name}
                            <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded ${
                              member.rank === 'CEO' ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30' :
                              member.rank === 'COMMANDER' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30' :
                              member.rank === 'ELITE' ? 'bg-[#cabeff]/15 text-[#cabeff] border border-[#cabeff]/30' :
                              'bg-white/10 text-gray-400'
                            }`}>
                              ยศ: {member.rank}
                            </span>
                          </h4>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{member.email}</p>
                          <p className="text-[10px] text-gray-500 font-mono italic">// {member.role}</p>
                        </div>
                      </div>

                      {/* Admin Appoint Rank controls */}
                      <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs">
                        {isAdminMode ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#F59E0B] font-bold">แต่งตั้งยศใหม่:</span>
                            <select 
                              value={member.rank}
                              onChange={(e) => handleUpdateMemberRank(member.email, e.target.value)}
                              className="bg-[#14121b] border-2 border-[#F59E0B]/40 hover:border-[#F59E0B] text-white rounded font-bold px-2 py-1 text-xs focus:outline-none"
                            >
                              <option value="RECRUIT">RECRUIT (เด็กฝึกงาน)</option>
                              <option value="AGENT">AGENT (สายลับเจ้าหน้าที่)</option>
                              <option value="ELITE">ELITE (ยอดฝีมือปลาทูน่า)</option>
                              <option value="COMMANDER">COMMANDER (ผู้กุมกำลังพล)</option>
                              <option value="CEO">CEO (ประธานสูงสุด)</option>
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Award className="w-4 h-4 text-gray-600" />
                            <span>สิทธิ์แอดมินถูกปิดล็อก</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <CommandCenter 
            trades={trades} 
            logs={logs} 
            onAddLog={handleAddLog} 
            agents={agents}
            missions={missions}
            onDeployAgent={handleDeployAgent}
            onUpdateMissionProgress={handleUpdateMissionProgress}
          />
        );
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#0F1117] text-[#e6e0ee] flex flex-col font-sans select-none antialiased">
      
      {/* Top Main Command Bar */}
      <header id="main-header" className="bg-[#1A1D27] border-b-2 border-[#484555] px-5 py-3.5 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce" style={{ animationDuration: '4s' }}>🦁</span>
            <span className="font-sans text-base font-bold text-white tracking-wider uppercase flex items-center gap-2">
              FELINE COMMAND <span className="text-[#F59E0B] font-mono text-[10px]">// CEO EDITION</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-3.5 pl-6 border-l border-[#484555]">
            <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block animate-pulse" /> SYSTEM ONLINE
            </span>
            <span className="text-[11px] text-[#c9c4d8]/60 font-mono">UTC TIME: {systemTime}</span>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-4">
          {/* LOGIN GMAIL BUTTON (CONNECTOR) */}
          {isGoogleLoggedIn ? (
            <div className="hidden md:flex items-center gap-2 bg-[#10B981]/15 border border-[#10B981]/40 px-3 py-1 rounded-full text-[10px] font-mono text-emerald-300">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>GMAIL CONNECTED: {googleEmail}</span>
              <button 
                onClick={handleLogout} 
                className="ml-2 hover:text-red-400 font-black cursor-pointer uppercase"
                title="ลงชื่อออก"
              >
                [LOGOUT]
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                setLoginEmailInput('');
                setLoginNameInput('');
                setIsLoginModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-[#4285F4] hover:bg-[#357ae8] text-white font-sans font-black text-[10px] uppercase tracking-wider rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Key className="w-3.5 h-3.5" /> Login with Gmail
            </button>
          )}

          <div className="flex gap-2 text-gray-400">
            <button className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Profile pill */}
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 border border-[#484555] hover:border-[#cabeff] bg-black/20 hover:bg-black/40 pl-2 pr-3 py-1.5 rounded-full select-none cursor-pointer transition-all group relative"
            title="คลิกเพื่อแก้ไขโปรไฟล์"
          >
            <img 
              className="w-6 h-6 rounded-full border border-white/20 object-cover bg-black" 
              alt={profileName}
              src={profileImage}
              referrerPolicy="no-referrer"
            />
            <div className="text-left leading-none">
              <div className="text-white font-bold font-sans text-[10px] flex items-center gap-1">
                {profileName}
                <span className="opacity-40 group-hover:opacity-100 transition-opacity text-[8px] text-[#cabeff]">✏️</span>
              </div>
              <div className="text-[8px] text-[#F59E0B] font-mono mt-0.5">{profileLevel}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Screen Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside id="sidebar-nav" className="w-full md:w-60 bg-[#1A1D27] border-r-2 border-[#484555] flex flex-col justify-between p-4 relative z-10 shrink-0">
          
          <div className="space-y-6">
            
            {/* CEO Banner image */}
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="border-2 border-[#484555] hover:border-[#cabeff] bg-black/45 overflow-hidden group relative rounded-lg flex flex-col items-center p-3 text-center cursor-pointer transition-all"
              title="คลิกเพื่อแก้ไขโปรไฟล์"
            >
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <span className="text-white text-[9px] font-mono font-bold border border-white/20 px-2 py-1 rounded bg-[#1A1D27]/90 flex items-center gap-1">
                  EDIT PROFILE ✏️
                </span>
              </div>
              <div className="w-16 h-16 border-2 border-[#cabeff]/40 overflow-hidden rounded-full mb-2 bg-[#0F1117]">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 bg-black"
                  alt={profileName}
                  src={profileImage}
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-sans text-xs font-bold text-white tracking-wider uppercase truncate max-w-full">{profileName}</h3>
              <p className="text-[9px] font-mono text-gray-400 mt-0.5 truncate max-w-full">// {profileRole}</p>
              {isGoogleLoggedIn && (
                <div className="mt-2 text-[8px] font-mono bg-[#10B981]/15 text-emerald-300 border border-[#10B981]/25 px-2 py-0.5 rounded-full uppercase font-black">
                  GMAIL MEMBER
                </div>
              )}
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-1.5">
              {[
                { id: 'command', label: 'Command Center', icon: Terminal, color: 'text-[#cabeff]' },
                { id: 'members', label: 'Organization & Ranks', icon: Users, color: 'text-[#22C55E]' }, // NEW
                { id: 'marketing', label: 'Marketing Strat', icon: Megaphone, color: 'text-[#FF61D2]' },
                { id: 'finance', label: 'Skin Trading Log', icon: TrendingUp, color: 'text-[#F59E0B]' },
                { id: 'risk', label: 'Risk Analyzer', icon: Shield, color: 'text-[#EF4444]' },
                { id: 'operations', label: 'Operations Hub', icon: Wrench, color: 'text-[#3b82f6]' },
                { id: 'sheets', label: 'Sheets Sync', icon: FileSpreadsheet, color: 'text-[#10B981]' }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`w-full text-left px-3 py-2.5 font-mono text-xs font-bold rounded flex items-center gap-3 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#201e28] text-white border-l-4 border-l-[#cabeff]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} /> {item.label}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Emergency Alert Button */}
          <div className="pt-6 border-t border-[#484555]/60 mt-6">
            {isGoogleLoggedIn && (
              <div className="p-2 mb-3 bg-black/40 border border-[#484555]/50 rounded text-center text-[10px] font-mono text-gray-400">
                Logged in as:<br/>
                <span className="text-[#cabeff] truncate block">{googleEmail}</span>
              </div>
            )}
            <button 
              onClick={triggerEmergencyCatnip}
              className="w-full py-3 bg-[#EF4444] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-[0_4px_0_0_#991b1b] hover:translate-y-px hover:shadow-[0_2px_0_0_#991b1b] active:translate-y-0.5 active:shadow-none transition-all rounded animate-pulse cursor-pointer"
            >
              🚨 EMERGENCY CATNIP
            </button>
          </div>

        </aside>

        {/* Active Tab Frame Viewport */}
        <main id="app-viewport" className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#0F1117] relative">
          {renderActiveTabContent()}
        </main>

      </div>

      {/* Profile Editing Modal (With custom file profile picture uploader) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D27] border-2 border-[#484555] rounded-lg shadow-2xl p-6 w-full max-w-md relative font-mono text-xs text-[#e6e0ee]">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#cabeff]"></div>
            
            <h3 className="font-sans text-sm font-bold text-[#cabeff] border-b border-[#484555] pb-3 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span>✏️ EDIT PROFILE // SECURE USER CORE</span>
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">ชื่อโปรไฟล์ / Display Name</label>
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">ตำแหน่ง / Role Title</label>
                <input 
                  type="text" 
                  value={tempRole} 
                  onChange={(e) => setTempRole(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">ระดับ / Rank Level</label>
                <input 
                  type="text" 
                  value={tempLevel} 
                  onChange={(e) => setTempLevel(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white focus:border-[#cabeff] focus:outline-none"
                />
              </div>

              {/* Upload Profile Pic Custom (อัพรูปโปรไฟล์เองได้จริง) */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px] text-[#22C55E]">📷 อัปโหลดรูปโปรไฟล์ของคุณเอง / Upload Own Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleBase64Upload(e, setTempImage)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#cabeff]"
                />
              </div>

              {/* Or Custom URL */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase text-[10px]">หรือใส่ลิ้งก์รูปภาพ (Image URL)</label>
                <input 
                  type="text" 
                  value={tempImage} 
                  onChange={(e) => setTempImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white text-[11px] focus:border-[#cabeff] focus:outline-none"
                />
              </div>

              {/* Preset Avatar Grid */}
              <div>
                <label className="block text-gray-400 font-bold mb-2 uppercase text-[10px]">เลือกรูปแมวน่ารัก / Feline Presets</label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTempImage(avatar.url)}
                      className={`w-11 h-11 rounded-full border-2 overflow-hidden transition-all bg-black flex items-center justify-center cursor-pointer ${
                        tempImage === avatar.url ? 'border-[#cabeff] scale-110 shadow-md shadow-[#cabeff]/20' : 'border-[#484555] hover:border-gray-400'
                      }`}
                      title={avatar.name}
                    >
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#484555]">
              <button 
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 border border-[#484555] text-gray-400 hover:text-white rounded hover:bg-white/5 font-sans cursor-pointer"
              >
                ยกเลิก / Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  const nameVal = tempName.trim() || 'CEO Whiskers';
                  const imgVal = tempImage.trim() || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8Ve5m3Ih0WqEpktNygSXsTIKBt_1tSLnsVBA6b28Utg_NP-k1kjdR_8uh5oG4FOVK0Xey1O6TMShLP0j_QfJdlNA6kn23AftUcNbHQ7FgdoHCCPFfcuW4c3KJ51Ker5YBAYcEfsj78DAAnCQgsVgZvxQTL22dZy8QjitNhPLfiC6lIKS3kErL7b3sJWxPh91ARijqTAs_OeLWzt1SKJUU0AetsqZqJwCI-G_bXUo6ENSMqRYMfi6U-N-t3e3pmSuIj4RKSykxcrq';
                  const roleVal = tempRole.trim() || 'CHIEF EXECUTIVE OFFICER';
                  const lvlVal = tempLevel.trim() || 'LVL_99 TYCOON';

                  setProfileName(nameVal);
                  setProfileImage(imgVal);
                  setProfileRole(roleVal);
                  setProfileLevel(lvlVal);
                  
                  localStorage.setItem('feline_profile_name', nameVal);
                  localStorage.setItem('feline_profile_image', imgVal);
                  localStorage.setItem('feline_profile_role', roleVal);
                  localStorage.setItem('feline_profile_level', lvlVal);

                  // Update self in member directory too if logged in
                  if (isGoogleLoggedIn && googleEmail) {
                    const updatedMembers = members.map(m => {
                      if (m.email === googleEmail) {
                        return { ...m, name: nameVal, avatarUrl: imgVal };
                      }
                      return m;
                    });
                    setMembers(updatedMembers);
                  }
                  
                  handleAddLog(`Profile updated successfully to "${nameVal}".`, 'Command', 'success');
                  setIsProfileModalOpen(false);
                }}
                className="px-4 py-2 bg-[#cabeff] text-[#32009a] hover:brightness-110 font-bold rounded font-sans cursor-pointer"
              >
                บันทึก / Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gmail Connection Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D27] border-2 border-[#4285F4] rounded-lg shadow-2xl p-6 w-full max-w-sm relative font-mono text-xs text-[#e6e0ee]">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#4285F4]" />
            
            <div className="flex justify-between items-start mb-4 border-b border-[#484555] pb-2">
              <h3 className="font-sans text-sm font-black text-[#4285F4] uppercase tracking-wider flex items-center gap-2">
                <span>🔑 CONNECT GMAIL / GOOGLE SECURE</span>
              </h3>
            </div>

            <form onSubmit={handleGoogleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">อีเมล Gmail ของคุณ / Gmail Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="เช่น somchai@gmail.com"
                  value={loginEmailInput}
                  onChange={(e) => setLoginEmailInput(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white text-xs focus:border-[#4285F4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">ชื่อจริง / Display Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="เช่น สมชาย สายส่อง"
                  value={loginNameInput}
                  onChange={(e) => setLoginNameInput(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-3 py-2 text-white text-xs focus:border-[#4285F4] focus:outline-none"
                />
              </div>

              {/* File upload profile pic */}
              <div>
                <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px] text-[#22C55E]">📷 อัปโหลดรูปโปรไฟล์ / Upload Profile Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleBase64Upload(e, setTempImage)}
                  className="w-full bg-[#0F1117] border border-[#484555] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#4285F4]"
                />
              </div>

              {/* Preset quick select */}
              <div>
                <label className="block text-gray-400 font-bold mb-1 uppercase text-[10px]">หรือเลือกแมวสายลับตัวโปรด</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTempImage(avatar.url)}
                      className={`w-9 h-9 rounded-full border overflow-hidden transition-all bg-black flex items-center justify-center cursor-pointer ${
                        tempImage === avatar.url ? 'border-[#4285F4] scale-110' : 'border-gray-600'
                      }`}
                      title={avatar.name}
                    >
                      <img src={avatar.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#484555] mt-4">
                <button 
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="px-3 py-1.5 border border-[#484555] text-gray-400 hover:text-white rounded hover:bg-white/5 font-sans cursor-pointer"
                >
                  ยกเลิก / Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-[#4285F4] hover:bg-[#357ae8] text-white font-bold rounded font-sans cursor-pointer flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" /> เข้าร่วมองค์กร / Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
