import React, { useState, useEffect } from 'react';
import { generateHeaderDesignVariations } from './services/geminiService';
import { convertToElementorJSON } from './services/elementorExporter';
import { HeaderDesign } from './types';
import HeaderPreview from './components/HeaderPreview';
import { Sparkles, Wand2, Loader2, Smartphone, Monitor, ShieldCheck, Download, Key, LogOut, LayoutGrid, Palette, Type as TypeIcon, Info, ExternalLink } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'header_forge_api_key';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<'minimal' | 'modern' | 'corporate' | 'creative'>('minimal');
  const [mechanic, setMechanic] = useState<'glass' | 'brutal' | 'luxury' | 'gradient'>('luxury');
  const [isSticky, setIsSticky] = useState(true);
  const [hasBlur, setHasBlur] = useState(true);
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoContent, setLogoContent] = useState('');
  
  const [variations, setVariations] = useState<HeaderDesign[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      try {
        const { key, timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp < EXPIRATION_TIME) {
          setApiKey(key);
          setIsKeyValid(true);
        } else {
          localStorage.removeItem(API_KEY_STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    }
  }, []);

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    const data = { key: apiKey, timestamp: Date.now() };
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(data));
    setIsKeyValid(true);
  };

  const logout = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setIsKeyValid(false);
    setVariations([]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector || !isKeyValid) return;

    setLoading(true);
    setError(null);
    try {
      const results = await generateHeaderDesignVariations(apiKey, sector, description, { 
        style, 
        mechanic,
        isSticky, 
        hasBlur, 
        logoType, 
        logoContent 
      });
      if (results && results.length > 0) {
        setVariations(results);
        setSelectedIdx(0);
      } else {
        throw new Error("Tasarım üretilemedi.");
      }
    } catch (err: any) {
      setError('Tasarım hatası. Lütfen API anahtarınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const design = variations[selectedIdx];
    if (!design) return;
    const jsonStr = convertToElementorJSON(design);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `header-${design.sector.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isKeyValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 selection:bg-white/10">
        <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <Key size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Erişim Anahtarı</h1>
            <p className="text-neutral-500 text-xs font-medium px-4">
              Sistemi aktif etmek için Gemini API Key girin. <br/> Verileriniz yerel tarayıcıda 24 saat saklanır.
            </p>
          </div>
          <form onSubmit={saveApiKey} className="space-y-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Anahtarı..."
              className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-white/20 text-white font-mono text-sm transition-all"
              required
            />
            <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all uppercase tracking-widest text-[10px]">Başlat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/10">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="container mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Sparkles className="text-black" size={16} />
            </div>
            <h1 className="text-sm font-bold tracking-tight uppercase">Header <span className="opacity-40">Forge AI</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://wpmet.com/plugin/elementskit/header/" target="_blank" className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
              ElementsKit İlhamı <ExternalLink size={12} />
            </a>
            <button onClick={logout} className="p-2 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-12 max-w-6xl">
        {variations.length === 0 ? (
          <div className="grid lg:grid-cols-2 gap-20 items-center py-10">
            <div className="space-y-8">
              <h2 className="text-6xl font-bold tracking-tight leading-tight animate-in slide-in-from-left duration-500">
                Sade. Modern. <br/> <span className="text-neutral-500">Kusursuz.</span>
              </h2>
              <p className="text-lg text-neutral-500 font-medium max-w-md leading-relaxed">
                ElementsKit standartlarında, Elementor Pro uyumlu ultra modern header bileşenleri üretin.
              </p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-[10px] font-bold text-neutral-500 border border-white/5 uppercase tracking-widest">
                   <ShieldCheck size={14} /> Flex Container
                 </div>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Sektör</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Örn: Teknoloji, Sağlık, E-ticaret..."
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-white/10 font-medium transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Stil</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value as any)} className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/5 outline-none font-medium">
                      <option value="minimal">Minimalist</option>
                      <option value="modern">Modern Glass</option>
                      <option value="corporate">Kurumsal</option>
                      <option value="creative">Yaratıcı</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Mekanik</label>
                    <select value={mechanic} onChange={(e) => setMechanic(e.target.value as any)} className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/5 outline-none font-medium">
                      <option value="luxury">Lüks & Sade</option>
                      <option value="glass">Glassmorphism</option>
                      <option value="brutal">Sert Hatlar</option>
                      <option value="gradient">Gradient Soft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest ml-1">Logo (Metin veya URL)</label>
                  <input
                    type="text"
                    value={logoContent}
                    onChange={(e) => setLogoContent(e.target.value)}
                    placeholder="Marka Adı veya Logo URL..."
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/5 outline-none focus:border-white/10"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setIsSticky(!isSticky)} className={`flex-1 py-4 rounded-xl border transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest ${isSticky ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-neutral-500'}`}>
                  <LayoutGrid size={14} /> Sticky: {isSticky ? 'Açık' : 'Kapalı'}
                </button>
                <button type="button" onClick={() => setHasBlur(!hasBlur)} className={`flex-1 py-4 rounded-xl border transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest ${hasBlur ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-neutral-500'}`}>
                  <Palette size={14} /> Blur: {hasBlur ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {error && <div className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</div>}

              <button disabled={loading} type="submit" className="w-full bg-white text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />} Tasarımları Oluştur
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5 shadow-xl">
              <div className="flex gap-3">
                {variations.map((_, i) => (
                  <button key={i} onClick={() => setSelectedIdx(i)} className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${selectedIdx === i ? 'bg-white text-black' : 'bg-white/5 text-neutral-500 border border-white/5 hover:bg-white/10'}`}>
                    Versiyon {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsPreviewMobile(!isPreviewMobile)} className={`p-3 rounded-xl border transition-all ${isPreviewMobile ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-neutral-500'}`}>
                  {isPreviewMobile ? <Smartphone size={20} /> : <Monitor size={20} />}
                </button>
                <button onClick={() => setVariations([])} className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-neutral-500">Sıfırla</button>
                <button onClick={handleDownload} className="px-8 py-3 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-3">
                  <Download size={14} /> JSON İndir
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Palette size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Renkler</span>
                </div>
                <div className="flex gap-2">
                  {Object.values(variations[selectedIdx].colors).map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border border-white/10" style={{backgroundColor: c}} title={c}></div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-neutral-500">
                  <TypeIcon size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Font</span>
                </div>
                <p className="text-lg font-bold" style={{fontFamily: variations[selectedIdx].fontFamily}}>{variations[selectedIdx].fontFamily}</p>
              </div>
              <div className="lg:col-span-2 bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Info size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Tasarım Özeti</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium leading-relaxed italic line-clamp-2">
                  "{variations[selectedIdx].mechanicSummary}"
                </p>
              </div>
            </div>

            <HeaderPreview design={variations[selectedIdx]} isMobileView={isPreviewMobile} />
          </div>
        )}
      </main>

      <footer className="container mx-auto px-8 py-20 text-center opacity-20 border-t border-white/5">
        <p className="text-[9px] font-bold tracking-[0.5em] uppercase text-neutral-500">
          &copy; 2024 Header Forge Engine - ElementsKit Standard AI Components
        </p>
      </footer>
    </div>
  );
};

export default App;