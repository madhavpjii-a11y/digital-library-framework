import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, HardDrive, CheckCircle2, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
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
    <div className="flex flex-col gap-6 p-6 min-h-screen text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h1 className="section-title text-3xl font-bold gradient-text text-slate-900">Memory Management Subsystem</h1>
      </div>

      {/* Visual Flow at Top */}
      <div className="bg-white border-slate-200 shadow-sm border p-6 rounded-xl flex items-center justify-center gap-4 mb-4">
        <FlowStep 
          icon={<HardDrive className="w-6 h-6" />} 
          label="Storage" 
          active={operationStep === 0} 
          completed={operationStep > 0} 
        />
        <div className="flex-1 max-w-[100px]">
          <div className={`h-1 w-full rounded ${operationStep > 0 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
        </div>
        <FlowStep 
          icon={<Cpu className="w-6 h-6" />} 
          label="Memory Access" 
          active={operationStep === 1} 
          completed={operationStep > 1} 
        />
        <div className="flex-1 max-w-[100px]">
          <div className={`h-1 w-full rounded ${operationStep > 1 ? 'bg-green-500' : 'bg-slate-200'}`}></div>
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
        <div className="bg-white border-slate-200 shadow-sm border rounded-xl p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
            <Database className="w-5 h-5 text-indigo-500" />
            Library Database
          </h2>
          
          <div className="flex gap-2 mb-4 border-b border-slate-200 pb-2">
            <button 
              className={`tab-btn px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'books' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-900'}`}
              onClick={() => setActiveTab('books')}
            >
              Books
            </button>
            <button 
              className={`tab-btn px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'members' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-900'}`}
              onClick={() => setActiveTab('members')}
            >
              Members
            </button>
            <button 
              className={`tab-btn px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'transactions' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-900'}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-2">
            <AnimatePresence mode="wait">
              {activeTab === 'books' && (
                <motion.div key="books" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="text-xs uppercase bg-slate-50 sticky top-0">
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
                            className={`border-b border-slate-200 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-indigo-50 ring-1 ring-indigo-500' : ''}`}
                            onClick={() => handleRecordClick(book, 'book')}
                          >
                            <td className="px-4 py-3">{book.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">{book.title}</td>
                            <td className="px-4 py-3">{book.category}</td>
                            <td className="px-4 py-3">
                              <span className={`status-badge px-2 py-1 rounded text-xs font-semibold ${available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="text-xs uppercase bg-slate-50 sticky top-0">
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
                            className={`border-b border-slate-200 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-indigo-50 ring-1 ring-indigo-500' : ''}`}
                            onClick={() => handleRecordClick(member, 'member')}
                          >
                            <td className="px-4 py-3">{member.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">{member.name}</td>
                            <td className="px-4 py-3">{member.department}</td>
                            <td className="px-4 py-3">Sem {member.semester}</td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'transactions' && (
                <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="text-xs uppercase bg-slate-50 sticky top-0">
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
                            className={`border-b border-slate-200 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-indigo-50 ring-1 ring-indigo-500' : ''}`}
                            onClick={() => handleRecordClick(txn, 'transaction')}
                          >
                            <td className="px-4 py-3">{txn.id}</td>
                            <td className="px-4 py-3">{txn.bookId}</td>
                            <td className="px-4 py-3">{txn.memberId}</td>
                            <td className="px-4 py-3">
                              <span className={`status-badge px-2 py-1 rounded text-xs font-semibold ${txn.status === 'Active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
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
        <div className="bg-white border-slate-200 shadow-sm border rounded-xl p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Cpu className="w-5 h-5 text-purple-600" />
              Memory Simulator
            </h2>
            <div className="flex items-center gap-3">
              <span className={`status-badge px-3 py-1 rounded-full text-sm font-semibold 
                ${memoryStatus === 'IDLE' ? 'bg-slate-100 text-slate-500' : 
                  memoryStatus === 'MEMORY_ACCESS' ? 'bg-yellow-100 text-yellow-700 animate-pulse' : 
                  'bg-green-100 text-green-700'}`}>
                {memoryStatus.replace('_', ' ')}
              </span>
              <button 
                onClick={handleReset}
                className="btn-secondary p-2 rounded hover:bg-slate-100 border border-slate-200 transition-colors text-slate-600"
                title="Reset Memory"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 rounded-lg p-4 overflow-y-auto mb-4 border border-slate-200">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex text-xs text-slate-500 font-mono uppercase px-2 pb-2 border-b border-slate-200">
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
                    ${cell.active ? 'bg-purple-50 border border-purple-200 shadow-sm scale-[1.02]' : 'bg-white border border-slate-200'}`}
                >
                  <div className={`w-24 font-bold ${cell.active ? 'text-purple-600' : 'text-slate-500'}`}>
                    {cell.address || `0x000${index + 1}`}
                  </div>
                  <div className="flex-1 text-green-600 overflow-hidden text-ellipsis whitespace-nowrap px-2">
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
                        <span className="text-slate-400">00000000</span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className={`w-32 text-right text-xs truncate ${cell.active ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {cell.label || 'EMPTY'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Event Console - KEPT DARK */}
          <div className="event-console h-32 bg-slate-900 text-slate-300 rounded-lg p-3 font-mono text-xs overflow-y-auto border border-slate-700">
            <div className="text-slate-400 mb-2 border-b border-slate-700 pb-1">System Logs</div>
            {state.logs && state.logs.length > 0 ? (
              [...state.logs].reverse().slice(0, 10).map((log, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes('error') ? 'text-red-400' : log.includes('success') ? 'text-green-400' : 'text-slate-300'}>
                    {log}
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
      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300
        ${active ? 'bg-indigo-50 ring-1 ring-indigo-500 shadow-sm' : 
          completed ? 'bg-white text-slate-700 border border-slate-200' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
      animate={{ scale: active ? 1.05 : 1 }}
    >
      <div className={`p-2 rounded-full ${active ? 'bg-indigo-100 text-indigo-600' : completed ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
        {completed && !active ? <CheckCircle2 className="w-6 h-6" /> : icon}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
    </motion.div>
  );
};

export default MemoryPage;
