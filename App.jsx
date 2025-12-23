// ============================================
// MAIN APP COMPONENT
// Displays UI for scheduling system
// ============================================

import React, { useState } from 'react';
import { Calendar, Users, BookOpen, Plus, Download, Trash2, CheckCircle, Clock, Settings, Cpu, Zap, Activity, ArrowRight, Layers, FileText, DownloadCloud } from 'lucide-react';
import { DAYS, DEFAULT_PERIODS } from './types.js';
import { GeneticScheduler } from './services/scheduler.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ============================================
// LANDING PAGE - First screen users see
// ============================================

function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="text-center max-w-4xl px-4 relative z-10">
        {/* Icon */}
        <div className="mb-8 inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Calendar className="h-10 w-10 text-white" />
          </div>
        </div>
        
        {/* Badge */}
        <div className="inline-block mb-8 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/50 backdrop-blur">
          <span className="text-sm font-bold text-purple-200">🚀 AI-Powered Scheduling</span>
        </div>
        
        {/* Main title */}
        <h1 className="text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
          GenSchedule AI
        </h1>
        
        {/* Description */}
        <p className="text-xl text-slate-300 mb-4">
          Automatic class timetable scheduling using genetic algorithms
        </p>
        <p className="text-lg text-slate-400 mb-12">
          Eliminate conflicts • Optimize resources • Save time
        </p>
        
        {/* Start button */}
        <button 
          onClick={onEnter}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all"
        >
          Get Started
          <ArrowRight className="inline ml-2 h-5 w-5" />
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <Zap className="h-8 w-8 text-yellow-400 mb-2 mx-auto" />
            <p className="font-bold">Fast</p>
            <p className="text-sm text-slate-300">Generates optimal schedules in seconds</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <CheckCircle className="h-8 w-8 text-green-400 mb-2 mx-auto" />
            <p className="font-bold">Smart</p>
            <p className="text-sm text-slate-300">Avoids all scheduling conflicts</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <DownloadCloud className="h-8 w-8 text-blue-400 mb-2 mx-auto" />
            <p className="font-bold">Export</p>
            <p className="text-sm text-slate-300">Download as CSV or PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HEADER - Top navigation
// ============================================

function Header({ onBack }) {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-purple-900 border-b border-purple-500/30 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition" onClick={onBack}>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GenSchedule AI</h1>
            <p className="text-xs text-purple-300">Smart Timetable Generator</p>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 font-medium">Active</span>
        </div>
      </div>
    </header>
  );
}

// ============================================
// EMPTY STATE - Shows when no data
// ============================================

