import { LearningCourse, SupportedLanguage } from '../types/learning';

export const SKILLTRACK_COURSES: LearningCourse[] = [
  {
    id: 'crs-py-001',
    name: 'Python Core Skills',
    slug: 'python-core-skills',
    primarySkill: 'Python',
    skills: ['Python 3.12', 'OOP', 'Functional Programming', 'Data Structures', 'File I/O'],
    category: 'Core Programming',
    difficulty: 'Beginner',
    provider: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    instructor: {
      name: 'Dr. Anand Deshmukh',
      title: 'Principal Systems Architect & Python Core Lead',
      organization: 'MSIAS Pune Center of Excellence',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
      bio: 'Former senior engineer at Infosys and lead curriculum designer for Maharashtra State technical colleges.'
    },
    estimatedDuration: '24 Hours',
    moduleCount: 3,
    lessonCount: 6,
    challengeCount: 3,
    assessmentCount: 3,
    description: 'Master foundational to intermediate Python programming. Cover memory references, generators, decorators, object-oriented design patterns, and robust exception architectures.',
    learningOutcomes: [
      'Write clean, idiomatic Python adhering to PEP 8 principles',
      'Understand mutable vs immutable memory models and deep copying',
      'Implement custom iterators, generators, and decorators',
      'Build robust CLI utilities with structured exception handling'
    ],
    prerequisites: ['Basic logical reasoning', 'No prior programming required'],
    status: 'in_progress',
    dueDate: '2026-09-15',
    certificateEligible: true,
    certificateCriteria: 'Complete all 3 modules, achieve >= 80% on all Knowledge Checks, and solve all 3 Coding Challenges.',
    enrolled: true,
    lastAccessedAt: '2026-08-29T18:30:00Z',
    tags: ['Python', 'Backend', 'Scripting', 'Automation'],
    targetRoles: ['Full Stack Developer', 'Data Engineer', 'Python Backend Engineer'],
    accentColor: '#3b82f6',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-py-01',
        orderIndex: 1,
        title: 'Module 01 — Python Foundations & Data Modeling',
        description: 'Memory allocation, dynamic typing, core sequence types, and dictionary hashing mechanisms in Python 3.12.',
        estimatedDuration: '6 Hours',
        items: [
          {
            id: 'item-py-01-01',
            type: 'lesson',
            title: 'Python Memory Model & Sequence Types',
            orderIndex: 1,
            estimatedMinutes: 25,
            lessonData: {
              heading: 'Python Memory Model & Sequence Types',
              summary: 'Explore how CPython manages object allocation, reference counting, and immutable sequences like strings and tuples.',
              estimatedMinutes: 25,
              sections: [
                {
                  title: '1. Variables as Object References',
                  content: 'In Python, variables are not memory containers that hold raw values. Instead, every variable is a named binding (reference) that points to an object in heap memory. Integers between -5 and 256 are pre-allocated (interned) in CPython for optimal speed.',
                  codeSnippet: {
                    language: 'python',
                    code: `# Examining object IDs and interning
a = 256
b = 256
print(a is b)  # True (Both refer to same interned memory address)

list_a = [1, 2, 3]
list_b = list_a  # Shallow reference assignment
list_b.append(4)
print(list_a)  # [1, 2, 3, 4] - Mutated together!`,
                    caption: 'Object identity and mutability in Python',
                    output: 'True\n[1, 2, 3, 4]'
                  },
                  callout: {
                    type: 'best_practice',
                    text: 'Always use `is` to check identity (e.g. `val is None`) and `==` to check value equality.'
                  }
                },
                {
                  title: '2. List Comprehensions & Memory Efficiency',
                  content: 'List comprehensions provide a concise syntax while executing in optimized C-bytecode loops. For massive datasets, generator expressions prevent high RAM consumption by computing items on-demand.',
                  codeSnippet: {
                    language: 'python',
                    code: `# Traditional loop vs List Comprehension vs Generator
numbers = range(10)
evens = [x * 2 for x in numbers if x % 2 == 0]

# Generator expression (Lazy evaluation, O(1) space)
even_gen = (x * 2 for x in numbers if x % 2 == 0)
print(next(even_gen))  # 0
print(next(even_gen))  # 4`,
                    caption: 'List Comprehensions vs Generators'
                  },
                  keyTakeaway: 'Use generator expressions when processing streaming logs or multi-gigabyte datasets to maintain constant O(1) memory overhead.'
                }
              ],
              importantPoints: [
                'All variables in Python are references pointing to heap memory objects.',
                'Lists, Dictionaries, and Sets are mutable; Tuples, Strings, and Integers are immutable.',
                'CPython garbage collection combines reference counting with a cyclic garbage collector.'
              ],
              relatedResources: [
                {
                  title: 'Official Python 3.12 Data Model Reference',
                  type: 'documentation',
                  description: 'Detailed specification of Python special dunder methods and object lifetime.'
                },
                {
                  title: 'SkillTrack Memory Profiling Cheatsheet',
                  type: 'cheatsheet',
                  description: 'Quick reference for sys.getsizeof() and tracemalloc optimization.'
                }
              ]
            }
          },
          {
            id: 'item-py-01-02',
            type: 'lesson',
            title: 'Dictionary Internals & Set Operations',
            orderIndex: 2,
            estimatedMinutes: 30,
            lessonData: {
              heading: 'Dictionary Internals & Set Operations',
              summary: 'Deep dive into compact hash table design in modern Python and efficient mathematical set relations.',
              estimatedMinutes: 30,
              sections: [
                {
                  title: 'How Python Dicts Achieve O(1) Average Lookup',
                  content: 'Python 3.6+ uses a compact hash table layout. Keys are hashed via hash(k), indexed into a sparse table, and stored in an insertion-ordered dense array.',
                  codeSnippet: {
                    language: 'python',
                    code: `candidate_scores = {"Aarav": 94, "Meera": 88, "Vikas": 91}
# Safe retrieval with fallback
score = candidate_scores.get("Pooja", 75)

# Dictionary merging operator (Python 3.9+)
bonus_scores = {"Pooja": 82, "Aarav": 96}
merged = candidate_scores | bonus_scores
print(merged["Aarav"])  # 96 (Updated from second dictionary)`,
                    caption: 'Dictionary operations and merge operators'
                  }
                }
              ],
              importantPoints: [
                'Keys in dictionaries must be hashable and implement both __hash__() and __eq__().',
                'Sets provide union (|), intersection (&), and difference (-) with O(min(len(s), len(t))) speed.'
              ],
              relatedResources: [
                {
                  title: 'High-Performance Hash Maps in Python',
                  type: 'reference',
                  description: 'Raymond Hettinger keynote on Python dictionary compaction.'
                }
              ]
            }
          },
          {
            id: 'item-py-01-03',
            type: 'challenge',
            title: 'Practice Challenge: Filter & Aggregate Sensor Metrics',
            orderIndex: 3,
            estimatedMinutes: 25,
            challengeData: {
              id: 'ch-py-01',
              title: 'Filter & Aggregate Sensor Metrics',
              topic: 'Dictionaries & Iteration',
              difficulty: 'Easy',
              supportedLanguages: ['Python', 'JavaScript', 'Java', 'C++', 'SQL'],
              defaultLanguage: 'Python',
              description: 'You are given a list of sensor reading pairs formatted as `[sensor_id, temperature]`. Write a function `aggregate_sensors(readings, min_threshold)` that returns a dictionary mapping each unique sensor ID to its highest recorded temperature above or equal to `min_threshold`.',
              constraints: [
                '1 <= len(readings) <= 10^4',
                '-50 <= temperature <= 150',
                'sensor_id is a non-empty alphanumeric string'
              ],
              inputSpecification: 'readings: List of [sensor_id, temperature] pairs\nmin_threshold: numeric threshold integer',
              outputSpecification: 'A dictionary/map containing sensor_id -> max_temperature for sensors satisfying the threshold',
              examples: [
                {
                  input: 'readings = [["S1", 24], ["S2", 30], ["S1", 28], ["S3", 19]], min_threshold = 20',
                  output: '{"S1": 28, "S2": 30}',
                  explanation: 'S1 has max 28 (>= 20), S2 has 30 (>= 20), S3 is 19 (< 20, excluded).'
                }
              ],
              hints: [
                'Initialize an empty dictionary to track maximums.',
                'Check if the temperature meets the min_threshold before updating the dict.',
                'Use max(existing_value, current_value) when a sensor already exists in your map.'
              ],
              starterSolutions: {
                Python: `def aggregate_sensors(readings, min_threshold):\n    result = {}\n    for sensor_id, temp in readings:\n        if temp >= min_threshold:\n            if sensor_id not in result or temp > result[sensor_id]:\n                result[sensor_id] = temp\n    return result\n`,
                JavaScript: `function aggregateSensors(readings, minThreshold) {\n  const result = {};\n  for (const [sensorId, temp] of readings) {\n    if (temp >= minThreshold) {\n      if (!(sensorId in result) || temp > result[sensorId]) {\n        result[sensorId] = temp;\n      }\n    }\n  }\n  return result;\n}`,
                Java: `import java.util.*;\n\npublic class Solution {\n    public static Map<String, Integer> aggregateSensors(List<List<Object>> readings, int minThreshold) {\n        Map<String, Integer> result = new HashMap<>();\n        for (List<Object> pair : readings) {\n            String id = (String) pair.get(0);\n            int temp = (Integer) pair.get(1);\n            if (temp >= minThreshold) {\n                result.put(id, Math.max(result.getOrDefault(id, Integer.MIN_VALUE), temp));\n            }\n        }\n        return result;\n    }\n}`,
                'C++': `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nstd::unordered_map<std::string, int> aggregateSensors(const std::vector<std::pair<std::string, int>>& readings, int minThreshold) {\n    std::unordered_map<std::string, int> result;\n    for (const auto& r : readings) {\n        if (r.second >= minThreshold) {\n            if (result.find(r.first) == result.end() || r.second > result[r.first]) {\n                result[r.first] = r.second;\n            }\n        }\n    }\n    return result;\n}`,
                SQL: `-- In SQL, this represents:\n-- SELECT sensor_id, MAX(temperature) AS max_temp\n-- FROM sensor_readings\n-- WHERE temperature >= :min_threshold\n-- GROUP BY sensor_id;`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Standard Multi-Sensor Input',
                  input: 'readings = [["S1", 24], ["S2", 30], ["S1", 28], ["S3", 19]], min_threshold = 20',
                  expectedOutput: '{"S1": 28, "S2": 30}',
                  isHidden: false
                },
                {
                  id: 2,
                  title: 'Scenario 02 — All Below Threshold',
                  input: 'readings = [["A1", 12], ["A2", 15]], min_threshold = 25',
                  expectedOutput: '{}',
                  isHidden: false
                },
                {
                  id: 3,
                  title: 'Scenario 03 — Duplicate Max Readings',
                  input: 'readings = [["S10", 40], ["S10", 40], ["S11", 55]], min_threshold = 30',
                  expectedOutput: '{"S10": 40, "S11": 55}',
                  isHidden: true
                },
                {
                  id: 4,
                  title: 'Scenario 04 — Negative Temperature Range',
                  input: 'readings = [["COLD_1", -5], ["COLD_1", -2], ["COLD_2", -20]], min_threshold = -10',
                  expectedOutput: '{"COLD_1": -2}',
                  isHidden: true
                }
              ]
            }
          },
          {
            id: 'item-py-01-04',
            type: 'knowledge_check',
            title: 'Knowledge Check: Foundations & Memory',
            orderIndex: 4,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-py-01',
              title: 'Module 01 Knowledge Check — Python Foundations',
              moduleId: 'mod-py-01',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'What is the output of `type([1, 2, 3])` in Python 3?',
                  options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'sequence'>"],
                  correctIndex: 0,
                  explanation: 'Square brackets instantiate an instance of the built-in list type in Python.',
                  topic: 'Data Types',
                  difficulty: 'Beginner'
                },
                {
                  id: 2,
                  question: 'Which of the following data structures in Python is strictly immutable?',
                  options: ['List', 'Dictionary', 'Tuple', 'Set'],
                  correctIndex: 2,
                  explanation: 'Tuples cannot be modified after instantiation (elements cannot be added, removed, or reassigned).',
                  topic: 'Mutability',
                  difficulty: 'Beginner'
                },
                {
                  id: 3,
                  question: 'What is the average time complexity of key lookup in a Python dictionary?',
                  options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
                  correctIndex: 2,
                  explanation: 'Python dictionaries utilize a hash table under the hood, yielding O(1) average time complexity for lookups.',
                  topic: 'Complexity',
                  difficulty: 'Intermediate'
                },
                {
                  id: 4,
                  question: 'What does the expression `[x**2 for x in range(5) if x % 2 != 0]` evaluate to?',
                  options: ['[0, 4, 16]', '[1, 9]', '[1, 9, 25]', '[0, 1, 4, 9, 16]'],
                  correctIndex: 1,
                  explanation: 'Odd numbers in range(5) are 1 and 3. Squaring them yields [1, 9].',
                  topic: 'Comprehensions',
                  difficulty: 'Beginner'
                },
                {
                  id: 5,
                  question: 'Which operator was introduced in Python 3.9 for merging two dictionaries into a new dict?',
                  options: ['&', '+', '|', '<<'],
                  correctIndex: 2,
                  explanation: 'PEP 584 introduced the union operator | to merge dictionaries cleanly without modifying operands in-place.',
                  topic: 'Modern Syntax',
                  difficulty: 'Intermediate'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-py-02',
        orderIndex: 2,
        title: 'Module 02 — Functional Paradigms, Iterators & Decorators',
        description: 'First-class functions, closures, custom iterator protocols, and higher-order decorators for enterprise telemetry and caching.',
        estimatedDuration: '8 Hours',
        items: [
          {
            id: 'item-py-02-01',
            type: 'lesson',
            title: 'Decorators, Closures & Function Wrappers',
            orderIndex: 1,
            estimatedMinutes: 30,
            lessonData: {
              heading: 'Decorators, Closures & Function Wrappers',
              summary: 'Learn how closures capture outer scopes and how decorators modify function behavior dynamically at definition time.',
              estimatedMinutes: 30,
              sections: [
                {
                  title: 'Understanding Closures in Python',
                  content: 'A closure is a function object that remembers values in enclosing scopes even if they are not present in memory during execution.',
                  codeSnippet: {
                    language: 'python',
                    code: `def make_multiplier(factor):
    def multiply(x):
        return x * factor  # factor is retained in closure
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))  # 10
print(triple(5))  # 15`,
                    caption: 'Closure retaining lexical scope'
                  }
                },
                {
                  title: 'Building a Telemetry Timing Decorator',
                  content: 'Decorators wrap a target callable with additional preprocessing and postprocessing logic.',
                  codeSnippet: {
                    language: 'python',
                    code: `import time
from functools import wraps

def benchmark(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = (time.perf_counter() - start) * 1000
        print(f"[{func.__name__}] finished in {duration:.2f}ms")
        return result
    return wrapper

@benchmark
def compute_heavy_task():
    return sum(i * i for i in range(100_000))

compute_heavy_task()`,
                    caption: 'Production-ready timing decorator with functools.wraps'
                  }
                }
              ],
              importantPoints: [
                'Always use @functools.wraps on inner decorator wrappers to preserve __name__ and docstrings.',
                'Decorators execute when the module is imported / defined, not when invoked.'
              ],
              relatedResources: [
                {
                  title: 'Functools and High-Order Decorators',
                  type: 'documentation',
                  description: 'Python docs on wraps, lru_cache, and partial.'
                }
              ]
            }
          },
          {
            id: 'item-py-02-02',
            type: 'challenge',
            title: 'Practice Challenge: Memoization Decorator',
            orderIndex: 2,
            estimatedMinutes: 30,
            challengeData: {
              id: 'ch-py-02',
              title: 'Build a Custom LRU-Style Memoization Cache',
              topic: 'Decorators & Closures',
              difficulty: 'Medium',
              supportedLanguages: ['Python', 'JavaScript', 'Java', 'C++'],
              defaultLanguage: 'Python',
              description: 'Implement a function `memoize(fn)` that stores previously evaluated arguments and results in an internal cache. If the function is called with the same arguments, it must return the cached output without re-executing `fn`.',
              constraints: [
                'Inputs to wrapped functions will be hashable arguments',
                'Cache must handle variable positional arguments (*args)'
              ],
              inputSpecification: 'A callable function taking arguments',
              outputSpecification: 'A wrapped function that caches return values',
              examples: [
                {
                  input: 'fib(10) called twice',
                  output: 'Second call returns immediately from cache without recursion overhead',
                  explanation: 'Cache stores (10,) -> 55.'
                }
              ],
              hints: [
                'Use a dictionary in the outer scope to map tuple(args) to returned results.',
                'Remember to return the inner wrapper.'
              ],
              starterSolutions: {
                Python: `def memoize(fn):\n    cache = {}\n    def wrapper(*args):\n        if args in cache:\n            return cache[args]\n        res = fn(*args)\n        cache[args] = res\n        return res\n    return wrapper\n`,
                JavaScript: `function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n}`,
                Java: `import java.util.*;\nimport java.util.function.Function;\n\npublic class Memoizer {\n    public static <T, R> Function<T, R> memoize(Function<T, R> fn) {\n        Map<T, R> cache = new HashMap<>();\n        return input -> cache.computeIfAbsent(input, fn);\n    }\n}`,
                'C++': `#include <iostream>\n#include <unordered_map>\n#include <functional>\n\ntemplate<typename In, typename Out>\nstd::function<Out(In)> memoize(std::function<Out(In)> fn) {\n    std::unordered_map<In, Out> cache;\n    return [fn, cache](In arg) mutable -> Out {\n        if (cache.find(arg) != cache.end()) return cache[arg];\n        Out result = fn(arg);\n        cache[arg] = result;\n        return result;\n    };\n}`,
                SQL: `-- Memoization pattern is implemented via Materialized Views in SQL`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Single Integer Argument Factorial',
                  input: 'factorial(5) -> 120',
                  expectedOutput: '120',
                  isHidden: false
                },
                {
                  id: 2,
                  title: 'Scenario 02 — Cache Hit Verification',
                  input: 'Repeated invocation with args (4, 6)',
                  expectedOutput: 'Correct memoized output without second function call',
                  isHidden: false
                },
                {
                  id: 3,
                  title: 'Scenario 03 — Multi-parameter String Concatenation',
                  input: 'join_str("Skill", "Track")',
                  expectedOutput: '"SkillTrack"',
                  isHidden: true
                }
              ]
            }
          },
          {
            id: 'item-py-02-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: Functions & Decorators',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-py-02',
              title: 'Module 02 Knowledge Check — Advanced Functions',
              moduleId: 'mod-py-02',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'What is the purpose of `@functools.wraps(func)` inside a decorator definition?',
                  options: [
                    'It prevents the decorator from executing in parallel threads.',
                    'It preserves the original function metadata like __name__ and docstring.',
                    'It automatically converts recursive calls to iterative loops.',
                    'It catches all runtime exceptions thrown by the decorated function.'
                  ],
                  correctIndex: 1,
                  explanation: 'functools.wraps copies the original function attributes (name, docstring, annotations) to the wrapper function.',
                  topic: 'Decorators',
                  difficulty: 'Intermediate'
                },
                {
                  id: 2,
                  question: 'How do you turn a standard Python function into a generator?',
                  options: [
                    'By adding the @generator decorator above the function',
                    'By using the yield keyword instead of return',
                    'By declaring the return type as Generator[T]',
                    'By prefixing the function name with gen_'
                  ],
                  correctIndex: 1,
                  explanation: 'Using the yield keyword causes the function to return a generator iterator object upon execution.',
                  topic: 'Generators',
                  difficulty: 'Beginner'
                },
                {
                  id: 3,
                  question: 'What happens when `next()` is called on an exhausted generator that has no more items to yield?',
                  options: [
                    'It returns None by default.',
                    'It restarts generation from the beginning.',
                    'It raises a StopIteration exception.',
                    'It raises a GeneratorExit error.'
                  ],
                  correctIndex: 2,
                  explanation: 'When a generator terminates, Python signals the end of the sequence by raising StopIteration.',
                  topic: 'Iterators',
                  difficulty: 'Intermediate'
                },
                {
                  id: 4,
                  question: 'Which built-in module provides `@lru_cache` for automatic memoization?',
                  options: ['collections', 'itertools', 'functools', 'operator'],
                  correctIndex: 2,
                  explanation: 'functools.lru_cache is the standard library utility for least-recently-used function memoization.',
                  topic: 'Standard Library',
                  difficulty: 'Beginner'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-py-03',
        orderIndex: 3,
        title: 'Module 03 — Object-Oriented Architecture & Robust Error Handling',
        description: 'Dunder methods, class vs static methods, abstract base classes (ABC), and custom exception hierarchies for production.',
        estimatedDuration: '10 Hours',
        items: [
          {
            id: 'item-py-03-01',
            type: 'lesson',
            title: 'Dunder Methods & Pythonic OOP',
            orderIndex: 1,
            estimatedMinutes: 35,
            lessonData: {
              heading: 'Dunder Methods & Pythonic OOP',
              summary: 'Explore operator overloading, string representations (__repr__ vs __str__), and context managers (__enter__ / __exit__).',
              estimatedMinutes: 35,
              sections: [
                {
                  title: 'Special Dunder Protocols',
                  content: 'In Python, OOP behavior is customized by implementing double-underscore (dunder) methods.',
                  codeSnippet: {
                    language: 'python',
                    code: `class Money:
    def __init__(self, amount_inr: float):
        self.amount_inr = round(amount_inr, 2)

    def __add__(self, other: 'Money') -> 'Money':
        return Money(self.amount_inr + other.amount_inr)

    def __repr__(self) -> str:
        return f"Money(₹{self.amount_inr:,.2f})"

m1 = Money(450.50)
m2 = Money(150.25)
print(m1 + m2)  # Money(₹600.75)`,
                    caption: 'Operator overloading with __add__ and __repr__'
                  }
                }
              ],
              importantPoints: [
                '__repr__ is intended for unambiguous debugging representation.',
                'Context managers implement __enter__ and __exit__ to guarantee resource cleanup even during exceptions.'
              ],
              relatedResources: [
                {
                  title: 'Fluent Python OOP Architecture',
                  type: 'reference',
                  description: 'Comprehensive guide to class mechanics and descriptor protocols.'
                }
              ]
            }
          },
          {
            id: 'item-py-03-02',
            type: 'challenge',
            title: 'Practice Challenge: Custom Range Context Manager',
            orderIndex: 2,
            estimatedMinutes: 30,
            challengeData: {
              id: 'ch-py-03',
              title: 'Build a Safe Resource Lock Manager',
              topic: 'OOP & Context Managers',
              difficulty: 'Medium',
              supportedLanguages: ['Python', 'JavaScript', 'Java'],
              defaultLanguage: 'Python',
              description: 'Implement a class `ResourceLock` that tracks active lock state. When entered via `with ResourceLock("DB_WRITE") as lock:`, it acquires the lock and sets `lock.is_active = True`. When exiting, it must always set `lock.is_active = False` regardless of whether an exception was raised inside the with-block.',
              constraints: ['Thread-safe lock flag representation'],
              inputSpecification: 'Resource name string',
              outputSpecification: 'Active lock status verification during and after context manager lifespan',
              examples: [
                {
                  input: 'with ResourceLock("PAYMENTS") as lock:\n    assert lock.is_active is True\nassert lock.is_active is False',
                  output: 'Lock properly acquired and safely released',
                  explanation: '__exit__ cleans up status cleanly.'
                }
              ],
              hints: [
                'Implement __enter__(self) and return self.',
                'Implement __exit__(self, exc_type, exc_val, exc_tb) and set self.is_active = False.'
              ],
              starterSolutions: {
                Python: `class ResourceLock:\n    def __init__(self, resource_name):\n        self.resource_name = resource_name\n        self.is_active = False\n\n    def __enter__(self):\n        self.is_active = True\n        return self\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.is_active = False\n        return False\n`,
                JavaScript: `class ResourceLock {\n  constructor(name) {\n    this.name = name;\n    this.isActive = false;\n  }\n  acquire() { this.isActive = true; }\n  release() { this.isActive = false; }\n}`,
                Java: `public class ResourceLock implements AutoCloseable {\n    private String name;\n    private boolean isActive;\n    public ResourceLock(String name) { this.name = name; this.isActive = true; }\n    public boolean isActive() { return isActive; }\n    @Override public void close() { this.isActive = false; }\n}`,
                'C++': `class ResourceLock {\npublic:\n    bool isActive = false;\n    ResourceLock() { isActive = true; }\n    ~ResourceLock() { isActive = false; }\n};`,
                SQL: `-- In SQL, managed via BEGIN TRANSACTION ... COMMIT / ROLLBACK`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Clean Context Entry and Exit',
                  input: 'Enter with block, check state, exit block',
                  expectedOutput: 'is_active True inside, False outside',
                  isHidden: false
                },
                {
                  id: 2,
                  title: 'Scenario 02 — Exception Handling during Block',
                  input: 'Raise ValueError inside with block',
                  expectedOutput: 'Lock status is released even when exception triggers',
                  isHidden: false
                }
              ]
            }
          },
          {
            id: 'item-py-03-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: OOP & Production Python',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-py-03',
              title: 'Module 03 Knowledge Check — OOP & Exception Architecture',
              moduleId: 'mod-py-03',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'Which method must a Python class implement to be compatible with the `with` statement?',
                  options: ['__open__ and __close__', '__enter__ and __exit__', '__start__ and __stop__', '__init__ and __del__'],
                  correctIndex: 1,
                  explanation: 'The context manager protocol requires __enter__() and __exit__().',
                  topic: 'Context Managers',
                  difficulty: 'Beginner'
                },
                {
                  id: 2,
                  question: 'What is the key difference between `@classmethod` and `@staticmethod`?',
                  options: [
                    '@classmethod receives the class object (cls) as its first argument; @staticmethod receives neither self nor cls.',
                    '@staticmethod can only access private class variables.',
                    '@classmethod cannot be called on an instance of the class.',
                    '@staticmethod cannot take any arguments.'
                  ],
                  correctIndex: 0,
                  explanation: 'Class methods implicitly receive the class (cls) allowing factory constructors; static methods behave like plain functions attached to the namespace.',
                  topic: 'OOP Mechanics',
                  difficulty: 'Intermediate'
                },
                {
                  id: 3,
                  question: 'What does the `finally` block in a `try...except...finally` construct guarantee?',
                  options: [
                    'It executes only if no exception occurred.',
                    'It executes only if an exception was caught.',
                    'It always executes regardless of whether an exception occurred or was handled.',
                    'It automatically suppresses all unhandled exceptions.'
                  ],
                  correctIndex: 2,
                  explanation: 'The finally clause always executes before exiting the try statement, guaranteeing cleanup.',
                  topic: 'Exception Architecture',
                  difficulty: 'Beginner'
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-dsa-002',
    name: 'Data Structures & Algorithms',
    slug: 'data-structures-algorithms',
    primarySkill: 'Algorithms',
    skills: ['Binary Trees', 'Graphs (BFS/DFS)', 'Dynamic Programming', 'Heaps', 'Sliding Window', 'Two Pointers'],
    category: 'Algorithmic Engineering',
    difficulty: 'Intermediate',
    provider: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    instructor: {
      name: 'Prof. Rajesh Kulkarni',
      title: 'Head of Algorithmic Research & Competitive Programming',
      organization: 'MSIAS Pune',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
      bio: 'Author of "Algorithmic Precision in Engineering" and coach for National Skill Olympics.'
    },
    estimatedDuration: '40 Hours',
    moduleCount: 3,
    lessonCount: 6,
    challengeCount: 3,
    assessmentCount: 3,
    description: 'Master core algorithmic problem solving: Arrays, Linked Lists, Trees, Graph traversals (Dijkstra, BFS/DFS), Sorting algorithms, and Dynamic Programming optimization techniques.',
    learningOutcomes: [
      'Analyze Big-O time and space complexity with mathematical rigour',
      'Implement custom Data Structures: Min-Heaps, Disjoint Set Union (DSU), Trie',
      'Solve sliding window, dynamic programming, and shortest-path graph challenges',
      'Ace technical coding assessments with optimal asymptotic complexity'
    ],
    prerequisites: ['Proficiency in at least one language: Python, C++, Java, or JavaScript'],
    status: 'in_progress',
    dueDate: '2026-09-20',
    certificateEligible: true,
    certificateCriteria: 'Achieve >= 80% on all module Knowledge Checks and solve all coding challenges with passing test suites.',
    enrolled: true,
    lastAccessedAt: '2026-08-30T01:15:00Z',
    tags: ['Algorithms', 'Data Structures', 'LeetCode', 'System Design'],
    targetRoles: ['Software Engineer', 'Backend Engineer', 'Systems Programmer'],
    accentColor: '#10b981',
    bannerImage: 'https://images.unsplash.com/photo-1516116211227-bbc13c72e2e7?w=800&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-dsa-01',
        orderIndex: 1,
        title: 'Module 01 — Array Foundations & Two-Pointer Patterns',
        description: 'Memory layouts, contiguous allocation, cache locality, two-pointer techniques, and sliding window paradigms.',
        estimatedDuration: '10 Hours',
        items: [
          {
            id: 'item-dsa-01-01',
            type: 'lesson',
            title: 'Two-Pointer Technique & In-Place Array Mutation',
            orderIndex: 1,
            estimatedMinutes: 30,
            lessonData: {
              heading: 'Two-Pointer Technique & In-Place Array Mutation',
              summary: 'Learn how inward and fast/slow pointer pairs reduce quadratic O(n^2) brute force searches to optimal linear O(n) passes with O(1) extra space.',
              estimatedMinutes: 30,
              sections: [
                {
                  title: 'Opposite-Direction Pointers for Sorted Arrays',
                  content: 'When an array is sorted, searching for complementary pairs (such as target sums) can be accomplished in linear time by placing one pointer at index 0 and another at index n-1.',
                  codeSnippet: {
                    language: 'python',
                    code: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left = 0
    right = len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1  # Need larger sum, move left pointer forward
        else:
            right -= 1  # Need smaller sum, move right pointer backward
            
    return []  # No pair found`,
                    caption: 'Two-Pointer Target Search in O(n) time and O(1) space'
                  },
                  callout: {
                    type: 'tip',
                    text: 'When space complexity is restricted to O(1), sort the array first (if allowable) to use two-pointers rather than a hash map.'
                  }
                }
              ],
              importantPoints: [
                'Two-pointer inward traversal requires a monotonic (sorted) sequence.',
                'Fast/slow pointers (Floyd cycle detection) find midpoints and cycle entry points in O(n) time.'
              ],
              relatedResources: [
                {
                  title: 'Two-Pointer Pattern Reference Guide',
                  type: 'documentation',
                  description: 'Curated list of 15 classic two-pointer algorithmic patterns.'
                }
              ]
            }
          },
          {
            id: 'item-dsa-01-02',
            type: 'challenge',
            title: 'Practice Challenge: Two Sum — Sorted Array Indices',
            orderIndex: 2,
            estimatedMinutes: 30,
            challengeData: {
              id: 'ch-dsa-01',
              title: 'Two Sum II — Sorted Input Array',
              topic: 'Two Pointers',
              difficulty: 'Easy',
              supportedLanguages: ['Python', 'Java', 'C++', 'JavaScript'],
              defaultLanguage: 'Python',
              description: 'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers, `[index1, index2]`, as an integer array where `1 <= index1 < index2 <= numbers.length`.',
              constraints: [
                '2 <= numbers.length <= 3 * 10^4',
                '-1000 <= numbers[i] <= 1000',
                'numbers is sorted in non-decreasing order',
                '-1000 <= target <= 1000',
                'Exactly one solution exists'
              ],
              inputSpecification: 'numbers: sorted array of integers\ntarget: integer sum to find',
              outputSpecification: 'Array of 1-based indices [index1, index2]',
              examples: [
                {
                  input: 'numbers = [2, 7, 11, 15], target = 9',
                  output: '[1, 2]',
                  explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. Return [1, 2].'
                },
                {
                  input: 'numbers = [2, 3, 4], target = 6',
                  output: '[1, 3]',
                  explanation: 'The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. Return [1, 3].'
                }
              ],
              hints: [
                'Since the array is sorted, use two pointers at left=0 and right=n-1.',
                'If numbers[left] + numbers[right] > target, decrease right.',
                'If sum < target, increase left.'
              ],
              starterSolutions: {
                Python: `def two_sum(numbers, target):\n    left = 0\n    right = len(numbers) - 1\n    while left < right:\n        s = numbers[left] + numbers[right]\n        if s == target:\n            return [left + 1, right + 1]\n        elif s < target:\n            left += 1\n        else:\n            right -= 1\n    return []\n`,
                JavaScript: `function twoSum(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) {\n      return [left + 1, right + 1];\n    } else if (sum < target) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  return [];\n}`,
                Java: `public class Solution {\n    public static int[] twoSum(int[] numbers, int target) {\n        int left = 0, right = numbers.length - 1;\n        while (left < right) {\n            int sum = numbers[left] + numbers[right];\n            if (sum == target) {\n                return new int[]{left + 1, right + 1};\n            } else if (sum < target) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n        return new int[]{};\n    }\n}`,
                'C++': `#include <vector>\n\nstd::vector<int> twoSum(const std::vector<int>& numbers, int target) {\n    int left = 0, right = numbers.size() - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) return {left + 1, right + 1};\n        else if (sum < target) left++;\n        else right--;\n    }\n    return {};\n}`,
                SQL: `-- SQL equivalent logic`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Classic Target 9',
                  input: 'numbers = [2, 7, 11, 15], target = 9',
                  expectedOutput: '[1, 2]',
                  isHidden: false
                },
                {
                  id: 2,
                  title: 'Scenario 02 — End-Element Matching',
                  input: 'numbers = [2, 3, 4], target = 6',
                  expectedOutput: '[1, 3]',
                  isHidden: false
                },
                {
                  id: 3,
                  title: 'Scenario 03 — Negative Element Sum',
                  input: 'numbers = [-1, 0], target = -1',
                  expectedOutput: '[1, 2]',
                  isHidden: true
                }
              ]
            }
          },
          {
            id: 'item-dsa-01-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: Array & Pointer Complexity',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-dsa-01',
              title: 'Module 01 Knowledge Check — Complexity & Pointers',
              moduleId: 'mod-dsa-01',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'What is the time complexity of accessing an arbitrary element by index in a contiguous dynamic array?',
                  options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
                  correctIndex: 0,
                  explanation: 'Contiguous memory allows the CPU to calculate exact pointer address directly: base_address + index * element_size in O(1) time.',
                  topic: 'Array Fundamentals',
                  difficulty: 'Beginner'
                },
                {
                  id: 2,
                  question: 'Why does the sliding window technique improve time complexity over nested loops for subarray problems?',
                  options: [
                    'It eliminates duplicate calculations by incrementally updating the window boundaries in O(n) total operations.',
                    'It sorts the array in O(1) time before iterating.',
                    'It replaces all array lookups with binary searches.',
                    'It automatically parallelizes loop iterations across CPU cores.'
                  ],
                  correctIndex: 0,
                  explanation: 'Both left and right pointers traverse the array at most once, turning O(n^2) brute force checks into linear O(n) time.',
                  topic: 'Sliding Window',
                  difficulty: 'Intermediate'
                },
                {
                  id: 3,
                  question: 'What is the amortized time complexity of appending an element to the end of a dynamic array in Python (list.append) or C++ (std::vector::push_back)?',
                  options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
                  correctIndex: 0,
                  explanation: 'Geometric geometric array resizing (e.g. 1.5x or 2x capacity doubling) ensures the amortized cost per append operation is O(1).',
                  topic: 'Amortized Analysis',
                  difficulty: 'Intermediate'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-dsa-02',
        orderIndex: 2,
        title: 'Module 02 — Linked Structures, Trees & Binary Search Trees',
        description: 'Singly and doubly linked lists, binary tree traversals (pre/in/post/level), balancing, and BST validation.',
        estimatedDuration: '14 Hours',
        items: [
          {
            id: 'item-dsa-02-01',
            type: 'lesson',
            title: 'Tree Traversals: Depth-First vs Breadth-First',
            orderIndex: 1,
            estimatedMinutes: 35,
            lessonData: {
              heading: 'Tree Traversals: Depth-First vs Breadth-First',
              summary: 'Compare recursive DFS (Preorder, Inorder, Postorder) using call stacks with iterative BFS Level-Order traversal using queues.',
              estimatedMinutes: 35,
              sections: [
                {
                  title: 'Binary Tree Inorder Traversal',
                  content: 'Inorder traversal (Left -> Root -> Right) visits nodes in strictly sorted non-decreasing order when executed on a valid Binary Search Tree (BST).',
                  codeSnippet: {
                    language: 'python',
                    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root: TreeNode) -> list[int]:
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    dfs(root)
    return result`,
                    caption: 'Recursive DFS Inorder Traversal'
                  }
                }
              ],
              importantPoints: [
                'Inorder on a valid BST outputs keys in strictly sorted order.',
                'BFS level-order traversal uses a FIFO queue and finds shortest path in unweighted tree graphs.'
              ],
              relatedResources: [
                {
                  title: 'Visualizing Tree Recursion and Call Stacks',
                  type: 'documentation',
                  description: 'Interactive stepping diagrams for BST insertion and balancing.'
                }
              ]
            }
          },
          {
            id: 'item-dsa-02-02',
            type: 'challenge',
            title: 'Practice Challenge: Validate Binary Search Tree',
            orderIndex: 2,
            estimatedMinutes: 35,
            challengeData: {
              id: 'ch-dsa-02',
              title: 'Validate Binary Search Tree (BST Property)',
              topic: 'Binary Trees & Recursion',
              difficulty: 'Medium',
              supportedLanguages: ['Python', 'Java', 'C++', 'JavaScript'],
              defaultLanguage: 'Python',
              description: 'Given the root of a binary tree represented as node objects or array serialization `[root, left, right, ...]`, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as:\n1. The left subtree of a node contains only nodes with keys strictly less than the node\'s key.\n2. The right subtree of a node contains only nodes with keys strictly greater than the node\'s key.\n3. Both left and right subtrees must also be binary search trees.',
              constraints: [
                'Number of nodes in the tree is in the range [1, 10^4]',
                '-2^31 <= Node.val <= 2^31 - 1'
              ],
              inputSpecification: 'Tree representation or array of node values',
              outputSpecification: 'Boolean true if valid BST, false otherwise',
              examples: [
                {
                  input: 'root = [2, 1, 3]',
                  output: 'true',
                  explanation: 'Left child 1 < 2 and right child 3 > 2. Valid BST.'
                },
                {
                  input: 'root = [5, 1, 4, null, null, 3, 6]',
                  output: 'false',
                  explanation: 'Root value is 5 but its right child\'s left value is 3 (< 5). Invalid BST.'
                }
              ],
              hints: [
                'Maintain a valid range [min_val, max_val] for each node.',
                'When moving left, update max_val = node.val. When moving right, update min_val = node.val.'
              ],
              starterSolutions: {
                Python: `def is_valid_bst(root):\n    def validate(node, min_val, max_val):\n        if not node:\n            return True\n        if not (min_val < node.val < max_val):\n            return False\n        return validate(node.left, min_val, node.val) and validate(node.right, node.val, max_val)\n    return validate(root, float('-inf'), float('inf'))\n`,
                JavaScript: `function isValidBST(root) {\n  function validate(node, minVal, maxVal) {\n    if (!node) return true;\n    if (node.val <= minVal || node.val >= maxVal) return false;\n    return validate(node.left, minVal, node.val) && validate(node.right, node.val, maxVal);\n  }\n  return validate(root, -Infinity, Infinity);\n}`,
                Java: `public class Solution {\n    public static boolean isValidBST(TreeNode root) {\n        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);\n    }\n    private static boolean validate(TreeNode node, long min, long max) {\n        if (node == null) return true;\n        if (node.val <= min || node.val >= max) return false;\n        return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n    }\n}`,
                'C++': `bool validate(TreeNode* node, long minVal, long maxVal) {\n    if (!node) return true;\n    if (node->val <= minVal || node->val >= maxVal) return false;\n    return validate(node->left, minVal, node->val) && validate(node->right, node->val, maxVal);\n}\nbool isValidBST(TreeNode* root) {\n    return validate(root, LONG_MIN, LONG_MAX);\n}`,
                SQL: `-- BST relationships modeled via Recursive Common Table Expressions`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Simple Balanced BST [2, 1, 3]',
                  input: 'Tree [2, 1, 3]',
                  expectedOutput: 'true',
                  isHidden: false
                },
                {
                  id: 2,
                  title: 'Scenario 02 — Subtree Violation [5, 1, 4, null, null, 3, 6]',
                  input: 'Tree with node 3 in right subtree of 5',
                  expectedOutput: 'false',
                  isHidden: false
                }
              ]
            }
          },
          {
            id: 'item-dsa-02-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: Trees & Recursion',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-dsa-02',
              title: 'Module 02 Knowledge Check — Tree Algorithms',
              moduleId: 'mod-dsa-02',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'Which traversal sequence of a BST yields all keys in sorted ascending order?',
                  options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
                  correctIndex: 1,
                  explanation: 'Inorder visits Left -> Root -> Right, which mirrors the definition of binary search order.',
                  topic: 'BST Traversals',
                  difficulty: 'Beginner'
                },
                {
                  id: 2,
                  question: 'What is the worst-case time complexity of searching in an unbalanced degenerate Binary Search Tree of N elements?',
                  options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                  correctIndex: 2,
                  explanation: 'A skewed BST degenerates into a singly linked list where searching requires traversing all N nodes.',
                  topic: 'Worst-case Analysis',
                  difficulty: 'Intermediate'
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-sql-003',
    name: 'SQL Mastery',
    slug: 'sql-mastery',
    primarySkill: 'SQL',
    skills: ['PostgreSQL', 'Window Functions', 'CTE & Subqueries', 'Indexing & EXPLAIN', 'ACID Transactions'],
    category: 'Data & Databases',
    difficulty: 'Intermediate',
    provider: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    instructor: {
      name: 'Sunita Gaikwad',
      title: 'Principal Database Architect',
      organization: 'TechSkills Foundation',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
      bio: 'Ex-Oracle DBA and PostgreSQL core contributor with 14 years specializing in VLDB and analytical query tuning.'
    },
    estimatedDuration: '18 Hours',
    moduleCount: 2,
    lessonCount: 4,
    challengeCount: 2,
    assessmentCount: 2,
    description: 'Master advanced SQL query design, analytics window functions (RANK, DENSE_RANK, LEAD/LAG), recursive Common Table Expressions (CTEs), database schema design, and execution plan optimization with EXPLAIN ANALYZE.',
    learningOutcomes: [
      'Write complex analytical SQL queries using OVER (PARTITION BY ... ORDER BY)',
      'Optimize query bottlenecks using B-tree, GIN, and composite indexes',
      'Execute hierarchical graph traversals using RECURSIVE CTEs',
      'Ensure high transaction integrity with PostgreSQL isolation levels'
    ],
    prerequisites: ['Basic familiarity with tables, rows, and columns'],
    status: 'in_progress',
    dueDate: '2026-09-25',
    certificateEligible: true,
    certificateCriteria: 'Achieve >= 80% on all SQL Knowledge Checks and solve all SQL coding challenges.',
    enrolled: true,
    lastAccessedAt: '2026-08-28T14:00:00Z',
    tags: ['SQL', 'PostgreSQL', 'Databases', 'Analytics', 'Backend'],
    targetRoles: ['Data Analyst', 'Database Administrator', 'Backend Engineer'],
    accentColor: '#f59e0b',
    bannerImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-sql-01',
        orderIndex: 1,
        title: 'Module 01 — Analytical Window Functions & Aggregations',
        description: 'PARTITION BY, ORDER BY frame specifications, running totals, ranking, and period-over-period comparative analysis.',
        estimatedDuration: '8 Hours',
        items: [
          {
            id: 'item-sql-01-01',
            type: 'lesson',
            title: 'Window Functions: ROW_NUMBER, RANK, DENSE_RANK & Running Totals',
            orderIndex: 1,
            estimatedMinutes: 30,
            lessonData: {
              heading: 'Window Functions: ROW_NUMBER, RANK, DENSE_RANK & Running Totals',
              summary: 'Perform complex partition-level calculations across rows without collapsing rows into single aggregate groups.',
              estimatedMinutes: 30,
              sections: [
                {
                  title: 'Window Framing vs Standard GROUP BY',
                  content: 'Unlike GROUP BY, which reduces multiple rows into a single summary row, window functions retain each row while computing aggregate values across a sliding or partitioned set of records.',
                  codeSnippet: {
                    language: 'sql',
                    code: `-- Calculating running monthly revenue and rank per department
SELECT 
    employee_id,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as salary_rank_in_dept,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dense_rank_in_dept,
    SUM(salary) OVER (PARTITION BY department ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_payroll
FROM employees;`,
                    caption: 'PostgreSQL Window Function execution with Partition Framing'
                  }
                }
              ],
              importantPoints: [
                'RANK leaves gaps when ties occur (e.g. 1, 2, 2, 4); DENSE_RANK has no gaps (1, 2, 2, 3).',
                'LEAD(col, 1) and LAG(col, 1) allow accessing next and previous row values without self-joins.'
              ],
              relatedResources: [
                {
                  title: 'PostgreSQL Window Function Specifications',
                  type: 'documentation',
                  description: 'Official manual on window definition, framing, and filter clauses.'
                }
              ]
            }
          },
          {
            id: 'item-sql-01-02',
            type: 'challenge',
            title: 'Practice Challenge: Top 3 Earners Per Department',
            orderIndex: 2,
            estimatedMinutes: 25,
            challengeData: {
              id: 'ch-sql-01',
              title: 'Find Top 3 Highest Earners Per Department',
              topic: 'Window Functions (DENSE_RANK)',
              difficulty: 'Medium',
              supportedLanguages: ['SQL', 'Python', 'Java', 'JavaScript'],
              defaultLanguage: 'SQL',
              description: 'Write an SQL query to find employees who earn top 3 unique salaries in each department. If two employees earn the same salary, they share the same rank and should both be included.',
              constraints: ['Table: Employees (id, name, department_id, salary)', 'Table: Departments (id, name)'],
              inputSpecification: 'Schema: Employees and Departments tables',
              outputSpecification: 'Columns: Department, Employee, Salary',
              examples: [
                {
                  input: 'IT: [Aarav: 95k, Meera: 90k, Vikas: 90k, Pooja: 80k, Rahul: 70k]',
                  output: 'Aarav (Rank 1), Meera & Vikas (Rank 2), Pooja (Rank 3). Rahul excluded (Rank 4).',
                  explanation: 'DENSE_RANK assigns 1, 2, 2, 3, 4.'
                }
              ],
              hints: [
                'Use a Common Table Expression (CTE) with DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC).',
                'Filter WHERE rank <= 3 in the outer query.'
              ],
              starterSolutions: {
                SQL: `WITH RankedSalaries AS (\n    SELECT \n        d.name AS Department,\n        e.name AS Employee,\n        e.salary AS Salary,\n        DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) as rank_num\n    FROM Employees e\n    JOIN Departments d ON e.department_id = d.id\n)\nSELECT Department, Employee, Salary\nFROM RankedSalaries\nWHERE rank_num <= 3;\n`,
                Python: `# In Python Pandas / Polars:\n# df['rank'] = df.groupby('department')['salary'].rank(method='dense', ascending=False)\n# result = df[df['rank'] <= 3][['department', 'name', 'salary']]`,
                JavaScript: `// JS simulation using reduce & sort`,
                Java: `// Java Streams groupBy and rank`,
                'C++': `// C++ mapping and sorting`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Department with Salary Ties',
                  input: 'IT Department with duplicate 90k salary',
                  expectedOutput: 'Includes tied salaries at rank 2 and next salary at rank 3',
                  isHidden: false
                },
                {
                  id: 2,
                  title: 'Scenario 02 — Department with fewer than 3 employees',
                  input: 'HR Department with 2 employees',
                  expectedOutput: 'Returns all employees in department',
                  isHidden: false
                }
              ]
            }
          },
          {
            id: 'item-sql-01-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: SQL Windowing & Joins',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-sql-01',
              title: 'Module 01 Knowledge Check — SQL Mastery',
              moduleId: 'mod-sql-01',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'What is the main behavioral difference between `RANK()` and `DENSE_RANK()` in SQL?',
                  options: [
                    'RANK() skips rank numbers after ties; DENSE_RANK() assigns consecutive numbers with no gaps.',
                    'DENSE_RANK() only works with integer columns.',
                    'RANK() requires an ASC sort order while DENSE_RANK() requires DESC.',
                    'DENSE_RANK() can only be evaluated across one partition.'
                  ],
                  correctIndex: 0,
                  explanation: 'If two rows tie at rank 1, RANK() assigns 1, 1, 3 to the next row, whereas DENSE_RANK() assigns 1, 1, 2.',
                  topic: 'Window Functions',
                  difficulty: 'Beginner'
                },
                {
                  id: 2,
                  question: 'Which clause in PostgreSQL is used to inspect the query planner cost and execution node tree?',
                  options: ['INSPECT PLAN', 'EXPLAIN ANALYZE', 'DEBUG QUERY', 'PROFILE INDEX'],
                  correctIndex: 1,
                  explanation: 'EXPLAIN ANALYZE executes the statement and prints detailed cost estimates alongside actual row counts and timing per node.',
                  topic: 'Performance Tuning',
                  difficulty: 'Intermediate'
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-java-004',
    name: 'Java Development Fundamentals',
    slug: 'java-development-fundamentals',
    primarySkill: 'Java',
    skills: ['Java 21', 'Spring Boot Basics', 'Generics', 'Multithreading & Concurrency', 'Streams API', 'JVM Memory Tuning'],
    category: 'Enterprise Backend',
    difficulty: 'Intermediate',
    provider: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    instructor: {
      name: 'Priya Sharma',
      title: 'Enterprise Java Architect & Trainer',
      organization: 'MSIAS Pune',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=80',
      bio: 'Oracle Certified Java Enterprise Architect with 12+ years building microservices for banking and public infrastructure.'
    },
    estimatedDuration: '28 Hours',
    moduleCount: 2,
    lessonCount: 4,
    challengeCount: 2,
    assessmentCount: 2,
    description: 'Deep dive into modern Java 21 features (Virtual Threads, Pattern Matching, Record classes), JVM memory architecture (Garbage Collection, Heap vs Stack), concurrency frameworks, and the functional Streams API.',
    learningOutcomes: [
      'Leverage Java 21 Records, Pattern Matching, and Sealed Classes',
      'Process collections fluently with the Java Stream API and parallel streams',
      'Build concurrent applications using ExecutorService and Virtual Threads (Project Loom)',
      'Diagnose memory leaks and tune JVM garbage collectors (G1, ZGC)'
    ],
    prerequisites: ['Basic object-oriented programming concepts'],
    status: 'in_progress',
    dueDate: '2026-09-30',
    certificateEligible: true,
    certificateCriteria: 'Complete all modules and achieve passing scores on all knowledge assessments.',
    enrolled: false,
    lastAccessedAt: '2026-08-25T11:00:00Z',
    tags: ['Java', 'Spring Boot', 'Backend', 'JVM', 'Microservices'],
    targetRoles: ['Java Backend Developer', 'Enterprise Software Engineer'],
    accentColor: '#ef4444',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-java-01',
        orderIndex: 1,
        title: 'Module 01 — Modern Java 21 & Streams API',
        description: 'Immutability with Records, Sealed Classes, pattern matching for switch, and high-performance Streams pipelines.',
        estimatedDuration: '12 Hours',
        items: [
          {
            id: 'item-java-01-01',
            type: 'lesson',
            title: 'Java Stream API: Filter, Map, FlatMap & Collectors',
            orderIndex: 1,
            estimatedMinutes: 30,
            lessonData: {
              heading: 'Java Stream API: Filter, Map, FlatMap & Collectors',
              summary: 'Transform imperative loops into declarative functional pipelines with lazy evaluation and parallel processing.',
              estimatedMinutes: 30,
              sections: [
                {
                  title: 'Declarative Stream Processing',
                  content: 'Streams represent sequences of elements supporting sequential and parallel aggregate operations.',
                  codeSnippet: {
                    language: 'java',
                    code: `List<Candidate> candidates = getCandidates();

// Group candidates by district and calculate average readiness score
Map<String, Double> avgScoreByDistrict = candidates.stream()
    .filter(c -> c.readinessScore() >= 60)
    .collect(Collectors.groupingBy(
        Candidate::district,
        Collectors.averagingInt(Candidate::readinessScore)
    ));`,
                    caption: 'Java Streams Grouping and Averaging'
                  }
                }
              ],
              importantPoints: [
                'Streams are lazy and do not execute until a terminal operation (collect, count, forEach) is invoked.',
                'Never modify the underlying collection while streaming through it (non-interference rule).'
              ],
              relatedResources: [
                {
                  title: 'Oracle Java 21 Stream API Specification',
                  type: 'documentation',
                  description: 'Detailed API docs for java.util.stream package.'
                }
              ]
            }
          },
          {
            id: 'item-java-01-02',
            type: 'challenge',
            title: 'Practice Challenge: Stream Word Frequency Counter',
            orderIndex: 2,
            estimatedMinutes: 25,
            challengeData: {
              id: 'ch-java-01',
              title: 'Top K Frequent Elements via Java Streams',
              topic: 'Streams & Maps',
              difficulty: 'Medium',
              supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
              defaultLanguage: 'Java',
              description: 'Given an array of strings `words` and an integer `k`, return the `k` most frequent words. Return the words sorted by their frequency from highest to lowest. If two words have the same frequency, sort them in lexicographical order.',
              constraints: ['1 <= words.length <= 500', '1 <= k <= unique words count'],
              inputSpecification: 'words: Array of string tokens\nk: Top count',
              outputSpecification: 'List of top k words ordered by frequency then alphabetically',
              examples: [
                {
                  input: 'words = ["skill", "track", "skill", "code", "track", "skill"], k = 2',
                  output: '["skill", "track"]',
                  explanation: '"skill" appears 3 times, "track" appears 2 times.'
                }
              ],
              hints: ['Use Collectors.groupingBy and Collectors.counting() to build a frequency map.'],
              starterSolutions: {
                Java: `import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class Solution {\n    public static List<String> topKFrequent(String[] words, int k) {\n        Map<String, Long> countMap = Arrays.stream(words)\n            .collect(Collectors.groupingBy(w -> w, Collectors.counting()));\n        \n        return countMap.entrySet().stream()\n            .sorted((e1, e2) -> {\n                int cmp = Long.compare(e2.getValue(), e1.getValue());\n                return (cmp != 0) ? cmp : e1.getKey().compareTo(e2.getKey());\n            })\n            .limit(k)\n            .map(Map.Entry::getKey)\n            .collect(Collectors.toList());\n    }\n}`,
                Python: `from collections import Counter\ndef top_k_frequent(words, k):\n    counts = Counter(words)\n    return sorted(counts.keys(), key=lambda w: (-counts[w], w))[:k]`,
                JavaScript: `function topKFrequent(words, k) {\n  const map = {};\n  for (const w of words) map[w] = (map[w] || 0) + 1;\n  return Object.keys(map).sort((a, b) => map[b] - map[a] || a.localeCompare(b)).slice(0, k);\n}`,
                'C++': `// C++ unordered_map & custom priority_queue`,
                SQL: `-- SQL equivalent`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Standard Top 2 Frequencies',
                  input: 'words = ["skill", "track", "skill", "code", "track", "skill"], k = 2',
                  expectedOutput: '["skill", "track"]',
                  isHidden: false
                }
              ]
            }
          },
          {
            id: 'item-java-01-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: Java 21 & Concurrency',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-java-01',
              title: 'Module 01 Knowledge Check — Java Fundamentals',
              moduleId: 'mod-java-01',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'What revolutionary concurrency feature was introduced in Java 21 via Project Loom?',
                  options: ['Virtual Threads (Lightweight fibers)', 'Volatile Pointers', 'Manual Memory Allocators', 'Async Coroutines without JVM runtime'],
                  correctIndex: 0,
                  explanation: 'Virtual threads allow millions of lightweight threads to be scheduled by the JVM on carrier OS threads with minimal RAM.',
                  topic: 'Java 21 Features',
                  difficulty: 'Intermediate'
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-fullstack-005',
    name: 'Modern Full Stack Engineering',
    slug: 'modern-full-stack-engineering',
    primarySkill: 'React.js & TypeScript',
    skills: ['React 19', 'TypeScript 5', 'Tailwind CSS', 'Node.js', 'REST & GraphQL APIs', 'State Management'],
    category: 'Cloud & Web',
    difficulty: 'Intermediate',
    provider: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    instructor: {
      name: 'Rohan Deshmukh',
      title: 'Full Stack Engineering Lead',
      organization: 'SkillTrack Engineering Academy',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=128&auto=format&fit=crop&q=80',
      bio: 'Full stack consultant who has deployed enterprise web systems across high-scale public sector and SaaS products.'
    },
    estimatedDuration: '32 Hours',
    moduleCount: 2,
    lessonCount: 4,
    challengeCount: 2,
    assessmentCount: 2,
    description: 'Comprehensive modern web architecture: TypeScript type inference, React 19 hooks and lifecycle management, performant component trees, responsive Tailwind styling, REST API design, and asynchronous state synchronization.',
    learningOutcomes: [
      'Build end-to-end applications in TypeScript with 100% strict type safety',
      'Optimize React rendering performance and prevent unnecessary re-renders',
      'Design modular RESTful API endpoints with Express and validation middleware',
      'Construct accessible, responsive enterprise interfaces using modern Tailwind CSS'
    ],
    prerequisites: ['HTML, CSS, and basic JavaScript knowledge'],
    status: 'in_progress',
    dueDate: '2026-10-05',
    certificateEligible: true,
    certificateCriteria: 'Pass all knowledge check assessments and complete coding exercises.',
    enrolled: true,
    lastAccessedAt: '2026-08-30T02:00:00Z',
    tags: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'Full Stack'],
    targetRoles: ['Full Stack Web Developer', 'Frontend Engineer', 'UI/UX Developer'],
    accentColor: '#8b5cf6',
    bannerImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-fs-01',
        orderIndex: 1,
        title: 'Module 01 — React 19 Component Lifecycle & State Architecture',
        description: 'Hooks deep-dive (useState, useEffect, useMemo, useCallback, useRef), state lifting, and custom reusable hook patterns.',
        estimatedDuration: '14 Hours',
        items: [
          {
            id: 'item-fs-01-01',
            type: 'lesson',
            title: 'Mastering React Hooks & State Flow',
            orderIndex: 1,
            estimatedMinutes: 30,
            lessonData: {
              heading: 'Mastering React Hooks & State Flow',
              summary: 'Learn the rules of hooks, dependency array mechanics, and preventing stale closures in asynchronous effects.',
              estimatedMinutes: 30,
              sections: [
                {
                  title: 'Pure Functional Components & Unidirectional Data Flow',
                  content: 'React components are pure functions of props and state. Data flows strictly downward from parent to child.',
                  codeSnippet: {
                    language: 'typescript',
                    code: `// Custom hook for debouncing fast inputs
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler); // Cleanup on rapid keystrokes
    };
  }, [value, delayMs]);

  return debouncedValue;
}`,
                    caption: 'Custom useDebounce hook with cleanup function'
                  }
                }
              ],
              importantPoints: [
                'Always declare primitive values or memoized callbacks in useEffect dependencies to prevent infinite re-renders.',
                'Cleanup functions in useEffect run before the effect re-executes and when the component unmounts.'
              ],
              relatedResources: [
                {
                  title: 'React 19 Official Documentation',
                  type: 'documentation',
                  description: 'Guides on hooks, actions, and compiler optimizations.'
                }
              ]
            }
          },
          {
            id: 'item-fs-01-02',
            type: 'challenge',
            title: 'Practice Challenge: Flatten Nested Object Hierarchy',
            orderIndex: 2,
            estimatedMinutes: 25,
            challengeData: {
              id: 'ch-fs-01',
              title: 'Deep Flatten Nested Configuration Object',
              topic: 'TypeScript & Object Traversal',
              difficulty: 'Medium',
              supportedLanguages: ['JavaScript', 'Python', 'Java', 'C++'],
              defaultLanguage: 'JavaScript',
              description: 'Write a function `flattenObject(obj)` that takes a nested dictionary/object and returns a flattened version where keys are joined by dots (`"."`).',
              constraints: ['Input contains nested key-value objects, strings, numbers, and booleans', 'Max nesting depth is 10'],
              inputSpecification: 'Nested object: { user: { profile: { name: "Aarav" } } }',
              outputSpecification: 'Flat object: { "user.profile.name": "Aarav" }',
              examples: [
                {
                  input: '{ a: { b: { c: 1 } }, d: 2 }',
                  output: '{ "a.b.c": 1, "d": 2 }',
                  explanation: 'Nested keys "a" -> "b" -> "c" become "a.b.c".'
                }
              ],
              hints: ['Use recursion with a prefix string accumulator.'],
              starterSolutions: {
                JavaScript: `function flattenObject(obj, prefix = '') {\n  const result = {};\n  for (const [key, value] of Object.entries(obj)) {\n    const newKey = prefix ? \`\${prefix}.\${key}\` : key;\n    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {\n      Object.assign(result, flattenObject(value, newKey));\n    } else {\n      result[newKey] = value;\n    }\n  }\n  return result;\n}`,
                Python: `def flatten_object(d, prefix=''):\n    result = {}\n    for k, v in d.items():\n        new_key = f"{prefix}.{k}" if prefix else k\n        if isinstance(v, dict):\n            result.update(flatten_object(v, new_key))\n        else:\n            result[new_key] = v\n    return result`,
                Java: `// Java recursive map flattening`,
                'C++': `// C++ recursive json map flattening`,
                SQL: `-- Handled in SQL via JSONB path extraction`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — 3-Level Deep Nesting',
                  input: '{ a: { b: { c: 1 } }, d: 2 }',
                  expectedOutput: '{ "a.b.c": 1, "d": 2 }',
                  isHidden: false
                }
              ]
            }
          },
          {
            id: 'item-fs-01-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: React & TypeScript',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-fs-01',
              title: 'Module 01 Knowledge Check — Full Stack Web',
              moduleId: 'mod-fs-01',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'Why should you avoid defining objects or array literals directly in a `useEffect` dependency array without `useMemo`?',
                  options: [
                    'Because in JavaScript, new object references are created on every render, causing the effect to run on every cycle.',
                    'Because React will throw a compile-time syntax error.',
                    'Because arrays cannot be serialized by the virtual DOM.',
                    'Because TypeScript strictly prohibits non-primitive dependencies.'
                  ],
                  correctIndex: 0,
                  explanation: 'React compares dependency arrays using Object.is. Literal objects have fresh memory addresses on every render, triggering infinite re-execution.',
                  topic: 'React Hooks',
                  difficulty: 'Intermediate'
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-comp-006',
    name: 'Competitive Problem Solving',
    slug: 'competitive-problem-solving',
    primarySkill: 'Problem Solving',
    skills: ['Dynamic Programming', 'Graph Theory', 'Bit Manipulation', 'Number Theory', 'Greedy Algorithms'],
    category: 'Competitive Programming',
    difficulty: 'Advanced',
    provider: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    instructor: {
      name: 'Vikram Joshi',
      title: 'Grandmaster & ICPC Regional Finalist',
      organization: 'SkillTrack Elite Lab',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=80',
      bio: 'Top-tier competitive programmer and lead coach for national collegiate algorithm olympiads.'
    },
    estimatedDuration: '36 Hours',
    moduleCount: 2,
    lessonCount: 4,
    challengeCount: 2,
    assessmentCount: 2,
    description: 'Sharpen algorithmic intuition for top-tier competitive contests and technical interviews: advanced dynamic programming on trees and bitmasks, Dijkstra with priority queues, segment trees, and mathematical number theory.',
    learningOutcomes: [
      'Deconstruct complex contest problems into formal recurrence relations',
      'Optimize exponential state spaces using bitmask DP and memoization',
      'Implement range query data structures (Segment Trees, Binary Indexed Trees)',
      'Apply greedy interval scheduling and matroid properties'
    ],
    prerequisites: ['Data Structures & Algorithms Course or equivalent mastery'],
    status: 'in_progress',
    dueDate: '2026-10-15',
    certificateEligible: true,
    certificateCriteria: 'Achieve >= 85% on all advanced assessments and solve all algorithmic challenges.',
    enrolled: false,
    lastAccessedAt: '2026-08-20T16:00:00Z',
    tags: ['Competitive Programming', 'ICPC', 'Algorithms', 'Advanced DP'],
    targetRoles: ['Algorithmic Engineer', 'Quantitative Developer', 'Senior Software Engineer'],
    accentColor: '#ec4899',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-cp-01',
        orderIndex: 1,
        title: 'Module 01 — Dynamic Programming: State Space Optimization',
        description: 'Knapsack variations, longest common subsequence, matrix chain multiplication, and DP on DAGs.',
        estimatedDuration: '16 Hours',
        items: [
          {
            id: 'item-cp-01-01',
            type: 'lesson',
            title: '0/1 Knapsack & 1D Space Rolling Array Optimization',
            orderIndex: 1,
            estimatedMinutes: 30,
            lessonData: {
              heading: '0/1 Knapsack & 1D Space Rolling Array Optimization',
              summary: 'Optimize 2D DP tables `dp[i][w]` to a single 1D rolling array `dp[w]` by iterating backwards to avoid item reuse.',
              estimatedMinutes: 30,
              sections: [
                {
                  title: 'Space Optimization in Knapsack',
                  content: 'By iterating capacity backwards from W down to item_weight, we ensure that each item is only counted once while keeping memory complexity to O(W).',
                  codeSnippet: {
                    language: 'python',
                    code: `def knapsack_01(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for weight, val in zip(weights, values):
        for w in range(W, weight - 1, -1):
            dp[w] = max(dp[w], dp[w - weight] + val)
    return dp[W]`,
                    caption: '1D Rolling Array 0/1 Knapsack in O(N*W) time and O(W) space'
                  }
                }
              ],
              importantPoints: [
                'Backward iteration in 1D array guarantees 0/1 (at most once) selection.',
                'Forward iteration solves the Unbounded Knapsack problem where items can be reused infinitely.'
              ],
              relatedResources: [
                {
                  title: 'Handbook of Competitive Programming',
                  type: 'documentation',
                  description: 'Antti Laaksonen dynamic programming chapter.'
                }
              ]
            }
          },
          {
            id: 'item-cp-01-02',
            type: 'challenge',
            title: 'Practice Challenge: Coin Change (Minimum Coins)',
            orderIndex: 2,
            estimatedMinutes: 30,
            challengeData: {
              id: 'ch-cp-01',
              title: 'Coin Change — Minimum Coins to Make Amount',
              topic: 'Dynamic Programming',
              difficulty: 'Medium',
              supportedLanguages: ['Python', 'C++', 'Java', 'JavaScript'],
              defaultLanguage: 'Python',
              description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return `-1`.',
              constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
              inputSpecification: 'coins: array of coin denominations\namount: target integer amount',
              outputSpecification: 'Minimum number of coins, or -1 if impossible',
              examples: [
                {
                  input: 'coins = [1, 2, 5], amount = 11',
                  output: '3',
                  explanation: '11 = 5 + 5 + 1 (3 coins total).'
                },
                {
                  input: 'coins = [2], amount = 3',
                  output: '-1',
                  explanation: 'Cannot make 3 using only 2-denomination coins.'
                }
              ],
              hints: ['Initialize dp array of size amount + 1 with infinity.', 'dp[0] = 0.'],
              starterSolutions: {
                Python: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for x in range(coin, amount + 1):\n            dp[x] = min(dp[x], dp[x - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n`,
                JavaScript: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (const coin of coins) {\n    for (let x = coin; x <= amount; x++) {\n      dp[x] = Math.min(dp[x], dp[x - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
                Java: `import java.util.Arrays;\npublic class Solution {\n    public static int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int coin : coins) {\n            for (int x = coin; x <= amount; x++) {\n                dp[x] = Math.min(dp[x], dp[x - coin] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
                'C++': `#include <vector>\n#include <algorithm>\nint coinChange(const std::vector<int>& coins, int amount) {\n    std::vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int coin : coins) {\n        for (int x = coin; x <= amount; x++) {\n            dp[x] = std::min(dp[x], dp[x - coin] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
                SQL: `-- Recursive CTE for Coin Change`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Target Amount 11 with [1, 2, 5]',
                  input: 'coins = [1, 2, 5], amount = 11',
                  expectedOutput: '3',
                  isHidden: false
                },
                {
                  id: 2,
                  title: 'Scenario 02 — Impossible Amount',
                  input: 'coins = [2], amount = 3',
                  expectedOutput: '-1',
                  isHidden: false
                }
              ]
            }
          },
          {
            id: 'item-cp-01-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: DP State Machines',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-cp-01',
              title: 'Module 01 Knowledge Check — Dynamic Programming',
              moduleId: 'mod-cp-01',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'What two essential properties must a problem exhibit for Dynamic Programming to be applicable?',
                  options: [
                    'Optimal Substructure and Overlapping Subproblems',
                    'Greedy Choice Property and Monotonicity',
                    'Polynomial Time Bound and Asymptotic Invariance',
                    'Bitmask Compatibility and Tree Graph Structure'
                  ],
                  correctIndex: 0,
                  explanation: 'DP applies when solutions to subproblems can be combined into optimal global solutions (optimal substructure) and subproblems repeat (overlapping subproblems).',
                  topic: 'DP Fundamentals',
                  difficulty: 'Beginner'
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'crs-ai-007',
    name: 'Applied AI & Machine Learning',
    slug: 'applied-ai-machine-learning',
    primarySkill: 'Machine Learning',
    skills: ['PyTorch', 'Scikit-Learn', 'Feature Engineering', 'LLM Integration', 'Model Evaluation & MLOps'],
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    provider: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    instructor: {
      name: 'Dr. Shruti Nair',
      title: 'Lead AI Scientist & MLOps Researcher',
      organization: 'MSIAS AI Innovation Lab',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=128&auto=format&fit=crop&q=80',
      bio: 'PhD in Computer Vision from IIT Bombay, former principal researcher at Google AI with 20+ peer-reviewed papers.'
    },
    estimatedDuration: '40 Hours',
    moduleCount: 2,
    lessonCount: 4,
    challengeCount: 2,
    assessmentCount: 2,
    description: 'End-to-end practical machine learning and generative AI workflows: exploratory data analysis, tabular classification and regression pipelines, deep neural network training in PyTorch, vector databases, and LLM prompt orchestrations.',
    learningOutcomes: [
      'Build end-to-end scikit-learn preprocessing and gradient-boosting pipelines',
      'Train, validate, and debug deep neural networks with PyTorch',
      'Evaluate models with ROC-AUC, F1-scores, and confusion matrices',
      'Orchestrate Retrieval-Augmented Generation (RAG) using embeddings and vector search'
    ],
    prerequisites: ['Python proficiency and foundational linear algebra / statistics'],
    status: 'in_progress',
    dueDate: '2026-10-20',
    certificateEligible: true,
    certificateCriteria: 'Achieve >= 80% on all AI Knowledge Checks and complete all ML evaluation challenges.',
    enrolled: false,
    lastAccessedAt: '2026-08-22T09:00:00Z',
    tags: ['AI', 'Machine Learning', 'PyTorch', 'LLMs', 'MLOps'],
    targetRoles: ['AI/ML Engineer', 'Data Scientist', 'LLM Application Developer'],
    accentColor: '#06b6d4',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-ai-01',
        orderIndex: 1,
        title: 'Module 01 — Feature Engineering & Model Evaluation Metrics',
        description: 'Imputation, categorical one-hot vs target encoding, scaling, cross-validation, and metrics (Precision, Recall, F1, ROC-AUC).',
        estimatedDuration: '18 Hours',
        items: [
          {
            id: 'item-ai-01-01',
            type: 'lesson',
            title: 'Precision, Recall, F1 & The Bias-Variance Tradeoff',
            orderIndex: 1,
            estimatedMinutes: 35,
            lessonData: {
              heading: 'Precision, Recall, F1 & The Bias-Variance Tradeoff',
              summary: 'Understand when accuracy is misleading on imbalanced datasets and how to calibrate decision thresholds based on real business impact.',
              estimatedMinutes: 35,
              sections: [
                {
                  title: 'Evaluating Imbalanced Datasets',
                  content: 'In medical diagnosis or fraud detection where positive cases are < 1%, a model predicting "Negative" 100% of the time achieves 99% accuracy but 0% recall. Precision and Recall provide genuine insight.',
                  codeSnippet: {
                    language: 'python',
                    code: `from sklearn.metrics import classification_report, roc_auc_score

# Calculating Precision, Recall, F1 and ROC-AUC
y_true = [0, 1, 0, 0, 1, 1, 0, 1]
y_pred = [0, 1, 0, 0, 0, 1, 0, 1]

print(classification_report(y_true, y_pred, target_names=["Negative", "Positive"]))`,
                    caption: 'Scikit-Learn Classification Report Metrics'
                  }
                }
              ],
              importantPoints: [
                'Precision = TP / (TP + FP) — Minimizes false alarms.',
                'Recall = TP / (TP + FN) — Minimizes missed critical detections.',
                'F1-score is the harmonic mean of Precision and Recall.'
              ],
              relatedResources: [
                {
                  title: 'Scikit-Learn Model Evaluation Guide',
                  type: 'documentation',
                  description: 'Comprehensive mathematical formulations of all classification metrics.'
                }
              ]
            }
          },
          {
            id: 'item-ai-01-02',
            type: 'challenge',
            title: 'Practice Challenge: Compute Confusion Matrix Metrics',
            orderIndex: 2,
            estimatedMinutes: 25,
            challengeData: {
              id: 'ch-ai-01',
              title: 'Calculate Binary Classification F1-Score',
              topic: 'ML Metrics & Evaluation',
              difficulty: 'Easy',
              supportedLanguages: ['Python', 'JavaScript', 'Java', 'C++'],
              defaultLanguage: 'Python',
              description: 'Given two arrays of equal length `y_true` and `y_pred` containing binary labels (0 or 1), write a function `calculate_f1_score(y_true, y_pred)` that calculates the F1-score (harmonic mean of Precision and Recall) rounded to 4 decimal places. If precision + recall is 0, return 0.0.',
              constraints: ['1 <= len(y_true) <= 10^5', 'y_true[i], y_pred[i] in {0, 1}'],
              inputSpecification: 'y_true: array of actual binary labels\ny_pred: array of predicted binary labels',
              outputSpecification: 'Float F1-score rounded to 4 decimal places',
              examples: [
                {
                  input: 'y_true = [1, 1, 0, 1], y_pred = [1, 0, 0, 1]',
                  output: '0.8',
                  explanation: 'TP = 2, FP = 0, FN = 1. Precision = 2/2 = 1.0, Recall = 2/3 = 0.6667. F1 = 2 * (1.0 * 0.6667)/(1.6667) = 0.8.'
                }
              ],
              hints: [
                'Count True Positives (TP: true=1, pred=1), False Positives (FP: true=0, pred=1), and False Negatives (FN: true=1, pred=0).',
                'Precision = TP / (TP + FP) if (TP + FP) > 0 else 0.',
                'Recall = TP / (TP + FN) if (TP + FN) > 0 else 0.',
                'F1 = 2 * (Precision * Recall) / (Precision + Recall).'
              ],
              starterSolutions: {
                Python: `def calculate_f1_score(y_true, y_pred):\n    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\n    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\n    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\n    \n    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0\n    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0\n    \n    if precision + recall == 0:\n        return 0.0\n    f1 = 2 * (precision * recall) / (precision + recall)\n    return round(f1, 4)\n`,
                JavaScript: `function calculateF1Score(yTrue, yPred) {\n  let tp = 0, fp = 0, fn = 0;\n  for (let i = 0; i < yTrue.length; i++) {\n    if (yTrue[i] === 1 && yPred[i] === 1) tp++;\n    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;\n    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;\n  }\n  const prec = tp + fp > 0 ? tp / (tp + fp) : 0;\n  const rec = tp + fn > 0 ? tp / (tp + fn) : 0;\n  if (prec + rec === 0) return 0;\n  return Number((2 * (prec * rec) / (prec + rec)).toFixed(4));\n}`,
                Java: `public class Solution {\n    public static double calculateF1Score(int[] yTrue, int[] yPred) {\n        int tp = 0, fp = 0, fn = 0;\n        for (int i = 0; i < yTrue.length; i++) {\n            if (yTrue[i] == 1 && yPred[i] == 1) tp++;\n            else if (yTrue[i] == 0 && yPred[i] == 1) fp++;\n            else if (yTrue[i] == 1 && yPred[i] == 0) fn++;\n        }\n        double prec = (tp + fp > 0) ? (double) tp / (tp + fp) : 0.0;\n        double rec = (tp + fn > 0) ? (double) tp / (tp + fn) : 0.0;\n        if (prec + rec == 0.0) return 0.0;\n        return Math.round(2 * (prec * rec) / (prec + rec) * 10000.0) / 10000.0;\n    }\n}`,
                'C++': `// C++ F1 metric implementation`,
                SQL: `-- SQL aggregate confusion matrix`
              },
              testScenarios: [
                {
                  id: 1,
                  title: 'Scenario 01 — Standard Label Array',
                  input: 'y_true = [1, 1, 0, 1], y_pred = [1, 0, 0, 1]',
                  expectedOutput: '0.8',
                  isHidden: false
                }
              ]
            }
          },
          {
            id: 'item-ai-01-03',
            type: 'knowledge_check',
            title: 'Knowledge Check: ML Evaluation',
            orderIndex: 3,
            estimatedMinutes: 15,
            knowledgeCheckData: {
              id: 'kc-ai-01',
              title: 'Module 01 Knowledge Check — AI & Machine Learning',
              moduleId: 'mod-ai-01',
              timeLimitMinutes: 10,
              passingPercentage: 80,
              questions: [
                {
                  id: 1,
                  question: 'Why is the F1-score computed as the harmonic mean rather than the arithmetic mean of Precision and Recall?',
                  options: [
                    'Because the harmonic mean penalizes extreme imbalances, approaching 0 if either precision or recall is near 0.',
                    'Because arithmetic mean cannot be calculated on decimal values between 0 and 1.',
                    'Because harmonic mean is required by gradient descent backpropagation.',
                    'Because it eliminates the need for test/train splits.'
                  ],
                  correctIndex: 0,
                  explanation: 'Harmonic mean gives much greater weight to low values, ensuring a high F1 score only when both Precision and Recall are strong.',
                  topic: 'ML Metrics',
                  difficulty: 'Intermediate'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
