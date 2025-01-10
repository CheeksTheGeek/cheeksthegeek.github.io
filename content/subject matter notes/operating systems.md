# OS Concepts
## Outline
1. **Fundamental OS Concepts**
   - Address Space
   - Process
   - Thread
   - Dual-mode Operation
## Address Space
### Definition
- **Address space:** Set of accessible addresses and their states.
### Types
- **Physical addresses:** Addresses available on physical memory.
  - Example: For 4GB of memory, there are approximately 4 billion addresses.
- **Virtual addresses:** Addresses seen by each process.
  - Example: For a 64-bit architecture, there are more than 18 quintillion addresses.
### Virtual Address Space Layout
- **Code:** Stores the program’s executable instructions.
- **Data:** Stores the program’s static data (both initialized and uninitialized).
- **Heap:** Used for dynamically allocated memory during program execution.
- **Stack:** Used for function calls to store parameters, local variables, and return addresses. The stack pointer always points to the “top” of the stack.
### Aside
**Difference between a 32-bit architecture and 64-bit architecture?**
- 32-bit: Limited to 4GB of addressable memory.
- 64-bit: Can address more memory than current hardware can physically support.
## Stack Example
**Code Analysis:**
```c
A0: A(int tmp) {
A1:   if (tmp < 2)
A2:       B();
A3:   printf(tmp);
A4: }
B0: B() {
B1:   C();
B2: }
C0: C() {
C1:   A(2);
C2: }
```
- **tmp = 1; ret = ext**
- Stack pointer points to current top of the stack.
- Function parameters and return addresses are pushed onto the stack.
**Nested Function Calls:**
- Demonstrates nested function calls and recursion.
- Each function call creates a new stack frame.
- Recursion involves multiple stack frames for the same function.
**Handling Recursive Execution:**
- Critical for modern programming languages.
- Temporary results are held on the stack.
## Process
### What is a Process?
- A running instance of a program.
- **Program:** Static, just a bunch of bytes on the disk.
- **Process:** OS’s abstraction for execution.
### Components of a Process:
- **Virtual address space.**
- **CPU states:** Program Counter (PC), Stack Pointer (SP), and other general-purpose registers.
- **OS resources:** Open files, network connections, etc.
### From Program to Process:
1. Load instruction and data segments of the executable file into memory.
2. Set up the initial stack.
3. Other initialization tasks (e.g., I/O).
4. Transfer control to the program.
### Instruction Cycle:
1. Fetch instruction at PC.
2. Decode.
3. Execute (possibly access memory).
4. Write back results to registers/memory.
5. PC ß Next PC.
6. Repeat.
### Process Lifecycle:
- **States:** New, Ready, Running, Blocked, Exit.
- **Transitions:** Admit, Dispatch, Block, Unblock, Suspend, Swap.
### Process Control Block (PCB):
- Data structure created by OS to manage processes.
- Contains everything OS needs to know about the process:
  - Unique process identifier (PID)
  - State
  - Priority
  - Program counter (PC)
  - Register data
  - Memory pointers
  - I/O status information
  - Accounting information
- **Example:** In Linux, defined in `task_struct`.
### State Queues:
- Collection of queues representing the state of all processes.
- PCBs move between queues as they change state.
### Switching Processes:
- **Mechanism:** Low-level methods for functionality (e.g., context switch).
- **Policy:** Algorithms for decision-making (e.g., round-robin scheduling).
- Separation allows for flexibility in changing policies without rethinking mechanisms.
## Thread
### Definition:
- **Thread:** Sequence of executable commands that can run on CPU.
### Thread States:
- Ready, Running, Waiting.
### Multithreaded Programs:
- Programs using more than one thread.
- Initial thread starts with the main method.
- Threads can be created and destroyed dynamically.
### Process vs Thread:
- **Shared among threads:** Address space, global variables.
- **Per-thread states:** Program Counter (PC), registers, stack.
### Benefits of Using Threads:
- **Program Structure:** Express logically concurrent tasks.
- **Responsiveness:** Shifting work to run in the background.
- **Performance:** Exploiting parallelism in hardware.
### Thread Control Block (TCB):
- Data structure containing information needed to manage a thread:
  - Stack pointer
  - Register values
  - Metadata
  - Thread unique identifier (tid)
  - Scheduling priority
  - Status
  - Pointer to PCB
### Multiple Processes vs. Single Process with Multiple Threads:
- **Protection vs. Efficiency:** Communication harder between processes (IPC), easier within a process.
### Memory Footprint of Multiple Threads:
- Positioning stacks relative to each other.
- Maximum stack size considerations.
- Handling stack overflow (guard values).
## Putting it Together
### Process:
- High switch overhead.
- CPU state low, Memory/IO state high.
- High process creation cost.
- Protection in CPU, Memory/IO.
### Threads:
- Medium switch overhead.
- CPU state low, Memory/IO state zero (within a process).
- Low thread creation cost.
- Protection in CPU, not in Memory/IO.
### Multi-core Systems:
- Low switch overhead between threads of the same process.
- Low thread creation cost.
- Contention for shared resources may hurt performance.
- Typical SMT level: 2 hardware threads/physical core.
## Hardware Techniques to Exploit Thread-level Parallelism
- **Superscalar:** Execute multiple independent instructions per cycle.
- **Multicore:** Execute multiple independent threads (one per core).
- **Fine-grained Multithreading (FGMT):** Execute multiple independent threads (more than one per core, one per cycle).
- **Simultaneous Multithreading (SMT):** Execute multiple independent threads (more than one per core, more than one per cycle).
### Simultaneous Multithreading (SMT):
- Very low switch overhead between hardware-threads.
- Done in hardware, register files tagged with thread ID.
- Contention for shared resources may hurt performance.
- Typical SMT level: 2 hardware threads/physical core.
## Conclusion
- Understanding the concepts of processes and threads is crucial for real-time operating systems.
- Proper management of address space, process control blocks, and state queues ensures efficient execution and resource utilization.
- Threads offer a way to improve program structure, responsiveness, and performance by exploiting parallelism.
- Multi-core and multithreading techniques further enhance the ability to run multiple threads concurrently, improving overall system throughput.
# Dual Mode Operations
## Motivation
A part of the OS’s job is to provide security and stability to the system. This involves:
1. Protecting hardware resources from unauthorized access and potential misuse.
2. Ensuring user applications do not interfere with core functionalities.
### Virtual Memory
- Helps with process isolation but is not enough.
- Does not prevent a process from directly tampering with hardware.
### Dual-Mode Operation
- Addresses these concerns by dividing the execution environment into two distinct modes: user mode and kernel mode.
## Dual-Mode Operation
### User Mode
- Designed for running applications with restrictions.
- The processor can only execute a subset of the full instruction set.
- **Privileged Instructions:** Instructions available only in kernel mode.
  - Example: `cli` & `sti` instructions in x86 (disable & enable interrupts).
### Kernel Mode
- A special mode of the processor for executing trusted (OS) code without restrictions.
- The processor can execute any instruction.
- Also called “supervisor mode” or “protected mode”.
## Hardware Support: Privilege Rings
- **Ring 0 (kernel mode):**
  - Access to privileged instructions and all mapped virtual memory.
- **Ring 1 & 2 (device drivers):**
  - No access to privileged instructions but some I/O sensitive instructions.
  - Access to all mapped virtual memory.
- **Ring 3 (user mode):**
  - Only non-privileged instructions.
  - Only user-accessible virtual memory.
### Kernel sets the privilege level for each user process to be ring 3.
## Hardware Support: Control Register
- **How does the processor know:**
  - The current privilege level.
  - Whether the current instruction is allowed to run at this level.
- **Processor Control Registers:**
  - Designate bits to indicate the current privilege level.
  - **x86:** Lower 2 bits of the Code Segment (CS) register.
  - **ARM:** Lower 4 bits of the Current Program Status Register (CPSR).
- **Mode Transfer:**
  - Bits are set/cleared during mode transfer.
## Types of Mode Transfer: User to Kernel
### System Call
- Request for kernel services (e.g., open, close, read, write, lseek).
- Implemented by calling syscall instructions (traps).
### Processor Exception
- Internal synchronous hardware event (e.g., divide by zero, illegal instruction, segmentation fault, page fault).
- Caused by software behavior.
### Interrupt
- External asynchronous event (e.g., timer, disk ready, network).
- Interrupts can be disabled; exceptions and traps cannot.
- Asynchronous events triggered by an external event.
## Types of Mode Transfer: Kernel to User
- **New Process/Thread Start:** Jump to the first instruction in the program/thread.
- **Return from Interrupt/Exception/System Call:** Resume suspended execution.
- **Process/Thread Context Switch:** Resume another process/thread.
- **User-Level Upcall (UNIX Signal):** Asynchronous notification to the user program.
- New process, resume after an interrupt, context-switch, user-level upcall.
## Requirements for Safe Mode Transfer
1. **Limited Entry into Kernel:**
   - Hardware ensures entry point into the kernel is set up by the kernel itself.
2. **Atomic Transfer of Control:**
   - Single instruction to change:
     - Program counter.
     - Stack pointer.
     - Kernel/user mode.
3. **Transparent Resumable Execution:**
   - The user program should not be able to tell an interrupt occurred.
## Interrupt Vector Table
- **How does the processor know which handler to load into PC?**
  - **x86 Interrupt Description Table (IDT):**
    - Table of 256 entries.
    - Index = interrupt number.
    - Entry = handler address.
    - Initialized by OS on startup.
    - A special register contains the address of IDT.
    - A single entry for system call?
### Why is the IVT stored in kernel rather than user memory?
- User code can potentially corrupt it.
## Mode Transfer Mechanisms
- **Upon Mode Switch:**
  - Processor overwrites PC with kernel handler address.
  - Must save the user process’s PC before overwriting.
  - Must save the user process’s registers somewhere too.
  - Kernel handler execution also needs a stack.
- **Saving to User Stack:**
  - Who has access to the user stack?
  - Kernel handler may push kernel data onto the stack.
  - Issues if user-written programs are not bug-free.
## Kernel Interrupt Stack
- Most OSes allocate separate kernel interrupt stacks for each user-level thread.
- **Stack Switch on Mode Switch:**
  - Easier to context switch inside an interrupt or system call handler.
  - Example: Timer interrupt handler might give the processor to another process/thread.
  - Example: System call handler might need to wait for I/O.
## Two-Stack Model Example
- **User Stack:**
  - User-level process.
- **Kernel Stack:**
  - Handles system calls, interrupts, etc.
### Example:
- User CPU state saved.
- Syscall handler uses kernel stack.
- User stack remains ready to run.
## Interrupt Masking
- **Interrupt Handler:** Runs with interrupts disabled.
- **Simplifies Interrupt Handling:**
  - Disabled = deferred (masked) not ignored.
  - Interrupts re-enabled when interrupt completes.
  - Hardware buffers new interrupts in between.
  - Long disable periods may cause loss of interrupts.
- **Example:** On x86:
  - `cli` disables interrupts.
  - `sti` enables interrupts.
  - Only applies to the current CPU (on a multicore system).
  - User programs cannot use these instructions (for security reasons).
## Mode Transfer Steps in x86
1. **Mask Interrupts:**
   - Prevents new interrupts during the mode switch.
2. **Save PC, SP, and Execution Flags in Temporary HW Registers:**
   - Ensures current state is preserved.
3. **Switch onto Kernel Interrupt Stack:**
   - Specified in special HW registers.
4. **Push Key Values onto Interrupt Stack:**
   - PC, SP, and flags.
5. **Optionally Save an Error Code:**
   - Helps diagnose issues.
6. **Invoke Interrupt Handler:**
   - Begins execution of the appropriate handler.
## Example: x86 Mode Transfer
### Single Instruction:
- Save some registers (e.g., SP, PC).
- Change PC and SP.
- Switch kernel/user mode.
### Why Save Stack Pointer Twice?
- **Hint:** Are they the same?
  - User stack pointer.
  - Kernel stack pointer.
## Example: System Call Handler
- **System Call Entry Points:**
  - Table mapping system call number to handler.
- **Locate Arguments:**
  - In registers or on user stack.
- **Copy Arguments:**
  - From user memory to kernel memory.
  - Protects kernel from malicious code evading checks.
- **Validate Arguments:**
  - Ensures correctness.
- **Copy Results Back:**
  - Into user memory.
## Basic Cost of System Calls
- **Minimum System Call:** ~25x cost of a function call.
- **Linux vDSO (Virtual Dynamic Shared Object):**
  - Runs some system calls in user space (e.g., `gettimeofday` or `getpid`).
## Example: User/Kernel Mode Transfers
### User Mode
- Limited hardware access.
### Kernel Mode
- Full hardware access.
### Transfer Types
- **exec, syscall, exit, return from interrupt (rfi), exception.**
### Why Transfer to Kernel Mode on Exit?
- **Reason:** Cleanup and resource deallocation.
## System Call Interface: Access Point to HW Resources
### Components
- **Process Management:** `fork()`, `exec()`, `exit()`.
- **Memory Management:** `mmap()`, `sbrk()`.
- **File Systems:** `open()`, `read()`, `write()`.
- **Device Control:** Drivers and low-level I/O.
- **Networking:** `socket()`, `bind()`, `listen()`.
- **Architecture-Dependent Code:** Specific optimizations and control.
## How Does Kernel Provide Services?
### Applications Request Services via Syscall:
- **Programming Language Runtime Library (e.g., libc.a):**
  - Buried within the library.
  - Abstraction simplifies user code.
## OS Run-time Library
- Provides a standardized interface for system calls.
- **Example:**
  - OS Library linked with user applications.
  - Simplifies syscall usage.
## Putting it Together: Web Server Example
### Request-Reply Flow
1. **Client Sends Request:**
   - Arrives at the server.
2. **Server Processes Request:**
   - Uses kernel and hardware resources.
3. **Server Sends Reply:**
   - Processed and sent back to the client.
### Detailed Flow
1. **Request Arrives (DMA):**
   - System call to read request.
2. **Parse Request:**
   - Copy request to kernel memory.
3. **Disk Read:**
   - System call to read file from disk.
4. **Prepare Reply:**
   - Format response.
5. **Send Reply (DMA):**
   - System call to send response.
# Multithreaded Kernels
## Outline
1. Implementation of threads.
   - Creation, yielding, switching, etc.
   - Kernel-managed vs. user-managed threads.
2. Implementation of synchronization objects.
   - Mutex, semaphore, condition variable.
## Multi-threaded Kernel
- **User-Space Stack:** Allocated by the system library for each user-level thread.
- **Kernel-Space Stack:** Used by the kernel for scheduling and context switching.
### User-level Processes
- **Kernel-related:** Operations managed by the kernel, e.g., context switching.
- **Process-related:** Operations specific to each process, e.g., stack management.
## Thread Lifecycle
### States and Transitions:
1. **Ready:** Thread is ready to run.
   - Transition: `pthread_yield` (yield/suspend).
2. **Running:** Thread is currently executing.
   - Transition: Scheduled by the OS.
3. **Finished:** Thread has completed execution.
   - Transition: `pthread_exit` (exit).
4. **Waiting:** Thread is waiting for an event.
   - Transition: `pthread_join`, `pthread_cond_wait` (wait for event).
   - Event Happens: `pthread_exit`, `pthread_cond_signal/broadcast`.
5. **Init:** Thread is being created.
   - Transition: `pthread_create` (create).
6. **Killed:** Thread is terminated by the system.
## Creating a Thread
### Function: `thread_create`
```c
thread_create(void *(*func)(void*), void *args) {
     // Allocate TCB
     TCB *tcb = new TCB();
     // Allocate kernel stack
     tcb->stack = new Stack(INITIAL_STACK_SIZE);
     // Initialize SP & PC
     tcb->sp = tcb->stack + INITIAL_STACK_SIZE;
     tcb->pc = stub;

     // Set up kernel stack: Push func and args
     *(--tcb->sp) = args;
     *(--tcb->sp) = func;

     // Set state of thread to READY
     tcb->state = READY;
     // Put tcb on ready list
     readyList.add(tcb);
}
```
### Dummy Function: `stub`
```c
stub(void *(*func)(void*), void *args) {
     // Execute the function func()
     (*func)(args);
     // If func() does not call exit, call it here
     thread_exit(0);
}
```
**Why Not Set `tcb->pc` Directly to `func`?**
- The `stub` function ensures proper stack setup and handles thread exit if `func` does not call `thread_exit`.
## What Triggers a Context Switch?
1. **Voluntary:** Thread calls a thread library function (or system call).
   - Examples: `yield`, `join`, `exit`, `open`, `write`, `read`.
