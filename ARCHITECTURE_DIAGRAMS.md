# GenSchedule AI - Visual Architecture & Flow Diagrams

This document contains detailed ASCII diagrams for system architecture, data flow, and workflows.

---

## 1. Complete System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                          GenSchedule AI Application                           │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                      PRESENTATION LAYER (React/TSX)                      │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  ┌─────────────────────┐  ┌──────────────────────┐  ┌──────────────┐   │ │
│  │  │  Landing Page       │  │  Main Workspace      │  │  Tab System  │   │ │
│  │  ├─────────────────────┤  ├──────────────────────┤  ├──────────────┤   │ │
│  │  │ - Hero Section      │  │ - Header             │  │ 1. Setup     │   │ │
│  │  │ - Features Showcase │  │ - Tab Navigation     │  │ 2. Settings  │   │ │
│  │  │ - CTA Button        │  │ - Content Area       │  │ 3. Results   │   │ │
│  │  │ - Animations        │  │ - Responsive Layout  │  │              │   │ │
│  │  └─────────────────────┘  └──────────────────────┘  └──────────────┘   │ │
│  │         │                          │                        │           │ │
│  │         │ onEnter()               │ State Updates          │           │ │
│  │         └──────────────────────────┴────────────────────────┘           │ │
│  │                                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │ │
│  │  │              STATE MANAGEMENT (React Hooks)                        │ │ │
│  │  ├────────────────────────────────────────────────────────────────────┤ │ │
│  │  │                                                                    │ │ │
│  │  │  useState() Variables:                                            │ │ │
│  │  │  ├─ courses: Course[]              (User inputs)                  │ │ │
│  │  │  ├─ instructors: Instructor[]      (User inputs)                  │ │ │
│  │  │  ├─ periods: Period[]              (Configuration)                │ │ │
│  │  │  ├─ gaParams: {pop, gen, mut}      (Algorithm tuning)             │ │ │
│  │  │  ├─ schedule: ClassSession[] | null (Results)                    │ │ │
│  │  │  ├─ isGenerating: boolean           (UI state)                    │ │ │
│  │  │  ├─ progress: {gen, fitness}       (Real-time feedback)           │ │ │
│  │  │  └─ activeTab: 'setup'|'settings'|'results' (Navigation)          │ │ │
│  │  │                                                                    │ │ │
│  │  └────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                 │                                            │
│                    ┌────────────▼────────────┐                             │
│                    │  Event Handlers         │                             │
│                    ├────────────────────────┤                             │
│                    │ - Add/Remove Courses   │                             │
│                    │ - Add/Remove Inst.     │                             │
│                    │ - Configure Periods    │                             │
│                    │ - Adjust GA Params     │                             │
│                    │ - Run Generation       │                             │
│                    │ - Export CSV           │                             │
│                    └────────────┬────────────┘                             │
│                                 │                                            │
│  ┌──────────────────────────────▼──────────────────────────────────────────┐ │
│  │                    BUSINESS LOGIC LAYER                                  │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │ │
│  │  │ GeneticScheduler Class (services/scheduler.ts)                     │ │ │
│  │  ├────────────────────────────────────────────────────────────────────┤ │ │
│  │  │                                                                    │ │ │
│  │  │  Methods:                                                         │ │ │
│  │  │  ├─ constructor(courses, instructors, dayLayouts)                 │ │ │
│  │  │  ├─ initPopulation(popSize)                                       │ │ │
│  │  │  ├─ select(): Schedule                                            │ │ │
│  │  │  ├─ crossover(p1, p2): Schedule                                   │ │ │
│  │  │  ├─ mutate(individual, rate)                                      │ │ │
│  │  │  └─ solve(gen, pop, mut): Promise<Schedule>                       │ │ │
│  │  │                                                                    │ │ │
│  │  └────────────────────────────────────────────────────────────────────┘ │ │
│  │                          │                                              │ │
│  │                ┌─────────▼──────────┐                                   │ │
│  │                │ Schedule Class     │                                   │ │
│  │                ├───────────────────┤                                   │ │
│  │                │ Properties:       │                                   │ │
│  │                │ - genes[]         │                                   │ │
│  │                │ - fitness         │                                   │ │
│  │                │                   │                                   │ │
│  │                │ Methods:          │                                   │ │
│  │                │ - initialize()    │                                   │ │
│  │                │ - calcFitness()   │                                   │ │
│  │                └───────────────────┘                                   │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                 │                                            │
│  ┌──────────────────────────────▼──────────────────────────────────────────┐ │
│  │                    DATA MODEL LAYER                                      │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────────┐    │ │
│  │  │ Course      │  │ Instructor   │  │ Period   │  │ ClassSession │    │ │
│  │  ├─────────────┤  ├──────────────┤  ├──────────┤  ├──────────────┤    │ │
│  │  │ id: string  │  │ id: string   │  │ id: num  │  │ courseCode   │    │ │
│  │  │ code        │  │ name         │  │ timeRng  │  │ dayIndex     │    │ │
│  │  │ credHours   │  │ assignedCrs[]│  │ isBreak  │  │ periodId     │    │ │
│  │  │ isLab       │  │              │  │ isLabSlot│  │ instName     │    │ │
│  │  │ sessReq     │  │              │  │          │  │              │    │ │
│  │  └─────────────┘  └──────────────┘  └──────────┘  └──────────────┘    │ │
│  │                                                                          │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │ Constants:                                                      │   │ │
│  │  │ - DAYS: ["Mon", "Tue", ..., "Sat"]                             │   │ │
│  │  │ - DEFAULT_PERIODS: [Period, ...]                               │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow: User Input to Schedule Output

