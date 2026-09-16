import type { ChoiceQuestion, TestSet } from '../types';

type FactSeed = readonly [
  concept: string,
  prompt: string,
  answer: string,
  group: string,
  explanation: string,
];

function buildQuestions(topicId: string, prefix: string, facts: readonly FactSeed[]): ChoiceQuestion[] {
  const allAnswers = Array.from(new Set(facts.map((fact) => fact[2])));

  return facts.map(([concept, prompt, answer, group, explanation], index) => {
    const groupAnswers = Array.from(new Set(
      facts.filter((fact) => fact[3] === group).map((fact) => fact[2]),
    ));
    const choices = Array.from(new Set([
      answer,
      ...groupAnswers.filter((item) => item !== answer),
      ...allAnswers.filter((item) => item !== answer),
    ])).slice(0, 4);
    const id = `cit015-${prefix}-${String(index + 1).padStart(2, '0')}`;
    const options = choices.map((label, optionIndex) => ({
      id: `${id}-option-${optionIndex + 1}`,
      label,
    }));

    return {
      id,
      topicId,
      concept,
      prompt,
      explanation,
      kind: 'multiple-choice' as const,
      options,
      correctOptionId: options[0].id,
    };
  });
}

const introductionFacts: FactSeed[] = [
  ['Operating System', 'Which foundational software manages a computer’s hardware and software resources?', 'Operating system', 'foundation', 'An operating system manages hardware and software resources.'],
  ['Operating System Intermediary', 'What acts as the intermediary between physical hardware and users or applications?', 'Operating system', 'foundation', 'The OS stands between the hardware and the end-user or applications.'],
  ['Resource Manager', 'Which OS role allocates CPU time, memory, and storage?', 'Resource manager', 'foundation', 'The resource-manager role allocates CPU, memory, and storage.'],
  ['Hardware Abstraction', 'Which OS role hides complex hardware details from users and developers?', 'Hardware abstraction', 'foundation', 'Hardware abstraction hides the complexity of physical devices.'],
  ['System Without an OS', 'According to the lesson, what is a computer without an operating system?', 'A collection of unusable components', 'foundation', 'Without an OS coordinating them, the components cannot provide a usable computing environment.'],
  ['First Operating System', 'Which system is identified as the first operating system in the lesson?', 'GM-NAA I/O', 'history', 'The timeline identifies GM-NAA I/O as the first operating system.'],
  ['Mainframe Era', 'Which decade does the lesson label as the Mainframe Era?', '1950s', 'history', 'The 1950s are presented as the Mainframe Era.'],
  ['Early Batch Processing', 'How were jobs commonly processed in the Mainframe Era?', 'In batches using punched cards', 'history', 'Early mainframes used batch processing with punched cards and no direct interaction.'],
  ['Time-Sharing Era', 'Which decade saw the rise of time-sharing systems?', '1970s', 'history', 'The timeline places the rise of time-sharing in the 1970s.'],
  ['UNIX', 'Which system is used as the lesson’s example of a multi-user time-sharing OS?', 'UNIX', 'history', 'UNIX is the timeline example of multiple users sharing one central computer.'],
  ['GUI Era', 'Which decade introduced the GUI era through Apple macOS and later Microsoft Windows?', '1980s', 'history', 'The lesson associates the 1980s with mass adoption of graphical user interfaces.'],
  ['Mobile and Open Era', 'What characterizes the 2000s-and-later stage of OS evolution?', 'Open-source Linux growth and mobile OS dominance', 'history', 'The timeline highlights Linux on servers and Android and iOS on mobile devices.'],
  ['Process Management Function', 'Which OS function creates, schedules, and terminates processes?', 'Process management', 'function', 'Process management allocates CPU time and coordinates running applications.'],
  ['Memory Management Function', 'Which OS function tracks RAM allocation and de-allocation?', 'Memory management', 'function', 'Memory management decides which processes receive memory, when, and how much.'],
  ['Device Management Function', 'Which OS function controls printers, disks, keyboards, and other hardware?', 'Device management', 'function', 'Device management coordinates hardware and input/output operations.'],
  ['Device Drivers', 'What specialized software does the OS use to communicate with hardware components?', 'Device drivers', 'function', 'Device drivers provide the software interface to hardware components.'],
  ['File Management Structure', 'What logical structures does file management use to organize data?', 'Files, directories, and storage sectors', 'function', 'The OS organizes data into files, directories, and storage sectors.'],
  ['File Operations', 'Which function handles file creation, deletion, and manipulation?', 'File management', 'function', 'File management handles the life cycle and manipulation of files.'],
  ['Logical-to-Physical Files', 'What maps logical files to locations on HDDs or SSDs?', 'File management', 'function', 'File management maps logical files to their physical storage locations.'],
  ['Security and Protection', 'Which OS feature protects against unauthorized access and malicious software?', 'Security and protection', 'security', 'Security and protection defend the system from unauthorized use and malware.'],
  ['User Authentication', 'Passwords and biometrics are examples of what OS security mechanism?', 'User authentication', 'security', 'The lesson lists passwords and biometrics as authentication methods.'],
  ['File Permissions', 'What prevents users or programs from opening memory or files they are not authorized to access?', 'File permissions', 'security', 'File permissions restrict access to authorized programs and users.'],
  ['Batch Operating System', 'Which OS type executes a series of jobs without manual user intervention?', 'Batch operating system', 'type', 'A batch OS processes a prepared series of jobs automatically.'],
  ['Batch OS Use Case', 'Which example is given for large-scale batch processing?', 'Payroll processing', 'type', 'Payroll processing is the lesson’s example of a batch workload.'],
  ['Distributed Operating System', 'Which OS type makes independent networked computers appear as one unified system?', 'Distributed operating system', 'type', 'A distributed OS presents multiple networked machines as a single powerful system.'],
  ['Real-Time Operating System', 'Which OS type guarantees a response within a strict predefined time?', 'Real-time operating system', 'type', 'An RTOS is designed around strict response-time constraints.'],
  ['RTOS Applications', 'Which set contains only examples of real-time OS applications from the lesson?', 'Robotics, avionics, and medical machinery', 'type', 'The lesson names robotics, avionics, and medical machinery as RTOS uses.'],
  ['Time-Sharing Operating System', 'Which OS type rapidly divides CPU time among multiple simultaneous users?', 'Time-sharing operating system', 'type', 'Time-sharing creates the illusion that each user has dedicated access.'],
  ['Mobile Market Context', 'Which mobile operating system has the largest overall market share in the supplied chart?', 'Android', 'market', 'The supplied chart labels Android as mobile-dominant with the largest overall share.'],
  ['Desktop Market Context', 'Which operating system dominates desktop computing in the lesson’s market note?', 'Windows', 'market', 'The market note identifies Windows as desktop-dominant.'],
  ['Command-Line Interface', 'Which interface requires users to enter text commands with a keyboard?', 'Command-line interface (CLI)', 'interface', 'A CLI is a text-based interface driven by typed commands.'],
  ['CLI Examples', 'Which pair is given as an example of command-line environments?', 'MS-DOS and the Linux Terminal', 'interface', 'The lesson lists MS-DOS and the Linux Terminal as CLI examples.'],
  ['CLI Advantage', 'What advantage of a CLI is emphasized in the lesson?', 'Resource efficiency and powerful automation', 'interface', 'CLIs use few resources and are powerful for scripting and automation.'],
  ['CLI Disadvantage', 'What drawback of a CLI is emphasized in the lesson?', 'A steep learning curve and strict syntax', 'interface', 'CLI users must learn commands and remember exact syntax.'],
  ['Graphical User Interface', 'Which interface uses icons, windows, menus, and other visual indicators?', 'Graphical user interface (GUI)', 'interface', 'A GUI lets users interact through visual elements.'],
  ['GUI Advantage', 'What advantage of a GUI is emphasized in the lesson?', 'It is intuitive and beginner-friendly', 'interface', 'GUIs are presented as visually appealing and easy to learn.'],
  ['GUI Disadvantage', 'What drawback of a GUI is emphasized in the lesson?', 'It requires more memory and processing power', 'interface', 'Graphical environments require more resources than command-line environments.'],
  ['Microsoft Windows', 'Which popular OS is known for broad software compatibility, gaming support, and a user-friendly GUI?', 'Microsoft Windows', 'platform', 'Windows is presented as the standard personal desktop OS.'],
  ['Apple macOS', 'Which proprietary OS is tightly integrated with Apple’s mobile hardware ecosystem?', 'Apple macOS', 'platform', 'macOS is Apple’s proprietary Mac operating system, noted for design and stability.'],
  ['Linux', 'Which open-source OS core dominates servers, supercomputers, and developer markets?', 'Linux', 'platform', 'Linux is customizable and open source; Ubuntu and Red Hat are listed distributions.'],
];

