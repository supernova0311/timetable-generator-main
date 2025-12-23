// ============================================
// GENETIC SCHEDULER - SIMPLE VERSION
// This file finds the best class timetable
// using genetic algorithm (like C++ struct approach)
// ============================================

import { DAYS } from '../types.js';

// ============================================
// SIMPLE HELPER FUNCTIONS
// ============================================

// Get a random number between min and max (like rand() in C++)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get a random decimal between 0 and 1
function randomDouble() {
  return Math.random();
}

// ============================================
// SCHEDULE CLASS - stores one schedule solution
// Like a struct in C++
// ============================================

class Schedule {
  // Constructor - initialize empty schedule
  constructor(courses, instructors, dayLayouts) {
    this.genes = [];           // Array of class sessions
    this.fitness = 0;          // Score of this schedule (higher is better)
    this.courses = courses;    // List of all courses
    this.instructors = instructors;  // List of all instructors
    this.dayLayouts = dayLayouts;    // Time slots for each day
  }

  // ============================================
  // Create a random schedule
  // ============================================
  initialize() {
    this.genes = [];
    
    // For each course
    for (let i = 0; i < this.courses.length; i++) {
      const course = this.courses[i];
      
      // Find instructor for this course
      let instructor = "Unassigned";
      for (let j = 0; j < this.instructors.length; j++) {
        const inst = this.instructors[j];
        if (inst.assignedCourses.includes(course.code)) {
          instructor = inst.name;
          break;
        }
      }

      // Add sessions for this course
      for (let s = 0; s < course.sessionsRequired; s++) {
        // Pick random day
        const day = randomInt(0, DAYS.length - 1);
        const periods = this.dayLayouts.get(day) || [];
        
        // Pick random time slot (not a break)
        let periodIndex;
        let attempts = 0;
        do {
          periodIndex = randomInt(0, periods.length - 1);
          attempts = attempts + 1;
        } while (periods[periodIndex].isBreak && attempts < 50);

        // Add this class to schedule
        if (!periods[periodIndex].isBreak) {
          this.genes.push({
            courseCode: course.code,
            dayIndex: day,
            periodId: periods[periodIndex].id,
            instructorName: instructor
          });
        }
      }
    }
  }

  // ============================================
  // Check if a time slot is for lab classes
  // ============================================
  isLabPeriod(day, periodId) {
    const periods = this.dayLayouts.get(day) || [];
    
    // Find this period
    let foundPeriod = null;
    for (let i = 0; i < periods.length; i++) {
      if (periods[i].id === periodId) {
        foundPeriod = periods[i];
        break;
      }
    }
    
    // Return if it's a lab slot
    return foundPeriod ? foundPeriod.isLabSlot : false;
  }