```
USER INPUT
    │
    ├─┐
    │ ├─ Add Courses (CS301, CS302, CS303, CS304, etc.)
    │ │
    │ ├─ Add Instructors (Dr. Alan, Dr. Codd, etc.)
    │ │
    │ └─ Configure Periods or use defaults
    │
    ▼
STATE: courses[], instructors[], periods[]
    │
    ├─┐
    │ ├─ Adjust GA Parameters:
    │ │  ├─ Population Size: 50
    │ │  ├─ Generations: 500
    │ │  └─ Mutation Rate: 0.1
    │ │
    │ └─ All ready
    │
    ▼
USER CLICKS "GENERATE TIMETABLE"
    │
    ▼
runGeneration() FUNCTION
    │
    ├─ Create Map: dayLayouts (day index → periods)
    │ │
    │ └─ dayLayouts = {
    │     0 → [Period1, Period2, ...],  // Monday
    │     1 → [Period1, Period2, ...],  // Tuesday
    │     ...
    │     5 → [Period1, Period2, ...]   // Saturday
    │   }
    │
    ├─ Create GeneticScheduler Instance:
    │ │
    │ └─ const solver = new GeneticScheduler(
    │     courses, instructors, dayLayouts
    │   )
    │
    ├─ Call solver.solve() ASYNC
    │ │
    │ └─ await solver.solve(
    │     500,           // generations
    │     50,            // population size
    │     0.1,           // mutation rate
    │     (gen, fitness) => setProgress({gen, fitness})
    │   )
    │
    ▼
GENETIC ALGORITHM EVOLUTION
    │
    └─ [See Genetic Algorithm Diagram below]
    
    ▼
RESULT
    │
    ├─ result.genes = [ClassSession[], ClassSession[], ...]
    │
    ├─ result.fitness = -150 (example)
    │
    └─ setSchedule(result.genes)
    
    ▼
STATE UPDATE
    │
    └─ schedule: ClassSession[] (now populated)
    
    ▼
RE-RENDER RESULTS TAB
    │
    ├─ Display Timetable Grid
    │ │
    │ └─ Map schedule to Day × Period grid
    │     ├─ Row headers: Time periods
    │     ├─ Column headers: Days (Mon-Sat)
    │     └─ Cells: ClassSession data
    │
    ├─ Show Fitness Score
    │ │
    │ └─ Display progress.fitness
    │
    └─ Enable Export Button
        │
        └─ Download as CSV
```

