import React, { useState, useEffect } from 'react';
import { generateHeaderDesignVariations } from './services/geminiService';
import { convertToElementorJSON } from './services/elementorExporter';
import { HeaderDesign } from './types';
import HeaderPreview from './components/HeaderPreview';
import { Sparkles, Wand2, Loader2, Smartphone, Monitor, AlertTriangle, ShieldCheck, Download, Key, LogOut, LayoutGrid, Palette } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'header_forge_api_key';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 Hours

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<'minimal' | 'modern' | 'corporate' | 'creative'>('modern');
  const [mechanic, setMechanic] = useState<'glass' | 'brutal' | 'luxury' | 'gradient'>('glass');
  const [isSticky, setIsSticky] = useState(true);
  const [hasBlur, setHasBlur] = useState(true);
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoContent, setLogoContent] = useState('');
  
  const [variations, setVariations] = useState<HeaderDesign[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);

  // Check stored API Key on mount
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
        throw new Error("API boş yanıt döndürdü.");
      }
    } catch (err: any) {
      setError('Tasarım oluşturulamadı. API anahtarınız geçersiz olabilir.');
      console.error(err);
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/20">
              <Key className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">API Gerekli</h1>
            <p className="text-neutral-500 text-sm font-medium">Sistemi kullanmak için Gemini API anahtarınızı girin. Oturumunuz 24 saat geçerli kalacaktır.</p>
          </div>
          <form onSubmit={saveApiKey} className="space-y-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Gemini API Key..."
              className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 text-white font-mono text-sm transition-all"
              required
            />
            <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-neutral-200 transition-all uppercase tracking-widest text-xs">Sisteme Giriş Yap</button>
            <p className="text-[10px] text-center text-neutral-600 uppercase font-bold tracking-widest">Verileriniz sadece tarayıcınızda saklanır.</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <nav className="bg-black/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase">Header <span className="text-indigo-500">Forge</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <ShieldCheck size={14} className="text-green-500" /> Session Active
            </div>
            <button onClick={logout} className="p-2 hover:text-red-500 transition-colors" title="Çıkış Yap">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {variations.length === 0 ? (
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-7xl font-black tracking-tighter leading-[0.9] animate-in slide-in-from-left duration-700">
                  Profesyonel <br/> <span className="text-indigo-600">Header</span> <br/> Deneyimi.
                </h2>
                <p className="text-xl text-neutral-400 font-medium max-w-md">
                  Sektörüne ve seçtiğin tasarım mekaniğine göre 4 benzersiz varyasyon oluştur.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                 {['Glassmorphism', 'Neo-Brutalism', 'Minimal Luxury', 'Gradient Fusion'].map(m => (
                   <span key={m} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-neutral-500">{m}</span>
                 ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="bg-neutral-900/40 p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2">Sektör</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="E-ticaret, Portfolyo, Otel..."
                    className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 font-bold transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2">Mekanik</label>
                  <select 
                    value={mechanic} 
                    onChange={(e) => setMechanic(e.target.value as any)}
                    className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none font-bold"
                  >
                    <option value="glass">Glassmorphism</option>
                    <option value="brutal">Neo-Brutalism</option>
                    <option value="luxury">Minimal Luxury</option>
                    <option value="gradient">Gradient Fusion</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2">Logo Tipi</label>
                  <select 
                    value={logoType} 
                    onChange={(e) => setLogoType(e.target.value as any)}
                    className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none font-bold"
                  >
                    <option value="text">Metin</option>
                    <option value="image">Resim URL</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2">Logo İçeriği</label>
                  <input
                    type="text"
                    value={logoContent}
                    onChange={(e) => setLogoContent(e.target.value)}
                    placeholder={logoType === 'text' ? "Marka Adınız" : "https://logo.png"}
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2">Tasarım Notları</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Altın detaylar olsun, menü ortada kalsın..."
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none h-28 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setIsSticky(!isSticky)} className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${isSticky ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-neutral-500'}`}>
                  <LayoutGrid size={16} /> Sticky {isSticky ? 'On' : 'Off'}
                </button>
                <button type="button" onClick={() => setHasBlur(!hasBlur)} className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${hasBlur ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-neutral-500'}`}>
                  <Palette size={16} /> Blur {hasBlur ? 'On' : 'Off'}
                </button>
              </div>

              {error && <div className="text-red-500 text-[11px] font-bold text-center bg-red-500/5 py-3 rounded-xl border border-red-500/20">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 text-lg hover:bg-neutral-200 transition-all uppercase tracking-tighter"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 />} Tasarımları Üret
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-neutral-900/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex flex-col gap-3">
                 <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest ml-2">Tasarım Seçin</span>
                 <div className="flex gap-3">
                  {variations.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedIdx(i)}
                      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase transition-all ${selectedIdx === i ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 scale-105' : 'bg-white/5 text-neutral-500 hover:bg-white/10'}`}
                    >
                      V{i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button onClick={() => setIsPreviewMobile(!isPreviewMobile)} className={`p-4 rounded-2xl border transition-all ${isPreviewMobile ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-neutral-500'}`}>
                  {isPreviewMobile ? <Smartphone size={24} /> : <Monitor size={24} />}
                </button>
                <button onClick={() => setVariations([])} className="flex-1 md:flex-none px-8 py-4 bg-white/5 rounded-2xl text-xs font-bold uppercase hover:bg-white/10 transition-all">Yenile</button>
                <button onClick={handleDownload} className="flex-1 md:flex-none px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3 hover:scale-105 transition-all">
                  <Download size={16} /> JSON Dışa Aktar
                </button>
              </div>
            </div>

            <HeaderPreview design={variations[selectedIdx]} isMobileView={isPreviewMobile} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;