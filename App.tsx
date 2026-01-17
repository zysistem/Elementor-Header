
import React, { useState } from 'react';
import { generateHeaderDesign } from './services/geminiService';
import { convertToElementorJSON } from './services/elementorExporter';
import { HeaderDesign } from './types';
import HeaderPreview from './components/HeaderPreview';
import { Download, Sparkles, Wand2, Loader2, RefreshCcw, CheckCircle2, Layout, Settings2, Palette, Image as ImageIcon, Type as TypeIcon, Info } from 'lucide-react';

const App: React.FC = () => {
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<'minimal' | 'modern' | 'corporate' | 'creative'>('modern');
  const [isSticky, setIsSticky] = useState(true);
  const [hasBlur, setHasBlur] = useState(true);
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoContent, setLogoContent] = useState('');
  
  const [design, setDesign] = useState<HeaderDesign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateHeaderDesign(sector, description, { 
        style, 
        isSticky, 
        hasBlur, 
        logoType, 
        logoContent 
      });
      setDesign(result);
    } catch (err) {
      setError('Tasarım oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!design) return;
    const jsonStr = convertToElementorJSON(design);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `elementor-container-header-${design.sector.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30 selection:text-white font-sans">
      {/* Navbar */}
      <nav className="bg-black/50 backdrop-blur-3xl sticky top-0 z-[100] border-b border-white/5">
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/5">
              <Sparkles className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white leading-none uppercase">
                Elementor <span className="text-indigo-500">Flux</span>
              </h1>
              <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-black">AI Container Engine</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-6 mr-6 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
               <span>Documentation</span>
               <span>Presets</span>
             </div>
            <span className="px-5 py-2 bg-indigo-600/10 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/20 uppercase tracking-widest">Container v1.0</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-20 max-w-7xl">
        {!design ? (
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.95] animate-in slide-in-from-left duration-700">
                  Lüks <br/>
                  Arayüzler <br/>
                  <span className="text-neutral-500">Bir Tıkla.</span>
                </h2>
                <p className="text-lg text-neutral-400 leading-relaxed font-medium max-w-sm">
                  Yapay zeka ile Elementor'un en yeni Container sistemine %100 uyumlu, yüksek performanslı header'lar tasarlayın.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: <CheckCircle2 size={18} />, text: "Elementor Container-First JSON" },
                  { icon: <Settings2 size={18} />, text: "Native CSS Injection" },
                  { icon: <Palette size={18} />, text: "Professional Color Palettes" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 shadow-2xl">
                     <div className="text-indigo-500">{item.icon}</div>
                     <p className="text-sm font-bold text-neutral-300 tracking-wide">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="lg:col-span-7 bg-[#0a0a0a] p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 space-y-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Sektörel Kimlik</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Örn: Butik Mağara Oteli"
                    className="w-full px-8 py-6 rounded-3xl bg-white/5 border border-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all outline-none font-bold text-xl text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Tasarım Dili</label>
                      <select 
                        value={style} 
                        onChange={(e) => setStyle(e.target.value as any)}
                        className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm outline-none cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <option value="minimal">Minimalist</option>
                        <option value="modern">Modern Luxury</option>
                        <option value="corporate">Professional</option>
                        <option value="creative">Creative Edge</option>
                      </select>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Logo Formatı</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setLogoType('text')} className={`flex-1 py-4 rounded-2xl border transition-all text-xs font-black ${logoType === 'text' ? 'bg-white text-black border-white' : 'bg-white/5 text-neutral-500 border-white/10'}`}>TEXT</button>
                        <button type="button" onClick={() => setLogoType('image')} className={`flex-1 py-4 rounded-2xl border transition-all text-xs font-black ${logoType === 'image' ? 'bg-white text-black border-white' : 'bg-white/5 text-neutral-500 border-white/10'}`}>IMAGE</button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                   <label className="flex flex-col gap-3 cursor-pointer">
                     <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Sticky Header</span>
                     <div className={`p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${isSticky ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 bg-white/5'}`}>
                        <span className="text-xs font-black uppercase tracking-widest">{isSticky ? 'ON' : 'OFF'}</span>
                        <input type="checkbox" checked={isSticky} onChange={(e) => setIsSticky(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                     </div>
                   </label>
                   <label className="flex flex-col gap-3 cursor-pointer">
                     <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Glass Blur</span>
                     <div className={`p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${hasBlur ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 bg-white/5'}`}>
                        <span className="text-xs font-black uppercase tracking-widest">{hasBlur ? 'ON' : 'OFF'}</span>
                        <input type="checkbox" checked={hasBlur} onChange={(e) => setHasBlur(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                     </div>
                   </label>
                </div>
              </div>

              {error && <div className="p-6 bg-red-500/10 text-red-400 rounded-3xl text-xs font-bold border border-red-500/20">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-black py-7 rounded-[2.5rem] shadow-[0_20px_60px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-4 group text-xl tracking-tighter"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={28} /> ANALYZING...</>
                ) : (
                  <><Wand2 size={28} /> GENERATE HEADER</>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-white/5 p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-inner">
                  <CheckCircle2 size={44} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white tracking-tighter">Perfected!</h3>
                  <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-2">Flex Container Optimization Active</p>
                </div>
              </div>
              <div className="flex gap-4 w-full lg:w-auto">
                <button onClick={() => setDesign(null)} className="flex-1 lg:flex-none px-10 py-5 rounded-3xl border-2 border-white/10 font-black text-neutral-400 hover:bg-white/5 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                  <RefreshCcw size={18} /> Re-Design
                </button>
                <button onClick={handleDownload} className="flex-1 lg:flex-none px-12 py-5 rounded-3xl bg-white text-black font-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase text-xs tracking-widest">
                  <Download size={18} /> Export JSON
                </button>
              </div>
            </div>

            <HeaderPreview design={design} />

            <div className="grid lg:grid-cols-4 gap-8">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 space-y-6">
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Palette</span>
                 <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 shadow-2xl" style={{backgroundColor: design.colors.primary}}></div>
                    <div className="w-12 h-12 rounded-2xl border border-white/10 shadow-2xl" style={{backgroundColor: design.colors.background}}></div>
                    <div className="w-12 h-12 rounded-2xl border border-white/10 shadow-2xl" style={{backgroundColor: design.colors.text}}></div>
                 </div>
               </div>
               
               <div className="lg:col-span-3 bg-white/5 p-10 rounded-[3rem] border border-white/5 flex flex-col justify-center">
                  <div className="flex items-start gap-6 text-neutral-400">
                     <Info className="flex-shrink-0 text-indigo-500" />
                     <p className="text-xs font-bold leading-relaxed tracking-wide uppercase">
                       Container sistemini kullanmak için Elementor Ayarları > Özellikler > Flexbox Container'ın "Aktif" olduğundan emin olun. 
                       CSS kodları sayfa ayarlarındaki "Custom CSS" alanına otomatik olarak enjekte edilmiştir.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="container mx-auto px-8 py-20 text-center border-t border-white/5 mt-20 opacity-30">
        <p className="text-[10px] font-black tracking-[0.5em] uppercase">
          &copy; 2024 AI Header Flux Designer - Professional Grade Tool
        </p>
      </footer>
    </div>
  );
};

export default App;
