import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { Cpu, Server, CircuitBoard, Calculator, Database, Activity, GitCommit, HardDrive, Layers, Clock, ArrowDown, CheckCircle, RotateCcw, Play } from 'lucide-react';

const ProcessorPage = () => {
  const { state, dispatch } = useSimulation();
  
  const [processingStage, setProcessingStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  const stages = [
    'Data Received',
    'Register Loaded',
    'Operation Selected',
    'Processing',
    'Result Generated'
  ];

  const facts = [
    {
      title: 'Fetch-Decode-Execute Cycle',
      description: 'The fundamental operational process of a computer, where instructions are fetched from memory, decoded, and then executed.',
      icon: <Activity className="w-6 h-6 text-indigo-500" />
    },
    {
      title: 'Clock and Control Signals',
      description: 'The clock synchronizes all components, while control signals direct the flow of data through the datapath and ALU.',
      icon: <Clock className="w-6 h-6 text-emerald-500" />
    },
    {
      title: 'Instruction Format',
      description: 'Binary encoding that specifies the operation to be performed and the registers or memory locations involved.',
      icon: <GitCommit className="w-6 h-6 text-purple-500" />
    },
    {
      title: 'Datapath Organization',
      description: 'The interconnected components (ALU, registers, buses) that perform data processing operations.',
      icon: <Server className="w-6 h-6 text-blue-500" />
    }
  ];

  useEffect(() => {
    let timer;
    if (isProcessing && processingStage < stages.length) {
      timer = setTimeout(() => {
        const nextStage = processingStage + 1;
        
        dispatch({
          type: 'ADD_LOG',
          payload: { message: `Stage ${nextStage}: ${stages[nextStage - 1]}`, type: 'info' }
        });
        
        if (nextStage === 2) {
          dispatch({ type: 'SET_REGISTER', payload: { id: 'r1', value: '0x' + Math.floor(Math.random()*65535).toString(16).toUpperCase() } });
        }

        setProcessingStage(nextStage);
        
        if (nextStage >= stages.length) {
          setIsProcessing(false);
          setProcessingComplete(true);
          dispatch({ type: 'SET_STATUS', payload: 'Idle' });
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isProcessing, processingStage, stages, dispatch]);

  const startProcessing = () => {
    if (isProcessing) return;
    setProcessingStage(0);
    setProcessingComplete(false);
    setIsProcessing(true);
    dispatch({ type: 'SET_STATUS', payload: 'Processing' });
    dispatch({ type: 'ADD_LOG', payload: { message: 'Started processing simulation', type: 'system' } });
  };

  const resetProcessing = () => {
    setProcessingStage(0);
    setProcessingComplete(false);
    setIsProcessing(false);
    dispatch({ type: 'SET_STATUS', payload: 'Idle' });
    dispatch({ type: 'ADD_LOG', payload: { message: 'Simulation reset', type: 'system' } });
  };

  const getStageColor = (index) => {
    if (index < processingStage) return 'border-emerald-500 bg-emerald-50 text-emerald-700'; // Completed
    if (index === processingStage && isProcessing) return 'border-amber-500 bg-amber-50 text-amber-700 shadow-[0_0_15px_rgba(245,158,11,0.2)]'; // Processing
    return 'border-slate-200 bg-slate-50 text-slate-500'; // Upcoming
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Determine packet position based on stage
  let packetY = '0%';
  let packetX = '0%';
  let packetOpacity = isProcessing || processingComplete ? 1 : 0;
  
  if (processingStage === 0) {
    packetY = '10%'; // INPUT
  } else if (processingStage === 1) {
    packetY = '35%'; // REGISTERS
    packetX = '-15%';
  } else if (processingStage === 2) {
    packetY = '50%'; // PROCESSOR CORE
    packetX = '0%';
  } else if (processingStage === 3) {
    packetY = '65%'; // ALU
    packetX = '15%';
  } else if (processingStage >= 4) {
    packetY = '85%'; // RESULT
    packetX = '0%';
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-indigo-700 flex items-center gap-3">
            <Cpu className="w-10 h-10 text-indigo-500" />
            Processor Simulation
          </h1>
          <p className="text-slate-600 mt-2">Visualize the internal operations and datapath of a digital processor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Section 1: Processor Visualization */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col items-center relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800">
              <CircuitBoard className="w-5 h-5 text-indigo-500" />
              Processor Architecture
            </h2>
            
            {/* The Chip Container */}
            <div className="relative w-full flex-grow flex flex-col items-center justify-between border-2 border-slate-200 rounded-xl p-4 bg-slate-50">
              
              {/* Circuit traces decoration */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* INPUT */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg w-40 text-center z-10 shadow-sm">
                <Database className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <span className="text-sm font-medium text-blue-800">INPUT</span>
              </div>
              
              <div className="h-8 w-px bg-slate-300 connector-line z-0"></div>
              
              {/* Internal layout */}
              <div className="flex w-full justify-around items-center z-10 relative">
                {/* REGISTERS */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 w-28 text-center flex flex-col gap-2 shadow-sm">
                  <span className="text-xs font-medium mb-1 text-purple-800">REGISTERS</span>
                  <div className="register-box p-1 text-xs bg-white border border-slate-200 rounded text-slate-700">R1</div>
                  <div className="register-box p-1 text-xs bg-white border border-slate-200 rounded text-slate-700">R2</div>
                </div>
                
                {/* PROCESSOR CORE */}
                <div className={`p-4 w-32 h-32 rounded-full flex flex-col items-center justify-center text-center transition-all duration-500 shadow-sm ${isProcessing && processingStage === 2 ? 'bg-indigo-100 border-2 border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.2)] scale-110' : 'bg-white border-2 border-slate-200'}`}>
                  <Cpu className="w-8 h-8 text-indigo-500 mb-1" />
                  <span className="text-sm font-bold text-slate-800">CORE</span>
                </div>
                
                {/* ALU */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 w-28 text-center shadow-sm">
                  <Calculator className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-800">ALU</span>
                </div>
              </div>
              
              <div className="h-8 w-px bg-slate-300 connector-line z-0"></div>

              {/* RESULT */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 w-40 text-center z-10 shadow-sm">
                <HardDrive className="w-6 h-6 mx-auto mb-1 text-amber-500" />
                <span className="text-sm font-medium text-amber-800">RESULT</span>
              </div>
              
              {/* Animated Data Packet */}
              <motion.div 
                className="absolute w-6 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] z-20 flex items-center justify-center"
                animate={{ 
                  top: packetY,
                  left: `calc(50% - 12px + ${packetX})`,
                  opacity: packetOpacity
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </motion.div>
              
            </div>
          </div>
        </div>

        {/* Section 2: Processing States Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Execution Pipeline</h2>
              <div className="flex gap-3">
                <button onClick={resetProcessing} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors flex items-center gap-2">
                   Reset
                </button>
                <button 
                  onClick={startProcessing} 
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Activity className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Start Processing'}
                </button>
              </div>
            </div>

            {/* Stages Progress */}
            <div className="relative mb-12 mt-8">
              {/* Connecting line background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
              
              <div className="flex justify-between relative z-10">
                {stages.map((stage, idx) => (
                  <div key={idx} className="flex flex-col items-center w-24">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: idx === processingStage && isProcessing ? 1.2 : 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white ${getStageColor(idx)}`}
                    >
                      {idx + 1}
                    </motion.div>
                    <span className={`text-xs text-center mt-3 font-medium transition-colors ${idx === processingStage ? 'text-amber-600' : 'text-slate-500'}`}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Stage Display */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-center mb-6 min-h-[120px] flex flex-col justify-center items-center">
               <h3 className="text-slate-500 text-sm uppercase tracking-wider mb-2">Current Status</h3>
               <div className="text-2xl font-bold text-indigo-700">
                  {isProcessing ? stages[processingStage] : (processingComplete ? 'Operation Complete' : 'Awaiting Input')}
               </div>
               {isProcessing && (
                 <div className="w-full max-w-md h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, ease: "linear", repeat: isProcessing ? Infinity : 0 }}
                    />
                 </div>
               )}
            </div>

            {/* Event Console */}
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm h-48 overflow-y-auto border border-slate-800">
              <div className="text-slate-400 mb-2 border-b border-slate-800 pb-1">System Events Log</div>
              {state.logs && state.logs.length > 0 ? (
                <div className="space-y-1">
                  {state.logs.slice().reverse().map((log, i) => (
                    <div key={i} className={`${
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'system' ? 'text-blue-400' : 
                      log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      <span className="text-slate-500 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      {log.message}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-600 italic">No events recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Processor Facts */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-slate-800">
          <Server className="w-6 h-6 text-indigo-500" />
          Architecture Concepts
        </h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {facts.map((fact, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="bg-slate-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 border border-slate-100">
                {fact.icon}
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">{fact.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{fact.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
};

export default ProcessorPage;
