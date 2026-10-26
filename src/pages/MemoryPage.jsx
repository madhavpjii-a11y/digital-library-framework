import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, HardDrive, CheckCircle2, RefreshCw } from 'lucide-react';
import { books, members, transactions } from '../data/sampleData';
import { useSimulation } from '../context/SimulationContext';

const MemoryPage = () => {
  const { state, dispatch } = useSimulation();
  const [activeTab, setActiveTab] = useState('books');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [memoryStatus, setMemoryStatus] = useState('IDLE'); // IDLE, MEMORY_ACCESS, DATA_RETRIEVED
  const [operationStep, setOperationStep] = useState(0); // 0: Storage, 1: Memory Access, 2: Data Retrieval

  // Find next available memory index or wrap around
  const getNextMemoryIndex = () => {
    if (!state.memory) return 0;
    const index = state.memory.findIndex(cell => !cell.active);
    return index !== -1 ? index : 0;
  };

  const handleRecordClick = (record, type) => {
    if (memoryStatus !== 'IDLE' && memoryStatus !== 'DATA_RETRIEVED') return;
    
    setSelectedRecord({ ...record, type });
    setMemoryStatus('MEMORY_ACCESS');
    setOperationStep(1);
    
    dispatch({ type: 'SET_STATUS', payload: { status: 'MEMORY ACCESS', type: 'info' } });
    dispatch({ type: 'ADD_LOG', payload: `Initiating memory access for ${type} record...` });

    // Simulate memory access delay
    setTimeout(() => {
      const memIndex = getNextMemoryIndex();
      
      let dataString = '';
      let labelString = '';
      
      if (type === 'book') {
        dataString = `{ id: ${record.id}, title: "${record.title.substring(0, 10)}..." }`;
        labelString = `Book_${record.id}`;
      } else if (type === 'member') {
        dataString = `{ id: ${record.id}, name: "${record.name.substring(0, 10)}..." }`;
        labelString = `Member_${record.id}`;
      } else {
        dataString = `{ id: ${record.id}, book: ${record.bookId} }`;
        labelString = `Txn_${record.id}`;
      }

      dispatch({ 
        type: 'LOAD_MEMORY', 
        payload: { index: memIndex, data: dataString, label: labelString } 
      });
      
      setMemoryStatus('DATA_RETRIEVED');
      setOperationStep(2);
      dispatch({ type: 'SET_STATUS', payload: { status: 'DATA RETRIEVED', type: 'success' } });
      dispatch({ type: 'ADD_LOG', payload: `Data successfully retrieved to memory address 0x000${memIndex + 1}` });
      
      setTimeout(() => {
        setOperationStep(0);
        setMemoryStatus('IDLE');
        setSelectedRecord(null);
      }, 3000);
      
    }, 1200);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_MEMORY' });
    dispatch({ type: 'ADD_LOG', payload: 'Memory cleared by user.' });
    setMemoryStatus('IDLE');
    setOperationStep(0);
    setSelectedRecord(null);
  };

  // Helper for rendering memory cells safely
  const memoryCells = state.memory || Array.from({ length: 10 }, (_, i) => ({
    address: `0x000${i+1}`, data: '00000000', label: 'EMPTY', active: false
  }));

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen text-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="section-title text-3xl font-bold gradient-text">Memory Management Subsystem</h1>
      </div>

      {/* Visual Flow at Top */}
      <div 
        className="p-6 rounded-xl flex items-center justify-center gap-4 mb-4 backdrop-blur-md"
        style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <FlowStep 
          icon={<HardDrive className="w-6 h-6" />} 
          label="Storage" 
          active={operationStep === 0} 
          completed={operationStep > 0} 
        />
        <div className="flex-1 max-w-[100px]">
          <div className={`h-1 w-full rounded transition-colors ${operationStep > 0 ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'bg-white/10'}`}></div>
        </div>
        <FlowStep 
          icon={<Cpu className="w-6 h-6" />} 
          label="Memory Access" 
          active={operationStep === 1} 
          completed={operationStep > 1} 
        />
        <div className="flex-1 max-w-[100px]">
          <div className={`h-1 w-full rounded transition-colors ${operationStep > 1 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-white/10'}`}></div>
        </div>
        <FlowStep 
          icon={<Database className="w-6 h-6" />} 
          label="Data Retrieval" 
          active={operationStep === 2} 
          completed={operationStep === 2} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Digital Library Data */}
        <div 
          className="rounded-xl p-6 flex flex-col h-[600px] backdrop-blur-md"
          style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <Database className="w-5 h-5 text-violet-400" />
            Library Database
          </h2>
          
          <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
            <button 
              className={`tab-btn px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'books' ? 'bg-violet-500/20 text-violet-300 border-b-2 border-violet-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              onClick={() => setActiveTab('books')}
            >
              Books
            </button>
            <button 
              className={`tab-btn px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'members' ? 'bg-violet-500/20 text-violet-300 border-b-2 border-violet-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              onClick={() => setActiveTab('members')}
            >
              Members
            </button>
            <button 
              className={`tab-btn px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'transactions' ? 'bg-violet-500/20 text-violet-300 border-b-2 border-violet-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-2">
            <AnimatePresence mode="wait">
              {activeTab === 'books' && (
                <motion.div key="books" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-white/5 text-slate-400 sticky top-0 backdrop-blur-md">
                      <tr>
                        <th className="px-4 py-3">Book ID</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books && books.map((book) => {
                        const available = book.totalCopies - book.issued;
                        const isSelected = selectedRecord?.id === book.id && selectedRecord?.type === 'book';
                        
                        return (
                          <motion.tr 
                            key={book.id}
                            className={`border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${isSelected ? 'bg-violet-500/15 ring-1 ring-violet-500/50' : ''}`}
                            onClick={() => handleRecordClick(book, 'book')}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-slate-400">{book.id}</td>
                            <td className="px-4 py-3 font-medium text-white">{book.title}</td>
                            <td className="px-4 py-3 text-slate-400">{book.category}</td>
                            <td className="px-4 py-3">
                              <span className={`status-badge px-2 py-1 rounded text-xs font-semibold border ${available > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                {available > 0 ? `${available} Available` : 'Issued Out'}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'members' && (
                <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-white/5 text-slate-400 sticky top-0 backdrop-blur-md">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Semester</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members && members.map((member) => {
                        const isSelected = selectedRecord?.id === member.id && selectedRecord?.type === 'member';
                        return (
                          <motion.tr 
                            key={member.id}
                            className={`border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${isSelected ? 'bg-violet-500/15 ring-1 ring-violet-500/50' : ''}`}
                            onClick={() => handleRecordClick(member, 'member')}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-slate-400">{member.id}</td>
                            <td className="px-4 py-3 font-medium text-white">{member.name}</td>
                            <td className="px-4 py-3 text-slate-400">{member.department}</td>
                            <td className="px-4 py-3 text-slate-300">Sem {member.semester}</td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'transactions' && (
                <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-white/5 text-slate-400 sticky top-0 backdrop-blur-md">
                      <tr>
                        <th className="px-4 py-3">Txn ID</th>
                        <th className="px-4 py-3">Book ID</th>
                        <th className="px-4 py-3">Member ID</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions && transactions.map((txn) => {
                        const isSelected = selectedRecord?.id === txn.id && selectedRecord?.type === 'transaction';
                        return (
                          <motion.tr 
                            key={txn.id}
                            className={`border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${isSelected ? 'bg-violet-500/15 ring-1 ring-violet-500/50' : ''}`}
                            onClick={() => handleRecordClick(txn, 'transaction')}
                          >
                            <td className="px-4 py-3 font-mono text-xs text-slate-400">{txn.id}</td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-300">{txn.bookId}</td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-300">{txn.memberId}</td>
                            <td className="px-4 py-3">
                              <span className={`status-badge px-2 py-1 rounded text-xs font-semibold border ${txn.status === 'Active' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                                {txn.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section 2: Memory Simulator */}
        <div 
          className="rounded-xl p-6 flex flex-col h-[600px] backdrop-blur-md"
          style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Cpu className="w-5 h-5 text-purple-400" />
              Memory Simulator
            </h2>
            <div className="flex items-center gap-3">
              <span className={`status-badge px-3 py-1 rounded-full text-sm font-semibold border 
                ${memoryStatus === 'IDLE' ? 'bg-white/5 text-slate-400 border-white/10' : 
                  memoryStatus === 'MEMORY_ACCESS' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse' : 
                  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'}`}>
                {memoryStatus.replace('_', ' ')}
              </span>
              <button 
                onClick={handleReset}
                className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-300 hover:text-white"
                title="Reset Memory"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            className="flex-1 rounded-lg p-4 overflow-y-auto mb-4 border border-white/10"
            style={{ background: 'rgba(10, 12, 24, 0.6)' }}
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="flex text-xs text-slate-400 font-mono uppercase px-2 pb-2 border-b border-white/10">
                <div className="w-24">Address</div>
                <div className="flex-1">Data</div>
                <div className="w-32 text-right">Label</div>
              </div>
              
              {memoryCells.slice(0, 10).map((cell, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`memory-cell flex items-center font-mono text-sm p-2 rounded transition-all duration-300
                    ${cell.active 
                      ? 'bg-violet-950/40 border border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.3)] scale-[1.01]' 
                      : 'bg-white/[0.02] border border-white/10 hover:border-white/20'}`}
                >
                  <div className={`w-24 font-bold ${cell.active ? 'text-violet-300' : 'text-slate-500'}`}>
                    {cell.address || `0x000${index + 1}`}
                  </div>
                  <div className="flex-1 text-emerald-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap px-2">
                    <AnimatePresence mode="popLayout">
                      {cell.active ? (
                        <motion.span 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="inline-block"
                        >
                          {cell.data}
                        </motion.span>
                      ) : (
                        <span className="text-slate-600">00000000</span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className={`w-32 text-right text-xs truncate ${cell.active ? 'text-violet-400 font-semibold' : 'text-slate-500'}`}>
                    {cell.label || 'EMPTY'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Event Console - KEPT DARK */}
          <div className="event-console h-32 bg-slate-950/80 text-slate-300 rounded-lg p-3 font-mono text-xs overflow-y-auto border border-white/10">
            <div className="text-slate-400 mb-2 border-b border-white/10 pb-1">System Logs</div>
            {state.logs && state.logs.length > 0 ? (
              [...state.logs].reverse().slice(0, 10).map((log, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                  <span className={typeof log === 'string' && log.includes('error') ? 'text-rose-400' : typeof log === 'string' && log.includes('success') ? 'text-emerald-400' : 'text-slate-300'}>
                    {typeof log === 'string' ? log : log.message}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic">Waiting for operations...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Flow Step Component
const FlowStep = ({ icon, label, active, completed }) => {
  return (
    <motion.div 
      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300 border
        ${active ? 'bg-violet-500/15 border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.25)]' : 
          completed ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-white/[0.02] text-slate-500 border-white/5'}`}
      animate={{ scale: active ? 1.05 : 1 }}
    >
      <div className={`p-2 rounded-full ${active ? 'bg-violet-500/20 text-violet-300' : completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
        {completed && !active ? <CheckCircle2 className="w-6 h-6" /> : icon}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
    </motion.div>
  );
};

export default MemoryPage;
