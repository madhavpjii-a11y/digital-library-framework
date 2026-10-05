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
    <div className="w-full h-full flex flex-col p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl font-bold text-slate-900">System Simulations</h1>
        <p className="text-slate-600 mt-2">Interactive demonstrations of the Digital Library Processing Framework.</p>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 pb-2">
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
      className={`px-4 py-2 rounded-t-lg transition-colors font-medium text-sm focus:outline-none ${
        active 
          ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
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
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-grow flex flex-col p-6 items-center justify-start overflow-y-auto relative">
          
          <div className="w-full flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Pipeline Processing</h2>
            <div className="space-x-3">
              {!isRunning && pipelineStep === -1 ? (
                <button onClick={startPipeline} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm">
                  <Play size={18} className="mr-2" /> START PROCESSING
                </button>
              ) : (
                <button onClick={resetPipeline} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg flex items-center transition-colors">
                  <RotateCcw size={18} className="mr-2" /> Reset
                </button>
              )}
            </div>
          </div>

          {selectedBook && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center shadow-sm w-full max-w-md"
            >
              <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Processing Target</p>
              <h3 className="text-xl font-bold text-indigo-700 mt-1">{selectedBook.title}</h3>
            </motion.div>
          )}

          <div className="flex flex-col items-center w-full max-w-md relative pb-10">
            {pipelineStages && pipelineStages.map((stage, index) => {
              const Icon = IconMap[stage.icon] || Database;
              const isCurrent = pipelineStep === index;
              const isCompleted = pipelineStep > index;
              
              let nodeClass = "w-full p-4 mb-2 flex items-center bg-white border border-slate-200 rounded-xl relative z-10 transition-all duration-500 shadow-sm";
              if (isCurrent) nodeClass += " ring-2 ring-amber-400 border-amber-300 shadow-md bg-amber-50";
              if (isCompleted) nodeClass += " border-emerald-300 bg-emerald-50";
              
              return (
                <React.Fragment key={stage.id}>
                  <div className={nodeClass} style={{ borderLeftColor: stage.color, borderLeftWidth: '4px' }}>
                    <div className={`p-3 rounded-lg mr-4 ${isCurrent ? 'bg-amber-100 text-amber-600' : isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-grow">
                      <h4 className={`font-bold ${isCurrent ? 'text-amber-800' : isCompleted ? 'text-slate-800' : 'text-slate-600'}`}>{stage.label}</h4>
                      <p className="text-xs text-slate-500">{stage.description}</p>
                    </div>
                    
                    {isCompleted && (
                      <div className="text-emerald-500">
                        <CheckCircle size={20} />
                      </div>
                    )}
                  </div>
                  
                  {index < pipelineStages.length - 1 && (
                    <div className="h-10 w-0.5 bg-slate-200 relative z-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-300 absolute bottom-0"></div>
                      
                      {isCurrent && (
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-indigo-500 absolute shadow-[0_0_10px_rgba(99,102,241,0.5)]"
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
                className="mt-6 p-6 w-full max-w-md rounded-xl border border-emerald-300 bg-emerald-50 shadow-sm flex flex-col items-center"
              >
                <div className="bg-emerald-100 p-4 rounded-full mb-3 text-emerald-600">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Result Generated</h3>
                <p className="text-emerald-700 font-mono mt-2 text-xl bg-white px-6 py-2 rounded-lg border border-emerald-200 font-bold shadow-sm">
                  Available Books = 5
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
            <Activity size={18} className="mr-2 text-indigo-500" /> 
            System Status
          </h3>
          
          <div className="space-y-3">
            {Object.entries(systemStatus).map(([key, status]) => (
              <div key={key} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-mono text-xs font-semibold text-slate-500">{key}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  status === 'READY' || status === 'IDLE' ? 'bg-slate-200 text-slate-600' :
                  status === 'COMPLETE' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-indigo-100 text-indigo-700 animate-pulse'
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex-grow flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Event Console</h3>
          <div className="flex-grow bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto space-y-2 h-[250px]">
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
                  <span className="text-indigo-400 mr-3">[{log.time}]</span>
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
        <span className={`font-bold ${isAvailable ? 'text-emerald-600' : 'text-red-600'}`}>
          {isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
        </span>
      );
    }
    return <span className="font-bold text-indigo-600">{example.expectedResult}</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full"
    >
      <div className="flex flex-col gap-4 overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pre-configured Operations</h2>
        
        {processingExamples && processingExamples.map((example) => (
          <div key={example.id} className="bg-white border border-slate-200 shadow-sm p-5 rounded-xl hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-indigo-700 mb-2">{example.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{example.description}</p>
            
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 mb-1 font-medium">{example.operandALabel}</span>
                <span className="font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-800 font-bold shadow-sm">{example.operandA}</span>
              </div>
              
              <div className="bg-indigo-100 text-indigo-700 p-2 rounded-full font-bold shadow-sm border border-indigo-200">
                {example.operation === 'SUBTRACT' ? '-' : example.operation === 'COMPARE' ? '==' : '+'}
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 mb-1 font-medium">{example.operandBLabel}</span>
                <span className="font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-800 font-bold shadow-sm">{example.operandB}</span>
              </div>
            </div>
            
            <button 
              onClick={() => runExample(example)} 
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium w-full flex justify-center items-center py-2 rounded-lg transition-colors shadow-sm"
              disabled={activeExample?.id === example.id && step >= 0 && !showResult}
            >
              <Play size={16} className="mr-2" /> Run Example
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[500px]">
        {!activeExample ? (
          <div className="text-slate-400 flex flex-col items-center">
            <Calculator size={48} className="mb-4 opacity-50" />
            <p>Select an example to see its execution</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center relative">
            <h3 className="text-xl font-bold mb-8 text-center text-slate-800">{activeExample.title}</h3>
            
            <div className="flex w-full justify-between items-center relative max-w-lg mb-12">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
              
              {['Memory', 'Bus', 'Regs', 'CPU', 'ALU'].map((node, i) => (
                <div key={node} className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shadow-sm ${
                    step >= i ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {i === 0 ? <HardDrive size={18} /> : 
                     i === 1 ? <ArrowLeftRight size={18} /> :
                     i === 2 ? <Layers size={18} /> :
                     i === 3 ? <Cpu size={18} /> : <Calculator size={18} />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= i ? 'text-slate-700' : 'text-slate-500'}`}>{node}</span>
                  
                  {step === i && i < 4 && (
                    <motion.div 
                      className="absolute w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] top-1/2 -translate-y-1/2"
                      initial={{ left: 24 }}
                      animate={{ left: "calc(100% + 40px)" }} // Approx distance to next node
                      transition={{ duration: 0.8, ease: "linear" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 flex justify-around shadow-sm">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 font-semibold">OP1</span>
                  <span className={`font-mono mt-1 font-bold ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step >= 2 ? activeExample.operandA : '----'}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className={`text-xl font-bold ${step >= 4 ? 'text-indigo-600' : 'text-slate-300'}`}>
                    {activeExample.operation === 'SUBTRACT' ? '-' : activeExample.operation === 'COMPARE' ? '==' : '+'}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 font-semibold">OP2</span>
                  <span className={`font-mono mt-1 font-bold ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step >= 2 ? activeExample.operandB : '----'}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {showResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full bg-white border border-slate-200 rounded-xl p-6 text-center shadow-md"
                  >
                    <p className="text-sm text-slate-500 font-semibold mb-2">{activeExample.resultLabel}</p>
                    <div className="text-2xl font-mono p-3 bg-slate-50 rounded-lg border border-slate-200 inline-block min-w-[150px] shadow-inner">
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
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 p-4 flex justify-between items-center">
        <div className="flex space-x-3">
          <button 
            onClick={handleStart} 
            disabled={isRunning && !isPaused}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center px-4 py-2 rounded-lg transition-colors ${isRunning && !isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Play size={16} className="mr-2" /> {isRunning && isPaused ? 'Resume' : 'Start Stream'}
          </button>
          
          <button 
            onClick={handlePause}
            disabled={!isRunning || isPaused}
            className={`bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium flex items-center px-4 py-2 rounded-lg transition-colors ${!isRunning || isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Pause size={16} className="mr-2" /> Pause
          </button>
          
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-medium transition-colors flex items-center"
          >
            <Square size={16} className="mr-2" /> Reset
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-slate-600">
            Speed:
          </div>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-indigo-400"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            disabled={isRunning && !isPaused}
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
          
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 ml-4 font-mono text-sm text-indigo-700 font-bold shadow-sm">
            Packets Processed: {packetCount}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-grow p-8 relative flex flex-col justify-center overflow-hidden" ref={containerRef}>
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="flex justify-between items-center relative z-10 w-full max-w-5xl mx-auto">
          {/* Track Line */}
          <div className="absolute top-1/2 left-10 right-10 h-1.5 bg-slate-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
            <div className={`h-full w-full bg-indigo-200 ${isRunning && !isPaused ? 'animate-pulse' : ''}`}></div>
          </div>
          
          {/* Nodes */}
          {['SOURCE', 'MEMORY', 'BUS', 'REGISTER', 'PROCESSOR', 'ALU', 'RESULT'].map((label, idx) => {
            const isTarget = ['MEMORY', 'PROCESSOR', 'ALU'].includes(label);
            
            return (
              <div key={label} className="relative z-10 flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 shadow-sm ${
                  isTarget ? 'bg-white border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-slate-50 border border-slate-200'
                } ${isRunning && !isPaused ? 'group-hover:border-indigo-500 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]' : ''}`}>
                  {idx === 0 ? <Database size={24} className="text-slate-500" /> : 
                   idx === 1 ? <HardDrive size={24} className="text-indigo-600" /> :
                   idx === 2 ? <ArrowLeftRight size={24} className="text-slate-500" /> :
                   idx === 3 ? <Layers size={24} className="text-purple-500" /> :
                   idx === 4 ? <Cpu size={24} className="text-fuchsia-500" /> : 
                   idx === 5 ? <Calculator size={24} className="text-pink-500" /> :
                   <CheckCircle size={24} className="text-emerald-500" />}
                </div>
                <div className="text-xs font-bold tracking-wider text-slate-500">{label}</div>
              </div>
            );
          })}

          {/* Animated Packets */}
          {packets.map(id => (
            <motion.div
              key={id}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)] z-20"
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
