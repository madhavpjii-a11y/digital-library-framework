import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Search, Filter, MapPin,
  CheckCircle, XCircle, Undo2, ChevronDown, ChevronUp, X,
  BookMarked, Hash, Calendar, Building, FileText, Tag, Eye, ArrowUpDown
} from 'lucide-react';
import { bookDatabase, categories, shelves, publishers } from '../data/bookDatabase';

export default function BookManagementPage() {
  const [books, setBooks] = useState(bookDatabase);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [shelfFilter, setShelfFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState('asc');
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // Add form state
  const [newBook, setNewBook] = useState({
    title: '', author: '', category: 'Computer Science', totalCopies: 1, shelf: 'A-1',
    isbn: '', publisher: '', year: 2024, description: ''
  });

  // Issue modal state
  const [issueModal, setIssueModal] = useState({ isOpen: false, bookId: null, memberName: '' });

  // Search across multiple fields including tags, ISBN, description
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = books.filter(b => {
      const matchesSearch = !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.isbn && b.isbn.toLowerCase().includes(q)) ||
        (b.publisher && b.publisher.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some(tag => tag.toLowerCase().includes(q)));

      const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
      const matchesShelf = shelfFilter === 'All' || b.shelf === shelfFilter;
      let matchesAvail = true;
      if (availFilter === 'Available') matchesAvail = (b.totalCopies - b.issuedCopies) > 0;
      if (availFilter === 'All Issued') matchesAvail = (b.totalCopies - b.issuedCopies) === 0;

      return matchesSearch && matchesCat && matchesShelf && matchesAvail;
    });

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'title') { valA = a.title.toLowerCase(); valB = b.title.toLowerCase(); }
      else if (sortBy === 'author') { valA = a.author.toLowerCase(); valB = b.author.toLowerCase(); }
      else if (sortBy === 'year') { valA = a.year || 0; valB = b.year || 0; }
      else if (sortBy === 'available') { valA = a.totalCopies - a.issuedCopies; valB = b.totalCopies - b.issuedCopies; }
      else { valA = a.title.toLowerCase(); valB = b.title.toLowerCase(); }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [books, searchQuery, categoryFilter, shelfFilter, availFilter, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  // Stats
  const stats = useMemo(() => ({
    total: books.length,
    available: books.filter(b => (b.totalCopies - b.issuedCopies) > 0).length,
    issued: books.reduce((sum, b) => sum + b.issuedCopies, 0),
    categories: [...new Set(books.map(b => b.category))].length,
  }), [books]);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setCurrentPage(1);
  };

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const maxNum = Math.max(...books.map(b => parseInt(b.id.replace('B', ''), 10)), 0);
    const newId = `B${String(maxNum + 1).padStart(3, '0')}`;
    const bookToAdd = {
      ...newBook, id: newId, issuedCopies: 0,
      totalCopies: parseInt(newBook.totalCopies, 10),
      year: parseInt(newBook.year, 10),
      tags: newBook.title.toLowerCase().split(' ').filter(w => w.length > 3),
      language: 'English', pages: 0, edition: '1st'
    };
    setBooks([bookToAdd, ...books]);
    setTransactions([{
      id: Date.now(), date: new Date().toLocaleString(),
      bookTitle: bookToAdd.title, action: 'Added', member: 'Admin'
    }, ...transactions]);
    setShowAddForm(false);
    setNewBook({ title: '', author: '', category: 'Computer Science', totalCopies: 1, shelf: 'A-1', isbn: '', publisher: '', year: 2024, description: '' });
  };

  const openIssueModal = (bookId) => setIssueModal({ isOpen: true, bookId, memberName: '' });

  const handleIssueBook = (e) => {
    e.preventDefault();
    const { bookId, memberName } = issueModal;
    setBooks(books.map(b => {
      if (b.id === bookId && b.issuedCopies < b.totalCopies) {
        setTransactions(prev => [{
          id: Date.now(), date: new Date().toLocaleString(),
          bookTitle: b.title, action: 'Issued', member: memberName
        }, ...prev]);
        return { ...b, issuedCopies: b.issuedCopies + 1 };
      }
      return b;
    }));
    setIssueModal({ isOpen: false, bookId: null, memberName: '' });
  };

  const handleReturnBook = (book) => {
    setBooks(books.map(b => {
      if (b.id === book.id && b.issuedCopies > 0) {
        setTransactions(prev => [{
          id: Date.now(), date: new Date().toLocaleString(),
          bookTitle: b.title, action: 'Returned', member: '—'
        }, ...prev]);
        return { ...b, issuedCopies: b.issuedCopies - 1 };
      }
      return b;
    }));
  };

  const SortHeader = ({ field, children }) => (
    <th
      className="p-3 font-semibold cursor-pointer hover:text-violet-300 transition-colors select-none"
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortBy === field && (
          <ArrowUpDown size={12} className={`text-violet-400 ${sortDir === 'desc' ? 'rotate-180' : ''} transition-transform`} />
        )}
      </span>
    </th>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen text-slate-100 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title text-3xl flex items-center gap-3">
          <BookOpen className="text-violet-400 w-8 h-8" />
          <span className="gradient-text">Library Database</span>
        </h1>
        <p className="text-slate-400 mt-1">Search, browse, and manage {stats.total} books across {stats.categories} categories</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Books', value: stats.total, colorClass: 'text-violet-400', bgClass: 'bg-[rgba(139,92,246,0.15)] border-violet-500/20', icon: BookMarked },
          { label: 'Available', value: stats.available, colorClass: 'text-emerald-400', bgClass: 'bg-[rgba(16,185,129,0.15)] border-emerald-500/20', icon: CheckCircle },
          { label: 'Copies Issued', value: stats.issued, colorClass: 'text-amber-400', bgClass: 'bg-[rgba(245,158,11,0.15)] border-amber-500/20', icon: FileText },
          { label: 'Categories', value: stats.categories, colorClass: 'text-purple-400', bgClass: 'bg-[rgba(168,85,247,0.15)] border-purple-500/20', icon: Tag },
        ].map(s => (
          <div 
            key={s.label} 
            className="border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-md"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <div className={`p-3 rounded-xl border ${s.bgClass}`}>
              <s.icon className={`w-5 h-5 ${s.colorClass}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">

          {/* Search & Filters */}
          <div 
            className="border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-md"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, author, ISBN, keyword, or description..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-11 pr-4 py-2.5 border border-white/10 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 bg-black/40 text-white placeholder-slate-500 transition-all text-sm"
                />
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary whitespace-nowrap"
              >
                {showAddForm ? <X size={16} /> : <Plus size={16} />}
                {showAddForm ? 'Cancel' : 'Add Book'}
              </button>
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={14} className="text-slate-400" />
              <select 
                value={categoryFilter} 
                onChange={(e) => handleFilterChange(setCategoryFilter)(e.target.value)}
                className="px-3 py-1.5 border border-white/10 rounded-xl text-sm outline-none focus:border-violet-400 bg-black/40 text-slate-200"
              >
                <option value="All" className="bg-[#0f1223] text-white">All Categories</option>
                {categories.map(c => <option key={c} value={c} className="bg-[#0f1223] text-white">{c}</option>)}
              </select>
              <select 
                value={shelfFilter} 
                onChange={(e) => handleFilterChange(setShelfFilter)(e.target.value)}
                className="px-3 py-1.5 border border-white/10 rounded-xl text-sm outline-none focus:border-violet-400 bg-black/40 text-slate-200"
              >
                <option value="All" className="bg-[#0f1223] text-white">All Shelves</option>
                {shelves.map(s => <option key={s} value={s} className="bg-[#0f1223] text-white">{s}</option>)}
              </select>
              <select 
                value={availFilter} 
                onChange={(e) => handleFilterChange(setAvailFilter)(e.target.value)}
                className="px-3 py-1.5 border border-white/10 rounded-xl text-sm outline-none focus:border-violet-400 bg-black/40 text-slate-200"
              >
                <option value="All" className="bg-[#0f1223] text-white">All Status</option>
                <option value="Available" className="bg-[#0f1223] text-white">Available</option>
                <option value="All Issued" className="bg-[#0f1223] text-white">All Issued</option>
              </select>
              {(searchQuery || categoryFilter !== 'All' || shelfFilter !== 'All' || availFilter !== 'All') && (
                <button 
                  onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setShelfFilter('All'); setAvailFilter('All'); setCurrentPage(1); }}
                  className="text-xs text-violet-400 hover:text-violet-300 underline ml-1"
                >
                  Clear filters
                </button>
              )}
              <span className="ml-auto text-sm text-slate-400">{filteredBooks.length} results</span>
            </div>
          </div>

          {/* Add Book Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div 
                  className="border border-white/10 rounded-2xl p-5 mb-2 backdrop-blur-md"
                  style={{ background: 'rgba(15,18,35,0.8)' }}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Plus className="text-violet-400 w-5 h-5" /> Add New Book
                  </h3>
                  <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                      <input required type="text" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white placeholder-slate-500" placeholder="Book title" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Author *</label>
                      <input required type="text" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white placeholder-slate-500" placeholder="Author name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">ISBN</label>
                      <input type="text" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white placeholder-slate-500" placeholder="978-0-xxx-xxxxx-x" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                      <select value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white">
                        {categories.map(c => <option key={c} value={c} className="bg-[#0f1223] text-white">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Publisher</label>
                      <input type="text" value={newBook.publisher} onChange={e => setNewBook({...newBook, publisher: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white placeholder-slate-500" placeholder="Publisher" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-300 mb-1">Copies</label>
                        <input required type="number" min="1" value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-300 mb-1">Shelf</label>
                        <select value={newBook.shelf} onChange={e => setNewBook({...newBook, shelf: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white">
                          {shelves.map(s => <option key={s} value={s} className="bg-[#0f1223] text-white">{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
                      <input type="number" min="1900" max="2030" value={newBook.year} onChange={e => setNewBook({...newBook, year: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white" />
                    </div>
                    <div className="lg:col-span-4 flex justify-end mt-2">
                      <button type="submit" className="btn-primary">Save Book</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Books Table */}
          <div 
            className="border border-white/10 rounded-2xl p-0 overflow-hidden backdrop-blur-md"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300 border-b border-white/10">
                  <tr>
                    <th className="p-3 font-semibold w-16">ID</th>
                    <SortHeader field="title">Title</SortHeader>
                    <SortHeader field="author">Author</SortHeader>
                    <th className="p-3 font-semibold text-center">Shelf</th>
                    <SortHeader field="available">Avail</SortHeader>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedBooks.length > 0 ? paginatedBooks.map((book) => {
                    const available = book.totalCopies - book.issuedCopies;
                    const isAvail = available > 0;
                    return (
                      <tr key={book.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-3 font-mono text-xs text-slate-500">{book.id}</td>
                        <td className="p-3">
                          <button onClick={() => setSelectedBook(book)} className="text-left group-hover:text-violet-300 transition-colors">
                            <div className="font-semibold text-white">{book.title}</div>
                            <div className="text-xs text-slate-400">{book.category}{book.year ? ` · ${book.year}` : ''}</div>
                          </button>
                        </td>
                        <td className="p-3 text-slate-300 text-sm">{book.author}</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 bg-white/5 text-slate-300 rounded-lg text-xs font-medium border border-white/10">
                            <MapPin size={10} className="mr-1 text-violet-400" /> {book.shelf}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono text-sm">
                          <span className={isAvail ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{available}</span>
                          <span className="text-slate-500">/{book.totalCopies}</span>
                        </td>
                        <td className="p-3">
                          {isAvail ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                              <CheckCircle size={10} /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-300 bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                              <XCircle size={10} /> Issued
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button onClick={() => setSelectedBook(book)} className="p-1.5 rounded-lg text-slate-400 hover:text-violet-300 hover:bg-white/5 transition-colors" title="View details">
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => openIssueModal(book.id)} 
                              disabled={!isAvail}
                              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors border ${isAvail ? 'bg-violet-500/20 text-violet-300 border-violet-500/30 hover:bg-violet-500/30' : 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'}`}
                            >
                              Issue
                            </button>
                            <button 
                              onClick={() => handleReturnBook(book)} 
                              disabled={book.issuedCopies === 0}
                              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors border ${book.issuedCopies > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30' : 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'}`}
                            >
                              Return
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-slate-500">
                        <Search size={32} className="mx-auto mb-2 text-slate-600" />
                        <div className="font-medium text-slate-300">No books found</div>
                        <div className="text-xs mt-1 text-slate-500">Try a different search term or clear filters</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.02]">
                <span className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3 py-1 rounded-xl text-sm border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
                  >
                    Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;
                    return (
                      <button 
                        key={page} 
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-xl text-sm border transition-all ${currentPage === page ? 'bg-violet-600 text-white border-violet-600 shadow-[0_0_12px_rgba(139,92,246,0.4)]' : 'border-white/10 hover:bg-white/5 text-slate-300'}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1 rounded-xl text-sm border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Shelf Locator */}
          <div 
            className="border border-white/10 rounded-2xl p-5 backdrop-blur-md"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <MapPin className="text-violet-400 w-4 h-4" /> Shelf Locator
            </h3>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D', 'E'].map(row => (
                <div key={row} className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map(col => {
                    const s = `${row}-${col}`;
                    const count = books.filter(b => b.shelf === s).length;
                    const isSelected = shelfFilter === s;
                    return (
                      <button 
                        key={s} 
                        onClick={() => handleFilterChange(setShelfFilter)(isSelected ? 'All' : s)}
                        className={`p-1.5 flex flex-col items-center rounded-xl border transition-all text-center ${isSelected ? 'bg-violet-500/20 border-violet-400 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.2)] ring-1 ring-violet-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}`}
                      >
                        <span className="text-[10px] font-bold leading-none">{s}</span>
                        <span className={`text-[9px] leading-none mt-1 ${isSelected ? 'text-violet-400' : 'text-slate-500'}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px] text-slate-500 text-center">Click a shelf to filter</div>
          </div>

          {/* Category Stats */}
          <div 
            className="border border-white/10 rounded-2xl p-5 backdrop-blur-md"
            style={{ background: 'rgba(15,18,35,0.8)' }}
          >
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Tag className="text-violet-400 w-4 h-4" /> By Category
            </h3>
            <div className="space-y-1.5">
              {categories.map(cat => {
                const count = books.filter(b => b.category === cat).length;
                const isSelected = categoryFilter === cat;
                return (
                  <button 
                    key={cat} 
                    onClick={() => handleFilterChange(setCategoryFilter)(isSelected ? 'All' : cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${isSelected ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'}`}
                  >
                    <span className="truncate">{cat}</span>
                    <span className={`font-mono font-bold ${isSelected ? 'text-violet-400' : 'text-slate-500'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction Log */}
          <div 
            className="p-4 rounded-2xl border border-white/10 flex flex-col h-[320px] backdrop-blur-md"
            style={{ background: 'rgba(11,13,23,0.9)' }}
          >
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
              <Undo2 className="text-violet-400 w-3.5 h-3.5" /> Recent Activity
            </h3>
            <div className="flex-grow overflow-y-auto space-y-2 font-mono text-[11px]">
              {transactions.length > 0 ? transactions.slice(0, 20).map(t => (
                <div key={t.id} className="border-l-2 border-violet-500 pl-2.5 py-0.5">
                  <div className="text-slate-500">{t.date}</div>
                  <div className="text-slate-300 truncate" title={t.bookTitle}>{t.bookTitle}</div>
                  <span className={t.action === 'Issued' ? 'text-amber-400' : t.action === 'Returned' ? 'text-emerald-400' : 'text-blue-400'}>
                    [{t.action}]
                  </span>
                  <span className="text-slate-500 ml-1">{t.member}</span>
                </div>
              )) : (
                <div className="text-slate-600 italic text-center mt-8">No activity yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedBook(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden backdrop-blur-xl shadow-2xl"
              style={{ background: 'rgba(15,18,35,0.95)' }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-violet-900/60 via-purple-900/50 to-indigo-900/40">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedBook.title}</h3>
                  <p className="text-sm text-violet-300">{selectedBook.author}</p>
                </div>
                <button onClick={() => setSelectedBook(null)} className="text-slate-400 hover:text-white mt-1 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Hash, label: 'ID', value: selectedBook.id },
                    { icon: Tag, label: 'Category', value: selectedBook.category },
                    { icon: BookMarked, label: 'ISBN', value: selectedBook.isbn || '—' },
                    { icon: Building, label: 'Publisher', value: selectedBook.publisher || '—' },
                    { icon: Calendar, label: 'Year', value: selectedBook.year || '—' },
                    { icon: FileText, label: 'Edition', value: selectedBook.edition || '—' },
                    { icon: MapPin, label: 'Shelf', value: selectedBook.shelf },
                    { icon: BookOpen, label: 'Pages', value: selectedBook.pages || '—' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <item.icon size={14} className="text-violet-400 flex-shrink-0" />
                      <span className="text-slate-400">{item.label}:</span>
                      <span className="font-medium text-slate-200 truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
                {selectedBook.description && (
                  <div className="bg-white/5 rounded-xl p-4 text-sm text-slate-300 border border-white/10 leading-relaxed">
                    {selectedBook.description}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-slate-400">Available: </span>
                    <span className={`font-bold ${(selectedBook.totalCopies - selectedBook.issuedCopies) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedBook.totalCopies - selectedBook.issuedCopies}
                    </span>
                    <span className="text-slate-500"> / {selectedBook.totalCopies}</span>
                  </div>
                  {selectedBook.tags && selectedBook.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-auto">
                      {selectedBook.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 bg-violet-500/15 text-violet-300 rounded-full text-[10px] font-medium border border-violet-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Issue Book Modal */}
      <AnimatePresence>
        {issueModal.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="rounded-2xl border border-white/10 w-full max-w-md overflow-hidden backdrop-blur-xl shadow-2xl"
              style={{ background: 'rgba(15,18,35,0.95)' }}
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-bold text-white">Issue Book</h3>
                <button onClick={() => setIssueModal({ isOpen: false, bookId: null, memberName: '' })} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleIssueBook} className="p-6">
                <p className="text-sm text-slate-300 mb-4">
                  Issuing: <strong className="text-violet-300">{books.find(b => b.id === issueModal.bookId)?.title}</strong>
                </p>
                <label className="block text-sm font-medium text-slate-300 mb-1">Member Name / ID</label>
                <input required type="text" autoFocus value={issueModal.memberName}
                  onChange={e => setIssueModal({...issueModal, memberName: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-sm outline-none focus:border-violet-400 bg-black/40 text-white placeholder-slate-500" placeholder="Enter member details..." />
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIssueModal({ isOpen: false, bookId: null, memberName: '' })}
                    className="px-4 py-2 rounded-xl font-medium text-slate-300 hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" className="btn-primary">Confirm Issue</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
