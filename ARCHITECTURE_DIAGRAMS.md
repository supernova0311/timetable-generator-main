# GenSchedule AI - Architecture Diagrams

Visual representation of GenSchedule AI system architecture and data flows.

---

## 1. Complete System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    BROWSER ENVIRONMENT                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              React Application (App.jsx)                 │ │
│  │                                                          │ │
│  │  ┌─────────────────────────────────────────────────────┐│ │
│  │  │  UI LAYER - React Components                        ││ │
│  │  │                                                     ││ │
│  │  │  ┌──────────┐  ┌────────────┐  ┌────────────────┐ ││ │
│  │  │  │Landing   │  │  Data      │  │  Results/      │ ││ │
│  │  │  │Page      │  │  Setup     │  │  Timetable     │ ││ │
│  │  │  └──────────┘  └────────────┘  └────────────────┘ ││ │
│  │  │                                                     ││ │
│  │  │  ┌──────────┐  ┌────────────┐                      ││ │
│  │  │  │Settings/ │  │ Header/Nav │                      ││ │
│  │  │  │Parameters│  │            │                      ││ │
│  │  │  └──────────┘  └────────────┘                      ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  │                          ↓                              │ │
│  │  ┌─────────────────────────────────────────────────────┐│ │
│  │  │  STATE MANAGEMENT (useState hooks)                  ││ │
│  │  │                                                     ││ │
│  │  │  • courses                  • periods              ││ │
│  │  │  • instructors              • gaParams             ││ │
│  │  │  • schedule                 • activeTab            ││ │
│  │  │  • isGenerating             • progress             ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  │                          ↓                              │ │
│  │  ┌─────────────────────────────────────────────────────┐│ │
│  │  │  FUNCTION HANDLERS                                  ││ │
│  │  │                                                     ││ │
│  │  │  • handleAddCourse()        • downloadCSV()        ││ │
│  │  │  • handleAddInstructor()    • downloadPDF()        ││ │
│  │  │  • handlePeriodChange()     • runGeneration()      ││ │
│  │  └─────────────────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            BUSINESS LOGIC LAYER                          │ │
│  │         (services/scheduler.js)                          │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  GeneticScheduler Class                            │ │ │
│  │  │  ┌──────────────────────────────────────────────┐  │ │ │
│  │  │  │ Properties:                                  │  │ │ │
│  │  │  │ • population: Schedule[]                     │  │ │ │
│  │  │  │ • courses: Course[]                          │  │ │ │
│  │  │  │ • instructors: Instructor[]                  │  │ │ │
│  │  │  │ • dayLayouts: Map<number, Period[]>         │  │ │ │
│  │  │  └──────────────────────────────────────────────┘  │ │ │
│  │  │                                                     │ │ │
│  │  │  ┌──────────────────────────────────────────────┐  │ │ │
│  │  │  │ Methods:                                     │  │ │ │
│  │  │  │ • initPopulation()  • solve() [async]        │  │ │ │
│  │  │  │ • select()          • crossover()            │  │ │ │
│  │  │  │ • mutate()                                   │  │ │ │
│  │  │  └──────────────────────────────────────────────┘  │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Schedule Class                                    │ │ │
│  │  │  ┌──────────────────────────────────────────────┐  │ │ │
│  │  │  │ Properties:                                  │  │ │ │
│  │  │  │ • genes: ClassSession[]                      │  │ │ │
│  │  │  │ • fitness: number                            │  │ │ │
│  │  │  └──────────────────────────────────────────────┘  │ │ │
│  │  │                                                     │ │ │
│  │  │  ┌──────────────────────────────────────────────┐  │ │ │
│  │  │  │ Methods:                                     │  │ │ │
│  │  │  │ • initialize()                               │  │ │ │
│  │  │  │ • calculateFitness()                         │  │ │ │
│  │  │  │ • isLabPeriod()                              │  │ │ │
│  │  │  └──────────────────────────────────────────────┘  │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  Helper Functions                                  │ │ │
│  │  │  • randomInt(min, max) → number                   │ │ │
│  │  │  • randomDouble() → number                        │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            DATA LAYER                                    │ │
│  │         (types.js)                                       │ │
│  │                                                          │ │
│  │  • DAYS: string[]                                        │ │
│  │  • DEFAULT_PERIODS: Period[]                            │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                  BUILD SYSTEM (Vite)                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ npm run dev                                              │ │
│  │ └─→ vite config → React plugin → HMR enabled            │ │
│  │     Serves at http://localhost:5173                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ npm run build                                            │ │
│  │ └─→ vite config → Optimized bundle → dist/              │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Diagram

