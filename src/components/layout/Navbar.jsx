import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, Database, HardDrive, ArrowLeftRight, Layers, Calculator, Play, BookOpen, Info } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Library', icon: BookOpen },
  { path: '/home', label: 'Pipeline', icon: Cpu },
  { path: '/architecture', label: 'Architecture', icon: Database },
  { path: '/memory', label: 'Memory', icon: HardDrive },
  { path: '/bus', label: 'Bus', icon: ArrowLeftRight },
  { path: '/registers', label: 'Registers', icon: Layers },
  { path: '/processor', label: 'Processor', icon: Cpu },
  { path: '/alu', label: 'ALU', icon: Calculator },
  { path: '/simulations', label: 'Simulations', icon: Play },
  { path: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'backdrop-blur-xl border-b border-white/5' : ''
    }`} style={{ background: scrolled ? 'rgba(11,13,23,0.85)' : 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #7c3aed, #6d28d9, #5b21b6)', boxShadow: '0 4px 15px rgba(124,58,237,0.4)'}}>
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{boxShadow: '0 0 20px rgba(124,58,237,0.5)'}} />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold tracking-wide text-white">DLPF</div>
              <div className="text-[10px] text-violet-400 -mt-0.5">Processing Framework</div>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    isActive ? 'text-violet-300' : 'text-slate-500 hover:text-violet-400'
                  }`}
                  style={isActive ? { background: 'rgba(124,58,237,0.15)' } : {}}>
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {isActive && (
                    <motion.div layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                  )}
                </Link>
              );
            })}
          </div>
          <button className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-violet-400 transition-colors"
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/5 overflow-hidden" style={{ background: 'rgba(11,13,23,0.95)' }}>
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'text-violet-300' : 'text-slate-500 hover:text-violet-400'
                    }`}
                    style={isActive ? { background: 'rgba(124,58,237,0.15)' } : {}}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