const processFacts: FactSeed[] = [
  ['Process', 'In computer science, what is a process?', 'A program in execution', 'process', 'A process is a program while it is executing.'],
  ['Sequential Execution', 'How must the execution of a process progress?', 'In a sequential fashion', 'process', 'The lesson states that process execution progresses sequentially.'],
  ['Start State', 'Which process state is entered when a process is first created?', 'Start', 'state', 'Start is the initial state of a newly created process.'],
  ['Ready State', 'Which state means a process is waiting to be assigned to a processor?', 'Ready', 'state', 'A ready process is waiting for the OS to allocate a processor.'],
  ['Running State', 'Which state begins after the scheduler assigns a process to a processor?', 'Running', 'state', 'In the running state, the processor executes the process instructions.'],
  ['Wait State', 'Which state is entered when a process must wait for a resource?', 'Wait', 'state', 'A process waits when a required resource is unavailable.'],
  ['Terminated State', 'Which state holds a finished process until it is removed from main memory?', 'Terminated', 'state', 'A terminated process waits to be removed from main memory.'],
  ['Stack', 'Which process-memory part stores parameters, return addresses, and local variables?', 'Stack', 'memory-part', 'The stack contains temporary function or method data.'],
  ['Heap', 'Which process-memory part is allocated dynamically during runtime?', 'Heap', 'memory-part', 'The heap is runtime dynamically allocated memory.'],
  ['Data Section', 'Which process-memory part stores global and static variables?', 'Data section', 'memory-part', 'Global and static variables are stored in the data section.'],
  ['Text Section', 'Which process-memory part contains the current activity represented by the program counter and CPU registers?', 'Text section', 'memory-part', 'The supplied lesson associates the text section with current instructions and processor state.'],
  ['Program Counter in Process Memory', 'What indicates the current activity within the process text section?', 'The value of the program counter', 'memory-part', 'The program counter identifies the instruction position in the process activity.'],
  ['Stack Kitchen Analogy', 'In the kitchen analogy, what represents the process stack?', 'Temporary cue cards for sub-recipes', 'analogy', 'Temporary cue cards mirror stack-based temporary function data.'],
  ['Heap Kitchen Analogy', 'In the kitchen analogy, what represents the heap?', 'Extra prep bowls or trays pulled out as needed', 'analogy', 'Extra containers needed during cooking mirror dynamic allocation.'],
  ['Data Kitchen Analogy', 'In the kitchen analogy, what represents the data section?', 'Pre-portioned staple ingredients', 'analogy', 'Staples ready at startup mirror global and static data.'],
  ['Text Kitchen Analogy', 'In the kitchen analogy, what represents the text section?', 'Printed recipe instructions and the chef’s pointing finger', 'analogy', 'The recipe and current line mirror instructions and the program counter.'],
  ['Process Control Block', 'What OS data structure stores state information and metadata for a specific process?', 'Process Control Block (PCB)', 'pcb-purpose', 'The PCB is the operating system record for a process.'],
  ['PCB Digital ID', 'What metaphor does the lesson use for a Process Control Block?', 'A process’s digital ID card', 'pcb-purpose', 'The PCB is compared to a digital ID card containing process details.'],
  ['PCB Resume Purpose', 'Why does the OS record process information in a PCB?', 'To pause and later resume a process without losing its place', 'pcb-purpose', 'Saved context lets the CPU switch tasks and later continue correctly.'],
  ['Process ID', 'Which PCB field uniquely identifies every process numerically?', 'Process ID (PID)', 'pcb-field', 'The PID is a unique numerical process identifier.'],
  ['PCB Process State', 'Which PCB field tracks whether a process is ready, running, waiting, or terminated?', 'Process state', 'pcb-field', 'The process-state field records the current life-cycle phase.'],
  ['PCB Pointer', 'Which PCB field links to parent processes or other PCBs in queues?', 'Pointer', 'pcb-field', 'Pointers connect related processes and queue records.'],
  ['PCB Priority', 'Which PCB field ranks how urgently a process needs CPU access?', 'Priority', 'pcb-field', 'Priority expresses CPU urgency relative to other processes.'],
  ['PCB Program Counter', 'Which PCB field stores the address of the next machine instruction?', 'Program counter', 'pcb-field', 'The program counter points to the next instruction to execute.'],
  ['CPU Registers', 'Which PCB field preserves accumulators, index registers, and stack pointers while a process is paused?', 'CPU registers', 'pcb-field', 'Register contents are saved so execution can resume correctly.'],
  ['I/O Status Information', 'Which PCB field tracks allocated devices, open files, and pending I/O?', 'I/O status information', 'pcb-field', 'I/O status records the process’s device and file activity.'],
  ['Accounting Information', 'Which PCB field records CPU time, time limits, and execution IDs?', 'Accounting information', 'pcb-field', 'Accounting information records process-usage metrics.'],
  ['Process Privileges', 'Which PCB field records permissions for system resources?', 'Process privileges', 'pcb-field', 'Process privileges allow or deny access to protected resources.'],
  ['CPU Scheduling Information', 'Which PCB field stores priority and parameters used by the CPU scheduler?', 'CPU scheduling information', 'pcb-field', 'Scheduling information provides the values the CPU scheduler needs.'],
  ['Memory Management Information', 'Which PCB field contains page tables, segment tables, and memory limits?', 'Memory management information', 'pcb-field', 'This field stores process memory mappings and limits.'],
  ['Job Queue', 'Which scheduling queue keeps all processes in the system?', 'Job queue', 'queue', 'The job queue contains all processes known to the system.'],
  ['Ready Queue', 'Which queue contains main-memory processes that are ready and waiting to execute?', 'Ready queue', 'queue', 'New processes enter the ready queue and wait for CPU service.'],
  ['I/O Waiting Queue', 'Which queue contains processes blocked because an I/O device is unavailable?', 'I/O waiting queue', 'queue', 'Processes blocked for I/O wait in the I/O waiting queue.'],
  ['Process Scheduler', 'What system software selects submitted jobs and decides which process runs?', 'Process scheduler', 'scheduler', 'Process schedulers select jobs and processes for execution.'],
  ['Long-Term Scheduler', 'Which scheduler is also called the job scheduler and loads selected processes into memory?', 'Long-term scheduler', 'scheduler', 'The long-term scheduler admits queued jobs into memory.'],
  ['Short-Term Scheduler', 'Which scheduler is also called the CPU scheduler and moves a process from ready to running?', 'Short-term scheduler', 'scheduler', 'The short-term scheduler selects a ready process and allocates the CPU.'],
  ['Medium-Term Scheduler', 'Which scheduler handles swapped-out processes?', 'Medium-term scheduler', 'scheduler', 'The medium-term scheduler manages processes that have been swapped out.'],
  ['Context Switch', 'What mechanism stores and restores CPU state in a PCB?', 'Context switch', 'context', 'A context switch saves one process state and restores another.'],
  ['Context Switching Purpose', 'What does context switching allow multiple processes to do?', 'Share a single CPU', 'context', 'Saving and restoring context lets multiple processes take turns on one CPU.'],
  ['Preemptive Scheduling', 'Which scheduling style may interrupt a low-priority running process when a high-priority process becomes ready?', 'Preemptive scheduling', 'scheduling-style', 'Preemptive scheduling can take the CPU from a running process.'],
  ['Non-Preemptive Scheduling', 'Which scheduling style lets a running process continue until its allotted time completes?', 'Non-preemptive scheduling', 'scheduling-style', 'A non-preemptive process is not interrupted during its allotted run.'],
  ['Shortest Remaining Time', 'Which listed algorithm belongs to the preemptive scheduling group?', 'Shortest Remaining Time', 'algorithm', 'Shortest Remaining Time is listed under preemptive algorithms.'],
  ['Round Robin Scheduling', 'Which listed preemptive algorithm rotates CPU access among processes?', 'Round Robin scheduling', 'algorithm', 'Round Robin is listed as a preemptive scheduling algorithm.'],
  ['Multiple-Level Queues', 'Which listed preemptive approach uses multiple scheduling queues?', 'Multiple-level queues scheduling', 'algorithm', 'Multiple-level queues scheduling appears in the preemptive group.'],
  ['First Come First Serve', 'Which listed non-preemptive algorithm serves processes in arrival order?', 'First Come First Serve (FCFS)', 'algorithm', 'FCFS is listed under non-preemptive scheduling.'],
  ['Shortest-Job Next', 'Which listed non-preemptive algorithm selects the shortest next job?', 'Shortest-Job Next', 'algorithm', 'Shortest-Job Next appears in the non-preemptive group.'],
  ['Priority-Based Algorithm', 'Which listed non-preemptive algorithm selects work using assigned priority?', 'Priority-based algorithm', 'algorithm', 'The priority-based algorithm is listed under non-preemptive scheduling.'],
];

