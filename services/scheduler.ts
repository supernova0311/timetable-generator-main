import { Course, Instructor, Period, ClassSession, DAYS } from '../types';

// Random Helper Functions
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDouble = () => Math.random();

export class Schedule {
  genes: ClassSession[] = [];
  fitness: number = 0;

  private courses: Course[];
  private instructors: Instructor[];
  private dayLayouts: Map<number, Period[]>;

  constructor(courses: Course[], instructors: Instructor[], dayLayouts: Map<number, Period[]>) {
    this.courses = courses;
    this.instructors = instructors;
    this.dayLayouts = dayLayouts;
  }

  initialize() {
    this.genes = [];
    for (const course of this.courses) {
      let instructor = "Unassigned";
      // Find instructor
      for (const inst of this.instructors) {
        if (inst.assignedCourses.includes(course.code)) {
          instructor = inst.name;
          break;
        }
      }

      for (let i = 0; i < course.sessionsRequired; ++i) {
        const day = randomInt(0, DAYS.length - 1);
        const periods = this.dayLayouts.get(day) || [];
        
        let pIdx: number;
        let attempts = 0;
        do {
          pIdx = randomInt(0, periods.length - 1);
          attempts++;
        } while (periods[pIdx].isBreak && attempts < 50); // Avoid infinite loop safety

        if (!periods[pIdx].isBreak) {
             this.genes.push({
                courseCode: course.code,
                dayIndex: day,
                periodId: periods[pIdx].id,
                instructorName: instructor
            });
        }
      }
    }
  }

  private isLabPeriod(day: number, periodId: number): boolean {
    const periods = this.dayLayouts.get(day) || [];
    const p = periods.find(per => per.id === periodId);
    return p ? p.isLabSlot : false;
  }

  calculateFitness() {
    let penalty = 0;

    const slotUsage = new Map<string, number>();
    const instructorUsage = new Map<string, number>();
    const courseCounts = new Map<string, number>();
    const courseDays = new Map<string, Set<number>>();
    const daySchedulePeriods = new Map<number, number[]>();

    for (const session of this.genes) {
      // Track course counts
      courseCounts.set(session.courseCode, (courseCounts.get(session.courseCode) || 0) + 1);
      
      // Track course days
      if (!courseDays.has(session.courseCode)) {
        courseDays.set(session.courseCode, new Set());
      }
      courseDays.get(session.courseCode)?.add(session.dayIndex);

      // 1. Check Double Booking (Room Conflict)
      const slotKey = `${session.dayIndex}-${session.periodId}`;
      const slotCount = (slotUsage.get(slotKey) || 0) + 1;
      slotUsage.set(slotKey, slotCount);
      if (slotCount > 1) penalty += 200;

      // 2. Instructor Conflict
      if (session.instructorName !== "Unassigned") {
        const instKey = `${session.instructorName}-${session.dayIndex}-${session.periodId}`;
        const instCount = (instructorUsage.get(instKey) || 0) + 1;
        instructorUsage.set(instKey, instCount);
        if (instCount > 1) penalty += 200;
      }

      // 3. Lab Constraints
      const isLabCourse = session.courseCode.toLowerCase().includes('lab');
      const slotAllowsLab = this.isLabPeriod(session.dayIndex, session.periodId);

      if (isLabCourse && !slotAllowsLab) penalty += 50;
      if (!isLabCourse && slotAllowsLab) penalty += 10; // Prefer keeping lab slots for labs

      // Record for gap calculation
      if (!daySchedulePeriods.has(session.dayIndex)) {
        daySchedulePeriods.set(session.dayIndex, []);
      }
      daySchedulePeriods.get(session.dayIndex)?.push(session.periodId);
    }

    // 4. Check Course Frequency
    for (const course of this.courses) {
      const scheduled = courseCounts.get(course.code) || 0;
      if (scheduled < course.sessionsRequired) penalty += 100 * (course.sessionsRequired - scheduled);
      if (scheduled > course.sessionsRequired) penalty += 50 * (scheduled - course.sessionsRequired);
    }

    // 5. Multiple sessions same day
    for (const [code, days] of courseDays.entries()) {
      const count = courseCounts.get(code) || 0;
      if (count > days.size) {
        penalty += 30 * (count - days.size);
      }
    }

    // 6. Gap Analysis
    daySchedulePeriods.forEach((periods) => {
      periods.sort((a, b) => a - b);
      for (let i = 0; i < periods.length - 1; ++i) {
        // Simple gap check based on ID diff. 
        // Logic assumes IDs are sequential. 
        const gap = periods[i+1] - periods[i] - 1;
        if (gap > 0) penalty += gap * 20;
      }
    });

    this.fitness = -penalty;
  }
}

