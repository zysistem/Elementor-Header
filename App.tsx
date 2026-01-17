import React, { useState, useEffect } from 'react';
import { generateHeaderDesignVariations } from './services/geminiService';
import { convertToElementorJSON } from './services/elementorExporter';
import { HeaderDesign } from './types';
import HeaderPreview from './components/HeaderPreview';
import { Sparkles, Wand2, Loader2, Smartphone, Monitor, AlertTriangle, ShieldCheck, Download, Key, LogOut, LayoutGrid, Palette, Type as TypeIcon, Info } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'header_forge_api_key';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

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
      setError('Tasarım hatası. API Key veya Sektör bilgisini kontrol edin.');
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
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 selection:bg-indigo-500/30">
        <div className="w-full max-w-md space-y-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/40 rotate-12">
              <Key className="text-white -rotate-12" size={38} />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter uppercase">API Gerekli</h1>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                Sistemi kullanmak için Gemini API anahtarınızı girin. <br/> 24 saat sonra deaktif olacaktır.
              </p>
            </div>
          </div>
          <form onSubmit={saveApiKey} className="space-y-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Gemini API Key..."
              className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 outline-none focus:border-indigo-500 text-white font-mono text-sm transition-all focus:ring-4 ring-indigo-500/10"
              required
            />
            <button type="submit" className="w-full bg-white text-black font-black py-6 rounded-[2rem] hover:bg-neutral-200 transition-all uppercase tracking-[0.2em] text-[10px] shadow-2xl">Giriş Yap ve Başla</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/40">
      <nav className="bg-black/80 backdrop-blur-3xl sticky top-0 z-[100] border-b border-white/5">
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-white/5">
              <Sparkles className="text-black" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">Header <span className="text-indigo-500">Forge</span></h1>
              <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-600 font-bold block">AI Designer Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5">
              <ShieldCheck size={16} className="text-green-500" /> Oturum Aktif (24s)
            </div>
            <button onClick={logout} className="p-3 bg-white/5 rounded-xl hover:text-red-500 transition-all hover:bg-red-500/10 border border-white/5" title="Çıkış Yap">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-16 max-w-7xl">
        {variations.length === 0 ? (
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-8xl font-black tracking-tighter leading-[0.85] animate-in slide-in-from-left duration-700">
                  Header <br/> <span className="text-indigo-600 underline decoration-indigo-500/20">Sanatı.</span>
                </h2>
                <p className="text-2xl text-neutral-400 font-medium max-w-lg leading-relaxed">
                  Yapay zeka ile her sektöre özel, 4 farklı modern header versiyonu. Elementor Flex Box uyumlu.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                 {['Glassmorphism', 'Floating Pill', 'Split Menu', 'Neo-Glass'].map(m => (
                   <span key={m} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-neutral-400 shadow-xl">{m}</span>
                 ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="bg-neutral-900/50 p-12 rounded-[4rem] border border-white/10 space-y-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Sektör Bilgisi</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Örn: Butik Kahve Dükkanı, Yazılım Ajansı"
                    className="w-full px-8 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 outline-none focus:border-indigo-500 font-bold text-lg transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Ana Mekanik</label>
                    <select 
                      value={mechanic} 
                      onChange={(e) => setMechanic(e.target.value as any)}
                      className="w-full px-8 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 outline-none font-bold appearance-none cursor-pointer"
                    >
                      <option value="glass">Glassmorphism</option>
                      <option value="brutal">Neo-Brutalism</option>
                      <option value="luxury">Minimal Luxury</option>
                      <option value="gradient">Gradient Fusion</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Logo Tipi</label>
                    <select 
                      value={logoType} 
                      onChange={(e) => setLogoType(e.target.value as any)}
                      className="w-full px-8 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 outline-none font-bold appearance-none cursor-pointer"
                    >
                      <option value="text">Metin Logo</option>
                      <option value="image">Görsel URL</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Logo İçeriği</label>
                  <input
                    type="text"
                    value={logoContent}
                    onChange={(e) => setLogoContent(e.target.value)}
                    placeholder={logoType === 'text' ? "Marka Adınız" : "https://siteniz.com/logo.png"}
                    className="w-full px-8 py-5 rounded-[2.5rem] bg-white/5 border border-white/10 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Özel Notlar</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Menü öğeleri sağda olsun, renkler daha yumuşak olsun..."
                    className="w-full px-8 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 outline-none h-32 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button type="button" onClick={() => setIsSticky(!isSticky)} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-center gap-4 ${isSticky ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-neutral-500'}`}>
                  <LayoutGrid size={20} /> Sticky {isSticky ? 'Açık' : 'Kapalı'}
                </button>
                <button type="button" onClick={() => setHasBlur(!hasBlur)} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-center gap-4 ${hasBlur ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-neutral-500'}`}>
                  <Palette size={20} /> Blur {hasBlur ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              {error && <div className="text-red-400 text-xs font-bold text-center bg-red-500/5 py-4 rounded-3xl border border-red-500/10">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black py-8 rounded-[3rem] flex items-center justify-center gap-6 text-xl hover:bg-neutral-200 transition-all uppercase tracking-tighter shadow-2xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 />} Tasarımları Üret
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            {/* Design Selector & Controls */}
            <div className="bg-[#0a0a0a] p-10 rounded-[4rem] border border-white/10 flex flex-col xl:flex-row justify-between items-center gap-12 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
              <div className="space-y-4">
                 <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-2">Varyasyon Seçin</span>
                 <div className="flex gap-4">
                  {variations.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedIdx(i)}
                      className={`px-10 py-5 rounded-[2rem] font-black text-sm transition-all ${selectedIdx === i ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 scale-105' : 'bg-white/5 text-neutral-500 border border-white/5 hover:bg-white/10'}`}
                    >
                      Versiyon {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 w-full xl:w-auto">
                <button 
                  onClick={() => setIsPreviewMobile(!isPreviewMobile)} 
                  className={`p-6 rounded-[2rem] border transition-all ${isPreviewMobile ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-neutral-500 hover:bg-white/10'}`}
                  title="Önizleme Modu"
                >
                  {isPreviewMobile ? <Smartphone size={28} /> : <Monitor size={28} />}
                </button>
                <button onClick={() => setVariations([])} className="px-10 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-xs font-black uppercase hover:bg-white/10 transition-all tracking-widest text-neutral-400">Yenile</button>
                <button onClick={handleDownload} className="px-12 py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase flex items-center gap-4 hover:scale-105 transition-all shadow-2xl">
                  <Download size={18} /> JSON Dışa Aktar
                </button>
              </div>
            </div>

            {/* Information Panel */}
            <div className="grid lg:grid-cols-3 gap-8">
               <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <Palette size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest">Renk Paleti</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {Object.entries(variations[selectedIdx].colors).map(([key, val]) => (
                       <div key={key} className="flex flex-col gap-2">
                          <div className="w-full h-12 rounded-2xl border border-white/10 shadow-lg" style={{backgroundColor: val}}></div>
                          <span className="text-[9px] font-black text-neutral-500 uppercase">{key}: {val}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <TypeIcon size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest">Tipografi</h3>
                  </div>
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-2xl font-black tracking-tight" style={{fontFamily: variations[selectedIdx].fontFamily}}>
                      {variations[selectedIdx].fontFamily}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-2 uppercase font-bold tracking-widest">Elementor'da bu fontu seçmeyi unutmayın.</p>
                  </div>
               </div>

               <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
                  <div className="flex items-center gap-3 text-indigo-400">
                    <Info size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest">Tasarım Mekaniği</h3>
                  </div>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed italic">
                    "{variations[selectedIdx].mechanicSummary}"
                  </p>
               </div>
            </div>

            {/* Preview Component */}
            <HeaderPreview design={variations[selectedIdx]} isMobileView={isPreviewMobile} />
          </div>
        )}
      </main>

      <footer className="container mx-auto px-8 py-20 text-center opacity-20 mt-20 border-t border-white/5">
        <p className="text-[10px] font-black tracking-[0.6em] uppercase text-neutral-500">
          &copy; 2024 Header Forge Engine - Ultra High-End Elementor Components
        </p>
      </footer>
    </div>
  );
};

export default App;