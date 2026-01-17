
import React from 'react';
import { HeaderDesign } from '../types';
import { Menu, Globe } from 'lucide-react';

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
    <div className="flex-shrink-0 group cursor-pointer">
      {logo.type === 'text' ? (
        <div className="flex flex-col">
          <span className="font-black text-2xl leading-none tracking-tighter" style={{ color: colors.primary }}>
            {logo.content}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-50" style={{ color: colors.text }}>Est. 2024</span>
        </div>
      ) : (
        <img 
          src={logo.content || "https://via.placeholder.com/160x50?text=LOGO"} 
          alt="Logo" 
          className="h-10 w-auto object-contain brightness-110"
        />
      )}
    </div>
  );

  return (
    <div className="w-full border rounded-[2.5rem] overflow-hidden bg-[#111] shadow-2xl relative border-white/5">
      {/* Simulation Browser Header */}
      <div className="bg-neutral-900 px-6 py-3 border-b border-white/5 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-full px-24 py-1 text-[9px] text-neutral-500 font-bold tracking-tight">
          pachacave-hotel.com
        </div>
        <div className="w-10"></div>
      </div>
      
      {/* Scroll Area */}
      <div className="relative h-[550px] overflow-y-auto bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
        <header 
          className={`w-full px-12 py-5 flex items-center transition-all duration-700 z-50 border-b border-white/5 ${isSticky ? 'sticky top-0' : 'relative'}`}
          style={getBgStyle()}
        >
          <div className="container mx-auto flex items-center justify-between gap-8">
            {renderLogo()}
            
            <nav className="hidden lg:flex items-center gap-10">
              {navigation.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  className="text-[12px] font-bold tracking-[0.15em] hover:text-indigo-400 transition-all uppercase whitespace-nowrap" 
                  style={{ color: colors.text }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-6">
              <div className="hidden xl:flex items-center gap-2 text-[11px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer">
                <Globe size={14} />
                <span className="uppercase tracking-widest">Turkish</span>
              </div>
              
              {cta && (
                <a
                  href={cta.url}
                  className="px-8 py-3.5 rounded-xl text-[11px] font-black tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl uppercase"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#fff',
                    boxShadow: `0 10px 30px ${colors.primary}33`
                  }}
                >
                  {cta.text}
                </a>
              )}
              
              <button className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Placeholder */}
        <div className="p-24 space-y-16">
           <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-700">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] text-white font-bold uppercase tracking-[0.4em] mb-4">
                Exclusive Experience
              </div>
              <h2 className="text-6xl font-black text-white tracking-tighter leading-none italic">Unforgettable Stays</h2>
              <div className="h-0.5 w-24 bg-white/20 mx-auto"></div>
              <p className="text-white/60 text-lg font-medium leading-relaxed">Discover luxury redefined in the heart of nature.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPreview;
