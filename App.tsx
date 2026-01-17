
import React, { useState } from 'react';
import { generateHeaderDesignVariations } from './services/geminiService';
import { convertToElementorJSON } from './services/elementorExporter';
import { HeaderDesign } from './types';
import HeaderPreview from './components/HeaderPreview';
import { Download, Sparkles, Wand2, Loader2, RefreshCcw, CheckCircle2, Layout, Smartphone, Monitor, AlertTriangle, ShieldCheck } from 'lucide-react';

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector) return;

    setLoading(true);
    setError(null);
    try {
      const results = await generateHeaderDesignVariations(sector, description, { 
        style, 
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
      setError(err?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
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
    link.download = `elementor-header-ai-${selectedIdx + 1}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/50">
      {/* Navbar */}
      <nav className="bg-black/60 backdrop-blur-3xl sticky top-0 z-[100] border-b border-white/5">
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <Sparkles className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">
                Header <span className="text-indigo-500">Flux</span>
              </h1>
              <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-black">AI Pro Designer v4</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 border border-white/5 px-4 py-2 rounded-full">
               <ShieldCheck size={14} className="text-green-500" /> Secure Import Ready
             </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-16 max-w-7xl">
        {variations.length === 0 ? (
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h2 className="text-7xl font-black tracking-tighter leading-[0.9] animate-in slide-in-from-left duration-700">
                  Profesyonel <br/> Header <br/>
                  <span className="text-indigo-600 underline decoration-indigo-500/20">Üretin.</span>
                </h2>
                <p className="text-xl text-neutral-400 font-medium max-w-md leading-relaxed">
                  Yapay zeka desteğiyle her sektöre uygun 2 farklı premium tasarım. Elementor Flex Container ile tam uyumlu!
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { icon: <CheckCircle2 size={20} />, text: "Native CSS Embed Logic" },
                  { icon: <Smartphone size={20} />, text: "Mobile Responsive Containers" },
                  { icon: <Layout size={20} />, text: "Clean & Modern Aesthetics" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                     <div className="text-indigo-500">{item.icon}</div>
                     <p className="text-sm font-bold tracking-wide uppercase">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="lg:col-span-7 bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] space-y-10">
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Sektörünüz</label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      placeholder="Örn: Butik Mağara Oteli"
                      className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-bold text-xl outline-none focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Logo Ayarları</label>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 mb-2">
                       <button type="button" onClick={() => setLogoType('text')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${logoType === 'text' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>TEXT</button>
                       <button type="button" onClick={() => setLogoType('image')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${logoType === 'image' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}>IMAGE</button>
                    </div>
                    <input
                      type="text"
                      value={logoContent}
                      onChange={(e) => setLogoContent(e.target.value)}
                      placeholder={logoType === 'text' ? "Marka Adı" : "https://..."}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Nasıl Görünmeli?</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Minimalist, modern, menü sağda, cta butonu büyük olsun..."
                    className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-medium outline-none focus:border-indigo-500 h-32 resize-none transition-all"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button type="button" onClick={() => setIsSticky(!isSticky)} className={`p-6 rounded-[2rem] border-2 transition-all flex justify-between items-center ${isSticky ? 'border-indigo-600 bg-indigo-600/10' : 'border-white/5 bg-white/5'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">Sabit (Sticky)</span>
                    <div className={`w-3 h-3 rounded-full ${isSticky ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-neutral-800'}`}></div>
                  </button>
                  <button type="button" onClick={() => setHasBlur(!hasBlur)} className={`p-6 rounded-[2rem] border-2 transition-all flex justify-between items-center ${hasBlur ? 'border-indigo-600 bg-indigo-600/10' : 'border-white/5 bg-white/5'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">Blur (Cam Efekti)</span>
                    <div className={`w-3 h-3 rounded-full ${hasBlur ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-neutral-800'}`}></div>
                  </button>
                </div>
              </div>

              {error && <div className="p-6 bg-red-500/10 text-red-400 rounded-3xl text-xs font-bold border border-red-500/20 flex items-center gap-3"><AlertTriangle size={16} />{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-black py-7 rounded-[2.5rem] transition-all flex items-center justify-center gap-4 text-xl tracking-tighter"
              >
                {loading ? <><Loader2 className="animate-spin" /> TASARLANIYOR...</> : <><Wand2 /> 2 TASARIM ÜRET</>}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Design Selector Bar */}
            <div className="bg-[#0a0a0a] p-10 rounded-[4rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Tasarım Seçenekleri</span>
                <div className="flex gap-4">
                  {variations.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedIdx(i)}
                      className={`px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${selectedIdx === i ? 'bg-indigo-600 text-white shadow-[0_15px_40px_rgba(79,70,229,0.3)]' : 'bg-white/5 text-neutral-500 border border-white/5 hover:bg-white/10'}`}
                    >
                      Versiyon {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setIsPreviewMobile(!isPreviewMobile)}
                  className={`p-5 rounded-2xl border-2 transition-all ${isPreviewMobile ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-neutral-400'}`}
                >
                  {isPreviewMobile ? <Smartphone size={28} /> : <Monitor size={28} />}
                </button>
                <button onClick={() => setVariations([])} className="flex-1 md:flex-none px-10 py-5 rounded-2xl border-2 border-white/5 font-black text-xs text-neutral-500 hover:bg-white/5 uppercase tracking-widest">Yenile</button>
                <button onClick={handleDownload} className="flex-1 md:flex-none px-12 py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest shadow-2xl shadow-white/5 hover:scale-105 transition-transform">JSON İNDİR</button>
              </div>
            </div>

            {/* Preview Display */}
            <HeaderPreview design={variations[selectedIdx]} isMobileView={isPreviewMobile} />

            {/* Guide Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-4">Renk Düzeni</span>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-white/10" style={{backgroundColor: variations[selectedIdx].colors.primary}}></div>
                    <div className="w-12 h-12 rounded-2xl border border-white/10" style={{backgroundColor: variations[selectedIdx].colors.background}}></div>
                    <div className="w-12 h-12 rounded-2xl border border-white/10" style={{backgroundColor: variations[selectedIdx].colors.text}}></div>
                  </div>
               </div>
               <div className="bg-indigo-600/5 p-8 rounded-[2.5rem] border border-indigo-500/10 lg:col-span-3">
                  <div className="flex items-start gap-4 text-indigo-200/60 font-medium text-xs leading-relaxed uppercase">
                    <AlertTriangle className="flex-shrink-0 text-indigo-400" />
                    Önemli: İndirdiğiniz JSON dosyasını Elementor > Templates > Import kısmına yükleyin. Header'ın doğru çalışması için sitenizde "Flexbox Container" özelliğinin aktif olması gerekir. CSS kodları konteyner ayarlarına otomatik gömülmüştür.
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="container mx-auto px-8 py-20 text-center border-t border-white/5 mt-20 opacity-30">
        <p className="text-[10px] font-black tracking-[0.6em] uppercase text-neutral-500">
          &copy; 2024 AI Header Flux Engine - Made with Excellence
        </p>
      </footer>
    </div>
  );
};

export default App;