2. **Involuntary:** Interrupts or exceptions invoke a handler.
   - Can decide to switch or continue when the handler is done.
   - Examples: Timer interrupt, new packet arrival, DMA request completion.
## Yielding a Thread
### Yield Function
```c
void compute_PI() {
    while (TRUE) {
        compute_next_digit();
        thread_yield();
    }
}
```
### Yield Mechanism
1. **Trap to OS:** Transfers control to kernel mode.
2. **Kernel Yield:**
   ```c
   void kernel_yield() {
       // Temporarily Disable interrupts
       disable_interrupts();
       // Choose another TCB from ready list
       chosenTCB = scheduler.getNextTCB();
       if (chosenTCB != runningTCB) {
           // Move running thread onto ready list
           runningTCB->state = READY;
           ready_list.add(runningTCB);
           // Switch to the new thread
           thread_switch(runningTCB, chosenTCB);

           // We’re running again!
           runningTCB->state = RUNNING;
           // Do any cleanup
           do_cleanup_housekeeping();
       }
       // Enable interrupts again
       enable_interrupts();
   }
   ```
### Why Disable Interrupts?
- Prevents another context switch before `thread_switch` is called.
## Switch Between Threads
### Function: `thread_switch`
```c
// We enter as oldTCB but we return as newTCB
// Returns with newTCB’s registers and stack
thread_switch(TCB *oldTCB, TCB *newTCB) {
    Push all regs onto kernel stack of oldTCB;
    Set oldTCB->sp to stack pointer;
    Set stack point to newTCB->sp;
    Pop regs from kernel stack of newTCB;
    Return;
}
```
**What is Popped?**
- The states of the `newTCB` the last time it was context-switched out.
### Newly Created Thread
- **Need to Set up Entry Point:**
  - Push `args`, `func`, and a dummy switch frame onto the stack.
  - Set up the initial stack and entry point.
## Threads Entry Point
- **Kernel Threads:** No mode switch required.
  - Directly jump to the function that the thread will run.
- **User Threads:** Requires a switch from kernel to user mode.
  - Need one level of indirection.
  - Could jump to a kernel code that then jumps to user code and changes mode atomically.
### Example: `thread_create`
```c
thread_create(void *(*func)(void*), void *args) {
     // Allocate TCB
     TCB *tcb = new TCB();
     // Allocate kernel stack
     tcb->stack = new Stack(INITIAL_STACK_SIZE);
     // Initialize SP & PC
     tcb->sp = tcb->stack + INITIAL_STACK_SIZE;
     tcb->pc = stub;

     // Set up kernel stack: Push func and args
     *(--tcb->sp) = args;
     *(--tcb->sp) = func;
     // Set up entry point
     *(--tcb->sp) = stub;
     // Push dummy data for thread_switch
     push_dummy_switch_frame(&tcb->sp);

     // Set state of thread to READY
     tcb->state = READY;
     // Put tcb on ready list
     readyList.add(tcb);
}
```
## System Call, Interrupt, and Exception Handlers
### Handler Function
```c
handler() {
    // this runs in kernel mode
    // SP points to a kernel stack
    Push regs that might be used by handler on kernel stack;

    // (handle the event)

    Handler_Exit:
    Pop regs that were pushed;
    Return;
}
```
### State Management
- Save and restore the computation states of user mode.
- Change from kernel mode to user mode.
## Kernel-managed Threads
- **Operations:** All thread operations are implemented in the kernel.
- **Scheduling:** OS schedules all threads in a system.
- **Mapping:** Each user thread maps to one TCB (1:1 mapping).
- **Independence:** Every thread can run or block independently.
### Cost:
- Crossing into kernel mode for scheduling is expensive.
- Orders of magnitude more expensive than a procedure call.
## User-managed Threads
- **Management:** Threads are managed entirely by user-level library.
  - Example: `pthreads` (libpthreads.a).
- **Process Creates Threads:**
  - Schedules them independently of the kernel.
- **Mapping:** Kernel only allocates a single TCB to user process (N:1 mapping).
### Advantages:
- No kernel involvement necessary.
- User-level thread operations can be 10-100x faster.
## Drawbacks of User-managed Threads
1. **Single Core Limitation:**
   - Cannot take advantage of multi-core processors.
   - Kernel schedules processes, not user-level threads.
2. **No Preemptive Scheduling:**
   - One thread can starve other threads.
   - Kernel can preempt the process, not user-level threads.
3. **Blocking Calls:**
   - One thread waiting for I/O blocks the entire process.
   - Kernel doesn’t know about user-level threads.
### Example: Blocking Call
- **Thread 3 Requests I/O:**
  - Even if other user-level threads are ready, they can’t run.
  - Same problem with other blocking operations (e.g., mutex, page faults).
## Kernel Support for User-managed Threads
### Scheduler Activations
- **Basic Idea:** Coordination between the kernel and user-level library.
  - Communication from user-level to OS and back.
- **Kernel Notifications:**
  - Notifies user-level scheduler of relevant kernel events (through upcalls).
  - Events include: More/fewer CPUs available, thread blocked on I/O or unblocked, timer interrupt.
- **User-level Scheduler Requests:**
  - Can request more CPUs (might not get them!) or release them.
## Classification of OSes
- **Many OSes:** Have either one or many address spaces.
- **Threads per Address Space:** One or many threads per address space.
### Examples:
- **One Address Space, One Thread:** MS/DOS, early Macintosh.
- **One Address Space, Many Threads:** Traditional UNIX.
- **Many Address Spaces, One Thread:** Embedded systems (Geoworks, VxWorks, JavaOS, Pilot(PC)).
- **Many Address Spaces, Many Threads:** Mach, OS/2, Linux, Windows 10, Win NT to XP, Solaris, HP-UX, OS X.
# Synchronization Primitives: Part 1
## Outline
1. Thread implementation
   - Creation, yield, switch, etc.
   - Kernel-managed vs. user-managed threads.
2. Implementation of synchronization primitives
   - Mutex, semaphore, condition variable.
## Implementing Synchronization Primitives
### Overview
- **Atomic Memory Operations**
  - Load/store
  - Disable interrupts
  - Test&set
- **Synchronization Primitives**
  - Mutex
  - Semaphore
  - Condition variables
  - Monitors
- **Bounded Buffers**
## Bounded Buffer Example
### Implementation:
```cpp
template<typename T>
class BoundedBuffer {
private:
  std::vector<T> buffer;
  size_t head;
  size_t tail;
  size_t count;
  size_t maxSize;

public:
  void produce(const T& item);
  T consume();
};

T BoundedBuffer::consume() {
  if (count == 0) {
    throw std::runtime_error("Buffer is empty");
  }
  T item = buffer[tail];
  tail = (tail + 1) % maxSize;
  count--;
  return item;
}

void BoundedBuffer::produce(const T& item) {
  if (count == maxSize) {
    throw std::runtime_error("Buffer is full");
  }
  buffer[head] = item;
  head = (head + 1) % maxSize;
  count++;
}
```
### Critical Section:
- The critical section is the part of the code that manipulates shared resources (buffer, head, tail, count) and must be protected to prevent concurrent access issues.
## Atomic Memory Operations
- **Atomic Operations:**
  - On most modern architectures, load and store operations on a single word are atomic.
  - Cannot be interleaved with or split by other operations.
- **Example on x86:**
  - Load and store operations on naturally aligned variables are atomic (e.g., a 32-bit variable at address `0x1008`).
- **Assumption:**
  - Unless otherwise stated, loads and stores are considered atomic.
## Mutual Exclusion with Atomic Load and Store
### Example Implementation:
#### Thread A:
```cpp
valueA = BUSY;
turn = 1;

while (valueB == BUSY && turn == 1);

// critical section

valueA = FREE;
```
#### Thread B:
```cpp
valueB = BUSY;
turn = 0;

while (valueA == BUSY && turn == 0);

// critical section

valueB = FREE;
```
**Discussion:**
• **Pros:** Simple implementation for two threads.
• **Cons:**
	• Only protects a single critical section.
	• Extending to multiple critical sections is complex.
	• One thread busy-waits, consuming CPU time.
- **Reordering Issues**
	• Compilers and hardware could reorder instructions.==important==
	• Requires explicit memory barriers to prevent reordering.


---
#flashcards/ECE350/L5/Q1
**Which of the following about atomic memory operations is/are true?**
- [ ] They are indivisible operations that appear to execute as a whole from the standpoint of other threads.
- [ ] They are always very efficient and should be used for all synchronization needs.
- [ ] They can be used to directly implement mutexes for mutual exclusion.
- [ ] All memory operations are atomic.
?
- [*] They are indivisible operations that appear to execute as a whole from the standpoint of other threads.
Explanation: Atomic memory operations are operations that are indivisible, meaning they execute completely or not at all from the perspective of other threads. This ensures that no other operations can observe the operation in an incomplete state.
Reference: "On most modern architectures load and store operations on single word are atomic" (Lecture 5, Page 5).

---
## Memory Consistency in Multicore Processors
### Example:
- **Initial state:** `flag = 0, data = 0, r1 = 0, r2 = 0`
#### CPU1:
```cpp
data = NEW;
flag = SET;
```
#### CPU2:
```cpp
r1 = flag;
if (r1 != SET) goto L1;
r2 = data;
```
### Memory Consistency Model:
- Defines the behavior of memory operations in multi-threaded environments.
- **Sequential Consistency:** The strongest model guarantees that all memory operations appear to execute in the same order as programmed from the perspective of all processors.

---
#flashcards/ECE350/L5/Q2
**Which of the following about memory consistency model is/are true?**
- [ ] It is a part of the instruction set architecture.
- [ ] It defines the expected behavior for reads and writes to shared memory by different processors or threads in a concurrent program.
- [ ] A weaker memory consistency model allows for more aggressive reordering of memory operations.
- [ ] In sequential consistency model, memory operations can be reordered as long as dependencies are preserved.
?
- [*] It defines the expected behavior for reads and writes to shared memory by different processors or threads in a concurrent program.
- [*] A weaker memory consistency model allows for more aggressive reordering of memory operations.
- [*] It is a part of the instruction set architecture.
Explanation: The memory consistency model defines how memory operations (reads and writes) behave in a concurrent system, specifying the order in which operations must appear to execute to ensure correct behavior. Weaker models permit more aggressive reordering for performance gains. It is also considered a part of the instruction set architecture as it defines how memory operations (part of ISA) must behave.
Reference: "Memory consistency model defines the behavior of memory operations in multi-threaded environments" (Lecture 5, Page 9).

---
## Mutex Implementation

### Mutex Operations

- **Lock:** Wait until the lock is free then grab it.
- **Unlock:** Unlock and wake up anyone waiting.
### Rules
- Always lock before accessing shared data.
- Always unlock after finishing with shared data.
- Only the thread that locked the mutex should unlock it.
### Example Implementation
```cpp
void getP() {
  mutex.lock();
  if (p == NULL) {
    temp = malloc(sizeof(...));
    temp->field1 = ...;
    temp->field2 = ...;
    p = temp;
  }
  mutex.unlock();
  return p;
}
```
### Optimization: Double-Checked Locking
```cpp
getP() {
	if (p == NULL) {
		mutex.lock(); // THIS ONLY LOCKS WHEN CONDITION SATIFIED
		if (p == NULL) { // DOUBLE CHECKING NEEDED BECAUSE THE VALUE OF P CAN CHANGE BEFORE mutex.lock() AND AFTER THE FIRST CHECK
			temp = malloc(sizeof(…));
			temp->field1 = …;
			temp->field2 = …;
			p = temp;
			// IF THE ABOVE THREE VALUES GET REORDERED BY HW OR COMPILER, THEN NO OTHER THREAD WILL SEE A NULL p VALUE, HENCE GIVING UP ON THEIR PART OF WORK
		}
		mutex.unlock();
	}
	return p;
}
```
- Avoids unnecessary locking but can lead to reordering issues. **HENCE SHOULDNT BE DONE UNLESS "STRONGEST MODEL" IS GUARANTEED**
- Compilers/HW could make `p` point to `temp` before fields are set.
### Take 1: Disabling Interrupts
#### Naïve Implementation:
```cpp
class Mutex {
public:
  void lock() { disable_interrupts(); }
  void unlock() { enable_interrupts(); }
};
```
### Problems:
- OS cannot let users use this as it can cause system deadlock.
- Does not work well on multiprocessors.
- Real-time OSes should provide guarantees of timing.
## Take 2: Disabling Interrupts + Lock Variable
### Implementation:
```cpp
class Mutex {
private:
  int value = FREE;
  Queue waiting;

public:
  void lock();
  void unlock();
};

void Mutex::lock() {
  disable_interrupts();
  if (value == BUSY) {
    waiting.add(runningTCB);
    runningTCB->state = WAITING;
    chosenTCB = ready_list.get_nextTCB();
    thread_switch(runningTCB, chosenTCB);
    runningTCB->state = RUNNING;
  } else {
    value = BUSY;
  }
  enable_interrupts();
}

void Mutex::unlock() {
  disable_interrupts();
  if (!waiting.empty()) {
    next = waiting.remove();
    next->state = READY;
    ready_list.add(next);
  } else {
    value = FREE;
  }
  enable_interrupts();
}
```
### Discussion:
- Disabling interrupts prevents interruption between checking and setting lock value.
- Critical section inside `lock()` is very short, allowing user code to take as long as needed.
## Take 3: Using Spinlock
### Implementation:
```cpp
class Mutex {
private:
  int value = FREE;
  Spinlock mutex_spinlock;
  Queue waiting;

public:
  void lock();
  void unlock();
};

void Mutex::lock() {
  mutex_spinlock.lock();
  if (value == BUSY) {
    waiting.add(runningTCB);
    scheduler->suspend(&mutex_spinlock);
  } else {
    value = BUSY;
    mutex_spinlock.unlock();
  }
}

void Mutex::unlock() {
  mutex_spinlock.lock();
  if (!waiting.empty()) {
    next = waiting.remove();
    scheduler->make_ready(next);
  } else {
    value = FREE;
  }
  mutex_spinlock.unlock();
}
```
### Discussion:
- Uses spinlock to protect shared data.
- Scheduler manages thread states and ensures proper locking mechanisms.
## Re-enabling Interrupts After thread_switch()
### Responsibility:
- The next thread to re-enable interrupts.
- This invariant should be carefully maintained to avoid deadlock.
## Problems with Take 3
### Multiprocessor Issues:
- Interrupt disabled on one processor while other threads run concurrently on other processors.
- Alternative: Use atomic read-modify-write instructions.
### Example Instructions:
- `test&set`, `swap`, `compare&swap`.
## Spinlock with test&set()
### Simple Implementation:
```cpp
class Spinlock {
private:
  int value = 0;

public:
  void lock() { while (test&set(value)); }
  void unlock() { value = 0; }
};
```
### Discussion:
- Solves previous problems but is wasteful as threads consume CPU cycles (busy-waiting).
## Mutex Implementation in Linux
### Fast Path:
- If mutex is unlocked and no one is waiting, uses two instructions to lock.
### Slow Path:
- If mutex is locked or someone is waiting, uses the Take 3 implementation.
### Example:
```cpp
struct Mutex {
  atomic_t count; // 1: unlocked; < 1: locked
  Spinlock mutex_spinlock;
  Queue waiting;
};

// code for lock()
lock decl (%eax); // atomic decrement
jns 1f;
call slow_path_lock;
1: // critical section
```
## Next
- Implementation of semaphores & conditional variables.
# Synchronization Primitives: Part 2
### Recall: Semaphores
- **Introduction by Dijkstra in the late 60s:**
  - Main synchronization primitives used in original UNIX.
- **Semaphore Operations:**
  - **P():** Waits for semaphore to become positive and then decrements it by 1.
  - **V():** Increments semaphore by 1 and wakes up a waiting P() if any.
- **Usage:**
  - Semaphores can be used for mutual exclusion by initializing them to 1.
  - P() = mutex.lock(); V() = mutex.unlock().
  - Also known as “binary semaphore”.
## Semaphores Considered Harmful
- **Dijkstra's Observation:**
  - Semaphores are used in two distinct ways: for mutual exclusion and for scheduling constraints.
  - This duality can cause confusion and errors.
