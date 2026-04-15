/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  UserCircle, 
  Settings, 
  Search, 
  PlusCircle, 
  Trash2, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Home,
  Users,
  FileText,
  LayoutDashboard
} from 'lucide-react';

// Types
interface StudentResult {
  id: string;
  name: string;
  rollNumber: string;
  marks: number;
  className: string;
  grade: string;
  timestamp: number;
}

type View = 'home' | 'student' | 'teacher' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedResults = localStorage.getItem('jamia_results');
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (e) {
        console.error("Failed to parse results from localStorage", e);
      }
    }
  }, []);

  // Save data to localStorage
  const saveResults = (newResults: StudentResult[]) => {
    setResults(newResults);
    localStorage.setItem('jamia_results', JSON.stringify(newResults));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const calculateGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  // Views
  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Students" 
          value={results.length.toString()} 
        />
        <StatCard 
          label="Recent Results" 
          value={results.filter(r => Date.now() - r.timestamp < 86400000 * 7).length.toString()} 
        />
        <StatCard 
          label="Success Rate" 
          value={results.length > 0 ? `${((results.filter(r => r.marks >= 50).length / results.length) * 100).toFixed(1)}%` : '0%'} 
        />
      </section>

      {/* Portals Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Search Panel */}
        <div className="bg-surface p-8 rounded-sleek shadow-sleek border border-bg flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-bg">
            <h2 className="text-lg font-semibold">Check Result</h2>
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">Student Access</span>
          </div>
          <div className="space-y-4 flex-1">
            <p className="text-sm text-text-light mb-4">Quickly find your exam results by roll number.</p>
            <button 
              onClick={() => setView('student')}
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Open Student Portal
            </button>
          </div>
        </div>

        {/* Recent Activity Panel */}
        <div className="bg-surface p-8 rounded-sleek shadow-sleek border border-bg flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-bg">
            <h2 className="text-lg font-semibold">Recent Submissions</h2>
            <span className="text-xs text-text-light">Updated recently</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-xs text-text-light uppercase tracking-wider py-2 border-b-2 border-bg">Roll No</th>
                  <th className="text-xs text-text-light uppercase tracking-wider py-2 border-b-2 border-bg">Name</th>
                  <th className="text-xs text-text-light uppercase tracking-wider py-2 border-b-2 border-bg">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg">
                {results.slice(-4).reverse().map((result) => (
                  <tr key={result.id}>
                    <td className="py-4 text-sm font-medium">{result.rollNumber}</td>
                    <td className="py-4 text-sm">{result.name}</td>
                    <td className="py-4 text-sm">
                      <span className="bg-primary-light text-primary px-2 py-1 rounded text-[11px] font-bold">
                        {result.grade}
                      </span>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-text-light italic">No recent activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </motion.div>
  );

  const renderStudentPortal = () => {
    const [searchRoll, setSearchRoll] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchResult, setSearchResult] = useState<StudentResult | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setHasSearched(false);
      
      setTimeout(() => {
        const found = results.find(r => 
          r.rollNumber === searchRoll && 
          r.name.toLowerCase().includes(searchName.toLowerCase())
        );
        setSearchResult(found || null);
        setHasSearched(true);
        setLoading(false);
      }, 800);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-surface p-8 rounded-sleek shadow-sleek border border-bg">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-bg">
            <h2 className="text-xl font-bold">Student Result Portal</h2>
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">Search Results</span>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-light uppercase tracking-wider">Student Full Name</label>
              <input 
                type="text" 
                required
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g. Muhammad Ahmad"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-light uppercase tracking-wider">Roll Number</label>
              <input 
                type="text" 
                required
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value)}
                placeholder="Enter Roll No."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  View Result
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {hasSearched && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-8 pt-8 border-t border-bg"
              >
                {searchResult ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{searchResult.name}</h3>
                        <p className="text-text-light text-sm">Roll No: {searchResult.rollNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-primary-light text-primary px-4 py-2 rounded-lg text-2xl font-black">
                          {searchResult.grade}
                        </span>
                        <p className="text-[10px] uppercase tracking-widest text-text-light mt-2 font-bold">Final Grade</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-bg p-4 rounded-lg">
                        <p className="text-[10px] text-text-light uppercase tracking-wider font-bold mb-1">Class</p>
                        <p className="text-lg font-bold">{searchResult.className}</p>
                      </div>
                      <div className="bg-bg p-4 rounded-lg">
                        <p className="text-[10px] text-text-light uppercase tracking-wider font-bold mb-1">Total Marks</p>
                        <p className="text-lg font-bold">{searchResult.marks} / 100</p>
                      </div>
                    </div>

                    <div className="bg-primary-light text-primary p-4 rounded-lg flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <p className="font-semibold">Result verified. Congratulations on your success!</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 text-center text-sm font-medium">
                    Searching across all departments... No matching record found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const renderTeacherPortal = () => {
    const [formData, setFormData] = useState({
      name: '',
      rollNumber: '',
      marks: '',
      className: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.rollNumber || !formData.marks || !formData.className) {
        showMessage('error', 'Please fill all fields');
        return;
      }

      const newResult: StudentResult = {
        id: Date.now().toString(),
        name: formData.name,
        rollNumber: formData.rollNumber,
        marks: parseInt(formData.marks),
        className: formData.className,
        grade: calculateGrade(parseInt(formData.marks)),
        timestamp: Date.now()
      };

      const existingIndex = results.findIndex(r => r.rollNumber === formData.rollNumber);
      if (existingIndex >= 0) {
        const updatedResults = [...results];
        updatedResults[existingIndex] = newResult;
        saveResults(updatedResults);
        showMessage('success', 'Result updated successfully!');
      } else {
        saveResults([...results, newResult]);
        showMessage('success', 'Result added successfully!');
      }

      setFormData({ name: '', rollNumber: '', marks: '', className: '' });
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-surface p-8 rounded-sleek shadow-sleek border border-bg">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-bg">
            <h2 className="text-xl font-bold">Teacher Portal</h2>
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">Upload Marks</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-light uppercase tracking-wider">Student Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-light uppercase tracking-wider">Roll Number</label>
                <input 
                  type="text" 
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                  placeholder="Roll No."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-light uppercase tracking-wider">Class</label>
                <input 
                  type="text" 
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                  placeholder="e.g. Grade 8"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-light uppercase tracking-wider">Marks (0-100)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.marks}
                  onChange={(e) => setFormData({...formData, marks: e.target.value})}
                  placeholder="Marks"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <PlusCircle className="w-5 h-5" />
              Submit Result
            </button>
          </form>
        </div>
      </motion.div>
    );
  };

  const renderAdminPanel = () => {
    const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to delete this record?')) {
        saveResults(results.filter(r => r.id !== id));
        showMessage('success', 'Record deleted');
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-8"
      >
        <div className="bg-surface p-8 rounded-sleek shadow-sleek border border-bg">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-bg">
            <h2 className="text-xl font-bold">Admin Database</h2>
            <span className="text-xs text-text-light">Full record management</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-xs text-text-light uppercase tracking-wider py-4 border-b-2 border-bg">Roll No</th>
                  <th className="text-xs text-text-light uppercase tracking-wider py-4 border-b-2 border-bg">Student Name</th>
                  <th className="text-xs text-text-light uppercase tracking-wider py-4 border-b-2 border-bg">Class</th>
                  <th className="text-xs text-text-light uppercase tracking-wider py-4 border-b-2 border-bg text-center">Marks</th>
                  <th className="text-xs text-text-light uppercase tracking-wider py-4 border-b-2 border-bg text-center">Grade</th>
                  <th className="text-xs text-text-light uppercase tracking-wider py-4 border-b-2 border-bg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg">
                {results.length > 0 ? (
                  results.map((result) => (
                    <tr key={result.id} className="hover:bg-bg/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-primary">{result.rollNumber}</td>
                      <td className="py-4 text-sm font-medium">{result.name}</td>
                      <td className="py-4 text-sm text-text-light">{result.className}</td>
                      <td className="py-4 text-sm text-center font-bold">{result.marks}</td>
                      <td className="py-4 text-center">
                        <span className="bg-primary-light text-primary px-3 py-1 rounded text-[11px] font-bold">
                          {result.grade}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleDelete(result.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-text-light italic">
                      No records found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-primary text-white flex flex-col p-8 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl shadow-lg">
            J
          </div>
          <div className="text-sm font-bold leading-tight">
            Jamia Makhzan<br />Ul Uloom
          </div>
        </div>
        
        <div className="space-y-2 flex-1">
          <NavItem 
            icon={<Home className="w-5 h-5" />} 
            label="Home Dashboard" 
            active={view === 'home'} 
            onClick={() => setView('home')} 
          />
          <NavItem 
            icon={<UserCircle className="w-5 h-5" />} 
            label="Student Portal" 
            active={view === 'student'} 
            onClick={() => setView('student')} 
          />
          <NavItem 
            icon={<PlusCircle className="w-5 h-5" />} 
            label="Teacher Portal" 
            active={view === 'teacher'} 
            onClick={() => setView('teacher')} 
          />
          <NavItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Admin Panel" 
            active={view === 'admin'} 
            onClick={() => setView('admin')} 
          />
        </div>

        <div className="mt-auto pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] opacity-60 uppercase tracking-[0.2em]">Panjgur Educational Board</p>
          <p className="text-[9px] opacity-40 mt-1">v1.0.2</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div className="welcome">
            <h1 className="text-2xl font-bold text-text">Assalamu Alaikum</h1>
            <p className="text-sm text-text-light">Welcome to the Jamia Management System</p>
          </div>
          <div className="bg-surface px-4 py-2 rounded-full text-xs font-bold shadow-sleek border border-bg">
            Academic Year: 2024-25
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'home' && renderHome()}
          {view === 'student' && renderStudentPortal()}
          {view === 'teacher' && renderTeacherPortal()}
          {view === 'admin' && renderAdminPanel()}
        </AnimatePresence>
      </main>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-sleek z-[100] flex items-center gap-3 ${
              message.type === 'success' ? 'bg-primary text-white' : 'bg-red-600 text-white'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-semibold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
        active 
          ? 'bg-white/15 text-white shadow-inner' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-surface p-6 rounded-sleek shadow-sleek border-l-4 border-primary">
      <p className="text-[10px] text-text-light uppercase tracking-widest font-bold mb-1">{label}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
    </div>
  );
}
