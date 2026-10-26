import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ArrowRight, Cpu, RotateCcw, Download, Plus, Minus, Trash2 } from 'lucide-react';
import { addressingModes } from '../data/sampleData';
import { useSimulation } from '../context/SimulationContext';

export default function RegistersPage() {
  const { state, dispatch } = useSimulation();
  
  // Local state for stack input
  const [stackInput, setStackInput] = useState('');
  
  // Local state for register load animation status
  const [loadStatus, setLoadStatus] = useState('IDLE'); // IDLE, REGISTER LOAD, LOADED
  const [flashingRegs, setFlashingRegs] = useState(false);

  const handleLoadSampleData = () => {
    setLoadStatus('REGISTER LOAD');
    // Simulate loading delay
    setTimeout(() => {
      dispatch({ 
        type: 'SET_REGISTERS', 
        payload: { R0: 20, R1: 15, R2: 0, R3: 0, PC: 100, IR: '0x3A01' } 
      });
      setLoadStatus('LOADED');
      setFlashingRegs(true);
      
      setTimeout(() => {
        setFlashingRegs(false);
      }, 500);
      
      setTimeout(() => {
        setLoadStatus('IDLE');
      }, 2000);
    }, 800);
  };

  const handleResetRegisters = () => {
    dispatch({ 
      type: 'SET_REGISTERS', 
      payload: { R0: 0, R1: 0, R2: 0, R3: 0, PC: 0, IR: '0x0000' } 
    });
  };

  const handlePush = () => {
    if (stackInput !== '' && !isNaN(Number(stackInput))) {
      // Max 8 items
      if (state.stack.length < 8) {
        dispatch({ type: 'PUSH_STACK', payload: Number(stackInput) });
        setStackInput('');
      }
    }
  };

  const handlePop = () => {
    if (state.stack.length > 0) {
      dispatch({ type: 'POP_STACK' });
    }
  };

  const handleClearStack = () => {
    dispatch({ type: 'CLEAR_STACK' });
  };

  // Safe defaults if state is undefined during initial render or mocking
  const registers = state?.registers || { R0: 0, R1: 0, R2: 0, R3: 0, PC: 0, IR: '0x0000', SP: 0 };
  const stack = state?.stack || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-slate-200">
      <h1 className="text-3xl font-bold section-title gradient-text">Registers & Stack Simulator</h1>

      {/* SECTION 1: Register Simulator */}
      <section 
        className="p-6 rounded-xl border backdrop-blur-md"
        style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
            <Cpu className="text-violet-400" /> Register Simulator
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className={`status-badge px-3 py-1 rounded-full text-sm font-medium border ${
              loadStatus === 'LOADED' 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                : 'bg-violet-500/15 text-violet-300 border-violet-500/30'
            }`}>
              Status: {loadStatus}
            </span>
            <button 
              onClick={handleLoadSampleData} 
              className="btn-primary bg-violet-600 text-white hover:bg-violet-700 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-violet-600/30 text-sm font-semibold"
            >
              <Download size={16} /> Load Sample Data
            </button>
            <button 
              onClick={handleResetRegisters} 
              className="btn-secondary bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm font-semibold"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Visual Flow */}
        <div className="flex justify-center items-center mb-8 h-20 relative">
          <div 
            className="px-6 py-3 flex items-center gap-2 z-10 rounded-lg backdrop-blur-sm border border-white/10"
            style={{ background: 'rgba(255, 255, 255, 0.04)' }}
          >
            <Database className="text-purple-400" size={20} />
            <span className="font-semibold tracking-wider text-slate-200">MEMORY</span>
          </div>
          
          <div className="mx-2 flex-1 max-w-[250px] relative">
            <div className="w-full h-[2px] bg-white/10 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full text-slate-500">
                 <ArrowRight size={18} />
              </div>
            </div>
            {loadStatus === 'REGISTER LOAD' && (
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                initial={{ left: 0 }}
                animate={{ left: '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            )}
            <div className="text-center text-xs text-slate-500 mt-2 font-mono tracking-widest">BUS</div>
          </div>
          
          <div 
            className="px-6 py-3 flex items-center gap-2 z-10 rounded-lg backdrop-blur-sm border border-white/10 ml-4"
            style={{ background: 'rgba(255, 255, 255, 0.04)' }}
          >
            <Cpu className="text-violet-400" size={20} />
            <span className="font-semibold tracking-wider text-slate-200">REGISTER</span>
          </div>
        </div>

        {/* Registers Grid - Dark register boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['R0', 'R1', 'R2', 'R3', 'PC', 'IR', 'SP'].map((reg) => (
            <div 
              key={reg} 
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                flashingRegs 
                  ? 'bg-violet-500/20 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-105' 
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-sm text-slate-400 font-medium mb-1">{reg}</span>
              <span className="text-xl font-mono text-white font-bold">{registers[reg]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Stack Simulator */}
      <section 
        className="p-6 rounded-xl border backdrop-blur-md"
        style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-white">
          <Database className="text-purple-400" /> Stack Simulator
        </h2>
        <p className="text-slate-400 mb-6 flex items-center gap-2">
          <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded text-xs font-bold tracking-wider border border-purple-500/20">LIFO</span> 
          Last In, First Out
        </p>

        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start justify-center">
          {/* Controls */}
          <div 
            className="flex flex-col gap-4 w-full md:w-64 border rounded-xl p-5 backdrop-blur-sm"
            style={{ background: 'rgba(10, 14, 28, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <h3 className="text-lg font-medium text-white mb-2 border-b border-white/10 pb-2">Controls</h3>
            
            <div className="flex gap-2">
              <input 
                type="number" 
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                placeholder="Value..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-sm font-mono"
                onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              />
              <button 
                onClick={handlePush} 
                disabled={stack.length >= 8 || stackInput === ''}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center px-4 rounded-lg text-white transition-colors shadow-md shadow-purple-600/30"
                title="Push"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="flex gap-2 mt-2">
              <button 
                onClick={handlePop} 
                disabled={stack.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <Minus size={18} /> Pop
              </button>
              <button 
                onClick={handleClearStack} 
                disabled={stack.length === 0}
                className="border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-rose-400 rounded-lg flex items-center justify-center px-4 transition-colors"
                title="Clear"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="text-xs text-slate-500 text-center mt-2 font-mono">
              {stack.length}/8 ITEMS
            </div>
          </div>

          {/* Visual Stack - Dark stack */}
          <div className="flex flex-col items-center">
            <div 
              className="rounded-t-lg px-8 py-2 border-b-2 border-purple-500 text-purple-300 font-bold tracking-widest text-sm w-48 text-center z-10 relative"
              style={{ 
                background: 'rgba(124, 58, 237, 0.15)', 
                borderTop: '1px solid rgba(255,255,255,0.08)', 
                borderLeft: '1px solid rgba(255,255,255,0.08)', 
                borderRight: '1px solid rgba(255,255,255,0.08)' 
              }}
            >
              TOP
            </div>
            
            <div 
              className="w-48 h-[340px] border-x-2 border-b-2 border-white/10 rounded-b-lg p-2 flex flex-col-reverse justify-start gap-2 relative overflow-hidden"
              style={{ background: 'rgba(10, 14, 28, 0.8)' }}
            >
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-slate-600 font-medium tracking-widest"
                  >
                    EMPTY
                  </motion.div>
                ) : (
                  stack.map((item, index) => (
                    <motion.div
                      layout
                      key={`stack-item-${index}-${item}`}
                      initial={{ opacity: 0, y: -50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-purple-950/50 border border-purple-500/40 rounded-lg w-full h-10 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    >
                      <span className="font-mono font-bold text-lg text-purple-200">{item}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Addressing Modes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
          <Database className="text-violet-400" /> Addressing Modes
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addressingModes?.map((mode, index) => (
            <motion.div 
              key={mode.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="border rounded-xl p-6 group cursor-pointer transition-all duration-300 hover:border-violet-500/40 backdrop-blur-md"
              style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <h3 className="text-xl font-bold text-violet-400 mb-2 group-hover:text-violet-300 transition-colors">{mode.name}</h3>
              <p className="text-slate-400 mb-4 text-sm">{mode.description}</p>
              
              <div 
                className="rounded-lg p-4 font-mono text-sm border border-white/10"
                style={{ background: 'rgba(10, 14, 28, 0.6)' }}
              >
                <div className="grid grid-cols-3 gap-2 text-center mb-3 text-slate-500 text-xs tracking-wider">
                  <div>INSTRUCTION</div>
                  <div>ADDR/DATA</div>
                  <div>RESULT</div>
                </div>
                <div className="flex items-center justify-between text-center relative z-10">
                  <div className="bg-white/5 p-2 rounded-lg text-violet-300 flex-1 border border-white/10 font-bold">{mode.example?.instruction}</div>
                  <div className="mx-2 text-slate-500"><ArrowRight size={16} /></div>
                  <div className="bg-white/5 p-2 rounded-lg text-purple-300 flex-1 border border-white/10">{mode.example?.address || mode.example?.data || 'N/A'}</div>
                  <div className="mx-2 text-slate-500"><ArrowRight size={16} /></div>
                  <div className="bg-emerald-500/15 p-2 rounded-lg text-emerald-400 font-bold flex-1 border border-emerald-500/30">{mode.example?.result}</div>
                </div>
                
                {/* Diagram - visible on hover */}
                <div className="mt-4 overflow-hidden max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-400 mb-2 font-sans font-medium">Flow Diagram:</p>
                    <div className="text-amber-300 bg-amber-500/10 p-2 rounded-lg text-center border border-amber-500/20 text-xs">
                      {mode.diagram}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