### Types of Semaphores:
1. **Binary Semaphore:** Used for mutual exclusion.
2. **Counting Semaphore:** Used for scheduling constraints, e.g., bounded buffer.
## Bounded Buffer with Semaphore
### Implementation:
```cpp
#include <semaphore.h>

template<typename T>
class BoundedBuffer {
private:
  std::vector<T> buffer;
  size_t head;
  size_t tail;
  size_t maxSize;

  sem_t slot;  // initialized to maxSize
  sem_t count; // initialized to 0

public:
  void produce(const T& item);
  T consume();
};

T BoundedBuffer::consume() {
  sem_wait(&count);
  T item = buffer[tail];
  tail = (tail + 1) % maxSize;
  sem_post(&slot);
  return item;
}

void BoundedBuffer::produce(const T& item) {
  sem_wait(&slot);
  buffer[head] = item;
  head = (head + 1) % maxSize;
  sem_post(&count);
}
```
### Does this guarantee mutual exclusion?
- No, it does not ensure mutual exclusion. Access to shared buffer variables should be protected by a mutex.
## Implementation of Semaphore
### Semaphore Operations:
#### P() Operation:
```cpp
void Semaphore::P() {
  semaphore_spinlock.lock();
  if (value == 0) {
    waiting.add(myTCB);
    scheduler->suspend(&semaphore_spinlock);
  } else {
    value--;
  }
  semaphore_spinlock.unlock();
}
```
#### V() Operation:
```cpp
void Semaphore::V() {
  semaphore_spinlock.lock();
  if (!waiting.empty()) {
    next = waiting.remove();
    scheduler->make_ready(next);
  } else {
    value++;
  }
  semaphore_spinlock.unlock();
}
```
### Mutex to Guard Internal States of Semaphore:
- The internal state of the semaphore must be protected by a mutex to ensure safe concurrent access.
## Monitors and Condition Variables
### Problem with Semaphores:
- Analyzing code that uses semaphores can be complex due to their dual-purpose nature.
### Solution: Monitors
- **Monitors:** Consist of one mutex with one or more condition variables (CV).
  - **Mutex:** Used for mutual exclusion.
  - **CVs:** Used for scheduling constraints.
## Recall: Condition Variables
### CV Operations:
1. **wait(mutex *CVMutex):**
   - Automatically unlocks mutex, puts thread to sleep, and relinquishes the processor.
   - Attempts to lock mutex when the thread wakes up.
2. **signal():**
   - Wakes up a waiting thread, if any.
3. **broadcast():**
   - Wakes up all waiting threads, if any.
### Properties of Condition Variables:
- Condition variables are memoryless, except for a queue of waiting threads.
- Always hold the lock when calling wait(), signal(), or broadcast().
- Calling wait() atomically adds the thread to the wait queue and releases the lock.
## Condition Variable Design Pattern
### Example Pattern:
```cpp
method_that_waits() {
  mutex.lock();
  while (!testSharedState()) {
    cv.wait(&mutex);
  }
  // Critical section
  mutex.unlock();
}

method_that_signals() {
  mutex.lock();
  // Modify shared state
  if (testSharedState()) {
    cv.signal();
  }
  mutex.unlock();
}
```
- Always use `while` instead of `if` to recheck the condition after waking up.
## Example: Bounded Buffer with Monitors

### Implementation:
```cpp
Mutex BBMutex;
CV emptyCV, fullCV;

void produce(item) {
  BBMutex.lock();
  while (buffer.size() == MAX) {
    fullCV.wait(&BBMutex);
  }
  buffer.enqueue(item);
  emptyCV.signal();
  BBMutex.unlock();
}

T consume() {
  BBMutex.lock();
  while (buffer.isEmpty()) {
    emptyCV.wait(&BBMutex);
  }
  T item = buffer.dequeue();
  fullCV.signal();
  BBMutex.unlock();
  return item;
}
```
## Mesa vs. Hoare Monitors
### Hoare Monitors:
- The signaler gives up the mutex and processor to the waiter immediately.
- The waiter runs immediately and gives up the mutex and processor back to the signaler when exiting the critical section.
### Mesa Monitors:
- The signaler keeps the mutex and processor.
- The waiter is placed on the ready queue with no special priority.
- The condition must be rechecked after waking up.
- Most real operating systems implement Mesa monitors.
## Mesa Monitor: Why "while()"?
### Explanation:
- Using `while` instead of `if` ensures the condition is rechecked because other threads might have modified the shared state between the signal and the actual resumption of the waiting thread.
### Example with "if":
```cpp
consume() {
  mutex.lock();
  if (queue.empty()) {
    emptyCV.wait(&mutex);
  }
  T item = queue.remove();
  fullCV.signal();
  mutex.unlock();
  return item;
}
```
- This can lead to errors if another thread modifies the queue before the waiting thread resumes.
### Correct Implementation with "while":
```cpp
consume() {
  mutex.lock();
  while (queue.empty()) {
    emptyCV.wait(&mutex);
  }
  T item = queue.remove();
  fullCV.signal();
  mutex.unlock();
  return item;
}
```
## Implementation of Condition Variables
### Using Semaphores (Take 1):
```cpp
void CV::wait(Mutex *mutex) {
  mutex->unlock();
  semaphore.P();
  mutex->lock();
}

void CV::signal() {
  semaphore.V();
}
```
- **Problem:** Signal should not have memory. If no thread is waiting, the signal operation will have no effect.
### Using Semaphores (Take 2):
```cpp
void CV::wait(Mutex *mutex) {
  mutex->unlock();
  semaphore.P();
  mutex->lock();
}

void CV::signal() {
  if (!semaphore_queue.empty()) {
    semaphore.V();
  }
}
```

- **Problem:** Unlocking mutex and going to sleep should happen atomically to prevent race conditions.
### Using Semaphores (Take 3):
```cpp
void CV::wait(Mutex *mutex) {
  Semaphore semaphore; // One semaphore per waiting thread
  queue.add(&semaphore); // Queue for waiting threads
  mutex->unlock();
  semaphore.P();
  mutex->lock();
}

void CV::signal() {
  if (!queue.empty()) {
    Semaphore *semaphore = queue.remove();
    semaphore->V();
  }
}
```
## Summary
- Use hardware atomic primitives as needed to implement synchronization:
  - **Disabling interrupts, test&set, swap, compare&swap.**
- Define a lock variable to implement mutex.
- Use hardware atomic primitives to protect modification of that variable.
- Maintain the invariant on interrupts:
  - Disable interrupts before calling `thread_switch()` and enable them when `thread_switch()` returns.
- Be very careful not to waste machine resources:
  - Shouldn’t disable interrupts for long.
  - Shouldn’t busy-wait for long.
# Memory Management
## Outline
1. **Intro/Problem Statement**
2. **Mechanisms**
   - Splitting & coalescing
   - Tracking free/allocated space
   - Embedding a free list
3. **Policies (Algorithms and Data Structures)**
   - Best-fit
   - Worst-fit
   - First-fit
   - Next-fit
   - Buddy System
## Recall: OS as Illusionist and Referee
### Illusion:
- Each process has its own processor with infinite memory capacity.
### Reality:
- Sharing limited amount of processors and memory.
### Memory Management:
Need to multiplex memory (now!).
### Scheduling:
Need to multiplex processors (later).
## Memory Management: Three Aspects
1. **Allocation/Deallocation:**
   - Partition memory among processes (and the OS itself).
2. **Translation:**
   - From (almost infinite) virtual address space to physical memory.
3. **Protection & Communication:**
   - Protect OS from application processes and application processes from themselves.
   - Allow processes to share data (if they “agree”).
## Memory Allocation/Deallocation
### Problem Statement (generalized):
- Given a memory pool of size $S$ (bytes), design a memory allocator that can handle requests asking for an amount of size $k$ of contiguous memory.
- The allocator allocates a block of (at least) size $k$ and returns its address or declares no memory available.
- The allocator should also handle requests to free previously allocated memory.
- **Also known as "free-space management":**
  - Keep track of the location and size of the free space (some kind of free list).
  - Grow and shrink accordingly.
## Partitioning: Static vs. Dynamic
### Static Partitioning:
- Partition memory beforehand in fixed-size units.
- **Pros:** Easy to manage; allocation = return first free unit.
- **Cons:** Hard to determine unit size:
  - Size too small → many allocations would fail (assuming allocation in a single unit).
  - Size too large → internal fragmentation: any request, no matter how small, takes an entire unit; rest wasted.
### Dynamic Partitioning:
- Partition memory based on requests in variable-size units.
- **Pros:** Minimize internal fragmentation; can allocate exactly the size of the request.
- **Cons:** Harder to manage; eventually creates "holes" in the memory:
  - **External Fragmentation:** There is enough memory, but the space is not contiguous.
## Dynamic Partitioning Example
### Scenario:
- 20 bytes of free space.
- Sequence of allocation and deallocation requests:
  - `allocate(4)`
  - `allocate(6)`
  - `allocate(2)`
  - `allocate(8)`
  - `free(0)`
  - `free(10)`
### Issue:
- Fragmentation causes allocation failures despite having enough total free space.
### Strategies to Mitigate Fragmentation:
- **Compaction:** Shuffle the memory contents to place all free memory together in one large block.
  - **OS:** Can shift processes so they are contiguous (relocation).
  - **User-level libraries (malloc):** Relocation much harder; why? Techniques to perform compaction without relocation exist but have caveats.
- **Swapping:** Temporarily swap out memory contents to disk.
  - **OS:** Roll out an (inactive) process to disk, releasing all the memory it holds. When the process becomes active again, the OS must reload it in memory.
  - **User-level libraries (malloc):** Not practical; huge performance overhead.
## Free List
### Concept:
- A set of elements that describes the free space still available.
### Example:
- **State of Memory:** 
```plaintext
current state of memory
head -> [addr: 0, size: 4] -> [addr: 10, size: 2] -> NULL
```
  - Allocated blocks at addresses 0, 4, 10, and 12.
  - Free blocks linked in a list, each node describing a free block's address and size.
## Splitting
### Concept:
- Split a free unit that satisfies the request into two if the request size is less than the free unit size.
### Example:
- **Initial Free Block:** Address 0, size 4.
- **Request:** Allocate 1 byte.
- **Result:** 
  - One block of size 1 allocated.
  - Remaining block of size 3 still free.
## Coalescing
### Concept:
- Merge free neighbouring units into one larger unit to reduce fragmentation.
### Example:
- **Initial State:** Free blocks at addresses 0, 4, and 10.
- **Action:** Free block at address 4.
- **Result:** Coalesce neighboring free blocks into a single larger free block.
## Tracking the Size of Allocated Regions
### Issue:
- `free(void *ptr)` does not take a size parameter.
- How does the allocator know how much memory to free?
### Solution:
- Store metadata in a header block, usually just before the allocated unit.
- Use simple pointer arithmetic to locate and manage this metadata.
### Example:
- **Header Structure:**
  ```cpp
  typedef struct {
    int size;
    int magic;
  } header_t;

  void free(void *ptr) {
    header_t *hptr = (header_t *)ptr - 1;
    total_size_to_free = hptr->size + sizeof(hptr);
    // Perform free operations
  }
  ```
## Embedding a Free List
### Question:
- Where is the free list stored?
### Answer:
- Inside the free space itself.
### Example:
- **Node Type:**
  ```cpp
  typedef struct __node_t {
    int size;
    struct __node_t *next;
  } node_t;

  // Initialize the heap and put the first element of the free list inside that space
  node_t *head = mmap(NULL, 4096, ...);
  head->size = 4096 - sizeof(node_t);
  head->next = NULL;
  ```
## Basic Strategies
### Best-fit:
- Search through the free list for units of free memory that are as big or bigger than the requested size. Return the smallest unit in that group of candidates.
- **Intuition:** Try to reduce wasted space by returning a unit that is close to what the request asks.
- **Cons:** Tends to leave small free units and requires exhaustive search.
### Worst-fit:
- Search for the largest unit and return the requested amount, keeping the remaining (large) chunk on the free list.
- **Intuition:** Try to leave big units free instead of lots of small units.
- **Cons:** Requires exhaustive search, tends to perform poorly, and leads to excess fragmentation.
### First-fit:
- Search for the first unit that is big enough and return the requested amount, keeping the remaining on the free list.
- **Pros:** Fast, no exhaustive search.
- **Cons:** Sometimes "pollutes" the beginning of the free list with small units.
### Next-fit:
- Similar to First-fit but search starting from the last allocated unit.
- **Intuition:** Spread the searches for free space throughout the list more uniformly.
- **Performance:** Similar to First-fit.

> [!Example] **Basic Strategies for Memory Allocation**
> #### Current State of Free List:
> - **Free List:** A linked list of free memory blocks.
> - **Current List:** head -> 10 -> 30 -> 20 -> NULL
>   - Each number represents the size of a free memory block.
> ##### Memory Request:
> - **Request Size:** 15
> ##### Allocation Strategies:
> 1. **Best-Fit:**
>    - **Definition:** Allocates the smallest free block that is large enough to satisfy the request.
>    - **Process:**
>      - The request is for a block of size 15.
>      - The available blocks are 10, 30, and 20.
>      - The smallest block that can satisfy this request is 20.
>      - Allocate 15 from the block of 20.
>      - **Resulting Free List:** head -> 10 -> 30 -> 5 -> NULL
>        - 20 - 15 = 5 (remaining part of the block after allocation).
> 2. **Worst-Fit:**
>    - **Definition:** Allocates the largest free block.
>    - **Process:**
>      - The request is for a block of size 15.
>      - The available blocks are 10, 30, and 20.
>      - The largest block is 30.
>      - Allocate 15 from the block of 30.
>      - **Resulting Free List:** head -> 10 -> 15 -> 20 -> NULL
>        - 30 - 15 = 15 (remaining part of the block after allocation).
> 3. **First-Fit:**
>    - **Definition:** Allocates the first free block that is large enough to satisfy the request.
>    - **Process:**
>      - The request is for a block of size 15.
>      - The available blocks are 10, 30, and 20.
>      - The first block that can satisfy the request is 30.
>      - Allocate 15 from the block of 30.
>      - **Resulting Free List:** head -> 10 -> 15 -> 20 -> NULL
>        - 30 - 15 = 15 (remaining part of the block after allocation).
> 
> ###### Summary:
> - **Best-Fit:** Tries to reduce wasted space by using the smallest adequate block.
> - **Worst-Fit:** Tries to reduce fragmentation by using the largest block.
> - **First-Fit:** Quick and simple, just uses the first adequate block it encounters.

## Segregated Free Lists
### Concept:
- Maintain multiple free lists, one for each different-sized block.
- Pick the list containing blocks at least as large as the request.
- **Pros:** Fast allocation and free; no exhaustive search (compared with best-fit); no coalescing or splitting.
- **Cons:** Inefficient use of memory; memory divided into regions based on block size; number and frequency of requests for different-sized blocks depend on the application.
## Binary Buddy System
### Concept:
- A hybrid of static and dynamic partitioning.
- More flexible than static (doesn’t have to be fixed-size, doesn’t have to partition beforehand).
- Less flexible than dynamic (blocks are allocated at granularities of $2^k$ bytes).
- Free memory is first conceptually thought of as one big space of size $2^U$.
### Allocation:
- For a given request of size $S$, search for free space recursively.
- Divide free space by two until a block that is just big enough to accommodate the request is found.
- Return that block; the other half is called “buddy” of this block.
- Buddies of size $2^k$ that become unallocated are coalesced back into a block of size $2^{k+1}$.
## Binary-Tree Representation of Buddy System
### Concept:
- Represent each $2^k$-byte block with a binary tree node.
- Start with the entire memory pool as a single $2^U$-byte block (root).
- Assume a minimum block size of $2^L$ bytes (will not split further at that point).
- Number of different block sizes = height of tree $h = U - L$.
- Level $k$ has at most $2^k$ nodes of size $2^{U-k}$ bytes.
- Max number of minimum-size blocks (leaf nodes) = $2^h = 2^{U-L}$.
- Max number of nodes in the tree = $1 + 2 + ... + 2^h = 2^{h+1} - 1$.
## Binary-Tree Representation Example
### Example:
- Memory pool of 1M.
- Different levels represent different block sizes:
  - Level 0: Size 1M, Max # blocks: 1
  - Level 1: Size 512K, Max # blocks: 2
  - Level 2: Size 256K, Max # blocks: 4
  - Level 3: Size 128K, Max # blocks: 8
  - Level 4: Size 64K, Max # blocks: 16
### Allocation and Deallocation:
- Use binary tree to represent allocation status.
- Allocate and deallocate blocks by navigating and updating the tree structure.
## Binary Tree: How to Implement
### Options:
1. **Naïve Option:** Linked data structure with pointers.
   - **Cons:** Pointer chasing is slow; encoding a few pointers per node is expensive.