---

## 3. Genetic Algorithm Evolution Loop

```
START solve(generations=500, popSize=50, mutationRate=0.1)
    │
    ▼
initPopulation(50)
    │
    ├─ For i = 1 to 50:
    │   ├─ Create Schedule instance
    │   ├─ Call initialize() [random placement]
    │   ├─ Call calculateFitness() [evaluate]
    │   └─ Add to population
    │
    ▼
MAIN LOOP: for generation = 0 to 500
    │
    ├─ STEP 1: SORT BY FITNESS
    │   │
    │   └─ population.sort(by fitness, descending)
    │       First individual = BEST so far
    │
    ├─ STEP 2: ELITISM (Keep top 1)
    │   │
    │   └─ elite = population[0]
    │       newPopulation = [elite]
    │
    ├─ STEP 3: FILL POPULATION (49 offspring)
    │   │
    │   └─ For i = 1 to 49:
    │
    │       ┌─ PARENT SELECTION ─────────────────────┐
    │       │                                         │
    │       │ parent1 = select()                     │
    │       │ - Randomly pick 3 individuals          │
    │       │ - Return best fitness of 3             │
    │       │                                         │
    │       │ parent2 = select()                     │
    │       │ - Randomly pick 3 individuals          │
    │       │ - Return best fitness of 3             │
    │       │                                         │
    │       └─────────────────────────────────────────┘
    │               │
    │               ▼
    │       ┌─ CROSSOVER ────────────────────────────┐
    │       │                                         │
    │       │ child = crossover(parent1, parent2)    │
    │       │                                         │
    │       │ - Pick random point (0 to length)      │
    │       │ - Take parent1 genes[0..point]         │
    │       │ - Take parent2 genes[point..end]       │
    │       │                                         │
    │       │ child.genes = [                         │
    │       │   ...parent1[0..X],                     │
    │       │   ...parent2[X..end]                    │
    │       │ ]                                       │
    │       │                                         │
    │       └─────────────────────────────────────────┘
    │               │
    │               ▼
    │       ┌─ MUTATION ─────────────────────────────┐
    │       │                                         │
    │       │ mutate(child, 0.1)                     │
    │       │                                         │
    │       │ For each gene in child.genes:           │
    │       │   if random() < 0.1:                    │
    │       │     - Pick random day (0-5)            │
    │       │     - Pick random period (non-break)   │
    │       │     - Update gene:                      │
    │       │       gene.dayIndex = newDay            │
    │       │       gene.periodId = newPeriod         │
    │       │                                         │
    │       └─────────────────────────────────────────┘
    │               │
    │               ▼
    │       ┌─ EVALUATE ─────────────────────────────┐
    │       │                                         │
    │       │ child.calculateFitness()                │
    │       │ [See Fitness Calculation Diagram]       │
    │       │                                         │
    │       └─────────────────────────────────────────┘
    │               │
    │               ▼
    │       newPopulation.add(child)
    │
    │
    ├─ STEP 4: REPLACE POPULATION
    │   │
    │   └─ population = newPopulation
    │
    │
    ├─ STEP 5: REPORT PROGRESS
    │   │
    │   └─ if (generation % 10 === 0)
    │       └─ onProgress(generation, population[0].fitness)
    │           └─ Updates UI progress bar
    │
    │
    ├─ STEP 6: CONVERGENCE CHECK
    │   │
    │   └─ if (generation < 500 && fitness < 0)
    │       └─ setTimeout(nextGeneration, 0)
    │           [Non-blocking execution]
    │       else
    │           break
    │
    ▼
END LOOP
    │
    ▼
RETURN population[0]
    │
    └─ Best schedule found (lowest negative fitness)
```

---

## 4. Fitness Calculation Multi-Constraint System