const memoryFacts: FactSeed[] = [
  ['Memory Management', 'Which OS functionality manages primary memory and moves processes between memory and disk?', 'Memory management', 'memory', 'Memory management controls primary memory during execution.'],
  ['Memory Location Tracking', 'What does memory management track for every memory location?', 'Whether it is allocated or free', 'memory', 'The OS records which locations are assigned and which remain free.'],
  ['Process Address Space', 'What is the set of logical addresses referenced by a process in its code?', 'Process address space', 'address', 'A process address space contains the logical addresses used by the process.'],
  ['Address Mapping', 'Who maps a program’s logical addresses to physical addresses during memory allocation?', 'The operating system', 'address', 'The OS maps logical program addresses to physical memory addresses.'],
  ['Logical Address Space', 'What is the set of all logical addresses generated by a program?', 'Logical address space', 'address', 'All program-generated logical addresses form the logical address space.'],
  ['Physical Address Space', 'What is the set of physical addresses corresponding to a program’s logical addresses?', 'Physical address space', 'address', 'Mapped physical addresses form the physical address space.'],
  ['Memory Management Unit', 'Which device performs runtime virtual-to-physical address mapping?', 'Memory Management Unit (MMU)', 'address', 'The MMU performs address translation while the program runs.'],
  ['MMU Type', 'How is the Memory Management Unit classified in the lesson?', 'A hardware device', 'address', 'The MMU is hardware rather than an ordinary software routine.'],
  ['Static Linker', 'During static loading, what combines an object program with required object modules?', 'The linker', 'loading', 'The linker combines the object program and needed modules.'],
  ['Absolute Program', 'What does the linker create from the object program and required modules?', 'An absolute program', 'loading', 'The linker produces an absolute program containing logical addresses.'],
  ['Static Loading Time', 'When is the absolute program loaded into memory under static loading?', 'Before execution starts', 'loading', 'Static loading places the program and data in memory to begin execution.'],
  ['Static Linking Result', 'What does static linking produce from all modules needed by a program?', 'A single executable program', 'loading', 'Static linking combines required modules into one executable.'],
  ['Static Runtime Dependency', 'What does combining all modules statically avoid?', 'Runtime dependency on separate modules', 'loading', 'The required code is already included in the executable.'],
  ['Dynamic Module References', 'What does the compiler place in a program for modules included dynamically?', 'References to the modules', 'loading', 'Dynamic modules are referenced during compilation rather than fully included.'],
  ['Dynamic Loading', 'When is the remaining work for dynamically included modules performed?', 'At execution time', 'loading', 'Dynamic loading resolves and loads modules while the program runs.'],
  ['Dynamic Routine Storage', 'How are dynamically loaded library routines stored on disk?', 'In relocatable form', 'loading', 'Dynamic routines remain on disk in relocatable form.'],
  ['Dynamic Routine Loading', 'When are dynamic library routines loaded into memory?', 'Only when the program needs them', 'loading', 'Dynamic loading avoids loading a routine until it is required.'],
  ['Swapping', 'What temporarily moves a process out of main memory?', 'Swapping', 'swapping', 'Swapping temporarily removes a process from main memory.'],
  ['Swap Destination', 'Where is a swapped-out process temporarily placed?', 'Secondary storage or disk', 'swapping', 'The lesson identifies secondary storage as the temporary destination.'],
  ['Swap Benefit', 'What immediate benefit does swapping provide to other processes?', 'It makes main memory available', 'swapping', 'Removing a process frees memory for other processes.'],
  ['Fragmentation', 'What is the problem of free memory being broken into small unusable pieces?', 'Fragmentation', 'fragmentation', 'Fragmentation leaves scattered pieces of free memory.'],
  ['Fragmentation Cause', 'What repeated activity breaks free memory into little pieces?', 'Loading and removing processes', 'fragmentation', 'Allocation and removal gradually split available space.'],
  ['Fragmentation Effect', 'Why can a process fail to receive memory even when small free blocks remain?', 'The separate blocks are too small', 'fragmentation', 'Small scattered blocks may not satisfy a process allocation.'],
  ['Compaction', 'Which named memory-management operation follows fragmentation in the lesson?', 'Compaction', 'fragmentation', 'The lesson introduces compaction immediately after fragmentation.'],
  ['Paging', 'Which storage mechanism retrieves processes from secondary storage into main memory as pages?', 'Paging', 'paging', 'Paging moves process pages from secondary storage to main memory.'],
  ['Pages', 'Into what units does paging divide a process?', 'Pages', 'paging', 'Processes are divided into page-sized units.'],
  ['Frames', 'What are the fixed-size physical blocks of main memory called?', 'Frames', 'paging', 'Main memory is divided into fixed-size frames.'],
  ['Page and Frame Size', 'What size relationship is shown between a page and a frame?', 'Frame size equals page size', 'paging', 'The paging diagram explicitly states that frame size and page size are equal.'],
  ['Page Placement', 'Must the pages of one process occupy adjacent frames in main memory?', 'No, pages may occupy non-adjacent frames', 'paging', 'The supplied diagram places pages of one process in separated frames.'],
  ['Paging Memory Direction', 'Between which two storage levels does paging move process data?', 'Secondary storage and main memory', 'paging', 'Paging retrieves process pages from secondary storage into main memory.'],
  ['Segmentation', 'Which technique divides a job into logical modules of different sizes?', 'Segmentation', 'segmentation', 'Segmentation divides a program according to related logical functions.'],
  ['Segment Size', 'Do all segments in segmentation have the same size?', 'No, segments can have different sizes', 'segmentation', 'Segments are variable-sized logical units.'],
  ['Segment Purpose', 'What kind of code belongs together in one segment?', 'Pieces that perform related functions', 'segmentation', 'Each segment corresponds to a module of related functionality.'],
  ['Segment Address Space', 'What does each segment represent for the program?', 'A different logical address space', 'segmentation', 'Each segment is treated as its own logical address space.'],
  ['Segmentation Map Table', 'Which table records a segment number, size, and memory address?', 'Segment map table', 'segmentation', 'The diagram maps each segment through its number, size, and address.'],
  ['Segment Placement', 'Must a program’s segments be adjacent in main memory?', 'No, segments may be placed in separate memory regions', 'segmentation', 'The segmentation examples show logical segments mapped to separated regions.'],
];

