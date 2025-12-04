export interface Course {
  id: string; // Unique ID
  code: string;
  creditHours: number;
  isLab: boolean;
  sessionsRequired: number;
}

export interface Instructor {
  id: string;
  name: string;
  assignedCourses: string[]; // List of Course Codes
}

export interface Period {
  id: number;
  timeRange: string;
  isBreak: boolean;
  isLabSlot: boolean;
}

export interface ClassSession {
  courseCode: string;
  dayIndex: number; // 0-5
  periodId: number;
  instructorName: string;
}

export interface ScheduleResult {
  genes: ClassSession[];
  fitness: number;
}

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const DEFAULT_PERIODS: Period[] = [
  { id: 1, timeRange: "08:00-09:00", isBreak: false, isLabSlot: false },
  { id: 2, timeRange: "09:00-10:00", isBreak: false, isLabSlot: false },
  { id: 3, timeRange: "10:00-10:30", isBreak: true, isLabSlot: false },
  { id: 4, timeRange: "10:30-11:30", isBreak: false, isLabSlot: false },
  { id: 5, timeRange: "11:30-12:30", isBreak: false, isLabSlot: false },
  { id: 6, timeRange: "12:30-14:00", isBreak: true, isLabSlot: false },
  { id: 7, timeRange: "14:00-16:30", isBreak: false, isLabSlot: true }
];