2. **Better Option:** Implement the full tree through a bit array.
   - Allocate a bit array of size $2^{h+1} - 1$.
   - `1` if node is (at least partially) allocated; `0` if node is free or not allocated in the tree.
   - Efficiently compute the index for any node, parent, or children.
## Deallocation: Finding Size
### Scenario:
- Assume a block is deallocated by calling `free(void *addr)`.
- Without a header block, determine the size of the block.
### General Idea:
- Start from the corresponding node at the bottom level and recursively check whether it is allocated.
- The first node that is allocated is the block to free.
- Start from this node and set its bit to 0. If the buddy's bit is also 0, move to the parent and repeat (coalescing).
### Algorithm:
1. Start at level $h$.
2. Compute index $x$.
3. If the bit for node at level $h$ is 1, stop.
4. Otherwise, set $k = k - 1$ and $x = x/2$.
5. Repeat until the block to free is found.
### Time Complexity:
- $O(h)$: Visit at most 2 nodes per level.
## Deallocation Example

### Example:
- Memory pool with blocks of various sizes.
- Free block at address `addr`.
- Start at the corresponding node at the bottom level.
- Recursively check allocation status and coalesce blocks as needed.
 **Algorithm:**
```c
void free(void *addr) {
    // Determine block size
    int k = ...; // level
    int x = ...; // index

    while (array[x] == 1) {
        k--;
        x /= 2;
    }

    array[x] = 0;
    coalesce(x, k);
}
```
## Allocation: Finding Free Block
### Scenario:
- Assume a block is allocated by calling `allocate(int size)`.
- Find a free block (and return its starting address).
### General Idea:
- For each level, implement a doubly linked list of free blocks with a head pointer.
- To allocate a block of size $S$, first find $k$ such that $2^k \geq S$.
- If the level $k$ list is not empty, use the head of the list.
- Otherwise, decrease the level until a non-empty list at level $j$ is found, and split the head of that list until you reach back to level $k$.
### Algorithm:
1. For each level, implement a doubly linked list of free blocks with a head pointer.
2. To allocate a block of size $S$:
   - Find $k$ such that $2^k \geq S$.
   - If the level $k$ list is not empty, use the head of the list.
   - Otherwise, decrease the level until a non-empty list at level $j$ is found.
   - Split the head of that list until you reach back to level $k$.
### Time Complexity:
- $O(h)$: Worst case: $k = 0$ and find a non-empty list at level 0 (root).
**Algorithm:**
```c
void *allocate(int size) {
    int k = ...; // level
    int x = ...; // index

    while (free_list[k] == NULL) {
        k--;
    }

    split_block(k, x);
    return address;
}
```
## Buddy System: Pros and Cons
### Pros:
- Speed: No exhaustive search for allocation.
- Coalescing: Easy; just check if buddy is free and merge.
### Cons:
- Internal and external fragmentation.
- Only power-of-two-sized blocks allowed.
- Rounding up to the next highest power of 2 likely causes fragmentation.
## Exercise
### Given the following bit array representation of a buddy system:** $$[1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0]$$
### Questions:
1. Which blocks are fully allocated? (Answer the corresponding array index)
2. Which blocks are free?
3. If the block corresponding to `array[12]` is deallocated, how should the bit array be updated?

# Uniprocessor Scheduling
## Outline
1. **History**
2. **Definitions**
   - Task, Workload, Scheduling algorithm, Overhead, Preemptive scheduler, Work-conserving scheduler
3. **Uniprocessor Scheduling Policies**
   - FCFS, RR, SJF/SRTF, and more.
## A Bit of History on CPU Scheduling
### Key Points:
- By 2000, CPU scheduling was considered a solved problem.
- **Linus Torvalds (2001):** "Scheduling is easy."
- End of Dennard scaling in 2004 led to the multiprocessor era.
  - Designing new multiprocessor schedulers gained traction.
  - Energy efficiency became a top concern.
