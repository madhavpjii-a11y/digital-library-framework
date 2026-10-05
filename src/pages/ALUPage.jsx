import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Cpu, Hash, Layers, GitMerge, Hexagon, Maximize2, Play, SkipForward, RotateCcw } from 'lucide-react';

const TABS = [
  { id: 'alu', label: 'ALU Simulator', icon: Calculator, desc: 'Simulate Arithmetic Logic Unit operations with visual data flow.' },
  { id: 'binary', label: 'Binary Ops', icon: Hash, desc: 'Step-by-step binary arithmetic operations.' },
  { id: 'booths', label: "Booth's Algorithm", icon: Layers, desc: "Multiply signed binary numbers using Booth's multiplication algorithm." },
  { id: 'array', label: 'Array Multiplier', icon: Hexagon, desc: 'Visual representation of combinational array multiplier.' },
  { id: 'division', label: 'Division', icon: GitMerge, desc: 'Restoring binary division algorithm.' },
  { id: 'gates', label: 'Logic Gates', icon: Cpu, desc: 'Basic logic gates with truth tables and visual representations.' },
  { id: 'float', label: 'Floating Point', icon: Maximize2, desc: 'IEEE 754 single-precision floating point number representation.' }
];

export default function ALUPage() {
  const [activeTab, setActiveTab] = useState('alu');

  return (
    <div className="p-6 text-slate-900 min-h-screen bg-slate-50">
      <div className="mb-8">
        <h1 className="text-4xl mb-2 flex items-center gap-3 font-bold text-slate-900">
          <Cpu className="text-indigo-500 w-10 h-10" />
          <span className="text-slate-900">ALU & Computer Arithmetic</span>
        </h1>
        <p className="text-slate-600">Digital Library Processing Framework - Computer Organization</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border ${
              activeTab === tab.id 
              ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
        <p className="text-indigo-600 flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          {TABS.find(t => t.id === activeTab)?.desc}
        </p>
      </div>

      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'alu' && <ALUSimulator />}
            {activeTab === 'binary' && <BinaryOps />}
            {activeTab === 'booths' && <BoothsAlgorithm />}
            {activeTab === 'array' && <ArrayMultiplier />}
            {activeTab === 'division' && <BinaryDivision />}
            {activeTab === 'gates' && <LogicGates />}
            {activeTab === 'float' && <FloatingPoint />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// TAB 1: ALU SIMULATOR
// ==========================================
function ALUSimulator() {
  const [opA, setOpA] = useState(12);
  const [opB, setOpB] = useState(5);
  const [operation, setOperation] = useState('ADD');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = () => {
    setIsCalculating(true);
    setResult(null);
    setTimeout(() => {
      let res = 0;
      let a = parseInt(opA) || 0;
      let b = parseInt(opB) || 0;
      
      switch(operation) {
        case 'ADD': res = a + b; break;
        case 'SUB': res = a - b; break;
        case 'MUL': res = a * b; break;
        case 'DIV': res = b !== 0 ? Math.floor(a / b) : 0; break;
        case 'AND': res = a & b; break;
        case 'OR': res = a | b; break;
        case 'XOR': res = a ^ b; break;
        case 'NOT': res = ~a; break;
        default: res = 0;
      }
      setResult({ a, b, res, op: operation });
      setIsCalculating(false);
    }, 1500);
  };

  const toBin = (num) => (num >>> 0).toString(2).padStart(8, '0').slice(-8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Input A */}
        <div className="w-full flex justify-center mb-8 relative z-10">
          <div className="bg-white border border-slate-200 rounded-lg p-4 w-48 text-center shadow-sm">
            <label className="block text-xs text-slate-500 mb-1 font-semibold">OPERAND A</label>
            <input type="number" value={opA} onChange={(e) => setOpA(e.target.value)} className="w-full bg-slate-50 text-indigo-600 font-mono text-center rounded border border-slate-200 py-1 outline-none focus:border-indigo-400" />
          </div>
        </div>

        {/* Connectors */}
        <div className="h-16 w-px bg-indigo-200 absolute top-28 left-1/2 -translate-x-1/2"></div>
        {isCalculating && (
          <motion.div initial={{ top: 112 }} animate={{ top: 176 }} transition={{ duration: 0.5, repeat: Infinity }} className="w-3 h-3 rounded-full bg-indigo-500 absolute left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-20"></motion.div>
        )}

        {/* Input B */}
        {operation !== 'NOT' && (
          <div className="w-full flex justify-center mb-8 relative z-10">
            <div className="bg-white border border-slate-200 rounded-lg p-4 w-48 text-center shadow-sm">
              <label className="block text-xs text-slate-500 mb-1 font-semibold">OPERAND B</label>
              <input type="number" value={opB} onChange={(e) => setOpB(e.target.value)} className="w-full bg-slate-50 text-pink-600 font-mono text-center rounded border border-slate-200 py-1 outline-none focus:border-pink-400" />
            </div>
          </div>
        )}

        {/* Connectors */}
        {operation !== 'NOT' && <div className="h-16 w-px bg-pink-200 absolute top-[240px] left-1/2 -translate-x-1/2"></div>}
        {isCalculating && operation !== 'NOT' && (
          <motion.div initial={{ top: 240 }} animate={{ top: 304 }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className="w-3 h-3 rounded-full bg-pink-400 absolute left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(244,114,182,0.5)] z-20"></motion.div>
        )}

        {/* ALU Block */}
        <motion.div 
          animate={isCalculating ? { boxShadow: ['0 0 0px rgba(99,102,241,0.5)', '0 0 20px rgba(99,102,241,0.5)', '0 0 0px rgba(99,102,241,0.5)'] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className={`clip-alu bg-gradient-to-b from-slate-50 to-white border-2 ${isCalculating ? 'border-indigo-400' : 'border-slate-300'} w-64 h-40 flex flex-col items-center justify-center relative z-10`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
        >
          <Calculator className={`w-8 h-8 mb-2 ${isCalculating ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="font-bold tracking-widest text-lg text-slate-700">ALU</span>
          <span className="text-xs text-indigo-600 font-semibold">{operation}</span>
        </motion.div>

        {/* Output Connector */}
        <div className="h-16 w-px bg-emerald-200 absolute bottom-32 left-1/2 -translate-x-1/2"></div>
        {result && !isCalculating && (
          <motion.div initial={{ top: 400 }} animate={{ top: 464 }} transition={{ duration: 0.5 }} className="w-3 h-3 rounded-full bg-emerald-500 absolute left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-20"></motion.div>
        )}

        {/* Result */}
        <div className="w-full flex justify-center mt-8 relative z-10">
          <div className={`bg-white border ${result ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'} rounded-lg p-4 w-48 text-center shadow-sm transition-colors duration-300`}>
            <label className="block text-xs text-slate-500 mb-1 font-semibold">RESULT</label>
            <div className={`w-full bg-slate-50 font-mono text-center rounded border py-1 min-h-[34px] ${result ? 'text-emerald-700 border-emerald-200' : 'text-slate-400 border-slate-200'}`}>
              {result ? result.res : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 border-b border-slate-100 pb-2">Configuration</h3>
          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-2 font-medium">Operation</label>
            <select 
              value={operation} 
              onChange={(e) => setOperation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:border-indigo-400 outline-none"
            >
              <optgroup label="Arithmetic">
                <option value="ADD">Addition (A + B)</option>
                <option value="SUB">Subtraction (A - B)</option>
                <option value="MUL">Multiplication (A * B)</option>
                <option value="DIV">Division (A / B)</option>
              </optgroup>
              <optgroup label="Logic">
                <option value="AND">Bitwise AND (A & B)</option>
                <option value="OR">Bitwise OR (A | B)</option>
                <option value="XOR">Bitwise XOR (A ^ B)</option>
                <option value="NOT">Bitwise NOT (~A)</option>
              </optgroup>
            </select>
          </div>
          <button 
            onClick={calculate} 
            disabled={isCalculating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50"
          >
            {isCalculating ? 'Processing...' : 'Calculate'}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex-grow">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 border-b border-slate-100 pb-2">Analysis</h3>
          {result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-600 text-sm font-medium">Status</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded border border-emerald-200">SUCCESS</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                  <div className="text-xs text-slate-500 mb-1 font-semibold">OP A</div>
                  <div className="font-mono text-indigo-600">{toBin(result.a)}</div>
                </div>
                {operation !== 'NOT' ? (
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-xs text-slate-500 mb-1 font-semibold">OP B</div>
                    <div className="font-mono text-pink-600">{toBin(result.b)}</div>
                  </div>
                ) : <div/>}
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <div className="text-xs text-emerald-700 mb-1 font-semibold">RESULT</div>
                  <div className="font-mono text-emerald-600 font-bold">{toBin(result.res)}</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700 font-mono text-sm text-slate-300">
                <div className="text-slate-500 mb-2">// Operation Log</div>
                <div className="text-indigo-300">LOAD R1, {result.a}</div>
                {operation !== 'NOT' && <div className="text-pink-300">LOAD R2, {result.b}</div>}
                <div className="text-amber-300">{operation} R3, R1{operation !== 'NOT' ? ', R2' : ''}</div>
                <div className="text-emerald-400">STORE R3  -&gt; {result.res}</div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400 italic text-sm">
              Awaiting calculation...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TAB 2: BINARY OPS
// ==========================================
function BinaryOps() {
  const [val1, setVal1] = useState('1010');
  const [val2, setVal2] = useState('0101');
  const [isDecimal, setIsDecimal] = useState(false);
  const [operation, setOperation] = useState('ADD');

  const handleVal1 = (e) => {
    const val = e.target.value;
    if (isDecimal) setVal1(val);
    else if (/^[01]*$/.test(val)) setVal1(val);
  }
  
  const handleVal2 = (e) => {
    const val = e.target.value;
    if (isDecimal) setVal2(val);
    else if (/^[01]*$/.test(val)) setVal2(val);
  }

  const getDec = (str) => isDecimal ? parseInt(str || '0', 10) : parseInt(str || '0', 2);
  const v1 = getDec(val1);
  const v2 = getDec(val2);
  
  let res = 0;
  switch(operation) {
    case 'ADD': res = v1 + v2; break;
    case 'SUB': res = v1 - v2; break;
    case 'MUL': res = v1 * v2; break;
    case 'DIV': res = v2 !== 0 ? Math.floor(v1/v2) : 0; break;
    case 'AND': res = v1 & v2; break;
    case 'OR': res = v1 | v2; break;
    case 'XOR': res = v1 ^ v2; break;
    case 'NOT': res = ~v1; break;
    default: res = 0;
  }

  const bin1 = (v1 >>> 0).toString(2).padStart(8, '0');
  const bin2 = (v2 >>> 0).toString(2).padStart(8, '0');
  const binRes = (res >>> 0).toString(2).padStart(8, '0');

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm w-full p-6 mb-8 flex gap-6 items-end">
        <div className="flex-1">
          <label className="block text-sm text-slate-600 font-medium mb-1">Operand 1</label>
          <input type="text" value={val1} onChange={handleVal1} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-indigo-700 font-mono focus:border-indigo-400 outline-none" />
        </div>
        <div className="w-32">
          <label className="block text-sm text-slate-600 font-medium mb-1">Operation</label>
          <select value={operation} onChange={(e)=>setOperation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:border-indigo-400 outline-none">
            <option value="ADD">+</option>
            <option value="SUB">-</option>
            <option value="MUL">*</option>
            <option value="DIV">/</option>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            <option value="XOR">XOR</option>
            <option value="NOT">NOT</option>
          </select>
        </div>
        {operation !== 'NOT' && (
          <div className="flex-1">
            <label className="block text-sm text-slate-600 font-medium mb-1">Operand 2</label>
            <input type="text" value={val2} onChange={handleVal2} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-indigo-700 font-mono focus:border-indigo-400 outline-none" />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-slate-600 font-medium">Base:</label>
          <button onClick={() => setIsDecimal(!isDecimal)} className="px-3 py-1 bg-slate-100 rounded border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors">
            {isDecimal ? 'Decimal' : 'Binary'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm w-full max-w-2xl p-8 font-mono text-xl flex flex-col items-center">
        <div className="flex flex-col items-end gap-2 text-slate-700 tracking-[0.5em]">
          <div>{bin1.slice(-8)}</div>
          <div className="flex items-center gap-4">
            <span className="text-indigo-600">{operation}</span>
            {operation !== 'NOT' ? <span>{bin2.slice(-8)}</span> : <span className="opacity-0">00000000</span>}
          </div>
          <div className="w-full h-px bg-slate-300 my-2"></div>
          <div className="text-emerald-600 font-bold">{binRes.slice(-8)}</div>
        </div>

        <div className="mt-12 text-sm text-slate-500 flex gap-12 font-sans w-full justify-center">
          <div className="text-center bg-slate-50 px-6 py-3 rounded-lg border border-slate-100">
            <span className="block text-xs font-semibold mb-1 text-slate-400 uppercase tracking-wider">Decimal</span>
            <span className="text-lg text-slate-700 font-mono">{v1} {operation} {operation !== 'NOT' ? v2 : ''} = {res}</span>
          </div>
          <div className="text-center bg-slate-50 px-6 py-3 rounded-lg border border-slate-100">
            <span className="block text-xs font-semibold mb-1 text-slate-400 uppercase tracking-wider">Hexadecimal</span>
            <span className="text-lg text-slate-700 font-mono">0x{(v1>>>0).toString(16).toUpperCase()} {operation} 0x{(v2>>>0).toString(16).toUpperCase()} = 0x{(res>>>0).toString(16).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TAB 3: BOOTH'S ALGORITHM
// ==========================================
function BoothsAlgorithm() {
  const [mInput, setMInput] = useState('7');
  const [qInput, setQInput] = useState('3');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const N = 4; // 4-bit simulation

  const toTwosComplement = (num, bits) => {
    if (num >= 0) return num.toString(2).padStart(bits, '0');
    let pos = Math.abs(num);
    let bin = pos.toString(2).padStart(bits, '0');
    let inv = bin.split('').map(b => b === '0' ? '1' : '0').join('');
    let dec = parseInt(inv, 2) + 1;
    return dec.toString(2).padStart(bits, '0').slice(-bits);
  };

  const initSimulation = () => {
    let mDec = parseInt(mInput);
    let qDec = parseInt(qInput);
    
    // Clamp to 4-bit signed (-8 to 7)
    mDec = Math.max(-8, Math.min(7, mDec));
    qDec = Math.max(-8, Math.min(7, qDec));
    
    const m = toTwosComplement(mDec, N);
    const negM = toTwosComplement(-mDec, N);
    let q = toTwosComplement(qDec, N);
    let a = '0000';
    let qMinus1 = '0';
    
    const newSteps = [{
      step: 0,
      op: 'Initialization',
      a, q, qMinus1, m,
      desc: `A=0, Q=${qDec}, Q-1=0, M=${mDec}`
    }];

    for(let i=1; i<=N; i++) {
      let q0 = q[q.length-1];
      let op = 'None';
      let aBefore = a;
      
      if (q0 === '1' && qMinus1 === '0') {
        op = 'A = A - M';
        let aDec = parseInt(a, 2);
        if (a[0] === '1') aDec -= 16;
        let res = aDec - mDec;
        a = toTwosComplement(res, N);
      } else if (q0 === '0' && qMinus1 === '1') {
        op = 'A = A + M';
        let aDec = parseInt(a, 2);
        if (a[0] === '1') aDec -= 16;
        let res = aDec + mDec;
        a = toTwosComplement(res, N);
      }
      
      newSteps.push({
        step: i,
        op,
        a, q, qMinus1, m,
        desc: `Check Q0,Q-1 = ${q0}${qMinus1}. ${op}`
      });

      // ARS (Arithmetic Right Shift)
      let combined = a + q + qMinus1;
      let signBit = a[0];
      let shifted = signBit + combined.slice(0, -1);
      
      a = shifted.slice(0, N);
      q = shifted.slice(N, 2*N);
      qMinus1 = shifted.slice(2*N, 2*N+1);
      
      newSteps.push({
        step: i,
        op: 'Shift Right',
        a, q, qMinus1, m,
        desc: `Arithmetic Right Shift A, Q, Q-1`
      });
    }
    
    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="h-full">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm text-slate-600 font-medium mb-1">Multiplicand (M) [-8 to 7]</label>
          <input type="number" value={mInput} onChange={(e)=>setMInput(e.target.value)} className="bg-slate-50 border border-slate-200 rounded p-2 text-indigo-700 font-mono w-48 outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 font-medium mb-1">Multiplier (Q) [-8 to 7]</label>
          <input type="number" value={qInput} onChange={(e)=>setQInput(e.target.value)} className="bg-slate-50 border border-slate-200 rounded p-2 text-pink-600 font-mono w-48 outline-none focus:border-pink-400" />
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={initSimulation} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2 transition-colors">
            <Play className="w-4 h-4"/> Start
          </button>
          <button onClick={nextStep} disabled={!isRunning || currentStep >= steps.length - 1} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded flex items-center gap-2 transition-colors">
            <SkipForward className="w-4 h-4"/> Next Step
          </button>
          <button onClick={() => {setSteps([]); setIsRunning(false);}} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded flex items-center gap-2 transition-colors">
            <RotateCcw className="w-4 h-4"/> Reset
          </button>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3 pl-6">Step</th>
                <th className="p-3">Operation</th>
                <th className="p-3 text-center">A</th>
                <th className="p-3 text-center">Q</th>
                <th className="p-3 text-center">Q-1</th>
                <th className="p-3 text-center">M</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {steps.slice(0, currentStep + 1).map((s, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-b border-slate-100 ${idx === currentStep ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="p-3 pl-6 text-slate-500 font-sans">{Math.floor(s.step)}</td>
                    <td className="p-3 text-indigo-600 font-bold">{s.op}</td>
                    <td className="p-3 text-center text-amber-600 font-bold">{s.a}</td>
                    <td className="p-3 text-center text-pink-600 font-bold">{s.q}</td>
                    <td className="p-3 text-center text-slate-600">{s.qMinus1}</td>
                    <td className="p-3 text-center text-slate-500">{s.m}</td>
                    <td className="p-3 text-slate-500 text-xs font-sans">{s.desc}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {currentStep === steps.length - 1 && (
            <div className="p-6 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-emerald-800 block text-sm font-semibold mb-1">Final Result (A, Q)</span>
                <span className="text-2xl font-mono text-emerald-600 font-bold">{steps[steps.length-1].a} {steps[steps.length-1].q}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-800 block text-sm font-semibold mb-1">Decimal Result</span>
                <span className="text-2xl font-sans text-emerald-600 font-bold">
                  {parseInt(mInput) * parseInt(qInput)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// TAB 4: ARRAY MULTIPLIER
// ==========================================
function ArrayMultiplier() {
  const m = 3; // 11
  const q = 2; // 10
  
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8">
      <h3 className="text-xl font-bold mb-6 text-slate-800">4x4 Combinational Array Multiplier Concept</h3>
      <p className="text-slate-600 mb-8 max-w-2xl text-center">
        A visual representation of how hardware multiplies two binary numbers using an array of AND gates (for partial products) and Full Adders.
      </p>
      
      <div className="font-mono text-lg flex flex-col items-end gap-2 text-slate-700 tracking-[0.5em] bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="font-bold">1 0 1 1</div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-500">x</span>
          <span className="font-bold">1 1 0 1</span>
        </div>
        <div className="w-full h-px bg-slate-300 my-2"></div>
        <div className="text-pink-600">      1 0 1 1 <span className="text-xs text-slate-500 tracking-normal ml-2">&lt;- PP0 (1011 * 1)</span></div>
        <div className="text-pink-600">    0 0 0 0   <span className="text-xs text-slate-500 tracking-normal ml-2">&lt;- PP1 (1011 * 0)</span></div>
        <div className="text-pink-600">  1 0 1 1     <span className="text-xs text-slate-500 tracking-normal ml-2">&lt;- PP2 (1011 * 1)</span></div>
        <div className="text-pink-600">1 0 1 1       <span className="text-xs text-slate-500 tracking-normal ml-2">&lt;- PP3 (1011 * 1)</span></div>
        <div className="w-full h-px bg-slate-300 my-2"></div>
        <div className="text-emerald-600 font-bold tracking-[0.4em]">1 0 0 0 1 1 1 1</div>
      </div>
      
      <div className="mt-8 text-sm text-slate-500 text-center bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100">
        Each row of partial products is generated in parallel using AND gates. <br/>
        They are then summed using an array of Half and Full adders.
      </div>
    </div>
  );
}

// ==========================================
// TAB 5: DIVISION
// ==========================================
function BinaryDivision() {
  return (
    <div className="flex items-center justify-center h-[500px] bg-white border border-slate-200 rounded-xl shadow-sm p-12">
      <div className="text-center">
        <GitMerge className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-700 mb-2">Restoring Division Algorithm</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Interactive simulation of hardware binary division algorithm is currently being refactored for the upcoming processing framework update.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// TAB 6: LOGIC GATES
// ==========================================
function LogicGates() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const GateResult = ({ label, result }) => (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <span className="text-slate-700 font-semibold">{label}</span>
      <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${result ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
        {result}
      </span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold mb-8 text-slate-800">Inputs</h3>
        
        <div className="flex gap-12 mb-12">
          <div className="flex flex-col items-center">
            <span className="text-slate-500 mb-4 font-bold text-sm uppercase tracking-wider">Input A</span>
            <button 
              onClick={() => setA(a ? 0 : 1)}
              className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl font-bold transition-all ${a ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-50 text-slate-400 border-2 border-slate-200 hover:bg-slate-100'}`}
            >
              {a}
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-slate-500 mb-4 font-bold text-sm uppercase tracking-wider">Input B</span>
            <button 
              onClick={() => setB(b ? 0 : 1)}
              className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl font-bold transition-all ${b ? 'bg-pink-100 text-pink-600 border-2 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.2)]' : 'bg-slate-50 text-slate-400 border-2 border-slate-200 hover:bg-slate-100'}`}
            >
              {b}
            </button>
          </div>
        </div>

        <p className="text-slate-500 text-sm text-center max-w-sm">
          Click the input boxes above to toggle their values between 0 and 1. Observe how the gate outputs change.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-8 space-y-4">
        <h3 className="text-xl font-bold mb-6 text-slate-800">Gate Outputs</h3>
        
        <GateResult label="AND (A & B)" result={a & b} />
        <GateResult label="OR (A | B)" result={a | b} />
        <GateResult label="XOR (A ^ B)" result={a ^ b} />
        <GateResult label="NAND ~(A & B)" result={!(a & b) ? 1 : 0} />
        <GateResult label="NOR ~(A | B)" result={!(a | b) ? 1 : 0} />
        
        <div className="h-px bg-slate-200 my-6"></div>
        
        <GateResult label="NOT A (~A)" result={a ? 0 : 1} />
        <GateResult label="NOT B (~B)" result={b ? 0 : 1} />
      </div>
    </div>
  );
}

// ==========================================
// TAB 7: FLOATING POINT
// ==========================================
function FloatingPoint() {
  const [inputVal, setInputVal] = useState('-118.625');
  const [breakdown, setBreakdown] = useState(null);

  const analyze = () => {
    let num = parseFloat(inputVal);
    if (isNaN(num)) return;
    
    // IEEE 754 conversion
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    view.setFloat32(0, num);
    
    let binaryStr = '';
    for (let i = 0; i < 4; i++) {
      let byte = view.getUint8(i).toString(2).padStart(8, '0');
      binaryStr += byte;
    }
    
    const sign = binaryStr[0];
    const exp = binaryStr.substring(1, 9);
    const mantissa = binaryStr.substring(9);
    
    setBreakdown({
      sign,
      exp,
      mantissa,
      expDec: parseInt(exp, 2),
      actualExp: parseInt(exp, 2) - 127
    });
  };

  useEffect(() => {
    analyze();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm w-full p-6 mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm text-slate-600 font-medium mb-2">Decimal Value to Convert</label>
          <input 
            type="number" 
            step="any"
            value={inputVal} 
            onChange={(e) => setInputVal(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-indigo-700 font-mono text-xl focus:border-indigo-400 outline-none" 
          />
        </div>
        <button 
          onClick={analyze}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm"
        >
          Analyze
        </button>
      </div>

      {breakdown && (
        <div className="w-full space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center justify-between font-mono">
            <div className="text-center flex-1">
              <div className="text-xs text-red-600 mb-2 font-sans font-bold tracking-wider">SIGN (1)</div>
              <div className="bg-red-50 text-red-600 py-3 rounded border border-red-200 text-2xl font-bold">{breakdown.sign}</div>
            </div>
            <div className="text-center flex-[2] px-2">
              <div className="text-xs text-blue-600 mb-2 font-sans font-bold tracking-wider">EXPONENT (8)</div>
              <div className="bg-blue-50 text-blue-600 py-3 rounded border border-blue-200 text-2xl tracking-[0.2em] font-bold">{breakdown.exp}</div>
            </div>
            <div className="text-center flex-[5]">
              <div className="text-xs text-emerald-600 mb-2 font-sans font-bold tracking-wider">MANTISSA / FRACTION (23)</div>
              <div className="bg-emerald-50 text-emerald-600 py-3 rounded border border-emerald-200 text-xl tracking-[0.1em] font-bold overflow-hidden text-ellipsis">{breakdown.mantissa}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
              <h4 className="text-red-600 font-bold mb-2">Sign Bit</h4>
              <p className="text-slate-600 text-sm">
                Value: <span className="font-mono text-slate-800 font-bold">{breakdown.sign}</span><br/>
                Represents: {breakdown.sign === '1' ? 'Negative (-)' : 'Positive (+)'}
              </p>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
              <h4 className="text-blue-600 font-bold mb-2">Exponent</h4>
              <p className="text-slate-600 text-sm">
                Stored (Biased): <span className="font-mono text-slate-800 font-bold">{breakdown.expDec}</span><br/>
                Bias: <span className="font-mono text-slate-800 font-bold">127</span><br/>
                Actual Exponent: <span className="font-mono text-blue-600 font-bold">{breakdown.expDec} - 127 = {breakdown.actualExp}</span>
              </p>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
              <h4 className="text-emerald-600 font-bold mb-2">Scientific Notation</h4>
              <p className="text-slate-800 text-sm font-mono mt-2 bg-slate-50 border border-slate-200 p-2 rounded">
                {breakdown.sign === '1' ? '-' : ''}1.{breakdown.mantissa.slice(0,6)}... x 2^{breakdown.actualExp}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