function EmptyState({ title, desc, icon: Icon }) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-1">{desc}</p>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function App() {
  // ============================================
  // STATE - Data that can change
  // ============================================

  // Show landing page or main app?
  const [showLanding, setShowLanding] = useState(true);
  
  // Which tab is active? 'setup', 'settings', or 'results'
  const [activeTab, setActiveTab] = useState('setup');
  
  // List of all courses
  const [courses, setCourses] = useState([
    { id: '1', code: 'CS301 Algo', creditHours: 4, isLab: false, sessionsRequired: 3 },
    { id: '2', code: 'CS302 DB', creditHours: 4, isLab: false, sessionsRequired: 3 },
    { id: '3', code: 'CS303 AI', creditHours: 4, isLab: false, sessionsRequired: 3 },
    { id: '4', code: 'CS304 Net', creditHours: 3, isLab: false, sessionsRequired: 3 },
    { id: '5', code: 'CS301 Lab', creditHours: 1, isLab: true, sessionsRequired: 1 },
    { id: '6', code: 'CS302 Lab', creditHours: 1, isLab: true, sessionsRequired: 1 },
  ]);
  
  // List of all instructors
  const [instructors, setInstructors] = useState([
    { id: '1', name: 'Dr. Alan Turing', assignedCourses: ['CS301 Algo', 'CS303 AI'] },
    { id: '2', name: 'Dr. Edgar Codd', assignedCourses: ['CS302 DB', 'CS302 Lab'] },
    { id: '3', name: 'Prof. Ada Lovelace', assignedCourses: ['CS301 Lab', 'CS304 Net'] },
  ]);
  
  // Time periods (when classes can happen)
  const [periods, setPeriods] = useState(DEFAULT_PERIODS);
  
  // Is the algorithm running?
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Progress of the algorithm
  const [progress, setProgress] = useState({ gen: 0, fitness: -1000 });
  
  // The final schedule
  const [schedule, setSchedule] = useState(null);

  // Algorithm parameters
  const [gaParams, setGaParams] = useState({
    populationSize: 50,     // Number of schedules to try
    generations: 500,        // How many times to improve
    mutationRate: 0.1       // Chance to change something
  });

  // New course being added
  const [newCourse, setNewCourse] = useState({ isLab: false, sessionsRequired: 3 });
  
  // New instructor being added
  const [newInst, setNewInst] = useState({ name: '', courseCodes: '' });

  // ============================================
  // FUNCTIONS - What happens when user acts
  // ============================================

  // Add a new course
  function handleAddCourse() {
    if (!newCourse.code) return;  // Need course code
    
    // Create new course object
    const courseToAdd = {
      id: Date.now().toString(),
      code: newCourse.code,
      creditHours: newCourse.creditHours || 3,
      isLab: newCourse.isLab || false,
      sessionsRequired: newCourse.sessionsRequired || 3
    };
    
    // Add to list
    setCourses([...courses, courseToAdd]);
    
    // Clear input
    setNewCourse({ code: '', creditHours: 3, isLab: false, sessionsRequired: 3 });
  }

  // Add a new instructor
  function handleAddInstructor() {
    if (!newInst.name) return;  // Need name
    
    // Split course codes by comma
    const assigned = newInst.courseCodes.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    // Create instructor object
    const instToAdd = {
      id: Date.now().toString(),
      name: newInst.name,
      assignedCourses: assigned
    };
    
    // Add to list
    setInstructors([...instructors, instToAdd]);
    
    // Clear input
    setNewInst({ name: '', courseCodes: '' });
  }

  // Change a period's property
  function handlePeriodChange(index, field, value) {
    const newPeriods = [...periods];
    const period = { ...newPeriods[index] };

    // Handle time changes
    if (field === 'start' || field === 'end') {
      const parts = period.timeRange.split('-');
      const start = parts[0];
      const end = parts[1];
      
      if (field === 'start') {
        period.timeRange = value + '-' + end;
      } else {
        period.timeRange = start + '-' + value;
      }
    } else {
      // Other fields like isBreak, isLabSlot
      period[field] = value;
    }
    
    newPeriods[index] = period;
    setPeriods(newPeriods);
  }

  // Add a new time period
  function addPeriod() {
    const newId = periods.length + 1;
    
    // Default time
    let startTime = "09:00";
    let endTime = "10:00";
    
    // If there are existing periods, add after the last one
    if (periods.length > 0) {
      const lastPeriod = periods[periods.length - 1];
      const lastEnd = lastPeriod.timeRange.split('-')[1];
      startTime = lastEnd;
      
      // Simple: add 1 hour
      const [h, m] = lastEnd.split(':').map(Number);
      const endH = (h + 1) % 24;
      endTime = String(endH).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }

    // Create new period
    const newPeriod = {
      id: newId,
      timeRange: startTime + '-' + endTime,
      isBreak: false,
      isLabSlot: false
    };
    
    setPeriods([...periods, newPeriod]);
  }

  // Remove a time period
  function removePeriod(index) {
    const newPeriods = periods.filter((_, i) => i !== index);
    
    // Re-number IDs
    const reindexed = newPeriods.map((p, i) => ({ ...p, id: i + 1 }));
    setPeriods(reindexed);
  }

  // Run the scheduling algorithm
  async function runGeneration() {
    setIsGenerating(true);
    setSchedule(null);
    setActiveTab('results');

    // Create map of periods for each day
    const layoutMap = new Map();
    for (let i = 0; i < 6; i++) {
      layoutMap.set(i, periods);
    }

    // Create scheduler
    const solver = new GeneticScheduler(courses, instructors, layoutMap);
    
    // Run algorithm (await = wait for it to finish)
    const result = await solver.solve(
      gaParams.generations,
      gaParams.populationSize,
      gaParams.mutationRate,
      // Callback function called during progress
      (gen, fit) => {
        setProgress({ gen, fitness: fit });
      }
    );

    // Save result
    setSchedule(result.genes);
    setIsGenerating(false);
  }

  // Download schedule as CSV file
  function downloadCSV() {
    if (!schedule) return;
    
    // Create CSV header
    let csv = "Day,Period,Time,Course,Instructor\n";
    
    // Sort schedule by day and time
    const sorted = [...schedule].sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
      return a.periodId - b.periodId;
    });

    // Add each class to CSV
    sorted.forEach(s => {
      const period = periods.find(p => p.id === s.periodId);
      const line = DAYS[s.dayIndex] + "," + s.periodId + "," + period?.timeRange + "," + s.courseCode + "," + s.instructorName + "\n";
      csv = csv + line;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'timetable.csv';
    link.click();
  }

  // Download schedule as PDF file
  function downloadPDF() {
    if (!schedule) return;
    
    // Get the timetable element
    const element = document.getElementById('timetable-print');
    if (!element) return;

    // Convert HTML to canvas
    html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      // Get canvas dimensions
      const imgWidth = 210;  // A4 width in mm
      const pageHeight = 297;  // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add canvas to PDF (split into pages if needed)
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save('timetable.pdf');
    });
  }

  // ============================================
  // RENDER - What to show on screen
  // ============================================

  // Show landing page if needed
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onBack={() => setShowLanding(true)} />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        
        {/* ============================================
            TAB BUTTONS
            ============================================ */}
        
        <div className="flex gap-2 mb-8 bg-white/50 backdrop-blur p-1 rounded-xl w-fit border border-white/20 shadow-lg">
          <button 
            onClick={() => setActiveTab('setup')}
            className={activeTab === 'setup' ? 'px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold shadow-lg' : 'px-6 py-2.5 text-gray-600 rounded-lg hover:text-gray-900 transition'}
          >
            📋 Data Setup
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={activeTab === 'settings' ? 'px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold shadow-lg' : 'px-6 py-2.5 text-gray-600 rounded-lg hover:text-gray-900 transition'}
          >
            ⚙️ Parameters
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={activeTab === 'results' ? 'px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold shadow-lg' : 'px-6 py-2.5 text-gray-600 rounded-lg hover:text-gray-900 transition'}
          >
            📊 Results
          </button>
        </div>

        {/* ============================================
            SETTINGS TAB - Time and algorithm params
            ============================================ */}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Time Periods */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-8 border border-slate-200 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Clock className="h-6 w-6 text-green-600" />
                ⏰ Time Periods
              </h2>

              <div className="space-y-3">
                {periods.map((period, index) => {
                  const [start, end] = period.timeRange.split('-');
                  return (
                    <div key={index} className="grid grid-cols-5 gap-3 items-center bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-green-300 transition">
                      <div className="font-bold text-gray-700 text-center bg-white rounded py-2">{index + 1}</div>
                      <input 
                        type="time" 
                        value={start}
                        onChange={(e) => handlePeriodChange(index, 'start', e.target.value)}
                        className="border border-slate-300 rounded p-2 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <input 
                        type="time" 
                        value={end}
                        onChange={(e) => handlePeriodChange(index, 'end', e.target.value)}
                        className="border border-slate-300 rounded p-2 focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <button 
                        onClick={() => handlePeriodChange(index, 'isBreak', !period.isBreak)}
                        className={period.isBreak ? 'px-3 py-2 bg-amber-100 text-amber-700 rounded font-bold text-sm border border-amber-300' : 'px-3 py-2 bg-white border border-slate-300 text-gray-600 rounded font-bold text-sm hover:bg-slate-50'}
                      >
                        {period.isBreak ? '☕ BREAK' : '📚 CLASS'}
                      </button>
                      <button 
                        onClick={() => removePeriod(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-2 transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
                <button 
                  onClick={addPeriod}
                  className="w-full py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:border-green-500 hover:bg-green-50 font-bold transition flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" /> Add Time Period
                </button>
              </div>
            </div>

            {/* Algorithm Parameters */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-8 border border-slate-200 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Settings className="h-6 w-6 text-orange-600" />
                ⚙️ Algorithm Settings
              </h2>

              {/* Population Size */}
              <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex justify-between mb-3">
                  <label className="font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" /> Population Size
                  </label>
                  <span className="text-lg font-bold text-indigo-600 bg-white px-4 py-1 rounded">{gaParams.populationSize}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="10"
                  value={gaParams.populationSize}
                  onChange={(e) => setGaParams({...gaParams, populationSize: parseInt(e.target.value)})}
                  className="w-full accent-indigo-600"
                />
                <p className="text-xs text-gray-600 mt-2">More schedules = better solution but slower. Recommended: 50-100</p>
              </div>

              {/* Generations */}
              <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between mb-3">
                  <label className="font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" /> Generations
                  </label>
                  <span className="text-lg font-bold text-purple-600 bg-white px-4 py-1 rounded">{gaParams.generations}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="100"
                  value={gaParams.generations}
                  onChange={(e) => setGaParams({...gaParams, generations: parseInt(e.target.value)})}
                  className="w-full accent-purple-600"
                />
                <p className="text-xs text-gray-600 mt-2">More iterations = better solution. Stops early if perfect schedule found.</p>
              </div>

              {/* Mutation Rate */}
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex justify-between mb-3">
                  <label className="font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-pink-600" /> Mutation Rate
                  </label>
                  <span className="text-lg font-bold text-pink-600 bg-white px-4 py-1 rounded">{gaParams.mutationRate.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.5" 
                  step="0.01"
                  value={gaParams.mutationRate}
                  onChange={(e) => setGaParams({...gaParams, mutationRate: parseFloat(e.target.value)})}
                  className="w-full accent-pink-600"
                />
                <p className="text-xs text-gray-600 mt-2">Probability of randomly changing a class slot (0.01 - 0.50)</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            SETUP TAB - Add courses and instructors
            ============================================ */}

        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Courses Section */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-8 border border-slate-200 shadow-xl">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                Courses
              </h2>
              <p className="text-slate-500 mb-6">Total: <span className="font-bold text-indigo-600">{courses.length}</span></p>

              <div className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-2">
                {courses.length === 0 ? (
                  <EmptyState title="No Courses Added" desc="Start by adding your courses" icon={BookOpen} />
                ) : (
                  courses.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 hover:border-indigo-400 transition group">
                      <div>
                        <p className="font-bold text-gray-900">{c.code}</p>
                        <p className="text-xs text-gray-600">{c.sessionsRequired} sessions • {c.isLab ? '🧪 Lab' : '📚 Theory'}</p>
                      </div>
                      <button 
                        onClick={() => setCourses(courses.filter(x => x.id !== c.id))}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Course Form */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Add New Course</h3>
                <input 
                  type="text" 
                  placeholder="Course Code (e.g. CS301)" 
                  className="w-full p-3 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newCourse.code || ''}
                  onChange={e => setNewCourse({...newCourse, code: e.target.value})}
                />
                <div className="flex gap-2 mb-3">
                  <label className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer flex-1">
                    <input 
                      type="checkbox" 
                      checked={newCourse.isLab}
                      onChange={e => setNewCourse({...newCourse, isLab: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-bold text-gray-700">Lab Course?</span>
                  </label>
                  <input 
                    type="number" 
                    placeholder="Sessions" 
                    className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-20"
                    value={newCourse.sessionsRequired}
                    onChange={e => setNewCourse({...newCourse, sessionsRequired: parseInt(e.target.value)})}
                  />
                </div>
                <button 
                  onClick={handleAddCourse}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="h-4 w-4" /> Add Course
                </button>
              </div>
            </div>

            {/* Instructors Section */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-8 border border-slate-200 shadow-xl">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Instructors
              </h2>
              <p className="text-slate-500 mb-6">Total: <span className="font-bold text-purple-600">{instructors.length}</span></p>

              <div className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-2">
                {instructors.length === 0 ? (
                  <EmptyState title="No Instructors Added" desc="Add your faculty members" icon={Users} />
                ) : (
                  instructors.map(i => (
                    <div key={i.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-400 transition group">
                      <div>
                        <p className="font-bold text-gray-900">{i.name}</p>
                        <p className="text-xs text-gray-600">{i.assignedCourses.length} courses assigned</p>
                      </div>
                      <button 
                        onClick={() => setInstructors(instructors.filter(x => x.id !== i.id))}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Instructor Form */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Add New Instructor</h3>
                <input 
                  type="text" 
                  placeholder="Instructor Name" 
                  className="w-full p-3 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newInst.name}
                  onChange={e => setNewInst({...newInst, name: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Assigned Courses (comma separated)" 
                  className="w-full p-3 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newInst.courseCodes}
                  onChange={e => setNewInst({...newInst, courseCodes: e.target.value})}
                />
                <button 
                  onClick={handleAddInstructor}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="h-4 w-4" /> Add Instructor
                </button>
              </div>
            </div>
            
            {/* Generate Button */}
            <div className="lg:col-span-2 flex justify-end">
              <button 
                onClick={runGeneration}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
              >
                <Cpu className="h-6 w-6 animate-spin" /> Generate Timetable
              </button>
            </div>
          </div>
        )}

        {/* ============================================
            RESULTS TAB - Show the schedule
            ============================================ */}

        {activeTab === 'results' && (
          <div className="space-y-6">
            
            {/* Loading State */}
            {isGenerating && (
              <div className="bg-white p-16 rounded-lg text-center border border-gray-200">
                <div className="mb-4">
                  <Cpu className="h-16 w-16 text-indigo-600 mx-auto animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Optimizing...</h3>
                <p className="text-gray-500 mb-6">Finding the best schedule arrangement</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: Math.min(100, (progress.gen / gaParams.generations) * 100) + '%' }}
                  ></div>
                </div>
                <p className="text-gray-500 text-sm">Generation {progress.gen} / {gaParams.generations}</p>
              </div>
            )}

            {/* No Schedule */}
            {!isGenerating && !schedule && (
              <EmptyState title="No Schedule" desc="Click Generate to create schedule" icon={Calendar} />
            )}

            {/* Show Schedule */}
            {!isGenerating && schedule && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white">📅 Generated Schedule</h2>
                    <p className="text-slate-300 mt-1">Fitness Score: <span className="font-bold text-green-400">{progress.fitness.toFixed(0)}</span></p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={downloadCSV}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg transition"
                    >
                      <Download className="h-4 w-4" /> CSV
                    </button>
                    <button 
                      onClick={downloadPDF}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg transition"
                    >
                      <FileText className="h-4 w-4" /> PDF
                    </button>
                  </div>
                </div>

                {/* Timetable */}
                <div id="timetable-print" className="bg-white rounded-lg border border-gray-300 overflow-x-auto shadow-2xl">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-b border-gray-300">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold w-32">⏰ Time</th>
                        {DAYS.map(day => (
                          <th key={day} className="px-6 py-4 text-center font-bold">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {periods.map((period) => (
                        <tr key={period.id} className={period.isBreak ? 'bg-gray-100' : 'bg-white hover:bg-slate-50 transition'}>
                          <td className="px-6 py-4 font-bold text-gray-900 bg-gray-50 sticky left-0">
                            {period.timeRange} 
                            {period.isBreak && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded ml-2">BREAK</span>}
                          </td>
                          {DAYS.map((day, dayIdx) => {
                            const session = schedule.find(s => s.dayIndex === dayIdx && s.periodId === period.id);
                            
                            // Skip breaks
                            if (period.isBreak) return <td key={dayIdx} className="bg-gray-100"></td>;

                            return (
                              <td key={dayIdx} className="px-2 py-3 border border-gray-100 h-32 align-top">
                                {session ? (
                                  <div className={session.courseCode.toLowerCase().includes('lab') ? 'bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-lg h-full border-l-4 border-purple-500 shadow-md' : 'bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg h-full border-l-4 border-green-500 shadow-md'}>
                                    <p className="font-bold text-sm text-gray-900">{session.courseCode}</p>
                                    {session.courseCode.toLowerCase().includes('lab') && (
                                      <span className="text-xs font-bold bg-purple-600 text-white px-2 py-1 rounded inline-block mt-1">🧪 LAB</span>
                                    )}
                                    <p className="text-xs text-gray-700 mt-2 font-medium">👨‍🏫 {session.instructorName}</p>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-200 h-full rounded-lg"></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-md">
                  <p className="text-green-900 font-bold mb-1 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Schedule Generated Successfully!
                  </p>
                  <p className="text-green-700 text-sm">The genetic algorithm found an optimal arrangement with no conflicts. You can now export your timetable as CSV or PDF.</p>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
