import React, { useState, useEffect } from 'react';
import { HeaderDesign } from '../types';
import { Menu, X, ArrowRight, Star, Globe, Shield } from 'lucide-react';

interface Props {
  design: HeaderDesign;
  isMobileView?: boolean;
}

const HeaderPreview: React.FC<Props> = ({ design, isMobileView }) => {
  const { colors, logo, navigation, cta, hasBlur, isSticky, fontFamily, layout } = design;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isMobileView]);

  const getBgStyle = () => {
    if (hasBlur) {
      // Arka planı preview'da da yarı saydam yap ki blur görünsün
      let baseColor = colors.background;
      if (baseColor.startsWith('#')) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        baseColor = `rgba(${r}, ${g}, ${b}, 0.75)`;
      }
      return { 
        backgroundColor: baseColor,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)'
      };
    }
    return { backgroundColor: colors.background };
  };

  const renderLogo = () => (
    <div className="flex-shrink-0 z-[120]">
      {logo.type === 'text' ? (
        <span 
          className="font-black text-xl md:text-2xl tracking-tighter" 
          style={{ color: colors.primary, fontFamily: `${fontFamily}, sans-serif` }}
        >
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
    <div className={`transition-all duration-700 ease-in-out border border-white/10 rounded-[4rem] overflow-hidden bg-black shadow-2xl relative ${isMobileView ? 'max-w-[375px] mx-auto h-[800px]' : 'w-full h-[800px]'}`}>
      <div className="bg-neutral-900 px-8 py-4 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
        </div>
        <div className="bg-black/50 border border-white/5 rounded-full px-12 py-1 text-[8px] text-neutral-600 font-bold tracking-[0.3em] uppercase truncate max-w-[200px]">
          {isMobileView ? 'Mobile Device' : 'https://lux.zysistem.net'}
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="relative h-full overflow-y-auto scrollbar-hide bg-[#050505]">
        <header 
          className={`w-full transition-all duration-500 z-[100] border-b border-white/5 ${isSticky ? 'sticky top-0' : 'relative'} ${layout === 'floating-pill' ? 'px-8 py-4' : ''}`}
        >
          <div 
            className={`w-full px-6 md:px-12 py-6 flex items-center justify-between transition-all ${layout === 'floating-pill' ? 'rounded-full border border-white/10 mx-auto max-w-[95%] shadow-2xl' : ''}`}
            style={getBgStyle()}
          >
            {renderLogo()}
            
            {!isMobileView && (
              <nav className={`hidden md:flex items-center ${layout === 'split-menu' ? 'gap-20' : 'gap-10'}`}>
                {navigation.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    className="text-[10px] font-black tracking-[0.15em] hover:opacity-50 transition-all uppercase whitespace-nowrap" 
                    style={{ color: colors.text, fontFamily: `${fontFamily}, sans-serif` }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-6">
              {cta && !isMobileView && (
                <a
                  href={cta.url}
                  className="px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.1em] transition-all hover:scale-105 active:scale-95 uppercase shadow-2xl"
                  style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: `${fontFamily}, sans-serif` }}
                >
                  {cta.text}
                </a>
              )}
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white transition-all z-[130] ${isMobileView ? 'block' : 'md:hidden'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[125] flex flex-col items-center justify-center p-12 animate-in fade-in duration-500">
               <nav className="flex flex-col items-center gap-10">
                {navigation.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    className="text-4xl font-black tracking-tighter hover:text-indigo-500 transition-all uppercase" 
                    style={{ color: colors.text, fontFamily: `${fontFamily}, sans-serif` }}
                  >
                    {item.label}
                  </a>
                ))}
                {cta && (
                   <button 
                    className="mt-6 px-12 py-6 rounded-[2rem] text-sm font-black tracking-[0.2em] uppercase shadow-2xl"
                    style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: `${fontFamily}, sans-serif` }}
                   >
                     {cta.text}
                   </button>
                )}
              </nav>
            </div>
          )}
        </header>

        <section className="relative min-h-[700px] flex items-center justify-center px-12 py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000" 
               alt="Hero" 
               className="w-full h-full object-cover opacity-40 grayscale"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-5xl w-full text-center space-y-12">
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">
               <Shield size={14} className="text-indigo-500" /> High-End Technology
             </div>
             <h1 className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] uppercase" style={{fontFamily: `${fontFamily}, sans-serif`}}>
                Design <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 italic">Evolution</span>
             </h1>
             <p className="text-neutral-400 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Yapay zekanın sınırsız hayal gücüyle, markanızı geleceğe taşıyacak olan ultra modern arayüzleri deneyimleyin.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                <button 
                  className="w-full sm:w-auto px-14 py-7 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-[2rem] hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl"
                  style={{fontFamily: `${fontFamily}, sans-serif`}}
                >
                  Start Project <ArrowRight size={18} />
                </button>
                <div className="flex items-center gap-5 text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
                  <Globe size={22} className="text-indigo-600" /> Global Studio
                </div>
             </div>
          </div>
        </section>

        <section className="px-12 py-32 bg-[#080808] border-t border-white/5">
           <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { title: 'Speed', desc: 'Instant design variations powered by Gemini 3.' },
                { title: 'Flex', desc: 'Perfectly compatible with Elementor Flex Containers.' },
                { title: 'UX', desc: 'Optimized for high-conversion and visual storytelling.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[3rem] p-12 space-y-8 hover:border-indigo-500/30 transition-all group shadow-2xl">
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                     <Star size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white text-2xl font-black uppercase tracking-tighter" style={{fontFamily: `${fontFamily}, sans-serif`}}>{feature.title}</h3>
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>
        
        <div className="h-40 bg-black"></div>
      </div>
    </div>
  );
};

export default HeaderPreview;