```
USER INTERACTION
       ↓
┌──────────────────────────────┐
│  User adds course/instructor │
└──────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  Update React State                  │
│  setCourses([...courses, newCourse]) │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│  Component re-renders            │
│  Display updated lists           │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  User configures algorithm parameters   │
│  Adjusts: popSize, generations, mut     │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│  User clicks "Generate Schedule" │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────┐
│  runGeneration() function                        │
│  1. Create layout map (periods for all days)     │
│  2. Instantiate GeneticScheduler                 │
│  3. Call scheduler.solve() [ASYNC]               │
└──────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────┐
│  GENETIC ALGORITHM EXECUTION                     │
│  (see next diagram)                              │
└──────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────┐
│  Algorithm returns Best Schedule                 │
│  schedule.genes: ClassSession[]                  │
│  schedule.fitness: number                        │
└──────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────┐
│  Update React State                              │
│  setSchedule(result.genes)                       │
│  setProgress({ gen, fitness })                   │
└──────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────┐
│  Component renders Results Tab                   │
│  Display timetable grid                          │
│  Show fitness score                              │
└──────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────┐
│  User can:                                       │
│  • View timetable                                │
│  • Download CSV                                  │
│  • Download PDF                                  │
│  • Export data                                   │
└──────────────────────────────────────────────────┘
```

---

## 3. Genetic Algorithm Evolution Loop

```
GENERATION 0 (Initialization)
├─ Create Population
│  ├─ Schedule 1: random genes, fitness = -250
│  ├─ Schedule 2: random genes, fitness = -180
│  ├─ Schedule 3: random genes, fitness = -320
│  └─ ... (50 total)
└─ Sort by fitness: [-180, -250, -320, ...]
     ↓

GENERATION 1
├─ Elitism: Keep best (-180)
├─ Create new schedules:
│  ├─ Select parent1 (tournament) → Schedule 2
│  ├─ Select parent2 (tournament) → Schedule 1
│  ├─ Crossover(parent1, parent2) → Child
│  ├─ Mutate(child, 0.1) → Modified Child
│  ├─ CalculateFitness(child) → -165
│  └─ Repeat until 50 total
├─ New Population: [-165, -180, -220, -250, ...]
└─ Progress: Gen 1, Fitness -165 (improving!)
     ↓

GENERATION 2
├─ Keep best (-165)
├─ Tournament Selection → Parents
├─ Crossover & Mutate → New children
├─ Evaluate children
├─ New Population: [-158, -165, -180, -220, ...]
└─ Progress: Gen 2, Fitness -158 (better!)
     ↓

... REPEAT FOR 500 GENERATIONS ...

GENERATION 500
├─ Keep best (now only -5)
├─ Create children (less variation in parents)
├─ Converged! No improvement possible
└─ Return: Best Schedule
     └─ genes: [ClassSession, ...]
     └─ fitness: -5 (nearly perfect)
```

---

## 4. Schedule Class Lifecycle