```
calculateFitness() for individual schedule
    │
    ├─ Initialize tracking:
    │  ├─ slotUsage = Map<day-period, count>
    │  ├─ instructorUsage = Map<instructor-day-period, count>
    │  ├─ courseCounts = Map<course, #sessions>
    │  ├─ courseDays = Map<course, Set<days>>
    │  └─ daySchedulePeriods = Map<day, periods[]>
    │
    ├─ penalty = 0
    │
    ▼
FOR EACH ClassSession in genes:
    │
    ├─────────────────────────────────────────────────┐
    │ CONSTRAINT 1: DOUBLE BOOKING (Room Conflicts)  │
    ├─────────────────────────────────────────────────┤
    │                                                 │
    │ slotKey = `${dayIndex}-${periodId}`             │
    │ slotUsage[slotKey]++                            │
    │                                                 │
    │ if (slotUsage[slotKey] > 1)                     │
    │    penalty += 200 ← CRITICAL VIOLATION          │
    │                                                 │
    │ Example:                                        │
    │  - Class 1: Mon-Period1                         │
    │  - Class 2: Mon-Period1 ← CONFLICT              │
    │  - Penalty: 200                                 │
    │                                                 │
    └─────────────────────────────────────────────────┘
    │
    ├─────────────────────────────────────────────────┐
    │ CONSTRAINT 2: INSTRUCTOR CONFLICTS              │
    ├─────────────────────────────────────────────────┤
    │                                                 │
    │ instKey = `${instructorName}-${day}-${period}`  │
    │ instructorUsage[instKey]++                      │
    │                                                 │
    │ if (instructorUsage[instKey] > 1)               │
    │    penalty += 200 ← CRITICAL VIOLATION          │
    │                                                 │
    │ Example:                                        │
    │  - Dr. Alan: Mon-08:00-09:00 (CS301)            │
    │  - Dr. Alan: Mon-08:00-09:00 (CS303) ← CONFLICT │
    │  - Penalty: 200                                 │
    │                                                 │
    └─────────────────────────────────────────────────┘
    │
    ├─────────────────────────────────────────────────┐
    │ CONSTRAINT 3: LAB SLOT ALLOCATION               │
    ├─────────────────────────────────────────────────┤
    │                                                 │
    │ isLabCourse = courseCode.includes('lab')        │
    │ isLabSlot = period.isLabSlot                    │
    │                                                 │
    │ if (isLabCourse && !isLabSlot)                  │
    │    penalty += 50 ← HIGH VIOLATION               │
    │                                                 │
    │ if (!isLabCourse && isLabSlot)                  │
    │    penalty += 10 ← SOFT PREFERENCE              │
    │                                                 │
    │ Example:                                        │
    │  - CS301 Lab scheduled in normal slot: Penalty=50│
    │  - Organic Chemistry scheduled in lab: Penalty=10│
    │                                                 │
    └─────────────────────────────────────────────────┘
    │
    ├─ Update tracking maps (for later constraints)
    │
    ▼
AFTER LOOP, CHECK GLOBAL CONSTRAINTS:
    │
    ├─────────────────────────────────────────────────┐
    │ CONSTRAINT 4: COURSE FREQUENCY                  │
    ├─────────────────────────────────────────────────┤
    │                                                 │
    │ For each course in courses:                     │
    │                                                 │
    │   scheduled = courseCounts[course.code]         │
    │   required = course.sessionsRequired             │
    │                                                 │
    │   if (scheduled < required)                     │
    │       penalty += 100 × (required - scheduled)   │
    │       ← Missing sessions                        │
    │                                                 │
    │   if (scheduled > required)                     │
    │       penalty += 50 × (scheduled - required)    │
    │       ← Extra sessions                          │
    │                                                 │
    │ Example:                                        │
    │  - CS301 needs 3 sessions, scheduled 2          │
    │  - Penalty: 100 × 1 = 100                       │
    │  - CS302 needs 3 sessions, scheduled 4          │
    │  - Penalty: 50 × 1 = 50                         │
    │                                                 │
    └─────────────────────────────────────────────────┘
    │
    ├─────────────────────────────────────────────────┐
    │ CONSTRAINT 5: SAME-DAY MULTIPLE SESSIONS        │
    ├─────────────────────────────────────────────────┤
    │                                                 │
    │ For each course in courseDays:                  │
    │                                                 │
    │   sessions = courseCounts[course]               │
    │   days = courseDays[course].size                │
    │                                                 │
    │   if (sessions > days)                          │
    │       penalty += 30 × (sessions - days)         │
    │                                                 │
    │ Example:                                        │
    │  - CS301: 3 sessions on 2 days (Mon, Wed, Wed)  │
    │  - Days = 2, Sessions = 3                       │
    │  - Penalty: 30 × 1 = 30                         │
    │                                                 │
    └─────────────────────────────────────────────────┘
    │
    ├─────────────────────────────────────────────────┐
    │ CONSTRAINT 6: GAP MINIMIZATION                  │
    ├─────────────────────────────────────────────────┤
    │                                                 │
    │ For each day in daySchedulePeriods:             │
    │   periods = daySchedulePeriods[day]             │
    │   periods.sort()                                │
    │                                                 │
    │   For i = 0 to periods.length - 1:              │
    │     gap = periods[i+1] - periods[i] - 1         │
    │     if (gap > 0)                                │
    │         penalty += gap × 20                     │
    │                                                 │
    │ Example:                                        │
    │  - Monday: Periods [1, 2, 4] (periods 1,2,3,4) │
    │  - Gap1: 2 - 1 - 1 = 0                          │
    │  - Gap2: 4 - 2 - 1 = 1 ← FREE SLOT              │
    │  - Penalty: 1 × 20 = 20                         │
    │                                                 │
    └─────────────────────────────────────────────────┘
    │
    ▼
TOTAL PENALTY CALCULATION
    │
    └─ Total Penalty = Sum of all violations
        │
        ├─ Best: 0 (no violations)
        ├─ Good: -100 to -200 (minor issues)
        ├─ Fair: -200 to -500 (moderate issues)
        ├─ Poor: -500 to -1000 (major issues)
        └─ Worst: < -1000 (severe violations)
    │
    ▼
FITNESS ASSIGNMENT
    │
    └─ fitness = -penalty
        ├─ Higher fitness = Better schedule
        ├─ Fitness 0 = Perfect schedule
        └─ Fitness < 0 = Violations present
```

