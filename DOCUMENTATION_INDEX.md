# GenSchedule AI - Documentation Index

## 📚 Complete Documentation Guide

This document provides a roadmap to all project documentation and source files.

---

## 📖 Documentation Files

### 1. **README.md** - Quick Start & Overview
**Purpose:** Getting started guide for new developers

**Contains:**
- Features overview
- Tech stack summary
- Installation instructions
- Development commands (npm run dev)
- Basic usage guide
- Constraints and rules
- File organization table
- API reference (quick)

**Best For:** First-time users, quick reference

---

### 2. **PROJECT_REPORT.md** - Comprehensive Technical Report
**Purpose:** Deep technical dive into the entire system

**Sections:**
- Executive summary with problem statement
- Detailed technology stack
- Complete project architecture
- File structure with line counts
- Data models (all objects documented)
- Genetic algorithm explanation with code
- UI component breakdown
- Export functionality details
- Development setup guide
- Performance characteristics
- Future enhancements
- Code quality notes

**Best For:** Technical architects, code reviewers, understanding design decisions

---

### 3. **DOCUMENTATION_INDEX.md** - This File
**Purpose:** Navigation guide for all documentation

**Contains:**
- Overview of each documentation file
- File location guide
- Source code structure
- Quick navigation links

**Best For:** Finding what you need

---

### 4. **API_REFERENCE.md** - Function & Class Reference
**Purpose:** Complete API documentation with examples

**Documents:**
- GeneticScheduler class and methods
- Schedule class and methods
- Helper functions
- Types and constants
- Function signatures
- Parameter descriptions
- Return value documentation
- Code examples for each function

**Best For:** Developers implementing features, debugging, understanding APIs

---

### 5. **ARCHITECTURE_DIAGRAMS.md** - Visual Architecture
**Purpose:** ASCII diagrams showing system structure

**Contains:**
- Complete system architecture diagram
- Data flow diagram
- Genetic algorithm evolution loop
- Fitness calculation breakdown
- UI component hierarchy
- React component interaction flow
- Algorithm state management
- Processing pipeline

**Best For:** Visual learners, understanding data flow

---

## 📂 Source Code Structure

### Core Application

```
App.jsx (1400+ lines)
├── Landing page component
├── Header component  
├── EmptyState component
├── Main App logic
│   ├── State management (useState)
│   ├── Tab handling (setup/settings/results)
│   ├── Course management
│   ├── Instructor management
│   ├── Period configuration
│   ├── Algorithm parameter setup
│   ├── Schedule generation
│   └── Export functions (CSV/PDF)
└── JSX rendering for all UI

index.jsx (20 lines)
└── React bootstrap
    └── Mounts App to DOM
    └── Includes error handling

types.js (30 lines)
└── Constants
    ├── DAYS array
    └── DEFAULT_PERIODS array

services/scheduler.js (400+ lines)
├── Helper functions
│   ├── randomInt()
│   └── randomDouble()
├── Schedule class
│   ├── constructor()
│   ├── initialize()
│   ├── isLabPeriod()
│   └── calculateFitness()
└── GeneticScheduler class
    ├── constructor()
    ├── initPopulation()
    ├── select()
    ├── crossover()
    ├── mutate()
    └── solve() [async]

vite.config.js (15 lines)
└── Vite build configuration
    ├── Server settings
    ├── React plugin
    ├── Environment variables
    └── Module aliases
```

### Development & Build Files

```
package.json
├── Project metadata
├── Scripts (dev, build, preview)
├── Dependencies
│   ├── react
│   ├── react-dom
│   ├── lucide-react
│   ├── html2canvas
│   └── jspdf
└── DevDependencies
    ├── vite
    └── @vitejs/plugin-react

index.html
├── HTML template
├── Tailwind CSS CDN
├── Root div
├── Fonts and icons
└── Main script reference (index.jsx)
```

---

## 🔍 Quick File Reference

### By Purpose

#### Understanding the Project
1. Start: **README.md**
2. Deep dive: **PROJECT_REPORT.md**
3. Visual: **ARCHITECTURE_DIAGRAMS.md**

#### Working with Code
1. API details: **API_REFERENCE.md**
2. Source code: See file locations below
3. Types: **types.js**

#### Implementation

| What to do | Where to look |
|-----------|---------------|
| Add a new course | App.jsx - handleAddCourse() |
| Change algorithm | services/scheduler.js - GeneticScheduler |
| Modify UI | App.jsx - JSX sections |
| Add new period type | types.js + App.jsx |
| Change constraints | services/scheduler.js - calculateFitness() |
| Export formats | App.jsx - downloadCSV() / downloadPDF() |
| Style changes | App.jsx - className attributes |
| Add new feature | Create in App.jsx state, integrate |

