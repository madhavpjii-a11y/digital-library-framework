import React from 'react';
import { motion } from 'framer-motion';
import { Info, PlayCircle, Eye, Cpu, BookOpen, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      title: 'Interactive Simulations',
      description: 'Run step-by-step simulations of digital library transactions as they move through computer memory and processing units.',
      icon: PlayCircle,
      color: '#4f46e5'
    },
    {
      title: 'Visual Pipeline',
      description: 'Observe the flow of data packets moving from main memory across the system bus into CPU registers.',
      icon: Eye,
      color: '#9333ea'
    },
    {
      title: 'Real-time Processing',
      description: 'Watch the ALU process book loans and returns with real-time updates to register states and memory cells.',
      icon: Cpu,
      color: '#16a34a'
    },
    {
      title: 'Educational Platform',
      description: 'A conceptual framework designed to help visualize complex computer architecture concepts using a familiar library analogy.',
      icon: BookOpen,
      color: '#ca8a04'
    }
  ];

  const pipelineFlow = ['MEMORY', 'BUS', 'REGISTERS', 'PROCESSOR', 'ALU', 'RESULT'];

  return (
    <div className="min-h-screen text-slate-900 pt-24 px-4 pb-12 relative bg-slate-50">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="section-title flex items-center gap-3 text-3xl font-bold text-slate-900 mb-2">
            <Info className="text-[#4f46e5]" />
            About This Framework
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4f46e5] to-transparent rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 md:p-10 rounded-2xl mb-10 border border-slate-200 shadow-sm"
        >
          <motion.p variants={itemVariants} className="text-xl text-slate-700 leading-relaxed mb-10">
            This project presents an interactive conceptual framework for understanding how digital-library information can be stored, transferred and processed using fundamental computer-architecture concepts.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100" style={{ color: feature.color }}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{feature.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white p-6 rounded-xl flex flex-col items-center border border-slate-200 shadow-sm"
        >
          <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-6 font-semibold">Data Flow Pipeline</h3>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {pipelineFlow.map((stage, index) => (
              <React.Fragment key={stage}>
                <div className="px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-xs md:text-sm">
                  {stage}
                </div>
                {index < pipelineFlow.length - 1 && (
                  <ArrowRight size={16} className="text-slate-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
