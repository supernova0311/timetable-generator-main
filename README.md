# GenSchedule AI

An intelligent academic timetable generator powered by genetic algorithms. GenSchedule AI automates the complex process of creating conflict-free academic schedules that optimize resource utilization and satisfy multiple constraints.

## Features

✨ **AI-Powered Optimization**
- Genetic algorithm engine for optimal schedule generation
- Automatically resolves scheduling conflicts
- Maximizes resource utilization
- Real-time progress tracking during generation

🎓 **Academic-Focused**
- Support for courses, lab sessions, and multiple instructors
- Flexible period management with break times
- Lab slot designation and constraints
- Support for multiple course sessions per week

⚙️ **Constraint Satisfaction**
- Prevents double-booking conflicts (room conflicts)
- Ensures instructor availability (no overlapping assignments)
- Respects lab course requirements
- Balances course distribution across weekdays
- Minimizes gaps between classes

📊 **Visual Interface**
- Beautiful, modern UI built with React 19
- Real-time schedule generation and visualization
- Easy course and instructor management
- Download schedule as CSV or PDF

## Tech Stack

- **Frontend**: React 19 (JavaScript, no TypeScript)
- **Build Tool**: Vite 6.2 (fast dev server with HMR)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Export**: html2canvas + jsPDF for PDF generation
- **Optimization**: Custom Genetic Algorithm Implementation

## Project Structure

```
├── App.jsx                      # Main application component with UI
├── types.js                     # Constants and data structures
├── services/
│   └── scheduler.js             # Genetic algorithm scheduler
├── index.jsx                    # React entry point
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
├── package.json                 # Project dependencies
└── documentation/
    ├── README.md               # This file
    ├── PROJECT_REPORT.md       # Detailed project report
    ├── DOCUMENTATION_INDEX.md  # File structure guide
    ├── API_REFERENCE.md        # API documentation
    └── ARCHITECTURE_DIAGRAMS.md # Architecture overview
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd genschedule-ai
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server with Vite:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` with hot module reloading enabled.

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How It Works

### Genetic Algorithm Approach

The scheduler uses a genetic algorithm to evolve schedules toward optimal solutions:

1. **Initialization**: Creates random initial schedules with courses assigned to random time slots
2. **Fitness Evaluation**: Calculates fitness scores based on constraint violations:
   - Room conflicts (double-booking): -200 points
   - Instructor conflicts: -200 points
   - Lab constraint violations: -50 points
   - Lab slot optimization: -10 points
   - Course frequency violations: -100 to -50 points
   - Class distribution: -30 points per issue
   - Gap analysis: -20 points per gap

3. **Selection**: Tournament selection picks top-performing schedules for reproduction
4. **Crossover**: Creates new schedules by combining parent schedules
5. **Mutation**: Randomly modifies schedules to prevent local optima
6. **Iteration**: Repeats until convergence or optimal solution is found

### Data Models

#### Course (Object)
```javascript
{
  id: string,              // Unique identifier
  code: string,            // Course code (e.g., "CS301 Algo")
  creditHours: number,     // Credit hours
  isLab: boolean,          // Whether it's a lab course
  sessionsRequired: number // Sessions per week
}
```

#### Instructor (Object)
```javascript
{
  id: string,              // Unique identifier
  name: string,            // Instructor name
  assignedCourses: string[] // List of course codes
}
```

#### Period (Object)
```javascript
{
  id: number,              // Period identifier
  timeRange: string,       // Time slot (e.g., "08:00-09:00")
  isBreak: boolean,        // Whether it's a break period
  isLabSlot: boolean       // Whether it's a lab time slot
}
```

#### ClassSession (Object)
```javascript
{
  courseCode: string,      // Course code
  dayIndex: number,        // Day of week (0=Monday, 5=Saturday)
  periodId: number,        // Period identifier
  instructorName: string   // Assigned instructor name
}
```

## Usage

1. **Add Courses**: Input course details including credit hours and required sessions
2. **Add Instructors**: Add instructors and assign them to courses
3. **Configure Periods**: Customize time periods, breaks, and lab slots
4. **Adjust Parameters**:
   - Population Size (10-200): More schedules = better solution but slower
   - Generations (100-2000): More iterations = better solution but slower
   - Mutation Rate (0.01-0.5): Chance to randomly change a slot
5. **Generate Schedule**: Click the generate button to run the genetic algorithm
6. **Download**: Export the schedule as CSV or PDF

## Constraints & Rules

- **No double-booking**: Each room (time slot) can only host one class
- **Instructor availability**: No instructor can teach two classes at the same time
- **Lab requirements**: Lab courses must be scheduled in designated lab time slots
- **Workload distribution**: Attempts to balance course distribution across days
- **Break respect**: Classes are not scheduled during break periods
- **Gap minimization**: Minimizes gaps between classes on each day

## Export Options

### CSV Export
Downloads schedule as comma-separated values for Excel/Sheets

### PDF Export
Generates a professional PDF with:
- Complete timetable view
- Color-coded courses and labs
- Instructor assignments
- Time information

## File Organization

| File | Purpose |
|------|---------|
| `App.jsx` | Main UI component with landing page, tabs, and forms |
| `types.js` | Constants (DAYS, DEFAULT_PERIODS) and data structures |
| `services/scheduler.js` | Core genetic algorithm implementation |
| `index.jsx` | React entry point that mounts App to DOM |
| `vite.config.js` | Vite bundler configuration |
| `index.html` | HTML template with root element |

## API Reference

### GeneticScheduler Class

Main class for genetic algorithm scheduling.

```javascript
const scheduler = new GeneticScheduler(courses, instructors, dayLayouts);

// Solve with parameters
const result = await scheduler.solve(
  generations,     // Number of iterations (int)
  popSize,        // Population size (int)
  mutationRate,   // Mutation probability (0-1)
  onProgress      // Callback: (generation, fitness) => void
);

// Returns: Schedule object with genes[] and fitness score
```

### Schedule Class

Represents one schedule solution.

```javascript
const schedule = new Schedule(courses, instructors, dayLayouts);

schedule.initialize();        // Create random schedule
schedule.calculateFitness();  // Calculate fitness score
schedule.isLabPeriod(day, periodId);  // Check if slot is lab
```

### Helper Functions

```javascript
randomInt(min, max)    // Random integer in range
randomDouble()         // Random number 0-1
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

[Ayush Sharma](https://github.com/supernova0311)

## Support

For questions or issues, please open an issue on the GitHub repository.

---

**GenSchedule AI** - Making academic scheduling smart and effortless! 🎓✨