```
┌──────────────────────────┐
│  new Schedule()          │
│  Constructor             │
│  • genes = []            │
│  • fitness = 0           │
│  • courses = ref         │
│  • instructors = ref     │
│  • dayLayouts = ref      │
└──────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│  schedule.initialize()               │
│  Creates random genes:               │
│  For each course:                    │
│    For each session:                 │
│      Random day, random period       │
│      Create ClassSession             │
│      Push to genes                   │
└──────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  schedule.calculateFitness()           │
│  Evaluate all constraints:             │
│  1. Check double bookings              │
│  2. Check instructor conflicts         │
│  3. Check lab violations               │
│  4. Check course frequency             │
│  5. Check distribution                 │
│  6. Check gaps                         │
│  fitness = -totalPenalty               │
└────────────────────────────────────────┘
         ↓
┌──────────────────────────────┐
│  Schedule Ready to Use       │
│  • genes: [sessions...]      │
│  • fitness: -450             │
│  • Can be evaluated, copied  │
│  • Can be parent in breeding │
└──────────────────────────────┘
```

---

## 5. Fitness Calculation Breakdown

```
SCHEDULE EVALUATION
       ↓
CHECK 1: ROOM CONFLICTS
├─ For each gene:
│  ├─ Key: "dayIndex-periodId"
│  ├─ Count how many times used
│  └─ If count > 1: penalty -= 200
└─ Prevents double-booking

CHECK 2: INSTRUCTOR CONFLICTS
├─ For each gene:
│  ├─ Key: "instructor-dayIndex-periodId"
│  ├─ Count assignments
│  └─ If count > 1: penalty -= 200
└─ Instructor can't teach twice

CHECK 3: LAB VIOLATIONS
├─ For each gene:
│  ├─ If course is lab AND slot not lab
│  │  └─ penalty -= 50
│  └─ If course not lab AND slot is lab
│     └─ penalty -= 10
└─ Lab courses need lab slots

CHECK 4: COURSE FREQUENCY
├─ For each course:
│  ├─ Count scheduled sessions
│  ├─ Compare to required
│  ├─ If too few: penalty -= 100 × (required - scheduled)
│  └─ If too many: penalty -= 50 × (scheduled - required)
└─ Respect course requirements

CHECK 5: DISTRIBUTION
├─ For each course:
│  ├─ Count sessions per day
│  ├─ Try to spread across days
│  └─ Multiple same-day: penalty -= 30 × extra
└─ Spread out course sessions

CHECK 6: GAP ANALYSIS
├─ For each day:
│  ├─ Sort periods chronologically
│  ├─ Find gaps between classes
│  └─ penalty -= 20 × gapSize
└─ Minimize free periods between classes

       ↓
FITNESS = -TOTAL_PENALTY
- fitness > 0:  Good schedule
- fitness == 0: Perfect schedule
- fitness < -1000: Bad schedule
```

---

## 6. Genetic Operators Visualization

### Selection (Tournament)

```
Population [S1, S2, S3, S4, S5, S6, ...]

TOURNAMENT 1:
├─ Randomly pick 3: [S2(-150), S4(-220), S1(-180)]
└─ Return best: S2(-150) ← Selected as parent

TOURNAMENT 2:
├─ Randomly pick 3: [S3(-200), S5(-160), S6(-190)]
└─ Return best: S5(-160) ← Selected as parent
```

### Crossover (Single Point)

```
Parent 1 genes:
[C1-Mon-1, C2-Tue-2, C3-Wed-3, C4-Thu-4, C5-Fri-5]

Parent 2 genes:
[C1-Mon-2, C2-Wed-1, C3-Fri-4, C4-Mon-5, C5-Thu-3]

Random crossover point: 3

Child genes (crossover):
[C1-Mon-1, C2-Tue-2, C3-Wed-3 | C4-Mon-5, C5-Thu-3]
                       ↑ crossover point
```

### Mutation (Random Change)

```
Child genes:
[C1-Mon-1, C2-Tue-2, C3-Wed-3, C4-Thu-4, C5-Fri-5]

For each gene (mutation rate = 0.2 = 20% chance):
├─ Gene 1: random() = 0.05 < 0.2 ✓ MUTATE
│  └─ Change to: C1-Wed-4 (random day/period)
├─ Gene 2: random() = 0.75 > 0.2 ✗ KEEP
├─ Gene 3: random() = 0.18 < 0.2 ✓ MUTATE
│  └─ Change to: C3-Thu-6
├─ Gene 4: random() = 0.30 > 0.2 ✗ KEEP
└─ Gene 5: random() = 0.12 < 0.2 ✓ MUTATE
   └─ Change to: C5-Mon-3

Mutated child:
[C1-Wed-4, C2-Tue-2, C3-Thu-6, C4-Thu-4, C5-Mon-3]
```