---

## 5. UI Component Hierarchy & Tabs

```
App (Root Component)
│
├─ State Variables
│  ├─ showLanding: boolean
│  ├─ activeTab: 'setup' | 'settings' | 'results'
│  ├─ courses: Course[]
│  ├─ instructors: Instructor[]
│  ├─ periods: Period[]
│  ├─ gaParams: {populationSize, generations, mutationRate}
│  ├─ schedule: ClassSession[] | null
│  ├─ isGenerating: boolean
│  ├─ progress: {gen, fitness}
│  └─ [new course/instructor input states]
│
├─ Conditional Render
│ │
│ ├─ IF showLanding:
│ │  │
│ │  └─ LandingPage Component
│ │      ├─ Hero Section
│ │      │  ├─ Badge (AI-Powered)
│ │      │  ├─ Title (GenSchedule AI)
│ │      │  ├─ Subtitle
│ │      │  └─ CTA Button
│ │      │
│ │      └─ Feature Cards
│ │          ├─ Card 1: Genetic Evolution
│ │          ├─ Card 2: Conflict Resolution
│ │          └─ Card 3: Smart Visuals
│ │
│ └─ ELSE (Workspace):
│    │
│    ├─ Header Component
│    │  ├─ Logo
│    │  ├─ Title
│    │  ├─ Status Badge
│    │  └─ Back Button
│    │
│    ├─ Tab Navigation
│    │  ├─ "1. Data Setup" tab button
│    │  ├─ "2. Parameters" tab button
│    │  └─ "3. Timetable Results" tab button
│    │
│    └─ Content Area (activeTab-dependent):
│
│       IF activeTab === 'setup':
│       │
│       ├─ TWO-COLUMN GRID
│       │
│       ├─ LEFT: Courses Section
│       │  ├─ Header
│       │  │  ├─ Icon + Title
│       │  │  └─ Count Badge
│       │  │
│       │  ├─ Courses List
│       │  │  ├─ IF empty: EmptyState
│       │  │  └─ IF courses exist:
│       │  │      └─ For each course:
│       │  │          ├─ Course code
│       │  │          ├─ Sessions count
│       │  │          ├─ Lab badge
│       │  │          └─ Delete button
│       │  │
│       │  └─ Add Course Form
│       │     ├─ Code input
│       │     ├─ Checkbox: Is Lab
│       │     ├─ Sessions input
│       │     └─ Add button
│       │
│       ├─ RIGHT: Instructors Section
│       │  ├─ Header
│       │  │  ├─ Icon + Title
│       │  │  └─ Count Badge
│       │  │
│       │  ├─ Instructors List
│       │  │  ├─ IF empty: EmptyState
│       │  │  └─ IF instructors exist:
│       │  │      └─ For each instructor:
│       │  │          ├─ Name
│       │  │          ├─ Assigned courses (chips)
│       │  │          └─ Delete button
│       │  │
│       │  └─ Add Instructor Form
│       │     ├─ Name input
│       │     ├─ Courses input (comma-separated)
│       │     └─ Add button
│       │
│       └─ Generate Button (spans full width)
│          └─ "Generate Timetable" CTA
│
│
│       IF activeTab === 'settings':
│       │
│       ├─ TWO-SECTION LAYOUT
│       │
│       ├─ SECTION 1: Time Layout Configuration
│       │  ├─ Header
│       │  │  ├─ Icon
│       │  │  ├─ Title
│       │  │  └─ Description
│       │  │
│       │  ├─ Periods Table
│       │  │  ├─ Header Row
│       │  │  │  ├─ # (Index)
│       │  │  │  ├─ Time Range
│       │  │  │  ├─ Type (CLASS/BREAK)
│       │  │  │  ├─ Lab? (Checkbox)
│       │  │  │  └─ Actions
│       │  │  │
│       │  │  └─ For each period:
│       │  │      ├─ Index
│       │  │      ├─ Start time input
│       │  │      ├─ Dash separator
│       │  │      ├─ End time input
│       │  │      ├─ CLASS/BREAK button
│       │  │      ├─ Lab checkbox
│       │  │      └─ Delete button
│       │  │
│       │  └─ Add Period Button
│       │
│       └─ SECTION 2: Algorithm Parameters
│          ├─ Header
│          │  ├─ Icon
│          │  ├─ Title
│          │  └─ Description
│          │
│          ├─ Parameter 1: Population Size
│          │  ├─ Label + Value badge
│          │  ├─ Range slider (10-200)
│          │  └─ Help text
│          │
│          ├─ Parameter 2: Max Generations
│          │  ├─ Label + Value badge
│          │  ├─ Range slider (100-2000)
│          │  └─ Help text
│          │
│          ├─ Parameter 3: Mutation Rate
│          │  ├─ Label + Value badge
│          │  ├─ Range slider (0.01-0.5)
│          │  └─ Help text
│          │
│          └─ Back to Setup Link
│
│
│       IF activeTab === 'results':
│       │
│       ├─ IF isGenerating:
│       │  │
│       │  └─ Loading State
│       │     ├─ Animated spinner
│       │     ├─ "Evolving Schedule..." text
│       │     ├─ Description
│       │     ├─ Progress bar
│       │     └─ Gen/Fitness counter
│       │
│       ├─ IF !schedule && !isGenerating:
│       │  │
│       │  └─ EmptyState
│       │     ├─ Icon
│       │     ├─ Title
│       │     └─ Call to action
│       │
│       └─ IF schedule && !isGenerating:
│          │
│          ├─ Header
│          │  ├─ "Generated Schedule" title
│          │  ├─ Fitness badge
│          │  └─ Export CSV button
│          │
│          ├─ Timetable Grid
│          │  ├─ Header row
│          │  │  ├─ "Time / Day" cell (sticky)
│          │  │  └─ For each day (Mon-Sat):
│          │  │      └─ Day name
│          │  │
│          │  └─ For each period:
│          │     ├─ Sticky time column
│          │     │  ├─ Time range
│          │     │  └─ IF break: "BREAK" badge
│          │     │
│          │     └─ For each day:
│          │         ├─ IF break period:
│          │         │  └─ Striped/gray background
│          │         │
│          │         └─ IF session exists:
│          │            ├─ Course code
│          │            ├─ IF lab: "LAB" badge
│          │            ├─ Instructor name
│          │            └─ Color-coded background
│          │         
│          │         OR IF no session:
│          │            └─ Dashed border placeholder
│          │
│          └─ Success Message
│             ├─ Checkmark icon
│             ├─ "Optimization Complete"
│             └─ Explanation text
│
└─ Global Styling
   ├─ Tailwind CSS classes
   ├─ Custom animations
   │  ├─ fade-in-up
   │  ├─ gradient-x
   │  ├─ animate-ping
   │  └─ animate-blob
   └─ Responsive breakpoints
      ├─ Mobile
      ├─ Tablet
      └─ Desktop
```

