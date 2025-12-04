#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <set>
#include <random>
#include <algorithm>
#include <numeric>
#include <iomanip>

// ==========================================
// 1. DATA STRUCTURES & DOMAIN MODELS
// ==========================================

struct Course {
    std::string code;
    int credit_hours;
    bool is_lab;
    int sessions_required;
};

struct Instructor {
    std::string name;
    std::vector<std::string> assigned_courses;
};

struct Period {
    int id;
    std::string time_range;
    bool is_break;
    bool is_lab_slot; // Can labs be scheduled here?
};

struct ClassSession {
    std::string course_code;
    int day_index;
    int period_id;
    std::string instructor_name;
};

// Global Configuration
const std::vector<std::string> DAYS = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

// Random Engine
std::random_device rd;
std::mt19937 rng(rd());

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

int random_int(int min, int max) {
    std::uniform_int_distribution<int> uni(min, max);
    return uni(rng);
}

double random_double() {
    std::uniform_real_distribution<double> uni(0.0, 1.0);
    return uni(rng);
}

// ==========================================
// 3. THE CHROMOSOME (SCHEDULE)
// ==========================================

class Schedule {
public:
    std::vector<ClassSession> genes;
    double fitness;
    
    // Context data (pointers to keep struct size small)
    const std::vector<Course>* courses_ref;
    const std::vector<Instructor>* instructors_ref;
    const std::map<int, std::vector<Period>>* day_layouts_ref;

    Schedule(const std::vector<Course>* c, const std::vector<Instructor>* i, const std::map<int, std::vector<Period>>* l) 
        : courses_ref(c), instructors_ref(i), day_layouts_ref(l), fitness(0.0) {}

    // Initialize random schedule
    void initialize() {
        genes.clear();
        for (const auto& course : *courses_ref) {
            std::string instructor = "Unassigned";
            // Find instructor for this course
            for (const auto& inst : *instructors_ref) {
                for (const auto& assigned : inst.assigned_courses) {
                    if (assigned == course.code) {
                        instructor = inst.name;
                        break;
                    }
                }
            }

            for (int i = 0; i < course.sessions_required; ++i) {
                int day = random_int(0, DAYS.size() - 1);
                const auto& periods = day_layouts_ref->at(day);
                
                // Try to find a valid period (not a break)
                int p_idx;
                do {
                    p_idx = random_int(0, periods.size() - 1);
                } while (periods[p_idx].is_break);

                genes.push_back({course.code, day, periods[p_idx].id, instructor});
            }
        }
    }

    // Determine if a specific period allows labs
    bool is_lab_period(int day, int period_id) const {
        const auto& periods = day_layouts_ref->at(day);
        for(const auto& p : periods) {
            if(p.id == period_id) return p.is_lab_slot;
        }
        return false;
    }

