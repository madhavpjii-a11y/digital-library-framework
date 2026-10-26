import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Database, HardDrive, ArrowLeftRight, 
  Layers, Cpu, Calculator, CheckCircle, 
  ArrowRight, Play 
} from 'lucide-react';
import { pipelineStages } from '../data/sampleData';
import { useSimulation } from '../context/SimulationContext';

const HomePage = () => {
  const { state } = useSimulation();
  
  const iconMap = {
    'Database': Database,
    'HardDrive': HardDrive,
    'ArrowLeftRight': ArrowLeftRight,
    'Layers': Layers,
    'Cpu': Cpu,
    'Calculator': Calculator,
    'CheckCircle': CheckCircle
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const systemStatus = state?.systemStatus || { 
    Memory: 'ready', 
    Bus: 'ready', 
    Registers: 'ready', 
    Processor: 'ready', 
    ALU: 'ready', 
    System: 'ready' 
  };

  return (
    <div className="min-h-screen text-slate-200 relative overflow-hidden bg-grid">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-transparent pointer-events-none z-0" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.25, 1],
              opacity: [0.15, 0.28, 0.15]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/25 to-pink-600/15 rounded-full blur-3xl pointer-events-none"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text gradient-text">
            Digital Library Processing Framework
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Visualizing how digital information is stored, transferred and processed inside a computer system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/architecture" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#4f46e5] text-white hover:bg-violet-700 shadow-lg shadow-violet-500/25 transition-all">
              Explore Framework <ArrowRight size={20} />
            </Link>
            <Link to="/simulations" className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border border-violet-500/30 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 transition-all">
              Start Simulation <Play size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Pipeline Diagram */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32 w-full max-w-md z-10 relative pb-20"
        >
          {/* Animated data packets */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -ml-px z-0">
            {[1, 2, 3].map((packet) => (
              <motion.div
                key={packet}
                className="absolute w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]"
                style={{ left: '-3px' }}
                animate={{
                  top: ['0%', '100%'],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: packet * 1.3
                }}
              />
            ))}
          </div>

          {(pipelineStages || []).map((stage, index) => {
            const Icon = iconMap[stage.icon] || Database;
            const routeMap = { library: '/architecture', result: '/simulations' };
            const route = routeMap[stage.id] || `/${stage.id}`;
            return (
              <React.Fragment key={stage.id || index}>
                <motion.div variants={itemVariants} className="relative z-10">
                  <Link to={route}>
                    <div 
                      className="p-4 flex items-center gap-4 rounded-xl border-l-4 border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] group" 
                      style={{ 
                        background: 'rgba(15, 18, 35, 0.8)', 
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        borderLeftColor: stage.color || '#8b5cf6',
                        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div 
                        className="p-3 rounded-lg transition-transform duration-300 group-hover:scale-110" 
                        style={{ 
                          backgroundColor: stage.color ? `${stage.color}18` : 'rgba(139, 92, 246, 0.12)',
                          color: stage.color || '#a78bfa',
                          border: `1px solid ${stage.color ? `${stage.color}30` : 'rgba(139, 92, 246, 0.25)'}`
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-violet-300 transition-colors">{stage.label}</h3>
                        <p className="text-sm text-slate-400">{stage.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {index < (pipelineStages?.length || 7) - 1 && (
                  <motion.div variants={itemVariants} className="h-12 flex items-center justify-center relative z-0">
                    <div className="w-0.5 h-full bg-white/10 relative">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/30"></div>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </motion.div>
      </section>

      {/* System Status Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-xl hidden md:block w-64 backdrop-blur-md"
        style={{ 
          background: 'rgba(15, 18, 35, 0.85)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
        }}
      >
        <h4 className="font-bold mb-3 border-b border-white/10 pb-2 flex items-center gap-2 text-white">
          <Cpu size={16} className="text-violet-400" />
          System Status
        </h4>
        <div className="space-y-2">
          {Object.entries(systemStatus).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-slate-400">{key}</span>
              <span className={`status-badge px-2 py-0.5 rounded-full capitalize text-xs border ${
                value.toLowerCase() === 'ready' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
