# GenSchedule AI

An intelligent academic timetable generator powered by genetic algorithms. GenSchedule AI automates the complex process of creating conflict-free academic schedules that optimize resource utilization and satisfy multiple constraints.

## Features

✨ **AI-Powered Optimization**
- Genetic algorithm engine for optimal schedule generation
- Automatically resolves scheduling conflicts
- Maximizes resource utilization

🎓 **Academic-Focused**
- Support for courses, lab sessions, and multiple instructors
- Flexible period management with break times
- Lab slot designation and constraints

⚙️ **Constraint Satisfaction**
- Prevents double-booking conflicts (room conflicts)
- Ensures instructor availability (no overlapping assignments)
- Respects lab course requirements
- Balances course distribution across weekdays
- Prevents instructor fatigue with workload optimization

📊 **Visual Interface**
- Beautiful, modern UI built with React
- Real-time schedule generation and visualization
- Easy course and instructor management
- Download schedule as JSON

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Optimization**: Custom Genetic Algorithm Implementation

## Project Structure

```
├── App.tsx                 # Main application component with UI
├── types.ts               # TypeScript interfaces and constants
├── services/
│   └── scheduler.ts       # Genetic algorithm scheduler implementation
├── index.tsx              # React entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/supernova0311/genschedule-ai.git
cd genschedule-ai
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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
   - Workload distribution: variable penalty
3. **Selection**: Selects top-performing schedules for reproduction
4. **Crossover & Mutation**: Creates new schedules by combining and modifying existing ones
5. **Iteration**: Repeats until convergence or optimal solution is found

### Data Models

#### Course
- `id`: Unique identifier
- `code`: Course code (e.g., "CS101")
- `creditHours`: Credit hours
- `isLab`: Whether it's a lab course
- `sessionsRequired`: Number of sessions per week

#### Instructor
- `id`: Unique identifier
- `name`: Instructor name
- `assignedCourses`: List of course codes they teach

#### Period
- `id`: Period identifier
- `timeRange`: Time slot (e.g., "08:00-09:00")
- `isBreak`: Whether it's a break period
- `isLabSlot`: Whether it can accommodate lab sessions

#### ClassSession
- `courseCode`: Code of the course
- `dayIndex`: Day of week (0=Monday, 5=Saturday)
- `periodId`: Period identifier
- `instructorName`: Assigned instructor name

## Usage

1. **Add Courses**: Input course details including credit hours and required sessions
2. **Add Instructors**: Add instructors and assign them to courses
3. **Configure Periods**: Customize time periods, breaks, and lab slots
4. **Generate Schedule**: Click the generate button to run the genetic algorithm
5. **Download**: Export the generated schedule as JSON

## Constraints & Rules

- **No double-booking**: Each room (time slot) can only host one class
- **Instructor availability**: No instructor can teach two classes at the same time
- **Lab requirements**: Lab courses must be scheduled in designated lab time slots
- **Workload distribution**: Attempts to balance instructor workload across the week
- **Break respect**: Classes are not scheduled during break periods

## API Reference

### GeneticScheduler

The main scheduler class that implements the genetic algorithm.

```typescript
const scheduler = new GeneticScheduler(
  courses,
  instructors,
  dayLayouts,
  populationSize,
  generations,
  mutationRate
);

const result = scheduler.schedule();
// Returns: { genes: ClassSession[], fitness: number }
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

[Ayush Kumar](https://github.com/supernova0311)

## Support

For questions or issues, please open an issue on the GitHub repository.

---

**GenSchedule AI** - Making academic scheduling smart and effortless! 🎓✨
