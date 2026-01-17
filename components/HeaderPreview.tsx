import React, { useState, useEffect } from 'react';
import { HeaderDesign } from '../types';
import { Menu, X, ArrowRight, Star, Globe, Shield, CheckCircle2, Phone, Mail, Facebook, Instagram, Twitter, Search } from 'lucide-react';

interface Props {
  design: HeaderDesign;
  isMobileView?: boolean;
}

const HeaderPreview: React.FC<Props> = ({ design, isMobileView }) => {
  const { colors, logo, navigation, cta, hasBlur, isSticky, fontFamily, layout, sector, topBar } = design;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isMobileView, design]);

  const getBgStyle = () => {
    if (hasBlur && layout !== 'dual-bar') {
      let baseColor = colors.background;
      if (baseColor.startsWith('#')) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        baseColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
      }
      return { 
        backgroundColor: baseColor,
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)'
      };
    }
    return { backgroundColor: layout === 'dual-bar' ? '#FFFFFF' : colors.background };
  };

  const renderLogo = () => (
    <div className={`flex-shrink-0 z-[120] ${layout === 'center-logo' || layout === 'split-menu' ? 'mx-auto md:mx-0' : ''}`}>
      {logo.type === 'text' ? (
        <span 
          className="font-black text-xl md:text-2xl tracking-tighter" 
          style={{ color: colors.primary, fontFamily: `${fontFamily}, sans-serif` }}
        >
          {logo.content}.
        </span>
      ) : (
        <img 
          src={logo.content || "https://via.placeholder.com/150x45?text=Logo"} 
          alt="Logo" 
          className="h-6 md:h-9 w-auto object-contain"
        />
      )}
    </div>
  );

  // For Split Menu
  const midPoint = Math.ceil(navigation.length / 2);
  const leftNav = navigation.slice(0, midPoint);
  const rightNav = navigation.slice(midPoint);

  return (
    <div className={`transition-all duration-700 ease-in-out border border-white/5 rounded-[3rem] overflow-hidden bg-black shadow-2xl relative ${isMobileView ? 'max-w-[375px] mx-auto h-[750px]' : 'w-full h-[750px]'}`}>
      <div className="bg-neutral-900/50 px-8 py-3 border-b border-white/5 flex justify-between items-center shrink-0 z-[140] relative">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
        </div>
        <div className="bg-black/40 rounded-full px-6 py-1 text-[8px] text-neutral-500 font-bold tracking-[0.2em] uppercase truncate max-w-[200px]">
          {isMobileView ? 'Mobile Preview' : `www.${sector.toLowerCase().replace(/\s+/g, '-')}.ai`}
        </div>
        <div className="w-8"></div>
      </div>
      
      <div className="relative h-full overflow-y-auto scrollbar-hide bg-[#050505]">
        <header className={`${isSticky ? 'sticky top-0' : 'relative'} z-[100] transition-all duration-500`}>
          {/* Top Bar for Dual-Bar Layout */}
          {layout === 'dual-bar' && !isMobileView && (
            <div className="px-10 py-2.5 flex justify-between items-center border-b border-white/5" style={{backgroundColor: colors.primary}}>
               <div className="flex gap-6 items-center">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 uppercase tracking-widest">
                    <Phone size={12} /> {topBar?.phone || '+1 234 567 89'}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 uppercase tracking-widest">
                    <Mail size={12} /> {topBar?.email || 'hello@brand.com'}
                  </div>
               </div>
               <div className="flex gap-4 text-white/80">
                  <Facebook size={14} /> <Instagram size={14} /> <Twitter size={14} />
               </div>
            </div>
          )}

          {/* Main Navigation Bar */}
          <div 
            className={`w-full transition-all duration-500 ${layout === 'floating-pill' ? 'px-6 py-4' : ''}`}
          >
            <div 
              className={`flex items-center justify-between py-5 px-10 transition-all ${layout === 'floating-pill' ? 'rounded-full border border-white/10 shadow-2xl mx-auto max-w-[95%]' : 'border-b border-white/5'}`}
              style={getBgStyle()}
            >
              {/* Left Side (Logo or Menu) */}
              {layout === 'split-menu' && !isMobileView ? (
                 <nav className="flex items-center gap-8 flex-1">
                    {leftNav.map((item, i) => (
                      <a key={i} href={item.url} className="text-[11px] font-bold uppercase tracking-widest hover:opacity-50 transition-all" style={{color: colors.text, fontFamily}}>{item.label}</a>
                    ))}
                 </nav>
              ) : layout !== 'center-logo' && renderLogo()}

              {/* Center (Logo or Menu) */}
              {layout === 'center-logo' && !isMobileView && renderLogo()}
              {layout === 'split-menu' && !isMobileView && renderLogo()}
              {(layout === 'left-logo' || layout === 'dual-bar' || layout === 'floating-pill') && !isMobileView && (
                <nav className="hidden md:flex items-center gap-10">
                  {navigation.map((item, idx) => (
                    <a key={idx} href={item.url} className="text-[11px] font-bold uppercase tracking-widest hover:opacity-50 transition-all" style={{ color: colors.text, fontFamily }}>
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}

              {/* Right Side (CTA / Split Nav) */}
              <div className="flex items-center gap-6 flex-1 justify-end">
                {layout === 'split-menu' && !isMobileView && (
                   <nav className="flex items-center gap-8 mr-8">
                      {rightNav.map((item, i) => (
                        <a key={i} href={item.url} className="text-[11px] font-bold uppercase tracking-widest hover:opacity-50 transition-all" style={{color: colors.text, fontFamily}}>{item.label}</a>
                      ))}
                   </nav>
                )}
                
                {!isMobileView && <Search size={18} className="opacity-40 cursor-pointer hover:opacity-100 transition-opacity" style={{color: colors.text}} />}

                {cta && !isMobileView && (
                  <button
                    className="px-8 py-3.5 rounded-xl text-[10px] font-black tracking-[0.15em] transition-all hover:scale-105 active:scale-95 uppercase shadow-xl"
                    style={{ backgroundColor: colors.primary, color: '#fff', fontFamily }}
                  >
                    {cta.text}
                  </button>
                )}
                
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-white transition-all z-[130] ${isMobileView ? 'block' : 'md:hidden'}`}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Overlay Menu */}
          {isMenuOpen && (
            <div 
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl z-[125] flex flex-col items-center justify-center p-12 animate-in fade-in duration-500"
              onClick={() => setIsMenuOpen(false)}
            >
               <nav className="flex flex-col items-center gap-10" onClick={(e) => e.stopPropagation()}>
                {navigation.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.url} 
                    className="text-3xl font-black tracking-tighter hover:text-indigo-500 transition-all uppercase" 
                    style={{ color: colors.text, fontFamily }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {cta && (
                   <button 
                    className="mt-6 px-12 py-5 rounded-2xl text-xs font-black tracking-[0.2em] uppercase shadow-2xl"
                    style={{ backgroundColor: colors.primary, color: '#fff', fontFamily }}
                    onClick={() => setIsMenuOpen(false)}
                   >
                     {cta.text}
                   </button>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* Dynamic Landing Preview Content */}
        <section className="relative min-h-[650px] flex items-center justify-center px-10 py-32 overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 z-0">
             <img 
               src={`https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200`}
               alt="Hero" 
               className="w-full h-full object-cover opacity-10 grayscale brightness-50"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50"></div>
          </div>

          <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
             <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
               <CheckCircle2 size={14} className="text-emerald-500" /> Premium Design
             </div>
             <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]" style={{fontFamily}}>
                {sector} <br/> 
                <span className="opacity-20 font-light italic">Reimagined.</span>
             </h1>
             <p className="text-neutral-500 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Experience the next generation of web architecture. Built with AI, refined for {sector} market leadership.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                <button 
                  className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-4 shadow-2xl"
                  style={{fontFamily}}
                >
                  Explore <ArrowRight size={16} />
                </button>
                <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Globe size={20} className="opacity-50" /> Global Scale
                </div>
             </div>
          </div>
        </section>

        <section className="px-10 py-32 bg-[#080808] border-t border-white/5">
           <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 space-y-8 group hover:bg-white/[0.07] transition-all">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/5 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                     <Star size={24} />
                  </div>
                  <div className="space-y-4">
                    <div className="h-5 w-3/4 bg-white/10 rounded-lg"></div>
                    <div className="h-3 w-full bg-white/5 rounded-lg"></div>
                    <div className="h-3 w-2/3 bg-white/5 rounded-lg"></div>
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