  // ============================================
  // Calculate fitness (how good is this schedule?)
  // Lower score = better schedule
  // ============================================
  calculateFitness() {
    let penalty = 0;  // Count all problems
    
    // Maps to track conflicts - like hash tables in C++
    const slotUsage = new Map();          // Count classes in each slot
    const instructorUsage = new Map();    // Count instructor assignments
    const courseCounts = new Map();       // Count sessions per course
    const courseDays = new Map();         // Which days have each course
    const daySchedulePeriods = new Map(); // Periods used each day

    // Check each class in the schedule
    for (let i = 0; i < this.genes.length; i++) {
      const session = this.genes[i];
      
      // Track course sessions
      const currentCount = courseCounts.get(session.courseCode) || 0;
      courseCounts.set(session.courseCode, currentCount + 1);
      
      // Track which days have this course
      if (!courseDays.has(session.courseCode)) {
        courseDays.set(session.courseCode, []);
      }
      const days = courseDays.get(session.courseCode);
      if (!days.includes(session.dayIndex)) {
        days.push(session.dayIndex);
      }

      // PROBLEM 1: Check if room is already used (double booking)
      const slotKey = session.dayIndex + "-" + session.periodId;
      const slotCount = (slotUsage.get(slotKey) || 0) + 1;
      slotUsage.set(slotKey, slotCount);
      if (slotCount > 1) {
        penalty = penalty + 200;  // Big penalty for double booking
      }

      // PROBLEM 2: Check if instructor is double booked
      if (session.instructorName !== "Unassigned") {
        const instKey = session.instructorName + "-" + session.dayIndex + "-" + session.periodId;
        const instCount = (instructorUsage.get(instKey) || 0) + 1;
        instructorUsage.set(instKey, instCount);
        if (instCount > 1) {
          penalty = penalty + 200;  // Big penalty
        }
      }

      // PROBLEM 3: Lab courses should be in lab slots
      const isLabCourse = session.courseCode.toLowerCase().includes('lab');
      const slotAllowsLab = this.isLabPeriod(session.dayIndex, session.periodId);

      if (isLabCourse && !slotAllowsLab) {
        penalty = penalty + 50;  // Penalty for lab in wrong slot
      }
      if (!isLabCourse && slotAllowsLab) {
        penalty = penalty + 10;  // Small penalty for wasting lab slot
      }

      // Track periods used each day (for gap checking)
      if (!daySchedulePeriods.has(session.dayIndex)) {
        daySchedulePeriods.set(session.dayIndex, []);
      }
      daySchedulePeriods.get(session.dayIndex).push(session.periodId);
    }

    // PROBLEM 4: Check if course has right number of sessions
    for (let i = 0; i < this.courses.length; i++) {
      const course = this.courses[i];
      const scheduled = courseCounts.get(course.code) || 0;
      
      if (scheduled < course.sessionsRequired) {
        penalty = penalty + (100 * (course.sessionsRequired - scheduled));
      }
      if (scheduled > course.sessionsRequired) {
        penalty = penalty + (50 * (scheduled - course.sessionsRequired));
      }
    }

    // PROBLEM 5: Prefer spreading sessions across different days
    const days_array = Array.from(courseDays.entries());
    for (let i = 0; i < days_array.length; i++) {
      const code = days_array[i][0];
      const daysSet = days_array[i][1];
      const count = courseCounts.get(code) || 0;
      
      if (count > daysSet.length) {
        penalty = penalty + (30 * (count - daysSet.length));
      }
    }

    // PROBLEM 6: Minimize gaps between classes
    const days_array2 = Array.from(daySchedulePeriods.entries());
    for (let i = 0; i < days_array2.length; i++) {
      let periods = days_array2[i][1];
      
      // Sort periods
      periods = periods.sort(function(a, b) {
        return a - b;
      });
      
      // Check gaps
      for (let j = 0; j < periods.length - 1; j++) {
        const gap = periods[j + 1] - periods[j] - 1;
        if (gap > 0) {
          penalty = penalty + (gap * 20);
        }
      }
    }

    // Fitness = negative penalty (so higher fitness is better)
    this.fitness = -penalty;
  }
}

// ============================================
// GENETIC SCHEDULER CLASS
// Finds the best schedule using evolution
// ============================================

class GeneticScheduler {
  // Constructor
  constructor(courses, instructors, dayLayouts) {
    this.population = [];      // Array of schedules
    this.courses = courses;
    this.instructors = instructors;
    this.dayLayouts = dayLayouts;
  }

  // ============================================
  // Create initial population of random schedules
  // ============================================
  initPopulation(popSize) {
    this.population = [];
    
    for (let i = 0; i < popSize; i++) {
      // Create one schedule
      const sched = new Schedule(this.courses, this.instructors, this.dayLayouts);
      sched.initialize();
      sched.calculateFitness();
      
      // Add to population
      this.population.push(sched);
    }
  }