---

## 6. Data Exchange in Scheduler

```
App.tsx → GeneticScheduler
─────────────────────────────────────────────

Input Data Structure:
{
  courses: [
    {id, code, creditHours, isLab, sessionsRequired},
    ...
  ],
  
  instructors: [
    {id, name, assignedCourses: [codes]},
    ...
  ],
  
  dayLayouts: Map {
    0 → [Period, Period, ...],  // Monday periods
    1 → [Period, Period, ...],  // Tuesday periods
    ...
    5 → [Period, Period, ...]   // Saturday periods
  }
}
        │
        ▼
GeneticScheduler Evolution Process
        │
        ▼
Population: [Schedule, Schedule, ..., Schedule]
        │
        each Schedule contains:
        ├─ genes: [
        │   {courseCode, dayIndex, periodId, instructorName},
        │   {courseCode, dayIndex, periodId, instructorName},
        │   ...
        │ ]
        │
        └─ fitness: -150 (example)
        │
        ▼
After 500 generations:
        │
        ▼
Output: BestSchedule {
  genes: ClassSession[],
  fitness: number
}
        │
        ├─ genes: [
        │   {code: "CS301 Algo", day: 0, period: 1, inst: "Dr. Alan"},
        │   {code: "CS302 DB", day: 1, period: 2, inst: "Dr. Codd"},
        │   ...
        │ ]
        │
        └─ fitness: -0 (optimal) or -150 (near-optimal)
                │
                ▼
            App.tsx
                │
                ├─ setSchedule(result.genes)
                ├─ setProgress({gen: 500, fitness: -0})
                ├─ setIsGenerating(false)
                └─ Re-render Results tab
                        │
                        ▼
                    Timetable Grid Display
```