    // ==========================================
    // 4. FITNESS FUNCTION
    // ==========================================
    void calculate_fitness() {
        double penalty = 0;
        
        std::map<std::pair<int, int>, int> slot_usage; // (Day, Period) -> Count
        std::map<std::string, std::map<std::pair<int, int>, int>> instructor_usage; // Name -> (Day, Period) -> Count
        std::map<std::string, int> course_counts;
        std::map<std::string, std::set<int>> course_days;
        std::map<int, std::vector<int>> day_schedule_periods; // Day -> List of occupied period IDs

        for (const auto& session : genes) {
            course_counts[session.course_code]++;
            course_days[session.course_code].insert(session.day_index);
            
            // 1. Check Double Booking (Room Conflict)
            slot_usage[{session.day_index, session.period_id}]++;
            if (slot_usage[{session.day_index, session.period_id}] > 1) penalty += 200;

            // 2. Check Instructor Conflict
            if (session.instructor_name != "Unassigned") {
                instructor_usage[session.instructor_name][{session.day_index, session.period_id}]++;
                if (instructor_usage[session.instructor_name][{session.day_index, session.period_id}] > 1) {
                    penalty += 200;
                }
            }

            // 3. Lab Constraints
            bool is_lab_course = (session.course_code.find("Lab") != std::string::npos);
            bool slot_allows_lab = is_lab_period(session.day_index, session.period_id);
            
            if (is_lab_course && !slot_allows_lab) penalty += 50; 
            if (!is_lab_course && slot_allows_lab) penalty += 10; // Prefer keeping lab slots for labs

            // Record for gap calculation
            day_schedule_periods[session.day_index].push_back(session.period_id);
        }

        // 4. Check Course Frequency (Must meet required sessions)
        for (const auto& course : *courses_ref) {
            int scheduled = course_counts[course.code];
            if (scheduled < course.sessions_required) penalty += 100 * (course.sessions_required - scheduled);
            if (scheduled > course.sessions_required) penalty += 50 * (scheduled - course.sessions_required);
        }

        // 5. Multiple sessions of same course on same day (bad unless intended)
        for (const auto& [code, days] : course_days) {
            if (course_counts[code] > days.size()) {
                penalty += 30 * (course_counts[code] - days.size());
            }
        }

        // 6. Gap Analysis
        for (auto& [day, periods] : day_schedule_periods) {
            std::sort(periods.begin(), periods.end());
            for (size_t i = 0; i < periods.size() - 1; ++i) {
                // Determine gaps based on Period IDs (assuming sequential IDs roughly map to time)
                int gap = periods[i+1] - periods[i] - 1;
                // Note: This is a simplified gap check compared to the Python one
                // which checked specific non-break periods.
                if (gap > 0) penalty += gap * 20; 
            }
        }

        // Invert penalty for fitness (Higher is better, 0 penalty is best)
        // We use -penalty so we can just maximize fitness
        this->fitness = -penalty;
    }
};

// ==========================================
// 5. GENETIC ALGORITHM ENGINE
// ==========================================

class GeneticScheduler {
private:
    std::vector<Schedule> population;
    std::vector<Course> courses;
    std::vector<Instructor> instructors;
    std::map<int, std::vector<Period>> day_layouts; // Day Index -> Periods

public:
    GeneticScheduler(std::vector<Course> c, std::vector<Instructor> i, std::map<int, std::vector<Period>> l)
        : courses(c), instructors(i), day_layouts(l) {}

    void init_population(int pop_size) {
        for (int i = 0; i < pop_size; ++i) {
            Schedule sched(&courses, &instructors, &day_layouts);
            sched.initialize();
            sched.calculate_fitness();
            population.push_back(sched);
        }
    }

    // Tournament Selection
    Schedule& select() {
        int tournament_size = 3;
        int best_idx = -1;
        double best_fit = -1e9;

        for(int i=0; i<tournament_size; ++i) {
            int idx = random_int(0, population.size() - 1);
            if(best_idx == -1 || population[idx].fitness > best_fit) {
                best_fit = population[idx].fitness;
                best_idx = idx;
            }
        }
        return population[best_idx];
    }

    // Crossover (Single point swap of course lists)
    Schedule crossover(const Schedule& parent1, const Schedule& parent2) {
        Schedule child = parent1; // Copy parent 1
        
        // Pick a crossover point
        int cx_point = random_int(0, parent1.genes.size() - 1);
        
        // Swap genes from point to end
        for(size_t i = cx_point; i < parent1.genes.size(); ++i) {
            child.genes[i] = parent2.genes[i];
        }
        return child;
    }

    // Mutation
    void mutate(Schedule& ind, double mutation_rate) {
        for (auto& gene : ind.genes) {
            if (random_double() < mutation_rate) {
                // Move this class to a random day/time
                int new_day = random_int(0, DAYS.size() - 1);
                const auto& periods = day_layouts.at(new_day);
                
                int p_idx;
                do {
                    p_idx = random_int(0, periods.size() - 1);
                } while (periods[p_idx].is_break);
                
                gene.day_index = new_day;
                gene.period_id = periods[p_idx].id;
            }
        }
    }