export const introductionQuestions = buildQuestions('os-introduction', 'intro', introductionFacts);
export const processQuestions = buildQuestions('process-management', 'process', processFacts);
export const memoryQuestions = buildQuestions('memory-management', 'memory', memoryFacts);
export const cit015Questions = [...introductionQuestions, ...processQuestions, ...memoryQuestions];

export const cit015TestSets: TestSet[] = [
  {
    id: 'cit015-os-introduction',
    topicId: 'os-introduction',
    title: 'Introduction to Operating Systems',
    description: 'Complete coverage of the introduction, functions, types, interfaces, and examples.',
    instruction: 'Choose the answer supported by the Introduction to Operating Systems lesson.',
    questions: introductionQuestions,
  },
  {
    id: 'cit015-process-management',
    topicId: 'process-management',
    title: 'Process Management',
    description: 'Complete coverage of processes, PCBs, queues, schedulers, and algorithms.',
    instruction: 'Choose the answer supported by the Process Management lesson.',
    questions: processQuestions,
  },
  {
    id: 'cit015-memory-management',
    topicId: 'memory-management',
    title: 'Memory Management',
    description: 'Complete coverage of address spaces, loading, swapping, fragmentation, paging, and segmentation.',
    instruction: 'Choose the answer supported by the Memory Management lesson.',
    questions: memoryQuestions,
  },
  {
    id: 'cit015-comprehensive',
    topicId: 'mixed',
    title: 'Comprehensive Exam',
    description: 'A changing, balanced 20-item exam covering all three topics.',
    instruction: 'Answer 20 randomized questions drawn across all three CIT.015 topics.',
    questions: cit015Questions,
    questionLimit: 20,
    balanceTopics: true,
  },
];

export const cit015TestTopicLabels: Record<string, string> = {
  'os-introduction': 'Introduction to Operating Systems',
  'process-management': 'Process Management',
  'memory-management': 'Memory Management',
  mixed: 'All Three Topics',
};
