import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Monitor, Boxes, ArrowLeftRight, Shield, Layers, ArrowDownUp, Cpu,
  Calculator, X, Binary, Grid3X3, Divide, ToggleLeft, Hash,
  Database, HardDrive, Activity, Hexagon, ArrowRight
} from 'lucide-react';
import { conceptTopics, unit2Topics } from '../data/sampleData';

const iconMap = {
  Monitor, 
  Boxes, 
  ArrowLeftRight, 
  Shield, 
  Layers, 
  ArrowDownUp, 
  Cpu,
  Calculator, 
  X, 
  Binary, 
  Grid3x3: Grid3X3, 
  Divide, 
  ToggleLeft, 
  Hash
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ConceptsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Section 1: Core Architecture Concepts */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Core Concepts</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Fundamental principles of computer organization and architecture</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {conceptTopics?.map((topic) => {
              const Icon = iconMap[topic.icon] || Cpu;
              return (
                <motion.div 
                  key={topic.id} 
                  variants={itemVariants} 
                  className="p-6 rounded-2xl border border-white/10 border-l-4 border-l-blue-500 backdrop-blur-md hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
                  style={{ background: 'rgba(15,18,35,0.8)' }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{topic.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div 
            className="p-8 rounded-2xl border border-white/10 backdrop-blur-md"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <h4 className="text-white font-semibold mb-6 text-center text-lg">Functional Units Pipeline</h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {['Memory', 'Bus', 'Registers', 'Processor', 'ALU'].map((unit, idx, arr) => (
                <React.Fragment key={unit}>
                  <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-medium whitespace-nowrap backdrop-blur-sm">
                    {unit}
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="text-violet-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: ALU & Processing */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">ALU & Processing</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Arithmetic, logic, and computational operations</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {unit2Topics?.map((topic) => {
              const Icon = iconMap[topic.icon] || Calculator;
              return (
                <Link to="/alu" key={topic.id} className="block group">
                  <motion.div 
                    variants={itemVariants} 
                    className="p-6 rounded-2xl h-full flex flex-col relative overflow-hidden border border-white/10 backdrop-blur-md hover:border-violet-500/40 transition-all duration-300"
                    style={{ background: 'rgba(15,18,35,0.8)' }}
                  >
                    <div className="flex items-start space-x-4 flex-grow">
                      <div className="p-3 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">{topic.description}</p>
                      </div>
                    </div>
                    <div className="mt-auto text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-violet-400 text-sm font-medium flex justify-end items-center group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        </section>

        {/* Section 3: Processing Pipeline Summary */}
        <section>
          <div 
            className="p-10 rounded-2xl border border-white/10 backdrop-blur-md"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <h3 className="text-2xl font-bold text-center text-white mb-10">Processing Pipeline Summary</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0 relative">
              {[
                { label: 'DIGITAL LIBRARY', icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
                { label: 'MEMORY', icon: HardDrive, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/30' },
                { label: 'BUS', icon: ArrowLeftRight, color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
                { label: 'REGISTERS', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
                { label: 'PROCESSOR', icon: Cpu, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/15 border-fuchsia-500/30' },
                { label: 'ALU', icon: Hexagon, color: 'text-pink-400', bg: 'bg-pink-500/15 border-pink-500/30' },
                { label: 'RESULT', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
              ].map((node, idx, arr) => (
                <React.Fragment key={node.label}>
                  <div className="flex flex-col items-center z-10 w-24 shrink-0">
                    <div className={`w-12 h-12 rounded-full ${node.bg} flex items-center justify-center mb-3 border backdrop-blur-sm`}>
                      <node.icon className={`w-6 h-6 ${node.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 text-center tracking-wider">{node.label}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="hidden md:block flex-1 h-0.5 bg-white/10 relative connector-line mx-2 min-w-[20px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-60 animate-[pulse_2s_ease-in-out_infinite]"></div>
                    </div>
                  )}
                  {idx < arr.length - 1 && (
                    <div className="md:hidden h-8 w-px bg-white/10 relative connector-line my-2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <p className="text-center text-slate-400 max-w-3xl mx-auto text-sm mt-8">
              The complete data processing pipeline from raw library data to meaningful computed results.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