    void solve(int generations, int pop_size) {
        init_population(pop_size);

        for (int gen = 0; gen < generations; ++gen) {
            std::vector<Schedule> next_gen;

            // Elitism: Keep the best one
            std::sort(population.begin(), population.end(), [](const Schedule& a, const Schedule& b) {
                return a.fitness > b.fitness; 
            });
            next_gen.push_back(population[0]);

            while (next_gen.size() < (size_t)pop_size) {
                Schedule p1 = select();
                Schedule p2 = select();
                Schedule child = crossover(p1, p2);
                mutate(child, 0.1); 
                child.calculate_fitness();
                next_gen.push_back(child);
            }
            population = next_gen;

            if (gen % 10 == 0) {
                std::cout << "Generation " << gen << " | Best Fitness: " << population[0].fitness << std::endl;
            }
            
            // Perfect score check (0 penalty)
            if (population[0].fitness == 0) break;
        }
    }

    Schedule get_best_schedule() {
        std::sort(population.begin(), population.end(), [](const Schedule& a, const Schedule& b) {
            return a.fitness > b.fitness; 
        });
        return population[0];
    }
};

// ==========================================
// 6. MAIN EXECUTION
// ==========================================

int main() {
    // 1. Setup Data
    std::vector<Course> courses = {
        {"DAA", 4, false, 3}, // 3 sessions capped
        {"DBS", 4, false, 3},
        {"AI", 4, false, 3},
        {"MAT", 3, false, 3},
        {"OS", 3, false, 3},
        {"DAA Lab", 1, true, 1},
        {"DBS Lab", 1, true, 1},
        {"AI Lab", 1, true, 1}
    };

    std::vector<Instructor> instructors = {
        {"Dr. Williams", {"DAA", "DAA Lab"}},
        {"Prof. Johnson", {"AI", "AI Lab"}},
        {"Dr. Smith", {"DBS", "DBS Lab"}},
        {"Dr. Jane", {"OS"}},
        {"Prof. Alex", {"MAT"}}
    };

    // Define Layouts (Simplified for C++ demo: Using one layout structure for simplicity, 
    // but flagging Lab slots)
    // 1=8-9, 2=9-10, 3=Break, 4=10:30-11:30, 5=11:30-12:30, 6=Break, 7=Lab Slot
    std::map<int, std::vector<Period>> day_layouts;
    
    // Create a standard layout map
    std::vector<Period> standard_layout = {
        {1, "08:00-09:00", false, false},
        {2, "09:00-10:00", false, false},
        {3, "10:00-10:30", true, false}, // Break
        {4, "10:30-11:30", false, false},
        {5, "11:30-12:30", false, false},
        {6, "12:30-14:00", true, false}, // Break
        {7, "14:00-16:30", false, true}  // Lab Slot
    };

    // Assign to all 6 days
    for(int i=0; i<6; ++i) day_layouts[i] = standard_layout;

    std::cout << "Starting Genetic Algorithm Scheduler..." << std::endl;

    // 2. Initialize Scheduler
    GeneticScheduler solver(courses, instructors, day_layouts);

    // 3. Run Algorithm
    solver.solve(500, 50); // 500 generations, 50 population size

    // 4. Output Results
    Schedule best = solver.get_best_schedule();
    
    std::cout << "\n==========================================" << std::endl;
    std::cout << "FINAL TIMETABLE (Fitness: " << best.fitness << ")" << std::endl;
    std::cout << "==========================================" << std::endl;

    // Sort genes by Day then Period for printing
    std::sort(best.genes.begin(), best.genes.end(), [](const ClassSession& a, const ClassSession& b) {
        if (a.day_index != b.day_index) return a.day_index < b.day_index;
        return a.period_id < b.period_id;
    });

    int current_day = -1;
    for (const auto& session : best.genes) {
        if (session.day_index != current_day) {
            current_day = session.day_index;
            std::cout << "\n--- " << DAYS[current_day] << " ---" << std::endl;
        }
        
        // Find time range string
        std::string time_str = "Unknown";
        for(const auto& p : standard_layout) {
            if(p.id == session.period_id) time_str = p.time_range;
        }

        std::cout << "Period " << session.period_id << " (" << time_str << "): " 
                  << session.course_code << " [" << session.instructor_name << "]" << std::endl;
    }

    return 0;
}