- In 2016, bugs in the Linux kernel scheduler caused up to 138x slowdown in some workloads with proportional energy waste.
### References:
- [Linus Torvalds, The Linux Kernel Mailing List](http://tech-insider.org/linux/research/2001/1215.html)
- [Lozi Jean Pierre et al., "The Linux scheduler: a decade of wasted cores" Proceedings of the 11th European Conference on Computer Systems '16](http://dl.acm.org/citation.cfm?id=2901335)
## Definitions
### Key Concepts:
- **Task (thread, process, job):** Unit of work.
- **Workload:** Set of tasks.
- **Scheduling algorithm:** Takes workload as input, decides which tasks to execute first.
- **Overhead:** Extra work done by the scheduler.
- **Preemptive scheduler:** CPU can be taken away from a running task.
- **Work-conserving scheduler:** CPUs won’t be left idle if there are ready tasks to run.
- **Non-preemptive schedulers:** Work-conserving is not always better.
### Focus:
- Only preemptive work-conserving schedulers considered in this lecture.
## Execution Model
### Key Points:
- Programs alternate between bursts of CPU and I/O.
- **CPU scheduling:** Choosing which thread to get CPU for its next CPU burst.
- Multitasking improves CPU utilization.
- Weighted toward small bursts.
### Implications:
- Balancing CPU and I/O bursts is crucial for efficient scheduling.
## Metrics: Performance
### Key Goals:
1. **Minimize average response time:**
   - Response time ≠ latency.
   - **Latency:** Time from start to finish.
   - **Response time:** Time from arrival to finish (what users see).
2. **Maximize throughput:**
   - Throughput: Tasks per time unit.
   - Related to response time but not identical.
   - Minimize context switching to improve throughput.
   - Efficient use of resources (CPU, disk, memory).
## Metrics: Fairness
### Key Points:
- **Fairness:** Share CPU time among users in an equitable way.
  - **Equitable:** Equal share of CPU time? Minimize variance in worst-case performance?
- **Levels:** Thread, Process with multiple threads.
- Fairness is not the same as minimizing average response time.
### Examples:
- Improving average response time can make the system less fair.
## First-Come First-Served (FCFS) Scheduling
### Key Concepts:
- **FCFS:** Also known as FIFO.
  - Early systems: One program scheduled until done (including I/O).
  - Now: Program keeps CPU until the end of its CPU burst.
### Example:
```plaintext
Thread    CPU Burst Time
T1        24
T2         3
T3         3
```
- Suppose threads arrive in order: T1, T2, T3.
- Wait time for T1: 0, T2: 24, T3: 27.
- Average wait time: (0 + 24 + 27) / 3 = 17.
- Average response time: (24 + 27 + 30) / 3 = 27.
### Pros and Cons:
- **Pros:** Simple, fair (in most real-world scenarios).
- **Cons:** Short tasks get stuck behind long ones (convoy effect).
### Convoy Effect** (Concept)
- Large tasks create a convoy of waiting smaller tasks, leading to long queues and resource underutilization.
## Round Robin (RR) Scheduling
### Key Concepts:
- **RR:** Each thread gets a small unit of CPU time (time quantum).
  - Typically 10-100 milliseconds.
  - Once quantum expires, thread is preempted and added to the end of the ready queue.
  - N threads in ready queue, time quantum is q.
  - Each thread gets 1/N of CPU time in chunks of at most q time units.
  - No thread waits more than (N-1)q time units.
### Example:
```plaintext
Thread    Burst Time
T1        53
T2         8
T3        68
T4        24
```
- Wait time: T1: 72, T2: 20, T3: 85, T4: 88.
- Average wait time: (72 + 20 + 85 + 88) / 4 = 66.25.
- Average response time: (125 + 28 + 153 + 112) / 4 = 104.5.
### Pros and Cons:
- **Pros:** Better for short tasks, fair.
- **Cons:** Context-switching time adds up for long tasks.
- **Time Quantum:** Needs to balance between short-task performance and long-task throughput.
### Response Time and Time Quantum
- **Decreasing Q:**
  - May decrease, increase, or stay the same.
- **Examples:**
  - **Decrease Response Time:** Q = 10 (10.5), Q = 5 (8.5).
  - **Same Response Time:** Q = 10 (1.5), Q = 1 (1.5).
  - **Increase Response Time:** Q = 1 (1.5), Q = 0.5 (1.75).
### Practical Choices
- Balance short-task performance and long-task throughput.
- Must be long compared to context-switching time to avoid high overhead.

- Initial UNIX quantum was one second; modern systems use 10-100ms.
- Context-switching overhead should be minimal compared to quantum.
## FCFS vs. RR

### Comparison
- RR is not always better than FCFS.
- **Example: 10 Tasks of 100s CPU Time, Quantum 1s.**
- **FCFS Completion Times:**
  ```plaintext
  Task | Completion Time
  1    | 100
  2    | 200
  ...
  10   | 1000
  ```
- **RR Completion Times:**
  ```plaintext
  Task | Completion Time
  1    | 991
  2    | 992
  ...
  10   | 1000
  ```
### Analysis
- Both finish at the same time.
- Average response time worse under RR.
- Bad when all threads have the same length.
## Shortest Task First (SJF) Scheduling
### Key Concepts:
- **SJF:** Run the task with the least amount of computation.
  - Sometimes called "Shortest Time to Completion First" (STCF).
  - Preemptive version: Shortest remaining time first (SRTF).
  - Key idea: Get short tasks out of the system quickly.
### Example:
```plaintext
Job  | Length
J1   | 5
J2   | 2
J3   | 3
```
- **Order:** J2, J3, J1.
- **Wait Times:** J1 = 5, J2 = 0, J3 = 2.
- **Average Wait Time:** (5 + 0 + 2)/3 = 2.33.
- SJF minimizes average response time.
- Provably optimal: Any other policy that is not SJF can be rearranged to improve response time by using SJF.
### Optimality
- SJF/SRTF minimize average response time.
- Any deviation from SJF/SRTF leads to higher response times.
### Discussion:
- **Pros:** Best for minimizing average response time.
- **Cons:** Hard to predict future task lengths, *possible starvation for long tasks*, high overhead with many context switches.
## Mix of CPU and I/O Bound Tasks
### Example
- **Three Tasks:** A, B (CPU-bound), C (I/O-bound).
- **FCFS:** Poor response time due to long CPU bursts.
- **RR and SRTF:** Better utilization by switching between tasks efficiently.
### Analysis
- **RR (40ms Quantum):** Moderate utilization.
- **RR (1ms Quantum):** High utilization, frequent context switching.
- **SRTF:** High I/O utilization (~90%).
## Strict-Priority Scheduling
### Key Concepts:
- **Strict-priority:** Always execute the highest-priority runnable tasks to completion.
  - Each queue can be threaded in RR with some time quantum.
### Problems:
- **Starvation:** Lower-priority tasks may never run.
- **Priority inversion:** Low-priority tasks delay high-priority tasks by holding resources needed by high-priority tasks.
### Example:
- A high-priority task needs to lock the same mutex locked by a low-priority task.
## Fairness in Scheduling
### Key Points:
- **Strict fixed-priority scheduling:** Can be unfair.
  - Long-running tasks may never get CPU time.
  - Example: Multics shut down a machine and found a 10-year-old task.
### Solutions:
- **Dynamic priority adjustment:** Increase the priority of tasks that don’t get service.
- **Fair-share scheduling:** Give each queue some fraction of CPU time (e.g., 70% high-priority, 20% medium-priority, 10% low-priority).
## Multi-Level Feedback Queue (MLFQ)
### Key Concepts:
- **MLFQ:** Multiple queues with different priorities.
  - Higher priority queues often considered "foreground" tasks.
  - Each queue has its own scheduling algorithm (e.g., RR for foreground, FCFS for background).
### Adjustments:
- Tasks start in the highest priority queue.
- If a task’s time quantum expires, drop it one level.
- If a task doesn’t use up its time quantum, it can move up one level.
### Result:
- Short tasks promoted to higher-priority queues.
- Long-running tasks demoted to lower-priority queues.
## Lottery Scheduling
### Key Concepts:
- **Lottery scheduling:** Give each task some number of lottery tickets.
  - On each time slice, randomly pick a winning ticket.
  - Achieves proportional-share allocations.
  - Tasks with more tickets get more CPU time.
### Example:
- Short tasks get more tickets, long tasks get fewer.
- Avoids starvation by giving every task at least one ticket.
### Pros and Cons:
- **Pros:** Graceful under load changes, proportional sharing.
- **Cons:** Can be unfair if the number of tasks varies widely.
## Stride Scheduling
### Key Concepts:
- **Stride scheduling:** Achieves proportional-share scheduling without randomness.
  - Defines stride for each task.
  - Larger share of tickets = smaller stride.
  - Maintains a pass counter for each task.
  - Always picks the task with the lowest pass value to run next.
### Example:
- Strides: A: 100; B: 200; C: 40.
## Max-Min Fair (MMF) Scheduling
### Key Concepts:
- **MMF:** Always choose the task with the lowest accumulated CPU time.
  - Goal: Give each task an equal share of CPU time.
  - Strict MMF causes too many context switches.
  - Relaxed MMF runs the task with the lowest accumulated CPU time for a fixed time quantum before choosing the next task.
### Problem:
- Fixed quantum leads to poor response time as the number of tasks increases.### Solution:
- Dynamically change time quantum based on target latency and number of tasks.
## Weighted Max-Min Fair (WMMF) Scheduling
### Key Concepts:
- **WMMF:** Assigns weight to each task.
  - Different time quanta for different tasks.
  - Tracks tasks' virtual runtime.
### Example:
- Linux Completely Fair Scheduler (CFS) implements similar ideas.
## Starvation and Sample Bias
### Key Points:
- Ensure fair comparison when measuring scheduling policies.
- Different policies complete different sets of tasks; their average response times are not directly comparable.
## Choosing the Right Scheduling Algorithm
### Guidelines:
- **CPU throughput:** FCFS
- **Average response time:** SRTF approximation
- **I/O throughput:** SRTF approximation
- **Fairness (CPU time):** Linux CFS
- **Fairness (wait time):** RR
- **Favoring important threads:** Priority
- **Proportional sharing:** Lottery and stride scheduling
## Summary
### Key Concepts:
- **FCFS:** Simple, fair, but short tasks can get stuck behind long ones.
- **RR:** Better for short tasks, fair, but context-switching time adds up.
- **SJF/SRTF:** Optimal for minimizing average response time but hard to predict task lengths.
- **MLFQ:** Multiple queues with different priorities, adjusts tasks' priorities based on their behavior.
- **Lottery/Stride Scheduling:** Proportional-share allocations, avoids starvation.
- **MMF/WMMF:** Equal or weighted share of CPU time, dynamically adjusts time quantum.
# Multiprocessor Scheduling
## Outline
1. Background on Multiprocessor Architecture
   - Heterogeneity
   - NUMA
   - Cache Coherence
2. Multithreading on Multiprocessors
   - Mitigating Lock Contention
3. Load Balancing in Multiprocessors
   - Load Tracking
   - NUMA Domains
   - Cache Reuse
   - Energy Efficiency
4. Scheduling Policies for Multithreaded Programs
   - Oblivious Scheduling
   - Gang Scheduling
   - Space Sharing
## Multiprocessor Scheduling
### Scheduling’s *Simple Invariant*
- Ready tasks should be scheduled on available CPUs.
### Complexity in Multiprocessors
- High cost of cache coherence and synchronization.
- Non-uniform memory access (NUMA) latencies.
## Background: Symmetric vs. Asymmetric Multiprocessors
### Symmetric Multiprocessors
- All processors are identical.
### Asymmetric Multiprocessors
- Processors with different performance and energy characteristics.
- Different microarchitectures and operating at different voltages and frequencies.
- Example: Intel Haswell (Symmetric) vs. Intel Alder Lake and ARM big.Little (Asymmetric).
## Background: UMA vs. NUMA
### UMA (Uniform Memory Access)
- Equal latency to all memory.
- Simple scheduling: doesn’t matter where you run tasks.
- Lower peak performance.
- Common in small-scale multicore processors.
### NUMA (Non-Uniform Memory Access)
- Faster access to local memory.
- More complex scheduling: where you run tasks matters.
- Higher peak performance.
- Common in large-scale multicore processors.
## Background: Cache Hierarchy in Multiprocessors
### Cache Levels
- Private L1 Cache for each CPU.
- Shared L3 Cache.
- Private L2 Cache for each CPU.
- Memory Controller and Memory.
### Views
- **Programmer’s View:** Unified memory space.
- **Hardware’s View:** Hierarchical memory structure with varying latencies.


## Background: Cache Coherence
```tikz
\usetikzlibrary{shapes.geometric, positioning}
\begin{document}
\begin{tikzpicture}
	% Main memory
	\node[draw, fill=purple!70, minimum width=6cm, minimum height=2cm, align=center] (memory) at (0,-2) {Main Memory\\ \textcolor{black}{$\mathbf{x}$}};
	\draw[thick, green] (-2.5, -0.4) -- (-0.5, -0.4);
	% Interconnection Network
	\node[draw, fill=red!40, minimum width=6cm, minimum height=1cm, align=center] (interconnect) at (0,0) {Interconnection Network};
	% CPU A
	\node[draw, fill=blue!90, minimum width=3cm, minimum height=2cm, align=center] (cpua) at (-2.5,4.5) {CPU A};
	% CPU B
	\node[draw, fill=blue!90, minimum width=3cm, minimum height=2cm, align=center] (cpub) at (2.5,4.5) {CPU B};
	% Private L1 Cache A
	\node[draw, fill=orange!90, minimum width=3cm, minimum height=2cm, below=0mm of cpua, align=center] (l1a) {Private L1 Cache};
	% Private L1 Cache B
	\node[draw, fill=orange!90, minimum width=3cm, minimum height=2cm, below=0mm of cpub, align=center] (l1b) {Private L1 Cache};
	% Connections
	\draw[-] (l1a.south) -- (interconnect.north -| l1a);
	\draw[-] (l1b.south) -- (interconnect.north -| l1b);
	\draw[-] (interconnect.south) -- (memory.north);
	% Cache line indicator in CPU B's L1 cache
	\draw[thick, green] (1.25, 3.3) -- (3.75, 3.3);
\end{tikzpicture}
\end{document}
```

```tikz
\usetikzlibrary{shapes.geometric, positioning, animations}
\usetikzlibrary[animations]
\begin{document}
\begin{tikzpicture}[
    animate/colorchange/.style 2 args = {
        myself:color = {
          #1 = "orange",
          #2 = "red",
          repeats }}]

    % Main memory
    \node[draw, fill=purple!70, minimum width=6cm, minimum height=2cm, align=center] (memory) at (0,-2) {Main Memory\\ \textcolor{black}{$\mathbf{x}$}};
    
    % Interconnection Network
    \node[draw, fill=red!40, minimum width=6cm, minimum height=1cm, align=center] (interconnect) at (0,0) {Interconnection Network};
    
    % CPU A
    \node[draw, fill=blue!90, minimum width=3cm, minimum height=2cm, align=center] (cpua) at (-2.5,4.5) {CPU A};
    
    % CPU B
    \node[draw, fill=blue!90, minimum width=3cm, minimum height=2cm, align=center] (cpub) at (2.5,4.5) {CPU B};
    
    % Private L1 Cache A
    \node[draw, fill=orange!90, minimum width=3cm, minimum height=2cm, below=0mm of cpua, align=center, animate={colorchange={0s}{2s}}] (l1a) {Private L1 Cache\\ \textcolor{black}{$\mathbf{x}$}};
    
    % Private L1 Cache B
    \node[draw, fill=orange!90, minimum width=3cm, minimum height=2cm, below=0mm of cpub, align=center, animate={colorchange={2s}{4s}}] (l1b) {Private L1 Cache\\ \textcolor{black}{$\mathbf{x}$}};
    
    % Connections
    \draw[-] (l1a.south) -- (interconnect.north -| l1a);
    \draw[-] (l1b.south) -- (interconnect.north -| l1b);
    \draw[-] (interconnect.south) -- (memory.north);
    
    % Animation: Modify cache A
    \node [fill=green, minimum size=5mm, circle, animate={colorchange={1s}{3s}}] at (l1a.north) {};

    % Animation: Modify cache B to show inconsistency
    \node [fill=red, minimum size=5mm, circle, animate={colorchange={3s}{5s}}] at (l1b.north) {};
    
    % Main memory update
    \node [text=white] at (memory.south) {\textcolor{yellow}{Update Memory}};
    
    % Animation for coherence issue visualization
    \node [fill=red, text=white, minimum size=5mm, circle, animate={colorchange={4s}{6s}}] at (l1b.south) {Inconsistent};
    
\end{tikzpicture}
\end{document}
```


### Scenario
- Thread A modifies data inside a critical section and unlocks a mutex.
- Thread B locks the mutex and reads the data.
```tikz
\usetikzlibrary{animations} % LaTeX and plain TeX  
\usetikzlibrary[animations] % ConTeXt
\begin{document}
\begin{tikzpicture}[
    animate/orbit/.style 2 args = {
        myself:shift = {
          along = {
            (0,0) circle [radius=#1]
          } sloped in #2s/10,
          repeats }} ]
 \node :color = {0s = "orange",
                 2s = "red",
                 4s = "orange",
                 repeats}
       {Sun};
  \begin{scope}[animate={orbit={2.5cm}{365}}]
    \node {Earth};
    \node [animate={orbit={1cm}{28}}] {Moon};
  \end{scope}
  \useasboundingbox (-3.8,-3.8) (3.8,3.8);
\end{tikzpicture}
\end{document}
```
### Cache Coherence Problem
- Writes to private cache in one core are invisible to other cores.
- **Solution Approaches:**
  1. No caches (bad performance).
  2. All cores share the same L1 cache (bad performance).
  3. Private **write-through cache** (*incoherent*).
  4. Force read in one cache to see write made in another (**write-update** or **write-invalidate**).
> **Common Solution**: Write-invalidate protocols used in almost all processors.
## Cache Coherence Protocols
### Two Invariants
1. **Single-writer-multiple-readers:**
     - At any time, any given block has either:
          - One writer with read-write access.
          - Zero or more readers with read-only access.
2. **Up-to-date Data:**
	- Value at the beginning of each interval is equal to value at the end of the most recently completed read-write interval.
## Multithreading on Multiprocessors
### Overheads
- Thread creation/management costs.
- Lock contention: Only one thread can hold a lock at any time.
- Communication of shared data: Enforced by cache coherence protocol.
- False sharing: CPUs may communicate for data that is not truly shared.
### Mitigating Lock Contention
1. **Fine-grained Locking:**
	- Partition objects into subsets, each protected by its own lock.
	- Example: Divide hash table key space.
2. **Per-Processor Data Structures:**
	- Partition objects so most/all accesses are made by one processor.
	- Example: Partition heap into per-processor memory regions.
## Reducing Lock Contention
### Staged Architecture
- Each stage includes private state and a set of worker threads.
- Different stages communicate by sending messages via producer/consumer queues.
- Worker threads pull the next message and process it.
- Example: Pipeline operations in a web server.
## Single-Queue Scheduling
### Concept
- Single ready queue for all CPUs.
- Simple: Adapt an existing policy to work on more than one CPU.
### Problems
- Lock contention for the ready queue’s lock, creating a bottleneck.
- Cache coherence overhead as ready queue is accessed by different processors.
- Limited cache reuse due to lack of data locality.
## Multi-Queue Scheduling
### Concept
- Each CPU has its own private ready queue.
- More scalable; better cache reuse.
- Different scheduling policies for each queue.
### Problems
- Load imbalance: Some CPUs might be idle while threads pile up on others.
- Priorities: One queue can have low-priority threads while another has high-priority ones.
## Load Balancing: Load Tracking Metric
### Balancing Approaches
1. **Based on Number of Threads:**
	- Problem: Threads can have different priorities.
2. **Based on Threads’ Weights:**
	- Problem: High-priority thread often sleeps, causing frequent work stealing.
3. **Based on Threads’ Weights and CPU Utilization:**
	- Example: Linux’s **completely fair scheduling (CFS**).
	- Threads’ loads are adjusted based on CPU usage.
### Asymmetric Multiprocessors
- Consider energy efficiency and performance targets.
## Processor Affinity
### Concept
- Threads should run on the same processor to utilize cache contents.
### Migration Impact
- Migration affects affinity, leading to performance loss due to cache misses.
- **Soft Affinity:** OS tries to keep threads on the same CPU but no guarantees.
- **Hard Affinity:** OS allows threads to specify the set of CPUs they may run on.
## Asymmetric Multiprocessor Scheduling: ARM big.Little
### Scheduler Decision
- Scheduler compares the tracked load of software threads against tunable load thresholds.
- Uses **up migration** and **down migration thresholds** to decide when to run threads on LITTLE or big cores.
## NUMA Nodes and Scheduling Domains
### Concept
- Group of processors sharing the last-level cache forms a NUMA node (domain).
- NUMA nodes are grouped according to their level of connectivity.
### Load Balancing
- Performed for each scheduling domain.
- Important to consider where to migrate or steal work from.
## Load Balancing Newly-Ready Threads
### Strategies
1. **New Threads:**
   - Schedule on the same processor that runs the parent thread.
2. **Awakened Threads:**
   - For cache reuse, schedule on the same node it was put to sleep.
   - If all processors of the same node are busy, schedule on an idle processor.
   - Pick the processor that has been idle for the longest period.
## Energy Aware Scheduling (EAS)
### Goal
- Maximize performance per watt.
- Performance is measured in *instructions per second*.
### Key Factors
- Each processor’s capacity and energy model.
- EAS uses utilization and capacity to estimate how busy each task/CPU is.
- Assigns threads to processors to minimize energy consumption without harming performance.
## Aside: History of Linux CPU Scheduler
### Evolution
1. **O(n) Scheduler (v2.4 to v2.6):**
   - Single ready queue for all CPUs.
   - High algorithmic complexity, poor for highly multithreaded workloads.
2. **O(1) Scheduler (v2.6.0 to v2.6.22):**
   - Constant O(1) scheduling complexity.
   - Better scalability, but less friendly with interactive and audio applications.
3. **Completely Fair Scheduler (v2.6.23):**
   - O(log n) complexity using red-black tree.
   - Fair scheduling with heuristics and optimizations for corner cases.
4. **Brain Fuck Scheduler (2009):**
   - Simple scheduler without heuristics.
   - Only one ready queue, resembling weighted round-robin.
   - Eventually retired in favor of Multiple Queue Skiplist Scheduler.
## Scheduling Multithreaded Programs: Oblivious Scheduler
### Concept
- CPUs independently schedule threads in their queue.
- Each thread is treated as independent.
### Problems
- Bulk synchronous delay: Data parallelism is limited by the slowest thread.
- Producer-consumer delay: Preempting a thread on one CPU stalls others.
## Gang Scheduling
### Concept
- Time is divided into equal intervals.
- Threads from the same process are scheduled at the beginning of each interval.
### Problems
- Idle CPUs if threads have different lengths.
- Some CPUs remain idle when a process doesn’t have enough threads.
## Space Sharing
### Concept
- Each process is assigned a subset of CPUs.
- Minimizes processor context switches.
## How Many CPUs Does a Process Need?
### Overheads
- Creating extra threads, synchronization, and communication.
- Overheads can shift the performance curve down.
## Amdahl’s Law
### Concept
- Estimates the upper bounds on speedups based on the parallelizable portion of a program.
### Analysis
- If only 50% can be parallelized, the best speedup is 2x.
## What Portion of Code is Parallelizable?
### Measurement
- Use tools and metrics like the Karp-Flatt Metric to measure speedup.
## Summary
1. **Multiprocessors:** Properties make scheduling complex.
   - Symmetric vs. asymmetric multiprocessors.
   - Uniform vs. non-uniform memory access.
   - Cache coherence issues.
2. **Concurrency:** Doesn’t always mean higher performance due to various overheads.
3. **Scheduling:** Efficient load balancing is crucial.
   - Load balancing newly-ready threads based on different goals.
4. **Orchestration:** Threads scheduling for multiple multithreaded programs impacts performance.
   - Gang scheduling and space sharing are important strategies.

# Real Time Systems
## Outline
1. What is a Real-Time System?
	- Definitions and features
2. Classification of Real-Time Systems
	- Hard vs. Soft Real-Time Systems
	- Firm Real-Time Systems
3. Real-Time System Requirements
	- Desirable Properties, Microarchitecture, Memory Management
	1. Timeliness
	2. Predictability
	3. Dependability
4. Real-Time Task Scheduling
	- Periodic vs. Aperiodic Tasks
	- Terminologies (Static, Dynamic & Dynamic Sched., Feasibility, Schedulability, Optimality)
	- Common Scheduling Algorithms
		1. Rate Monotonic Scheduling (RMS)
		2. Earliest Deadline First (EDF) Scheduling
		3. Real-Time Operating Systems (RTOS)
		4. Least Laxity First (LLF)
	- Mixed Scheduling & Aperiodic Task Servers
		1. Priority Inversion (PIP)
		2. Priority Ceiling Protocol (PCP)
		3. Deadline Interchange 
## Real-time Systems (RTSes)
### Definition
- A **Real-Time System** is one in which the correctness of the system depends not only on the logical result of computation but also on the time at which the results are produced.
### Performance Measure
- Timeliness based on timing constraints (deadlines).
- Speed/average case performance is less significant.
### Key Property
- Predictability on timing constraints.
## Types of Real-time Systems
### Soft Real-time Systems
- Try to meet all deadlines.
- The system does not fail if a few deadlines are missed.
- Examples: Video streaming applications, online gaming.
### Firm Real-time Systems
- Results have no use outside the deadline window.
- Tasks that fail to meet deadlines are discarded.
- *Examples*: Financial trading systems, multimedia systems, automated assembly lines.
### Hard Real-time Systems
- Must always meet all deadlines.
- The system fails if a deadline is missed.
- Examples: Aircraft control systems, medical devices, industrial control systems.
### Common Requirements
- **Predictability:** Ensuring that all tasks meet their deadlines.
- **Timeliness:** Executing tasks within a specific time frame.
- **Determinism:** The ability of the system to predictably react to inputs.
### Hybrid Real-time Systems
- In most large real-time systems, not all computational tasks are hard or critical.
- Some tasks may have no deadlines, others may have soft deadlines, and some may show hybrid behaviours.
## General-purpose OS are Inadequate for RTSes
### Multitasking/Scheduling
- Optimizes for average response time or throughput.
- Does not consider timing constraints and can introduce unbounded delays.
### Interrupt Handling
- Interrupt priority may be set higher than process priority, causing unbounded delays.
### IPC and Synchronization Primitives
- Can cause priority inversion, leading to unbounded delays.
### Conclusion
- General-purpose OS lacks guaranteed timing, making them unsuitable for RTS.
## Real-time Operating System (RTOS): Desirable Properties
### Predictability
- Guaranteeing in advance that deadlines will be met.
- Notifying when deadlines cannot be guaranteed.
### Timeliness
- Handling tasks with explicit time constraints.
### Reliability
- Functioning correctly under various conditions and workloads.
- Fault tolerance designed for peak load (using redundancy, e.g., RAID).
## Microarchitecture
### Shared Bus
- I/O devices and CPU typically share the same bus.
- DMA (Direct Memory Access) steals CPU memory cycles to transfer data, causing non-determinism.
### Caches
- Speed up execution by keeping data close to the CPU.
- However, cache hits/misses introduce non-determinism.
### Solutions
- Time-slice method: Allocate separate time slots for CPU and DMA.
- Processors without caches: Slower execution but more predictable.
## Alternative to Caches: Scratchpad Memory
### Scratchpad Memory
- Small high-speed memories managed by software.
### Pros
- Deterministic behavior: Consistent and predictable access time.
### Cons
- Limited size.
- Increased software complexity.
- Reduced flexibility.
## Memory Management
1. **Virtual Memory:**
   - **Problem:** TLB (Translation Lookaside Buffer) hits/misses introduce non-deterministic delay.
   - **Solution:** Avoid virtual memory, use physical memory directly.

2. **Paging:**
   - **Problem:** Page faults and page replacement policies cause non-deterministic delays.
   - **Solution:** Use selective page locking to increase determinism.
### General-purpose OS
- Uses virtual memory, which can introduce non-deterministic delays due to TLB misses and page faults.
### RTOS Solution
- Avoid using virtual memory.
- Use physical memory directly.
- Selective page locking to increase determinism.
## Real-time Scheduling
### General-purpose Schedulers
- Maximize average system throughput.
### RTSes Need
- Task-centric scheduling to minimize worst-case response time.
- Predictability over fast computing.
### Real-time Tasks
- **Periodic:** Fixed period (p), worst-case execution time (e), hard relative deadline (d ≤ p).
- **Aperiodic:** Arrive randomly without hard deadlines.
- **Sporadic:** Arrive randomly with hard deadlines.
- Independent vs. interdependent, preemptable vs. non-preemptable.
## Terminology of Real-time Scheduling
### Static Scheduling
- Priority of each task does not change over time.
- Example: Rate Monotonic (RM).
### Dynamic Scheduling
- Priority of each job (within a task) does not change over time.
- Example: Earliest Deadline First (EDF).
### Fully-dynamic Scheduling
- Priority of each job could change over time.
- Example: Least Laxity First (LLF).
### Schedulability
- A schedule is feasible if all deadlines are met.
- A task set is schedulable under a scheduling class if there exists a scheduling algorithm that produces a feasible schedule.
### Optimality
- A scheduling algorithm is optimal if it produces a feasible schedule for any schedulable task set under the scheduling class.

> [!ChatGPT] Online Scheduling in Operating Systems
> **Online scheduling** refers to the process of making scheduling decisions at runtime, rather than in advance. In operating systems, online scheduling deals with the dynamic allocation of CPU time to various tasks as they arrive, without prior knowledge of their execution requirements. This is particularly useful in environments where tasks arrive unpredictably, and the system needs to make decisions on-the-fly.
> #### Key Aspects in Operating Systems:
> 1. **Dynamic Task Arrival:** Tasks may arrive at any time, and the scheduler must decide which task to execute next based on the current state of the system.
> 2. **Priority Management:** Tasks are often prioritized based on criteria such as importance, deadline, or required resources. The scheduler must manage these priorities dynamically.
> 3. **Resource Allocation:** Online scheduling must consider available resources (e.g., CPU, memory) and allocate them to tasks in a way that maximizes efficiency and fairness.
> 4. **Fairness:** Ensuring that all tasks receive adequate CPU time and that no single task monopolizes the CPU, even in the presence of high-priority tasks.
> 5. **Adaptability:** The scheduler adapts to changing conditions, such as varying task loads or system resource availability, to optimize performance.
> ### Online Scheduling in Real-Time Systems
> In **real-time systems**, online scheduling takes on a more critical role because tasks often have strict deadlines that must be met to ensure the system's correct operation.
> #### Key Aspects in Real-Time Systems:
> 1. **Deadlines:** Tasks have deadlines by which they must be completed. The scheduler must ensure that all tasks meet their deadlines, which may involve preempting lower-priority tasks.
> 2. **Task Characteristics:** The scheduler must account for task characteristics such as execution time, deadline, and period (if periodic). This requires a real-time scheduler to be more predictable and deterministic.
> 3. **Feasibility:** The scheduler must determine at runtime whether it is feasible to schedule all tasks such that their deadlines are met. If not, it may reject tasks or degrade the quality of service to maintain overall system stability.
> 4. **Preemption:** High-priority tasks may preempt lower-priority ones to meet deadlines. The scheduler must make decisions about when and what to preempt to ensure real-time constraints are met.
> 5. **Overload Management:** In cases where the system is overloaded (i.e., when it cannot complete all tasks by their deadlines), the scheduler must make decisions about which tasks to drop or delay, typically prioritizing critical tasks.
> ### Differences Between General and Real-Time Online Scheduling
> - **Deadline Sensitivity:** Real-time scheduling is highly deadline-sensitive, whereas general operating system scheduling focuses more on fairness and resource utilization.
> - **Determinism:** Real-time systems require a high degree of determinism and predictability, while general operating systems may tolerate variability in scheduling decisions.
> - **Preemption Strategy:** Preemption in real-time systems is often more aggressive to ensure deadlines are met, compared to the more balanced approach in general operating systems.
> In summary, online scheduling in both operating systems and real-time systems involves making dynamic decisions about task execution. However, the goals and constraints differ, with real-time systems placing a strong emphasis on meeting deadlines and ensuring predictable system behavior.
## Rate Monotonic (RM) Scheduling
### Assumptions
- Tasks are periodic and independent with known and fixed execution times.
### Policy
- Assign higher priorities to tasks with shorter periods.
- Optimal for static schedulers.
### Schedulability Test
- For n periodic tasks with execution time $e_i$ and period $p_i$, RM is guaranteed to produce a feasible schedule if: $$\sum_{i=1}^{n} \frac{e_i}{p_i} \leq n (2^{1/n} - 1)$$
> [!ChatGPT]
> The Rate Monotonic Scheduler (RMS) is a widely used real-time scheduling algorithm designed for periodic tasks. It's based on the principle that tasks with shorter periods (i.e., tasks that need to run more frequently) are given higher priority. This algorithm is optimal for preemptive, fixed-priority scheduling of periodic tasks, meaning that if any set of tasks can be scheduled using fixed priorities, then RMS will successfully schedule them.
> Here's a detailed breakdown of how the Rate Monotonic Scheduler works:
> - ### Task Characteristics
> 	- **Periodic Tasks**: The tasks are assumed to be periodic, meaning they have a regular, recurring execution interval.
> 	- **Fixed Priority**: Each task is assigned a fixed priority based on its period. The shorter the period, the higher the priority.
> 	- **Preemptive Scheduling**: Higher-priority tasks can preempt (interrupt) lower-priority tasks. This ensures that urgent tasks are not delayed by less critical ones.
> 	- **Worst-case Execution Time (WCET)**: The execution time of each task is known and fixed.
> - ### Priority Assignment
> 	- **Priority Based on Period**: The core idea of RMS is that priorities are assigned inversely to the task periods. The task with the shortest period gets the highest priority, while the task with the longest period gets the lowest priority.
> 	- **Static Priority**: Once assigned, the priority of a task does not change throughout the system's operation.
> - ### Execution Process
> 	- **Preemption**: When a higher-priority task becomes ready to execute (e.g., its period has started), it can preempt any currently running lower-priority task.
> 	- **CPU Allocation**: The CPU is always allocated to the highest-priority task that is ready to run.
> 	- **Task Completion**: Once a task finishes its execution within its period, it yields the CPU, allowing other tasks to execute.
> - ### Schedulability Test
>      - To determine if a set of tasks can be scheduled using RMS, a **schedulability test** can be applied. For a set of `n` tasks, RMS guarantees that the tasks will meet their deadlines if: $$U = \sum_{i=1}^{n} \frac{C_i}{T_i} \leq n(2^{1/n} - 1)$$
>           where:
>           - $U$ is the total CPU utilization.
>           - $C_i$ is the execution time (WCET) of task $i$.
>           - $T_i$ is the period of task $i$.
>      - As `n` becomes large, the upper bound of $n(2^{1/n} - 1)$ approaches approximately 69.3%. This means that if the total CPU utilization of all tasks is less than or equal to 69.3%, RMS can schedule them without any missed deadlines.
> - ### Handling Task Overruns
> 	- **Task Overrun**: If a task exceeds its WCET, it might cause the system to miss deadlines for other tasks. RMS does not handle overruns gracefully because it assumes tasks always complete within their given execution times.
> 	- **Recovery Mechanisms**: Systems using RMS may implement mechanisms to detect and handle overruns, such as reducing the priority of the overrunning task, terminating it, or using a secondary scheduler to manage exceptional cases.
> - ### Example
> 	- Consider a system with three periodic tasks:
> 		- **Task 1**: Period = 4 ms, Execution Time = 1 ms
> 		- **Task 2**: Period = 6 ms, Execution Time = 2 ms
> 		- **Task 3**: Period = 8 ms, Execution Time = 3 ms
> 	- **Priority Assignment**:
> 		- Task 1 has the highest priority (shortest period).
> 		- Task 2 has a medium priority.
> 		- Task 3 has the lowest priority.
> 	- **Execution**:
> 		- At time 0 ms, all tasks are ready. Task 1 executes first (highest priority).
> 		- After Task 1 completes at 1 ms, Task 2 executes because it has the next highest priority.
> 		- Task 2 completes at 3 ms, and then Task 3 can execute.
> 		- If Task 1’s next period arrives before Task 3 finishes (at 4 ms), Task 3 is preempted, and Task 1 executes again.
> - ### Advantages of RMS
> 	- **Simplicity**: RMS is straightforward to implement and understand, making it popular in real-time systems.
> 	- **Optimality for Fixed-Priority Systems**: RMS is optimal among fixed-priority schedulers for periodic tasks.
> - ### Limitations of RMS
> 	- **CPU Utilization Bound**: The maximum CPU utilization is about 69.3% for large numbers of tasks. This may lead to under-utilization of the CPU.
> 	- **Limited to Periodic Tasks**: RMS is primarily designed for periodic tasks and does not handle aperiodic tasks well.
> 	- **Handling of Overruns**: RMS does not inherently manage task overruns or dynamic changes in task periods.
> - ### Extensions to RMS
> 	- **Deadline Monotonic Scheduling (DMS)**: A variation where priorities are assigned based on deadlines instead of periods. This is useful when task deadlines are different from their periods.
> 	- **Handling Aperiodic Tasks**: Techniques like background servers or periodic servers can be used alongside RMS to handle aperiodic tasks without violating the periodic tasks' guarantees.
> 
> In summary, the Rate Monotonic Scheduler is a powerful, optimal fixed-priority scheduling algorithm for real-time systems with periodic tasks, balancing simplicity with effectiveness. However, it requires careful consideration of task execution times, periods, and the system's overall CPU utilization to ensure all tasks meet their deadlines.
## Earliest Deadline First (EDF) Scheduling
### Policy
- Always schedule the active task with the earliest deadline.
- Optimal for dynamic online schedulers.
### Schedulability Test
- For n periodic tasks with execution time $e_i$ and period $p_i$, EDF is guaranteed to produce a feasible schedule if: $$ \sum_{i=1}^{n} \frac{e_i}{p_i} \leq 1$$
## Overloaded System under EDF
### Domino Effect
- EDF may become suboptimal in overloaded systems.
- Better schedules can be found by discarding tasks that miss deadlines.
## Least Laxity First (LLF) Scheduling
### Policy
- Assign priority based on laxity (slack): $l = d - t - e$.
### Pros
- Optimal for fully-dynamic schedulers.
### Cons
- Frequent context switches due to laxity ties.
## RM vs. EDF vs. LLF
### Rate Monotonic (RM)
- Simpler implementation, under-utilization for large task sets.
### Earliest Deadline First (EDF)
- Full processor utilization, misbehavior during overload conditions.
### Least Laxity First (LLF)
- Full processor utilization, impractical due to frequent context switches.
## Scheduling Mixed Periodic and Aperiodic Tasks
#### Approaches
1. Run aperiodic tasks immediately: Good response time, bad for periodic tasks.
2. Assign aperiodic tasks the lowest priority: Bad response time for aperiodic tasks.
3. Use a server to handle aperiodic tasks periodically.
### Polling Server (PS)
#### Concept
- Periodic tasks and PS are scheduled based on RM.
- PS serves aperiodic tasks when invoked.
- PS suspends when the queue is empty or the budget expires.
#### Problem
- Budget drops to zero if the queue is empty.
### Deferrable Server (DS)
#### Concept
- Similar to PS but preserves its budget when the queue is empty.
- Demand-driven: Runs in response to aperiodic-task arrivals within its period.
### Total-bandwidth Server (TBS)
#### Concept
- Schedules periodic tasks and TBS based on EDF.
- Aperiodic tasks are assigned deadlines to maintain utilization within the server's bandwidth.
#### Deadline Assignment
- For aperiodic task $T_i$ with computation time $C_i$ arriving at time $a_i$, the deadline $d_i$ is assigned as: $$d_i = \max(d_{i-1}, a_i) + \frac{C_i}{U_{TBS}}$$
> [!ChatGPT] Deeper Explanation of Periodic-Aperiodic Mixed Scheduling Using Servers
> ### 1. Polling Server (PS)
> The Polling Server is a periodic task that executes aperiodic tasks. It’s treated just like any other periodic task by the scheduler, typically using Rate Monotonic Scheduling (RMS).
> #### Operation:
> - **Execution:** The Polling Server is invoked at regular intervals (its period), and it checks if there are any aperiodic tasks to be executed.
> - **Task Execution:** If aperiodic tasks are in the queue, it executes them within its budget (execution time limit).
> - **Suspension:** If no aperiodic tasks are present, or if it runs out of budget before finishing the tasks, it suspends itself until the next period.
> #### Challenges:
> - **Wasted Budget:** If no aperiodic tasks are available when the Polling Server is invoked, its budget is wasted. This means the Polling Server doesn't use its time slice effectively, which can lead to inefficient CPU utilization.
> - **Task Response Time:** Aperiodic tasks might experience a delay if they arrive just after the Polling Server has checked the queue, as they have to wait until the next invocation.
> ### 2. Deferrable Server (DS)
> The Deferrable Server improves upon the Polling Server by preserving its execution budget if there are no aperiodic tasks when it is invoked.
> #### Operation:
> - **Execution:** Like the Polling Server, the Deferrable Server is treated as a periodic task by the scheduler.
> - **Preservation of Budget:** Unlike the Polling Server, if the queue is empty when the server is invoked, it retains its budget for use later within its period.
> - **Demand-Driven:** The Deferrable Server can run as soon as aperiodic tasks arrive, using its preserved budget to execute them promptly.
> #### Advantages:
> - **Improved Response Time:** The DS provides better responsiveness to aperiodic tasks since it can serve them immediately upon arrival (if within its period).
> - **Better Budget Utilization:** By preserving its budget, the DS avoids the inefficiency seen in the Polling Server, leading to better CPU utilization.
> #### Challenges:
> - **Increased Interference:** The DS might interfere more with periodic tasks because it can execute aperiodic tasks at any time during its period, potentially affecting the timing predictability of other tasks.
> ### 3. Total-Bandwidth Server (TBS)
> The Total-Bandwidth Server takes a more dynamic approach by using Earliest Deadline First (EDF) scheduling to handle aperiodic tasks.
> #### Operation:
> - **EDF Scheduling:** The TBS is scheduled along with periodic tasks using EDF. This means it schedules tasks based on deadlines, ensuring that tasks with the earliest deadlines are executed first.
> - **Deadline Assignment:** When an aperiodic task arrives, the TBS assigns it a deadline to ensure that the overall system utilization remains within the specified bandwidth (CPU utilization limit).
>   The deadline $d_i$ for an aperiodic task $T_i$ with computation time $C_i$, arriving at time $a_i$, is calculated as: $$d_i = \max(d_{i-1}, a_i) + \frac{C_i}{U_{TBS}}$$
>   where $U_{TBS}$ is the server's bandwidth, which is a fraction of the CPU's capacity reserved for aperiodic tasks.
> #### Advantages:
> - **Optimal Utilization:** TBS ensures that the system is fully utilized while still meeting deadlines, as it dynamically adjusts to the arrival of tasks.
> - **Better Deadline Guarantees:** By assigning deadlines to aperiodic tasks based on available bandwidth, TBS provides stronger guarantees that deadlines will be met.
> #### Challenges:
> - **Complexity:** The deadline calculation and dynamic nature of the TBS make it more complex to implement compared to Polling and Deferrable Servers.
> - **Overhead:** The need to calculate deadlines for each aperiodic task adds computational overhead, especially in systems with frequent aperiodic task arrivals.
> ### Comparison and Suitability:
> - **Polling Server** is the simplest and most predictable but suffers from inefficient budget use and potentially poor response times for aperiodic tasks.
> - **Deferrable Server** improves response times and budget efficiency at the cost of increased interference with periodic tasks.
> - **Total-Bandwidth Server** offers the best CPU utilization and flexibility, making it ideal for systems with a mix of periodic and aperiodic tasks, but it requires more complex management and computation.
> Each server type has its trade-offs, and the choice of server depends on the specific requirements of the real-time system, such as the need for responsiveness, predictability, and resource utilization.

> [!ChatGPT] Budget In The Context Of Periodic Queued Serving Of Aperiodic Tasks
> In the context of real-time scheduling, especially when discussing servers like the Polling Server (PS) and Deferrable Server (DS), **budget** refers to the amount of CPU time allocated to the server within a specific period. This budget is essentially the execution time the server is allowed to use for processing aperiodic tasks during each period of its operation.
> ### Understanding Budget in Detail:
> 1. **Allocation:** The budget is predetermined based on the server's periodicity and the overall system's requirements. For example, if a server has a period of 10 ms and is allocated a budget of 2 ms, it means that within every 10 ms period, the server can execute aperiodic tasks for up to 2 ms.
> 2. **Execution within Budget:** When the server is invoked, it starts executing aperiodic tasks. It can continue doing so until it exhausts its budget for that period. If there are still tasks left in the queue but the budget is exhausted, the server must wait until the start of the next period to resume execution.
> 3. **Preservation of Budget:** In the case of the Deferrable Server (DS), if there are no aperiodic tasks ready when the server is invoked, the server "defers" its execution but retains the budget. This means that if an aperiodic task arrives later in the period, the server can still use its full budget to execute the task.
> 4. **Budget Expiry:** Once the budget is consumed, the server can no longer execute any aperiodic tasks until its next period. This mechanism ensures that the server does not overuse the CPU, which could interfere with the execution of other periodic tasks.
> 5. **Replenishment:** The budget is replenished at the beginning of each new period. For example, in a server with a 10 ms period and a 2 ms budget, at the start of each 10 ms period, the server's budget is reset to 2 ms.
> ### Why Budget Matters:
> - **Control of CPU Utilization:** The budget ensures that a server cannot monopolize the CPU. It balances the need to service aperiodic tasks with the need to ensure that periodic tasks (which are often more critical) get their required CPU time.
> - **Predictability:** By capping the execution time via a budget, the system can better predict the behavior of aperiodic task servicing, contributing to overall system stability and predictability.
> - **Efficiency:** The concept of budget allows for efficient use of CPU time, especially in the Deferrable Server, where the budget is preserved and not wasted if no tasks are ready.
> In summary, the budget in this context is a crucial control mechanism that regulates how much CPU time a server can use to handle aperiodic tasks, ensuring that the system remains predictable, efficient, and fair to all tasks.

## Scheduling Interdependent Tasks: Synchronization
### Problem
- Priority inversion can cause high-priority tasks to be blocked by lower-priority tasks.
### Solutions
- **Priority-inheritance Protocol (PIP):** Increases the priority of the task holding the resource to the highest priority of any waiting task.
- **Priority-ceiling Protocol (PCP):** Each resource is assigned a priority ceiling, preventing lower-priority tasks from locking it if higher-priority tasks may need it.
### Priority Inversion Example
- Mars Pathfinder experienced system resets due to priority inversion.
### PCP Benefits
- Prevents deadlock and chained blocking by ensuring tasks can only lock resources if their priority is higher than the priority ceilings of all currently locked resources.
## EDF and Deadline Interchange
### Concept
- Task holding a resource may be preempted by another task with an earlier deadline, causing delays.
- Scheduler should assign the earliest deadline among waiting tasks to the running task.
> [!ChatGPT] PIP, PCP, & Deadline Interchange In Detail
> ### Priority Inversion Protocol (PIP)
> **Priority Inversion** occurs when a lower-priority task holds a resource needed by a higher-priority task, causing the higher-priority task to be indirectly blocked. If a medium-priority task that doesn’t need the resource preempts the lower-priority task, the higher-priority task is effectively delayed, which is a significant issue in real-time systems.
> #### Priority Inheritance Protocol (PIP) Explanation:
> - **Basic Idea:** To prevent priority inversion, the Priority Inheritance Protocol temporarily elevates the priority of the lower-priority task (that holds the resource) to the priority level of the highest-priority task that is waiting for that resource.
> - **How It Works:**
> 	- When a higher-priority task $T_H$ is blocked by a lower-priority task $T_L$ because $T_L$ holds a needed resource, $T_L$ "inherits" the priority of $T_H$.
> 	- $T_L$ continues to execute with this elevated priority until it releases the resource.
> 	- Once the resource is released, $T_L$ reverts to its original priority.
> This mechanism ensures that the higher-priority task doesn’t suffer indefinite delays due to lower-priority tasks, minimizing the duration of priority inversion.
> ### Priority Ceiling Protocol (PCP)
> The Priority Ceiling Protocol is another method used to prevent priority inversion and avoid the problems associated with chained blocking and deadlock.
> #### How PCP Works:
> - **Priority Ceiling:** Each resource in the system is assigned a priority ceiling, which is the highest priority of all tasks that might lock this resource.
> - **Blocking Rules:**
>   - A task $T$ can lock a resource only if its priority is higher than the priority ceilings of all the resources currently locked by other tasks.
>   - If $T$ attempts to lock a resource whose ceiling is lower than $T$’s priority, the task is allowed to proceed, but its priority is elevated to the ceiling of that resource.
>   - If a task tries to lock a resource and is blocked, it raises the priority of the task holding the resource to its own priority level (similar to PIP).
> **Advantages of PCP:**
> - **Avoids Deadlock:** By preventing a task from locking a resource if it would lower the system’s effective priority below any other locked resource’s ceiling, PCP avoids deadlock situations.
> - **Prevents Priority Inversion:** The protocol also minimizes priority inversion by controlling when tasks can acquire resources based on priority ceilings.
> ### Deadline Interchange & Relation to EDF
> **Deadline Interchange** is a concept particularly relevant to Earliest Deadline First (EDF) scheduling in real-time systems, especially when tasks share resources.
> #### What Happens in Deadline Interchange:
> - In EDF scheduling, tasks are scheduled based on their deadlines, with the earliest deadline taking precedence.
> - **Resource Sharing Complication:** When a task $T1$ holds a resource, and another task $T2$ with an earlier deadline attempts to access the same resource, $T1$ should ideally release the resource to avoid blocking $T2$.
> - However, in practice, $T1$ may continue to hold the resource, delaying $T2$, which can cause $T2$ to miss its deadline, leading to a **domino effect** where subsequent tasks also miss their deadlines.
> **To Address This:**
> - **Deadline Inheritance:** In systems that support Deadline Interchange, the task holding the resource (e.g., $T1$) may be temporarily assigned the earlier deadline of the preempted task (e.g., $T2$) to ensure that the resource is released quickly.
> - **EDF and Deadline Interchange:** This interaction ensures that the system adheres to the deadlines as closely as possible, even when tasks are competing for shared resources. By inheriting the deadline, the task holding the resource is given a chance to complete quickly, minimizing the potential for cascading deadline misses.
> #### Relation to EDF:
> - **EDF Scheduling:** Under normal circumstances, EDF guarantees optimal scheduling for tasks based on their deadlines. However, when tasks share resources, priority inversion can still occur if not properly managed.
> - **Priority Inheritance and Deadline Interchange in EDF:** When combined with concepts like PIP and PCP, EDF can more effectively handle resource contention, ensuring that the tasks with the most urgent deadlines can proceed with minimal delay, even in the presence of resource-sharing constraints.
> ### Summary 
> - **PIP** helps prevent priority inversion by temporarily boosting the priority of lower-priority tasks that are blocking higher-priority ones.
> - **PCP** is more proactive, assigning ceilings to resources and preventing lower-priority tasks from acquiring them if doing so would interfere with higher-priority tasks.
> - **Deadline Interchange** is a strategy linked to EDF scheduling, where a task might inherit the deadline of another task it is blocking, ensuring that deadlines are met even when tasks compete for resources.


# Address Translation
## Outline
1. Introduction to Address Translation
   - Basic Concepts
   - Uni-programming vs. Multi-programming
2. Virtual to Physical Address Translation Mechanisms
   - Base and Bound
   - Segmentation
   - Paging
   - Multi-level Paging
3. Advanced Address Translation
   - Inverted Page Table
   - Hardware vs. Software Address Translation
   - Comparison of Translation Methods
## Introduction to Memory Management
### Recall: Three Aspects of Memory Management
1. **Allocation/Deallocation:**
   - Partition memory among processes and the OS.
   - Efficient memory allocation and deallocation are essential to prevent fragmentation.
2. **Translation:**
   - Convert virtual addresses (seen by the process) into physical addresses (used by the hardware).
3. **Protection & Communication:**
   - Ensure OS protection and isolation of processes.
   - Enable processes to share memory when necessary.
## Background: Memory Basics
### Units of Measurement
- **1 KiB (Kibibyte):** $2^{10}$ bytes = 1024 bytes.
- **1 MiB (Mebibyte):** $2^{20}$ bytes = 1024 KiB.
- **1 GiB (Gibibyte):** $2^{30}$ bytes = 1024 MiB.
### Addressing Memory
- **4 KiB Memory:** Requires 12 bits to address each byte.
- **32-bit Addressing:** Can address up to 4 GiB.
- **64-bit Addressing:** Can address up to 16 EiB (Exbibyte).
### Address Space Terminology
- **Physical Addresses:** Actual locations in physical memory.
- **Virtual Addresses:** Addresses used by programs, which the OS maps to physical addresses.
## Uni-programming Without Protection and Translation
### Characteristics
- Only one program runs at a time.
- The program always runs at the same physical memory location.
- No need for translation; virtual addresses map directly to physical addresses.
### Issues
- Programs can access any physical memory location, leading to potential conflicts and system instability.
## Multi-programming Without Protection and Translation
### Address Overlap
- To prevent overlapping, the loader adjusts addresses as programs are loaded into memory.
- However, virtual and physical addresses are still the same, and bugs in one program can affect others, including the OS.
## Dynamic Relocation with Base & Bound
### Concept
- Use two CPU registers: Base and Bound.
	- **Base Register:** Holds the starting point of the process's address space.
	- **Bound Register:** Holds the size of the address space.
### Operation
- The OS sets up Base & Bound registers when a process is loaded.
- Virtual addresses are added to the Base to get the physical address.
- Addresses are checked against the Bound to ensure they are within the legal range.
## Base and Bound (B&B) Address Translation
### Process Flow
1. **Virtual Address:** Generated by the process.
2. **Physical Address:** Calculated by adding the Base.
3. **Bounds Check:** Ensures the address is within the allowable range.
### Pros and Cons
- **Pros:**
	- Provides OS protection and program isolation.
	- Minimal hardware requirements.
- **Cons:**
  - Issues with expandable heaps/stacks.
  - Fragmentation and lack of memory sharing between processes.
## Segmentation: Generalized B&B
### Concept
- Instead of a single Base & Bound, have one pair per logical segment (e.g., code, data, stack).
- This allows for better management of memory, reducing both internal and external fragmentation.
### Multi-segment Address Translation
- Segments can be placed anywhere in physical memory.
- Virtual addresses are divided into a segment number and an offset.
### Example
- **Segment Table:** Maps segment numbers to Base and Bound pairs.
- **Offset:** Added to the Base to get the physical address.
## Paging
### Concept
- Divides physical memory into fixed-size chunks called pages.
- Virtual memory is also divided into pages, and each virtual page is mapped to a physical page.
### Address Translation
- Virtual address is split into a page number and an offset.
- Page number is used to index into a page table, which provides the corresponding physical page number.
- The offset is added to the physical page number to get the physical address.
### Pros and Cons
- **Pros:**
  - Simple memory allocation.
  - Easy to share pages between processes.
- **Cons:**
  - Inefficient for sparse address spaces.
  - Large page tables if the address space is large.
## Page-table Address Translation: Example
### Setup
- **Virtual Memory:** Divided into pages.
- **Physical Memory:** Corresponds to these pages.
- **Page Table:** Maps virtual pages to physical pages.
### Example Scenario
- Translate a virtual address to a physical address using the page table.
- The offset remains the same, but the page number is translated.
## Page-table Entry
### Components
- **Physical Page Number:** Maps to the physical memory.
- **Valid Bit:** Indicates if the entry contains a valid translation.
- **Permission Bits:** Determine if the page can be read, written, or executed.
### Permissions in Action
- **Demand Paging:** Pages are loaded into memory only when needed.
- **Copy-on-write:** Efficiently copy pages by marking them read-only until a write occurs.
## Memory Sharing
### Concept
- Processes can share memory by mapping the same physical pages to different virtual pages.
- Each process has its own page table, but they can point to the same physical memory.
## Two-level Page-table Address Translation
### Concept
- The page table itself is paged to save space.
- Virtual page numbers are divided into multiple levels, each pointing to a page table that maps the address.
### Example
- **Two-Level Page Table:** Maps large virtual address spaces efficiently.
- **Savings:** Only allocate page tables for the portions of the address space that are used.
## Multi-level Address Translation: Segments and Pages
### Concept
- Combine segmentation and paging.
- Segments map to pages, and each page table entry maps to a physical page.
### Example
- **Global Descriptor Table:** Points to a page table for each segment.
- **Page Table:** Can be multi-level for large address spaces.
## Inverted Page Table
### Concept
- A single page table is used for all processes, with one entry per physical page.
- Each entry maps a physical page to the corresponding virtual page and process.
### Pros and Cons
- **Pros:** Reduces page table size, which is now proportional to the physical memory size.
- **Cons:** Searching the table can be slow, especially when sharing memory between processes.
### Nuances
- A hash table can be used to increase the performance of a scheme with inverted page table.
## Hardware vs. Software Address Translation
### Hardware-based Translation
- Uses a Memory Management Unit (MMU) to perform translation efficiently.
- **Pros:** Fast, as translations are done in hardware.
- **Cons:** Less flexible and requires complex hardware.
### Software-based Translation
- The OS handles translation, allowing more flexibility but at the cost of speed.
- **Pros:** Flexible, easy to update or change.
- **Cons:** Slower, as every memory reference requires a software fault handler.
## Comparison of Address Translation Methods
### Summary Table
1. **Segmentation:**
   - **Advantages:** Fast context switching, segment mapping maintained by CPU.
   - **Disadvantages:** External fragmentation.
2. **Page-table Translation:**
   - **Advantages:** No external fragmentation, easy allocation.
   - **Disadvantages:** Large table size proportional to virtual memory.
3. **Multi-level Translation:**
   - **Advantages:** Efficient table size, fast allocation.
   - **Disadvantages:** Multiple memory references per page access.
4. **Inverted Table:**
   - **Advantages:** Table size proportional to physical memory.
   - **Disadvantages:** Search overhead and complex memory sharing.
## Summary
- **Segmentation:** Provides isolation and protection but can lead to fragmentation.
- **Paging:** Efficient and easy to manage but can result in large tables.
- **Multi-level Paging:** Balances memory usage and efficiency.
- **Inverted Paging:** Optimizes page table size but introduces complexity in searches.
# Translation Lookaside Buffer
## Outline
1. The Problem with Paging: Overhead
2. Introduction to Translation Lookaside Buffers (TLBs)
3. TLBs and Address Translation
4. TLB Consistency
5. Context Switching and TLBs
6. Multiprocessor Issues and TLB Shootdown
7. TLB Miss Handling
8. Virtually Addressed Caches
9. TLB Set Associativity
10. Superpages and TLB Optimization
## Towards Faster Address Translation
### The Problem with Paging: Overhead
#### Space Overhead
- **Page Tables:** Require extra memory to store page table entries (PTEs).
- **Multi-level Page Tables:** Mitigate space issues but add complexity.
#### Time Overhead
- **Memory Lookups:** Each virtual address requires at least one extra memory lookup (for the page table) before accessing the physical address.
- **Performance Hit:** This is a significant issue since it impacts every memory access.
### Solution: Caching
- **General Principle:** “Whenever we have a performance problem, add a cache!”
- **Optimization:** "Make the common case fast" by caching frequent operations.
## Translation Lookaside Buffer (TLB)
### Concept
- **TLB:** A small hardware cache that stores recent address translations (virtual-to-physical).
- **Main Advantage:** On a TLB hit, the physical address is provided directly without accessing the page tables.
- **Applicability:** Works even if translation involves multiple levels of page tables.
#### TLB Characteristics
- **High Hit Rates:** Leveraging temporal locality of instruction and data accesses.
- **Small Size:** Typically small to ensure fast lookups and efficient use of hardware resources.
### Page Locality
- **Instruction Accesses:** Sequential execution results in frequent accesses to the same page, leading to high locality.
- **Data Accesses:** Commonly accessed data structures like arrays often reside on the same page.
### Temporal Locality
- **TLB Success:** Most translations exhibit temporal locality, making TLB effective in reducing translation time.
## TLB: Caching Applied to Address Translation
### TLB Workflow
1. **CPU Requests:** The CPU generates a virtual address.
2. **TLB Lookup:** The TLB checks if the virtual address has a cached translation.
	- **Hit:** The physical address is retrieved, and data access proceeds.
	- **Miss:** The TLB raises an exception, and the page tables are consulted to find the translation.
3. **Page Table Consultation:** If the TLB misses, the page tables are accessed to find the correct translation.
4. **TLB Update:** The new translation is added to the TLB for future requests.
### TLB Structure
- **Fully-Associative Cache:** Any translation can be stored in any TLB slot.
	- **Small Size:** Ensures fast lookups, crucial because TLB is in the critical path of memory access.
- **Benefits:** Parallel searching and higher hit rates.
- **Trade-offs:** Higher power consumption and area usage compared to set-associative caches.
## TLB Contents
### TLB Entries
- **VPN (Virtual Page Number):** The page number from the virtual address. Key for lookup.
- **PPN (Physical Page Number):** The corresponding physical page number. Result of translation.
- **Other Bits:** Metadata such as valid, permission, dirty, and access bits.
	- **Dirty Bit:** Indicates whether the page has been modified (important for write-back caches).
### Importance of Small Size
- **Lookup Speed:** Smaller TLBs allow faster lookups, which is critical since the TLB is on the critical path of memory accesses.
- **Working Set:** Programs often access a small set of pages frequently, allowing a small TLB to be effective.
## TLB Consistency with Page Table Entries (PTEs)
### Scenarios
1. **PTE Permission Reduction:**
	- TLB entry must be invalidated.
	- Early computers discarded the entire TLB, but modern systems allow targeted invalidation.
	- **Example**: `INVLPG addr` instruction in x86 invalidates the TLB entry for the page containing `addr`.
2. **PTE Permission Increase:**
	- No immediate action needed. The system can wait until the next reference triggers an exception to update the TLB.
3. **PTE Invalidated:**
	- TLB entry must be invalidated.
	- **Example**: When a page is swapped out from memory to disk.
### Solutions
- **Early Computers:** Discarded the entire TLB on changes.
- **Modern Architectures:** Allow invalidation of individual TLB entries (e.g., x86’s `INVLPG` instruction).
## TLB Issue: Context Switches
### Problem
- **Context Switch:** When switching between processes, the TLB entries from the previous process become invalid, leading to potential inconsistencies.
### Solutions
1. **TLB Flush:** Invalidate all TLB entries upon context switch.
	- **Pros:** Simple and ensures no stale entries remain.
	- **Cons:** Expensive, especially if switches are frequent.
2. **Tag with Process-Context Identifier (PCID):** Tag each TLB entry with a PCID to distinguish between different processes.
	- **Pros:** Reduces the need for frequent TLB flushes.
	- **Cons:** Requires additional hardware support for tagging.
## Multiprocessor Issue: TLB Shootdown
### Scenario
- **Problem:** In a multiprocessor system, if one processor updates a PTE, the corresponding TLB entry must be invalidated on all processors.
### TLB Shootdown Process
1. **Invalidate Locally:** The processor that updates the PTE invalidates its TLB entry.
2. **Notify Others:** An inter-processor interrupt (IPI) is sent to other processors, instructing them to invalidate their corresponding TLB entries.
3. **Verification:** Shootdown is complete when all processors confirm the removal of their old entries.
### Challenge
- **Overhead:** The shootdown overhead increases linearly with the number of processors, affecting performance in large multiprocessor systems.
## Who Handles TLB Misses?
### Approaches
1. **Hardware-Traversed Page Tables:**
	1. On a TLB miss, hardware automatically traverses the page tables to find the correct PTE and updates the TLB.
	2. **If it's a Valid PTE:** The hardware fills (updates) the TLB and the processor continues without interruption.
	3. **If it's a Invalid PTE:** The CPU raises a page fault, and the kernel takes over.
2. **Software-Traversed Page Tables:**
	1. On a TLB miss, the CPU raises a TLB fault, which is handled by the OS kernel.
		- The kernel walks through the page tables using privileged instructions to update the TLB.
	2. **If it's a Valid PTE:** The kernel fills (updates) the TLB and returns control to the process.
	3. **If it's a Invalid PTE:** The kernel handles the page fault internally.
### Trade-offs
- **Hardware Handling:** Faster but requires more complex and specialized hardware.
- **Software Handling:** Slower but more flexible and easier to update.
## Improving Performance: Virtually Addressed Cache
### Physically-Addressed Cache
- **Requirement:** Address translation must occur before accessing the cache.
### Virtually-Addressed Cache
- **Concept:** Use the virtual address to access the cache directly.
- **Benefits:** If there’s a hit in the virtual cache, no need to access the TLB.
### Workflow
- **Cache Hit:** Data is retrieved directly from the virtual cache.
- **Cache Miss:** The TLB is accessed to translate the virtual address to a physical address, which is then used to access the physical memory.
## Problems with Virtually Addressed Caches
### Problem #1: **Homonym**
- **Issue:** Same virtual address might map to different physical addresses in different processes.
- **Solution:** Tag each cache entry with a Process ID (PID) to differentiate between processes.
### Problem #2: **Synonym**
- **Issue:** Different virtual addresses might map to the same physical address (aliasing).
- **Scenario:** Occurs when the same file is mapped multiple times in the same process or across different processes.
- **Solution:** Use physical address tags and maintain a reverse lookup to identify all entries corresponding to the same physical address.
## TLB Set Associativity
### Importance of Associativity
- **Critical Path:** The TLB is on the critical path of memory access, so hit time impacts overall performance.
- **Avoid Conflicts:** TLBs should be fully associative or have high associativity to minimize conflict misses.
### TLB Design
- **Fully-Associative:** All entries can be searched in parallel, reducing conflict misses.
	- **Direct-mapped or Low Associativity Is not preferred** due to high conflict miss rates.
- **Trade-offs:** Higher associativity slightly increases hit time but significantly reduces the likelihood of expensive conflict misses.
## Do TLBs Always Improve Performance?
### Example: Video Frame Buffer
- **Scenario:** High-resolution video frame buffers are large, spanning multiple pages.
- **Issue:** Even a large TLB may not cover the entire buffer, leading to frequent misses when accessing different parts of the buffer.
### Considerations
- **Large Working Sets:** TLBs may struggle to keep up with large working sets, especially when access patterns are not localized.
## SUPERPAGES: Improving TLB Hit Rate
### Concept
- **Superpages:** Combine multiple smaller pages into a single larger page, reducing the number of TLB entries needed for large contiguous memory regions.
### Example & Impl. Info
- **Flagging:** A TLB entry can represent either a regular page or a superpage.
	- **Example**: In *x86 architecture*, TLB entries can represent 4KB, 2MB, or 1GB pages by setting a flag, optimizing hit rates for large contiguous memory regions.
### Benefits
- **Hit Rate:** Fewer TLB entries are needed, improving hit rates and overall performance therefore reducing the number of TLB misses for large, contiguous memory regions.
- **Efficiency:** Ideal for applications with large contiguous memory requirements, such as databases and video processing.
## Summary
1. **TLB:** A cache for page table entries that significantly speeds up address translation.
2. **Consistency:** Maintaining consistency between TLB entries and PTEs is critical, especially during context switches and multiprocessor operations.
3. **Fully-associative TLB:** Minimizes conflict misses, crucial for maintaining high performance.
4. **Handling Misses:** Can be managed by hardware or software, each with its trade-offs, meaning the choice will be made depending on the system architecture.
5. **Context Switches and Multiprocessors:** Require careful TLB management to maintain consistency.
6. **Advanced Techniques:** Superpages and virtually addressed caches offer ways to further optimize TLB performance.
# File Systems
## Outline
1. File System Abstractions
	- Files and Directories
2. File Allocation Table (FAT)
3. Unix Fast File System (FFS)
4. New Technology File System (NTFS)
## Building File Systems
### What is a File System?
- **Definition:** A file system is an OS abstraction that provides persistent, named data.
- **Persistence:** Data is stored until it is explicitly deleted, surviving crashes or power loss.
- **Access:** Data can be accessed via human-readable identifiers (file names).
### Goals of a File System
1. **Naming:** Transform the block interface of devices into an interface where files can be accessed by human-readable names rather than blocks.
2. **Data-storage Management:** Organize data-storage blocks into files.
3. **Protection:** Ensure data is secure and isolated while allowing controlled sharing.
4. **Reliability/Durability:** Ensure files remain durable despite crashes, failures, or attacks.
## File
A file is a named collection of data in a file system.
### Characteristics of a File
- **Data:** The information put into the file by the user or program.
- **Metadata:** Information about the file, understood and managed by the OS (e.g., owner, size, modification time, permissions).
### User’s View
- **Name-based Access:** Users interact with files using meaningful names that represent specific data structures.
- **File Structure:** Some files have simple structures (e.g., ASCII text files), while others have complex structures requiring further parsing (e.g., .doc files, ELF binaries, bash scripts).
### System’s View
- **Untyped Bytes:** In UNIX, a file is simply an array of untyped bytes, without inherent structure.
## File Access Patterns
1. **Sequential Access**
	- **Description:** Reading bytes in order (e.g., "give me the next X bytes").
	- **Common Usage:** Most file accesses are sequential.
2. **Random Access**
	- **Description:** Reading or writing bytes out of order, accessing elements in the middle of an array (e.g., "give me bytes from i to j").
	- **Usage:** Less frequent but important for certain applications like databases.
3. **Content-based Access**
	- **Description:** Finding data based on content rather than position (e.g., "find me 100 bytes starting with 'RTOS'").
	- **Usage:** Often implemented via databases or indexing systems like Mac OS X's Spotlight.
## Characteristics of Files
### File Size Distribution
- **Small Files:** Most files are small in size but numerous.
- **Large Files:** Although rare, large files occupy most of the disk space.
### Growth Over Time
- **Increase in Number:** The number of files on a system grows over time, often leading to fragmentation.
## Directory
### What is a Directory?
- **Definition:** A directory is a list of human-readable names mapping each name to a file or another directory.
- **Hierarchical Structure:** Directories are organized in a tree structure, with a root directory at the top (e.g., "/" in UNIX).
### Paths
- **Absolute Path:** A full path from the root directory (e.g., /home/NetID/foo.txt).
- **Relative Path:** A path relative to the current directory (e.g., from /home directory, NetID/foo.txt).
### Links
- **Hard Link:** A direct mapping from a name to an underlying file, allowing multiple names to reference the same file. Deleting one link does not delete the file.
- **Soft Link (Symbolic Link):** A mapping from one name to another name. If the target is deleted, the link becomes invalid.
## File System: Implementation Overview
### Goal
- **Mapping:** Efficiently map file names and offsets to physical storage blocks.
### Steps
1. **Directory Structure:** Use directories to map file names to file numbers.
2. **Index Structure:** Use an index structure to locate the specific block holding the data for any file offset.
## Directories: Naming Data
### How Directories Work
- **File Number Translation:** The file system first translates the file name to a file number.
- **Directory Structure:** Directories themselves are files containing a linked list of entries, each mapping a file name to a file number.
### Recursive Lookup
- **Unix/Linux Systems:** Use predefined file numbers for the root directory and perform recursive lookups to resolve paths.
## File System Layout
### Linked-list Directory Layout (Early Implementations)
- **Description:** Stores a linear list of file name-file number pairs in directory files.
- **Pros:** Simple and works well with a small number of directory entries.
- **Cons:** Sluggish performance with thousands of files in a directory.
### Tree-based Directory Layout (Modern Implementations)
- **Description:** Uses tree structures (e.g., B+ trees) to organize directory contents, indexed by the hash of file names.
- **Advantages:** Efficient lookup for large directories, improved performance over linked lists.
## File Systems: Finding Data
### Index Structures
- **Purpose:** Locate the blocks of a file efficiently.
- **Granularity:** Determines the block size used for data storage.
### Free Space Management
- **Tracking:** Methods to find unused blocks on storage devices.
### Locality Heuristics
- **Preservation:** Techniques to maintain spatial locality, ensuring related data is stored close together.
### Reliability
- **Crash Resilience:** Strategies to maintain data integrity during file system operations.
## File Allocation Table (FAT)
### Introduction
- **Origin:** Introduced in the late 1970s for MS-DOS and early Windows systems.
- **Usage:** Still widely used in devices like flash memory.
### Structure
- **Array of Entries:** Each entry in the FAT corresponds to a storage block.
- **Linked List:** Files are represented by a linked list of FAT entries, with each entry pointing to the next block.
### FAT Properties
- **Free Space Management:** FAT entries specify both the file structure and free space map. A zeroed entry indicates a free block.
- **File Growth:** New blocks can be allocated and linked to existing files.
## FAT Assessment
### Storage Location
- **On Disk:** FAT is stored on the disk, with a cached copy in memory and a backup on the disk.
### Disk Formatting
- **Zeroing Blocks:** A full format zeros all blocks and marks FAT entries as free.
- **Quick Format:** Marks all entries in FAT as free without erasing the blocks.
### Advantages
- **Simplicity:** Easy to find free blocks, append to files, and delete files.
### Disadvantages
- **Slow Random Access:** Linked-list traversal is inefficient for random access.
- **Poor Locality:** File blocks may be scattered, leading to fragmented storage and requiring defragmentation.
	- **Defragmentation:** Often required to improve performance.
- **No Hard Link Support:** Each file must be accessed via a single directory entry.
- **Volume/File Size Limits:** FAT has limitations on maximum volume and file sizes.
## Berkeley Unix Fast File System (FFS)
### Inode Structure
- **Inode Definition:** An inode (index node) contains file metadata and the location of the file’s data blocks, stored in an array at a well-known location on the disk.
- **Multi-level Index Structure:** Inodes have a multi-level index structure, forming an asymmetric tree with direct, indirect, doubly-indirect, and triply-indirect pointers.
### Free Space Management
- **Bitmap:** A bitmap is used to track free space, with one bit per storage block.
### Efficiency
- **Small Files:** Efficient storage for small files using shallow trees.
- **Large Files:** Efficient random access for large files using deep trees.
### Inode Pointing 
- **Direct Pointers:** Point directly to data blocks, suitable for small files.
- **Indirect Pointers:** Provide indirection to support larger files, with multiple levels for increasingly large files.
## FFS: Locality Heuristics
### Block Groups
- **Definition:** The disk is divided into groups of contiguous tracks called block groups.
- **Metadata Distribution:** Inodes and free space bitmaps are distributed across block groups to improve locality.
### Data Block Placement
- **First-free Heuristic:** Uses a first-fit algorithm within block groups to find free blocks, preserving contiguous free space.
### Reserved Space
- **Spatial Locality:** Relies on reserved free space to support sequential block allocation. When the disk is nearly full, reserved space ensures that new blocks can still be allocated contiguously.
### FFS Analysis
#### Pros 
- **Efficiency:** Suitable for both small and large files.
- **Locality:** Good spatial locality for both metadata and data.
- **No Defragmentation:** Designed to avoid the need for defragmentation.
#### Cons
- **Inefficient for Tiny Files:** A 1-byte file still requires both an inode and a data block.
- **Encoding Inefficiency:** Inefficient for files that are mostly contiguous on disk.
- **Reserved Space:** Requires reserving a fraction of disk space to prevent fragmentation.
## New Technology File System (NTFS)
### Introduction
- **Origin:** Released in 1993 by Microsoft, NTFS improved upon FAT in several aspects, including metadata, security, and reliability.
### Extent-based Index Structure
- **Extents:** Variable-sized regions of files stored in contiguous regions of the storage device.
- **Tree Structure:** Files are represented by variable-depth trees containing pointers to file ***extents***.
- **Master File Table (MFT):** Stores metadata and pointers to file data in 1KB entries.
### Master File Table (MFT)
- **MFT Structure:** The MFT stores file metadata and attributes, with each entry being 1 KB in size.
- **Attributes:** Common metadata attributes include standard info, file name, and attribute lists.
### NTFS Details
- **File Allocation:** Uses a variation of the best-fit allocation policy, allowing applications to specify expected file sizes.
- **Metadata as Files:** Almost all file system metadata is stored as files with well-known file numbers.
- **Security and Access Control:** Information is stored in a special file called $Secure.
### Defragmentation
- **Defragmentation Process:** NTFS defragmentation rewrites fragmented files to contiguous regions of storage.
## File Systems: Design Options
### Comparison of FAT, FFS, and NTFS
- **Index Structure:** FAT uses a linked list, FFS uses a
 fixed asymmetric tree, and NTFS uses a dynamic tree.
- **Granularity:** FAT and FFS use blocks, while NTFS uses extents.
- **Free Space Management:** FAT uses an array scan, FFS uses a fixed-location bitmap, and NTFS uses a bitmap stored as a file.
- **Locality:** FAT requires defragmentation, FFS uses block groups and reserved space, and NTFS uses extents with best-fit and defragmentation.


> [!Summary]
> In tabular format:
> 
> | Feature                 | FAT                      | FFS                           | NTFS                                 |
> | ----------------------- | ------------------------ | ----------------------------- | ------------------------------------ |
> | **Index Structure**     | Linked list              | Tree (fixed, asymmetric)      | Tree (dynamic, extent-based)         |
> | **Granularity**         | Block                    | Block                         | Extent                               |
> | **Free Space Tracking** | FAT array scan           | Bitmap (fixed location)       | Bitmap (file-based)                  |
> | **Locality**            | Defragmentation required | Block groups + reserved space | Extents + best fit + defragmentation |
## Summary
1. **File System:** Provides persistent, named data storage and optimizes access and usage patterns.
2. **FAT:** Simple, linked-list-based file system with poor performance and no security.
3. **FFS:** Efficient for both small and large files, with inodes and multi-level index structures.
4. **NTFS:** Advanced file system with variable extents, dynamic tree structures, and enhanced metadata and security features.
# Summary