---

## 7. Event Handler Flow

```
USER ACTIONS → EVENT HANDLERS → STATE UPDATES → RE-RENDER

┌─────────────────────────────────────────────────────────┐
│ Add Course Button Clicked                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ handleAddCourse()                                       │
│ ├─ Validate course code (not empty)                     │
│ ├─ Create course object with:                           │
│ │  ├─ id: Date.now()                                    │
│ │  ├─ code: newCourse.code                              │
│ │  ├─ creditHours: newCourse.creditHours                │
│ │  ├─ isLab: newCourse.isLab                            │
│ │  └─ sessionsRequired: newCourse.sessionsRequired      │
│ │                                                       │
│ ├─ setCourses([...courses, newCourse])                  │
│ └─ setNewCourse({...reset form...})                     │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Delete Course Button Clicked                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ setCourses(courses.filter(c => c.id !== deletedId))    │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Period Edit (Time, Type, Lab)                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ handlePeriodChange(index, field, value)                 │
│ ├─ newPeriods = [...periods]                            │
│ ├─ period = {...newPeriods[index]}                      │
│ │                                                       │
│ ├─ IF field === 'start' or 'end':                       │
│ │  └─ Update timeRange string                           │
│ │                                                       │
│ ├─ ELSE:                                                │
│ │  └─ period[field] = value                             │
│ │                                                       │
│ ├─ newPeriods[index] = period                           │
│ └─ setPeriods(newPeriods)                               │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ GA Parameter Slider Changed                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ setGaParams({                                           │
│   ...gaParams,                                          │
│   populationSize: newValue  // or generations, etc.     │
│ })                                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ "Generate Timetable" Button Clicked                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ runGeneration() ASYNC                                   │
│ ├─ setIsGenerating(true)                                │
│ ├─ setSchedule(null)                                    │
│ ├─ setActiveTab('results')                              │
│ │                                                       │
│ ├─ Create dayLayouts Map:                               │
│ │  └─ for (0-5 days): layoutMap.set(day, periods)       │
│ │                                                       │
│ ├─ new GeneticScheduler(courses, instructors, map)      │
│ │                                                       │
│ ├─ await scheduler.solve(                               │
│ │   gaParams.generations,                               │
│ │   gaParams.populationSize,                            │
│ │   gaParams.mutationRate,                              │
│ │   (gen, fit) => setProgress({gen, fitness: fit})      │
│ │ )                                                     │
│ │                                                       │
│ ├─ setSchedule(result.genes)                            │
│ └─ setIsGenerating(false)                               │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Export CSV Button Clicked                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ downloadCSV()                                           │
│ ├─ Create CSV header                                    │
│ ├─ Sort schedule by day then period                     │
│ ├─ For each session:                                    │
│ │  └─ csv += "Day,Period,Time,Course,Instructor\n"      │
│ │                                                       │
│ ├─ Create Blob from CSV string                          │
│ ├─ Create download link                                 │
│ ├─ Click link to trigger download                       │
│ └─ File: timetable.csv                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Type Definition Relationships

```
App Component Uses:
├─ Course[] (array of course objects)
│  ├─ id: string
│  ├─ code: string (e.g., "CS301 Algo")
│  ├─ creditHours: number
│  ├─ isLab: boolean
│  └─ sessionsRequired: number (e.g., 3)
│
├─ Instructor[] (array of instructor objects)
│  ├─ id: string
│  ├─ name: string
│  └─ assignedCourses: string[] (array of course codes)
│
├─ Period[] (array of time period objects)
│  ├─ id: number (sequential)
│  ├─ timeRange: string (e.g., "08:00-09:00")
│  ├─ isBreak: boolean
│  └─ isLabSlot: boolean
│
└─ ClassSession[] (output from scheduler)
   ├─ courseCode: string
   ├─ dayIndex: number (0=Monday, 5=Saturday)
   ├─ periodId: number (references Period.id)
   └─ instructorName: string

Relationships:
─────────────

ClassSession.courseCode → Course.code
ClassSession.instructorName → Instructor.name
ClassSession.periodId → Period.id
ClassSession.dayIndex → DAYS array (0-5)

Example Data Flow:
──────────────────

Course "CS301 Algo"
    ↓ assigned to
Instructor "Dr. Alan Turing"
    ↓ scheduled as
ClassSession {
  courseCode: "CS301 Algo",
  instructorName: "Dr. Alan Turing",
  dayIndex: 0 (Monday),
  periodId: 1
}
    ↓ rendered as
Cell in Timetable:
  Time: periods.find(p => p.id === 1).timeRange
  Day: DAYS[0] = "Monday"
  Content: "CS301 Algo - Dr. Alan Turing"
```

---

This document provides complete visual reference for all system components, flows, and interactions in GenSchedule AI.
