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
    <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
      <h1 className="text-3xl font-bold section-title gradient-text text-slate-900">Registers & Stack Simulator</h1>

      {/* SECTION 1: Register Simulator */}
      <section className="bg-white border-slate-200 shadow-sm border p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Cpu className="text-indigo-500" /> Register Simulator
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className={`status-badge px-3 py-1 rounded-full text-sm font-medium ${loadStatus === 'LOADED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'}`}>
              Status: {loadStatus}
            </span>
            <button onClick={handleLoadSampleData} className="btn-primary bg-[#4f46e5] text-white hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download size={16} /> Load Sample Data
            </button>
            <button onClick={handleResetRegisters} className="btn-secondary bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Visual Flow */}
        <div className="flex justify-center items-center mb-8 h-20 relative">
          <div className="bg-slate-50 border border-slate-200 px-6 py-3 flex items-center gap-2 z-10 rounded-lg shadow-sm">
            <Database className="text-purple-600" size={20} />
            <span className="font-semibold tracking-wider text-slate-700">MEMORY</span>
          </div>
          
          <div className="mx-2 flex-1 max-w-[250px] relative">
            <div className="w-full h-[2px] bg-slate-200 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full text-slate-400">
                 <ArrowRight size={18} />
              </div>
            </div>
            {loadStatus === 'REGISTER LOAD' && (
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-sm"
                initial={{ left: 0 }}
                animate={{ left: '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            )}
            <div className="text-center text-xs text-slate-500 mt-2 font-mono tracking-widest">BUS</div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 px-6 py-3 flex items-center gap-2 z-10 rounded-lg shadow-sm ml-4">
            <Cpu className="text-indigo-500" size={20} />
            <span className="font-semibold tracking-wider text-slate-700">REGISTER</span>
          </div>
        </div>

        {/* Registers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['R0', 'R1', 'R2', 'R3', 'PC', 'IR', 'SP'].map((reg) => (
            <div 
              key={reg} 
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${flashingRegs ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-sm text-slate-500 font-medium mb-1">{reg}</span>
              <span className="text-xl font-mono text-slate-900 font-bold">{registers[reg]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Stack Simulator */}
      <section className="bg-white border-slate-200 shadow-sm border p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Database className="text-purple-600" /> Stack Simulator
        </h2>
        <p className="text-slate-600 mb-6 flex items-center gap-2">
          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold tracking-wider border border-purple-200">LIFO</span> 
          Last In, First Out
        </p>

        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start justify-center">
          {/* Controls */}
          <div className="flex flex-col gap-4 w-full md:w-64 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-medium text-slate-800 mb-2 border-b border-slate-200 pb-2">Controls</h3>
            
            <div className="flex gap-2">
              <input 
                type="number" 
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                placeholder="Value..."
                className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              />
              <button 
                onClick={handlePush} 
                disabled={stack.length >= 8 || stackInput === ''}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-4 rounded text-white transition-colors"
                title="Push"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <div className="flex gap-2 mt-2">
              <button 
                onClick={handlePop} 
                disabled={stack.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 rounded transition-colors font-medium"
              >
                <Minus size={18} /> Pop
              </button>
              <button 
                onClick={handleClearStack} 
                disabled={stack.length === 0}
                className="border border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 rounded flex items-center justify-center px-4 transition-colors"
                title="Clear"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="text-xs text-slate-500 text-center mt-2 font-mono">
              {stack.length}/8 ITEMS
            </div>
          </div>

          {/* Visual Stack */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-100 rounded-t-lg px-8 py-2 border-b-2 border-purple-500 text-purple-700 font-bold tracking-widest text-sm w-48 text-center z-10 relative shadow-sm">
              TOP
            </div>
            
            <div className="w-48 h-[340px] bg-white border-x-2 border-b-2 border-slate-200 rounded-b-lg p-2 flex flex-col-reverse justify-start gap-2 relative overflow-hidden shadow-inner">
              <AnimatePresence mode="popLayout">
                {stack.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium tracking-widest"
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
                      className="bg-purple-100 border border-purple-300 rounded w-full h-10 flex items-center justify-center shrink-0 shadow-sm"
                    >
                      <span className="font-mono font-bold text-lg text-purple-900">{item}</span>
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
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Database className="text-indigo-500" /> Addressing Modes
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addressingModes?.map((mode, index) => (
            <motion.div 
              key={mode.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white border-slate-200 shadow-sm border rounded-xl p-6 group cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <h3 className="text-xl font-bold text-indigo-600 mb-2">{mode.name}</h3>
              <p className="text-slate-600 mb-4 text-sm">{mode.description}</p>
              
              <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm border border-slate-200">
                <div className="grid grid-cols-3 gap-2 text-center mb-3 text-slate-500 text-xs tracking-wider">
                  <div>INSTRUCTION</div>
                  <div>ADDR/DATA</div>
                  <div>RESULT</div>
                </div>
                <div className="flex items-center justify-between text-center relative z-10">
                  <div className="bg-white p-2 rounded text-indigo-700 flex-1 border border-slate-200 shadow-sm">{mode.example?.instruction}</div>
                  <div className="mx-2 text-slate-400"><ArrowRight size={16} /></div>
                  <div className="bg-white p-2 rounded text-purple-700 flex-1 border border-slate-200 shadow-sm">{mode.example?.address || mode.example?.data || 'N/A'}</div>
                  <div className="mx-2 text-slate-400"><ArrowRight size={16} /></div>
                  <div className="bg-green-50 p-2 rounded text-green-700 font-bold flex-1 border border-green-200 shadow-sm">{mode.example?.result}</div>
                </div>
                
                {/* Diagram - visible on hover */}
                <div className="mt-4 overflow-hidden max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-2 font-sans font-medium">Flow Diagram:</p>
                    <div className="text-yellow-800 bg-yellow-50 p-2 rounded text-center border border-yellow-200">
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
