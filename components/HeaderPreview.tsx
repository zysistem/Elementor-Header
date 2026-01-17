import React, { useState, useEffect } from 'react';
import { HeaderDesign } from '../types';
import { Menu, X, ArrowRight, Star, Globe, Shield, CheckCircle2 } from 'lucide-react';

interface Props {
  design: HeaderDesign;
  isMobileView?: boolean;
}

const HeaderPreview: React.FC<Props> = ({ design, isMobileView }) => {
  const { colors, logo, navigation, cta, hasBlur, isSticky, fontFamily, layout, sector } = design;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isMobileView]);

  const getBgStyle = () => {
    if (hasBlur) {
      let baseColor = colors.background;
      if (baseColor.startsWith('#')) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        baseColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
      }
      return { 
        backgroundColor: baseColor,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      };
    }
    return { backgroundColor: colors.background };
  };

  const renderLogo = () => (
    <div className="flex-shrink-0 z-[120]">
      {logo.type === 'text' ? (
        <span 
          className="font-bold text-lg md:text-xl tracking-tight" 
          style={{ color: colors.primary, fontFamily: `${fontFamily}, sans-serif` }}
        >
          {logo.content}
        </span>
      ) : (
        <img 
          src={logo.content || "https://via.placeholder.com/150x45?text=Logo"} 
          alt="Logo" 
          className="h-6 md:h-8 w-auto object-contain"
        />
      )}
    </div>
  );

  const heroImage = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&sector=${encodeURIComponent(sector)}`;

  return (
    <div className={`transition-all duration-700 ease-in-out border border-white/5 rounded-[3rem] overflow-hidden bg-black shadow-2xl relative ${isMobileView ? 'max-w-[375px] mx-auto h-[750px]' : 'w-full h-[750px]'}`}>
      <div className="bg-neutral-900/50 px-8 py-3 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/10"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/10"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/10"></div>
        </div>
        <div className="bg-black/20 rounded-full px-6 py-0.5 text-[7px] text-neutral-600 font-medium tracking-[0.2em] uppercase truncate max-w-[180px]">
          {isMobileView ? 'Mobile Device' : `https://preview.${sector.toLowerCase().replace(/\s+/g, '')}.com`}
        </div>
        <div className="w-6"></div>
      </div>
      
      <div className="relative h-full overflow-y-auto scrollbar-hide bg-[#050505]">
        <header 
          className={`w-full transition-all duration-500 z-[100] ${isSticky ? 'sticky top-0' : 'relative'} ${layout === 'floating-pill' ? 'px-6 py-3' : ''}`}
        >
          <div 
            className={`w-full px-6 md:px-10 py-4 flex items-center justify-between transition-all ${layout === 'floating-pill' ? 'rounded-full border border-white/5 mx-auto max-w-[98%] shadow-lg' : 'border-b border-white/5'}`}
            style={getBgStyle()}
          >
            {renderLogo()}
            
            {!isMobileView && (
              <nav className="hidden md:flex items-center gap-8">
                {navigation.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    className="text-[11px] font-medium tracking-wide hover:opacity-60 transition-all uppercase" 
                    style={{ color: colors.text, fontFamily: `${fontFamily}, sans-serif` }}
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
                  className="px-6 py-3 rounded-lg text-[10px] font-semibold tracking-wide transition-all hover:brightness-110 active:scale-95 uppercase shadow-sm"
                  style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: `${fontFamily}, sans-serif` }}
                >
                  {cta.text}
                </a>
              )}
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg bg-white/5 border border-white/5 text-white transition-all z-[130] ${isMobileView ? 'block' : 'md:hidden'}`}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[125] flex flex-col items-center justify-center p-12 animate-in fade-in duration-300">
               <nav className="flex flex-col items-center gap-8">
                {navigation.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    className="text-2xl font-semibold tracking-tight hover:text-indigo-500 transition-all uppercase" 
                    style={{ color: colors.text, fontFamily: `${fontFamily}, sans-serif` }}
                  >
                    {item.label}
                  </a>
                ))}
                {cta && (
                   <button 
                    className="mt-4 px-10 py-5 rounded-xl text-sm font-semibold tracking-wider uppercase"
                    style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: `${fontFamily}, sans-serif` }}
                   >
                     {cta.text}
                   </button>
                )}
              </nav>
            </div>
          )}
        </header>

        <section className="relative min-h-[600px] flex items-center justify-center px-10 py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src={heroImage}
               alt="Hero" 
               className="w-full h-full object-cover opacity-25 grayscale"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl w-full text-center space-y-10">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/5 rounded-full text-[9px] font-medium text-white/50 uppercase tracking-[0.2em]">
               <CheckCircle2 size={12} className="text-indigo-500" /> Sector Leader
             </div>
             <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]" style={{fontFamily: `${fontFamily}, sans-serif`}}>
                Design for <br/> 
                <span className="opacity-50 font-light">{sector}</span>
             </h1>
             <p className="text-neutral-500 text-sm md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Elevate your brand in the {sector} market with modern architecture and AI integration.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <button 
                  className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3"
                  style={{fontFamily: `${fontFamily}, sans-serif`}}
                >
                  Get Started <ArrowRight size={14} />
                </button>
                <div className="flex items-center gap-4 text-white/20 text-[9px] font-bold uppercase tracking-[0.2em]">
                  <Globe size={18} className="text-indigo-600" /> Global Standards
                </div>
             </div>
          </div>
        </section>

        <section className="px-10 py-24 bg-[#080808] border-t border-white/5">
           <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 space-y-6 group">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 border border-white/5 group-hover:scale-110 transition-transform">
                     <Star size={20} />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
                    <div className="h-2 w-full bg-white/5 rounded-full"></div>
                    <div className="h-2 w-2/3 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              ))}
           </div>
        </section>
        
        <div className="h-20 bg-black"></div>
      </div>
    </div>
  );
};

export default HeaderPreview;