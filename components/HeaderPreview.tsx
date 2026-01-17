
import React from 'react';
import { HeaderDesign } from '../types';
import { Menu, Globe, Smartphone, Monitor } from 'lucide-react';

interface Props {
  design: HeaderDesign;
}

const HeaderPreview: React.FC<Props> = ({ design }) => {
  const { colors, logo, navigation, cta, layout, hasBlur, isSticky } = design;

  const getBgStyle = () => {
    if (hasBlur) {
      return { 
        backgroundColor: colors.background.includes('rgba') ? colors.background : `${colors.background}f2`,
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)'
      };
    }
    return { backgroundColor: colors.background };
  };

  const renderLogo = () => (
    <div className="flex-shrink-0">
      {logo.type === 'text' ? (
        <span className="font-black text-xl tracking-tighter" style={{ color: colors.primary }}>
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
    <div className="w-full border rounded-[2.5rem] overflow-hidden bg-[#050505] shadow-2xl relative border-white/5 transition-all">
      {/* Simulation Browser Header */}
      <div className="bg-neutral-900/50 px-5 py-2.5 border-b border-white/5 flex justify-between items-center">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
        </div>
        <div className="hidden sm:block bg-black/40 border border-white/5 rounded-full px-16 py-0.5 text-[8px] text-neutral-500 font-bold uppercase tracking-widest">
          {design.sector.replace(/\s+/g, '-').toLowerCase()}.com
        </div>
        <div className="w-8"></div>
      </div>
      
      {/* Container simulating a phone or desktop viewport based on parent size */}
      <div className="relative h-[450px] overflow-y-auto bg-neutral-900 overflow-x-hidden">
        <header 
          className={`w-full px-6 md:px-12 py-4 flex items-center transition-all duration-700 z-50 border-b border-white/5 ${isSticky ? 'sticky top-0' : 'relative'}`}
          style={getBgStyle()}
        >
          <div className="container mx-auto flex items-center justify-between">
            {renderLogo()}
            
            {/* Desktop Nav - Hidden on mobile preview if container is small */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-10">
              {navigation.slice(0, 4).map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  className="text-[10px] lg:text-[11px] font-black tracking-[0.2em] hover:opacity-50 transition-all uppercase whitespace-nowrap" 
                  style={{ color: colors.text }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {cta && (
                <a
                  href={cta.url}
                  className="hidden sm:block px-6 py-2.5 rounded-lg text-[10px] font-black tracking-[0.15em] transition-all hover:brightness-110 uppercase"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#fff'
                  }}
                >
                  {cta.text}
                </a>
              )}
              
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white" style={{ color: colors.primary }}>
                <Menu size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dummy Content */}
        <div className="p-10 space-y-10 text-center">
           <div className="space-y-4 pt-10">
              <div className="h-4 w-24 bg-indigo-500/20 rounded-full mx-auto"></div>
              <h2 className="text-4xl font-black text-white italic">{design.style.toUpperCase()}</h2>
              <div className="h-1 w-10 bg-indigo-500 mx-auto"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="h-40 bg-white/5 rounded-3xl border border-white/5"></div>
              <div className="h-40 bg-white/5 rounded-3xl border border-white/5"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPreview;
