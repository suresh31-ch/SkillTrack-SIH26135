export type SupportedSkill = 'Python' | 'Java' | 'C++' | 'SQL' | 'JavaScript' | 'React';
export type AssessmentDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type CodingLanguage = 'Python' | 'Java' | 'C++' | 'SQL';
export type CodingDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface SkillAssessmentDefinition {
  skill: SupportedSkill;
  difficulty: AssessmentDifficulty;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingPercentage: number;
  iconName: string;
  color: string;
  questions: QuizQuestion[];
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  language: CodingLanguage;
  difficulty: CodingDifficulty;
  category: string;
  timeLimit: string;
  memoryLimit: string;
  description: string;
  starterCode: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  testCases: TestCase[];
  hints: string[];
}

export interface HistoricalAssessmentRecord {
  id: string;
  assessmentId: string;
  skill: SupportedSkill;
  difficulty: AssessmentDifficulty;
  title: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  performanceLevel: string;
  timeSpentSeconds: number;
  completedAt: string;
  recommendations: string[];
}

export interface SolvedProblemRecord {
  id: string;
  problemId: string;
  title: string;
  language: CodingLanguage;
  difficulty: CodingDifficulty;
  solvedAt: string;
  passedTests: number;
  totalTests: number;
}

// -------------------------------------------------------------
// COMPREHENSIVE 180 QUESTIONS (6 Skills x 3 Difficulties x 10 Qs)
// -------------------------------------------------------------

