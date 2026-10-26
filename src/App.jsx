import { Routes, Route } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import ArchitecturePage from './pages/ArchitecturePage';
import MemoryPage from './pages/MemoryPage';
import BusPage from './pages/BusPage';
import RegistersPage from './pages/RegistersPage';
import ProcessorPage from './pages/ProcessorPage';
import ALUPage from './pages/ALUPage';
import SimulationsPage from './pages/SimulationsPage';
import ConceptsPage from './pages/ConceptsPage';
import AboutPage from './pages/AboutPage';
import BookManagementPage from './pages/BookManagementPage';

export default function App() {
  return (
    <SimulationProvider>
      <div className="min-h-screen relative bg-[#0b0d17]">
        {/* Animated gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30" style={{background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite'}} />
          <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full opacity-20" style={{background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite 2s'}} />
          <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] rounded-full opacity-20" style={{background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)', animation: 'float 12s ease-in-out infinite 4s'}} />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-grid opacity-50" />
        </div>
        <Navbar />
        <main className="pt-16 relative z-10">
          <Routes>
            <Route path="/" element={<BookManagementPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/bus" element={<BusPage />} />
            <Route path="/registers" element={<RegistersPage />} />
            <Route path="/processor" element={<ProcessorPage />} />
            <Route path="/alu" element={<ALUPage />} />
            <Route path="/simulations" element={<SimulationsPage />} />
            <Route path="/concepts" element={<ConceptsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/books" element={<BookManagementPage />} /> {/* Also accessible via /books */}
          </Routes>
        </main>
      </div>
    </SimulationProvider>
  );
}
