
import * as React from 'react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: 'HOME' | 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'ZONES') => void;
}

const BiofuelOmanLogo = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" /> {/* Green */}
        <stop offset="100%" stopColor="#FFFFFF" /> {/* White */}
      </linearGradient>
    </defs>
    <path 
      d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z" 
      fill="url(#logo-gradient)"
    />
    <path 
      d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z" 
      stroke="rgba(255,255,255,0.2)" 
      strokeWidth="1"
    />
    {/* Geometric Detail */}
    <path 
      d="M12 6V18 M6 9L18 15 M6 15L18 9" 
      stroke="white" 
      strokeWidth="0.75" 
      strokeLinecap="round"
      className="opacity-30"
    />
    <circle cx="12" cy="12" r="2.5" fill="white" className="animate-pulse" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-black/80 backdrop-blur-xl text-white border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => onTabChange('HOME')}
          >
            <span className="text-xl font-black tracking-tighter text-white group-hover:text-green-500 transition-colors">
              BIOFUEL <span className="text-green-600">INSIGHT</span> AI
            </span>
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em]">
            {[
              { id: 'HOME', label: 'Home' },
              { id: 'INVESTOR_FEASIBILITY', label: 'Investor Feasibility' },
              { id: 'RESEARCH', label: 'Research Analyzer' },
              { id: 'SOLVER', label: 'Challenge Solver' },
              { id: 'OPTIMIZER', label: 'Profit Optimizer' },
              { id: 'STANDARDS', label: 'Standards' },
              { id: 'ZONES', label: 'Zones' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`px-4 py-2 rounded-xl transition-all border ${
                  activeTab === item.id 
                    ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
                    : 'border-transparent text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-slate-500 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-16 items-start">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <BiofuelOmanLogo />
              <span className="text-xs font-black tracking-tighter text-white">
                BIOFUEL INSIGHT AI
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
              The next-generation intelligence layer for Oman's sustainable energy infrastructure and biofuel research.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-12">
              <a href="#" className="hover:text-green-500 transition text-[10px] font-black uppercase tracking-[0.3em]">Terms</a>
              <a href="#" className="hover:text-green-500 transition text-[10px] font-black uppercase tracking-[0.3em]">Policy</a>
              <a href="#" className="hover:text-green-500 transition text-[10px] font-black uppercase tracking-[0.3em]">Contact</a>
            </div>
            <div className="flex space-x-8">
              <i className="fab fa-linkedin hover:text-green-500 cursor-pointer transition text-xl"></i>
              <i className="fab fa-twitter hover:text-green-500 cursor-pointer transition text-xl"></i>
              <i className="fab fa-instagram hover:text-green-500 cursor-pointer transition text-xl"></i>
              <i className="fas fa-envelope hover:text-green-500 cursor-pointer transition text-xl"></i>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">Strategic Partners</h4>
            <p className="text-[10px] leading-relaxed opacity-50 font-bold uppercase tracking-widest">
              Sohar Free Zone • SEZAD • Salalah Port • ASYAD
            </p>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-600">
            © 2026 Biofuel Insight AI. PROPELLED BY ADVANCED INTELLIGENCE.
          </p>
        </div>
      </div>
    </footer>
  );
};