export const QUIZ_DATA_BANK: Record<SupportedSkill, Record<AssessmentDifficulty, QuizQuestion[]>> = {
  Python: {
    Beginner: [
      {
        id: 1,
        question: 'What is the output of type([1, 2, 3]) in Python 3?',
        options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'set'>"],
        correctIndex: 0,
        explanation: 'In Python, square brackets declare a built-in list object.',
        topic: 'Data Types'
      },
      {
        id: 2,
        question: 'Which keyword is used to define a function in Python?',
        options: ['func', 'def', 'function', 'fn'],
        correctIndex: 1,
        explanation: 'Python uses the "def" keyword to define user functions.',
        topic: 'Functions'
      },
      {
        id: 3,
        question: 'What is the correct syntax to output "Hello" to the standard console?',
        options: ['echo "Hello"', 'console.log("Hello")', 'print("Hello")', 'System.out.println("Hello")'],
        correctIndex: 2,
        explanation: 'print() is the built-in function for console output in Python.',
        topic: 'Syntax'
      },
      {
        id: 4,
        question: 'Which of the following is an immutable sequence data type in Python?',
        options: ['list', 'dict', 'set', 'tuple'],
        correctIndex: 3,
        explanation: 'Tuples are immutable; once created, their elements cannot be modified.',
        topic: 'Data Structures'
      },
      {
        id: 5,
        question: 'What will len("SkillTrack") evaluate to?',
        options: ['8', '9', '10', '11'],
        correctIndex: 2,
        explanation: 'The string "SkillTrack" has exactly 10 characters.',
        topic: 'Strings'
      },
      {
        id: 6,
        question: 'How do you insert a single-line comment in Python?',
        options: ['// this is a comment', '/* this is a comment */', '# this is a comment', '-- this is a comment'],
        correctIndex: 2,
        explanation: 'The hash symbol (#) denotes a single-line comment in Python.',
        topic: 'Syntax'
      },
      {
        id: 7,
        question: 'What is the value of 7 // 2 in Python 3?',
        options: ['3.5', '3', '4', '1'],
        correctIndex: 1,
        explanation: 'The double slash (//) is the floor division operator, which returns 3.',
        topic: 'Operators'
      },
      {
        id: 8,
        question: 'Which built-in method adds an item to the end of a list?',
        options: ['list.push()', 'list.add()', 'list.append()', 'list.insert_end()'],
        correctIndex: 2,
        explanation: 'append() appends an element directly to the end of an existing list.',
        topic: 'List Methods'
      },
      {
        id: 9,
        question: 'What is the output of bool(0) and bool(1)?',
        options: ['True, True', 'False, False', 'False, True', 'True, False'],
        correctIndex: 2,
        explanation: '0 evaluates to False in boolean context; non-zero numbers evaluate to True.',
        topic: 'Booleans'
      },
      {
        id: 10,
        question: 'Which statement is used to terminate a loop immediately in Python?',
        options: ['stop', 'exit', 'break', 'return'],
        correctIndex: 2,
        explanation: 'break terminates the innermost executing loop.',
        topic: 'Control Flow'
      }
    ],
    Intermediate: [
      {
        id: 1,
        question: 'What does a list comprehension [x**2 for x in range(5) if x % 2 == 0] produce?',
        options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'],
        correctIndex: 0,
        explanation: 'Even numbers in range(5) are 0, 2, 4. Their squares are 0, 4, 16.',
        topic: 'List Comprehensions'
      },
      {
        id: 2,
        question: 'What is the purpose of the "yield" keyword in Python functions?',
        options: [
          'To pause execution and produce a generator value without destroying local state',
          'To exit the function and throw a custom error',
          'To allocate memory directly on the C-level heap',
          'To import an asynchronous module'
        ],
        correctIndex: 0,
        explanation: 'yield turns a standard function into a generator generator iterator.',
        topic: 'Generators'
      },
      {
        id: 3,
        question: 'What is the difference between shallow copy (copy.copy) and deep copy (copy.deepcopy)?',
        options: [
          'Shallow copy copies references of nested objects; deep copy recursively copies nested objects',
          'Deep copy only works on primitive types',
          'Shallow copy freezes the original object',
          'There is no difference in Python 3.10+'
        ],
        correctIndex: 0,
        explanation: 'copy.deepcopy duplicates all nested structures recursively, avoiding shared mutable state.',
        topic: 'Memory & References'
      },
      {
        id: 4,
        question: 'What does *args and **kwargs represent in a Python function definition?',
        options: [
          'Pointer dereferencing and double pointer references',
          'Variable positional arguments tuple and variable keyword arguments dictionary',
          'Matrix multiplication operators',
          'Type annotations for integers and strings'
        ],
        correctIndex: 1,
        explanation: '*args collects extra positional arguments into a tuple; **kwargs collects keyword arguments into a dict.',
        topic: 'Functions'
      },
      {
        id: 5,
        question: 'Which method is automatically executed when creating an instance of a class?',
        options: ['__create__', '__init__', '__new_instance__', '__construct__'],
        correctIndex: 1,
        explanation: '__init__ is the initializer method for newly allocated instances.',
        topic: 'OOP'
      },
      {
        id: 6,
        question: 'What is the GIL (Global Interpreter Lock) in CPython?',
        options: [
          'A cryptographic lock securing file I/O operations',
          'A mutex that protects access to Python objects, preventing multiple native threads from executing bytecode at once',
          'A garbage collection mechanism for circular references',
          'A firewall rule for Python socket servers'
        ],
        correctIndex: 1,
        explanation: 'The GIL prevents multiple native OS threads from running Python bytecodes simultaneously within a single process.',
        topic: 'Concurrency'
      },
      {
        id: 7,
        question: 'How do decorators work in Python?',
        options: [
          'They are syntactic sugar that takes a function as argument, wraps it, and returns an altered function',
          'They modify class bytecode on disk before compilation',
          'They enforce static typing at compile time',
          'They are HTML style tags for terminal printing'
        ],
        correctIndex: 0,
        explanation: 'Decorators are higher-order functions that take a callable and return a callable with enhanced behavior.',
        topic: 'Decorators'
      },
      {
        id: 8,
        question: 'What is the time complexity of looking up a key in a Python dict on average?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        correctIndex: 2,
        explanation: 'Python dictionaries use hash tables, achieving average O(1) time complexity for lookups and insertions.',
        topic: 'Time Complexity'
      },
      {
        id: 9,
        question: 'What does the "with" statement guarantee when working with file streams?',
        options: [
          'Files are automatically encrypted',
          'The __enter__ and __exit__ methods of the context manager are invoked, ensuring files close even on exceptions',
          'Data is written directly into RAM rather than disk',
          'File permissions are set to read-only'
        ],
        correctIndex: 1,
        explanation: 'Context managers guarantee cleanup (__exit__) regardless of whether exceptions occur in the block.',
        topic: 'Context Managers'
      },
      {
        id: 10,
        question: 'What is the result of set([1, 2, 2, 3, 4, 4])?',
        options: ['{1, 2, 3, 4}', '[1, 2, 3, 4]', '{1, 2, 2, 3, 4, 4}', 'Error: Duplicate elements'],
        correctIndex: 0,
        explanation: 'Sets only maintain unique values and deduplicate automatically.',
        topic: 'Sets'
      }
    ],
    Advanced: [
      {
        id: 1,
        question: 'What is a metaclass in Python and what is its default type?',
        options: [
          'A class of a class whose instances are classes; default is `type`',
          'A base class inherited by all standard library modules; default is `object`',
          'A C-extension wrapper for Cython; default is `ctypes`',
          'An abstract base class from `collections.abc`'
        ],
        correctIndex: 0,
        explanation: 'Metaclasses define how classes themselves are constructed. In Python, `type` is the default metaclass.',
        topic: 'Metaprogramming'
      },
      {
        id: 2,
        question: 'How does Python handle cyclic reference garbage collection?',
        options: [
          'Only through deterministic reference counting without any cycle detection',
          'A generational garbage collector (Generations 0, 1, 2) that periodically scans objects with reference counts > 0 for unreachable cycles',
          'By forcing all variables to be freed upon leaving a function block',
          'Using the mark-and-sweep algorithm of the V8 JavaScript engine'
        ],
        correctIndex: 1,
        explanation: 'Python combines reference counting with a 3-generational cyclic garbage collector (`gc` module).',
        topic: 'Memory Management'
      },
      {
        id: 3,
        question: 'What is the descriptor protocol in Python?',
        options: [
          'A protocol defining __get__, __set__, and/or __delete__ methods on attribute classes',
          'A network protocol for remote procedure calls (RPC)',
          'A docstring parsing convention for Sphinx documentation',
          'A method to serialize Python objects into binary JSON'
        ],
        correctIndex: 0,
        explanation: 'Descriptors manage attribute access behavior by implementing __get__, __set__, or __delete__.',
        topic: 'Descriptors'
      },
      {
        id: 4,
        question: 'What is the difference between asyncio.gather() and asyncio.wait()?',
        options: [
          'gather returns results in the exact order of tasks; wait returns a tuple of (done, pending) task sets and supports FIRST_COMPLETED conditions',
          'gather runs synchronously while wait runs asynchronously',
          'gather cannot catch exceptions; wait ignores timeouts',
          'There is no functional distinction'
        ],
        correctIndex: 0,
        explanation: 'asyncio.gather aggregates results preserving order, whereas asyncio.wait yields fine-grained control with (done, pending) sets.',
        topic: 'AsyncIO'
      },
      {
        id: 5,
        question: 'Why would a class define __slots__?',
        options: [
          'To prevent dynamic creation of __dict__ per instance, saving significant RAM and speeding up attribute access',
          'To enable multi-threading without the GIL',
          'To force all methods to become static methods',
          'To allow private attributes to be accessed without name mangling'
        ],
        correctIndex: 0,
        explanation: '__slots__ reserves space for a fixed set of attributes, eliminating per-instance __dict__ overhead.',
        topic: 'Optimization'
      },
      {
        id: 6,
        question: 'What is the time complexity of Python\'s built-in sorting algorithm (Timsort) in the best and worst cases?',
        options: [
          'Best: O(n), Worst: O(n log n)',
          'Best: O(1), Worst: O(n^2)',
          'Best: O(n log n), Worst: O(n^2)',
          'Best: O(log n), Worst: O(n log n)'
        ],
        correctIndex: 0,
        explanation: 'Timsort exploits existing ordered runs, achieving linear O(n) for sorted data and O(n log n) worst-case.',
        topic: 'Algorithms'
      },
      {
        id: 7,
        question: 'In the multiprocessing module, what is the key difference between "fork" and "spawn" start methods?',
        options: [
          'fork clones the entire process state without re-importing main, while spawn starts a fresh Python interpreter and imports the entry point cleanly',
          'spawn runs threads while fork runs processes',
          'fork is only available on Windows systems',
          'spawn shares the same memory space directly'
        ],
        correctIndex: 0,
        explanation: 'fork duplicates address space via OS fork(), while spawn initializes a fresh process interpreter safely across all OS platforms.',
        topic: 'Multiprocessing'
      },
      {
        id: 8,
        question: 'What does functools.lru_cache do and what parameter controls its cache capacity?',
        options: [
          'Memoizes function call results using a Least Recently Used strategy; controlled by maxsize',
          'Loads data into Redis cluster memory; controlled by ttl',
          'Compresses function bytecode in RAM; controlled by chunk_size',
          'Forces function execution into CPU L1 cache directly'
        ],
        correctIndex: 0,
        explanation: 'functools.lru_cache is a decorator that caches return values with LRU eviction based on maxsize.',
        topic: 'Functional Tools'
      },
      {
        id: 9,
        question: 'What is method resolution order (MRO) in Python multiple inheritance and which algorithm calculates it?',
        options: [
          'The order classes are searched for attributes; calculated by C3 Linearization',
          'Depth-first search strictly left-to-right without linearization',
          'Alphabetical order of method names calculated by Dijkstra algorithm',
          'Randomized resolution based on hash keys'
        ],
        correctIndex: 0,
        explanation: 'Python uses the C3 Linearization algorithm to compute a deterministic MRO that respects monotonicity and local precedence.',
        topic: 'Inheritance & MRO'
      },
      {
        id: 10,
        question: 'What does the struct module in Python do?',
        options: [
          'Converts between Python values and C structs represented as Python bytes',
          'Defines relational database schemas without an ORM',
          'Validates JSON schema structures at runtime',
          'Creates typed structs similar to Golang'
        ],
        correctIndex: 0,
        explanation: 'The struct module performs conversions between native Python objects and packed C-style binary byte buffers.',
        topic: 'Low-level / Systems'
      }
    ]
  },
  Java: {
    Beginner: [
      {
        id: 1,
        question: 'Which of the following is the valid entry point signature for a standard Java program?',
        options: [
          'public static void main(String[] args)',
          'public void main(String[] args)',
          'static void main(String args)',
          'public int main(String[] args)'
        ],
        correctIndex: 0,
        explanation: 'The JVM requires "public static void main(String[] args)" to boot a standard Java application.',
        topic: 'Core Syntax'
      },
      {
        id: 2,
        question: 'Which data type in Java is used to store true or false values?',
        options: ['bool', 'boolean', 'BooleanType', 'bit'],
        correctIndex: 1,
        explanation: 'In Java, the primitive boolean type is written as "boolean".',
        topic: 'Data Types'
      },
      {
        id: 3,
        question: 'What is the default value of an uninitialized int field in a Java class?',
        options: ['null', '0', 'undefined', '-1'],
        correctIndex: 1,
        explanation: 'Primitive numeric member variables default to 0 in Java.',
        topic: 'Variables'
      },
      {
        id: 4,
        question: 'Which keyword is used to inherit a class in Java?',
        options: ['implements', 'inherits', 'extends', 'super'],
        correctIndex: 2,
        explanation: 'The "extends" keyword establishes class inheritance in Java.',
        topic: 'OOP'
      },
      {
        id: 5,
        question: 'What happens when you compare two String objects using "==" instead of ".equals()"?',
        options: [
          'It compares their memory references, not their character contents',
          'It compares string lengths only',
          'It performs a case-insensitive character comparison',
          'It causes a compile-time error'
        ],
        correctIndex: 0,
        explanation: '"==" checks whether both references point to the same memory address in heap/string pool.',
        topic: 'Strings & Equality'
      },
      {
        id: 6,
        question: 'Which keyword is used to prevent a method from being overridden by child classes?',
        options: ['static', 'const', 'final', 'sealed'],
        correctIndex: 2,
        explanation: 'A "final" method cannot be overridden in any subclass.',
        topic: 'OOP Modifiers'
      },
      {
        id: 7,
        question: 'Which collection class in java.util allows dynamic resizing and maintains insertion order?',
        options: ['ArrayList', 'HashSet', 'TreeSet', 'HashMap'],
        correctIndex: 0,
        explanation: 'ArrayList implements a resizable array that maintains element insertion order.',
        topic: 'Collections'
      },
      {
        id: 8,
        question: 'What is JVM in the context of Java technology?',
        options: [
          'Java Variable Manager',
          'Java Virtual Machine',
          'Java Visual Modeler',
          'Java Version Module'
        ],
        correctIndex: 1,
        explanation: 'JVM (Java Virtual Machine) executes compiled Java bytecode on the host OS.',
        topic: 'Architecture'
      },
      {
        id: 9,
        question: 'Which block in try-catch-finally is ALWAYS executed regardless of whether an exception occurred?',
        options: ['try', 'catch', 'finally', 'throw'],
        correctIndex: 2,
        explanation: 'The "finally" block executes after try/catch blocks complete, guaranteeing cleanup.',
        topic: 'Exception Handling'
      },
      {
        id: 10,
        question: 'How do you create an object of class "Employee" in Java?',
        options: [
          'Employee emp = new Employee();',
          'Employee emp = Employee.create();',
          'emp = new Employee();',
          'var Employee = emp();'
        ],
        correctIndex: 0,
        explanation: 'Objects in Java are instantiated using the "new" operator with constructor invocation.',
        topic: 'Objects'
      }
    ],
    Intermediate: [
      {
        id: 1,
        question: 'What is the contract between equals() and hashCode() in Java?',
        options: [
          'If two objects are equal according to equals(), their hashCode() MUST produce the exact same integer',
          'If two objects have the same hashCode(), they MUST be equal according to equals()',
          'hashCode() must always return a positive prime number',
          'They operate independently without any contract requirement'
        ],
        correctIndex: 0,
        explanation: 'The Object contract mandates: if o1.equals(o2) is true, o1.hashCode() == o2.hashCode().',
        topic: 'Core Objects'
      },
      {
        id: 2,
        question: 'What is the difference between Comparable and Comparator interfaces?',
        options: [
          'Comparable defines natural ordering via compareTo(T o); Comparator provides custom external sorting via compare(T o1, T o2)',
          'Comparable is only for Strings; Comparator is for numbers',
          'Comparator is a class; Comparable is an annotation',
          'Comparable sorts in reverse order by default'
        ],
        correctIndex: 0,
        explanation: 'Comparable allows self-comparison (natural order), while Comparator is passed externally to customize sorting.',
        topic: 'Collections & Generics'
      },
      {
        id: 3,
        question: 'What does the "volatile" keyword guarantee in Java multi-threaded applications?',
        options: [
          'Atomicity of compound operations like count++',
          'Visibility of changes across threads by reading/writing directly to main memory rather than CPU cache',
          'Mutual exclusion locking like synchronized blocks',
          'Thread priority elevation by the OS scheduler'
        ],
        correctIndex: 1,
        explanation: 'volatile guarantees memory visibility and prevents instruction reordering, but does NOT provide operation atomicity.',
        topic: 'Concurrency'
      },
      {
        id: 4,
        question: 'What is the Java Streams API primarily used for?',
        options: [
          'Declarative functional processing and transformation of sequences of elements',
          'Low-level TCP network socket streaming',
          'Reading binary audio and video files',
          'Replacing standard SQL queries in relational databases'
        ],
        correctIndex: 0,
        explanation: 'Java 8 Streams provide functional pipeline operations (map, filter, reduce, collect) over collections.',
        topic: 'Streams'
      },
      {
        id: 5,
        question: 'What is the difference between checked and unchecked exceptions in Java?',
        options: [
          'Checked exceptions inherit from Exception (excluding RuntimeException) and must be caught or declared; unchecked inherit from RuntimeException',
          'Unchecked exceptions crash the JVM immediately',
          'Checked exceptions can only be thrown by the JVM internals',
          'Unchecked exceptions require mandatory try-catch blocks'
        ],
        correctIndex: 0,
        explanation: 'The compiler forces handling or declaration (`throws`) for checked exceptions at compile-time.',
        topic: 'Exceptions'
      },
      {
        id: 6,
        question: 'How does HashMap handle hash collisions internally in Java 8+?',
        options: [
          'Uses chaining with linked lists, and converts linked lists into red-black trees when bin count exceeds 8',
          'Throws a HashCollisionException',
          'Uses linear probing and evicts the oldest key',
          'Re-hashes the entire table into a single array'
        ],
        correctIndex: 0,
        explanation: 'Java 8 optimizes collision bins exceeding TREEIFY_THRESHOLD (8) by transforming linked nodes into balanced red-black trees.',
        topic: 'Data Structures'
      },
      {
        id: 7,
        question: 'What does "type erasure" in Java generics mean?',
        options: [
          'Type parameters are only enforced at compile-time and replaced with their bounds or Object in bytecode',
          'Generics are converted into C++ templates at runtime',
          'Primitive types are erased and replaced with void',
          'Class fields are deleted when garbage collected'
        ],
        correctIndex: 0,
        explanation: 'Generics exist for compile-time safety and are erased to raw types/bounds in compiled .class bytecode for backward compatibility.',
        topic: 'Generics'
      },
      {
        id: 8,
        question: 'Which interface in java.util.concurrent represents a task that returns a result and may throw an exception?',
        options: ['Runnable', 'Callable<V>', 'Future<V>', 'Supplier<T>'],
        correctIndex: 1,
        explanation: 'Callable<V> has a V call() method that can return a value and throw checked exceptions.',
        topic: 'Concurrency'
      },
      {
        id: 9,
        question: 'What is the purpose of the Optional<T> class introduced in Java 8?',
        options: [
          'To provide a type-level solution for representing optional values and preventing NullPointerExceptions',
          'To make class fields optional in serialization',
          'To disable method execution during unit tests',
          'To allow functions to have optional parameters like Python'
        ],
        correctIndex: 0,
        explanation: 'Optional<T> is a container object used to explicitly communicate the potential absence of a value.',
        topic: 'Modern Java'
      },
      {
        id: 10,
        question: 'What is the difference between String, StringBuilder, and StringBuffer?',
        options: [
          'String is immutable; StringBuilder is mutable and non-thread-safe (faster); StringBuffer is mutable and thread-safe (synchronized)',
          'StringBuilder is immutable; StringBuffer is mutable',
          'String is stored in stack; StringBuffer is stored in disk',
          'There is no difference in modern Java compilers'
        ],
        correctIndex: 0,
        explanation: 'StringBuilder is optimized for single-threaded string building, whereas StringBuffer synchronizes method calls.',
        topic: 'Memory & Performance'
      }
    ],
    Advanced: [
      {
        id: 1,
        question: 'How does the G1 (Garbage-First) garbage collector organize and clean heap memory?',
        options: [
          'Divides the heap into equal-sized independent regions and prioritizes collecting regions containing the most reclaimable garbage within a target pause time',
          'Scans memory using a single monolithic stop-the-world serial pass',
          'Separates memory into strictly two fixed physical banks without young/old generations',
          'Delegates memory collection to the Linux kernel malloc library'
        ],
        correctIndex: 0,
        explanation: 'G1 partitions the heap into 2048+ discrete regions and dynamically targets regions with the highest garbage density.',
        topic: 'JVM & Garbage Collection'
      },
      {
        id: 2,
        question: 'What is the Java Memory Model (JMM) "happens-before" relationship?',
        options: [
          'A formal guarantee that memory writes by one action are guaranteed to be visible to another specific action across threads',
          'A rule prioritizing CPU thread scheduling based on priority integers',
          'A network protocol ensuring packets arrive before response timeouts',
          'A database transaction isolation level'
        ],
        correctIndex: 0,
        explanation: 'Happens-before order defines visibility and ordering consistency guarantees across concurrent threads.',
        topic: 'Concurrency & JMM'
      },
      {
        id: 3,
        question: 'What is the key mechanism behind Virtual Threads (Project Loom in Java 21)?',
        options: [
          'Lightweight user-mode threads managed by the JVM that are mounted onto a small pool of carrier OS platform threads during execution',
          'Threads that run exclusively on GPU cores',
          'Emulated virtual machines running inside Docker containers',
          'Single-threaded event loop architecture like Node.js'
        ],
        correctIndex: 0,
        explanation: 'Virtual threads are lightweight JVM-managed tasks that unmount from carrier threads during blocking I/O.',
        topic: 'Java 21 / Modern Concurrency'
      },
      {
        id: 4,
        question: 'What is the purpose of the Unsafe class (sun.misc.Unsafe) in internal JVM libraries?',
        options: [
          'Provides low-level capabilities like raw memory allocation, direct field offset writes, and hardware CAS instructions bypassing safety checks',
          'Detects viruses in downloaded JAR files',
          'Disables firewall rules for Java sockets',
          'Emulates insecure legacy Java applets'
        ],
        correctIndex: 0,
        explanation: 'Unsafe provides direct memory manipulation and hardware-level atomic CAS primitives.',
        topic: 'JVM Internals'
      },
      {
        id: 5,
        question: 'How do Dynamic Proxies (java.lang.reflect.Proxy) work in Java?',
        options: [
          'They generate and load a synthetic bytecode class implementing specified interfaces at runtime, delegating calls to an InvocationHandler',
          'They route network traffic through an HTTP proxy server',
          'They compile Java code into C++ dynamic link libraries (.so/.dll)',
          'They replace standard class constructors with factory singletons'
        ],
        correctIndex: 0,
        explanation: 'Proxy.newProxyInstance() dynamically synthesizes bytecode implementing interface contracts and routes calls to invoke().',
        topic: 'Reflection & Bytecode'
      },
      {
        id: 6,
        question: 'What is the difference between ClassLoader hierarchy Delegation (Parent-First) and OSGi / Webapp Classloading?',
        options: [
          'Standard Java ClassLoaders delegate to parent before checking child (Parent-First); OSGi uses modular peer-based class loading',
          'Standard ClassLoaders load classes in reverse alphabetical order',
          'OSGi deletes unused classes from heap immediately',
          'Parent-First classloaders always download bytecode from the internet'
        ],
        correctIndex: 0,
        explanation: 'Standard ClassLoader hierarchy delegates requests upward to the Bootstrap and Extension loaders before searching locally.',
        topic: 'Classloading'
      },
      {
        id: 7,
        question: 'What is JIT (Just-In-Time) compilation and how does the HotSpot tiered compiler (C1 vs C2) operate?',
        options: [
          'Interprets bytecode initially, compiles hot methods with C1 (fast compilation with basic profiling), then recompiles critical loops with C2 (aggressive optimization)',
          'Translates Java source directly to assembly before running',
          'Interprets bytecode line-by-line without ever generating native machine code',
          'Compiles only constructors into machine code'
        ],
        correctIndex: 0,
        explanation: 'HotSpot uses tiered compilation: Tier 1-3 (C1 compiler for fast startup) and Tier 4 (C2 compiler with inlining, escape analysis, and loop unrolling).',
        topic: 'JIT & Performance'
      },
      {
        id: 8,
        question: 'What does Escape Analysis optimize during HotSpot JIT compilation?',
        options: [
          'Identifies objects that do not escape the local method scope, enabling scalar replacement (allocating on stack/registers) and lock elision',
          'Prevents SQL injection escape sequences',
          'Stops infinite loops from running away with CPU',
          'Translates regex escape characters'
        ],
        correctIndex: 0,
        explanation: 'Escape analysis proves whether an object reference escapes its allocation scope; non-escaping objects can be stack-allocated.',
        topic: 'Compiler Optimizations'
      },
      {
        id: 9,
        question: 'Which method on VarHandle provides atomic Compare-And-Set semantics with acquire/release memory fences?',
        options: [
          'compareAndSet() / compareAndExchangeAcquire()',
          'atomicSwap()',
          'synchronizedUpdate()',
          'forceMemoryWrite()'
        ],
        correctIndex: 0,
        explanation: 'VarHandle (introduced in Java 9) replaces Unsafe field access with explicit memory order modes (Plain, Opaque, Acquire/Release, Volatile).',
        topic: 'VarHandles'
      },
      {
        id: 10,
        question: 'What is the ForkJoinPool algorithm based on?',
        options: [
          'Work-stealing where idle worker threads steal tasks from the deques of busy worker threads',
          'Round-robin FIFO queue with a single global mutex',
          'Priority preemptive interrupt scheduling',
          'Thread-per-core blocking synchronization'
        ],
        correctIndex: 0,
        explanation: 'ForkJoinPool uses work-stealing with per-thread double-ended queues (deques) to maximize core throughput.',
        topic: 'Concurrency Architecture'
      }
    ]
  },
  'C++': {
    Beginner: [
      {
        id: 1,
        question: 'Which header file is required in C++ for standard input/output operations like std::cout?',
        options: ['<stdio.h>', '<iostream>', '<conio.h>', '<fstream>'],
        correctIndex: 1,
        explanation: '<iostream> defines the standard C++ input/output stream objects like std::cin and std::cout.',
        topic: 'I/O Streams'
      },
      {
        id: 2,
        question: 'What is the operator used to access members of a structure/class through a pointer in C++?',
        options: ['.', '->', '::', '*'],
        correctIndex: 1,
        explanation: 'The arrow operator (->) dereferences a pointer and accesses the member.',
        topic: 'Pointers'
      },
      {
        id: 3,
        question: 'How do you allocate memory on the heap in standard C++?',
        options: ['malloc() only', 'new operator', 'alloc()', 'create()'],
        correctIndex: 1,
        explanation: 'The "new" operator allocates heap memory and calls the object constructor.',
        topic: 'Memory Allocation'
      },
      {
        id: 4,
        question: 'Which operator is used to free memory allocated with "new[]" for an array?',
        options: ['free()', 'delete', 'delete[]', 'clear()'],
        correctIndex: 2,
        explanation: 'Array allocations created with new[] must be deallocated using delete[] to invoke destructors properly.',
        topic: 'Memory Deallocation'
      },
      {
        id: 5,
        question: 'What is the size of a standard "char" data type in C++ (by C++ standard guarantee)?',
        options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
        correctIndex: 0,
        explanation: 'sizeof(char) is defined to be exactly 1 byte by the C++ ISO standard.',
        topic: 'Data Types'
      },
      {
        id: 6,
        question: 'What is a reference variable in C++ and how is it declared?',
        options: [
          'An alias to an existing object declared with & (e.g. int& ref = x;)',
          'A pointer storing hexadecimal memory addresses with *',
          'A global variable stored in registers',
          'A copy of an object on the heap'
        ],
        correctIndex: 0,
        explanation: 'A reference is an alternative name (alias) for an already existing variable.',
        topic: 'References'
      },
      {
        id: 7,
        question: 'What is the default access specifier for members in a C++ "class" vs a "struct"?',
        options: [
          'Class: private; Struct: public',
          'Class: public; Struct: private',
          'Both are private by default',
          'Both are public by default'
        ],
        correctIndex: 0,
        explanation: 'In C++, class members default to private; struct members default to public.',
        topic: 'OOP Basics'
      },
      {
        id: 8,
        question: 'What does the "std::vector" container in the Standard Template Library (STL) represent?',
        options: [
          'A dynamically resizing contiguous array',
          'A doubly linked list',
          'A mathematical matrix only',
          'A fixed-size stack container'
        ],
        correctIndex: 0,
        explanation: 'std::vector is a contiguous sequential container that expands capacity automatically.',
        topic: 'STL Containers'
      },
      {
        id: 9,
        question: 'Which keyword is used to declare a constant variable that cannot be modified in C++?',
        options: ['final', 'const', 'immutable', 'readonly'],
        correctIndex: 1,
        explanation: 'const qualifies a variable as read-only.',
        topic: 'Keywords'
      },
      {
        id: 10,
        question: 'What is function overloading in C++?',
        options: [
          'Defining multiple functions with the exact same name but different parameter signatures',
          'Calling a function inside a recursive loop',
          'Passing too many arguments to cause a stack overflow',
          'Overriding a virtual method in a child class'
        ],
        correctIndex: 0,
        explanation: 'Function overloading allows multiple functions with the same name if parameter types/counts differ.',
        topic: 'Functions'
      }
    ],
    Intermediate: [
      {
        id: 1,
        question: 'What is RAII (Resource Acquisition Is Initialization) in C++ design philosophy?',
        options: [
          'Binding the lifecycle of resources (heap memory, file handles, mutex locks) to object scope via constructors and destructors',
          'A compiler flag for rapid assembly generation',
          'An algorithm for randomized array indexing',
          'A software license for open-source C++ libraries'
        ],
        correctIndex: 0,
        explanation: 'RAII guarantees deterministic resource cleanup when an object goes out of scope and its destructor is called.',
        topic: 'RAII & Resource Management'
      },
      {
        id: 2,
        question: 'What is the difference between std::unique_ptr and std::shared_ptr?',
        options: [
          'std::unique_ptr has exclusive ownership and zero overhead; std::shared_ptr uses reference counting for shared ownership',
          'std::unique_ptr can be copied anywhere; std::shared_ptr cannot be moved',
          'std::shared_ptr stores objects on stack only',
          'std::unique_ptr leaks memory automatically'
        ],
        correctIndex: 0,
        explanation: 'std::unique_ptr is move-only (sole owner); std::shared_ptr tracks refcount in a control block.',
        topic: 'Smart Pointers'
      },
      {
        id: 3,
        question: 'Why must a base class have a "virtual" destructor if child classes are deleted via base pointers?',
        options: [
          'To ensure the derived class destructor is called properly, preventing resource leaks and undefined behavior',
          'To speed up compilation time',
          'To make the class abstract',
          'It is purely optional and has no effect'
        ],
        correctIndex: 0,
        explanation: 'Deleting a derived object through a base pointer with a non-virtual destructor invokes undefined behavior.',
        topic: 'Polymorphism'
      },
      {
        id: 4,
        question: 'What is move semantics and rvalue reference (&&) introduced in C++11?',
        options: [
          'Allows transferring ownership of heap resources from temporary rvalues without expensive deep copies',
          'Moves variables from CPU cache to SSD disk',
          'Inverts pointer arithmetic directions',
          'Deletes memory asynchronously'
        ],
        correctIndex: 0,
        explanation: 'Move semantics (std::move, rvalue refs) allow taking ownership of resources from temporaries efficiently.',
        topic: 'Move Semantics'
      },
      {
        id: 5,
        question: 'What is the "Rule of 5" in modern C++ class design?',
        options: [
          'If you define destructor, copy constructor, or copy assignment, you should define/delete all 5 (Destructor, Copy Ctor, Copy Assign, Move Ctor, Move Assign)',
          'A class cannot have more than 5 member variables',
          'Inheritance depth must not exceed 5 levels',
          'All functions must have at most 5 parameters'
        ],
        correctIndex: 0,
        explanation: 'The Rule of 5 dictates managing Destructor, Copy Constructor, Copy Assignment, Move Constructor, and Move Assignment together.',
        topic: 'Class Design'
      },
      {
        id: 6,
        question: 'What is a pure virtual function and what does it make the containing class?',
        options: [
          'A virtual function with "= 0" syntax; makes the class an Abstract Base Class that cannot be instantiated',
          'A function that contains no CPU assembly instructions',
          'A template function with zero arguments',
          'A static utility method'
        ],
        correctIndex: 0,
        explanation: 'virtual void func() = 0 declares a pure virtual function, transforming the class into an abstract class.',
        topic: 'OOP'
      },
      {
        id: 7,
        question: 'What does "constexpr" specify in modern C++ (C++11/14/17/20)?',
        options: [
          'Requests that the value or function can and should be evaluated at compile-time',
          'Forces variable to be stored in ROM',
          'Disables runtime debug assertions',
          'Creates a constant pointer'
        ],
        correctIndex: 0,
        explanation: 'constexpr guarantees evaluation during compilation when given constant expression arguments.',
        topic: 'Compile-Time Computation'
      },
      {
        id: 8,
        question: 'What is the difference between std::map and std::unordered_map in STL?',
        options: [
          'std::map is implemented as a Red-Black Tree (O(log n) ordered); std::unordered_map is a Hash Table (O(1) average unordered)',
          'std::map only stores strings; std::unordered_map stores integers',
          'std::unordered_map is sorted alphabetically',
          'std::map does not allow duplicate keys, but std::unordered_map does'
        ],
        correctIndex: 0,
        explanation: 'std::map is a self-balancing binary search tree; std::unordered_map uses bucket hashing.',
        topic: 'STL Containers'
      },
      {
        id: 9,
        question: 'What does the "static_cast" operator do in C++ compared to C-style casting ((Type)val)?',
        options: [
          'Performs compile-time type-checked explicit conversions between compatible types, preventing dangerous unrelated pointer casts',
          'Removes const qualifiers from references',
          'Performs dynamic runtime RTTI inheritance inspection',
          'Interprets raw memory bit patterns'
        ],
        correctIndex: 0,
        explanation: 'static_cast performs explicit well-defined conversions verified by the compiler, avoiding blind C-cast errors.',
        topic: 'Casting Operators'
      },
      {
        id: 10,
        question: 'What does std::thread do and what MUST be called on a joinable std::thread before destruction?',
        options: [
          'Manages an execution thread; must call .join() or .detach() to prevent std::terminate() from crashing the program',
          'Creates a GPU pipeline; must call .flush()',
          'Spawns an OS subprocess; must call .kill()',
          'Requires no cleanup call'
        ],
        correctIndex: 0,
        explanation: 'A std::thread destructor calls std::terminate() if the thread object is still joinable when destroyed.',
        topic: 'Concurrency'
      }
    ],
    Advanced: [
      {
        id: 1,
        question: 'What is SFINAE (Substitution Failure Is Not An Error) and what replaces it cleanly in C++20?',
        options: [
          'Template deduction rule where invalid substitutions are discarded rather than causing compilation errors; modernized by C++20 Concepts and requires clauses',
          'A runtime exception handler for null pointers',
          'A memory allocator strategy for fixed-size pools',
          'A link-time optimization (LTO) pass'
        ],
        correctIndex: 0,
        explanation: 'SFINAE allows compile-time function overload selection based on type traits; C++20 Concepts replace it with clean syntax.',
        topic: 'Template Metaprogramming'
      },
      {
        id: 2,
        question: 'What is the Virtual Method Table (vtable) and vptr mechanism in C++ dynamic polymorphism?',
        options: [
          'An array of function pointers generated per polymorphic class, with instances holding a hidden vptr pointing to their class vtable',
          'A hash map stored in the heap for method lookup by string name',
          'A bytecode interpreter running inside every C++ binary',
          'A CPU branch predictor cache table'
        ],
        correctIndex: 0,
        explanation: 'Compilers implement dynamic dispatch via vtables containing virtual method addresses and object vptrs.',
        topic: 'Binary Layout & Dispatch'
      },
      {
        id: 3,
        question: 'What does std::memory_order_relaxed vs std::memory_order_seq_cst specify in std::atomic operations?',
        options: [
          'memory_order_relaxed guarantees only atomic operations without memory barrier ordering; memory_order_seq_cst guarantees globally consistent sequential ordering',
          'relaxed operates only on 8-bit integers',
          'seq_cst locks the entire operating system kernel',
          'There is no performance difference on modern x86/ARM CPUs'
        ],
        correctIndex: 0,
        explanation: 'Relaxed atomics do not synchronize surrounding memory access; sequentially consistent atomics enforce total program-wide store/load order.',
        topic: 'Atomics & Memory Models'
      },
      {
        id: 4,
        question: 'What is perfect forwarding and why is std::forward<T> used with universal / forwarding references (T&&)?',
        options: [
          'Preserves the exact value category (lvalue vs rvalue) of arguments passed into template wrapper functions',
          'Forwards network packets without header alteration',
          'Casts private members to public',
          'Converts standard references into raw pointers'
        ],
        correctIndex: 0,
        explanation: 'std::forward preserves original lvalue/rvalue category when forwarding template parameters.',
        topic: 'Templates'
      },
      {
        id: 5,
        question: 'What is Copy Elision and RVO (Return Value Optimization) in C++17?',
        options: [
          'The compiler constructs the returned object directly in the caller destination storage, guaranteed by C++17 standard to omit copy/move constructors',
          'A runtime compression technique for large structs',
          'An optimizer that deletes unused variables',
          'A technique to bypass private member access checks'
        ],
        correctIndex: 0,
        explanation: 'Mandatory copy elision in C++17 eliminates temporary object construction when initializing from prvalues.',
        topic: 'Optimization & Compilers'
      },
      {
        id: 6,
        question: 'What are C++20 Coroutines and how do co_await, co_yield, and co_return differ from standard functions?',
        options: [
          'Stackless functions whose execution can be suspended and resumed via promise_type and coroutine_handle without consuming thread stack',
          'Threads that run on separate OS processes',
          'C++ macros for async/await in JavaScript',
          'GPU shader routines'
        ],
        correctIndex: 0,
        explanation: 'C++20 coroutines are stackless functions that preserve suspension state in a heap-allocated coroutine frame.',
        topic: 'Coroutines'
      },
      {
        id: 7,
        question: 'What is undefined behavior (UB) in C++ and what is an example of strict aliasing violation?',
        options: [
          'Code for which the ISO standard imposes no requirements; accessing an object through a pointer of unrelated type violates strict aliasing',
          'A syntax error that halts the compiler',
          'A runtime exception caught by try/catch',
          'A memory leak that gets cleaned up by OS exit'
        ],
        correctIndex: 0,
        explanation: 'Strict aliasing assumes pointers of different incompatible types do not point to the same memory location.',
        topic: 'UB & Type Punning'
      },
      {
        id: 8,
        question: 'What is CRTP (Curiously Recurring Template Pattern) and what is its primary advantage?',
        options: [
          'A class inherits from a template instantiation of itself (class D : public B<D>), enabling static polymorphism without vtable overhead',
          'A circular include guard in header files',
          'A recursive template that calculates Fibonacci numbers at compile time',
          'A pattern for multi-threaded thread pools'
        ],
        correctIndex: 0,
        explanation: 'CRTP provides static compile-time polymorphism with inlined method dispatch, avoiding virtual function call penalties.',
        topic: 'Design Patterns'
      },
      {
        id: 9,
        question: 'What is the purpose of std::launder in C++17?',
        options: [
          'Obtains a valid pointer to an object created in storage previously occupied by another object when lifetime or const invariants changed',
          'Cleans sensitive cryptographic memory buffers to zeros',
          'Validates string input for SQL safety',
          'Sanitizes user input in WebAssembly'
        ],
        correctIndex: 0,
        explanation: 'std::launder informs the compiler optimizer that a new object exists at an address where an old object was destroyed/re-created.',
        topic: 'Object Lifetimes'
      },
      {
        id: 10,
        question: 'What is the difference between reinterpret_cast and bit_cast (C++20)?',
        options: [
          'std::bit_cast provides a safe, constexpr-friendly value-based bitwise copy between trivially copyable types of equal size; reinterpret_cast is pointer/reference based and often risks UB',
          'bit_cast is for integer math only',
          'reinterpret_cast is evaluated at compile-time only',
          'There is no difference in binary output'
        ],
        correctIndex: 0,
        explanation: 'std::bit_cast copies object representation safely without violating strict aliasing rules.',
        topic: 'Type Systems'
      }
    ]
  },
  SQL: {
    Beginner: [
      {
        id: 1,
        question: 'Which SQL keyword is used to retrieve distinct records from a table without duplicates?',
        options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'GROUP'],
        correctIndex: 1,
        explanation: 'SELECT DISTINCT filters out duplicate tuples from the result set.',
        topic: 'Queries'
      },
      {
        id: 2,
        question: 'Which clause is used to filter records returned by a SELECT query?',
        options: ['WHERE', 'ORDER BY', 'GROUP BY', 'LIMIT'],
        correctIndex: 0,
        explanation: 'The WHERE clause specifies boolean search conditions to filter rows.',
        topic: 'Filtering'
      },
      {
        id: 3,
        question: 'Which SQL statement is used to add new rows of data into a database table?',
        options: ['ADD ROW', 'INSERT INTO', 'UPDATE', 'CREATE ROW'],
        correctIndex: 1,
        explanation: 'INSERT INTO table_name (cols) VALUES (...) inserts new records.',
        topic: 'DML'
      },
      {
        id: 4,
        question: 'Which clause is used to sort the result set in ascending or descending order?',
        options: ['SORT BY', 'ORDER BY', 'GROUP BY', 'ARRANGE'],
        correctIndex: 1,
        explanation: 'ORDER BY column_name ASC|DESC orders query results.',
        topic: 'Sorting'
      },
      {
        id: 5,
        question: 'What is the SQL aggregate function used to calculate the total sum of numeric values in a column?',
        options: ['COUNT()', 'TOTAL()', 'SUM()', 'AVG()'],
        correctIndex: 2,
        explanation: 'SUM(column_name) returns the arithmetic sum of numeric values.',
        topic: 'Aggregations'
      },
      {
        id: 6,
        question: 'Which operator is used to search for a specified pattern in a column with wildcards like "%" or "_"?',
        options: ['MATCH', 'CONTAINS', 'LIKE', 'IN'],
        correctIndex: 2,
        explanation: 'The LIKE operator matches string patterns using % (any characters) and _ (single character).',
        topic: 'Pattern Matching'
      },
      {
        id: 7,
        question: 'What is a PRIMARY KEY in relational database design?',
        options: [
          'A column or set of columns that uniquely identifies each row in a table and cannot contain NULL values',
          'The first column listed in the table schema',
          'A key used to encrypt passwords',
          'An index on foreign table relations'
        ],
        correctIndex: 0,
        explanation: 'A PRIMARY KEY enforces entity integrity: uniqueness and NOT NULL constraints.',
        topic: 'Schema & Keys'
      },
      {
        id: 8,
        question: 'Which JOIN returns all records when there is a match in either the left or right table?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
        correctIndex: 3,
        explanation: 'FULL OUTER JOIN returns matching records from both tables plus non-matching rows filled with NULLs.',
        topic: 'Joins'
      },
      {
        id: 9,
        question: 'Which statement is used to delete existing records from a table without dropping the table structure?',
        options: ['REMOVE FROM', 'DELETE FROM', 'DROP TABLE', 'TRUNCATE SCHEMA'],
        correctIndex: 1,
        explanation: 'DELETE FROM table_name WHERE condition removes matching rows.',
        topic: 'DML'
      },
      {
        id: 10,
        question: 'What is the purpose of the COUNT(*) function in SQL?',
        options: [
          'Returns the total number of rows in the table or group including NULL values',
          'Returns the number of columns in the table',
          'Sums the values of all numeric columns',
          'Counts only unique primary keys'
        ],
        correctIndex: 0,
        explanation: 'COUNT(*) calculates the total row count matching query criteria.',
        topic: 'Aggregations'
      }
    ],
    Intermediate: [
      {
        id: 1,
        question: 'What is the critical difference between WHERE and HAVING clauses in SQL?',
        options: [
          'WHERE filters individual rows BEFORE aggregation; HAVING filters aggregated groups AFTER the GROUP BY operation',
          'WHERE is only for numbers; HAVING is for strings',
          'HAVING can only be used with subqueries',
          'There is no difference in PostgreSQL'
        ],
        correctIndex: 0,
        explanation: 'WHERE filters rows prior to grouping; HAVING evaluates aggregate expressions (e.g. COUNT(*) > 5) after GROUP BY.',
        topic: 'Grouping & Filtering'
      },
      {
        id: 2,
        question: 'What is the difference between RANK() and DENSE_RANK() window functions?',
        options: [
          'RANK() skips rank numbers after ties (e.g. 1, 2, 2, 4); DENSE_RANK() does not skip numbers (e.g. 1, 2, 2, 3)',
          'DENSE_RANK() sorts descending only',
          'RANK() returns floating point values',
          'DENSE_RANK() requires an INNER JOIN'
        ],
        correctIndex: 0,
        explanation: 'RANK() introduces gaps in sequence for tied values; DENSE_RANK() maintains contiguous integers without gaps.',
        topic: 'Window Functions'
      },
      {
        id: 3,
        question: 'What is a Common Table Expression (CTE) defined with the "WITH" keyword?',
        options: [
          'A temporary named result set defined within the execution scope of a single SELECT, INSERT, UPDATE, or DELETE query',
          'A permanently stored view on disk',
          'A database transaction lock',
          'A table replication trigger'
        ],
        correctIndex: 0,
        explanation: 'CTEs (WITH clause) provide modular, readable query decomposition and support recursive queries.',
        topic: 'CTEs'
      },
      {
        id: 4,
        question: 'What is a FOREIGN KEY constraint and what does ON DELETE CASCADE specify?',
        options: [
          'Enforces referential integrity; ON DELETE CASCADE automatically deletes child rows when the referenced parent row is deleted',
          'Prevents any deletions in both tables forever',
          'Creates a duplicate backup table',
          'Converts foreign columns into primary keys'
        ],
        correctIndex: 0,
        explanation: 'ON DELETE CASCADE propagates parent deletions to matching child table foreign keys automatically.',
        topic: 'Referential Integrity'
      },
      {
        id: 5,
        question: 'What is the purpose of database indexing (e.g. B-Tree index)?',
        options: [
          'To drastically accelerate data retrieval speed for filtered queries at the cost of slight write overhead and disk space',
          'To compress tables in memory',
          'To enforce primary key encryption',
          'To execute queries in parallel threads'
        ],
        correctIndex: 0,
        explanation: 'Indexes create efficient lookup trees (B-Trees) to avoid costly full-table sequential scans.',
        topic: 'Indexing'
      },
      {
        id: 6,
        question: 'What are the four ACID properties in database transaction management?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Completeness, Integrity, Distribution',
          'Availability, Consistency, Ingestion, Durability',
          'Authorization, Concurrency, Indexing, Decoupling'
        ],
        correctIndex: 0,
        explanation: 'ACID guarantees database reliability: all-or-nothing transactions, invariant preservation, isolation, and persistent commits.',
        topic: 'Transactions'
      },
      {
        id: 7,
        question: 'What is the difference between UNION and UNION ALL?',
        options: [
          'UNION removes duplicate records (requiring a distinct sort step); UNION ALL includes all duplicate records directly (faster)',
          'UNION ALL only works on numerical data',
          'UNION can only combine tables with different columns',
          'UNION is used for joins; UNION ALL is for subqueries'
        ],
        correctIndex: 0,
        explanation: 'UNION ALL concatenates datasets without overhead of duplicate detection; UNION performs deduplication.',
        topic: 'Set Operations'
      },
      {
        id: 8,
        question: 'What is a Correlated Subquery in SQL?',
        options: [
          'A subquery that references columns from the outer query, executing once for each candidate row evaluated by the outer query',
          'A subquery that runs once before the main query starts',
          'A query that connects two different database clusters',
          'An encrypted SQL view'
        ],
        correctIndex: 0,
        explanation: 'Correlated subqueries depend on outer query column values and evaluate row-by-row.',
        topic: 'Subqueries'
      },
      {
        id: 9,
        question: 'Which window function calculates the previous row value within an ordered partition?',
        options: ['LEAD()', 'LAG()', 'PREV()', 'PRIOR()'],
        correctIndex: 1,
        explanation: 'LAG(column, offset) accesses data from a preceding row in the same result set partition.',
        topic: 'Window Functions'
      },
      {
        id: 10,
        question: 'What does COALESCE(val1, val2, val3) return in standard SQL?',
        options: [
          'The first non-null expression in its argument list',
          'The average of the three values',
          'A concatenated string of all values',
          'True if any argument is null'
        ],
        correctIndex: 0,
        explanation: 'COALESCE returns the first non-null argument encountered from left to right.',
        topic: 'Null Handling'
      }
    ],
    Advanced: [
      {
        id: 1,
        question: 'What are the four standard ANSI SQL transaction isolation levels in order of increasing isolation?',
        options: [
          'Read Uncommitted, Read Committed, Repeatable Read, Serializable',
          'Serializable, Repeatable Read, Read Committed, Read Uncommitted',
          'Snapshot, Optimistic, Pessimistic, Strict',
          'Uncommitted, Atomic, Consistent, Isolated'
        ],
        correctIndex: 0,
        explanation: 'Standard isolation levels progress from Read Uncommitted (allows dirty reads) to Serializable (prevents phantom reads).',
        topic: 'Isolation Levels'
      },
      {
        id: 2,
        question: 'What is MVCC (Multi-Version Concurrency Control) in PostgreSQL/relational engines?',
        options: [
          'Allows concurrent readers and writers by creating snapshot row versions (xmax/xmin) so reads never block writes and writes never block reads',
          'Locks every table during any SELECT query',
          'A version control tool for SQL migration scripts like Git',
          'A multi-region replication protocol'
        ],
        correctIndex: 0,
        explanation: 'MVCC provides point-in-time consistent snapshots via tuple transaction visibility metadata.',
        topic: 'Engine Internals'
      },
      {
        id: 3,
        question: 'What is the purpose of EXPLAIN ANALYZE in query optimization?',
        options: [
          'Executes the query plan, measures real execution times per node (Seq Scan, Index Scan, Nested Loop, Hash Join), and compares estimated vs actual row counts',
          'Rewrites the query in Python syntax',
          'Checks SQL syntax without running the database engine',
          'Cleans disk fragmentation'
        ],
        correctIndex: 0,
        explanation: 'EXPLAIN ANALYZE executes the statement and displays exact execution times and actual row counts alongside the planner estimates.',
        topic: 'Query Optimization'
      },
      {
        id: 4,
        question: 'What is a Recursive CTE (WITH RECURSIVE) and what are its two required parts?',
        options: [
          'An Anchor member (base query) and a Recursive member combined with UNION ALL that references the CTE name until an empty set is reached',
          'A loop defined in PL/pgSQL using WHILE',
          'A foreign key referencing the same table without a query',
          'A trigger that executes before INSERT'
        ],
        correctIndex: 0,
        explanation: 'Recursive CTEs consist of an initial anchor query UNION ALL recursive step querying the CTE until termination.',
        topic: 'Recursive Queries'
      },
      {
        id: 5,
        question: 'What is the difference between a Clustered Index and a Non-Clustered Index?',
        options: [
          'A Clustered Index physically dictates the on-disk ordering of table rows (one per table); a Non-Clustered Index maintains a separate structure with pointers to data rows',
          'Clustered indexes are stored in RAM; non-clustered are on disk',
          'Non-clustered indexes cannot contain multiple columns',
          'Clustered indexes only work on foreign keys'
        ],
        correctIndex: 0,
        explanation: 'Clustered indexes sort physical table storage; non-clustered indexes create separate leaf node pointers to heap/clustered rows.',
        topic: 'Storage Architecture'
      },
      {
        id: 6,
        question: 'What is a Partial Index (Filtered Index) in SQL databases?',
        options: [
          'An index built over a subset of rows defined by a WHERE predicate (e.g. CREATE INDEX idx ON orders (created_at) WHERE status = \'pending\')',
          'An index that indexes only the first 5 characters of a string',
          'An index that is loaded half in RAM and half on disk',
          'An uncommitted index under creation'
        ],
        correctIndex: 0,
        explanation: 'Partial indexes reduce index size and maintenance cost by indexing only rows satisfying a specific condition.',
        topic: 'Advanced Indexing'
      },
      {
        id: 7,
        question: 'What is the Write-Ahead Log (WAL) in database storage engines?',
        options: [
          'An append-only log where transaction changes are recorded to disk before they are flushed to main data pages, guaranteeing Durability on crash recovery',
          'A file logging user login attempts',
          'A temporary table used for analytical window functions',
          'A replication queue for Redis caches'
        ],
        correctIndex: 0,
        explanation: 'WAL ensures durability and crash-recovery consistency by recording changes to non-volatile storage prior to table page modifications.',
        topic: 'Storage Engines'
      },
      {
        id: 8,
        question: 'What does the window frame specification "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW" compute?',
        options: [
          'A running cumulative calculation (e.g. cumulative running sum) from the start of the partition up to the current row',
          'The average of only the current row',
          'A rolling 3-row moving average',
          'The total sum of the entire table repeated on every row'
        ],
        correctIndex: 0,
        explanation: 'This frame clause defines a cumulative window expanding from partition start to current row.',
        topic: 'Window Frame Clauses'
      },
      {
        id: 9,
        question: 'What is Table Partitioning (Declarative Range/List/Hash) and how does Partition Pruning enhance performance?',
        options: [
          'Splitting a large logical table into smaller physical tables; the query planner skips scanning partitions whose constraints cannot match query predicates',
          'Deleting old rows automatically after 30 days',
          'Replicating tables across multiple master nodes',
          'Encrypting individual columns separately'
        ],
        correctIndex: 0,
        explanation: 'Partition pruning enables the query planner to bypass entire partition tables that do not match the WHERE clause filters.',
        topic: 'Partitioning'
      },
      {
        id: 10,
        question: 'What is the difference between VACUUM and VACUUM FULL in PostgreSQL?',
        options: [
          'VACUUM reclaims dead tuple space for future inserts without exclusive table lock; VACUUM FULL rewrites the entire table to disk, recovering disk space but locking the table',
          'VACUUM deletes the database; VACUUM FULL deletes the cluster',
          'VACUUM drops unused indexes only',
          'There is no difference in PostgreSQL 16'
        ],
        correctIndex: 0,
        explanation: 'Standard VACUUM frees dead space for re-use without locking; VACUUM FULL acquires an exclusive lock and shrinks physical OS file size.',
        topic: 'Database Administration'
      }
    ]
  },
  JavaScript: {
    Beginner: [
      {
        id: 1,
        question: 'Which keyword declares a block-scoped variable that can be reassigned in modern JavaScript (ES6+)?',
        options: ['var', 'let', 'const', 'global'],
        correctIndex: 1,
        explanation: '"let" declares block-scoped variables that can be mutated.',
        topic: 'Variables'
      },
      {
        id: 2,
        question: 'What is the output of typeof null in JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctIndex: 2,
        explanation: 'In JavaScript, typeof null returns "object" due to a historical legacy bug in JS type tagging.',
        topic: 'Data Types'
      },
      {
        id: 3,
        question: 'What is the difference between "==" and "===" operators?',
        options: [
          '"==" performs type coercion before comparison; "===" compares both value and type without coercion (strict equality)',
          '"===" is used for assignment only',
          '"==" is faster in all modern browsers',
          'There is no difference'
        ],
        correctIndex: 0,
        explanation: '"===" is strict equality; "==" coerces types according to ECMAScript abstract equality algorithms.',
        topic: 'Equality'
      },
      {
        id: 4,
        question: 'Which array method creates a new array populated with the results of calling a provided function on every element?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        correctIndex: 1,
        explanation: 'Array.prototype.map() returns a new array transforming each element.',
        topic: 'Array Methods'
      },
      {
        id: 5,
        question: 'What will Boolean("") and Boolean("hello") evaluate to?',
        options: ['false, true', 'true, false', 'true, true', 'false, false'],
        correctIndex: 0,
        explanation: 'Empty string is falsy; non-empty strings are truthy.',
        topic: 'Truthy & Falsy'
      },
      {
        id: 6,
        question: 'Which method converts a JavaScript object or value to a JSON string?',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.encode()', 'Object.toJSON()'],
        correctIndex: 1,
        explanation: 'JSON.stringify() serializes JavaScript values into JSON strings.',
        topic: 'JSON'
      },
      {
        id: 7,
        question: 'What is the value of 2 + "2" in JavaScript?',
        options: ['4', '"22"', 'NaN', 'Error'],
        correctIndex: 1,
        explanation: 'The + operator with a string triggers string concatenation, resulting in "22".',
        topic: 'Type Coercion'
      },
      {
        id: 8,
        question: 'Which built-in object is used to perform mathematical tasks like Math.floor() or Math.random()?',
        options: ['Number', 'Math', 'Calculator', 'Int'],
        correctIndex: 1,
        explanation: 'Math is a built-in object with static properties and methods for mathematical constants and functions.',
        topic: 'Standard Library'
      },
      {
        id: 9,
        question: 'How do you define an arrow function that takes a and b and returns their sum?',
        options: [
          '(a, b) => a + b',
          'function => (a, b) { a + b }',
          'arrow (a, b) => { return a + b }',
          'def (a, b) -> a + b'
        ],
        correctIndex: 0,
        explanation: '(a, b) => a + b is concise ES6 arrow function syntax with implicit return.',
        topic: 'Arrow Functions'
      },
      {
        id: 10,
        question: 'Which method removes the last element from an array and returns that element?',
        options: ['shift()', 'pop()', 'push()', 'splice()'],
        correctIndex: 1,
        explanation: 'pop() removes and returns the last element of an array.',
        topic: 'Array Methods'
      }
    ],
    Intermediate: [
      {
        id: 1,
        question: 'What is a Closure in JavaScript?',
        options: [
          'A function bundled together with references to its lexical environment, allowing it to access outer scope variables even after the outer function has executed',
          'A method to close browser tabs programmatically',
          'A private class constructor',
          'A syntax error caused by unclosed curly braces'
        ],
        correctIndex: 0,
        explanation: 'Closures give a function access to its outer enclosing scope from an inner function.',
        topic: 'Closures'
      },
      {
        id: 2,
        question: 'How does the JavaScript Event Loop handle Promises (Microtasks) vs setTimeout (Macrotasks)?',
        options: [
          'The microtask queue (Promises, queueMicrotask) is completely drained immediately after the current call stack clears and before the next macrotask (setTimeout) runs',
          'setTimeout always executes before Promise.then()',
          'Both queues are merged into a single FIFO queue without priority',
          'Promises execute in background OS threads'
        ],
        correctIndex: 0,
        explanation: 'Microtasks have priority and drain entirely before the event loop processes the next macrotask/task.',
        topic: 'Event Loop & Concurrency'
      },
      {
        id: 3,
        question: 'What is the difference between function declarations and arrow functions regarding the "this" keyword?',
        options: [
          'Arrow functions do not bind their own "this"; they inherit "this" lexically from the enclosing execution context',
          'Arrow functions always bind "this" to window/global',
          'Function declarations cannot be bound using .bind()',
          'There is no difference in strict mode'
        ],
        correctIndex: 0,
        explanation: 'Arrow functions capture the `this` value of the enclosing context lexically.',
        topic: '"this" Binding'
      },
      {
        id: 4,
        question: 'What is the purpose of Promise.allSettled() compared to Promise.all()?',
        options: [
          'Promise.allSettled waits for all promises to either resolve or reject and returns an array of status objects; Promise.all rejects immediately if any single promise fails',
          'Promise.allSettled only works on synchronous functions',
          'Promise.all executes promises sequentially one after another',
          'Promise.allSettled cancels pending network requests'
        ],
        correctIndex: 0,
        explanation: 'Promise.allSettled never short-circuits on rejection and reports all outcomes.',
        topic: 'Asynchronous JS'
      },
      {
        id: 5,
        question: 'What is Prototypal Inheritance in JavaScript?',
        options: [
          'Objects have an internal [[Prototype]] link to another object from which they inherit properties and methods up to Object.prototype',
          'Classes compile directly to C++ structs in V8',
          'Objects copy all methods from their parent into their own memory allocation',
          'A design pattern for cloning HTML DOM nodes'
        ],
        correctIndex: 0,
        explanation: 'JavaScript uses prototype delegation chains where property lookups walk up the prototype chain.',
        topic: 'Prototypes'
      },
      {
        id: 6,
        question: 'What is the difference between Object.freeze() and Object.seal()?',
        options: [
          'freeze prevents adding, deleting, and modifying existing property values; seal prevents adding/deleting properties but allows modifying existing writable properties',
          'seal makes properties immutable; freeze only prevents deletion',
          'freeze works on arrays only; seal works on objects',
          'There is no difference in modern browsers'
        ],
        correctIndex: 0,
        explanation: 'Object.freeze makes an object completely immutable; Object.seal allows value mutations on existing writable keys.',
        topic: 'Object Methods'
      },
      {
        id: 7,
        question: 'What is Debouncing vs Throttling in event handling?',
        options: [
          'Debounce delays execution until a certain time has elapsed since the last call; Throttle limits execution to at most once in every specified time interval',
          'Throttle delays execution until user stops typing; Debounce executes periodically',
          'Both are identical CSS animation properties',
          'Debouncing is for mouse events only; throttling is for scroll only'
        ],
        correctIndex: 0,
        explanation: 'Debouncing bunches rapid events into one invocation after quiet period; throttling ensures periodic execution rate.',
        topic: 'Performance Patterns'
      },
      {
        id: 8,
        question: 'What does the spread operator (...) do when cloning a nested object const clone = { ...original }?',
        options: [
          'Creates a shallow copy where top-level primitives are copied, but nested objects/arrays remain shared references',
          'Creates a deep recursive copy of all levels',
          'Freezes the object permanently',
          'Converts the object into an iterable array'
        ],
        correctIndex: 0,
        explanation: 'Spread operator perform shallow copying; nested object references are shared.',
        topic: 'Spread & Rest'
      },
      {
        id: 9,
        question: 'What is the purpose of the structuredClone() built-in function in modern JavaScript?',
        options: [
          'Creates a deep copy of a JavaScript value handling nested objects, arrays, Maps, Sets, and Date objects without JSON serialization limitations',
          'Clones HTML DOM elements with event listeners',
          'Creates a clone of a WebWorker thread',
          'Validates TypeScript interfaces at runtime'
        ],
        correctIndex: 0,
        explanation: 'structuredClone() performs recursive deep cloning using the HTML structured clone algorithm.',
        topic: 'Modern Standard Library'
      },
      {
        id: 10,
        question: 'What will Array.from({ length: 3 }, (_, i) => i * 2) return?',
        options: ['[0, 2, 4]', '[2, 4, 6]', '[0, 1, 2]', '[]'],
        correctIndex: 0,
        explanation: 'Array.from with map function maps indices 0, 1, 2 to 0, 2, 4.',
        topic: 'Array Methods'
      }
    ],
    Advanced: [
      {
        id: 1,
        question: 'What is the purpose of the Proxy and Reflect APIs in JavaScript (ES6)?',
        options: [
          'Proxy enables intercepting and customizing fundamental language operations (traps like get, set, apply); Reflect provides default forwarding methods with clean boolean returns',
          'Proxy routes network HTTP requests to backend microservices',
          'Reflect is used to inject TypeScript decorators only',
          'Proxy creates deep immutable clones'
        ],
        correctIndex: 0,
        explanation: 'Proxy wraps targets to intercept low-level operations; Reflect provides corresponding default internal method mirrors.',
        topic: 'Metaprogramming'
      },
      {
        id: 2,
        question: 'What is the difference between WeakMap/WeakSet and standard Map/Set?',
        options: [
          'WeakMap keys (and WeakSet items) must be objects/symbols held via weak references, allowing garbage collection when no other references exist, preventing memory leaks',
          'WeakMap is slower and can be iterated with for..of',
          'WeakMap stores data in browser localStorage',
          'WeakMap keys cannot be garbage collected'
        ],
        correctIndex: 0,
        explanation: 'WeakMap/WeakSet hold weak references that do not prevent GC; they are non-enumerable because collection size is non-deterministic.',
        topic: 'Memory & Weak References'
      },
      {
        id: 3,
        question: 'How does the V8 JavaScript engine optimize property access using Hidden Classes (Shapes) and Inline Caching (IC)?',
        options: [
          'V8 creates transition trees of hidden classes for objects sharing structure; IC caches memory field offsets at call sites so property lookups avoid dictionary searches',
          'V8 translates all objects to C++ class definitions in disk files',
          'V8 uses binary search on object keys',
          'V8 forces all objects into contiguous arrays'
        ],
        correctIndex: 0,
        explanation: 'Hidden classes (shapes) give dynamic JS objects predictable C-like offsets; Inline Caches remember these offsets at call sites.',
        topic: 'V8 Internals & Optimization'
      },
      {
        id: 4,
        question: 'What is the purpose of Atomics and SharedArrayBuffer in Web Workers / multi-threaded JavaScript?',
        options: [
          'SharedArrayBuffer allows sharing raw byte memory across workers; Atomics provides lock-free atomic operations (add, load, compareExchange, wait, notify) on shared memory',
          'Atomics encrypts network sockets',
          'SharedArrayBuffer is an alternative to IndexedDB',
          'Atomics eliminates all garbage collection in V8'
        ],
        correctIndex: 0,
        explanation: 'SharedArrayBuffer provides shared memory across threads, managed via Atomics API primitives.',
        topic: 'Multithreading & Memory'
      },
      {
        id: 5,
        question: 'What is the difference between Generator functions (function*) and Async Generators (async function*)?',
        options: [
          'Generators return an Iterator yielding values synchronously; Async Generators implement the AsyncIterable protocol yielding Promises for (await of) consumption',
          'Async generators can only run in Node.js backend',
          'Generators cannot use yield keyword',
          'Async generators cannot yield objects'
        ],
        correctIndex: 0,
        explanation: 'Async generators produce Symbol.asyncIterator, allowing asynchronous streaming data with `for await (const x of stream)`.',
        topic: 'Iterators & Generators'
      },
      {
        id: 6,
        question: 'What is a memory leak caused by Detached DOM nodes in Single Page Applications?',
        options: [
          'DOM elements removed from the visual document tree that cannot be garbage collected because JavaScript variables/closures still retain references to them',
          'HTML tags that have missing closing tags',
          'Images that fail to load over 404 HTTP errors',
          'CSS styles applied to non-existent class names'
        ],
        correctIndex: 0,
        explanation: 'Detached DOM nodes remain in heap memory when retained by JS references despite removal from DOM tree.',
        topic: 'Memory Profiling'
      },
      {
        id: 7,
        question: 'What is the purpose of FinalizationRegistry and WeakRef in modern ECMAScript?',
        options: [
          'WeakRef holds a weak reference to a target object; FinalizationRegistry lets you register a cleanup callback when the target object has been garbage collected',
          'FinalizationRegistry forces immediate garbage collection',
          'WeakRef converts objects into strings',
          'FinalizationRegistry prevents memory allocation'
        ],
        correctIndex: 0,
        explanation: 'FinalizationRegistry requests a callback after an object has been garbage collected by the runtime.',
        topic: 'Garbage Collection Hooks'
      },
      {
        id: 8,
        question: 'What is the Temporal API in modern JavaScript specifications designed to replace?',
        options: [
          'The legacy, bug-prone Date object, by providing timezone-aware, immutable, and ISO-standard date/time data structures',
          'The setTimeout and setInterval functions',
          'CSS transition animation timings',
          'Network HTTP request headers'
        ],
        correctIndex: 0,
        explanation: 'Temporal is the modern replacement for legacy Date, providing immutable objects for dates, times, and durations.',
        topic: 'Modern Standards'
      },
      {
        id: 9,
        question: 'What does Symbol.iterator and Symbol.asyncIterator define on custom objects?',
        options: [
          'They define the standard protocol methods that make custom objects iterable with for..of and for await..of loops',
          'They encrypt object keys for security',
          'They create private object variables',
          'They allow objects to be sorted with JSON.stringify()'
        ],
        correctIndex: 0,
        explanation: 'Well-known symbols like Symbol.iterator define iterable protocols recognized by JavaScript iteration syntax.',
        topic: 'Well-Known Symbols'
      },
      {
        id: 10,
        question: 'What is Tree Shaking in modern JavaScript bundlers (Vite, Rollup, Webpack)?',
        options: [
          'Static dead-code elimination that analyzes ES module import/export dependency graphs to remove unused code exports from the final production bundle',
          'A technique to clean unused CSS classes',
          'An algorithm for balancing binary search trees',
          'Minifying variable names to single letters'
        ],
        correctIndex: 0,
        explanation: 'Tree shaking leverages ES6 static module syntax to identify and drop unreferenced export code.',
        topic: 'Bundling & Build Systems'
      }
    ]
  },
  React: {
    Beginner: [
      {
        id: 1,
        question: 'What is JSX in React?',
        options: [
          'A syntax extension for JavaScript that allows writing HTML-like markup inside JavaScript code',
          'A new CSS preprocessor like SASS',
          'A database query language for React Native',
          'A server-side template engine replacing Node.js'
        ],
        correctIndex: 0,
        explanation: 'JSX is a syntax extension that gets compiled into React.createElement / jsx runtime calls.',
        topic: 'JSX'
      },
      {
        id: 2,
        question: 'Which React hook is used to add local state to a functional component?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctIndex: 1,
        explanation: 'useState declares a state variable and its setter updater function.',
        topic: 'Hooks Basics'
      },
      {
        id: 3,
        question: 'How do you pass data from a parent component to a child component in React?',
        options: ['Using Props', 'Using HTML dataset attributes', 'Using Redux only', 'Using window global variables'],
        correctIndex: 0,
        explanation: 'Props (properties) pass data unidirectionally from parent to child components.',
        topic: 'Props'
      },
      {
        id: 4,
        question: 'Why is the "key" prop required when rendering lists of elements in React?',
        options: [
          'Helps React identify which items have changed, been added, or been removed during Virtual DOM reconciliation',
          'Applies unique CSS styles to each list item',
          'Encrypts list data for security',
          'Assigns database primary keys automatically'
        ],
        correctIndex: 0,
        explanation: 'Keys give elements a stable identity across renders, allowing React to optimize DOM reconciliation.',
        topic: 'Lists & Keys'
      },
      {
        id: 5,
        question: 'Which hook is used to perform side effects (like data fetching, DOM mutations, or timers) in functional components?',
        options: ['useCallback', 'useEffect', 'useMemo', 'useRef'],
        correctIndex: 1,
        explanation: 'useEffect handles component side effects and cleanup lifecycle phases.',
        topic: 'Effects'
      },
      {
        id: 6,
        question: 'What will happen if you directly mutate state like this: "state.count = 5" without calling the setter?',
        options: [
          'React will not detect the mutation and will not re-render the component UI',
          'The browser will throw a fatal JavaScript syntax error',
          'React will automatically update the component after 1 second',
          'The state will be saved to localStorage'
        ],
        correctIndex: 0,
        explanation: 'Direct mutations do not trigger React state change notification and skip re-renders.',
        topic: 'State Invariance'
      },
      {
        id: 7,
        question: 'How do you conditionally render an element in JSX using short-circuit evaluation?',
        options: ['{isLoggedIn && <UserProfile />}', '{if (isLoggedIn) <UserProfile />}', '{isLoggedIn ?? <UserProfile />}', '{case (isLoggedIn): <UserProfile />}'],
        correctIndex: 0,
        explanation: '{condition && <Component />} is standard JSX inline conditional rendering syntax.',
        topic: 'Conditional Rendering'
      },
      {
        id: 8,
        question: 'What is a controlled input component in React?',
        options: [
          'An input form element whose current value is driven by React state and updated via an onChange handler',
          'An input field with disabled editing',
          'An input validated by browser HTML5 constraints only',
          'An input controlled by Redux store without local state'
        ],
        correctIndex: 0,
        explanation: 'In a controlled component, form data is handled by a React component state rather than the DOM.',
        topic: 'Forms'
      },
      {
        id: 9,
        question: 'What is the purpose of React Fragment (<>...</>)?',
        options: [
          'Allows grouping a list of children without adding an extra wrapper node to the DOM tree',
          'Creates a lazy-loaded sub-route',
          'Renders HTML canvas animations',
          'Splits JavaScript bundle chunks'
        ],
        correctIndex: 0,
        explanation: 'Fragments group multiple JSX children without introducing unnecessary HTML div wrapper tags.',
        topic: 'Fragments'
      },
      {
        id: 10,
        question: 'What does the cleanup function returned inside useEffect do?',
        options: [
          'Executes before the component unmounts and before re-running the effect on dependency change to clean up subscriptions/timers',
          'Clears all component state back to initial values',
          'Deletes the component from the browser cache',
          'Reruns the component render cycle'
        ],
        correctIndex: 0,
        explanation: 'Effect cleanup functions prevent memory leaks by removing event listeners, cancelling requests, or clearing timers.',
        topic: 'Effects & Cleanup'
      }
    ],
    Intermediate: [
      {
        id: 1,
        question: 'What is the difference between useMemo and useCallback hooks?',
        options: [
          'useMemo memoizes the result of a calculation function; useCallback memoizes the callback function instance itself between renders',
          'useMemo is for state; useCallback is for effects',
          'useCallback executes on unmount only',
          'There is no difference in React 19'
        ],
        correctIndex: 0,
        explanation: 'useMemo caches computed values; useCallback caches function definitions to preserve identity across renders.',
        topic: 'Performance Hooks'
      },
      {
        id: 2,
        question: 'What is the useRef hook primarily used for?',
        options: [
          'Persisting a mutable value across renders without triggering a re-render when changed, or referencing a direct DOM element',
          'Fetching REST APIs',
          'Creating global context providers',
          'Triggering animation frames'
        ],
        correctIndex: 0,
        explanation: 'useRef returns a mutable ref object whose .current property persists without triggering component re-renders.',
        topic: 'Refs'
      },
      {
        id: 3,
        question: 'What is the React Context API designed for?',
        options: [
          'Passing data through the component tree without having to pass props down manually at every level ("prop drilling")',
          'Replacing backend database connections',
          'Managing CSS animations',
          'Executing server-side background cron jobs'
        ],
        correctIndex: 0,
        explanation: 'Context provides global/ambient state sharing across subtree components.',
        topic: 'Context'
      },
      {
        id: 4,
        question: 'When should you prefer useReducer over useState in a React component?',
        options: [
          'When you have complex state logic involving multiple sub-values, or when the next state depends closely on previous states in predictable actions',
          'Only when using TypeScript',
          'When state contains only a single boolean',
          'When rendering SVG icons'
        ],
        correctIndex: 0,
        explanation: 'useReducer organizes complex transitions via explicit (state, action) reducer functions.',
        topic: 'State Management'
      },
      {
        id: 5,
        question: 'What is React.memo used for in component optimization?',
        options: [
          'A higher-order component that skips rendering a component if its incoming props have not changed (shallow comparison)',
          'A hook that replaces Redux stores',
          'A method to save component state in memory cache',
          'A tool for profiling server-side HTML'
        ],
        correctIndex: 0,
        explanation: 'React.memo memoizes the rendered output of a functional component, preventing renders if props are unchanged.',
        topic: 'Optimization'
      },
      {
        id: 6,
        question: 'What is the purpose of React Portals (ReactDOM.createPortal)?',
        options: [
          'Renders children into a different DOM node that exists outside the DOM hierarchy of the parent component (e.g. Modals, Tooltips)',
          'Enables WebSocket peer-to-peer data transport',
          'Creates iframe sandboxes',
          'Navigates between different browser URL paths'
        ],
        correctIndex: 0,
        explanation: 'Portals render UI into external DOM containers (like document.body) while preserving React event bubbling.',
        topic: 'Portals'
      },
      {
        id: 7,
        question: 'What is the rule regarding hook invocations in React ("Rules of Hooks")?',
        options: [
          'Hooks must only be called at the top level of React function components or custom hooks, never inside loops, conditions, or nested functions',
          'Hooks can only be called inside class constructors',
          'Hooks must be imported using dynamic import() statements',
          'Hooks cannot accept arguments'
        ],
        correctIndex: 0,
        explanation: 'Calling hooks at the top level guarantees that React preserves the exact same hook call order across renders.',
        topic: 'Rules of Hooks'
      },
      {
        id: 8,
        question: 'What is a Custom Hook in React?',
        options: [
          'A JavaScript function whose name starts with "use" that can call other React hooks to encapsulate and share reusable stateful logic',
          'A modified React DOM renderer',
          'A backend Express route handler',
          'A CSS-in-JS style generator'
        ],
        correctIndex: 0,
        explanation: 'Custom hooks allow extracting and reusing stateful component logic cleanly.',
        topic: 'Custom Hooks'
      },
      {
        id: 9,
        question: 'What is the purpose of Error Boundaries in React?',
        options: [
          'Class components that implement componentDidCatch / getDerivedStateFromError to catch JavaScript errors anywhere in their child component tree and display fallback UI',
          'A try-catch wrapper around every JSX tag',
          'A linting rule in ESLint',
          'A firewall protecting API endpoints'
        ],
        correctIndex: 0,
        explanation: 'Error boundaries catch errors during rendering, lifecycle methods, and constructors in the subtree below them.',
        topic: 'Error Boundaries'
      },
      {
        id: 10,
        question: 'What is the React 18 / 19 Transition API (useTransition / startTransition)?',
        options: [
          'Allows marking state updates as non-urgent transitions, keeping the UI responsive while expensive renders occur concurrently in the background',
          'A CSS keyframe animation generator',
          'A routing transition library replacing React Router',
          'A tool for database migration scripts'
        ],
        correctIndex: 0,
        explanation: 'Transitions differentiate between urgent updates (typing/clicking) and non-blocking background renders.',
        topic: 'Concurrent Features'
      }
    ],
    Advanced: [
      {
        id: 1,
        question: 'How does React Fiber architecture enable Concurrent Mode?',
        options: [
          'Breaks the synchronous recursive rendering tree into an incremental linked-list unit-of-work model that can pause, abort, prioritize, and resume work via time-slicing',
          'Compiles React components into WebAssembly threads',
          'Renders components in separate Node.js server processes',
          'Replaces the browser DOM with WebGL canvas rendering'
        ],
        correctIndex: 0,
        explanation: 'Fiber transforms the render tree into a fiber node work-loop that cooperatively yields control to the browser.',
        topic: 'React Fiber Architecture'
      },
      {
        id: 2,
        question: 'What is the difference between useLayoutEffect and useEffect?',
        options: [
          'useLayoutEffect fires synchronously immediately after all DOM mutations but BEFORE the browser paints on screen; useEffect fires asynchronously after paint',
          'useEffect runs on the server; useLayoutEffect runs on client',
          'useLayoutEffect is for CSS only; useEffect is for data fetching',
          'useLayoutEffect never runs cleanup functions'
        ],
        correctIndex: 0,
        explanation: 'useLayoutEffect executes synchronously before browser paint, avoiding visual flickering during DOM measurements.',
        topic: 'Hook Lifecycles'
      },
      {
        id: 3,
        question: 'What is the React 18 useSyncExternalStore hook designed to prevent?',
        options: [
          'Tearing (inconsistent UI reads where components read different versions of store state during concurrent renders)',
          'Cross-Site Scripting (XSS) attacks',
          'CORS preflight request errors',
          'Infinite loops in custom hooks'
        ],
        correctIndex: 0,
        explanation: 'useSyncExternalStore safely subscribes to external state stores in Concurrent React without state tearing.',
        topic: 'Concurrent Subscriptions'
      },
      {
        id: 4,
        question: 'What is React Server Components (RSC) architecture and how do they differ from Client Components?',
        options: [
          'Server Components execute exclusively on the server, have zero client bundle impact, and stream serialized JSON UI descriptors; Client Components run and hydrate on the browser',
          'Server Components are static HTML pages without interactivity',
          'Client components cannot use hooks',
          'Server Components require PHP backend'
        ],
        correctIndex: 0,
        explanation: 'RSCs run only on the server, never ship their dependencies to the browser bundle, and stream rendered JSX wire format.',
        topic: 'Server Components'
      },
      {
        id: 5,
        question: 'What is the purpose of useDeferredValue in React 18 / 19?',
        options: [
          'Accepts a value and defers updating the value in child components until more urgent UI renders complete, showing stale value while new render is in flight',
          'Delays an API call with setTimeout',
          'Stores values in IndexedDB storage',
          'Creates a debounced input field automatically'
        ],
        correctIndex: 0,
        explanation: 'useDeferredValue lets you defer updating part of the UI to prioritize urgent interactions.',
        topic: 'Concurrent Hooks'
      },
      {
        id: 6,
        question: 'How does React Compiler (React Forget) optimize memoization automatically?',
        options: [
          'Performs static analysis at build time to automatically insert fine-grained memoization for values and JSX without manual useMemo/useCallback',
          'Compresses images in the public folder',
          'Deletes unused CSS classes',
          'Replaces React with vanilla JavaScript at runtime'
        ],
        correctIndex: 0,
        explanation: 'The React Compiler analyzes JavaScript semantics to memoize reactive values automatically.',
        topic: 'React Compiler'
      },
      {
        id: 7,
        question: 'What is the difference between Hydration and Rendering in Server-Side Rendered (SSR) React applications?',
        options: [
          'SSR renders initial HTML on the server; Hydration is the client-side process of attaching event listeners and initializing React state onto the existing HTML DOM',
          'Hydration deletes the server HTML and replaces it completely',
          'Rendering is client-only; Hydration is server-only',
          'Hydration converts React to WebAssembly'
        ],
        correctIndex: 0,
        explanation: 'Hydration attaches React runtime event listeners to static server-generated DOM nodes.',
        topic: 'SSR & Hydration'
      },
      {
        id: 8,
        question: 'What is Suspense for Data Fetching in modern React architecture?',
        options: [
          'Allows components to "suspend" rendering by throwing a promise while waiting for asynchronous resources, showing a declarative fallback UI until resolved',
          'Stops browser rendering when network is offline',
          'A CSS loading spinner library',
          'A hook for pausing video elements'
        ],
        correctIndex: 0,
        explanation: 'Suspense catches thrown promises from resource loaders and renders the fallback boundary until completion.',
        topic: 'Suspense & Streaming'
      },
      {
        id: 9,
        question: 'What is the useActionState / useOptimistic hook pattern introduced in modern React?',
        options: [
          'useActionState handles async form submission state; useOptimistic updates the UI immediately with predicted state before server response completes',
          'Enables optimistic Bitcoin blockchain mining',
          'Replaces Redux Saga for WebSocket connections',
          'Disables form validation'
        ],
        correctIndex: 0,
        explanation: 'useOptimistic gives instant optimistic UI updates while asynchronous Server Actions execute.',
        topic: 'Actions & Optimistic UI'
      },
      {
        id: 10,
        question: 'What is the purpose of React.startTransition in conjunction with React 19 Action functions?',
        options: [
          'Wraps async operations so pending transitions automatically manage isPending state, error states, and optimistic rollback without manual booleans',
          'Starts CSS 3D transitions',
          'Transfers user authentication tokens',
          'Creates animation timelines in GreenSock (GSAP)'
        ],
        correctIndex: 0,
        explanation: 'Actions work with Transitions to provide automatic pending states and optimistic UI rollback on failure.',
        topic: 'React 19 Actions'
      }
    ]
  }
};

