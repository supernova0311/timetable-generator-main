import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Play, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Cpu,
  Settings,
  Sliders,
  Activity,
  Zap,
  ArrowRight,
  Clock,
  Layers
} from 'lucide-react';
import { Course, Instructor, Period, DEFAULT_PERIODS, DAYS, ClassSession } from './types';
import { GeneticScheduler } from './services/scheduler';

// --- Landing Page Component ---
const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
         {/* Animated blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="z-10 text-center max-w-4xl px-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 mb-8 animate-fade-in-up shadow-xl">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
           <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">AI-Powered Optimization Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up [animation-delay:200ms]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 animate-gradient-x">
            GenSchedule AI
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:400ms]">
          Experience the power of genetic algorithms to solve complex academic scheduling problems. 
          Eliminate conflicts, optimize resources, and visualize results instantly.
        </p>

        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 animate-fade-in-up [animation-delay:600ms]"
        >
          <span>Open Workspace</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl animate-fade-in-up [animation-delay:800ms]">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl text-left hover:bg-slate-800/80 transition-colors">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Activity className="text-indigo-400 h-6 w-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Genetic Evolution</h3>
                <p className="text-slate-400 text-sm">Mimics biological evolution to iteratively improve schedule fitness.</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl text-left hover:bg-slate-800/80 transition-colors">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="text-blue-400 h-6 w-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Conflict Resolution</h3>
                <p className="text-slate-400 text-sm">Automatically detects and resolves double bookings and overlaps.</p>
            </div>
             <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl text-left hover:bg-slate-800/80 transition-colors">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Layers className="text-purple-400 h-6 w-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Smart Visuals</h3>
                <p className="text-slate-400 text-sm">Crystal clear, color-coded timetables for easy analysis.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

const Header = ({ onBack }: { onBack: () => void }) => (
  <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={onBack}>
        <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg shadow-md">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">GenSchedule AI</h1>
          <p className="text-xs text-indigo-600 font-medium">Workspace</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            <span className="text-xs font-medium text-gray-600">System Active</span>
        </div>
      </div>
    </div>
  </header>
);

const EmptyState = ({ title, desc, icon: Icon }: any) => (
  <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-200 transition-colors">
    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{desc}</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<'setup' | 'settings' | 'results'>('setup');
  
  // Data State
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', code: 'CS301 Algo', creditHours: 4, isLab: false, sessionsRequired: 3 },
    { id: '2', code: 'CS302 DB', creditHours: 4, isLab: false, sessionsRequired: 3 },
    { id: '3', code: 'CS303 AI', creditHours: 4, isLab: false, sessionsRequired: 3 },
    { id: '4', code: 'CS304 Net', creditHours: 3, isLab: false, sessionsRequired: 3 },
    { id: '5', code: 'CS301 Lab', creditHours: 1, isLab: true, sessionsRequired: 1 },
    { id: '6', code: 'CS302 Lab', creditHours: 1, isLab: true, sessionsRequired: 1 },
  ]);
  const [instructors, setInstructors] = useState<Instructor[]>([
    { id: '1', name: 'Dr. Alan Turing', assignedCourses: ['CS301 Algo', 'CS303 AI'] },
    { id: '2', name: 'Dr. Edgar Codd', assignedCourses: ['CS302 DB', 'CS302 Lab'] },
    { id: '3', name: 'Prof. Ada Lovelace', assignedCourses: ['CS301 Lab', 'CS304 Net'] },
  ]);
  
  // Time Periods State
  const [periods, setPeriods] = useState<Period[]>(DEFAULT_PERIODS);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ gen: 0, fitness: -1000 });
  const [schedule, setSchedule] = useState<ClassSession[] | null>(null);

  // Settings State
  const [gaParams, setGaParams] = useState({
    populationSize: 50,
    generations: 500,
    mutationRate: 0.1
  });

  // Inputs State
  const [newCourse, setNewCourse] = useState<Partial<Course>>({ isLab: false, sessionsRequired: 3 });
  const [newInst, setNewInst] = useState({ name: '', courseCodes: '' });

  const handleAddCourse = () => {
    if (!newCourse.code) return;
    setCourses([...courses, { 
      id: Date.now().toString(), 
      code: newCourse.code, 
      creditHours: newCourse.creditHours || 3, 
      isLab: newCourse.isLab || false, 
      sessionsRequired: newCourse.sessionsRequired || 3 
    }]);
    setNewCourse({ code: '', creditHours: 3, isLab: false, sessionsRequired: 3 });
  };

  const handleAddInstructor = () => {
    if (!newInst.name) return;
    const assigned = newInst.courseCodes.split(',').map(s => s.trim()).filter(Boolean);
    setInstructors([...instructors, {
      id: Date.now().toString(),
      name: newInst.name,
      assignedCourses: assigned
    }]);
    setNewInst({ name: '', courseCodes: '' });
  };

  // Period Management
  const handlePeriodChange = (index: number, field: keyof Period | 'start' | 'end', value: any) => {
    const newPeriods = [...periods];
    const period = { ...newPeriods[index] };

    if (field === 'start' || field === 'end') {
        const [start, end] = period.timeRange.split('-');
        if (field === 'start') period.timeRange = `${value}-${end}`;
        else period.timeRange = `${start}-${value}`;
    } else {
        (period as any)[field] = value;
    }
    
    newPeriods[index] = period;
    setPeriods(newPeriods);
  };

  const addPeriod = () => {
    // Determine new ID (always sequential based on array length to satisfy gap logic)
    const newId = periods.length + 1;
    // Default time adds 1 hour to last period
    let startTime = "09:00";
    let endTime = "10:00";
    
    if (periods.length > 0) {
        const last = periods[periods.length - 1];
        const [_, lastEnd] = last.timeRange.split('-');
        startTime = lastEnd;
        // Simple hour add for demo purposes (real time math omitted for brevity)
        const [h, m] = lastEnd.split(':').map(Number);
        const endH = (h + 1) % 24;
        endTime = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    setPeriods([...periods, {
        id: newId,
        timeRange: `${startTime}-${endTime}`,
        isBreak: false,
        isLabSlot: false
    }]);
  };

  const removePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    // Re-index to keep IDs sequential for the algorithm's gap logic
    const reindexed = newPeriods.map((p, i) => ({...p, id: i + 1}));
    setPeriods(reindexed);
  };

  const runGeneration = async () => {
    setIsGenerating(true);
    setSchedule(null);
    setActiveTab('results');

    // Prepare Data
    const layoutMap = new Map<number, Period[]>();
    // Use the dynamic periods state for all 6 days
    for(let i = 0; i < 6; i++) layoutMap.set(i, periods);

    const solver = new GeneticScheduler(courses, instructors, layoutMap);
    
    // Run async to not block UI
    const result = await solver.solve(
        gaParams.generations, 
        gaParams.populationSize, 
        gaParams.mutationRate,
        (gen, fit) => {
            setProgress({ gen, fitness: fit });
        }
    );

    setSchedule(result.genes);
    setIsGenerating(false);
  };

  const downloadCSV = () => {
    if (!schedule) return;
    let csv = "Day,Period,Time,Course,Instructor\n";
    
    const sorted = [...schedule].sort((a, b) => {
        if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
        return a.periodId - b.periodId;
    });

    sorted.forEach(s => {
        const period = periods.find(p => p.id === s.periodId);
        csv += `${DAYS[s.dayIndex]},${s.periodId},${period?.timeRange},${s.courseCode},${s.instructorName}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.csv';
    a.click();
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header onBack={() => setShowLanding(true)} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit mb-8 mx-auto md:mx-0">
            <button 
                onClick={() => setActiveTab('setup')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'setup' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                1. Data Setup
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                2. Parameters
            </button>
            <button 
                onClick={() => setActiveTab('results')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'results' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                3. Timetable Results
            </button>
        </div>

        {activeTab === 'settings' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* Time Layout Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                            <Clock className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Time Layout Configuration</h2>
                            <p className="text-sm text-gray-500">Define the daily schedule structure, breaks, and lab slots.</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                         <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wide px-2 mb-2">
                             <div className="col-span-1 text-center">#</div>
                             <div className="col-span-4">Time Range</div>
                             <div className="col-span-2 text-center">Type</div>
                             <div className="col-span-2 text-center">Lab?</div>
                             <div className="col-span-1"></div>
                         </div>
                         
                         {periods.map((period, index) => {
                             const [start, end] = period.timeRange.split('-');
                             return (
                                 <div key={index} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                     <div className="col-span-1 text-center font-bold text-gray-400">
                                         {index + 1}
                                     </div>
                                     <div className="col-span-4 flex items-center gap-2">
                                         <input 
                                             type="time" 
                                             value={start}
                                             onChange={(e) => handlePeriodChange(index, 'start', e.target.value)}
                                             className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                         />
                                         <span className="text-gray-400">-</span>
                                         <input 
                                             type="time" 
                                             value={end}
                                             onChange={(e) => handlePeriodChange(index, 'end', e.target.value)}
                                             className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                         />
                                     </div>
                                     <div className="col-span-2 flex justify-center">
                                         <button 
                                             onClick={() => handlePeriodChange(index, 'isBreak', !period.isBreak)}
                                             className={`px-3 py-1 rounded text-xs font-bold transition-colors border ${period.isBreak ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                         >
                                             {period.isBreak ? 'BREAK' : 'CLASS'}
                                         </button>
                                     </div>
                                     <div className="col-span-2 flex justify-center">
                                          <input 
                                             type="checkbox" 
                                             checked={period.isLabSlot}
                                             onChange={(e) => handlePeriodChange(index, 'isLabSlot', e.target.checked)}
                                             className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                                         />
                                     </div>
                                     <div className="col-span-1 flex justify-end">
                                         <button 
                                             onClick={() => removePeriod(index)}
                                             className="text-gray-400 hover:text-red-500 transition p-1 hover:bg-red-50 rounded"
                                         >
                                             <Trash2 className="h-4 w-4" />
                                         </button>
                                     </div>
                                 </div>
                             );
                         })}

                         <button 
                            onClick={addPeriod}
                            className="w-full py-3 mt-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium flex items-center justify-center gap-2"
                         >
                             <Plus className="h-4 w-4" /> Add Time Slot
                         </button>
                    </div>
                </div>

                {/* Genetic Parameters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <Settings className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Algorithm Parameters</h2>
                            <p className="text-sm text-gray-500">Fine-tune the genetic engine performance</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Population Size */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-500" /> Population Size
                                </label>
                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    {gaParams.populationSize}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="10" 
                                max="200" 
                                step="10"
                                value={gaParams.populationSize}
                                onChange={(e) => setGaParams({...gaParams, populationSize: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Higher population increases diversity but slows down each generation. 
                                Recommended: 50-100.
                            </p>
                        </div>

                        {/* Generations */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-indigo-500" /> Max Generations
                                </label>
                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    {gaParams.generations}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="100" 
                                max="2000" 
                                step="100"
                                value={gaParams.generations}
                                onChange={(e) => setGaParams({...gaParams, generations: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Number of iterations the algorithm will run to improve the schedule. 
                                Stop early if solution is perfect.
                            </p>
                        </div>

                        {/* Mutation Rate */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-indigo-500" /> Mutation Rate
                                </label>
                                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    {gaParams.mutationRate.toFixed(2)}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0.01" 
                                max="0.5" 
                                step="0.01"
                                value={gaParams.mutationRate}
                                onChange={(e) => setGaParams({...gaParams, mutationRate: parseFloat(e.target.value)})}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Probability of a class session moving to a random slot. 
                                Prevents getting stuck in local optima.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                         <button 
                            onClick={() => setActiveTab('setup')}
                            className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                         >
                            Back to Data Setup
                         </button>
                    </div>
                </div>
             </div>
        )}

        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
            {/* Courses Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" /> Courses
                </h2>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">{courses.length} Added</span>
              </div>

              <div className="space-y-4 mb-6">
                 {courses.length === 0 ? <EmptyState title="No Courses" desc="Add courses to begin" icon={BookOpen} /> : (
                     <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                         {courses.map(c => (
                             <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition group">
                                 <div>
                                     <p className="font-bold text-gray-900">{c.code}</p>
                                     <p className="text-xs text-gray-500">{c.sessionsRequired} sessions • <span className={c.isLab ? "text-purple-600 font-medium" : "text-blue-600 font-medium"}>{c.isLab ? 'Lab' : 'Theory'}</span></p>
                                 </div>
                                 <button 
                                    onClick={() => setCourses(courses.filter(x => x.id !== c.id))}
                                    className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                >
                                     <Trash2 className="h-4 w-4" />
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <input 
                        type="text" 
                        placeholder="Course Code (e.g. CS101)" 
                        className="col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                        value={newCourse.code || ''}
                        onChange={e => setNewCourse({...newCourse, code: e.target.value})}
                    />
                    <div className="flex items-center gap-2 px-3 border rounded-lg bg-gray-50 hover:bg-white transition-colors">
                        <input 
                            type="checkbox" 
                            id="isLab"
                            checked={newCourse.isLab}
                            onChange={e => setNewCourse({...newCourse, isLab: e.target.checked})}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                        />
                        <label htmlFor="isLab" className="text-sm text-gray-700 cursor-pointer font-medium select-none">Is Lab?</label>
                    </div>
                    <input 
                        type="number" 
                        placeholder="Sessions" 
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                        value={newCourse.sessionsRequired}
                        onChange={e => setNewCourse({...newCourse, sessionsRequired: parseInt(e.target.value)})}
                    />
                </div>
                <button 
                    onClick={handleAddCourse}
                    className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition flex items-center justify-center gap-2 text-sm shadow-md"
                >
                    <Plus className="h-4 w-4" /> Add Course
                </button>
              </div>
            </div>

            {/* Instructors Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" /> Instructors
                </h2>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">{instructors.length} Added</span>
              </div>

              <div className="space-y-4 mb-6 flex-grow">
                 {instructors.length === 0 ? <EmptyState title="No Instructors" desc="Add faculty members" icon={Users} /> : (
                     <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                         {instructors.map(i => (
                             <div key={i.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition group">
                                 <div>
                                     <p className="font-bold text-gray-900">{i.name}</p>
                                     <div className="flex flex-wrap gap-1 mt-1">
                                         {i.assignedCourses.map(ac => (
                                             <span key={ac} className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-500 font-medium">{ac}</span>
                                         ))}
                                     </div>
                                 </div>
                                 <button 
                                    onClick={() => setInstructors(instructors.filter(x => x.id !== i.id))}
                                    className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                >
                                     <Trash2 className="h-4 w-4" />
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="space-y-3 mb-3">
                    <input 
                        type="text" 
                        placeholder="Instructor Name" 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                        value={newInst.name}
                        onChange={e => setNewInst({...newInst, name: e.target.value})}
                    />
                    <input 
                        type="text" 
                        placeholder="Assigned Courses (comma separated, e.g. CS101, CS102)" 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                        value={newInst.courseCodes}
                        onChange={e => setNewInst({...newInst, courseCodes: e.target.value})}
                    />
                </div>
                <button 
                    onClick={handleAddInstructor}
                    className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition flex items-center justify-center gap-2 text-sm shadow-md"
                >
                    <Plus className="h-4 w-4" /> Add Instructor
                </button>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="lg:col-span-2 flex justify-end">
                <button 
                    onClick={runGeneration}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center gap-3 transform hover:scale-[1.02] active:scale-95 ring-4 ring-indigo-50"
                >
                    <Cpu className="h-6 w-6" /> Generate Timetable
                </button>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
            <div className="space-y-6 animate-fade-in-up">
                {isGenerating ? (
                    <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-white p-4 rounded-full border-2 border-indigo-100 shadow-sm">
                                <Cpu className="h-10 w-10 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Evolving Schedule...</h3>
                        <p className="text-gray-500 mb-6 max-w-md">Our genetic engine is testing thousands of combinations to find the optimal arrangement for your classes.</p>
                        
                        <div className="w-full max-w-md bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                            <div 
                                className="bg-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${Math.min(100, (progress.gen / gaParams.generations) * 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between w-full max-w-md text-xs font-mono text-gray-400">
                             <span>Gen: {progress.gen} / {gaParams.generations}</span>
                             <span>Fitness: {progress.fitness.toFixed(0)}</span>
                        </div>
                    </div>
                ) : !schedule ? (
                     <EmptyState title="No Schedule Generated" desc="Go to configuration and click Generate" icon={Calendar} />
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Generated Schedule</h2>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                                        <CheckCircle className="h-3 w-3" /> Fitness: {progress.fitness.toFixed(0)}
                                    </span>
                                </p>
                            </div>
                            <button 
                                onClick={downloadCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm shadow-sm"
                            >
                                <Download className="h-4 w-4" /> Export CSV
                            </button>
                        </div>

                        {/* Timetable Grid */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ring-1 ring-gray-100">
                             <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32 sticky left-0 bg-gray-50 border-r border-gray-200 z-20">
                                                Time / Day
                                            </th>
                                            {DAYS.map(day => (
                                                <th key={day} className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {periods.map((period) => (
                                            <tr key={period.id} className={period.isBreak ? "bg-gray-50/50" : "bg-white"}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-700">{period.timeRange}</span>
                                                        {period.isBreak && <span className="text-xs text-amber-600 font-bold uppercase tracking-wide mt-1 bg-amber-50 w-fit px-1.5 py-0.5 rounded">Break</span>}
                                                    </div>
                                                </td>
                                                {DAYS.map((day, dayIdx) => {
                                                    const session = schedule.find(s => s.dayIndex === dayIdx && s.periodId === period.id);
                                                    
                                                    // Styled Break
                                                    if (period.isBreak) return <td key={dayIdx} className="bg-stripes-gray opacity-30 border-r border-gray-100 last:border-0"></td>;

                                                    return (
                                                        <td key={dayIdx} className="px-2 py-2 align-top h-28 border-r border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                                            {session ? (
                                                                <div className={`h-full w-full rounded-lg p-3 border-l-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 transform duration-200 flex flex-col justify-between
                                                                    ${session.courseCode.toLowerCase().includes('lab') 
                                                                        ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-indigo-500' 
                                                                        : 'bg-white border-emerald-400 border shadow-gray-100'}`}>
                                                                    
                                                                    <div>
                                                                        <div className={`font-bold text-sm ${session.courseCode.toLowerCase().includes('lab') ? 'text-indigo-900' : 'text-gray-900'}`}>
                                                                            {session.courseCode}
                                                                        </div>
                                                                        {session.courseCode.toLowerCase().includes('lab') && (
                                                                             <span className="inline-block text-[10px] font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded mt-1">LAB</span>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <div className={`text-xs mt-2 flex items-center gap-1.5 font-medium
                                                                         ${session.courseCode.toLowerCase().includes('lab') ? 'text-indigo-700' : 'text-gray-500'}`}>
                                                                        <Users className="h-3 w-3" /> {session.instructorName}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="h-full w-full rounded-lg border-2 border-dashed border-gray-100 opacity-50"></div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start animate-fade-in-up [animation-delay:200ms]">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Optimization Complete</h4>
                                <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                                    The genetic algorithm has successfully assigned instructors and courses while minimizing conflicts. 
                                    Labs are distinctively marked in purple, while theory classes use an emerald accent. Break times are hatched in gray.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}

      </main>
    </div>
  );
}