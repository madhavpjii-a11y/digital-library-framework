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
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Section 1: Core Architecture Concepts */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Core Concepts</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Fundamental principles of computer organization and architecture</p>
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
                <motion.div key={topic.id} variants={itemVariants} className="bg-white p-6 rounded-xl border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow border-y border-r border-y-slate-200 border-r-slate-200">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{topic.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{topic.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-slate-800 font-semibold mb-6 text-center">Functional Units Pipeline</h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {['Memory', 'Bus', 'Registers', 'Processor', 'ALU'].map((unit, idx, arr) => (
                <React.Fragment key={unit}>
                  <div className="px-6 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium whitespace-nowrap">
                    {unit}
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="text-slate-400">
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
            <h2 className="text-3xl font-bold mb-4 text-slate-900">ALU & Processing</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Arithmetic, logic, and computational operations</p>
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
                  <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl h-full flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                    <div className="flex items-start space-x-4 flex-grow">
                      <div className="p-3 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{topic.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">{topic.description}</p>
                      </div>
                    </div>
                    <div className="mt-auto text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-600 text-sm font-medium flex justify-end items-center">
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
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-10">Processing Pipeline Summary</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0 relative">
              {[
                { label: 'DIGITAL LIBRARY', icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'MEMORY', icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'BUS', icon: ArrowLeftRight, color: 'text-violet-600', bg: 'bg-violet-50' },
                { label: 'REGISTERS', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'PROCESSOR', icon: Cpu, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
                { label: 'ALU', icon: Hexagon, color: 'text-pink-600', bg: 'bg-pink-50' },
                { label: 'RESULT', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((node, idx, arr) => (
                <React.Fragment key={node.label}>
                  <div className="flex flex-col items-center z-10 w-24 shrink-0">
                    <div className={`w-12 h-12 rounded-full ${node.bg} flex items-center justify-center mb-3 shadow-sm border border-slate-100`}>
                      <node.icon className={`w-6 h-6 ${node.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 text-center tracking-wider">{node.label}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="hidden md:block flex-1 h-0.5 bg-slate-200 relative connector-line mx-2 min-w-[20px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 animate-[pulse_2s_ease-in-out_infinite]"></div>
                    </div>
                  )}
                  {idx < arr.length - 1 && (
                    <div className="md:hidden h-8 w-px bg-slate-200 relative connector-line my-2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <p className="text-center text-slate-600 max-w-3xl mx-auto text-sm mt-8">
              The complete data processing pipeline from raw library data to meaningful computed results.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