// -------------------------------------------------------------
// CODING PRACTICE PROBLEMS DATA (Python, Java, C++, SQL)
// -------------------------------------------------------------

export const CODING_PROBLEMS_DATA: CodingProblem[] = [
  // PYTHON
  {
    id: 'py-001',
    title: 'Two Sum Target Index Finder',
    language: 'Python',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    timeLimit: '1.0s',
    memoryLimit: '128 MB',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

Return the indices in increasing order as a list \`[i, j]\`.`,
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Find two indices such that nums[i] + nums[j] == target.
    Time Complexity target: O(n) using a hash map.
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution with sample input
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    print(two_sum(nums, target))
`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6.'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      {
        id: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]'
      },
      {
        id: 2,
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]'
      },
      {
        id: 3,
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]'
      }
    ],
    hints: [
      'Can you solve it in O(n) time using a dictionary / hash map to store previously seen values and their indices?',
      'Check if (target - current_number) already exists in your map.'
    ]
  },
  {
    id: 'py-002',
    title: 'Valid Palindrome & Alphanumeric Filter',
    language: 'Python',
    difficulty: 'Easy',
    category: 'Strings & Two Pointers',
    timeLimit: '1.0s',
    memoryLimit: '128 MB',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    starterCode: `def is_palindrome(s: str) -> bool:
    """
    Check if string reads identical forwards and backwards ignoring non-alphanumeric.
    """
    clean_chars = [c.lower() for c in s if c.isalnum()]
    return clean_chars == clean_chars[::-1]

if __name__ == "__main__":
    test_str = "A man, a plan, a canal: Panama"
    print(is_palindrome(test_str))
`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      }
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    testCases: [
      {
        id: 1,
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: 'True'
      },
      {
        id: 2,
        input: 's = "race a car"',
        expectedOutput: 'False'
      },
      {
        id: 3,
        input: 's = " "',
        expectedOutput: 'True'
      }
    ],
    hints: [
      'Use Python\'s built-in `.isalnum()` method to filter characters.',
      'Two pointers moving inwards from left and right can achieve O(1) extra space.'
    ]
  },
  {
    id: 'py-003',
    title: 'Longest Substring Without Repeating Characters',
    language: 'Python',
    difficulty: 'Medium',
    category: 'Sliding Window',
    timeLimit: '1.0s',
    memoryLimit: '128 MB',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

A substring is a contiguous non-empty sequence of characters within a string.`,
    starterCode: `def length_of_longest_substring(s: str) -> int:
    """
    Sliding window with character index mapping.
    """
    char_map = {}
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len

if __name__ == "__main__":
    s = "abcabcbb"
    print(length_of_longest_substring(s))
`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    testCases: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        expectedOutput: '3'
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        expectedOutput: '1'
      },
      {
        id: 3,
        input: 's = "pwwkew"',
        expectedOutput: '3'
      }
    ],
    hints: [
      'Use a sliding window `[left, right]`.',
      'Store the last seen index of each character to jump the left pointer forward.'
    ]
  },

  // JAVA
  {
    id: 'java-001',
    title: 'Group Anagrams with Frequency Hash',
    language: 'Java',
    difficulty: 'Medium',
    category: 'Hash Map & Sorting',
    timeLimit: '2.0s',
    memoryLimit: '256 MB',
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    starterCode: `import java.util.*;

public class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        if (strs == null || strs.length == 0) return new ArrayList<>();
        
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] ca = s.toCharArray();
            Arrays.sort(ca);
            String key = String.valueOf(ca);
            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        String[] strs = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(strs));
    }
}
`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'Group words that have identical character distributions.'
      }
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    testCases: [
      {
        id: 1,
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]'
      },
      {
        id: 2,
        input: 'strs = [""]',
        expectedOutput: '[[""]]'
      },
      {
        id: 3,
        input: 'strs = ["a"]',
        expectedOutput: '[["a"]]'
      }
    ],
    hints: [
      'Sort each string alphabetically to generate a canonical hash map key.',
      'Or use a 26-element character count array as a serialized string key.'
    ]
  },
  {
    id: 'java-002',
    title: 'Valid Parentheses Bracket Validator',
    language: 'Java',
    difficulty: 'Easy',
    category: 'Stack',
    timeLimit: '1.0s',
    memoryLimit: '128 MB',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    starterCode: `import java.util.Stack;

public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(isValid("()[]{}")); // Output: true
    }
}
`,
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All brackets open and close in matching pairs.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Parenthesis closed with bracket.'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    testCases: [
      {
        id: 1,
        input: 's = "()"',
        expectedOutput: 'true'
      },
      {
        id: 2,
        input: 's = "()[]{}"',
        expectedOutput: 'true'
      },
      {
        id: 3,
        input: 's = "(]"',
        expectedOutput: 'false'
      }
    ],
    hints: [
      'Use a Last-In-First-Out (LIFO) Stack data structure.',
      'When you see an opening bracket, push its expected closing bracket onto the stack.'
    ]
  },

  // C++
  {
    id: 'cpp-001',
    title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
    language: 'C++',
    difficulty: 'Medium',
    category: 'Dynamic Programming / Greedy',
    timeLimit: '1.0s',
    memoryLimit: '128 MB',
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return *its sum*.

A **subarray** is a contiguous part of an array.`,
    starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSoFar = nums[0];
        int currMax = nums[0];
        
        for (size_t i = 1; i < nums.size(); ++i) {
            currMax = max(nums[i], currMax + nums[i]);
            maxSoFar = max(maxSoFar, currMax);
        }
        return maxSoFar;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "Max Subarray Sum: " << sol.maxSubArray(nums) << endl;
    return 0;
}
`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'Single element subarray sum is 1.'
      }
    ],
    constraints: [
      '1 <= nums.size() <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    testCases: [
      {
        id: 1,
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6'
      },
      {
        id: 2,
        input: 'nums = [1]',
        expectedOutput: '1'
      },
      {
        id: 3,
        input: 'nums = [5,4,-1,7,8]',
        expectedOutput: '23'
      }
    ],
    hints: [
      'Kadane\'s algorithm maintains the maximum subarray sum ending at the current index in O(n) time.',
      'At each step, decide whether to add the current element to the existing subarray or start a fresh subarray at nums[i].'
    ]
  },
  {
    id: 'cpp-002',
    title: 'Invert Binary Tree Pointers',
    language: 'C++',
    difficulty: 'Easy',
    category: 'Binary Trees & Recursion',
    timeLimit: '1.0s',
    memoryLimit: '128 MB',
    description: `Given the \`root\` of a binary tree, invert the tree (mirror left and right child pointers), and return its root.`,
    starterCode: `#include <iostream>
#include <algorithm>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        
        TreeNode* temp = root->left;
        root->left = invertTree(root->right);
        root->right = invertTree(temp);
        
        return root;
    }
};

int main() {
    TreeNode* root = new TreeNode(4);
    root->left = new TreeNode(2);
    root->right = new TreeNode(7);
    
    Solution sol;
    TreeNode* inverted = sol.invertTree(root);
    std::cout << "Inverted root left: " << inverted->left->val << std::endl;
    return 0;
}
`,
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
        explanation: 'Every node swaps its left and right subtrees recursively.'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    testCases: [
      {
        id: 1,
        input: 'root = [4,2,7,1,3,6,9]',
        expectedOutput: '[4,7,2,9,6,3,1]'
      },
      {
        id: 2,
        input: 'root = [2,1,3]',
        expectedOutput: '[2,3,1]'
      },
      {
        id: 3,
        input: 'root = []',
        expectedOutput: '[]'
      }
    ],
    hints: [
      'Use standard recursion: swap left and right pointers for the current node, then recurse on both children.',
      'Base case: if root is nullptr, return nullptr.'
    ]
  },

  // SQL
  {
    id: 'sql-001',
    title: 'Department Top 3 Salaries (DENSE_RANK Window)',
    language: 'SQL',
    difficulty: 'Medium',
    category: 'Window Functions & Joins',
    timeLimit: '1.0s',
    memoryLimit: '128 MB',
    description: `A company's executives are interested in seeing who earns the most money in each of the company's departments. A **high earner** in a department is an employee who has a salary in the **top three unique salaries** for that department.

Write an SQL query to find the employees who are high earners in each of the departments.

Return the result table in any order with columns:
- \`Department\` (Department name)
- \`Employee\` (Employee name)
- \`Salary\` (Employee salary)`,
    starterCode: `-- Write your SQL query statement below
WITH RankedSalaries AS (
    SELECT 
        d.name AS Department,
        e.name AS Employee,
        e.salary AS Salary,
        DENSE_RANK() OVER (
            PARTITION BY e.department_id 
            ORDER BY e.salary DESC
        ) AS rnk
    FROM Employee e
    JOIN Department d ON e.department_id = d.id
)
SELECT 
    Department,
    Employee,
    Salary
FROM RankedSalaries
WHERE rnk <= 3
ORDER BY Department, Salary DESC;
`,
    examples: [
      {
        input: 'Employee table (id, name, salary, department_id) and Department table (id, name)',
        output: 'Department | Employee | Salary\nIT | Max | 90000\nIT | Joe | 85000\nIT | Randy | 85000\nIT | Will | 70000\nSales | Henry | 80000\nSales | Sam | 60000',
        explanation: 'DENSE_RANK assigns rank 1 to Max (90k), rank 2 to Joe & Randy (85k), and rank 3 to Will (70k).'
      }
    ],
    constraints: [
      'Employee table contains up to 10^5 rows.',
      'DENSE_RANK prevents salary ties from skipping ranking tiers.'
    ],
    testCases: [
      {
        id: 1,
        input: 'IT & Sales department test data with ties at 85k',
        expectedOutput: '6 rows returned matching top 3 distinct salary thresholds per department'
      },
      {
        id: 2,
        input: 'Department with only 2 employees',
        expectedOutput: 'All 2 employees returned'
      },
      {
        id: 3,
        input: 'Department with uniform salaries',
        expectedOutput: 'All employees sharing rank 1 returned'
      }
    ],
    hints: [
      'Use `DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)` to rank salaries within each department.',
      'Filter where `rnk <= 3` in an outer query or CTE.'
    ]
  },
  {
    id: 'sql-002',
    title: 'Monthly Active User Retention & Rolling Growth',
    language: 'SQL',
    difficulty: 'Hard',
    category: 'Aggregation & Self-Joins',
    timeLimit: '2.0s',
    memoryLimit: '256 MB',
    description: `Given a table \`user_actions\` (user_id, action_date, action_type), calculate the Month-Over-Month (MoM) retention percentage of active users who performed actions in consecutive months.

Output:
- \`month_number\` (1 - 12)
- \`monthly_active_users\` (Count of distinct active users in current month)
- \`retained_users\` (Count of users active in both current month and previous month)
- \`retention_rate_pct\` (Percentage of previous month's users retained)`,
    starterCode: `WITH MonthlyUsers AS (
    SELECT 
        user_id,
        EXTRACT(MONTH FROM action_date) AS action_month
    FROM user_actions
    GROUP BY user_id, EXTRACT(MONTH FROM action_date)
),
MonthlyCounts AS (
    SELECT 
        action_month,
        COUNT(DISTINCT user_id) AS mau
    FROM MonthlyUsers
    GROUP BY action_month
),
RetainedUsers AS (
    SELECT 
        curr.action_month,
        COUNT(DISTINCT curr.user_id) AS retained_count
    FROM MonthlyUsers curr
    JOIN MonthlyUsers prev 
      ON curr.user_id = prev.user_id 
     AND curr.action_month = prev.action_month + 1
    GROUP BY curr.action_month
)
SELECT 
    mc.action_month AS month_number,
    mc.mau AS monthly_active_users,
    COALESCE(ru.retained_count, 0) AS retained_users,
    ROUND(
        COALESCE(ru.retained_count, 0) * 100.0 / 
        NULLIF(LAG(mc.mau) OVER (ORDER BY mc.action_month), 0), 
        2
    ) AS retention_rate_pct
FROM MonthlyCounts mc
LEFT JOIN RetainedUsers ru ON mc.action_month = ru.action_month
ORDER BY mc.action_month;
`,
    examples: [
      {
        input: 'user_actions logs over Jan - Mar 2026',
        output: 'month | mau | retained | retention_rate_pct\n1 | 1200 | 0 | NULL\n2 | 1450 | 960 | 80.00%\n3 | 1600 | 1180 | 81.38%'
      }
    ],
    constraints: [
      'Dates are within single calendar year 2026.',
      'NULLIF prevents division by zero on month 1.'
    ],
    testCases: [
      {
        id: 1,
        input: 'Quarterly active user login event log',
        expectedOutput: 'Retention calculated cleanly with LAG and self-join'
      }
    ],
    hints: [
      'Self-join user activity grouped by `(user_id, month)` on `curr.month = prev.month + 1`.',
      'Use LAG(mau) window function to retrieve the prior month\'s base denominator.'
    ]
  }
];

