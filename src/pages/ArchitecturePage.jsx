import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  HardDrive,
  ArrowLeftRight,
  Layers,
  Cpu,
  Calculator,
  CheckCircle,
  X
} from 'lucide-react';
import { pipelineStages, architectureDetails } from '../data/sampleData';
import { useSimulation } from '../context/SimulationContext';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Database': return Database;
    case 'HardDrive': return HardDrive;
    case 'ArrowLeftRight': return ArrowLeftRight;
    case 'Layers': return Layers;
    case 'Cpu': return Cpu;
    case 'Calculator': return Calculator;
    case 'CheckCircle': return CheckCircle;
    default: return Database;
  }
};

const ArchitecturePage = () => {
  const [selectedStage, setSelectedStage] = useState(null);
  const { isSimulating } = useSimulation();

  return (
    <div className="min-h-screen text-slate-200 p-6 relative overflow-hidden bg-grid">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Left/Main Column: Pipeline */}
        <div className={`flex-1 transition-all duration-500 ${selectedStage ? 'lg:w-1/2 xl:w-2/3' : 'w-full'}`}>
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold section-title mb-4 text-white">Processing Architecture</h1>
            <p className="text-slate-400 text-lg">Complete data flow from digital library to processed result</p>
          </div>
          
          <div className="flex flex-col items-center relative py-8">
            {pipelineStages.map((stage, index) => {
              const Icon = getIcon(stage.icon);
              const isSelected = selectedStage === stage.id;
              const hasNext = index < pipelineStages.length - 1;

              return (
                <React.Fragment key={stage.id}>
                  {/* Pipeline Node */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedStage(stage.id === selectedStage ? null : stage.id)}
                    className={`w-full max-w-xl p-6 rounded-xl cursor-pointer relative overflow-hidden transition-all duration-300 backdrop-blur-md ${
                      isSelected 
                        ? 'ring-2 ring-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.3)] scale-105' 
                        : 'hover:scale-[1.02] hover:border-white/20 shadow-lg'
                    }`}
                    style={{ 
                      background: isSelected ? 'rgba(25, 30, 58, 0.85)' : 'rgba(15, 18, 35, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderLeft: `6px solid ${stage.color}` 
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <div 
                        className="p-4 rounded-full shrink-0 border" 
                        style={{ 
                          backgroundColor: `${stage.color}18`, 
                          borderColor: `${stage.color}35` 
                        }}
                      >
                        <Icon size={32} style={{ color: stage.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{stage.label}</h3>
                        <p className="text-slate-400 text-sm md:text-base">{stage.description}</p>
                      </div>
                    </div>
                    {/* Active Indicator Animation when simulating */}
                    {isSimulating && (
                      <motion.div
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </motion.div>

                  {/* Connector Line & Data Flow */}
                  {hasNext && (
                    <div className="h-16 flex flex-col items-center justify-center relative w-full">
                      <div className="w-[2px] h-full bg-white/10 relative overflow-hidden">
                        {/* Data packets flowing */}
                        <motion.div
                          className="w-[2px] h-4 bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)] absolute left-0"
                          animate={{ top: ['-20%', '120%'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: index * 0.2 }}
                        />
                         <motion.div
                          className="w-[2px] h-4 bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)] absolute left-0"
                          animate={{ top: ['-20%', '120%'] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: index * 0.2 + 0.6 }}
                        />
                      </div>
                      <div className="connector-arrow w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/30 absolute bottom-[-4px] left-1/2 -translate-x-1/2 z-10" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        <AnimatePresence>
          {selectedStage && architectureDetails[selectedStage] && (
            <motion.div
              initial={{ opacity: 0, x: 50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: 50, width: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:w-1/2 xl:w-1/3 w-full sticky top-6 self-start mt-8 lg:mt-0 z-20"
            >
              <div 
                className="rounded-2xl p-6 lg:p-8 relative h-auto backdrop-blur-xl shadow-2xl" 
                style={{ 
                  background: 'rgba(15, 18, 35, 0.88)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)' 
                }}
              >
                <button
                  onClick={() => setSelectedStage(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {(() => {
                  const details = architectureDetails[selectedStage];
                  const stageInfo = pipelineStages.find(s => s.id === selectedStage);
                  const Icon = getIcon(stageInfo.icon);
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 0.2 }}
                      className="space-y-6 mt-4"
                    >
                      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <div 
                          className="p-3 rounded-xl shadow-inner border" 
                          style={{ 
                            backgroundColor: `${stageInfo.color}20`, 
                            borderColor: `${stageInfo.color}40` 
                          }}
                        >
                          <Icon size={32} style={{ color: stageInfo.color }} />
                        </div>
                        <h2 className="text-3xl font-bold gradient-text bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, #a78bfa, ${stageInfo.color})` }}>
                          {details.title}
                        </h2>
                      </div>

                      <div className="space-y-5">
                        <div 
                          className="p-5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                          style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                        >
                          <h4 className="text-violet-400 font-semibold mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]"></span>
                            What it does
                          </h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{details.what}</p>
                        </div>

                        <div 
                          className="p-5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                          style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                        >
                          <h4 className="text-purple-400 font-semibold mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]"></span>
                            Why it is required
                          </h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{details.why}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            className="p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                          >
                            <h4 className="text-slate-400 font-semibold mb-2 uppercase text-xs tracking-widest">Data Types</h4>
                            <p className="text-white text-sm font-medium">{details.dataTypes}</p>
                          </div>
                          
                          <div 
                            className="p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                          >
                            <h4 className="text-slate-400 font-semibold mb-2 uppercase text-xs tracking-widest">Pipeline Role</h4>
                            <p className="text-white text-sm font-medium">{details.role}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArchitecturePage;