  // ============================================
  // Tournament selection - pick best from random group
  // Like picking the strongest in a tournament
  // ============================================
  select() {
    const tournamentSize = 3;
    let best = null;
    
    // Pick 3 random schedules, return the best
    for (let i = 0; i < tournamentSize; i++) {
      const idx = randomInt(0, this.population.length - 1);
      const candidate = this.population[idx];
      
      if (!best || candidate.fitness > best.fitness) {
        best = candidate;
      }
    }
    
    return best;
  }

  // ============================================
  // Crossover - combine two parent schedules
  // Like mixing genes from two parents
  // ============================================
  crossover(parent1, parent2) {
    // Create child schedule
    const child = new Schedule(this.courses, this.instructors, this.dayLayouts);
    
    // Copy parent1's genes
    child.genes = [];
    for (let i = 0; i < parent1.genes.length; i++) {
      child.genes.push(parent1.genes[i]);
    }
    
    // Random crossover point
    const cxPoint = randomInt(0, parent1.genes.length - 1);
    
    // Copy second half from parent2
    for (let i = cxPoint; i < parent1.genes.length; i++) {
      if (parent2.genes[i]) {
        // Copy the gene
        child.genes[i] = {
          courseCode: parent2.genes[i].courseCode,
          dayIndex: parent2.genes[i].dayIndex,
          periodId: parent2.genes[i].periodId,
          instructorName: parent2.genes[i].instructorName
        };
      }
    }
    
    return child;
  }

  // ============================================
  // Mutate - randomly change a schedule
  // Like random mutations in nature
  // ============================================
  mutate(schedule, mutationRate) {
    // For each class in schedule
    for (let i = 0; i < schedule.genes.length; i++) {
      // Sometimes randomly change this class's time
      if (randomDouble() < mutationRate) {
        // Pick random day
        const newDay = randomInt(0, DAYS.length - 1);
        const periods = this.dayLayouts.get(newDay) || [];
        
        // Pick random period (not a break)
        let periodIndex;
        let attempts = 0;
        do {
          periodIndex = randomInt(0, periods.length - 1);
          attempts = attempts + 1;
        } while (periods[periodIndex].isBreak && attempts < 50);

        // If valid, change the class time
        if (!periods[periodIndex].isBreak) {
          schedule.genes[i].dayIndex = newDay;
          schedule.genes[i].periodId = periods[periodIndex].id;
        }
      }
    }
  }

  // ============================================
  // Main solve function - runs genetic algorithm
  // ============================================
  async solve(generations, popSize, mutationRate, onProgress) {
    const self = this;  // Save reference to 'this'
    
    return new Promise(function(resolve) {
      // Initialize population
      self.initPopulation(popSize);
      
      let gen = 0;
      
      // Function to run one generation
      const runGeneration = function() {
        // Create next generation
        const nextGen = [];
        
        // Sort by fitness (best first)
        self.population.sort(function(a, b) {
          return b.fitness - a.fitness;
        });
        
        // Keep best schedule (elitism)
        nextGen.push(self.population[0]);

        // Create rest of population
        while (nextGen.length < popSize) {
          // Pick two parent schedules
          const p1 = self.select();
          const p2 = self.select();
          
          // Create child by mixing parents
          const child = self.crossover(p1, p2);
          
          // Randomly mutate child
          self.mutate(child, mutationRate);
          
          // Calculate fitness
          child.calculateFitness();
          
          // Add to next generation
          nextGen.push(child);
        }
        
        // Replace population
        self.population = nextGen;

        // Report progress
        if (onProgress && gen % 10 === 0) {
          onProgress(gen, self.population[0].fitness);
        }

        gen = gen + 1;
        
        // Continue if not done
        if (gen < generations && self.population[0].fitness < 0) {
          setTimeout(runGeneration, 0);
        } else {
          // Done! Return best schedule
          resolve(self.population[0]);
        }
      };

      // Start first generation
      runGeneration();
    });
  }
}

// Export classes for use in other files
export { Schedule, GeneticScheduler };
