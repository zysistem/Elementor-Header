
import React, { useState, useEffect } from 'react';
import { generateHeaderDesignVariations } from './services/geminiService';
import { convertToElementorJSON } from './services/elementorExporter';
import { HeaderDesign } from './types';
import HeaderPreview from './components/HeaderPreview';
import { Download, Sparkles, Wand2, Loader2, RefreshCcw, CheckCircle2, Layout, Settings2, Palette, Image as ImageIcon, Type as TypeIcon, Smartphone, Monitor, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<'minimal' | 'modern' | 'corporate' | 'creative'>('modern');
  const [isSticky, setIsSticky] = useState(true);
  const [hasBlur, setHasBlur] = useState(true);
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoContent, setLogoContent] = useState('');
  
  const [variations, setVariations] = useState<HeaderDesign[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);

  // Safety check for published environment
  useEffect(() => {
    console.log("App mounted");
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector) return;

    setLoading(true);
    setError(null);
    try {
      // Varyasyon sayısını 2'ye indirdik (Performans ve Timeout hataları için)
      const results = await generateHeaderDesignVariations(sector, description, { 
        style, 
        isSticky, 
        hasBlur, 
        logoType, 
        logoContent 
      });
      if (results && Array.isArray(results) && results.length > 0) {
        setVariations(results);
        setSelectedIdx(0);
      } else {
        throw new Error("Geçerli bir tasarım üretilemedi.");
      }
    } catch (err: any) {
      setError(err?.message || 'Tasarım oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error("Generation error:", err);
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
    link.download = `elementor-header-${design.sector.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 selection:bg-indigo-500/40 font-sans">
      {/* Navbar */}
      <nav className="bg-black/60 backdrop-blur-2xl sticky top-0 z-[100] border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white leading-none uppercase">
                Header <span className="text-indigo-500">Forge</span>
              </h1>
              <span className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 font-black">AI Elementor Designer</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              Flex Container Ready
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {variations.length === 0 ? (
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-10 py-10">
              <div className="space-y-4">
                <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-left duration-700">
                  Elementor <br/> Header <br/>
                  <span className="text-indigo-600">Sihirbazı.</span>
                </h2>
                <p className="text-xl text-neutral-400 font-medium max-w-sm">
                  Yapay zeka ile her sektöre uygun 2 farklı premium tasarım seçeneği. Flexbox Container desteğiyle.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 shadow-2xl">
                  <div className="text-indigo-500"><CheckCircle2 size={24} /></div>
                  <p className="text-sm font-bold text-neutral-300">Gelişmiş CSS Entegrasyonu</p>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 shadow-2xl">
                  <div className="text-indigo-500"><Smartphone size={24} /></div>
                  <p className="text-sm font-bold text-neutral-300">Mobil Uyumlu Container Yapısı</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="lg:col-span-7 bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.4)]">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Sektörünüz</label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      placeholder="Örn: Butik Mağara Oteli"
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Logo Seçeneği</label>
                    <div className="flex gap-2 mb-2">
                      <button type="button" onClick={() => setLogoType('text')} className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${logoType === 'text' ? 'bg-white text-black' : 'bg-white/5 text-neutral-500 border border-white/5'}`}>METİN</button>
                      <button type="button" onClick={() => setLogoType('image')} className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all ${logoType === 'image' ? 'bg-white text-black' : 'bg-white/5 text-neutral-500 border border-white/5'}`}>GÖRSEL URL</button>
                    </div>
                    <input
                      type="text"
                      value={logoContent}
                      onChange={(e) => setLogoContent(e.target.value)}
                      placeholder={logoType === 'text' ? "Marka Adı" : "https://logo-url.com/logo.png"}
                      className="w-full px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:border-indigo-500 text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">Tasarım Nasıl Olsun?</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Siyah zemin üzerine altın sarısı detaylar, menü ortada..."
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium outline-none focus:border-indigo-500 h-28 resize-none transition-colors"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setIsSticky(!isSticky)} className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${isSticky ? 'border-indigo-600 bg-indigo-600/5' : 'border-white/5 bg-white/5'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">Sabit (Sticky)</span>
                    <div className={`w-3 h-3 rounded-full ${isSticky ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-neutral-700'}`}></div>
                  </button>
                  <button type="button" onClick={() => setHasBlur(!hasBlur)} className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${hasBlur ? 'border-indigo-600 bg-indigo-600/5' : 'border-white/5 bg-white/5'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">Buzlu Cam (Blur)</span>
                    <div className={`w-3 h-3 rounded-full ${hasBlur ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-neutral-700'}`}></div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-5 bg-red-500/10 text-red-400 rounded-2xl text-[11px] font-bold border border-red-500/20 flex items-center gap-3">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-black py-6 rounded-[2rem] transition-all flex items-center justify-center gap-4 text-xl tracking-tighter shadow-2xl shadow-white/5"
              >
                {loading ? <><Loader2 className="animate-spin" /> TASARLANIYOR...</> : <><Wand2 /> 2 TASARIM OLUŞTUR</>}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Header Result Controls */}
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-1">Tasarım Seçenekleri</span>
                <div className="flex gap-4">
                  {variations.map((v, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedIdx(i)}
                      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-3 ${selectedIdx === i ? 'bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)]' : 'bg-white/5 text-neutral-500 border border-white/5 hover:bg-white/10'}`}
                    >
                      Seçenek {i + 1}
                      {selectedIdx === i && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setIsPreviewMobile(!isPreviewMobile)}
                  className={`p-4 rounded-2xl border transition-all ${isPreviewMobile ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-neutral-400'}`}
                  title="Mobil/Masaüstü Önizleme"
                >
                  {isPreviewMobile ? <Smartphone size={24} /> : <Monitor size={24} />}
                </button>
                <button onClick={() => setVariations([])} className="flex-1 md:flex-none px-8 py-4 rounded-2xl border border-white/10 font-black text-xs text-neutral-500 hover:bg-white/5 uppercase tracking-widest transition-all">
                  Yeni Tasarım
                </button>
                <button onClick={handleDownload} className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase hover:bg-neutral-200 shadow-xl shadow-white/5 tracking-widest transition-all">
                  JSON İNDİR
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className={`mx-auto transition-all duration-700 ease-in-out ${isPreviewMobile ? 'max-w-[390px]' : 'max-w-full'}`}>
               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.6rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                 <HeaderPreview design={variations[selectedIdx]} />
               </div>
            </div>

            {/* Success Details */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h4 className="text-white text-sm font-black uppercase tracking-widest border-b border-white/5 pb-4">Tasarım Parametreleri</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] text-neutral-500 font-bold uppercase">Stil</p>
                      <p className="font-bold text-indigo-400 capitalize">{variations[selectedIdx].style}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Arka Plan</p>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor: variations[selectedIdx].colors.background}}></div>
                        <span className="font-mono text-xs uppercase">{variations[selectedIdx].colors.background}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Vurgu Rengi</p>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor: variations[selectedIdx].colors.primary}}></div>
                        <span className="font-mono text-xs uppercase">{variations[selectedIdx].colors.primary}</span>
                      </div>
                    </div>
                  </div>
               </div>
               <div className="bg-indigo-600/5 p-10 rounded-[2.5rem] border border-indigo-500/10 flex flex-col justify-center">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-widest">
                       <AlertTriangle size={18} /> Import İpucu
                     </div>
                     <p className="text-xs text-indigo-200/60 leading-relaxed font-medium">
                       Elementor'da "Template Import" yaptıktan sonra, sayfa ayarlarındaki "Custom CSS" alanına CSS kodlarının başarıyla eklendiğinden emin olun. 
                       Buzlu cam efekti için "Flex Container" özelliğinin açık olması gereklidir.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="container mx-auto px-6 py-20 text-center border-t border-white/5 opacity-40 mt-20">
        <p className="text-[10px] font-black tracking-[0.6em] uppercase text-neutral-500">
          &copy; {new Date().getFullYear()} AI Header Flux Forge Designer - Ultra Pro v3
        </p>
      </footer>
    </div>
  );
};

export default App;