export class GeneticScheduler {
  private population: Schedule[] = [];
  private courses: Course[];
  private instructors: Instructor[];
  private dayLayouts: Map<number, Period[]>;

  constructor(courses: Course[], instructors: Instructor[], dayLayouts: Map<number, Period[]>) {
    this.courses = courses;
    this.instructors = instructors;
    this.dayLayouts = dayLayouts;
  }

  initPopulation(popSize: number) {
    this.population = [];
    for (let i = 0; i < popSize; ++i) {
      const sched = new Schedule(this.courses, this.instructors, this.dayLayouts);
      sched.initialize();
      sched.calculateFitness();
      this.population.push(sched);
    }
  }

  select(): Schedule {
    const tournamentSize = 3;
    let best: Schedule | null = null;
    
    for (let i = 0; i < tournamentSize; ++i) {
      const idx = randomInt(0, this.population.length - 1);
      const ind = this.population[idx];
      if (!best || ind.fitness > best.fitness) {
        best = ind;
      }
    }
    return best!;
  }

  crossover(parent1: Schedule, parent2: Schedule): Schedule {
    const child = new Schedule(this.courses, this.instructors, this.dayLayouts);
    // Deep copy genes to avoid reference issues
    child.genes = [...parent1.genes];
    
    const cxPoint = randomInt(0, parent1.genes.length - 1);
    
    for (let i = cxPoint; i < parent1.genes.length; i++) {
        // Safe access check
        if(parent2.genes[i]) {
            child.genes[i] = {...parent2.genes[i]};
        }
    }
    return child;
  }

  mutate(ind: Schedule, mutationRate: number) {
    for (let i = 0; i < ind.genes.length; i++) {
      if (randomDouble() < mutationRate) {
        const newDay = randomInt(0, DAYS.length - 1);
        const periods = this.dayLayouts.get(newDay) || [];
        
        let pIdx;
        let attempts = 0;
        do {
          pIdx = randomInt(0, periods.length - 1);
          attempts++;
        } while (periods[pIdx].isBreak && attempts < 50);

        if(!periods[pIdx].isBreak) {
            ind.genes[i].dayIndex = newDay;
            ind.genes[i].periodId = periods[pIdx].id;
        }
      }
    }
  }

  async solve(generations: number, popSize: number, mutationRate: number, onProgress?: (gen: number, fit: number) => void): Promise<Schedule> {
    return new Promise((resolve) => {
        // Use setTimeout to allow UI updates (non-blocking loop)
        this.initPopulation(popSize);
        
        let gen = 0;
        
        const runGeneration = () => {
            const nextGen: Schedule[] = [];
            
            // Elitism
            this.population.sort((a, b) => b.fitness - a.fitness);
            nextGen.push(this.population[0]);

            while(nextGen.length < popSize) {
                const p1 = this.select();
                const p2 = this.select();
                const child = this.crossover(p1, p2);
                this.mutate(child, mutationRate);
                child.calculateFitness();
                nextGen.push(child);
            }
            
            this.population = nextGen;

            if (onProgress && gen % 10 === 0) {
                onProgress(gen, this.population[0].fitness);
            }

            gen++;
            if (gen < generations && this.population[0].fitness < 0) {
                setTimeout(runGeneration, 0);
            } else {
                resolve(this.population[0]);
            }
        };

        runGeneration();
    });
  }
}