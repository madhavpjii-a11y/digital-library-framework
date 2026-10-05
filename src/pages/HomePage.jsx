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
    <div className="min-h-screen text-slate-900 relative overflow-hidden bg-grid">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/95 to-white z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text gradient-text">
            Digital Library Processing Framework
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Visualizing how digital information is stored, transferred and processed inside a computer system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/architecture" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-[#4f46e5] text-white hover:bg-slate-50 transition-colors">
              Explore Framework <ArrowRight size={20} />
            </Link>
            <Link to="/simulations" className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border border-[#4f46e5] text-[#4f46e5] hover:bg-indigo-50 transition-colors">
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
                className="absolute w-2 h-2 rounded-full bg-indigo-500 shadow-md"
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
                    <div className="bg-white border-slate-200 shadow-sm p-4 flex items-center gap-4 rounded-xl border-l-4 border backdrop-blur-md hover:border-slate-300 transition-all" style={{ borderLeftColor: stage.color || '#4f46e5' }}>
                      <div className="p-3 rounded-lg bg-indigo-50" style={{ color: stage.color || '#4f46e5' }}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{stage.label}</h3>
                        <p className="text-sm text-slate-600">{stage.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {index < (pipelineStages?.length || 7) - 1 && (
                  <motion.div variants={itemVariants} className="h-12 flex items-center justify-center relative z-0">
                    <div className="w-0.5 h-full bg-slate-200 relative">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-300"></div>
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
        className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 p-4 rounded-xl hidden md:block w-64 backdrop-blur-md shadow-sm"
      >
        <h4 className="font-bold mb-3 border-b border-slate-200 pb-2 flex items-center gap-2 text-slate-900">
          <Cpu size={16} className="text-[#4f46e5]" />
          System Status
        </h4>
        <div className="space-y-2">
          {Object.entries(systemStatus).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-slate-600">{key}</span>
              <span className={`status-badge px-2 py-0.5 rounded-full capitalize text-xs ${value.toLowerCase() === 'ready' ? 'bg-[#00ffaa]/20 text-[#00ffaa]' : 'bg-yellow-500/20 text-yellow-500'}`}>
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
