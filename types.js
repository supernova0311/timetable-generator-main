// ============================================
// SIMPLE DATA DEFINITIONS FOR SCHEDULING
// ============================================

// Days of the week array - simple list like in C++
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default time periods for a school day
// Each period has:
//   - id: unique number (1, 2, 3, etc.)
//   - timeRange: string showing start and end time (like "08:00-09:00")
//   - isBreak: true if this is a break time (no classes)
//   - isLabSlot: true if this period is for lab classes
const DEFAULT_PERIODS = [
  { id: 1, timeRange: "08:00-09:00", isBreak: false, isLabSlot: false },
  { id: 2, timeRange: "09:00-10:00", isBreak: false, isLabSlot: false },
  { id: 3, timeRange: "10:00-10:30", isBreak: true, isLabSlot: false },
  { id: 4, timeRange: "10:30-11:30", isBreak: false, isLabSlot: false },
  { id: 5, timeRange: "11:30-12:30", isBreak: false, isLabSlot: false },
  { id: 6, timeRange: "12:30-14:00", isBreak: true, isLabSlot: false },
  { id: 7, timeRange: "14:00-16:30", isBreak: false, isLabSlot: true }
];

// Export for use in other files (like C++ include)
export { DAYS, DEFAULT_PERIODS };
