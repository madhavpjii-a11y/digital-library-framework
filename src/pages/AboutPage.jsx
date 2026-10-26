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
      color: '#8b5cf6'
    },
    {
      title: 'Visual Pipeline',
      description: 'Observe the flow of data packets moving from main memory across the system bus into CPU registers.',
      icon: Eye,
      color: '#a855f7'
    },
    {
      title: 'Real-time Processing',
      description: 'Watch the ALU process book loans and returns with real-time updates to register states and memory cells.',
      icon: Cpu,
      color: '#10b981'
    },
    {
      title: 'Educational Platform',
      description: 'A conceptual framework designed to help visualize complex computer architecture concepts using a familiar library analogy.',
      icon: BookOpen,
      color: '#f59e0b'
    }
  ];

  const pipelineFlow = ['MEMORY', 'BUS', 'REGISTERS', 'PROCESSOR', 'ALU', 'RESULT'];

  return (
    <div className="min-h-screen text-slate-200 pt-24 px-4 pb-12 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="section-title flex items-center gap-3 text-3xl font-bold text-white mb-2">
            <Info className="text-violet-400" />
            About This Framework
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-transparent rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 md:p-10 rounded-2xl mb-10 border border-white/10 backdrop-blur-xl shadow-2xl"
          style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <motion.p variants={itemVariants} className="text-xl text-slate-300 leading-relaxed mb-10 font-light">
            This project presents an interactive conceptual framework for understanding how digital-library information can be stored, transferred and processed using fundamental computer-architecture concepts.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index} 
                  variants={itemVariants} 
                  className="p-5 rounded-xl border border-white/10 hover:border-violet-500/30 transition-all duration-300 hover:scale-[1.02] backdrop-blur-md"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div 
                      className="p-2.5 rounded-lg border border-white/10" 
                      style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-white">{feature.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
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
          className="p-6 rounded-xl flex flex-col items-center border border-white/10 backdrop-blur-md shadow-xl"
          style={{ background: 'rgba(15, 18, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-6 font-semibold">Data Flow Pipeline</h3>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {pipelineFlow.map((stage, index) => (
              <React.Fragment key={stage}>
                <div className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-xs md:text-sm shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                  {stage}
                </div>
                {index < pipelineFlow.length - 1 && (
                  <ArrowRight size={16} className="text-slate-600" />
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