---

## 7. UI State Management Flow

```
App.jsx State Management
       ↓
┌─────────────────────────────────────────┐
│  showLanding: boolean                   │
│  └─ true → Show landing page            │
│  └─ false → Show main app               │
└─────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────┐
│  activeTab: 'setup' | 'settings' |      │
│              'results'                  │
│  └─ Controls which tab is visible       │
└─────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  Data State                              │
│  ├─ courses: Course[]                    │
│  ├─ instructors: Instructor[]            │
│  ├─ periods: Period[]                    │
│  └─ schedule: ClassSession[] | null      │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  Algorithm State                         │
│  ├─ gaParams: {popSize, generations,     │
│  │              mutationRate}            │
│  ├─ isGenerating: boolean                │
│  └─ progress: {gen, fitness}             │
└──────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────┐
│  Form Input State                        │
│  ├─ newCourse: Partial<Course>           │
│  └─ newInst: {name, courseCodes}         │
└──────────────────────────────────────────┘
```

---

## 8. Component Hierarchy

```
App (Main)
├── {showLanding ? (
│   └── LandingPage
│       ├── Hero section
│       ├── Feature cards
│       └── Start button
│   ) : (
│   └── Main App UI
│       ├── Header
│       │   └── Logo + branding
│       ├── Tabs Navigation
│       │   ├── "1. Data Setup"
│       │   ├── "2. Parameters"
│       │   └── "3. Results"
│       ├── Main Content Area
│       │   ├── Setup Tab (if active)
│       │   │   ├── Courses Section
│       │   │   │   ├── Course list
│       │   │   │   ├── EmptyState (if empty)
│       │   │   │   └── Add course form
│       │   │   ├── Instructors Section
│       │   │   │   ├── Instructor list
│       │   │   │   ├── EmptyState (if empty)
│       │   │   │   └── Add instructor form
│       │   │   └── Generate button
│       │   ├── Settings Tab (if active)
│       │   │   ├── Time Periods Section
│       │   │   │   ├── Periods list
│       │   │   │   └── Add period button
│       │   │   └── Algorithm Parameters
│       │   │       ├── Population size slider
│       │   │       ├── Generations slider
│       │   │       └── Mutation rate slider
│       │   └── Results Tab (if active)
│       │       ├── {isGenerating ? (
│       │       │   └── Loading spinner + progress
│       │       │   ) : !schedule ? (
│       │       │   └── EmptyState
│       │       │   ) : (
│       │       │   └── Results Display
│       │       │       ├── Title + fitness
│       │       │       ├── Export buttons (CSV, PDF)
│       │       │       └── Timetable grid
│       │       └── Success message
│       └── Footer
│           └── (optional)
│   )}
```

---

## 9. Algorithm Decision Tree

```
START
  ↓
Is there initial population?
├─ NO → Create N random schedules
│       └─ For each: initialize() → calculateFitness()
└─ YES → Continue

  ↓
For each generation (0 to maxGen):
  ├─ Sort population by fitness (best first)
  ├─ Save best (elitism)
  │
  ├─ While population < targetSize:
  │   ├─ Parent1 = select() [tournament]
  │   ├─ Parent2 = select() [tournament]
  │   ├─ Child = crossover(P1, P2)
  │   ├─ mutate(Child, mutationRate)
  │   ├─ Child.calculateFitness()
  │   └─ Add Child to new population
  │
  ├─ Replace old population
  ├─ Call onProgress(gen, bestFitness)
  │
  └─ Converged or max gen reached?
     ├─ YES → Return best schedule
     └─ NO → Continue to next generation

END
```

---

**Last Updated:** December 23, 2025  
**Language:** Pure JavaScript (ES6+)  
**Framework:** React 19 with Vite 6.2
