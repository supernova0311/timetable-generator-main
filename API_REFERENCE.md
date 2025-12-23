# GenSchedule AI - API Reference

Complete API documentation for GenSchedule AI JavaScript functions and classes.

---

## Table of Contents

1. [Helper Functions](#helper-functions)
2. [Schedule Class](#schedule-class)
3. [GeneticScheduler Class](#geneticscheduler-class)
4. [Constants](#constants)
5. [React Components](#react-components)
6. [Data Objects](#data-objects)

---

## Helper Functions

### randomInt(min, max)

Generates a random integer between min and max (inclusive).

**Signature:**
```javascript
function randomInt(min, max)
```

**Parameters:**
- `min` (number): Minimum value (inclusive)
- `max` (number): Maximum value (inclusive)

**Returns:** 
- (number) Random integer in range [min, max]

**Example:**
```javascript
const day = randomInt(0, 5);      // Returns 0-5
const period = randomInt(1, 7);   // Returns 1-7
```

**Implementation:**
```javascript
Math.floor(Math.random() * (max - min + 1)) + min
```

---

### randomDouble()

Generates a random decimal between 0 and 1.

**Signature:**
```javascript
function randomDouble()
```

**Returns:** 
- (number) Random decimal in range [0, 1)

**Example:**
```javascript
if (randomDouble() < mutationRate) {
  // Mutate this gene
}
```

**Implementation:**
```javascript
Math.random()
```

---

## Schedule Class

Represents a single schedule solution with courses assigned to time slots.

### Constructor

```javascript
new Schedule(courses, instructors, dayLayouts)
```

**Parameters:**
- `courses` (Array) - Array of course objects
- `instructors` (Array) - Array of instructor objects
- `dayLayouts` (Map) - Map of day index to periods array

**Properties:**
- `genes` (Array) - Array of ClassSession objects
- `fitness` (number) - Fitness score of this schedule
- `courses` (Array) - Reference to courses
- `instructors` (Array) - Reference to instructors
- `dayLayouts` (Map) - Reference to day layouts

**Example:**
```javascript
const schedule = new Schedule(courses, instructors, layoutMap);
// schedule.genes = []
// schedule.fitness = 0
```

---

### initialize()

Creates a random schedule by assigning courses to random time slots.

**Signature:**
```javascript
schedule.initialize()
```

**Returns:** 
- undefined (modifies schedule.genes in place)

**Algorithm:**
1. For each course:
   - Find assigned instructor
   - For each required session:
     - Pick random day (0-5)
     - Pick random non-break period
     - Add ClassSession to genes array

**Example:**
```javascript
const schedule = new Schedule(courses, instructors, layoutMap);
schedule.initialize();  // Now has random class assignments
console.log(schedule.genes.length);  // Number of class sessions
```

---

### calculateFitness()

Evaluates the schedule against all constraints and calculates fitness score.

**Signature:**
```javascript
schedule.calculateFitness()
```

**Returns:** 
- undefined (modifies schedule.fitness in place)

**Constraints Checked:**
1. **Double Booking** (-200): Same room used twice
2. **Instructor Conflict** (-200): Same instructor twice
3. **Lab Violations** (-50): Lab in non-lab slot
4. **Course Frequency** (-100 to -50): Wrong number of sessions
5. **Distribution** (-30): Multiple same-day sessions
6. **Gap Analysis** (-20 per gap): Minimize gaps

**Fitness Calculation:**
```
fitness = -penalty
```
Higher is better. 0 is perfect.

**Example:**
```javascript
schedule.calculateFitness();
console.log(schedule.fitness);  // -450 (bad), -10 (good)
```

---

### isLabPeriod(day, periodId)

Checks if a given day/period is designated as a lab slot.

**Signature:**
```javascript
schedule.isLabPeriod(day, periodId)
```

**Parameters:**
- `day` (number) - Day index (0-5)
- `periodId` (number) - Period ID (1-7)

**Returns:**
- (boolean) true if it's a lab period, false otherwise

**Example:**
```javascript
if (schedule.isLabPeriod(0, 7)) {
  console.log("Monday period 7 is a lab slot");
}
```

---

## GeneticScheduler Class

Main class implementing the genetic algorithm for schedule optimization.

### Constructor

```javascript
new GeneticScheduler(courses, instructors, dayLayouts)
```

**Parameters:**
- `courses` (Array) - Array of course objects
- `instructors` (Array) - Array of instructor objects
- `dayLayouts` (Map) - Map of day index to periods array

**Properties:**
- `population` (Array) - Current population of Schedule objects
- `courses` (Array) - Reference to courses
- `instructors` (Array) - Reference to instructors
- `dayLayouts` (Map) - Reference to day layouts

**Example:**
```javascript
const layoutMap = new Map();
for (let i = 0; i < 6; i++) {
  layoutMap.set(i, periods);
}

const scheduler = new GeneticScheduler(courses, instructors, layoutMap);
```

---

### initPopulation(popSize)

Creates initial population of random schedules.

**Signature:**
```javascript
scheduler.initPopulation(popSize)
```

**Parameters:**
- `popSize` (number) - Population size (10-200 recommended)

**Returns:** 
- undefined (modifies scheduler.population)

**Process:**
1. Clear existing population
2. For each of popSize:
   - Create new Schedule
   - Call initialize()
   - Call calculateFitness()
   - Add to population

**Example:**
```javascript
scheduler.initPopulation(50);  // Create 50 random schedules
console.log(scheduler.population.length);  // 50
```

---

### select()

Tournament selection - picks best schedule from random group.

**Signature:**
```javascript
scheduler.select()
```

**Returns:** 
- (Schedule) Best schedule from tournament

**Algorithm:**
1. Pick 3 random schedules
2. Return the one with highest fitness

**Example:**
```javascript
const parent = scheduler.select();
console.log(parent.fitness);  // Good schedule
```

---

### crossover(parent1, parent2)

Creates child schedule by mixing two parents.

**Signature:**
```javascript
scheduler.crossover(parent1, parent2)
```

**Parameters:**
- `parent1` (Schedule) - First parent
- `parent2` (Schedule) - Second parent

**Returns:** 
- (Schedule) New child schedule

**Algorithm:**
1. Copy all genes from parent1
2. Pick random crossover point
3. Replace genes after point with parent2's genes

**Example:**
```javascript
const p1 = scheduler.select();
const p2 = scheduler.select();
const child = scheduler.crossover(p1, p2);
```

---

### mutate(schedule, mutationRate)

Randomly modifies schedule genes.

**Signature:**
```javascript
scheduler.mutate(schedule, mutationRate)
```

**Parameters:**
- `schedule` (Schedule) - Schedule to mutate
- `mutationRate` (number) - Probability 0-1

**Returns:** 
- undefined (modifies schedule in place)

**Algorithm:**
1. For each gene:
   - If random() < mutationRate:
     - Pick new random day
     - Pick new random period
     - Update gene

**Example:**
```javascript
scheduler.mutate(child, 0.1);  // 10% chance per gene
```

---

### solve(generations, popSize, mutationRate, onProgress)

Main async function that runs the genetic algorithm.

**Signature:**
```javascript
scheduler.solve(generations, popSize, mutationRate, onProgress)
```

**Parameters:**
- `generations` (number) - Number of iterations (100-2000)
- `popSize` (number) - Population size (10-200)
- `mutationRate` (number) - Mutation probability (0.01-0.5)
- `onProgress` (function) - Callback (gen, fitness) => void

**Returns:** 
- (Promise<Schedule>) Best schedule found

**Algorithm:**
1. Initialize population
2. For each generation:
   - Sort by fitness
   - Keep best (elitism)
   - Create children via crossover + mutate
   - Evaluate new generation
   - Call onProgress callback
   - Continue if not converged
3. Return best schedule

**Example:**
```javascript
const result = await scheduler.solve(
  500,      // generations
  50,       // population size
  0.1,      // mutation rate
  (gen, fit) => {
    console.log(`Gen ${gen}: fitness ${fit}`);
  }
);

console.log(result.genes);   // Best schedule
console.log(result.fitness); // Score
```

---

## Constants

### DAYS

Array of day names for the week.

```javascript
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
```

**Type:** Array<string>

**Usage:**
```javascript
const dayName = DAYS[0];  // "Monday"
```

---

### DEFAULT_PERIODS

Default time periods for the school day.

```javascript
const DEFAULT_PERIODS = [
  { id: 1, timeRange: "08:00-09:00", isBreak: false, isLabSlot: false },
  { id: 2, timeRange: "09:00-10:00", isBreak: false, isLabSlot: false },
  { id: 3, timeRange: "10:00-10:30", isBreak: true, isLabSlot: false },
  { id: 4, timeRange: "10:30-11:30", isBreak: false, isLabSlot: false },
  { id: 5, timeRange: "11:30-12:30", isBreak: false, isLabSlot: false },
  { id: 6, timeRange: "12:30-14:00", isBreak: true, isLabSlot: false },
  { id: 7, timeRange: "14:00-16:30", isBreak: false, isLabSlot: true }
];
```

**Type:** Array<Period>

**Usage:**
```javascript
const periods = DEFAULT_PERIODS;
const breakTime = periods[2];  // 10:00-10:30 break
```

---

## React Components

### App Component

Main application component with full UI.

**Exports:**
```javascript
export default function App()
```

**State:**
```javascript
const [showLanding, setShowLanding] = useState(true);
const [activeTab, setActiveTab] = useState('setup');
const [courses, setCourses] = useState([...]);
const [instructors, setInstructors] = useState([...]);
const [periods, setPeriods] = useState(DEFAULT_PERIODS);
const [isGenerating, setIsGenerating] = useState(false);
const [progress, setProgress] = useState({ gen: 0, fitness: -1000 });
const [schedule, setSchedule] = useState(null);
const [gaParams, setGaParams] = useState({...});
```

**Functions:**
- `handleAddCourse()` - Add new course
- `handleAddInstructor()` - Add new instructor
- `handlePeriodChange(index, field, value)` - Modify period
- `addPeriod()` - Create new period
- `removePeriod(index)` - Delete period
- `runGeneration()` - Start algorithm
- `downloadCSV()` - Export as CSV
- `downloadPDF()` - Export as PDF

---

### LandingPage Component

Splash screen shown at startup.

```javascript
function LandingPage({ onEnter })
```

**Props:**
- `onEnter` (function) - Callback when user clicks start

---

### Header Component

Navigation header with branding.

```javascript
function Header({ onBack })
```

**Props:**
- `onBack` (function) - Callback for back button

---

### EmptyState Component

Shows when no data exists.

```javascript
function EmptyState({ title, desc, icon: Icon })
```

**Props:**
- `title` (string) - Heading text
- `desc` (string) - Description text
- `icon` (React component) - Lucide icon

---

## Data Objects

### Course Object

Represents a course that needs scheduling.

```javascript
{
  id: string,              // Unique ID
  code: string,            // Course code (e.g., "CS301 Algo")
  creditHours: number,     // Credit hours (3-4)
  isLab: boolean,          // Is this a lab course?
  sessionsRequired: number // Sessions per week (1-5)
}
```

---

### Instructor Object

Represents a faculty member.

```javascript
{
  id: string,              // Unique ID
  name: string,            // Full name
  assignedCourses: string[] // Course codes taught
}
```

---

### Period Object

Represents a time slot in the day.

```javascript
{
  id: number,              // Period number (1-7)
  timeRange: string,       // Start-end time "08:00-09:00"
  isBreak: boolean,        // Is this a break time?
  isLabSlot: boolean       // Can labs be scheduled here?
}
```

---

### ClassSession Object

Represents one scheduled class.

```javascript
{
  courseCode: string,      // Which course
  dayIndex: number,        // Day (0=Mon, 5=Sat)
  periodId: number,        // Period ID (1-7)
  instructorName: string   // Assigned instructor
}
```

---

### Schedule Object

Represents a complete schedule solution.

```javascript
{
  genes: ClassSession[],   // All class sessions
  fitness: number          // Fitness score (higher=better)
}
```

---

## Usage Examples

### Complete Workflow

```javascript
// 1. Setup data
const courses = [
  { id: '1', code: 'CS301', creditHours: 4, isLab: false, sessionsRequired: 3 }
];
const instructors = [
  { id: '1', name: 'Dr. Smith', assignedCourses: ['CS301'] }
];
const periods = DEFAULT_PERIODS;

// 2. Create layout map
const layoutMap = new Map();
for (let i = 0; i < 6; i++) {
  layoutMap.set(i, periods);
}

// 3. Create scheduler
const scheduler = new GeneticScheduler(courses, instructors, layoutMap);

// 4. Run algorithm
const result = await scheduler.solve(
  500,      // generations
  50,       // population size
  0.1,      // mutation rate
  (gen, fit) => {
    console.log(`Generation ${gen}: ${fit}`);
  }
);

// 5. Use result
console.log(result.genes);   // All class assignments
console.log(result.fitness); // Overall score
```

---

## Type Definitions (JavaScript Objects)

Since this is pure JavaScript, we use objects for types:

```javascript
// Course type
{ id, code, creditHours, isLab, sessionsRequired }

// Instructor type
{ id, name, assignedCourses }

// Period type
{ id, timeRange, isBreak, isLabSlot }

// ClassSession type
{ courseCode, dayIndex, periodId, instructorName }

// Schedule type
{ genes, fitness }
```

---

**API Version:** 1.0  
**Last Updated:** December 23, 2025
