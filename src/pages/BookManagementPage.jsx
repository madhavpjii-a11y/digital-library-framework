import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Filter, MapPin, 
  CheckCircle, XCircle, Undo2, ChevronDown, ChevronUp, X 
} from 'lucide-react';
import { books as initialBooks } from '../data/sampleData';

const shelves = ['A-1','A-2','A-3','A-4','A-5','B-1','B-2','B-3','B-4','B-5','C-1','C-2','C-3','C-4','C-5'];

const booksWithShelves = initialBooks.map((b, i) => ({
  ...b, 
  id: b.id || `B${String(i+1).padStart(3, '0')}`,
  shelf: shelves[i % shelves.length], 
  totalCopies: b.totalCopies || 5,
  issuedCopies: b.issuedCopies || 0
}));

export default function BookManagementPage() {
  const [books, setBooks] = useState(booksWithShelves);
  const [searchQuery, setSearchQuery] = useState('');
  const [shelfFilter, setShelfFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add form state
  const [newBook, setNewBook] = useState({
    title: '', author: '', category: 'Computer Science', totalCopies: 1, shelf: 'A-1'
  });

  // Issue modal state
  const [issueModal, setIssueModal] = useState({ isOpen: false, bookId: null, memberName: '' });

  const handleAddBook = (e) => {
    e.preventDefault();
    const newId = `B${String(books.length + 1).padStart(3, '0')}`;
    const bookToAdd = {
      ...newBook,
      id: newId,
      issuedCopies: 0,
      totalCopies: parseInt(newBook.totalCopies, 10)
    };
    setBooks([...books, bookToAdd]);
    setTransactions([{
      id: Date.now(),
      date: new Date().toLocaleString(),
      bookTitle: bookToAdd.title,
      action: 'Added Book',
      member: 'Admin'
    }, ...transactions]);
    setShowAddForm(false);
    setNewBook({ title: '', author: '', category: 'Computer Science', totalCopies: 1, shelf: 'A-1' });
  };

  const openIssueModal = (bookId) => {
    setIssueModal({ isOpen: true, bookId, memberName: '' });
  };

  const handleIssueBook = (e) => {
    e.preventDefault();
    const { bookId, memberName } = issueModal;
    setBooks(books.map(b => {
      if (b.id === bookId && b.issuedCopies < b.totalCopies) {
        setTransactions([{
          id: Date.now(),
          date: new Date().toLocaleString(),
          bookTitle: b.title,
          action: 'Issued',
          member: memberName
        }, ...transactions]);
        return { ...b, issuedCopies: b.issuedCopies + 1 };
      }
      return b;
    }));
    setIssueModal({ isOpen: false, bookId: null, memberName: '' });
  };

  const handleReturnBook = (book) => {
    setBooks(books.map(b => {
      if (b.id === book.id && b.issuedCopies > 0) {
        setTransactions([{
          id: Date.now(),
          date: new Date().toLocaleString(),
          bookTitle: b.title,
          action: 'Returned',
          member: 'Unknown' // Ideally would track who returned it
        }, ...transactions]);
        return { ...b, issuedCopies: b.issuedCopies - 1 };
      }
      return b;
    }));
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShelf = shelfFilter === 'All' || b.shelf === shelfFilter;
    let matchesAvail = true;
    if (availFilter === 'Available') matchesAvail = (b.totalCopies - b.issuedCopies) > 0;
    if (availFilter === 'All Issued') matchesAvail = (b.totalCopies - b.issuedCopies) === 0;
    
    return matchesSearch && matchesShelf && matchesAvail;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
          <BookOpen className="text-indigo-600 w-8 h-8" />
          Book Management
        </h1>
        <p className="text-slate-600 mt-2">Track books, issues, returns and shelf locations</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          
          {/* Top Actions & Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm w-full md:w-auto justify-center"
            >
              {showAddForm ? <X size={18} /> : <Plus size={18} />}
              {showAddForm ? 'Cancel' : 'Add Book'}
            </button>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-grow justify-end">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search title, author, or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800 shadow-sm"
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  value={shelfFilter}
                  onChange={(e) => setShelfFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800 shadow-sm flex-grow md:flex-grow-0"
                >
                  <option value="All">All Shelves</option>
                  {shelves.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                
                <select 
                  value={availFilter}
                  onChange={(e) => setAvailFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800 shadow-sm flex-grow md:flex-grow-0"
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="All Issued">All Issued</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Book Form (Collapsible) */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Plus className="text-indigo-500 w-5 h-5" /> Add New Book
                  </h3>
                  <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                      <input required type="text" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800" />
                    </div>
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-slate-600 mb-1">Author</label>
                      <input required type="text" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800" />
                    </div>
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                      <select value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800">
                        <option value="Computer Science">Computer Science</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Literature">Literature</option>
                      </select>
                    </div>
                    <div className="lg:col-span-1 flex gap-2">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Copies</label>
                        <input required type="number" min="1" value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800" />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Shelf</label>
                        <select value={newBook.shelf} onChange={e => setNewBook({...newBook, shelf: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 bg-slate-50 text-slate-800">
                          {shelves.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="lg:col-span-5 flex justify-end mt-2">
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
                        Save Book
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Books Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Author</th>
                    <th className="p-4 font-semibold text-center">Shelf</th>
                    <th className="p-4 font-semibold text-center">Avail/Total</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredBooks.length > 0 ? filteredBooks.map((book) => {
                      const available = book.totalCopies - book.issuedCopies;
                      const isAvail = available > 0;
                      return (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={book.id} 
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4 font-mono text-slate-500">{book.id}</td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">{book.title}</div>
                            <div className="text-xs text-slate-500">{book.category}</div>
                          </td>
                          <td className="p-4 text-slate-600">{book.author}</td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                              <MapPin size={12} className="mr-1" /> {book.shelf}
                            </span>
                          </td>
                          <td className="p-4 text-center font-mono">
                            <span className={isAvail ? 'text-emerald-600 font-bold' : 'text-red-500'}>{available}</span>
                            <span className="text-slate-400">/{book.totalCopies}</span>
                          </td>
                          <td className="p-4">
                            {isAvail ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                                <CheckCircle size={12} /> Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                                <XCircle size={12} /> All Issued
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button 
                              onClick={() => openIssueModal(book.id)}
                              disabled={!isAvail}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${isAvail ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'}`}
                            >
                              Issue
                            </button>
                            <button 
                              onClick={() => handleReturnBook(book)}
                              disabled={book.issuedCopies === 0}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${book.issuedCopies > 0 ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'}`}
                            >
                              Return
                            </button>
                          </td>
                        </motion.tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500 italic">No books found matching the criteria.</td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Shelf Locator Grid */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="text-indigo-500 w-5 h-5" />
              Shelf Locator
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['A', 'B', 'C'].map(row => (
                <div key={row} className="col-span-3 grid grid-cols-5 gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(col => {
                    const s = `${row}-${col}`;
                    const count = books.filter(b => b.shelf === s).length;
                    const isSelected = shelfFilter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setShelfFilter(isSelected ? 'All' : s)}
                        className={`p-2 flex flex-col items-center justify-center rounded-lg border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm ring-1 ring-indigo-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        title={`${count} books`}
                      >
                        <span className="text-xs font-bold">{s}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-500 text-center">Click a shelf to filter the table</div>
          </div>

          {/* Transaction Log */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-md font-bold text-slate-200 mb-3 flex items-center border-b border-slate-800 pb-2">
              <Undo2 className="text-indigo-400 w-4 h-4 mr-2" />
              Recent Transactions
            </h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-3 font-mono text-xs">
              {transactions.length > 0 ? transactions.map(t => (
                <div key={t.id} className="border-l-2 border-indigo-500 pl-3 py-1">
                  <div className="text-indigo-300">{t.date}</div>
                  <div className="text-slate-300 my-1 truncate" title={t.bookTitle}>{t.bookTitle}</div>
                  <div className="flex justify-between">
                    <span className={t.action === 'Issued' ? 'text-amber-400' : t.action === 'Returned' ? 'text-emerald-400' : 'text-blue-400'}>
                      [{t.action}]
                    </span>
                    <span className="text-slate-500">{t.member}</span>
                  </div>
                </div>
              )) : (
                <div className="text-slate-600 italic mt-4 text-center">No recent transactions</div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Issue Book Modal */}
      <AnimatePresence>
        {issueModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800">Issue Book</h3>
                <button onClick={() => setIssueModal({ isOpen: false, bookId: null, memberName: '' })} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleIssueBook} className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-4">
                    Issuing: <strong className="text-slate-800">{books.find(b => b.id === issueModal.bookId)?.title}</strong>
                  </p>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Member Name / ID</label>
                  <input 
                    required 
                    type="text" 
                    autoFocus
                    value={issueModal.memberName} 
                    onChange={e => setIssueModal({...issueModal, memberName: e.target.value})} 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white text-slate-800 shadow-sm"
                    placeholder="Enter member details..."
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIssueModal({ isOpen: false, bookId: null, memberName: '' })}
                    className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                  >
                    Confirm Issue
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
