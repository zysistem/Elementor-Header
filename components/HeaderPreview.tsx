import React, { useState, useEffect } from 'react';
import { HeaderDesign } from '../types';
import { Menu, X, ArrowRight, Star, MapPin } from 'lucide-react';

interface Props {
  design: HeaderDesign;
  isMobileView?: boolean;
}

const HeaderPreview: React.FC<Props> = ({ design, isMobileView }) => {
  const { colors, logo, navigation, cta, hasBlur, isSticky } = design;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when view changes
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
    <div className={`transition-all duration-700 ease-in-out border border-white/10 rounded-[2.5rem] overflow-hidden bg-black shadow-2xl relative ${isMobileView ? 'max-w-[375px] mx-auto h-[700px]' : 'w-full h-[700px]'}`}>
      {/* Simulation Top Bar */}
      <div className="bg-neutral-900 px-6 py-3 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
        </div>
        <div className="bg-black/50 border border-white/5 rounded-full px-8 py-0.5 text-[8px] text-neutral-500 font-bold tracking-widest uppercase truncate max-w-[150px]">
          {isMobileView ? 'Mobile' : 'pachacave-hotel.com'}
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

        {/* HERO SECTION */}
        <section className="relative min-h-[550px] flex items-center justify-center px-8 py-20">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2000" 
               alt="Hero" 
               className="w-full h-full object-cover opacity-50 grayscale-[0.3]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">
               <Star size={10} fill="currentColor" /> Premium Experience
             </div>
             <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] md:leading-[1]">
                Unutulmaz <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 italic">Anlar Keşfedin</span>
             </h1>
             <p className="text-neutral-400 text-sm md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
                Modern mimari ve eşsiz doğanın buluştuğu noktada, hayallerinizin ötesinde bir tatil deneyimi sizi bekliyor.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                  className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3"
                >
                  Şimdi Rezervasyon Yap <ArrowRight size={14} />
                </button>
                <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest px-6 py-4">
                  <MapPin size={14} className="text-indigo-500" /> Cappadocia, Turkey
                </div>
             </div>
          </div>
        </section>

        {/* Content Section Placeholder */}
        <section className="px-8 py-20 bg-[#070707]">
           <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6 group hover:bg-white/[0.08] transition-all">
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                     <Star size={24} />
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 w-1/2 bg-white/20 rounded-full"></div>
                    <div className="space-y-2">
                       <div className="h-2 w-full bg-white/5 rounded-full"></div>
                       <div className="h-2 w-4/5 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>
        
        {/* Extra Height for Scroll Testing */}
        <div className="h-80 bg-gradient-to-b from-[#070707] to-black"></div>
      </div>
    </div>
  );
};

export default HeaderPreview;