// -------------------------------------------------------------
// PRE-SEEDED HISTORICAL ASSESSMENTS
// -------------------------------------------------------------

export const SEED_HISTORICAL_ASSESSMENTS: HistoricalAssessmentRecord[] = [
  {
    id: 'hist-001',
    assessmentId: 'asm-react-int',
    skill: 'React',
    difficulty: 'Intermediate',
    title: 'React Intermediate Practical Competency Quiz',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    performanceLevel: 'Advanced Proficient',
    timeSpentSeconds: 495,
    completedAt: '2026-08-25T14:30:00Z',
    recommendations: [
      'Strengthen Concurrent Mode concepts (useSyncExternalStore and Transitions).',
      'Practice building custom hooks with complex useReducer workflows.',
      'Explore React Server Components streaming architectures.'
    ]
  },
  {
    id: 'hist-002',
    assessmentId: 'asm-py-beg',
    skill: 'Python',
    difficulty: 'Beginner',
    title: 'Python Core Foundations & Data Structures',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
    performanceLevel: 'Mastery',
    timeSpentSeconds: 380,
    completedAt: '2026-08-20T11:15:00Z',
    recommendations: [
      'Ready to advance to Python Intermediate assessments.',
      'Practice generator expressions and decorators in Code Lab.',
      'Review memory management and GIL concurrency constraints.'
    ]
  },
  {
    id: 'hist-003',
    assessmentId: 'asm-sql-int',
    skill: 'SQL',
    difficulty: 'Intermediate',
    title: 'Relational Database Design & Window Functions',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    performanceLevel: 'Proficient',
    timeSpentSeconds: 520,
    completedAt: '2026-08-16T16:40:00Z',
    recommendations: [
      'Review Window frame clauses (ROWS BETWEEN UNBOUNDED PRECEDING).',
      'Deepen understanding of ACID transaction isolation levels (Repeatable Read vs Serializable).',
      'Practice CTE recursive queries in the SQL sandbox.'
    ]
  },
  {
    id: 'hist-004',
    assessmentId: 'asm-js-adv',
    skill: 'JavaScript',
    difficulty: 'Advanced',
    title: 'Modern ECMAScript & V8 Internals',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    performanceLevel: 'Proficient',
    timeSpentSeconds: 610,
    completedAt: '2026-08-10T09:20:00Z',
    recommendations: [
      'Explore SharedArrayBuffer and Atomics for lock-free WebWorker architectures.',
      'Practice metaprogramming with Proxy traps and WeakRef cleanup registries.'
    ]
  }
];

export const SEED_SOLVED_PROBLEMS: SolvedProblemRecord[] = [
  {
    id: 'sol-001',
    problemId: 'py-001',
    title: 'Two Sum Target Index Finder',
    language: 'Python',
    difficulty: 'Easy',
    solvedAt: '2026-08-27T10:15:00Z',
    passedTests: 3,
    totalTests: 3
  },
  {
    id: 'sol-002',
    problemId: 'java-002',
    title: 'Valid Parentheses Bracket Validator',
    language: 'Java',
    difficulty: 'Easy',
    solvedAt: '2026-08-26T15:45:00Z',
    passedTests: 3,
    totalTests: 3
  },
  {
    id: 'sol-003',
    problemId: 'cpp-001',
    title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
    language: 'C++',
    difficulty: 'Medium',
    solvedAt: '2026-08-22T12:30:00Z',
    passedTests: 3,
    totalTests: 3
  },
  {
    id: 'sol-004',
    problemId: 'sql-001',
    title: 'Department Top 3 Salaries (DENSE_RANK Window)',
    language: 'SQL',
    difficulty: 'Medium',
    solvedAt: '2026-08-18T17:10:00Z',
    passedTests: 3,
    totalTests: 3
  }
];
