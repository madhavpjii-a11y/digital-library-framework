import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { Activity, ArrowDown, Cpu, Database } from 'lucide-react';

export default function BusPage() {
    const { state, dispatch } = useSimulation();

    // Local logs fallback just in case context logs are missing
    const [localLogs, setLocalLogs] = useState([]);

    const addLog = (message) => {
        dispatch({ type: 'ADD_LOG', payload: message });
        setLocalLogs(prev => [...prev, { time: new Date().toISOString().split('T')[1].slice(0,8), message }]);
    };

    // Section 1 State
    const [transferStep, setTransferStep] = useState(0); 
    const [isTransferring, setIsTransferring] = useState(false);

    const startTransfer = async () => {
        if (isTransferring) return;
        setIsTransferring(true);
        setTransferStep(1);
        addLog('Transfer INITIATING: MEMORY to REGISTERS');
        
        await new Promise(r => setTimeout(r, 1200));
        setTransferStep(2);
        addLog('ADDRESS SENT on Address Bus');

        await new Promise(r => setTimeout(r, 1200));
        setTransferStep(3);
        addLog('DATA TRANSFERRING on Data Bus');

        await new Promise(r => setTimeout(r, 1200));
        setTransferStep(4);
        addLog('CONTROL SIGNAL verified');

        await new Promise(r => setTimeout(r, 1200));
        setTransferStep(5);
        addLog('Transfer COMPLETE');

        setTimeout(() => {
            setTransferStep(0);
            setIsTransferring(false);
        }, 3000);
    };

    // Section 2 State
    const [arbitrationState, setArbitrationState] = useState('BUS AVAILABLE');
    const [requesters, setRequesters] = useState([
       { id: 'memory', name: 'Memory', icon: Database, state: 'IDLE' },
       { id: 'processor', name: 'Processor', icon: Cpu, state: 'IDLE' },
       { id: 'io', name: 'I/O Interface', icon: Database, state: 'IDLE' }
    ]);

    const handleRequest = (id) => {
        setRequesters(prev => prev.map(r => {
            if (r.id === id) {
                 if (arbitrationState === 'BUS AVAILABLE') {
                      setArbitrationState('BUS REQUEST');
                      dispatch({ type: 'SET_BUS_STATE', payload: 'BUS REQUEST' });
                      return { ...r, state: 'REQUESTING' };
                 } else {
                      return { ...r, state: 'WAITING' };
                 }
            }
            return r;
        }));
        addLog(`${id.toUpperCase()} requested the bus.`);
        dispatch({ type: 'REQUEST_BUS', payload: id });
    };

    const handleGrant = (id) => {
        setArbitrationState('BUS GRANTED');
        dispatch({ type: 'SET_BUS_STATE', payload: 'BUS GRANTED' });
        setRequesters(prev => prev.map(r => r.id === id ? { ...r, state: 'GRANTED' } : r));
        dispatch({ type: 'GRANT_BUS', payload: id });
        addLog(`Bus granted to ${id.toUpperCase()}.`);
        
        setTimeout(() => {
            setArbitrationState('DATA TRANSFER');
            dispatch({ type: 'SET_BUS_STATE', payload: 'DATA TRANSFER' });
            addLog(`Data transfer in progress for ${id.toUpperCase()}...`);
            
            setTimeout(() => {
                 setArbitrationState('BUS RELEASED'); 
                 addLog(`Transfer complete. Waiting for ${id.toUpperCase()} to release bus.`);
            }, 2000);
        }, 1500);
    };

    const handleRelease = (id) => {
        dispatch({ type: 'RELEASE_BUS' });
        addLog(`${id.toUpperCase()} released the bus.`);
        
        setRequesters(prev => {
            const next = [...prev];
            const released = next.find(r => r.id === id);
            if (released) released.state = 'IDLE';
            
            const waiting = next.find(r => r.state === 'WAITING');
            if (waiting) {
                waiting.state = 'REQUESTING';
                setArbitrationState('BUS REQUEST');
                dispatch({ type: 'SET_BUS_STATE', payload: 'BUS REQUEST' });
                addLog(`${waiting.name} is now requesting the bus.`);
            } else {
                setArbitrationState('BUS AVAILABLE');
                dispatch({ type: 'SET_BUS_STATE', payload: 'BUS AVAILABLE' });
            }
            return next;
        });
    };

    const logsToDisplay = state?.logs?.length ? state.logs : localLogs;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-6 max-w-7xl mx-auto text-slate-200"
        >
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <Activity className="w-8 h-8 text-violet-400" />
                <h1 className="text-3xl font-bold section-title text-white">Bus Architecture & Data Transfer</h1>
            </div>

            {/* Section 1: Bus & Data Transfer Visualization */}
            <section 
                className="p-6 rounded-xl border backdrop-blur-md"
                style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
                <h2 className="text-xl font-bold text-white mb-6">Data Transfer Visualization</h2>
                <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 mb-8 relative">
                    
                    {/* Source */}
                    <div 
                        className={`flex-1 p-6 flex flex-col items-center justify-center transition-all duration-500 rounded-xl border backdrop-blur-sm ${transferStep >= 1 && transferStep < 5 ? 'ring-2 ring-violet-400 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'border-white/10'}`}
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    >
                        <Database className="w-12 h-12 text-violet-400 mb-4" />
                        <h3 className="font-bold text-lg text-white">MEMORY</h3>
                        <p className="text-sm text-slate-400 text-center mt-2">Source Component</p>
                    </div>

                    {/* Bus Lanes */}
                    <div className="flex-[2] flex flex-col gap-4 justify-center">
                        <BusLane 
                            name="Address Bus" 
                            desc="Carries address information"
                            borderColor="border-purple-500"
                            dotColor="bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.8)]"
                            isActiveStep={transferStep === 2}
                        />
                        <BusLane 
                            name="Data Bus" 
                            desc="Carries data"
                            borderColor="border-violet-500"
                            dotColor="bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]"
                            isActiveStep={transferStep === 3}
                        />
                        <BusLane 
                            name="Control Bus" 
                            desc="Carries control signals"
                            borderColor="border-amber-500"
                            dotColor="bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                            isActiveStep={transferStep === 4}
                        />
                    </div>

                    {/* Destination */}
                    <div 
                        className={`flex-1 p-6 flex flex-col items-center justify-center transition-all duration-500 rounded-xl border backdrop-blur-sm ${transferStep === 5 ? 'ring-2 ring-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/10'}`}
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    >
                        <Cpu className="w-12 h-12 text-emerald-400 mb-4" />
                        <h3 className="font-bold text-lg text-white">REGISTERS</h3>
                        <p className="text-sm text-slate-400 text-center mt-2">Destination Component</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <button 
                        onClick={startTransfer}
                        disabled={isTransferring}
                        className="btn-primary whitespace-nowrap bg-violet-600 text-white hover:bg-violet-700 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-600/30 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isTransferring ? 'Transfer in Progress...' : 'Start Transfer'}
                    </button>
                    
                    <div className="flex flex-wrap gap-2 justify-end">
                        {['INITIATING', 'ADDRESS SENT', 'DATA TRANSFERRING', 'CONTROL SIGNAL', 'COMPLETE'].map((status, idx) => (
                            <span 
                                key={status} 
                                className={`status-badge px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                    transferStep === idx + 1 
                                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-[0_0_8px_rgba(139,92,246,0.25)]' 
                                        : 'bg-white/5 text-slate-500 border-white/5'
                                }`}
                            >
                                {status}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: Bus Arbitration */}
            <section 
                className="p-6 rounded-xl border backdrop-blur-md"
                style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
                <h2 className="text-xl font-bold text-white mb-6">Bus Arbitration</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Requesters */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="font-semibold text-slate-400 mb-4">System Components</h3>
                        {requesters.map((req, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={req.id} 
                                className={`p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                                    req.state === 'REQUESTING' ? 'border-amber-400/60 ring-1 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]' :
                                    req.state === 'GRANTED' ? 'border-emerald-400/60 ring-1 ring-emerald-400/40 shadow-[0_0_15px_rgba(52,211,153,0.15)]' :
                                    req.state === 'WAITING' ? 'border-rose-400/40 opacity-80' :
                                    arbitrationState !== 'BUS AVAILABLE' && req.state === 'IDLE' ? 'border-white/5 opacity-50' : 'border-white/10'
                                }`}
                                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <req.icon className="w-6 h-6 text-slate-400" />
                                        <span className="font-bold text-white">{req.name}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                        req.state === 'REQUESTING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        req.state === 'GRANTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        req.state === 'WAITING' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        'bg-white/5 text-slate-400 border-white/5'
                                    }`}>
                                        {req.state}
                                    </span>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    {req.state === 'IDLE' && (
                                        <button 
                                            onClick={() => handleRequest(req.id)} 
                                            className="btn-small bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            Request Bus
                                        </button>
                                    )}
                                    {req.state === 'REQUESTING' && (
                                        <button 
                                            onClick={() => handleGrant(req.id)} 
                                            className="btn-small bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            Grant Bus
                                        </button>
                                    )}
                                    {req.state === 'GRANTED' && arbitrationState === 'BUS RELEASED' && (
                                        <button 
                                            onClick={() => handleRelease(req.id)} 
                                            className="btn-small bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            Release Bus
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Central Bus Display */}
                    <div className="lg:col-span-2 flex items-center justify-center">
                        <div 
                            className="border rounded-xl p-8 w-full max-w-md flex flex-col items-center backdrop-blur-md shadow-xl"
                            style={{ background: 'rgba(10, 14, 28, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                        >
                            <h3 className="font-bold text-lg mb-8 text-slate-300">Central Bus State</h3>
                            
                            <div className="flex flex-col items-center space-y-4 relative w-full">
                                {['BUS AVAILABLE', 'BUS REQUEST', 'BUS GRANTED', 'DATA TRANSFER', 'BUS RELEASED'].map((stateName, idx, arr) => (
                                    <React.Fragment key={stateName}>
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0.8 }}
                                            animate={{ 
                                                scale: arbitrationState === stateName ? 1.05 : 1,
                                                opacity: arbitrationState === stateName ? 1 : 0.6
                                            }}
                                            className={`w-full py-3 px-6 rounded-lg text-center font-bold border transition-colors duration-300 ${
                                                arbitrationState === stateName 
                                                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                                                    : 'bg-white/[0.02] border-white/10 text-slate-500'
                                            }`}
                                        >
                                            {stateName}
                                        </motion.div>
                                        {idx < arr.length - 1 && (
                                            <div className="text-slate-600 my-1">
                                                <ArrowDown className={`w-6 h-6 ${arbitrationState === arr[idx+1] ? 'text-violet-400' : ''}`} />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Console - KEPT DARK */}
            <section 
                className="p-4 rounded-xl border backdrop-blur-md"
                style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
                <h3 className="font-semibold text-slate-300 mb-2">Event Console</h3>
                <div className="event-console h-48 overflow-y-auto bg-slate-950/90 text-slate-300 p-4 rounded-lg font-mono text-sm border border-white/10">
                    {logsToDisplay.length > 0 ? logsToDisplay.map((log, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={idx} 
                            className="text-emerald-400 mb-1 flex"
                        >
                            <span className="text-slate-500 mr-3 shrink-0">[{log.time || new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                            <span>{log.message || log}</span>
                        </motion.div>
                    )) : (
                        <div className="text-slate-500 italic">Logs will appear here...</div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}

const BusLane = ({ name, desc, borderColor, dotColor, isActiveStep }) => {
    return (
        <div 
            className={`border-x border-b border-white/10 p-4 relative overflow-hidden border-t-2 ${borderColor} rounded-xl h-20 flex flex-col justify-center backdrop-blur-md shadow-sm`}
            style={{ background: 'rgba(10, 14, 28, 0.7)' }}
        >
             <h4 className="text-white font-semibold z-10">{name}</h4>
             <p className="text-xs text-slate-400 z-10">{desc}</p>
             
             <div className="absolute inset-0 flex items-center px-4">
                 <div className="w-full h-0.5 bg-white/10" />
             </div>

             {isActiveStep && (
                 <motion.div
                     initial={{ left: '0%' }}
                     animate={{ left: '100%' }}
                     transition={{ duration: 1.2, ease: "linear" }}
                     className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${dotColor} z-20`}
                 />
             )}
        </div>
    );
};
