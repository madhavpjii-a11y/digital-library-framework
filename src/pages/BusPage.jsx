import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { Activity, ArrowDown, Cpu, HardDrive, Database } from 'lucide-react';

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
       { id: 'io', name: 'I/O Interface', icon: HardDrive, state: 'IDLE' }
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
            className="space-y-8 p-6 max-w-7xl mx-auto text-slate-900"
        >
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <Activity className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold section-title text-slate-900">Bus Architecture & Data Transfer</h1>
            </div>

            {/* Section 1: Bus & Data Transfer Visualization */}
            <section className="bg-white border-slate-200 shadow-sm border p-6 rounded-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Data Transfer Visualization</h2>
                <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 mb-8 relative">
                    
                    {/* Source */}
                    <div className={`flex-1 bg-white border border-slate-200 p-6 flex flex-col items-center justify-center transition-all duration-500 rounded-xl ${transferStep >= 1 && transferStep < 5 ? 'ring-2 ring-indigo-400 shadow-md' : 'shadow-sm'}`}>
                        <Database className="w-12 h-12 text-indigo-500 mb-4" />
                        <h3 className="font-bold text-lg text-slate-900">MEMORY</h3>
                        <p className="text-sm text-slate-500 text-center mt-2">Source Component</p>
                    </div>

                    {/* Bus Lanes */}
                    <div className="flex-[2] flex flex-col gap-4 justify-center">
                        <BusLane 
                            name="Address Bus" 
                            desc="Carries address information"
                            borderColor="border-purple-500"
                            dotColor="bg-purple-500 shadow-sm"
                            isActiveStep={transferStep === 2}
                        />
                        <BusLane 
                            name="Data Bus" 
                            desc="Carries data"
                            borderColor="border-indigo-500"
                            dotColor="bg-indigo-500 shadow-sm"
                            isActiveStep={transferStep === 3}
                        />
                        <BusLane 
                            name="Control Bus" 
                            desc="Carries control signals"
                            borderColor="border-amber-500"
                            dotColor="bg-amber-500 shadow-sm"
                            isActiveStep={transferStep === 4}
                        />
                    </div>

                    {/* Destination */}
                    <div className={`flex-1 bg-white border border-slate-200 p-6 flex flex-col items-center justify-center transition-all duration-500 rounded-xl ${transferStep === 5 ? 'ring-2 ring-green-400 shadow-md' : 'shadow-sm'}`}>
                        <Cpu className="w-12 h-12 text-green-500 mb-4" />
                        <h3 className="font-bold text-lg text-slate-900">REGISTERS</h3>
                        <p className="text-sm text-slate-500 text-center mt-2">Destination Component</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <button 
                        onClick={startTransfer}
                        disabled={isTransferring}
                        className="btn-primary whitespace-nowrap bg-[#4f46e5] text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        {isTransferring ? 'Transfer in Progress...' : 'Start Transfer'}
                    </button>
                    
                    <div className="flex flex-wrap gap-2 justify-end">
                        {['INITIATING', 'ADDRESS SENT', 'DATA TRANSFERRING', 'CONTROL SIGNAL', 'COMPLETE'].map((status, idx) => (
                            <span key={status} className={`status-badge px-2 py-1 rounded text-xs font-semibold ${transferStep === idx + 1 ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500 border border-transparent'}`}>
                                {status}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: Bus Arbitration */}
            <section className="bg-white border-slate-200 shadow-sm border p-6 rounded-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Bus Arbitration</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Requesters */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="font-semibold text-slate-600 mb-4">System Components</h3>
                        {requesters.map((req, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={req.id} 
                                className={`bg-white border p-4 rounded-xl shadow-sm transition-all duration-300 ${
                                    req.state === 'REQUESTING' ? 'border-amber-400 ring-1 ring-amber-400' :
                                    req.state === 'GRANTED' ? 'border-green-400 ring-1 ring-green-400' :
                                    req.state === 'WAITING' ? 'border-red-300 opacity-80' :
                                    arbitrationState !== 'BUS AVAILABLE' && req.state === 'IDLE' ? 'border-slate-200 opacity-50' : 'border-slate-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <req.icon className="w-6 h-6 text-slate-500" />
                                        <span className="font-bold text-slate-900">{req.name}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        req.state === 'REQUESTING' ? 'bg-amber-100 text-amber-700' :
                                        req.state === 'GRANTED' ? 'bg-green-100 text-green-700' :
                                        req.state === 'WAITING' ? 'bg-red-100 text-red-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {req.state}
                                    </span>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    {req.state === 'IDLE' && (
                                        <button onClick={() => handleRequest(req.id)} className="btn-small bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded text-sm transition-colors">
                                            Request Bus
                                        </button>
                                    )}
                                    {req.state === 'REQUESTING' && (
                                        <button onClick={() => handleGrant(req.id)} className="btn-small bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                            Grant Bus
                                        </button>
                                    )}
                                    {req.state === 'GRANTED' && arbitrationState === 'BUS RELEASED' && (
                                        <button onClick={() => handleRelease(req.id)} className="btn-small bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                            Release Bus
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Central Bus Display */}
                    <div className="lg:col-span-2 flex items-center justify-center">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 w-full max-w-md flex flex-col items-center shadow-sm">
                            <h3 className="font-bold text-lg mb-8 text-slate-700">Central Bus State</h3>
                            
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
                                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                                                    : 'bg-white border-slate-200 text-slate-500'
                                            }`}
                                        >
                                            {stateName}
                                        </motion.div>
                                        {idx < arr.length - 1 && (
                                            <div className="text-slate-300 my-1">
                                                <ArrowDown className={`w-6 h-6 ${arbitrationState === arr[idx+1] ? 'text-indigo-500' : ''}`} />
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
            <section className="bg-white border-slate-200 shadow-sm border p-4 rounded-xl">
                <h3 className="font-semibold text-slate-700 mb-2">Event Console</h3>
                <div className="event-console h-48 overflow-y-auto bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-sm border border-slate-700">
                    {logsToDisplay.length > 0 ? logsToDisplay.map((log, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={idx} 
                            className="text-green-400 mb-1 flex"
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
        <div className={`bg-white border-x border-b border-slate-200 shadow-sm p-4 relative overflow-hidden border-t-2 ${borderColor} rounded-xl h-20 flex flex-col justify-center`}>
             <h4 className="text-slate-900 font-semibold z-10">{name}</h4>
             <p className="text-xs text-slate-500 z-10">{desc}</p>
             
             <div className="absolute inset-0 flex items-center px-4">
                 <div className="w-full h-0.5 bg-slate-200" />
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
