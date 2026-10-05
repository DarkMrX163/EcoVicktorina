import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Download, 
  Printer, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Edit3, 
  Sparkles,
  TreePine,
  Trees,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { PlayerRank } from '../types';
import { saveUserProfile, getUserProfile } from '../utils/storage';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  settlement: string;
  score: number;
  correctPercentage: number;
  rank: PlayerRank;
  categoryTitle: string;
}

// Official Coat of Arms of Neftagorsk District, Samara Oblast (Yellow field, blue flames, black chevron, green field, golden wheat sheaf)
const NEFTEGORSK_EMBLEM_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500"><defs><clipPath id="shC"><path d="M 20,20 L 380,20 L 380,310 C 380,420 280,470 200,488 C 120,470 20,420 20,310 Z"/></clipPath><linearGradient id="gG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFE082"/><stop offset="50%" stop-color="%23FFB300"/><stop offset="100%" stop-color="%23E65100"/></linearGradient><linearGradient id="sG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23FFCA28"/><stop offset="100%" stop-color="%23F57F17"/></linearGradient></defs><g clip-path="url(%23shC)"><rect x="0" y="0" width="400" height="500" fill="%23FFDC00"/><path d="M 15,310 Q 25,270 32,230 Q 38,260 45,210 Q 55,250 68,180 Q 75,230 88,160 Q 98,220 112,130 Q 122,190 138,110 Q 148,180 162,80 Q 172,150 185,50 Q 192,100 200,20 Q 208,100 215,50 Q 228,150 238,80 Q 252,180 262,110 Q 278,190 288,130 Q 302,220 312,160 Q 325,230 332,180 Q 345,250 355,210 Q 362,260 368,230 Q 375,270 385,310 L 385,360 L 200,180 L 15,360 Z" fill="%23009BEA" stroke="%230077C8" stroke-width="2"/><path d="M 15,310 L 200,120 L 385,310 L 385,370 L 200,180 L 15,370 Z" fill="%231C1D21" stroke="%23FFDC00" stroke-width="3"/><path d="M 15,370 L 200,180 L 385,370 L 385,500 L 15,500 Z" fill="%23009A44"/><g transform="translate(200, 390)"><path d="M -22,10 C -15,40 0,75 0,82 C 0,75 15,40 22,10 Z" fill="url(%23sG)" stroke="%23D84315" stroke-width="1.5"/><rect x="-26" y="0" width="52" height="6" rx="2" fill="%23FFE082" stroke="%23E65100" stroke-width="1.5"/><rect x="-28" y="7" width="56" height="6" rx="2" fill="%23FFB300" stroke="%23E65100" stroke-width="1.5"/><rect x="-26" y="14" width="52" height="6" rx="2" fill="%23FFE082" stroke="%23E65100" stroke-width="1.5"/><g transform="translate(0, -60)"><path d="M 0,60 L 0,-60" stroke="%23FFB300" stroke-width="3"/><ellipse cx="-7" cy="-45" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="7" cy="-45" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="-8" cy="-25" rx="8" ry="13" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="8" cy="-25" rx="8" ry="13" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="0" cy="-62" rx="6" ry="10" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><path d="M 0,-70 L -12,-90 M 0,-70 L 0,-95 M 0,-70 L 12,-90" stroke="%23FFF59D" stroke-width="1.5"/></g><g transform="rotate(-20) translate(0, -55)"><path d="M 0,55 L 0,-50" stroke="%23FFB300" stroke-width="3"/><ellipse cx="-7" cy="-35" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="7" cy="-35" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="-8" cy="-15" rx="8" ry="13" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="8" cy="-15" rx="8" ry="13" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="0" cy="-50" rx="6" ry="10" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><path d="M 0,-58 L -12,-78 M 0,-58 L 10,-78" stroke="%23FFF59D" stroke-width="1.5"/></g><g transform="rotate(20) translate(0, -55)"><path d="M 0,55 L 0,-50" stroke="%23FFB300" stroke-width="3"/><ellipse cx="-7" cy="-35" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="7" cy="-35" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="-8" cy="-15" rx="8" ry="13" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="8" cy="-15" rx="8" ry="13" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="0" cy="-50" rx="6" ry="10" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><path d="M 0,-58 L -10,-78 M 0,-58 L 12,-78" stroke="%23FFF59D" stroke-width="1.5"/></g><g transform="rotate(-40) translate(0, -50)"><path d="M 0,50 L 0,-42" stroke="%23FFB300" stroke-width="3"/><ellipse cx="-7" cy="-28" rx="7" ry="11" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="7" cy="-28" rx="7" ry="11" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="-7" cy="-10" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="7" cy="-10" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="0" cy="-42" rx="5" ry="9" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><path d="M 0,-48 L -14,-66 M 0,-48 L 8,-66" stroke="%23FFF59D" stroke-width="1.5"/></g><g transform="rotate(40) translate(0, -50)"><path d="M 0,50 L 0,-42" stroke="%23FFB300" stroke-width="3"/><ellipse cx="-7" cy="-28" rx="7" ry="11" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="7" cy="-28" rx="7" ry="11" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="-7" cy="-10" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="7" cy="-10" rx="7" ry="12" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><ellipse cx="0" cy="-42" rx="5" ry="9" fill="url(%23gG)" stroke="%23D84315" stroke-width="1"/><path d="M 0,-48 L -8,-66 M 0,-48 L 14,-66" stroke="%23FFF59D" stroke-width="1.5"/></g></g></g><path d="M 20,20 L 380,20 L 380,310 C 380,420 280,470 200,488 C 120,470 20,420 20,310 Z" fill="none" stroke="%231C1D21" stroke-width="6"/></svg>`;

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  playerName,
  settlement,
  score,
  correctPercentage,
  rank,
  categoryTitle,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  // State for editable First Name & Patronymic
  const [fullName, setFullName] = useState<string>(playerName || '');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  useEffect(() => {
    if (playerName) {
      setFullName(playerName);
    }
  }, [playerName]);

  if (!isOpen) return null;

  // Handle saving updated name into profile & local state
  const handleSaveName = () => {
    setIsEditingName(false);
    const currentProfile = getUserProfile();
    saveUserProfile({
      ...currentProfile,
      name: fullName,
    });
  };

  // Pure HTML5 Canvas fallback in case html2canvas is blocked or fails
  const generateCanvasFallback = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background
    ctx.fillStyle = '#FAF8F2';
    ctx.fillRect(0, 0, 1200, 850);

    // Decorative Borders
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = 14;
    ctx.strokeRect(18, 18, 1164, 814);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, 1132, 782);

    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(44, 44, 1112, 762);
    ctx.setLineDash([]);

    // Draw Official Neftagorsk District Coat of Arms Emblem at top center (x: 600, y: 75)
    ctx.save();
    ctx.translate(600, 75);

    // Shield Clip Path (scaled to width ~50, height ~62)
    ctx.beginPath();
    ctx.moveTo(-25, -30);
    ctx.lineTo(25, -30);
    ctx.lineTo(25, 10);
    ctx.quadraticCurveTo(25, 28, 0, 35);
    ctx.quadraticCurveTo(-25, 28, -25, 10);
    ctx.closePath();
    ctx.clip();

    // 1. Yellow Top Background
    ctx.fillStyle = '#FFDC00';
    ctx.fillRect(-30, -35, 60, 70);

    // 2. Blue Flames
    ctx.fillStyle = '#009BEA';
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(-20, -15);
    ctx.lineTo(-12, -22);
    ctx.lineTo(-5, -28);
    ctx.lineTo(0, -32);
    ctx.lineTo(5, -28);
    ctx.lineTo(12, -22);
    ctx.lineTo(20, -15);
    ctx.lineTo(25, 10);
    ctx.closePath();
    ctx.fill();

    // 3. Black Chevron
    ctx.fillStyle = '#1C1D21';
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(0, -15);
    ctx.lineTo(25, 10);
    ctx.lineTo(25, 18);
    ctx.lineTo(0, -7);
    ctx.lineTo(-25, 18);
    ctx.closePath();
    ctx.fill();

    // 4. Emerald Green Lower Background
    ctx.fillStyle = '#009A44';
    ctx.beginPath();
    ctx.moveTo(-25, 18);
    ctx.lineTo(0, -7);
    ctx.lineTo(25, 18);
    ctx.lineTo(25, 35);
    ctx.lineTo(-25, 35);
    ctx.closePath();
    ctx.fill();

    // 5. Golden Wheat Sheaf
    ctx.fillStyle = '#FFB300';
    ctx.beginPath();
    ctx.arc(0, 18, 10, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#D84315';
    ctx.fillRect(-6, 18, 12, 3);
    ctx.fillStyle = '#FFE082';
    ctx.fillRect(-5, 21, 10, 2);

    ctx.restore();

    // Black Outer Border for Shield
    ctx.save();
    ctx.translate(600, 75);
    ctx.strokeStyle = '#1C1D21';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-25, -30);
    ctx.lineTo(25, -30);
    ctx.lineTo(25, 10);
    ctx.quadraticCurveTo(25, 28, 0, 35);
    ctx.quadraticCurveTo(-25, 28, -25, 10);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Header Title
    ctx.fillStyle = '#022c22';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('АДМИНИСТРАЦИЯ МУНИЦИПАЛЬНОГО РАЙОНА НЕФТЕГОРСКИЙ', 600, 182);

    ctx.fillStyle = '#44403c';
    ctx.font = '14px sans-serif';
    ctx.fillText('Самарская область • Отдел экологии и природных ресурсов', 600, 208);

    // Eco Badge Pill
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.roundRect(380, 222, 440, 28, [14]);
    ctx.fill();
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('• ЭКОЛОГИЧЕСКОЕ ПРОСВЕЩЕНИЕ И ГРАМОТНОСТЬ •', 600, 241);

    // Main Certificate Word
    ctx.fillStyle = '#022c22';
    ctx.font = 'bold 46px Georgia, serif';
    ctx.fillText('СЕРТИФИКАТ', 600, 298);

    ctx.fillStyle = '#047857';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('выдан за активное участие в районном экологическом тестировании', 600, 328);

    ctx.fillStyle = '#57534e';
    ctx.font = '15px sans-serif';
    ctx.fillText('Настоящим подтверждается, что', 600, 375);

    // Name
    ctx.fillStyle = '#022c22';
    ctx.font = 'bold 36px Georgia, serif';
    const nameText = fullName || playerName || 'Участник викторины';
    ctx.fillText(nameText, 600, 428);

    // Underline
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 442);
    ctx.lineTo(900, 442);
    ctx.stroke();

    // Achievement Phrase depending on category
    const lowerCategory = (categoryTitle || '').toLowerCase();
    let achievementPhrase = '';
    if (lowerCategory.includes('водопользование') || lowerCategory.includes('водн')) {
      achievementPhrase = 'Уверенные знания водоохранного законодательства';
    } else if (lowerCategory.includes('тко') || lowerCategory.includes('отход') || lowerCategory.includes('сортировк')) {
      achievementPhrase = 'Отличное понимание раздельного сбора отходов';
    }

    // Body
    ctx.fillStyle = '#1c1917';
    ctx.font = '16px sans-serif';
    ctx.fillText(`представляющий ${settlement || 'Нефтегорский район'},`, 600, 480);
    const canvasBodyText = achievementPhrase
      ? `успешно прошёл(ла) викторину «ЭкоНефтегорск» (${achievementPhrase}) по теме:`
      : `успешно прошёл(ла) викторину «ЭкоНефтегорск» по теме:`;
    ctx.fillText(canvasBodyText, 600, 512);

    // Category Pill
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.roundRect(350, 532, 500, 32, [12]);
    ctx.fill();
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#022c22';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`«${categoryTitle}»`, 600, 553);

    // Score Card
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.roundRect(220, 588, 760, 80, [16]);
    ctx.fill();
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Баллы: ${score}   |   Точность: ${correctPercentage}%   |   Ранг: ${rank.title}`, 600, 636);

    // Date & Stamp
    const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const certNum = `ЭКО-НФТ-${Math.floor(100000 + Math.random() * 900000)}`;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#57534e';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Дата выдачи: ${today}`, 70, 750);
    ctx.fillText(`Рег. номер: ${certNum}`, 70, 775);

    // Official 3D Stamp Circle
    ctx.save();
    ctx.translate(600, 745);
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.arc(0, 0, 43, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ОФИЦИАЛЬНО', 0, -14);
    ctx.font = 'black 11px sans-serif';
    ctx.fillText('ЭКО-СТАНДАРТ', 0, 2);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('НЕФТЕГОРСК', 0, 16);
    ctx.fillText('★ 2026 ★', 0, 28);
    ctx.restore();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#57534e';
    ctx.font = '14px sans-serif';
    ctx.fillText('Экологический контроль:', 1130, 745);
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Администрация м.р. Нефтегорский', 1130, 768);
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Подлинность подтверждена ✓', 1130, 790);

    return canvas.toDataURL('image/png', 0.95);
  };

  // Download certificate as high-res PNG image using html2canvas or pure Canvas
  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    setDownloadNote(null);

    const safeName = (fullName || 'Участник').trim().replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
    const filename = `Сертификат_ЭкоНефтегорск_${safeName}.png`;

    try {
      let dataUrl = '';

      if (certificateRef.current) {
        try {
          const canvas = await html2canvas(certificateRef.current, {
            scale: 2, // High resolution crisp export
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#FAF8F2',
            logging: false,
            windowWidth: 1200,
            windowHeight: 900,
            onclone: (clonedDoc) => {
              const el = clonedDoc.getElementById('printable-certificate');
              if (el) {
                // Lock exact desktop dimensions during canvas capture so mobile downloads are identical to desktop preview
                el.style.width = '1000px';
                el.style.maxWidth = '1000px';
                el.style.minWidth = '1000px';
                el.style.padding = '3.5rem';
                el.style.margin = '0 auto';
                el.style.borderRadius = '1.5rem';
                el.style.boxShadow = 'none';
              }
            },
          });
          dataUrl = canvas.toDataURL('image/png', 0.95);
        } catch (canvasErr) {
          console.warn('html2canvas error, switching to HTML5 canvas fallback', canvasErr);
          dataUrl = generateCanvasFallback();
        }
      } else {
        dataUrl = generateCanvasFallback();
      }

      setGeneratedImageUrl(dataUrl);

      // Attempt 1: Direct link click
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setDownloadNote('Файл сертификата успешно сформирован! Если скачивание не началось автоматически, воспользуйтесь кнопкой «Открыть готовое фото» ниже.');
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Ошибка при генерации изображения сертификата:', err);
      // Fallback: pure canvas
      try {
        const fallbackUrl = generateCanvasFallback();
        setGeneratedImageUrl(fallbackUrl);
        const link = document.createElement('a');
        link.download = filename;
        link.href = fallbackUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
        setDownloadNote('Сертификат сгенерирован! Нажмите «Открыть готовое фото» для сохранения.');
      } catch (fErr) {
        console.error('Final fallback error:', fErr);
        setDownloadNote('Автоскачивание заблокировано браузером. Пожалуйста, используйте кнопку «Печать / PDF» или откройте в новом окне.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Open generated image in new browser window for manual save/share
  const handleOpenImageInNewTab = () => {
    if (!generatedImageUrl) {
      // Generate on demand if not already rendered
      const img = generateCanvasFallback();
      setGeneratedImageUrl(img);
      const win = window.open();
      if (win) {
        win.document.write(`<title>Сертификат ЭкоНефтегорск</title><body style="margin:0;background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh;"><img src="${img}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);"/></body>`);
      }
      return;
    }

    const win = window.open();
    if (win) {
      win.document.write(`<title>Сертификат ЭкоНефтегорск</title><body style="margin:0;background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh;"><img src="${generatedImageUrl}" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);"/></body>`);
    }
  };

  // Native browser print / save as PDF
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const certificateNumber = `ЭКО-НФТ-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto print:bg-white print:p-0">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2.5rem !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-3xl my-6">
        
        {/* Modal Top Control Bar */}
        <div className="no-print bg-stone-900/90 border border-stone-800 rounded-2xl p-4 mb-3 text-white shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award className="w-5 h-5" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Официальный Экологический Сертификат
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPNG}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition active:scale-95 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Создаем PNG...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Скачано!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Скачать PNG</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition"
                title="Печать или Сохранить в PDF"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Печать / PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Edit Name & Patronymic Field */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">Имя и Отчество для сертификата:</span>
            </div>

            {isEditingName ? (
              <div className="flex items-center gap-2 w-full sm:w-auto grow max-w-md">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Введите Имя и Отчество"
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-emerald-500/60 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition"
                >
                  Готово
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  {fullName || 'Не указано'}
                </span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-emerald-400 hover:underline font-medium"
                >
                  Изменить
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            CERTIFICATE CARD (Beautiful Eco Style & High DPI Export Target)
           ========================================================================= */}
        <div
          id="printable-certificate"
          ref={certificateRef}
          className="relative bg-[#FAF8F2] text-stone-900 rounded-3xl p-6 sm:p-12 border-[10px] border-double border-emerald-900 shadow-2xl overflow-hidden font-serif select-none"
        >
          {/* Eco Sunbeam Light Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/5 via-teal-900/0 to-amber-900/5 pointer-events-none" />

          {/* Dual Gold & Pine Inner Frames */}
          <div className="absolute inset-3 rounded-2xl border-2 border-amber-600/30 pointer-events-none" />
          <div className="absolute inset-5 rounded-xl border border-dashed border-emerald-800/25 pointer-events-none" />

          {/* Decorative Corner Foliage Ornaments */}
          <div className="absolute top-5 left-5 text-emerald-800/40 pointer-events-none">
            <Trees className="w-8 h-8 -rotate-45" />
          </div>
          <div className="absolute top-5 right-5 text-emerald-800/40 pointer-events-none">
            <TreePine className="w-8 h-8 rotate-45" />
          </div>
          <div className="absolute bottom-5 left-5 text-emerald-800/40 pointer-events-none">
            <Leaf className="w-8 h-8 rotate-45" />
          </div>
          <div className="absolute bottom-5 right-5 text-emerald-800/40 pointer-events-none">
            <Leaf className="w-8 h-8 -rotate-45" />
          </div>

          {/* Subtle Watermark Symbol in Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none text-emerald-900">
            <Leaf className="w-96 h-96" />
          </div>

          {/* Header */}
          <div className="relative z-10 text-center space-y-1.5">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-20 p-0.5 flex items-center justify-center filter drop-shadow-md">
                <img src={NEFTEGORSK_EMBLEM_SVG} alt="Официальный герб Нефтегорского района" className="w-full h-full object-contain" />
              </div>
            </div>
            
            <p className="text-[10px] sm:text-xs font-sans font-extrabold uppercase tracking-widest text-emerald-950">
              Администрация муниципального района Нефтегорский
            </p>
            <p className="text-[9px] sm:text-[10px] font-sans text-stone-600 uppercase tracking-wider">
              Самарская область • Отдел экологии и природных ресурсов
            </p>

            <div className="py-2">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-emerald-900 font-sans text-[10px] uppercase tracking-widest font-bold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Экологическое Просвещение и Грамотность</span>
                <Sparkles className="w-3 h-3 text-amber-600" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 uppercase tracking-[0.2em] font-['Unbounded',serif] pt-1">
              СЕРТИФИКАТ
            </h1>
            <p className="text-xs sm:text-sm italic text-emerald-900/80 font-medium">
              выдан за активное участие в районном экологическом тестировании
            </p>
          </div>

          {/* Certificate Main Body */}
          <div className="relative z-10 mt-6 text-center space-y-3">
            <p className="text-xs font-sans text-stone-600 uppercase tracking-wider font-semibold">
              Настоящим подтверждается, что
            </p>

            {/* Recipient Full Name (Имя и Отчество) */}
            <div className="py-2 my-1 border-b-2 border-emerald-800/30 inline-block min-w-[300px] max-w-full">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-serif tracking-wide block leading-tight">
                {fullName || 'Участник викторины'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-sans text-stone-700">
              представляющий <strong>{settlement || 'Нефтегорский район'}</strong>,
            </p>

            {(() => {
              const lowerCat = (categoryTitle || '').toLowerCase();
              let ach = '';
              if (lowerCat.includes('водопользование') || lowerCat.includes('водн')) {
                ach = 'уверенные знания водоохранного законодательства';
              } else if (lowerCat.includes('тко') || lowerCat.includes('отход') || lowerCat.includes('сортировк')) {
                ach = 'отличное понимание раздельного сбора отходов';
              }
              return (
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans max-w-xl mx-auto pt-1">
                  успешно прошёл(ла) муниципальную викторину <strong>«ЭкоНефтегорск»</strong>
                  {ach ? `, показав ${ach}` : ''} по теме:
                </p>
              );
            })()}

            <div className="inline-block px-4 py-1.5 rounded-xl bg-emerald-900/10 border border-emerald-900/20 font-sans text-xs sm:text-sm font-bold text-emerald-950 my-1">
              «{categoryTitle}»
            </div>

            {/* Achievements & Score Badges Grid */}
            <div className="my-5 grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-emerald-950/5 rounded-2xl border border-emerald-900/15 font-sans">
              <div className="text-center">
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-500">
                  Баллы
                </div>
                <div className="text-base sm:text-xl font-black text-emerald-900 font-['Unbounded',sans-serif]">
                  {score}
                </div>
              </div>
              <div className="text-center border-x border-emerald-900/15">
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-500">
                  Точность
                </div>
                <div className="text-base sm:text-xl font-black text-emerald-900 font-['Unbounded',sans-serif]">
                  {correctPercentage}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-500">
                  Ранг
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-800 leading-tight mt-0.5">
                  {rank.title}
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Signatures, Official Blue Seal, and Gold Eco Stamp */}
          <div className="relative z-10 mt-6 pt-4 border-t border-emerald-900/20 flex flex-wrap items-end justify-between gap-4 font-sans text-xs">
            <div>
              <div className="text-[10px] text-stone-500">Дата выдачи:</div>
              <div className="font-semibold text-stone-900">{currentDate}</div>
              <div className="text-[10px] text-emerald-900/70 font-mono mt-0.5">Рег. {certificateNumber}</div>
            </div>

            {/* Simulated 3D Gold & Emerald Eco Seal Stamp */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-400 via-emerald-800 to-emerald-950 text-amber-100 p-1 shadow-lg flex items-center justify-center rotate-[-8deg]">
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300/60 p-2 flex flex-col items-center justify-center text-center text-[7px] sm:text-[8px] font-bold uppercase leading-tight bg-emerald-900/90 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-amber-300 mb-0.5" />
                <span>Официально</span>
                <span className="text-[9px] sm:text-[10px] font-black text-amber-300 my-0.5">
                  ЭКО-СТАНДАРТ
                </span>
                <span>м.р. Нефтегорский</span>
                <span className="text-[6px] text-amber-200/80 mt-0.5">★ 2026 ★</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-stone-500">Экологический контроль:</div>
              <div className="font-bold text-stone-900">Администрация м.р. Нефтегорский</div>
              <div className="text-[10px] text-emerald-800 font-medium italic mt-0.5 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Подлинность подтверждена
              </div>
            </div>
          </div>
        </div>

        {/* Download notification banner if present */}
        {downloadNote && (
          <div className="no-print mt-3 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs text-center backdrop-blur shadow-lg">
            {downloadNote}
          </div>
        )}

        {/* Footer Actions Panel */}
        <div className="no-print mt-4 p-4 rounded-2xl bg-stone-900/90 border border-stone-800 text-white shadow-xl backdrop-blur flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-300">
            <span className="font-bold text-amber-400">Способы сохранения:</span>
            <span className="ml-1 text-stone-400">Скачивание PNG, открытие фото в новом окне или печать в PDF</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Формируем файл...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Скачать PNG на устройство</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenImageInNewTab}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition"
              title="Открыть готовое изображение для сохранения вручную"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Открыть картинку</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition"
              title="Печать или сохранение в PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Печать / PDF</span>
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div className="no-print mt-3 text-center">
          <p className="text-xs text-stone-400">
            Сертификат содержит данные с указанием Имени и Отчества и может быть использован в портфолио школьника, педагога или жителя Нефтегорского района.
          </p>
        </div>

      </div>
    </div>
  );
};
