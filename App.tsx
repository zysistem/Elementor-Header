import React, { useState } from 'react';
import { generateHeaderDesignVariations } from './services/geminiService';
import { convertToElementorJSON } from './services/elementorExporter';
import { HeaderDesign } from './types';
import HeaderPreview from './components/HeaderPreview';
import { Sparkles, Wand2, Loader2, Smartphone, Monitor, AlertTriangle, ShieldCheck, Download } from 'lucide-react';

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
        throw new Error("API boş yanıt döndürdü.");
      }
    } catch (err: any) {
      setError('Tasarım oluşturulamadı. Lütfen API anahtarınızı ve internetinizi kontrol edin.');
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
    link.download = `header-${design.sector.toLowerCase().replace(/\s+/g, '-')}-${selectedIdx + 1}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <nav className="bg-black/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase">
              Header <span className="text-indigo-500">Forge</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" /> Flex Container V2
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {variations.length === 0 ? (
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-7xl font-black tracking-tighter leading-none">
                AI ile <br/> <span className="text-indigo-600">Premium</span> <br/> Header Tasarla.
              </h2>
              <p className="text-xl text-neutral-400 font-medium">
                Sektörünü yaz, 4 farklı Elementor uyumlu header versiyonunu anında al. JSON olarak indir ve sitene aktar.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="bg-neutral-900/50 p-10 rounded-[2.5rem] border border-white/10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Sektör (Örn: Kafe)"
                  className="col-span-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500"
                  required
                />
                <select 
                  value={logoType} 
                  onChange={(e) => setLogoType(e.target.value as any)}
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
                >
                  <option value="text">Metin Logo</option>
                  <option value="image">Görsel URL</option>
                </select>
                <input
                  type="text"
                  value={logoContent}
                  onChange={(e) => setLogoContent(e.target.value)}
                  placeholder="Logo Metni veya URL"
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none"
                />
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Özel istekleriniz (Örn: Altın sarısı butonlar olsun)"
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none h-32"
              ></textarea>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setIsSticky(!isSticky)} className={`p-4 rounded-2xl border ${isSticky ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5'}`}>Sticky {isSticky ? '✅' : '❌'}</button>
                <button type="button" onClick={() => setHasBlur(!hasBlur)} className={`p-4 rounded-2xl border ${hasBlur ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5'}`}>Blur {hasBlur ? '✅' : '❌'}</button>
              </div>

              {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-lg hover:bg-neutral-200 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 />} 4 TASARIM OLUŞTUR
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-neutral-900/50 p-6 rounded-3xl border border-white/5">
              <div className="flex gap-2">
                {variations.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedIdx(i)}
                    className={`px-6 py-3 rounded-xl font-black text-xs uppercase ${selectedIdx === i ? 'bg-indigo-600' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    V{i + 1}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsPreviewMobile(!isPreviewMobile)} className="p-3 bg-white/5 rounded-xl border border-white/10">
                  {isPreviewMobile ? <Smartphone /> : <Monitor />}
                </button>
                <button onClick={() => setVariations([])} className="px-6 py-3 bg-white/5 rounded-xl text-xs font-bold uppercase">Yenile</button>
                <button onClick={handleDownload} className="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase flex items-center gap-2">
                  <Download size={14} /> JSON İndir
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