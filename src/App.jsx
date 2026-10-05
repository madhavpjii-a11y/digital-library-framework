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
      <div className="min-h-screen relative">
        {/* Decorative gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-violet-200/40 to-indigo-200/30 blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-pink-200/20 to-rose-200/15 blur-3xl" />
        </div>
        <Navbar />
        <main className="pt-16 relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/bus" element={<BusPage />} />
            <Route path="/registers" element={<RegistersPage />} />
            <Route path="/processor" element={<ProcessorPage />} />
            <Route path="/alu" element={<ALUPage />} />
            <Route path="/simulations" element={<SimulationsPage />} />
            <Route path="/concepts" element={<ConceptsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/books" element={<BookManagementPage />} />
          </Routes>
        </main>
      </div>
    </SimulationProvider>
  );
}