---

## 📊 Code Statistics

| File | Lines | Purpose |
|------|-------|---------|
| App.jsx | 1400+ | Main UI and logic |
| scheduler.js | 400+ | Genetic algorithm |
| types.js | 30 | Constants |
| index.jsx | 20 | React bootstrap |
| vite.config.js | 15 | Build config |
| **Total** | **~1900** | **Complete app** |

---

## 🧠 Understanding the Architecture

### Layer 1: UI (React)
- **File:** App.jsx
- **Responsibility:** User interface, state management, form handling
- **Technologies:** React, Tailwind CSS, Lucide Icons

### Layer 2: Business Logic
- **File:** services/scheduler.js
- **Responsibility:** Genetic algorithm implementation
- **Exports:** GeneticScheduler, Schedule classes

### Layer 3: Data
- **File:** types.js
- **Responsibility:** Constants and data structures
- **Exports:** DAYS, DEFAULT_PERIODS

### Layer 4: Build System
- **File:** vite.config.js
- **Responsibility:** Module bundling and dev server
- **Tool:** Vite

---

## 🚀 Development Workflow

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:5173

# 4. Edit files - browser auto-updates (HMR)
# Edit App.jsx → saves → browser refreshes instantly

# 5. Build for production
npm run build

# 6. Preview production build
npm run preview
```

### File Editing Guide

**When to edit which file:**

| Change | File | Line Range |
|--------|------|-----------|
| Course validation | App.jsx | ~250 |
| Algorithm parameters | App.jsx | ~180 |
| Constraint weight | scheduler.js | ~130-180 |
| Time periods | types.js | ~10-20 |
| UI styling | App.jsx | Throughout (className) |
| Export format | App.jsx | ~450-500 |

---

## 📝 Data Flow

```
User Input (UI)
    ↓
React State (App.jsx)
    ↓
GeneticScheduler (services/scheduler.js)
    ↓
Schedule (services/scheduler.js)
    ↓
Fitness Calculation (services/scheduler.js)
    ↓
Selection → Crossover → Mutation → Next Gen
    ↓
Best Schedule
    ↓
React Render (App.jsx)
    ↓
User Display + Export
```

---

## 🔧 Key Components

### GeneticScheduler Class
```javascript
new GeneticScheduler(courses, instructors, dayLayouts)
.solve(generations, popSize, mutationRate, progressCallback)
→ Promise<Schedule>
```

### Schedule Class
```javascript
new Schedule(courses, instructors, dayLayouts)
.initialize()         // Create random
.calculateFitness()   // Evaluate
.isLabPeriod()       // Check type
```

### Helper Functions
```javascript
randomInt(min, max)   // Random integer
randomDouble()        // Random 0-1
```

---

## 💡 Tips for Contributing

### Adding a Feature
1. **Plan:** Update relevant doc file first
2. **Implement:** Add code to App.jsx or services/scheduler.js
3. **Test:** Use npm run dev to verify
4. **Document:** Update comments and relevant .md file

### Finding Bugs
1. Check **App.jsx** for UI issues
2. Check **scheduler.js** for algorithm issues
3. Check **types.js** for data issues
4. Check browser console for errors (F12)

### Understanding Code
1. Start with **README.md** overview
2. Read **PROJECT_REPORT.md** architecture section
3. Look at **API_REFERENCE.md** for specific classes
4. Read source code comments
5. Check **ARCHITECTURE_DIAGRAMS.md** for visual understanding

---

## 📚 Additional Resources

### Documentation Files
- `README.md` - This project's main guide
- `PROJECT_REPORT.md` - Technical deep-dive
- `API_REFERENCE.md` - Function documentation
- `ARCHITECTURE_DIAGRAMS.md` - Visual diagrams

### Source Files
All source files have inline comments explaining the code.

### External Resources
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev
- Genetic Algorithms: Search "genetic algorithm scheduling"
- Tailwind CSS: https://tailwindcss.com

---

## ✅ Verification Checklist

After changes, verify:
- [ ] `npm run dev` starts without errors
- [ ] UI renders correctly at http://localhost:5173
- [ ] Can add courses and instructors
- [ ] Can generate schedule
- [ ] Can download CSV and PDF
- [ ] No console errors (F12)
- [ ] Comments explain changes
- [ ] Related documentation updated

---

**Last Updated:** December 23, 2025  
**Language:** Pure JavaScript  
**Framework:** React 19 + Vite 6.2
