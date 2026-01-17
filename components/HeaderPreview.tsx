import React, { useState, useEffect } from 'react';
import { HeaderDesign } from '../types';
import { Menu, X, ArrowRight, Star, Globe, Shield } from 'lucide-react';

interface Props {
  design: HeaderDesign;
  isMobileView?: boolean;
}

const HeaderPreview: React.FC<Props> = ({ design, isMobileView }) => {
  const { colors, logo, navigation, cta, hasBlur, isSticky } = design;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when view mode toggles
  useEffect(() => {
    setIsMenuOpen(false);
  }, [isMobileView]);

  const getBgStyle = () => {
    if (hasBlur) {
      return { 
        backgroundColor: colors.background.includes('rgba') ? colors.background : `${colors.background}cc`,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)'
      };
    }
    return { backgroundColor: colors.background };
  };

  const renderLogo = () => (
    <div className="flex-shrink-0 z-[120]">
      {logo.type === 'text' ? (
        <span className="font-black text-xl md:text-2xl tracking-tighter" style={{ color: colors.primary }}>
          {logo.content}
        </span>
      ) : (
        <img 
          src={logo.content || "https://via.placeholder.com/150x45?text=Logo"} 
          alt="Logo" 
          className="h-8 md:h-10 w-auto object-contain"
        />
      )}
    </div>
  );

  return (
    <div className={`transition-all duration-700 ease-in-out border border-white/10 rounded-[2.5rem] overflow-hidden bg-black shadow-2xl relative ${isMobileView ? 'max-w-[375px] mx-auto h-[750px]' : 'w-full h-[750px]'}`}>
      {/* Simulation Top Browser Bar */}
      <div className="bg-neutral-900 px-6 py-3 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
        </div>
        <div className="bg-black/50 border border-white/5 rounded-full px-8 py-0.5 text-[8px] text-neutral-500 font-bold tracking-widest uppercase truncate max-w-[150px]">
          {isMobileView ? 'Mobile View' : 'preview.zysistem.net'}
        </div>
        <div className="w-8"></div>
      </div>
      
      <div className="relative h-full overflow-y-auto scrollbar-hide bg-[#0a0a0a]">
        {/* HEADER */}
        <header 
          className={`w-full px-6 md:px-10 py-5 flex items-center transition-all duration-500 z-[100] border-b border-white/5 ${isSticky ? 'sticky top-0' : 'relative'}`}
          style={getBgStyle()}
        >
          <div className="w-full flex items-center justify-between">
            {renderLogo()}
            
            {/* Desktop Navigation */}
            {!isMobileView && (
              <nav className="hidden md:flex items-center gap-8">
                {navigation.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    className="text-[10px] font-black tracking-[0.2em] hover:opacity-50 transition-all uppercase whitespace-nowrap" 
                    style={{ color: colors.text }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-4">
              {cta && !isMobileView && (
                <a
                  href={cta.url}
                  className="px-6 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all hover:scale-105 active:scale-95 uppercase shadow-xl"
                  style={{ backgroundColor: colors.primary, color: '#fff' }}
                >
                  {cta.text}
                </a>
              )}
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-white transition-all z-[130] ${isMobileView ? 'block' : 'md:hidden'}`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Overlay Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[125] flex flex-col items-center justify-center p-10 animate-in fade-in duration-300">
               <nav className="flex flex-col items-center gap-8">
                {navigation.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    className="text-2xl font-black tracking-tighter hover:text-indigo-500 transition-all uppercase" 
                    style={{ color: colors.text }}
                  >
                    {item.label}
                  </a>
                ))}
                {cta && (
                   <button 
                    className="mt-4 px-10 py-5 rounded-2xl text-sm font-black tracking-widest uppercase shadow-2xl"
                    style={{ backgroundColor: colors.primary, color: '#fff' }}
                   >
                     {cta.text}
                   </button>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* HERO SECTION - Resimli ve Modern */}
        <section className="relative min-h-[600px] flex items-center justify-center px-8 py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
               alt="Hero Background" 
               className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl w-full text-center space-y-10 animate-in slide-in-from-bottom-12 duration-1000">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">
               <Shield size={12} className="mr-1" /> Next Generation Aritificial Intellegence
             </div>
             <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                Dijital <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 italic">Dönüşümünüzü</span> <br/> Başlatın
             </h1>
             <p className="text-neutral-400 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Modern mimari ve yapay zekanın gücünü kullanarak, markanızı dijital dünyada zirveye taşıyacak benzersiz arayüzler tasarlıyoruz.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <button 
                  className="w-full sm:w-auto px-12 py-6 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5"
                >
                  Üretmeye Başla <ArrowRight size={16} />
                </button>
                <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <Globe size={18} className="text-indigo-500" /> Küresel Erişim & 7/24 Destek
                </div>
             </div>
          </div>
        </section>

        {/* Features Section Placeholder */}
        <section className="px-8 py-24 bg-[#070707] border-t border-white/5">
           <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { title: 'Hız', desc: 'Saniyeler içinde tasarım varyasyonları üretin.' },
                { title: 'Uyum', desc: 'Tüm cihazlarla ve Elementor Flex Container ile tam uyumlu.' },
                { title: 'Zeka', desc: 'Sektörünüze özel renk ve tipografi seçimleri.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-6 hover:border-indigo-500/30 transition-all group">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-xl">
                     <Star size={28} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-white text-xl font-black uppercase tracking-tighter">{feature.title}</h3>
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>
        
        <div className="h-60 bg-black"></div>
      </div>
    </div>
  );
};

export default HeaderPreview;