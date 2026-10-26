import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  HardDrive, 
  ArrowLeftRight, 
  Layers, 
  Cpu, 
  Calculator, 
  CheckCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Square,
  Activity,
  ChevronRight
} from 'lucide-react';
import { pipelineStages, processingExamples, books } from '../data/sampleData';
import { useSimulation } from '../context/SimulationContext';

const IconMap = {
  Database,
  HardDrive,
  ArrowLeftRight,
  Layers,
  Cpu,
  Calculator,
  CheckCircle
};

export default function SimulationsPage() {
  const [activeTab, setActiveTab] = useState('complete');
  const { state, dispatch } = useSimulation() || { state: {}, dispatch: () => {} };
  
  return (
    <div className="w-full h-full flex flex-col p-6 space-y-6 text-white min-h-screen">
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl font-bold text-white">System Simulations</h1>
        <p className="text-slate-400 mt-2">Interactive demonstrations of the Digital Library Processing Framework.</p>
      </div>

      <div className="flex space-x-2 border-b border-white/10 pb-2">
        <TabButton active={activeTab === 'complete'} onClick={() => setActiveTab('complete')}>
          Complete Pipeline
        </TabButton>
        <TabButton active={activeTab === 'examples'} onClick={() => setActiveTab('examples')}>
          Processing Examples
        </TabButton>
        <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')}>
          Data Flow Visualizer
        </TabButton>
      </div>

      <div className="flex-grow overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'complete' && <CompletePipelineTab key="complete" dispatch={dispatch} />}
          {activeTab === 'examples' && <ProcessingExamplesTab key="examples" dispatch={dispatch} />}
          {activeTab === 'visualizer' && <DataFlowVisualizerTab key="visualizer" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-xl transition-all font-medium text-sm focus:outline-none ${
        active 
          ? 'bg-violet-500/15 text-violet-300 border-b-2 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

function CompletePipelineTab({ dispatch }) {
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [eventLog, setEventLog] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const { state } = useSimulation() || { state: {} };
  const systemStatus = state?.systemStatus || {
    SYSTEM: 'READY',
    MEMORY: 'READY',
    BUS: 'IDLE',
    REGISTERS: 'READY',
    PROCESSOR: 'READY',
    ALU: 'READY'
  };

  const addLog = (msg) => {
    const log = { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), msg };
    setEventLog(prev => [...prev, log]);
    if (dispatch) dispatch({ type: 'ADD_LOG', payload: log });
  };

  const startPipeline = () => {
    if (isRunning) return;
    
    setEventLog([]);
    if (dispatch) dispatch({ type: 'CLEAR_LOG' });
    setPipelineStep(-1);
    setIsRunning(true);
    if (dispatch) dispatch({ type: 'SET_PIPELINE_RUNNING', payload: true });
    
    const book = books && books.length > 0 ? books[0] : { title: 'Data Structures & Algorithms' };
    setSelectedBook(book);
    
    const updateStatus = (key, value) => {
      if (dispatch) dispatch({ type: 'SET_STATUS', payload: { key, value } });
    };

    updateStatus('SYSTEM', 'RUNNING');
    
    let currentStep = 0;
    
    const runStep = () => {
      setPipelineStep(currentStep);
      if (dispatch) dispatch({ type: 'SET_PIPELINE_STEP', payload: currentStep });
      
      if (currentStep === 0) {
        addLog(`Library record selected: ${book.title}`);
      } else if (currentStep === 1) {
        addLog('Record loaded into memory at address 0x0001');
        updateStatus('MEMORY', 'ACTIVE');
      } else if (currentStep === 2) {
        addLog('Memory access performed - data retrieved');
        updateStatus('MEMORY', 'READY');
        updateStatus('BUS', 'TRANSFERRING');
      } else if (currentStep === 3) {
        addLog('Data transferred through system bus');
        updateStatus('BUS', 'IDLE');
        updateStatus('REGISTERS', 'LOADING');
      } else if (currentStep === 4) {
        addLog('Registers loaded: R0=20, R1=15');
        updateStatus('REGISTERS', 'READY');
        updateStatus('PROCESSOR', 'PROCESSING');
      } else if (currentStep === 5) {
        addLog('Processor received data - executing instruction');
        updateStatus('PROCESSOR', 'READY');
        updateStatus('ALU', 'ACTIVE');
      } else if (currentStep === 6) {
        addLog('ALU performing subtraction: 20 - 15');
      } else if (currentStep === 7) {
        addLog('Result generated: Available Books = 5');
        updateStatus('ALU', 'READY');
        updateStatus('SYSTEM', 'COMPLETE');
      }
      
      currentStep++;
      if (currentStep <= 7) {
        setTimeout(runStep, 1500);
      } else {
        setTimeout(() => {
          setIsRunning(false);
          if (dispatch) dispatch({ type: 'SET_PIPELINE_RUNNING', payload: false });
        }, 1000);
      }
    };
    
    runStep();
  };

  const resetPipeline = () => {
    setIsRunning(false);
    if (dispatch) dispatch({ type: 'SET_PIPELINE_RUNNING', payload: false });
    setPipelineStep(-1);
    if (dispatch) dispatch({ type: 'SET_PIPELINE_STEP', payload: -1 });
    setEventLog([]);
    if (dispatch) dispatch({ type: 'CLEAR_LOG' });
    setSelectedBook(null);
    if (dispatch) {
      dispatch({ type: 'SET_STATUS', payload: { key: 'SYSTEM', value: 'READY' } });
      dispatch({ type: 'SET_STATUS', payload: { key: 'MEMORY', value: 'READY' } });
      dispatch({ type: 'SET_STATUS', payload: { key: 'BUS', value: 'IDLE' } });
      dispatch({ type: 'SET_STATUS', payload: { key: 'REGISTERS', value: 'READY' } });
      dispatch({ type: 'SET_STATUS', payload: { key: 'PROCESSOR', value: 'READY' } });
      dispatch({ type: 'SET_STATUS', payload: { key: 'ALU', value: 'READY' } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"
    >
      <div className="lg:col-span-2 flex flex-col">
        <div 
          className="border border-white/10 rounded-2xl flex-grow flex flex-col p-6 items-center justify-start overflow-y-auto relative backdrop-blur-md"
          style={{ background: 'rgba(15,18,35,0.8)' }}
        >
          
          <div className="w-full flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Pipeline Processing</h2>
            <div className="space-x-3">
              {!isRunning && pipelineStep === -1 ? (
                <button 
                  onClick={startPipeline} 
                  className="btn-primary py-2 px-5 rounded-xl font-medium flex items-center transition-all"
                >
                  <Play size={18} className="mr-2" /> START PROCESSING
                </button>
              ) : (
                <button 
                  onClick={resetPipeline} 
                  className="bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-medium py-2 px-4 rounded-xl flex items-center transition-colors"
                >
                  <RotateCcw size={18} className="mr-2" /> Reset
                </button>
              )}
            </div>
          </div>

          {selectedBook && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 text-center w-full max-w-md backdrop-blur-sm"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Processing Target</p>
              <h3 className="text-xl font-bold text-violet-300 mt-1">{selectedBook.title}</h3>
            </motion.div>
          )}

          <div className="flex flex-col items-center w-full max-w-md relative pb-10">
            {pipelineStages && pipelineStages.map((stage, index) => {
              const Icon = IconMap[stage.icon] || Database;
              const isCurrent = pipelineStep === index;
              const isCompleted = pipelineStep > index;
              
              let nodeBgClass = "bg-[rgba(15,18,35,0.7)] border-white/10";
              let iconBgClass = "bg-white/5 text-slate-400";
              let titleClass = "text-slate-300";

              if (isCurrent) {
                nodeBgClass = "bg-amber-500/15 border-amber-400/50 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]";
                iconBgClass = "bg-amber-500/20 text-amber-300";
                titleClass = "text-amber-300 font-bold";
              } else if (isCompleted) {
                nodeBgClass = "bg-emerald-500/10 border-emerald-500/30";
                iconBgClass = "bg-emerald-500/20 text-emerald-300";
                titleClass = "text-white font-bold";
              }
              
              return (
                <React.Fragment key={stage.id}>
                  <div 
                    className={`w-full p-4 mb-2 flex items-center border rounded-xl relative z-10 transition-all duration-500 backdrop-blur-sm ${nodeBgClass}`}
                    style={{ borderLeftColor: stage.color, borderLeftWidth: '4px' }}
                  >
                    <div className={`p-3 rounded-xl mr-4 border border-white/5 ${iconBgClass}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-grow">
                      <h4 className={titleClass}>{stage.label}</h4>
                      <p className="text-xs text-slate-400">{stage.description}</p>
                    </div>
                    
                    {isCompleted && (
                      <div className="text-emerald-400">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>
                  
                  {index < pipelineStages.length - 1 && (
                    <div className="h-10 w-0.5 bg-white/10 relative z-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white/20 absolute bottom-0"></div>
                      
                      {isCurrent && (
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-violet-400 absolute shadow-[0_0_12px_rgba(167,139,250,0.9)]"
                          initial={{ top: -10 }}
                          animate={{ top: 40 }}
                          transition={{ duration: 1.5, ease: "linear" }}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <AnimatePresence>
            {pipelineStep >= 7 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-6 p-6 w-full max-w-md rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md flex flex-col items-center shadow-[0_0_25px_rgba(16,185,129,0.15)]"
              >
                <div className="bg-emerald-500/20 p-4 rounded-full mb-3 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Result Generated</h3>
                <p className="text-emerald-300 font-mono mt-3 text-xl bg-black/40 px-6 py-2.5 rounded-xl border border-emerald-500/30 font-bold">
                  Available Books = 5
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div 
          className="border border-white/10 rounded-2xl p-6 backdrop-blur-md"
          style={{ background: 'rgba(15,18,35,0.8)' }}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center text-white">
            <Activity size={18} className="mr-2 text-violet-400" /> 
            System Status
          </h3>
          
          <div className="space-y-3">
            {Object.entries(systemStatus).map(([key, status]) => (
              <div key={key} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="font-mono text-xs font-semibold text-slate-300">{key}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  status === 'READY' || status === 'IDLE' ? 'bg-white/10 text-slate-300 border-white/10' :
                  status === 'COMPLETE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  'bg-violet-500/20 text-violet-300 border-violet-500/30 animate-pulse'
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="border border-white/10 rounded-2xl p-6 flex-grow flex flex-col backdrop-blur-md"
          style={{ background: 'rgba(15,18,35,0.8)' }}
        >
          <h3 className="text-lg font-bold mb-4 text-white">Event Console</h3>
          <div className="flex-grow bg-[#0b0d17] rounded-xl border border-white/10 p-4 font-mono text-xs overflow-y-auto space-y-2 h-[250px]">
            {eventLog.length === 0 ? (
              <div className="text-slate-500 italic">Waiting for events...</div>
            ) : (
              eventLog.map((log) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={log.id}
                  className="flex"
                >
                  <span className="text-violet-400 mr-3">[{log.time}]</span>
                  <span className="text-slate-300">{log.msg}</span>
                </motion.div>
              ))
            )}
            <div className="h-2"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProcessingExamplesTab({ dispatch }) {
  const [activeExample, setActiveExample] = useState(null);
  const [step, setStep] = useState(-1);
  const [showResult, setShowResult] = useState(false);

  const runExample = (example) => {
    setActiveExample(example);
    setStep(0);
    setShowResult(false);
    
    let currentStep = 0;
    const stages = 5; // memory -> bus -> registers -> processor -> alu
    
    const interval = setInterval(() => {
      currentStep++;
      setStep(currentStep);
      
      if (currentStep >= stages) {
        clearInterval(interval);
        setTimeout(() => setShowResult(true), 500);
      }
    }, 800);
  };

  const getResultDisplay = (example) => {
    if (example.id === 'ex3') {
      const isAvailable = parseInt(example.expectedResult) > 0;
      return (
        <span className={`font-bold ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
          {isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
        </span>
      );
    }
    return <span className="font-bold text-violet-300">{example.expectedResult}</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full"
    >
      <div className="flex flex-col gap-4 overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold text-white mb-2">Pre-configured Operations</h2>
        
        {processingExamples && processingExamples.map((example) => (
          <div 
            key={example.id} 
            className="border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:border-violet-500/30 transition-all"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <h3 className="text-lg font-bold text-violet-300 mb-2">{example.title}</h3>
            <p className="text-sm text-slate-400 mb-4">{example.description}</p>
            
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 mb-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-1 font-medium">{example.operandALabel}</span>
                <span className="font-mono bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg text-white font-bold">{example.operandA}</span>
              </div>
              
              <div className="bg-violet-500/20 text-violet-300 p-2 rounded-full font-bold border border-violet-500/30">
                {example.operation === 'SUBTRACT' ? '-' : example.operation === 'COMPARE' ? '==' : '+'}
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-1 font-medium">{example.operandBLabel}</span>
                <span className="font-mono bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg text-white font-bold">{example.operandB}</span>
              </div>
            </div>
            
            <button 
              onClick={() => runExample(example)} 
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium w-full flex justify-center items-center py-2.5 rounded-xl transition-colors"
              disabled={activeExample?.id === example.id && step >= 0 && !showResult}
            >
              <Play size={16} className="mr-2 text-violet-400" /> Run Example
            </button>
          </div>
        ))}
      </div>

      <div 
        className="border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px] backdrop-blur-md"
        style={{ background: 'rgba(15,18,35,0.8)' }}
      >
        {!activeExample ? (
          <div className="text-slate-500 flex flex-col items-center">
            <Calculator size={48} className="mb-4 opacity-40 text-violet-400" />
            <p>Select an example to see its execution</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center relative">
            <h3 className="text-xl font-bold mb-8 text-center text-white">{activeExample.title}</h3>
            
            <div className="flex w-full justify-between items-center relative max-w-lg mb-12">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>
              
              {['Memory', 'Bus', 'Regs', 'CPU', 'ALU'].map((node, i) => (
                <div key={node} className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    step >= i ? 'bg-violet-500/20 border-violet-400 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/10 text-slate-500'
                  }`}>
                    {i === 0 ? <HardDrive size={18} /> : 
                     i === 1 ? <ArrowLeftRight size={18} /> :
                     i === 2 ? <Layers size={18} /> :
                     i === 3 ? <Cpu size={18} /> : <Calculator size={18} />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= i ? 'text-slate-200' : 'text-slate-500'}`}>{node}</span>
                  
                  {step === i && i < 4 && (
                    <motion.div 
                      className="absolute w-4 h-4 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)] top-1/2 -translate-y-1/2"
                      initial={{ left: 24 }}
                      animate={{ left: "calc(100% + 40px)" }}
                      transition={{ duration: 0.8, ease: "linear" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="w-full bg-white/5 rounded-xl p-4 border border-white/10 mb-6 flex justify-around">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-semibold">OP1</span>
                  <span className={`font-mono mt-1 font-bold ${step >= 2 ? 'text-violet-300' : 'text-slate-500'}`}>
                    {step >= 2 ? activeExample.operandA : '----'}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className={`text-xl font-bold ${step >= 4 ? 'text-violet-300' : 'text-slate-500'}`}>
                    {activeExample.operation === 'SUBTRACT' ? '-' : activeExample.operation === 'COMPARE' ? '==' : '+'}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-semibold">OP2</span>
                  <span className={`font-mono mt-1 font-bold ${step >= 2 ? 'text-violet-300' : 'text-slate-500'}`}>
                    {step >= 2 ? activeExample.operandB : '----'}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {showResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md"
                  >
                    <p className="text-sm text-slate-400 font-semibold mb-2">{activeExample.resultLabel}</p>
                    <div className="text-2xl font-mono p-3 bg-black/40 rounded-xl border border-white/10 inline-block min-w-[150px]">
                      {getResultDisplay(activeExample)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DataFlowVisualizerTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState('medium');
  const [packets, setPackets] = useState([]);
  const [packetCount, setPacketCount] = useState(0);
  
  const containerRef = useRef(null);
  
  const speedConfig = {
    slow: { rate: 2000, duration: 8 },
    medium: { rate: 1000, duration: 5 },
    fast: { rate: 400, duration: 2.5 }
  };

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        const id = Date.now() + Math.random();
        setPackets(prev => [...prev, id]);
        setPacketCount(c => c + 1);
        
        // Cleanup old packets
        setTimeout(() => {
          setPackets(prev => prev.filter(pId => pId !== id));
        }, speedConfig[speed].duration * 1000 + 500);
      }, speedConfig[speed].rate);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isPaused, speed]);

  const handleStart = () => {
    if (!isRunning) setIsRunning(true);
    setIsPaused(false);
  };
  
  const handlePause = () => setIsPaused(true);
  
  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setPackets([]);
    setPacketCount(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <div 
        className="border border-white/10 rounded-2xl mb-6 p-4 flex flex-wrap justify-between items-center gap-4 backdrop-blur-md"
        style={{ background: 'rgba(15,18,35,0.8)' }}
      >
        <div className="flex space-x-3">
          <button 
            onClick={handleStart} 
            disabled={isRunning && !isPaused}
            className={`btn-primary font-medium flex items-center px-4 py-2 rounded-xl transition-all ${isRunning && !isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Play size={16} className="mr-2" /> {isRunning && isPaused ? 'Resume' : 'Start Stream'}
          </button>
          
          <button 
            onClick={handlePause}
            disabled={!isRunning || isPaused}
            className={`bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium flex items-center px-4 py-2 rounded-xl transition-colors ${!isRunning || isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Pause size={16} className="mr-2" /> Pause
          </button>
          
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl font-medium transition-colors flex items-center"
          >
            <Square size={16} className="mr-2" /> Reset
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-slate-400">
            Speed:
          </div>
          <select 
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-violet-400"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            disabled={isRunning && !isPaused}
          >
            <option value="slow" className="bg-[#0f1223]">Slow</option>
            <option value="medium" className="bg-[#0f1223]">Medium</option>
            <option value="fast" className="bg-[#0f1223]">Fast</option>
          </select>
          
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 ml-4 font-mono text-sm text-violet-300 font-bold">
            Packets Processed: {packetCount}
          </div>
        </div>
      </div>

      <div 
        className="border border-white/10 rounded-2xl flex-grow p-8 relative flex flex-col justify-center overflow-hidden backdrop-blur-md min-h-[420px]" 
        style={{ background: 'rgba(15,18,35,0.8)' }}
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="flex justify-between items-center relative z-10 w-full max-w-5xl mx-auto">
          {/* Track Line */}
          <div className="absolute top-1/2 left-10 right-10 h-1.5 bg-white/10 -translate-y-1/2 z-0 rounded-full overflow-hidden">
            <div className={`h-full w-full bg-violet-500/20 ${isRunning && !isPaused ? 'animate-pulse' : ''}`}></div>
          </div>
          
          {/* Nodes */}
          {['SOURCE', 'MEMORY', 'BUS', 'REGISTER', 'PROCESSOR', 'ALU', 'RESULT'].map((label, idx) => {
            const isTarget = ['MEMORY', 'PROCESSOR', 'ALU'].includes(label);
            
            return (
              <div key={label} className="relative z-10 flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 backdrop-blur-sm ${
                  isTarget ? 'bg-[rgba(20,24,50,0.9)] border-2 border-violet-400/60 shadow-[0_0_20px_rgba(139,92,246,0.25)]' : 'bg-[rgba(15,18,35,0.7)] border border-white/10'
                } ${isRunning && !isPaused ? 'group-hover:border-violet-400 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]' : ''}`}>
                  {idx === 0 ? <Database size={24} className="text-slate-400" /> : 
                   idx === 1 ? <HardDrive size={24} className="text-indigo-400" /> :
                   idx === 2 ? <ArrowLeftRight size={24} className="text-slate-400" /> :
                   idx === 3 ? <Layers size={24} className="text-purple-400" /> :
                   idx === 4 ? <Cpu size={24} className="text-fuchsia-400" /> : 
                   idx === 5 ? <Calculator size={24} className="text-pink-400" /> :
                   <CheckCircle size={24} className="text-emerald-400" />}
                </div>
                <div className="text-[11px] font-bold tracking-wider text-slate-400">{label}</div>
              </div>
            );
          })}

          {/* Animated Packets with violet glow */}
          {packets.map(id => (
            <motion.div
              key={id}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.9),0_0_5px_#fff] z-20"
              initial={{ left: "2%" }}
              animate={{ left: "98%" }}
              transition={{ 
                duration: speedConfig[speed].duration, 
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
