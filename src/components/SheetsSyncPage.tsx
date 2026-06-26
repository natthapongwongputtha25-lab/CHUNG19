import React, { useState } from 'react';
import { Database, FileSpreadsheet, RefreshCw, CheckCircle2, AlertTriangle, Play, Copy, Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { DEMO_SHEET_CSV } from '../data';

interface SheetsSyncPageProps {
  sheetUrl: string;
  onSetSheetUrl: (url: string) => void;
  onSyncCSV: (csvText: string) => void;
  onAddLog: (msg: string, dept: 'System', level: 'info' | 'success' | 'error') => void;
}

export default function SheetsSyncPage({ sheetUrl, onSetSheetUrl, onSyncCSV, onAddLog }: SheetsSyncPageProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [guideMethod, setGuideMethod] = useState<'publish' | 'appscript'>('appscript');
  const [copied, setCopied] = useState(false);

  // Async simulated network fetch
  const handleSyncNow = async (isDemo: boolean) => {
    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncProgress(10);
    onAddLog('Initiating Google Sheets synchronization protocols...', 'System', 'info');

    try {
      // Simulate progress ticks
      const intervals = [
        { progress: 35, delay: 600 },
        { progress: 60, delay: 1100 },
        { progress: 85, delay: 1700 },
        { progress: 100, delay: 2200 }
      ];

      for (const step of intervals) {
        await new Promise(resolve => setTimeout(resolve, step.delay - (intervals[intervals.indexOf(step) - 1]?.delay || 0)));
        setSyncProgress(step.progress);
      }

      if (!isDemo && !sheetUrl.trim()) {
        throw new Error("ลิ้งก์ URL ของแผ่นงานว่างเปล่า กรุณากรอก URL เพื่อดำเนินการต่อ");
      }

      // If it's a real sheet URL, try to fetch it
      let csvContent = DEMO_SHEET_CSV;
      if (!isDemo && sheetUrl.trim()) {
        const response = await fetch(sheetUrl);
        if (!response.ok) {
          throw new Error("ไม่สามารถดาวน์โหลดไฟล์จากลิ้งก์ที่กำหนดได้ โปรดตรวจสอบความถูกต้องของ URL และตรวจสอบการตั้งค่าความปลอดภัยของแผ่นงาน");
        }
        csvContent = await response.text();
      }

      onSyncCSV(csvContent);
      setSyncStatus('success');
      onAddLog('Google Sheets synchronization complete. Database updated successfully.', 'System', 'success');
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      onAddLog(`Sync error: ${err.message || 'Unknown integration error'}`, 'System', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyCode = () => {
    const codeText = `function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var csvText = "";
  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var rowValues = [];
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      var str = "";
      if (cell instanceof Date) {
        str = Utilities.formatDate(cell, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else if (cell !== null && cell !== undefined) {
        str = cell.toString();
      }
      if (str.indexOf(",") !== -1 || str.indexOf('"') !== -1 || str.indexOf('\\n') !== -1) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      rowValues.push(str);
    }
    csvText += rowValues.join(",") + "\\n";
  }
  
  return ContentService.createTextOutput(csvText)
    .setMimeType(ContentService.MimeType.TEXT);
}`;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAddLog('คัดลอกโค้ด Google Apps Script ไปยังคลิปบอร์ดแล้ว', 'System', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Visual CRT Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#938ea1] font-mono text-[10px] mb-1">
            <span>HQ</span>
            <span className="text-[12px]">&gt;</span>
            <span className="text-[#10B981] uppercase font-bold">External Connections (การเชื่อมต่อข้อมูลภายนอก)</span>
          </div>
          <h2 className="font-sans text-xl font-bold text-white tracking-tight">Google Sheets Data Synchronization</h2>
        </div>
        <div className="bg-[#14121b] border border-[#484555] px-4 py-1.5 flex items-center gap-2.5 rounded">
          <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
          <span className="font-mono text-xs text-[#e6e0ee]">SHEET ENGINE STABLE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Sync Controller */}
        <div className="lg:col-span-7 bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-5 rounded-lg shadow-lg flex flex-col justify-between min-h-[440px]">
          <div className="space-y-6">
            <h3 className="font-sans text-sm font-bold text-[#10B981] uppercase tracking-wider border-b border-[#484555] pb-3 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#10B981]" /> เชื่อมต่อคลังสินค้าอัจฉริยะ (Google Sheets Integration)
            </h3>

            {/* Input URL */}
            <div className="space-y-2">
              <label className="block font-mono text-xs text-gray-300 font-bold uppercase">Google Sheets CSV URL / Apps Script URL</label>
              <input 
                type="text" 
                placeholder="https://script.google.com/macros/s/.../exec หรือ https://docs.google.com/..."
                value={sheetUrl}
                onChange={e => onSetSheetUrl(e.target.value)}
                disabled={isSyncing}
                className="w-full bg-[#0F1117] border-2 border-[#484555] rounded font-mono text-xs p-3 text-white focus:border-[#10B981] focus:outline-none disabled:opacity-50"
              />
              <p className="font-mono text-[10px] text-gray-500">ใส่ลิงก์ที่เผยแพร่แบบ CSV หรือ URL ของ Google Apps Script Web App เพื่อทำการซิงก์ข้อมูล</p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button 
                onClick={() => handleSyncNow(false)}
                disabled={isSyncing}
                className="py-3 bg-[#10B981] text-black font-sans font-bold text-xs uppercase shadow-[0_4px_0_0_#065f46] hover:translate-y-px hover:shadow-[0_2px_0_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all rounded disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> ดึงข้อมูลจริงตอนนี้
              </button>

              <button 
                onClick={() => handleSyncNow(true)}
                disabled={isSyncing}
                className="py-3 bg-[#cabeff] text-[#32009a] font-sans font-bold text-xs uppercase shadow-[0_4px_0_0_#4918c8] hover:translate-y-px hover:shadow-[0_2px_0_0_#4918c8] active:translate-y-0.5 active:shadow-none transition-all rounded disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" /> ใช้ข้อมูลจำลองสำหรับทดสอบ (Demo Sync)
              </button>
            </div>
          </div>

          {/* Sync Status Progress Overlay / Feedback */}
          <div className="pt-5 border-t border-[#484555]/60 mt-6">
            {isSyncing ? (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center font-mono text-xs text-gray-400 font-bold uppercase">
                  <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin text-[#10B981]" /> กำลังทำการดาวน์โหลดและประสานข้อมูล...</span>
                  <span className="text-[#10B981]">{syncProgress}%</span>
                </div>
                <div className="h-3.5 bg-black/60 border border-[#484555] p-0.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#10B981] shadow-[0_0_8px_#10B981] rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            ) : syncStatus === 'success' ? (
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/40 p-4 rounded flex items-start gap-3.5 font-mono text-xs text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#22C55E] text-sm uppercase block mb-1">ซิงก์ข้อมูลสำเร็จ (SYNCHRONIZATION COMPLETED)</span>
                  ระบบได้อัปเดตข้อมูลสกิน คลังสินค้า และคำนวณสถิติทางการเงินทั้งหมดในศูนย์บัญชาการเสร็จสมบูรณ์เรียบร้อยแล้ว!
                </div>
              </div>
            ) : syncStatus === 'error' ? (
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/40 p-4 rounded flex items-start gap-3.5 font-mono text-xs text-gray-300">
                <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#EF4444] text-sm uppercase block mb-1">เกิดข้อผิดพลาดในการประสานข้อมูล (SYNC FAILED)</span>
                  กรุณาตรวจสอบว่าลิ้งก์แผ่นงานถูกต้อง มีรูปแบบคอลัมน์ที่ระบบกำหนด และแผ่นงานนั้นได้รับการเผยแพร่หรือเปิดให้สิทธิ์เข้าถึงแล้ว
                </div>
              </div>
            ) : (
              <div className="p-3 bg-black/20 border border-[#484555]/40 rounded font-mono text-[11px] text-gray-500 text-center">
                คลังสินค้ากำลังเชื่อมข้อมูลด้วย LOCAL PERSISTENT STORAGE
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Setup Guide */}
        <div className="lg:col-span-5 bg-[#1A1D27]/80 backdrop-blur-md border-2 border-[#484555] p-5 rounded-lg shadow-lg font-mono text-xs space-y-4">
          
          {/* GAS Export File Download Section */}
          <div className="bg-[#1D212F] border-2 border-[#cabeff]/40 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm animate-pulse">🦁</span>
              <h4 className="font-sans font-bold text-xs text-[#cabeff] uppercase tracking-wide">Feline Terminal - GAS Edition</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-300">
              หน้าเว็บเทมเพลตสำรองแบบพกพา <code className="text-[#10B981] bg-black/40 px-1 py-0.5 rounded font-mono">gas-export.html</code> ที่ถูกจัดเตรียมไว้สำหรับนำรหัส HTML ไปวางในระบบ Google Apps Script เพื่อเปิดใช้งานเว็บแอปคุมงานส่วนตัวของคุณได้ทันที!
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a 
                href="/gas-export.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="py-2 px-2.5 bg-[#cabeff] hover:brightness-110 text-[#32009a] font-sans font-black text-[10px] uppercase rounded text-center transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                🌐 เปิดในแท็บใหม่
              </a>
              <a 
                href="/gas-export.html" 
                download="gas-export.html"
                className="py-2 px-2.5 bg-[#10B981] hover:brightness-110 text-black font-sans font-black text-[10px] uppercase rounded text-center transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                📥 ดาวน์โหลดไฟล์
              </a>
            </div>
          </div>

          <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider border-b border-[#484555] pb-2.5 flex items-center gap-1.5">
            📋 วิธีเชื่อมโยง Google Sheets
          </h3>

          {/* Toggle Tab */}
          <div className="grid grid-cols-2 gap-1.5 bg-black/45 p-1 rounded border border-[#484555]">
            <button
              onClick={() => setGuideMethod('appscript')}
              className={`py-1.5 px-1.5 text-[10px] font-sans font-bold transition-all rounded cursor-pointer ${
                guideMethod === 'appscript'
                  ? 'bg-[#10B981] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🔒 Google Apps Script (ปลอดภัยสูงสุด)
            </button>
            <button
              onClick={() => setGuideMethod('publish')}
              className={`py-1.5 px-1.5 text-[10px] font-sans font-bold transition-all rounded cursor-pointer ${
                guideMethod === 'publish'
                  ? 'bg-[#cabeff] text-[#32009a] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🌐 Publish to Web (แบบดั้งเดิม)
            </button>
          </div>

          {guideMethod === 'appscript' ? (
            <div className="space-y-3.5 text-[11px] leading-relaxed text-[#c9c4d8]/85">
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 p-2.5 rounded text-[10px] text-gray-300">
                <span className="text-[#10B981] font-bold block mb-1">🛡️ ข้อดีของ Google Apps Script:</span>
                คุณไม่จำเป็นต้องเปิดเผยแผ่นงาน Google Sheets เป็นสาธารณะสู่เว็บ! แผ่นงานจะคงเป็นส่วนตัวอย่างปลอดภัย แต่ระบบยังสามารถข้ามผ่าน CORS เพื่อดึงข้อมูลได้ทันที
              </div>

              <ol className="space-y-3 list-decimal list-inside">
                <li>
                  ในหน้า Google Sheet ของคุณ ให้คลิกเมนู <span className="text-white font-bold">ส่วนขยาย (Extensions)</span> &gt; <span className="text-white font-bold">Apps Script</span>
                </li>
                <li>
                  ลบโค้ดเริ่มต้นทั้งหมดในโปรแกรมแก้ไข แล้ววางโค้ดด้านล่างนี้:
                </li>
              </ol>

              {/* Code block with copy button */}
              <div className="relative border border-[#484555] rounded bg-black/60 p-2.5 space-y-2">
                <div className="flex justify-between items-center text-[9px] text-gray-400 pb-1.5 border-b border-[#484555]/60 font-mono">
                  <span>Code.gs (รหัส.gs)</span>
                  <button
                    onClick={handleCopyCode}
                    className="px-2 py-1 bg-white/5 hover:bg-white/15 border border-[#484555] rounded text-white flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-[#10B981]" />
                        <span className="text-[#10B981] font-bold">คัดลอกแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gray-400" />
                        <span>คัดลอกโค้ด</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[9px] text-[#10B981] overflow-x-auto max-h-[160px] font-mono leading-normal p-1 scrollbar-thin select-all">
{`function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var csvText = "";
  
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var rowValues = [];
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      var str = "";
      if (cell instanceof Date) {
        str = Utilities.formatDate(cell, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else if (cell !== null && cell !== undefined) {
        str = cell.toString();
      }
      if (str.indexOf(",") !== -1 || str.indexOf('"') !== -1 || str.indexOf('\\n') !== -1) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      rowValues.push(str);
    }
    csvText += rowValues.join(",") + "\\n";
  }
  
  return ContentService.createTextOutput(csvText)
    .setMimeType(ContentService.MimeType.TEXT);
}`}
                </pre>
              </div>

              <ol start={3} className="space-y-3 list-decimal list-inside">
                <li>
                  กดปุ่ม <span className="text-white font-bold">บันทึกโครงการ (รูปแผ่นดิสก์)</span>
                </li>
                <li>
                  คลิกปุ่ม <span className="text-white font-bold">การทำให้ใช้งานได้ (Deploy)</span> &gt; <span className="text-white font-bold">การทำให้ใช้งานได้ใหม่ (New deployment)</span>
                </li>
                <li>
                  เลือกประเภท (รูปฟันเฟือง) เป็น <span className="text-[#10B981] font-bold">เว็บแอป (Web app)</span>
                </li>
                <li>
                  กำหนดค่าดังนี้:
                  <ul className="list-disc list-inside pl-4 mt-1 text-[10px] space-y-1 text-gray-400">
                    <li>เรียกใช้ในฐานะ: <span className="text-white">ฉัน (อีเมลของคุณ)</span></li>
                    <li>ผู้มีสิทธิ์เข้าถึง: <span className="text-[#10B981] font-bold">ทุกคน (Anyone)</span></li>
                  </ul>
                </li>
                <li>
                  กดปุ่ม <span className="text-[#10B981] font-bold">ทำให้ใช้งานได้ (Deploy)</span> และกดมอบอำนาจสิทธิ์ (หากมีกล่องข้อความเตือนความปลอดภัย ให้คลิก <span className="italic">Advanced &gt; Go to... (unsafe)</span> แล้วกด <span className="text-[#10B981]">Allow</span>)
                </li>
                <li>
                  คัดลอก <span className="text-white font-bold">URL ของเว็บแอป</span> (ที่ลงท้ายด้วย <code className="text-[#10B981]">/exec</code>) แล้วนำมาวางในช่องป้อนข้อมูลทางด้านซ้ายเพื่อประสานข้อมูล!
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3.5 text-[11px] leading-relaxed text-[#c9c4d8]/85">
              <ol className="space-y-3.5 list-decimal list-inside">
                <li>
                  <span className="text-white font-bold">เปิดเอกสาร Google Sheets</span> ของคุณที่มีคอลัมน์สินค้าสกิน CS2
                </li>
                <li>
                  ไปที่เมนูด้านซ้ายบน เลือก <span className="text-[#10B981] font-bold">ไฟล์ (File)</span> &gt; <span className="text-[#10B981] font-bold">แชร์ (Share)</span> &gt; <span className="text-[#10B981] font-bold">เผยแพร่ทางเว็บ (Publish to web)</span>
                </li>
                <li>
                  ในแถบตั้งค่า ให้เลือกเปลี่ยนจาก "หน้าเว็บทั้งหมด" เป็นเฉพาะแผ่นงานที่ใช้งาน และตั้งค่าประเภทเป็น <span className="text-[#10B981] font-bold">ค่าคั่นด้วยจุลภาค (.csv)</span>
                </li>
                <li>
                  กดปุ่ม <span className="text-[#10B981] font-bold">เผยแพร่ (Publish)</span> และกดยืนยันเพื่อเปิดการเข้าถึงแบบสาธารณะ
                </li>
                <li>
                  <span className="text-white font-bold">คัดลอกลิงก์</span> ที่ปรากฏในกรอบนั้น และนำมาวางลงในช่องป้อนข้อมูลทางด้านซ้ายเพื่อซิงก์ข้อมูล!
                </li>
              </ol>
            </div>
          )}

          <div className="bg-black/30 border border-[#484555]/60 p-3 rounded space-y-1.5 text-[10px]">
            <span className="text-gray-400 font-bold block">💡 รูปแบบหัวคอลัมน์ที่กำหนดใน Google Sheets:</span>
            <code className="text-[#10B981] block select-all font-bold">
              Item Name, Wear/Details, Type, Buy Date, Target Sell Date, Buy Price, Buy Fee %, Sell Price, Sell Fee %, Status
            </code>
          </div>
        </div>

      </div>
    </div>
  );
}
