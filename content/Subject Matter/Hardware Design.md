> These notes start from pipelining.
# Pipelining
## Introduction to Pipelining
Pipelining is a technique used in computer architecture to allow for the temporal overlapping of processing. It divides tasks into subtasks, which are processed in different pipeline stages, each completing in a single clock cycle. The outputs of one stage serve as inputs to the next, synchronized by a clock. Registers are used to transfer data between stages.
### Key Concepts:
- **Pipeline Stages:** Different phases in the processing of an instruction.
- **Synchronization:** The use of a clock to maintain coordination.
- **Registers:** Used for holding intermediate results between stages.
## Creating a Four-Stage Pipeline
To implement a pipeline, a task must be divided into subtasks of roughly equal duration. Each subtask is handled by a separate pipeline stage. 
### Example:
1. **Stage 1:** Fetch data
2. **Stage 2:** Decode data
3. **Stage 3:** Execute instruction
4. **Stage 4:** Write result
This structure allows overlapping execution, improving overall throughput.
## Impact of Pipelining
Pipelining increases system complexity but significantly enhances performance by allowing multiple instructions to be processed simultaneously. 
### Example:
- **Unpipelined Hardware:**
  - Two inputs, one output, one register, one adder.
  - Throughput: 1 result every 5 clock periods.
> **Unpipelined** uses fewer resources but has lower throughput.
- **Pipelined Hardware:**
  - Six inputs, one output, five registers, five adders.
  - Throughput: 1 result per clock period at steady state.
> **Pipelined** uses more resources but achieves higher throughput.
## CPU Instruction Pipelines
CPU pipelines allow for instruction-level parallelism, often using a five-stage pipeline in RISC architectures:
1. **Instruction Fetch (F)**
2. **Instruction Decode (D)**
3. **Execute (E)**
4. **Memory Access (M)**
5. **Register Write Back (W)**
### Without Pipelining:
- Each instruction requires 5 clock cycles.
- Steady state: one instruction completes every 5 clock cycles.
### With Pipelining:
- Each instruction requires 5 clock cycles.
- Steady state: one instruction completes every clock cycle.
## Performance Metrics
- **Cycles Per Instruction (CPI)**: Lower CPI indicates better performance.
- **Instructions Per Cycle (IPC)**: Higher IPC indicates better performance.
### Cycles Per Instruction (CPI)
CPI measures CPU performance:
- **Unpipelined CPUs:** CPI equals the latency of computation.
- **Pipelined CPUs:** Best theoretical CPI is 1.
- **Superscalar CPUs:** CPI can be less than 1, with more instructions issued per cycle.
## Pipelining Limitations
Not all instructions can be pipelined due to dependencies and shared resources:
- **Pipeline Stalls:** Delays in the pipeline due to hazards.
- **Branch Instructions:** May require pipeline flushing and reordering.
## Hazards in Pipelining
Hazards are dependencies that delay instruction execution:
1. **Data Hazards:** When instructions depend on each other's data.
   - **RAW (Read After Write):** True dependency.
      - ![[Pasted image 20240804144551.png]]
      - ![[Pasted image 20240804144611.png]]
   - **WAR (Write After Read):** Anti-dependency.
      - ![[Pasted image 20240804145024.png]]
   - **WAW (Write After Write):** Output dependency.
      - ![[Pasted image 20240804144627.png]]
2. **Structural Hazards:** Resource conflicts.
3. **Control Hazards:** Branch and jump instructions altering execution flow.
### Avoiding Data Hazards:
- **Reordering Instructions:** Changing the order without affecting results.
- **Out-of-Order Execution**: Executing instructions based on data availability.
- **Operand Forwarding:** Passing results directly to subsequent stages.
- **Pipeline Stalls:** Pausing execution until dependencies are resolved.
#### Techniques For OOO Execution
- Two techniques for OOO execution are the following
	- **scoreboarding**: instructions are executed ooo such that a pipeline stall is only needed when no functional unit is available
	- **tomasulo's algorithm**: instructions are dynamically scheduled for ooo execution using register renaming to enable more efficient use of multiple execution
Sure, let's dive deeper into the two techniques for Out-of-Order (OOO) execution: **scoreboarding** and **Tomasulo's algorithm**.

> [!Summary] Extra Explanation: NOT REQUIRED
> ### Scoreboarding
> **Scoreboarding** is a technique used in computer architectures to allow instructions to execute out-of-order while resolving data dependencies and resource conflicts. It was first implemented in the CDC 6600 computer. Here's a detailed explanation:
> 1. **Functional Units and Registers**:
>    - The processor has several functional units (e.g., ALU, FPU) and a set of registers.
>    - Each functional unit can handle a specific type of instruction (e.g., addition, multiplication).
> 2. **Scoreboard**:
>    - The scoreboard is a centralized control mechanism that keeps track of the status of each instruction and the usage of functional units and registers.
>    - It monitors which instructions are waiting to execute, which are currently executing, and which have completed.
> 3. **Instruction States**:
>    - **Issue**: An instruction is read from the instruction queue and sent to the scoreboard.
>    - **Read Operands**: The instruction waits until its operands are available.
>    - **Execute**: The instruction is sent to the appropriate functional unit for execution.
>    - **Write Result**: The instruction writes its result to the destination register.
> 4. **Handling Hazards**:
>    - **RAW (Read After Write)**: Ensures that an instruction waits until the previous instruction writes its result.
>    - **WAR (Write After Read)**: Managed by delaying the write of the result until the read is complete.
>    - **WAW (Write After Write)**: The scoreboard ensures that writes to the same register are serialized.
> 5. **Pipeline Stalls**:
>    - If no functional unit is available or if there are data hazards, the scoreboard stalls the pipeline until the issue is resolved.
>    - This minimizes pipeline stalls, allowing instructions to execute as soon as their dependencies are resolved.
> ### Tomasulo's Algorithm
> **Tomasulo's Algorithm** is another method for OOO execution, which includes dynamic scheduling of instructions to improve the utilization of the CPU's resources. It was introduced in the IBM System/360 Model 91. Here's a detailed explanation:
> 1. **Register Renaming**:
>    - This technique avoids false dependencies (WAR and WAW) by renaming registers.
>    - It uses a pool of physical registers that map to logical registers used by instructions.
> 2. **Reservation Stations**:
>    - Instructions are issued to reservation stations associated with functional units.
>    - Each reservation station holds the instruction until its operands are available.
> 3. **Common Data Bus (CDB)**:
>    - The CDB broadcasts results from the functional units to all reservation stations and registers.
>    - This allows instructions waiting for an operand to receive the result directly, bypassing the need to wait for it to be written back to the register file.
> 4. **Instruction States**:
>    - **Issue**: An instruction is issued to a reservation station if there is an available one.
>    - **Execute**: The instruction waits until all its operands are available, then it is executed.
>    - **Write Result**: The result is broadcast on the CDB and written to the register file and any waiting reservation stations.
> 5. **Handling Hazards**:
>    - **RAW (Read After Write)**: Managed by ensuring operands are available before execution.
>    - **WAR (Write After Read) and WAW (Write After Write)**: Avoided through register renaming.
> 6. **Dynamic Scheduling**:
>    - Instructions are dynamically scheduled based on operand availability rather than their original program order.
>    - This leads to better utilization of CPU resources and improved performance.
> ### Comparison
> - **Scoreboarding**:
>   - Simpler to implement.
>   - Centralized control through a scoreboard.
>   - Manages dependencies and resource conflicts but can lead to more pipeline stalls compared to Tomasulo's algorithm.
> - **Tomasulo's Algorithm**:
>   - More complex due to register renaming and reservation stations.
>   - Decentralized control through reservation stations and the CDB.
>   - More efficient in resolving dependencies and reducing stalls, leading to higher performance.
### Avoiding Structural Hazards:
- **Adding Hardware:** Replicating resources.
- **Separate Buses:** Using different paths for data and instructions.
### Control Hazards:
- **Branch Prediction:** Predicting the outcome of branches to avoid stalls.
## Pipeline Depth
Pipeline depth is the number of stages in the pipeline. Deeper pipelines can increase throughput but also introduce more complexity and potential hazards.
- **Latency**: Increases with depth.
- **Throughput**: Increases with depth.
- **Clock Period**: Decreases with depth.
- **Circuit Area**: Increases with depth.
### Design Considerations:
- **Shallow Pipelines:** Fewer stages, less complexity, fewer hazards.
- **Deep Pipelines:** More stages, higher parallelism, greater complexity.
## Verilog Design Examples
### Four-Stage Pipeline Example:
1. **Core Design:**
```verilog
module pipe1(
    input [7:0] c, b, a, x,
    input rst, clk,
    output reg [24:0] y
);

reg [7:0] c_r, b_r, a_r, x_r;
reg [7:0] c_r1, b_r1, x_r1;
reg [15:0] y0;
reg [7:0] c_r2, x_r2;
reg [16:0] y1;
reg [7:0] c_r3;
reg [24:0] y2;

always @(posedge clk) begin
    if (rst) begin
        c_r <= 0; 
        b_r <= 0; 
        a_r <= 0; 
        x_r <= 0;
        c_r1 <= 0; 
        b_r1 <= 0; 
        y0 <= 0; 
        x_r1 <= 0;
        c_r2 <= 0; 
        y1 <= 0; 
        x_r2 <= 0;
        c_r3 <= 0; 
        y2 <= 0; 
        y <= 0;
    end else begin
        // Stage 0
        c_r <= c; 
        b_r <= b; 
        a_r <= a; 
        x_r <= x;
        // Stage 1
        c_r1 <= c_r; 
        b_r1 <= b_r; 
        y0 <= a_r * x_r; 
        x_r1 <= x_r;
        // Stage 2
        c_r2 <= c_r1; 
        y1 <= b_r1 + y0; 
        x_r2 <= x_r1;
        // Stage 3
        c_r3 <= c_r2; 
        y2 <= y1 * x_r2;
        // Stage 4
        y <= y2 + c_r3;
    end
end

endmodule
```

> [!Info] Core Design
>    // Stage 0
>    c_r <= c;
>    b_r <= b;
>    a_r <= a;
>    x_r <= x;
> 
>    // Stage 1
>    c_r1 <= c_r;
>    b_r1 <= b_r;
>    y0 <= a_r * x_r;
>    x_r1 <= x_r;
> 
>    // Stage 2
>    c_r2 <= c_r1;
>    y1 <= b_r1 + y0;
>    x_r2 <= x_r1;
> 
>    // Stage 3
>    c_r3 <= c_r2;
>    y2 <= y1 * x_r2;
> 
>    // Stage 4
>    y <= y2 + c_r3;
2. **Testbench:**
```verilog
   `timescale 1ns / 1ps

   module tbpipe1;
       reg [7:0] c = 8'h00, b = 8'h00, a = 8'h00, x = 8'h00;
       reg rst = 1'b1;    
       reg clk = 1'b0;    
       wire [24:0] y;

       pipe1 u1 (.c(c), .b(b), .a(a), .x(x), .rst(rst), .clk(clk), .y(y));        

       always #10 clk <= ~clk;

       initial begin
           $monitor("time=%0t c=%0d b=%0d a=%0d x=%0d y=%0d", $time, c, b, a, x, y);         
           #30 rst <= 1'b0;        
           #20 c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd001;        
           #20 c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd001;        
           #20 c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd002;        
           #20 c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd002;        
           #20 c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd004;        
           #20 c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd004;        
           #20 c <= 8'd000; b <= 8'd000; a <= 8'd000; x <= 8'd000;        
           #100 $finish;    
       end    
   endmodule
```
### Two-Stage Pipeline Example:
1. **Core Design:**
```verilog
   // Stage 0
   c_r <= c;
   b_r <= b;
   a_r <= a;
   x_r <= x;

   // Stage 1
   c_r1 <= c_r;
   y1 <= b_r + (a_r * x_r);
   x_r1 <= x_r;

   // Stage 2
   y <= c_r1 + (y1 * x_r1);
```
2. **Testbench:**
```verilog
   `timescale 1ns / 1ps

   module tbpipe2;
       reg [7:0] c = 8'h00, b = 8'h00, a = 8'h00, x = 8'h00;    
       reg rst = 1'b1;    
       reg clk = 1'b0;    
       wire [24:0] y;

       pipe2 u1 (.c(c), .b(b), .a(a), .x(x), .rst(rst), .clk(clk), .y(y));        

       always #10 clk <= ~clk;

       initial begin
           $monitor("time=%0t c=%0d b=%0d a=%0d x=%0d y=%0d", $time, c, b, a, x, y);         
           #30 rst <= 1'b0;        
           #20 c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd001;        
           #20 c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd001;        
           #20 c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd002;        
           #20 c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd002;        
           #20 c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd004;        
           #20 c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd004;        
           #20 c <= 8'd000; b <= 8'd000; a <= 8'd000; x <= 8'd000;        
           #100 $finish;    
       end    
   endmodule
```
### Simulation Outputs:
The simulation demonstrates the timing and output of the pipeline, showing how results are produced at different stages and how the pipeline enhances throughput compared to non-pipelined designs.
- **4-Stage Pipeline:**
  - Outputs calculated at intervals, showing the progression of valid computations.
- **2-Stage Pipeline:**
  - Faster initial computation but less effective over a long sequence of computations compared to the 4-stage pipeline.
### Design Metrics:
- **Pipeline Example 1:** Lower clock period, more LUTs, more registers.
- **Pipeline Example 2:** Higher clock period, fewer LUTs, fewer registers.
## Advanced Topics
### Bubble and Stall Support
Implementing valid bits to track the flow of data and manage stalls efficiently:
- **Valid Flag:** Indicates if the data in a pipeline stage is valid or a bubble.
- **Stalling:** Halts all stages if the last stage is unable to proceed.
- **Handshaking Signals:** Valid and ready signals to manage flow.
### Verilog Design with Bubble and Stall Support:
1. **Core Design:**
```verilog
module pipe3(
    input [7:0] c, b, a, x,
    input valid_in, rst, clk, ena,
    output reg [24:0] y,
    output reg y_valid
);

reg [7:0] c_r, b_r, a_r, x_r;
reg [7:0] c_r1, b_r1, x_r1;
reg [15:0] y0;
reg [7:0] c_r2, x_r2;
reg [16:0] y1;
reg [7:0] c_r3;
reg [24:0] y2;
reg x_vr, x_vr1, x_vr2, x_vr3;

always @(posedge clk) begin
    if (rst) begin
        c_r <= 0; 
        b_r <= 0; 
        a_r <= 0; 
        x_r <= 0;
        c_r1 <= 0; 
        b_r1 <= 0; 
        y0 <= 0; 
        x_r1 <= 0;
        c_r2 <= 0; 
        y1 <= 0; 
        x_r2 <= 0;
        c_r3 <= 0; 
        y2 <= 0; 
        y <= 0;
        x_vr <= 0; 
        x_vr1 <= 0; 
        x_vr2 <= 0; 
        x_vr3 <= 0;
        y_valid <= 0;
    end else if (ena) begin
        // Stage 0
        c_r <= c; 
        b_r <= b; 
        a_r <= a; 
        x_r <= x;
        x_vr <= valid_in;
        // Stage 1
        c_r1 <= c_r; 
        b_r1 <= b_r; 
        y0 <= a_r * x_r; 
        x_r1 <= x_r; 
        x_vr1 <= x_vr;
        // Stage 2
        c_r2 <= c_r1; 
        y1 <= b_r1 + y0; 
        x_r2 <= x_r1; 
        x_vr2 <= x_vr1;
        // Stage 3
        c_r3 <= c_r2; 
        y2 <= y1 * x_r2; 
        x_vr3 <= x_vr2;
        // Stage 4
        y <= y2 + c_r3; 
        y_valid <= x_vr3;
    end
end

endmodule
```

2. **Testbench:**
```verilog
    `timescale 1ns / 1ps

    module tbpipe3;
        reg [7:0] c = 8'h00, b = 8'h00, a = 8'h00, x = 8'h00;
        reg valid_in = 1'b0; 
        reg rst = 1'b1; 
        reg ena = 1'b0;    
        reg clk = 1'b0;    
        wire [24:0] y;
        wire y_valid;

        pipe3 u1 (.c(c), .b(b), .a(a), .x(x), .valid_in(valid_in), .rst(rst), .ena(ena), .clk(clk), .y(y), .y_valid(y_valid));        

        always #10 clk <= ~clk;

        initial begin        
            $monitor("time=%0t c=%0d b=%0d a=%0d x=%0d valid_in=%0b y=%0d y_valid=%0b ena=%0b", $time, c, b, a, x, valid_in, y, y_valid, ena);         
            #30 rst <= 1'b0;        
            #20 ena <= 1'b1; valid_in <= 1'b1; c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd001;        
            #20 valid_in <= 1'b1; c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd001; 
            #20 valid_in <= 1'b0; c <= 8'd050; b <= 8'd010; a <= 8'd040; x <= 8'd010;        
            #20 valid_in <= 1'b1; c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd002;
            #20 ena <= 1'b0; valid_in <= 1'b0;        
            #20 ena <= 1'b1; valid_in <= 1'b1; c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd002;        
            #20 valid_in <= 1'b1; c <= 8'd003; b <= 8'd002; a <= 8'd001; x <= 8'd004;        
            #20 valid_in <= 1'b1; c <= 8'd005; b <= 8'd001; a <= 8'd004; x <= 8'd004;        
            #20 valid_in <= 1'b0; c <= 8'd000; b <= 8'd000; a <= 8'd000; x <= 8'd000;        
            #100 $finish;    
        end    
    endmodule
```

### Simulation Outputs:
- The simulation output for the revised 4-stage pipeline includes tracking valid data and managing stalls and bubbles effectively, ensuring robust performance under various conditions.
- **Pipeline Example 3:** Implements bubble and stall support using valid bits and handshaking signals, showcasing how to handle real-world pipeline inefficiencies.
### FIFO Queues
Using FIFO queues between stages instead of registers to manage stalls and bubbles effectively.
## Conclusion
Pipelining is a critical technique in modern computer architecture, significantly improving instruction throughput and overall performance. However, it introduces complexity and potential hazards that must be managed through careful design and techniques like operand forwarding, branch prediction, out-of-order execution, and bubble and stall management.

# Memory Systems
## Introduction to Memory Systems
Memory systems are crucial components of computer architecture, storing data and instructions for the CPU to process. Different types of memory offer various trade-offs between speed, capacity, and cost.
### Types of Memory Systems:
1. **Registers:**
   - High-speed access.
   - Limited to a single word of memory.
2. **Register Files:**
   - High-speed access.
   - Very small capacity.
   - Potential for multiple ports.
3. **Static Random Access Memory (SRAM):**
   - Low latency.
   - Small capacity.
   - Expensive.
4. **Dynamic Random Access Memory (DRAM):**
   - High latency.
   - Large capacity.
   - Cheap.
5. **Synchronous DRAM (SDRAM):**
   - High latency.
   - Large capacity.
   - Supports burst operations.
   - Cheap.
## Single Ported Memory vs. Dual Ported Memory
### Single Ported Memory:
- Supports a single address for read or write operations at a time.
### Dual Ported Memory:
- **Simple Dual Port RAM:**
  - Two ports.
  - Read from one address and write to another simultaneously.
- **True Dual Port RAM:**
  - Two ports.
  - Read and write from both ports simultaneously.
- **Multi-Ported Memory:**
  - Supports more than two ports, such as reading from two ports and writing to one port simultaneously.
## Implementing a 1 KiByte Memory in Verilog
### Example Design:
A 1 KiByte memory organized as 256 × 32 bits.
```verilog
module msys1 
#(
    parameter [31:0] ADDRWIDTH = 8,
    parameter [31:0] DATAWIDTH = 32
)
(
    input clk,
    input rst,
    input we,
    input [ADDRWIDTH - 1:0] wraddr,
    input [DATAWIDTH - 1:0] wrdata,
    input [ADDRWIDTH - 1:0] rdaddr,
    output reg [DATAWIDTH - 1:0] rddata
);

    reg [DATAWIDTH - 1:0] mem[(2 ** ADDRWIDTH) - 1:0]; 
    integer i;

    always @(posedge clk) 
    begin
        if (rst) 
        begin
            `ifndef SYNTHESIS
            for (i = 0; i <= 2 ** ADDRWIDTH - 1; i = i + 1) 
                mem[i] <= i; 
            `endif
            rddata <= 0;
        end
        else 
        begin
            if (we)
                mem[wraddr] <= wrdata;
            rddata <= mem[rdaddr];
        end
    end
endmodule
```
## Testbench for the Memory System
```verilog
module tbmsys1;

    reg clk = 1'b0;
    reg rst = 1'b1;
    reg we = 1'b0;
    reg [7:0] wraddr = 8'h00;
    reg [31:0] wrdata = 32'h00000000;
    reg [7:0] rdaddr = 8'h00;
    wire [31:0] rddata;

    msys1 u1 (.clk(clk), .rst(rst), .we(we), .wraddr(wraddr), .wrdata(wrdata), .rdaddr(rdaddr), .rddata(rddata));

    initial
    begin
        $monitor("time=%t clk=%b rst=%b we=%b wraddr=%h wrdata=%h rdaddr=%h rddata=%h", $time, clk, rst, we, wraddr, wrdata, rdaddr, rddata);
        #20 rst <= 1'b0;
        #20 we <= 1'b1; wraddr <= 8'h00; wrdata <= 32'hFADED001; rdaddr <= 8'h00; 
        #20 we <= 1'b1; wraddr <= 8'h01; wrdata <= 32'h01234567; rdaddr <= 8'h00; 
        #20 we <= 1'b1; wraddr <= 8'h02; wrdata <= 32'h89ABCDEF; rdaddr <= 8'h01; 
        #20 we <= 1'b1; wraddr <= 8'h03; wrdata <= 32'h00ABBA00; rdaddr <= 8'h02; 
        #20 we <= 1'b1; wraddr <= 8'h04; wrdata <= 32'h89001574; rdaddr <= 8'h03; 
        #20 we <= 1'b1; wraddr <= 8'h00; wrdata <= 32'h00000000; rdaddr <= 8'h04; 
        #20 we <= 1'b0; wraddr <= 8'h00; wrdata <= 32'h0000DEAD; rdaddr <= 8'h00; 
        #20 we <= 1'b0; wraddr <= 8'h00; wrdata <= 32'h0000DEAD; rdaddr <= 8'h00;
        #20 $finish;
    end
    
    always #10 clk <= ~clk; 

endmodule
```
### Simulation Output:
The output shows the results of writing to and reading from the memory.
## Advanced Memory Systems
### Multi-Ported Memory Systems:
- Implementing a memory that supports two read operations at a time.
### Example Design:
Replicate the data in memory by using two memories. When writing a value, update both memories by writing the data to the same address in both memories.
```verilog
module msys2 
#(
    parameter [31:0] ADDRWIDTH = 8,
    parameter [31:0] DATAWIDTH = 32
)
(
    input clk,
    input rst,
    input we,
    input [ADDRWIDTH - 1:0] wraddr,
    input [DATAWIDTH - 1:0] wrdata,
    input [ADDRWIDTH - 1:0] rdaddr1,
    input [ADDRWIDTH - 1:0] rdaddr0,
    output reg [DATAWIDTH - 1:0] rddata1,
    output reg [DATAWIDTH - 1:0] rddata0
);

    reg [DATAWIDTH - 1:0] mem1[(2 ** ADDRWIDTH) - 1:0];
    reg [DATAWIDTH - 1:0] mem0[(2 ** ADDRWIDTH) - 1:0];
    integer i;

    always @(posedge clk) 
    begin
        if (rst) 
        begin
            `ifndef SYNTHESIS
            for (i = 0; i <= 2 ** ADDRWIDTH - 1; i = i + 1) 
            begin
                mem1[i] <= i;
                mem0[i] <= i;
            end
            `endif
            rddata1 <= 0;
            rddata0 <= 0;
        end
        else 
        begin
            if (we)
            begin
                mem1[wraddr] <= wrdata;
                mem0[wraddr] <= wrdata;
            end
            rddata1 <= mem1[rdaddr1];
            rddata0 <= mem0[rdaddr0];
        end
    end
endmodule
```

## True Dual-Port Memory
### Reference Design for a True Dual-Port RAM in Verilog
A true dual-port RAM supports two separate ports for reading and writing to memory. Each port operates independently, allowing simultaneous access to different memory locations.
### Example Design:
```verilog
module true_dpram_sclk
(
    input [7:0] data_a, data_b,
    input [5:0] addr_a, addr_b,
    input we_a, we_b, clk,
    output reg [7:0] q_a, q_b
);

    // Declare the RAM variable
    reg [7:0] ram[63:0];

    // Port A
    always @(posedge clk)
    begin
        if (we_a) 
        begin
            ram[addr_a] <= data_a;
            q_a <= data_a;
        end
        else 
        begin
            q_a <= ram[addr_a];
        end
    end

    // Port B
    always @(posedge clk)
    begin
        if (we_b)
        begin
            ram[addr_b] <= data_b;
            q_b <= data_b;
        end
        else
        begin
            q_b <= ram[addr_b];
        end
    end
endmodule
```

### Explanation:
- **Module Definition:** Defines a module with separate ports for data, address, write enable, and output.
- **RAM Declaration:** Declares a memory array to store data.
- **Port A Logic:** Handles read and write operations for port A.
- **Port B Logic:** Handles read and write operations for port B.

### Testbench for True Dual-Port RAM
```verilog
module tdprtb;

    reg [7:0] data_a, data_b;
    reg [5:0] addr_a, addr_b;
    reg we_a, we_b;
    reg clk = 1'b0;
    wire [7:0] q_a, q_b;

    true_dpram_sclk u1 (.data_a(data_a), .data_b(data_b), .addr_a(addr_a), .addr_b(addr_b), .we_a(we_a), .we_b(we_b), .clk(clk), .q_a(q_a), .q_b(q_b));

    always #10 clk <= ~clk;

    initial
    begin
        $monitor("t=%t clk=%b addr_a=%b data_a=%h we_a=%b q_a=%h addr_b=%b data_b=%h we_b=%b q_b=%h", $time, clk, addr_a, data_a, we_a, q_a, addr_b, data_b, we_b, q_b);
        
        // Test sequence
        addr_a <= 6'b000000; data_a <= 8'h01; we_a <= 1'b1;
        addr_b <= 6'b000001; data_b <= 8'h10; we_b <= 1'b1;
        #20
        
        addr_a <= 6'b000010; data_a <= 8'h02; we_a <= 1'b1;
        addr_b <= 6'b000011; data_b <= 8'h20; we_b <= 1'b1;
        #20
        
        addr_a <= 6'b000100; data_a <= 8'h04; we_a <= 1'b1;
        addr_b <= 6'b000101; data_b <= 8'h40; we_b <= 1'b1;
        #20
        
        addr_a <= 6'b000000; data_a <= 8'h20; we_a <= 1'b0;
        addr_b <= 6'b000001; data_b <= 8'h22; we_b <= 1'b0;
        #20
        
        addr_a <= 6'b000010; data_a <= 8'h00; we_a <= 1'b1;
        addr_b <= 6'b000011; data_b <= 8'h07; we_b <= 1'b1;
        #20
        
        addr_a <= 6'b000100; data_a <= 8'h00; we_a <= 1'b0;
        addr_b <= 6'b000101; data_b <= 8'h03; we_b <= 1'b0;
        #20 $finish;
    end
endmodule
```

### Explanation:
- **Initial Block:** Initializes signals and sets up a monitoring mechanism.
- **Clock Generation:** Alternates the clock signal every 10 time units.
- **Test Scenarios:** Writes and reads various data values to and from the memory.
### Simulation Output:
The output shows the results of writing to and reading from both ports of the dual-port memory.
## FIFO Queue
### FIFO Design in Verilog:
```verilog
module fifo
#(
    parameter DEPTH=8,
    parameter DATAWIDTH=32
)
(
    input clk,
    input rst,
    input [DATAWIDTH-1:0] data_in,
    input write,
    input read,
    output [DATAWIDTH-1:0] data_out,
    output reg full,
    output reg empty
);
    
    localparam ADDRWIDTH = $clog2(DEPTH);
    reg [ADDRWIDTH-1:0] rdaddr;
    reg [ADDRWIDTH-1:0] wraddr;
    reg [ADDRWIDTH-1:0] occup;
    
    msys1 #(.ADDRWIDTH(ADDRWIDTH), .DATAWIDTH(DATAWIDTH))
        u1 (.clk(clk), .rst(rst), .we(write), .wraddr(wraddr), .wrdata(data_in), .rdaddr(rdaddr),
            .rddata(data_out));

    always @(posedge clk)
    begin
        if(rst)
        begin
            rdaddr <= {ADDRWIDTH{1'b0}};  
            wraddr <= {ADDRWIDTH{1'b0}};  
            occup <= {ADDRWIDTH{1'b0}};
        end
        else
        begin
            if(write)
                wraddr <= wraddr + 1;
            if(read)
                rdaddr <= rdaddr + 1;
            if(read && !write)
                occup <= occup - 1;
            else if(!read && write)
                occup <= occup + 1;
        end 
    end

    always @(posedge clk) 
    begin
        if(rst)
        begin
            full <= 1'b0;
            empty <= 1'b1;
        end
        else
        begin
            if((occup==(DEPTH-1) & write) || (occup==(DEPTH-1) & !read) || 
                (occup==(DEPTH-2) & !read & write))
                full <= 1'b1;
            else
                full <= 1'b0;
            if((occup==0 & read) || (occup==0 & !write) || 
                (occup==1 & read & !write)) 
                empty <= 1'b1;
            else
                empty <= 1'b0;
        end
    end     
endmodule
```
### Explanation of the Code
1. **Parameters and Local Parameters**:
   - `DEPTH`: Depth of the FIFO queue.
   - `DATAWIDTH`: Width of the data in bits.
   - `ADDRWIDTH`: Width of the address bus, calculated as the logarithm base 2 of the depth (`DEPTH`).
2. **Internal Registers**:
   - `rdaddr`: Read address pointer.
   - `wraddr`: Write address pointer.
   - `occup`: Tracks the number of occupied slots in the FIFO.
3. **Instantiation of Memory System**:
   - `msys1` is instantiated to handle the memory operations. It takes the clock, reset, write enable, write address, write data, read address, and outputs the read data.
4. **Sequential Logic for Address and Occupancy Management**:
   - On reset, `rdaddr`, `wraddr`, and `occup` are set to zero.
   - On a clock edge, 
      - If write is asserted, the write address (`wraddr`) is incremented.
      - If read is asserted, the read address (`rdaddr`) is incremented.
   - `occup` is adjusted based on read and write operations to keep track of the number of items in the queue.
5. **Sequential Logic for Full and Empty Flags**:
   - On reset, `full` is set to 0 (not full) and `empty` is set to 1 (empty).
   - The `full` flag is set based on the occupancy count and write/read conditions.
   - The `empty` flag is set based on the occupancy count and read/write conditions.

> [!ChatGPT]
> The FIFO implementation is using `occup` to track the number of elements currently in the FIFO. Since `occup` represents the count of items, we need to consider how the indexing and the count relate.
> ### Re-examining the Conditions:
> 1. **`(occup == (DEPTH-1) & write)`**
>    - This checks if the FIFO is holding `DEPTH-1` items and a write operation is requested. Since the FIFO uses zero-based indexing, `DEPTH-1` is the last index, making it the condition for the FIFO being full after this write.
> 2. **`(occup == (DEPTH-1) & !read)`**
>    - This checks if the FIFO is holding `DEPTH-1` items and no read operation is happening. Without reading any data out, a subsequent write will fill the FIFO to its full capacity.
> 3. **`(occup == (DEPTH-2) & !read & write)`**
>    - This checks if the FIFO is holding `DEPTH-2` items, no read operation is happening, and a write operation is requested. Writing another item will bring the FIFO to `DEPTH-1` items, setting it up to be full with another write.
> ### Adjusting for Zero-Based Indexing:
> If we are considering zero-based indexing, the adjustments might indeed be necessary. However, the existing logic already accounts for the occupancy and ensures that the FIFO becomes full under the correct circumstances.
> Here’s a detailed breakdown considering zero-based indexing:
> - `DEPTH-1`: This refers to the index when the FIFO is almost full (one less than total capacity).
> - `DEPTH-2`: This is used to preemptively mark the FIFO as full one step before reaching full capacity with the next write operation.
> Given that zero-based indexing means that the last valid index for occupancy is `DEPTH-1`, the current conditions appear correctly designed. The key point is ensuring `full` is set correctly just before the FIFO reaches its maximum capacity:
> ### Final Thoughts:
> The conditions you initially provided are indeed correct for zero-based indexing because:
> 1. `occup == (DEPTH-1)` ensures that if we have `DEPTH-1` items and we write one more, we fill the FIFO.
> 2. `occup == (DEPTH-2)` ensures that if we have `DEPTH-2` items, we can preemptively recognize that with one more write (without a read), the FIFO will reach `DEPTH-1`.
> Thus, the conditions `(DEPTH-1)` and `(DEPTH-2)` are correctly used to ensure `full` is flagged at the right time.

### Potential Design Flaws and Corrections
1. **Reading from an Empty FIFO**:
   - Flaw: The value stored at the current address will be read even if the data is not valid, and the read address will increment, making the FIFO appear full.
   - Correction: The design should check if the FIFO is empty before reading. If the FIFO is empty, the read operation should be ignored.
2. **Writing to a Full FIFO**:
   - Flaw: The value will be stored in the next write address, and a data value that has not been read will be overwritten, making the FIFO appear empty.
   - Correction: The design should check if the FIFO is full before writing. If the FIFO is full, the write operation should be ignored.
3. **General Considerations**:
   - Ensuring that read and write operations are performed only when the FIFO is not empty or full, respectively, is crucial to maintaining data integrity.
   - There is no hardware equivalent of raising an exception; hence, designs must handle error conditions gracefully.
## Shift Registers
### Verilog Implementation of a Shift Register:
Shift registers store a sequence of values, moving data through a series of connected registers.
```verilog
module sreg1 
#(
    parameter DEPTH = 4,
    parameter DATAWIDTH = 32
)
(
    input clk,
    input rst,
    input en,
    input [DATAWIDTH - 1:0] d_in,
    output [DATAWIDTH - 1:0] d_out
);

    reg [DATAWIDTH - 1:0] mem[DEPTH - 1:0];
    integer i;

    always @(posedge clk) 
    begin
        if (rst)
        begin
            for (i = 0; i <= DEPTH - 1; i = i + 1)
                mem[i] <= 0;
        end
        else if (en)
        begin
            mem[0] <= d_in;
            for (i = 0; i < DEPTH - 1; i = i + 1)
                mem[i + 1] <= mem[i];
        end
    end

    assign d_out = mem[DEPTH - 1];
endmodule
```
### Applications of Shift Registers:
- Register chains in pipelines.
- One-hot counters.
- Linear feedback shift registers (LFSRs) for pseudo-random number generation.
- Serial interfaces (PISO and SIPO shift registers).

## One Hot Counter
### One-Hot Counter Design in Verilog
#### Code:
```verilog
module sreg_onehot 
#(
    parameter DEPTH=4
)
(
    input clk,
    input rst,
    input count_en,
    output overflow
); 

    reg [DEPTH - 1:0] mem;

    always @(posedge clk) 
    begin
        if (rst) 
        begin
            mem[DEPTH - 1:1] <= 1'b0; // All bits except the first bit must be reset
            mem[0] <= 1'b1;  // The first bit must be preset to 1
        end
        else
        begin
            if (count_en)
                mem[DEPTH - 1:0] <= {mem[DEPTH - 2:0], mem[DEPTH - 1]};
        end
    end
   
    assign overflow = mem[DEPTH - 1];

endmodule
```
### Explanation of the Code
1. **Parameters**:
   - `DEPTH`: Depth of the one-hot counter (number of bits).
2. **Internal Register**:
   - `mem`: Register array to store the one-hot value.
3. **Sequential Logic for One-Hot Counter**:
   - On reset, all bits except the first bit (`mem[0]`) are set to 0. The first bit is set to 1, initializing the one-hot counter.
   - On a clock edge, if `count_en` is asserted, the bits in `mem` are shifted left by one position. The last bit is fed back into the first position, creating a circular shift.
4. **Overflow Signal**:
   - The `overflow` signal is set to the value of the last bit (`mem[DEPTH - 1]`). This indicates an overflow condition when the one-hot counter reaches its maximum value.
### One-Hot Counter Testbench
#### Code:
```verilog
module sreg_onehot_tb 
#(
    parameter DEPTH = 4
);

    reg clk = 1'b0;
    reg rst = 1'b0;
    reg count_en = 1'b0; 
    wire overflow;

    sreg_onehot #(.DEPTH(DEPTH)) 
        u1 (.clk(clk), .rst(rst), .overflow(overflow), .count_en(count_en));

    always #10 clk <= ~clk;

    initial 
    begin
        $monitor("t=%0t clk=%b rst=%b count_en=%b overflow=%b", 
            $time, clk, rst, count_en, overflow);
        count_en <= 1'b0; rst <= 1'b1;
        #20 rst <= 1'b0; count_en <= 1'b1;
        #180 $finish;
    end

endmodule
```
### Explanation of the Testbench
1. **Testbench Parameters**:
   - `DEPTH`: Depth of the one-hot counter (number of bits).
2. **Registers and Wires**:
   - `clk`: Clock signal, toggles every 10 time units.
   - `rst`: Reset signal, used to initialize the counter.
   - `count_en`: Enable signal for the counter.
   - `overflow`: Output signal indicating an overflow condition.
3. **Clock Generation**:
   - The clock signal toggles every 10 time units, simulating a clock with a 20-time unit period.
4. **Simulation Initialization**:
   - The `initial` block initializes the signals and provides stimulus for the counter.
   - The `monitor` statement prints the values of the signals at each time step.
   - The counter is enabled after the reset is deasserted.
### Simulation Output
- The simulation output will show the state of the one-hot counter at each time step.
- The `overflow` signal will be set twice during the simulation: 
  - The first overflow occurs when the bit in the last position is shifted out and re-enters the first position.
  - The second overflow occurs after the counter cycles through all positions.
### Potential Design Flaws and Corrections
1. **No Output During Reset**:
   - Flaw: During reset, the counter outputs are not useful, as all bits except the first bit are set to 0.
   - Correction: Ensure that the reset signal is deasserted only when the counter needs to be initialized.
2. **Overflow Handling**:
   - Flaw: The `overflow` signal indicates that the counter has cycled through all positions, but there is no mechanism to handle this condition.
   - Correction: Design the system using the one-hot counter to respond appropriately to the overflow signal, such as resetting the counter or taking corrective action.
3. **Enable Signal Ignored During Reset**:
   - Flaw: The `count_en` signal is ignored during reset, which is expected behavior but may cause issues if not handled properly in the surrounding design.
   - Correction: Ensure that the reset condition is managed correctly in the overall system design to prevent unintended behavior.

## Linear Feedback Shift Registers (LFSRs)
### 4-Bit Linear Feedback Shift Register (LFSR) Design in Verilog
#### Code:
```verilog
module lfsr (
    input clk,
    input rst,
    output reg [3:0] out
);
    wire feedback;

    assign feedback = ~(out[3] ^ out[2]);

    always @(posedge clk or posedge rst)
    begin
        if (rst)
            out <= 4'b1; // Initialize to a non-zero value
        else
            out <= {out[2:0], feedback};
    end
endmodule
```
### Explanation of the Code
1. **Inputs and Outputs**:
   - `clk`: Clock signal.
   - `rst`: Reset signal.
   - `out`: 4-bit output representing the current state of the LFSR.
2. **Feedback Calculation**:
   - `feedback`: A wire that calculates the feedback value using an XOR operation on the two most significant bits of `out` (`out[3]` and `out[2]`). The feedback is inverted to create a maximal length LFSR.
3. **Sequential Logic for LFSR**:
   - On reset, `out` is initialized to a non-zero value (`4'b1`) to ensure that the LFSR does not get stuck in a zero state.
   - On each clock edge, the value of `out` is shifted left by one position, and the feedback value is inserted into the least significant bit position.
### 4-Bit LFSR Testbench
#### Code:
```verilog
module lfsr_tb;
    reg clk = 1'b0;
    reg rst = 1'b1;
    wire [3:0] out;

    lfsr u1 (.clk(clk), .rst(rst), .out(out));

    always #10 clk <= ~clk;

    initial
    begin
        $monitor("t=%0t clk=%b rst=%b out=%b", $time, clk, rst, out);
        #20 rst <= 1'b0;
        #360 $finish;
    end
endmodule
```
### Explanation of the Testbench
1. **Registers and Wires**:
   - `clk`: Clock signal, toggles every 10 time units.
   - `rst`: Reset signal, used to initialize the LFSR.
   - `out`: 4-bit output of the LFSR module.
2. **Clock Generation**:
   - The clock signal toggles every 10 time units, simulating a clock with a 20-time unit period.
3. **Simulation Initialization**:
   - The `initial` block initializes the signals and provides stimulus for the LFSR.
   - The `monitor` statement prints the values of the signals at each time step.
   - The reset signal is deasserted after 20 time units to allow the LFSR to start shifting.
### Simulation Output
- The simulation output will show the state of the LFSR at each time step.
- The `out` signal will go through a pseudo-random sequence of 15 different values before repeating, demonstrating a maximal length LFSR.
### Potential Design Flaws and Corrections
1. **Initialization to Non-Zero Value**:
   - Flaw: If the LFSR is initialized to zero, it will remain in the zero state indefinitely.
   - Correction: Ensure that the LFSR is initialized to a non-zero value on reset.
2. **Feedback Calculation**:
   - Flaw: Incorrect feedback calculation can result in non-maximal length sequences or stuck states.
   - Correction: Verify that the feedback calculation is correct and that it generates a maximal length sequence for the given LFSR configuration.
3. **Handling of Edge Cases**:
   - Flaw: The LFSR might not handle all edge cases, such as incorrect reset behavior or unexpected input conditions.
   - Correction: Ensure thorough testing of the LFSR under various conditions to verify its robustness.
### Applications of LFSRs
- **Pseudo-Random Number Generation**: LFSRs are often used to generate pseudo-random sequences of bits that can be used as random numbers in testing and simulation.
- **Error Detection and Correction**: LFSRs are used in CRC (Cyclic Redundancy Check) algorithms to detect errors in data transmission.
- **Scrambling and Descrambling**: LFSRs are used in communication systems to scramble and descramble data to reduce patterns and improve signal quality.
# Performance Analysis
## Introduction to Performance Analysis
Performance analysis involves evaluating how well a system or component performs by measuring and analyzing various parameters. This analysis is essential for optimizing and improving system efficiency.
### Key Concepts:
- **Performance:** Work done over time.
- **Performance Improvement:** Achieved by completing more work in the same time or the same work in less time.
## Benchmarking Performance
Benchmarking involves running a set of standard tests to evaluate the performance of a system. Benchmarks provide a consistent way to measure and compare performance across different systems.
### Work Measurements and Performance Metrics:
- **Clock Cycles:** Measured by clock frequency.
- **Instructions:** Measured by MIPS (Millions of Instructions Per Second) and FLOPS (Floating Point Operations Per Second).
- **Synthetic Programs:** Examples include Whetstone and Dhrystone (D-MIPS).
- **Real Programs:** Examples include SPEC (Standard Performance Evaluation Corporation) and EEMBC (Embedded Microprocessor Benchmark Consortium).
## Historical Benchmarks
### MIPS:
- Not all instructions are created equal.
- CISC computers may outperform RISC computers with the same MIPS.
### Whetstone:
- First general-purpose benchmark for assessing system performance.
- Developed by H. J. Curnow and B. A. Wichmann.
### Dhrystone:
- A pun on Whetstone.
- Evaluates MIPS using a Dhrystone mix of instructions.
## Effectiveness of Historical Benchmarks
Historical benchmarks were effective until hardware designers optimized systems specifically for these benchmarks. This led to benchmarks becoming less representative of real-world performance, especially as cache memories expanded.
## SPEC Benchmarks
### Mission Statement:
"To establish, maintain, and endorse a standardized set of relevant benchmarks and metrics for performance evaluation of modern computer systems."
SPEC benchmarks are highly respected and accurate predictions of real-world performance for desktop PCs and servers.
### Applications:
- Integer computations
- Floating-point computations
- Web servers
[More information at SPEC's website](https://www.spec.org)
## EEMBC Benchmarks
EEMBC benchmarks are designed to evaluate embedded systems' performance, such as smartphones, tablets, network devices, and IoT devices.
### Applications:
- Office automation systems
- Consumer entertainment systems
- Telephony systems
- Networking systems
- Automotive systems
- Energy efficiency measurements
[More information at EEMBC's website](https://www.eembc.org)
## Speedup Calculations
Speedup measures the performance improvement of a modified system relative to the original system.
### Formulas:
- Speedup = (Performance of New System) / (Performance of Old System)
- Speedup = (Execution Time of Old System) / (Execution Time of New System)
## Example of a Speedup Calculation
### Example:
- Dell PowerEdge R540 (Intel Xeon Silver 4210R 2.40 GHz) with SPEC CPU 2017 benchmark base result of 125.
- Dell PowerEdge MX740c (Intel Xeon Gold 6240R 2.4 GHz) with SPEC CPU 2017 benchmark base result of 256.
**Speedup Calculation:**
Speedup = 256 / 125 = 2.048
## Measuring Relative Performance
### Bigger Than Measures:
- $\text{Performance Increase} = \frac{\text{New Performance} - \text{Old Performance}}{\text{Old Performance}} \times 100 \%$
### Smaller Than Measures:
- $\text{Performance Decrease} = \frac{\text{Old Performance} - \text{New Performance}}{\text{New Performance}} \times 100 \%$
## Converting Between Relative Performance Measures
### Example:
- System A is 10% bigger than System B.
- System B is 9.09% smaller than System A.
### Calculation:
1. Let System B be 1.
2. $\text{System A} = 1.10 \times \text{System B} = 1.10$
3. $\text{System B} = \frac{1}{1.10} = 0.909$
4. $\text{Percentage Decrease} = \frac{1 - 0.909}{1} \times 100\% = 9.09\%$
## Investment Analogy
### Example:
- Initial investment of $1000.
- 10% decrease: $900.
- 10% increase: $990.
Misunderstanding relative performance can lead to financial loss, similar to incorrect investment strategies.
## Processor Performance Comparison
### Example:
- AMD Athlon (1.1 GHz) with SPECint benchmark of 409.
- Fujitsu SPARC64 (675 MHz) with SPECint benchmark of 443.
### Analysis:
- Fujitsu SPARC64 executes 20% more instructions due to simpler RISC instructions.
- SPECint benchmarks indicate higher performance for Fujitsu SPARC64.
## Effect of Instruction Set on Performance
Analyzing the impact of different instruction sets on performance can reveal the benefits of new instructions.
### Example Instruction Mix:
- **ADD:** 15% usage, CPI = 0.8
- **MUL:** 5% usage, CPI = 1.2
- **Other:** 80% usage, CPI = 1.0 

$$
\text{CPI}_{\text{Average}} = 0.15 \times 0.8 + 0.05 \times 1.2 + 0.8 \times 1.0 = 0.98
$$

### Introducing a MAC Instruction:
- Replaces one MUL and one ADD.
- Expected to replace half of the MUL operations.
- **Options:**
  - No change.
  - Add MAC with CPI = MUL, clock period +20%.
  - Add MAC with CPI = 1.5 × MUL, same clock period.

$$
\text{Cycles}_1 = 15 \times 0.8 + 5 \times 1.2 + 80 \times 1.0 = 98
$$

$$
\text{Cycles}_2 = (0+2.5) \times 1.2 + (15-2.5) \times 0.8 + (5-2.5) \times 1.2 + 80 \times 1.0 = 96
$$

$$
\text{Cycles}_3 = (0+2.5) \times 1.8 + (15-2.5) \times 0.8 + (5-2.5) \times 1.2 + 80 \times 1.0 = 97.5
$$

Option 3 offers the highest performance.
## Introducing a MAC Instruction
### Options:
1. No change to the instruction set.
2. Add MAC with a CPI equivalent to MUL, increasing clock period by 20%.
3. Add MAC with 50% greater CPI than MUL using the same clock period.
### Performance Analysis:
- Calculate number of clock cycles and performance for each option.
- Determine best option based on performance metrics.
## Time to Market and Performance
### Exponential Growth Model: 
$$
P(t) = P(0) \times n^{(t/k)}
$$
where $P$ increases by a factor of $n$ every $k$ units of time.
### Example:
- Performance doubles every 18 months.
- Optimization improves performance by 7%.
### Calculation:
- Solve for $t$ to determine if the optimization delay is worthwhile.
## Conclusion
Performance analysis involves understanding various metrics and benchmarks, comparing relative performance, and considering time-to-market effects. Accurate benchmarking and speedup calculations are essential for making informed decisions about system improvements and optimizations.






# Timing Analysis
## Introduction to Timing Analysis
Timing analysis is crucial in hardware design to ensure that all signal paths within a circuit meet the required timing constraints. It involves examining the delays and synchronization of signals to prevent data corruption and ensure correct operation.
### Key Concepts:
- **Timing Budget:** The maximum allowable time for a signal to propagate through a circuit path.
- **Critical Path:** The longest signal path that determines the maximum operating frequency of the circuit.
## Types of Signal Paths
1. **Paths from Inputs to Register Inputs**
2. **Paths from Register Outputs to Register Inputs**
3. **Paths from Register Outputs to Outputs**
Each path type needs to be analyzed to ensure the timing budget is satisfied.
## Timing Path Visualization
A typical timing path starts at the output of a register and ends at the input of another register. All timing paths must be checked to ensure that the timing constraints are met.
## Timing Budget Components
### Factors to Consider:
1. **Logic Delays**
2. **Propagation Delays**
3. **Clock Skew**
4. **Clock Jitter**
5. **Setup Time**
6. **Hold Time**
7. **Margin Time**
Only logic delays and propagation delays can be optimized by the designer. The rest depend on the clock signals, registers, and system specifications.
## Critical Paths
- **Always Present:** Every circuit has a longest path.
- **Multiple Critical Paths:** Possible if several paths have equal delays.
- **Changing Critical Paths:** Optimization can shift which path is the critical one.
- **Near-Critical Paths:** Should also be optimized to avoid becoming critical after changes.
## Fan-In and Fan-Out
### Definitions:
- **Fan-In:** Number of signal paths leading to the inputs of a gate.
- **Fan-Out:** Number of signal paths leading from the outputs of a gate.
## Fan-In Types
### Immediate Fan-In:
- Measures input signals directly attached to the gate.
- Useful for power analysis and estimating current flow into the gate.
### Transitive Fan-In:
- Measures all input signal paths influencing the gate in the current clock period.
- Useful for timing analysis to determine the critical path.
## Fan-In Example
Consider a circuit where the fan-in of gate `or2` includes all signal paths leading to it.
### Immediate Fan-In:
- Directly attached signals (e.g., `w6` and `w7`).
### Transitive Fan-In:
- All signal paths from inputs or register outputs leading to `or2`.
## Fan-Out Types
### Immediate Fan-Out:
- Measures output signals directly attached to the gate.
- Useful for power analysis and estimating current sourced by the gate.
### Transitive Fan-Out:
- Measures all output signal paths influencing other gates in the current clock period.
- Useful for timing analysis to determine the critical path.
## Fan-Out Example
Consider a circuit where the fan-out of input `c` includes all signal paths influenced by `c`.
### Immediate Fan-Out:
- Directly influenced signals (e.g., `c`).
### Transitive Fan-Out:
- All signal paths from `c` to register inputs or outputs.
## Understanding Clock Timing
### Clock Skew:
- Difference in arrival times of the clock signal at different points in the circuit.
- Caused by wirelength differences and parasitic effects.
- Minimized using a clock tree to create similar path lengths.
### Clock Jitter:
- Small deviations in clock signal arrival times.
- Caused by PLL loop noise, power supply fluctuations, thermal noise, manufacturing variations, and crosstalk.
### Accounting for Skew and Jitter:
- Subtract worst-case clock skew and jitter from the clock period to calculate the usable clock period.
## Clock-to-Q Delays, Setup Times, and Hold Times
### Definitions:
- **Clock-to-Q Delay (tCO):** Time after a clock edge or enable signal when the output is stable.
- **Setup Time (tS):** Minimum time data must be stable before the clock edge.
- **Hold Time (tH):** Minimum time data must be stable after the clock edge.
## Metastability
### Definition:
- Occurs when setup and hold times are violated, leading to unpredictable output states.
## False Paths
### Definition:
- Timing paths where an edge cannot travel from start to end.
### Detection:
- Examine propagation of transitions along the path to determine if it affects the output.
### Examples:
- Paths blocked by multiplexers or controlling inputs (AND gate stuck at 0, OR gate stuck at 1).
## Multicycle Paths
### Definition:
- Paths where more than one clock period is allowed without affecting design behavior.
- Synthesis tools must be instructed to ignore these paths during timing analysis.
## Static Timing Analysis (STA)
### Purpose:
- Validates timing of a design by checking all possible paths for timing violations.
### Requirements:
- Desired timing budget.
- Identification of false and multicycle paths.
- Specific timing constraints.
### STA vs. Timing Simulation:
- **STA:** Quick, identifies timing violations, determines slack time, does not guarantee correct behavior.
- **Timing Simulation:** Verifies timing and functionality, identifies glitches, requires inputs, significant processing time.
## Asynchronous Feedback
### Challenges:
- Introducing asynchronous feedback can complicate timing analysis and simulation.
- Critical paths through combinational loops must be ignored to avoid infinite loops.
### Example Circuit:
- Input register with asynchronous feedback through XOR gates.
- Simulation must represent outputs as unknown (X) if stable states are not guaranteed.
## Practical Considerations
### Usage:
- Asynchronous design elements, including combinational loops, are rarely used.
- Timing simulation necessary to analyze outputs of asynchronous designs.
### Wiring Delays:
- Significant in FPGA designs.
- Dominated by resistance and capacitance.
- Approximated using models due to complexity.
# Elmore Delay Model
## Introduction to Delay Models
Delay models are used to approximate the delays in a circuit, aiding in determining the critical path and optimizing performance. Simple gate delay models assign a fixed delay to each gate type, providing a straightforward method for estimating circuit timing.
### Examples of Simple Gate Delay Model:
- **Inverters:** 2 time units
- **AND/OR Gates:** 4 time units
- **XOR Gates:** 6 time units
## Pros and Cons of Simple Gate Delay Model
### Pros:
- Easy estimation of circuit timing.
- Useful for relative performance comparisons.
- Efficient timing analysis.
### Cons:
- Neglects wiring delays, which can be significant.
- Ignores the fan-out of gates.
## Delay Calculations
### Example Circuit Analysis:
Consider a circuit where gate delays are:
- **Inverter:** 2 ns
- **AND/OR Gate:** 4 ns
### Delay Calculations:
- **Delay from a to x:** 2 ns + 4 ns + 4 ns + 4 ns = 14 ns
- **Delay from b to x:** Max(4 ns + 4 ns + 4 ns, 4 ns + 2 ns + 4 ns + 4 ns) = 14 ns
- **Delay from c to x:** Max(4 ns + 2 ns + 4 ns + 4 ns, 4 ns + 4 ns) = 14 ns
## Removing False Paths
False paths are paths that do not affect the output timing and should be removed for accurate timing analysis. Identifying and eliminating false paths can improve performance estimates.
## Signal Transitions
Signal transitions are not ideal; they can be modeled as an RC network, requiring complex partial differential equations to solve. If the time constant (τ) is too large, signals may not reach the threshold for transitioning between logic states.
## Analysis of Simple RC Networks
### Time Constant (τ):
- Represents the time required to charge a capacitor to approximately 63% of its final value.
- Calculated as $\tau = R \cdot C$.
### RC Network Example:
- For a given resistor (R) and capacitor (C), the voltage across the capacitor ($V_C$) at time $t = RC$ is approximately $0.63 \times V_{SRC}$.
## The Elmore Delay Model
The Elmore Delay Model simplifies delay estimation through RC networks by avoiding complex differential equations.
### Steps to Use Elmore Delay Model:
1. Redraw the circuit as an RC network.
2. Replace wire segments with series resistors and capacitors to ground.
### Example:
- A net with 5 wire segments connecting an input to three AND gates can be modeled with resistors and capacitors for each segment.
## Computing Delay in Elmore Delay Model
### Delay Calculation:
- **For Resistor R_i:** Consider all downstream capacitances since R_i must charge/discharge all downstream capacitances.
- **Node Delay:** Sum all time delays to the node, considering the fan-out.
### Elmore Resistance:
- **Definition:** Sum of resistances on the path to Node i that are also on the path to Node k.
- **Calculation:** Sum of common resistances to both nodes.
### Example:
- For a path from V_x to V_5, calculate the delay considering all intermediate resistances and capacitances.
## Speed Grading / Speed Binning
### Process:
- Chips are tested to determine maximum reliable clock frequency.
- Variations in performance lead to different speed grades.
- Higher speed grade chips are more expensive due to better performance.
## Derating Factors
### Definition:
- Adjust timing to account for voltage and temperature fluctuations.
- **Temperature Effects:** Higher junction temperatures increase delays.
- **Voltage Effects:** Higher supply voltages decrease delays.
### Example:
- Actel Act 3 FPGA derating factors:
  - **1.17** at 125°C and 4.5 V
  - **1.00** at 70°C and 5.0 V
  - **0.63** at -55°C and 5.5 V
## Practical Application of Elmore Delay Model
### Example Calculation:
- Consider a path from the input to Node 7 or Node 5 in a given RC network.
- Calculate delays by summing the contributions of each resistor and capacitor along the path.
## Conclusion
The Elmore Delay Model provides a practical approach to estimating delays in complex RC networks without solving differential equations. Understanding and applying this model helps in designing efficient and optimized hardware systems by accurately predicting signal delays and timing behavior.

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
    % Draw components
    \draw (0,0) to[R=$R_1$] (2,0) node[above left] {1} -- (2,0) to[C=$C_1$] (2,-1) node[ground] {};
    \draw (2,0) to[R=$R_2$] (5,0) node[above left] {2} -- (5,0) to[C=$C_2$] (5,-1) node[ground] {};
    \draw (5,0) to[R=$R_5$] (7,0) node[above left] {5} -- (7,0) to[C=$C_5$] (7,-1) node[ground] {};
    \draw (2,0) -- (2.5,3.5) to[R=$R_3$] (4.5,3.5) node[above left] {3} -- (4.5,3.5) to[C=$C_3$] (4.5,2.5) node[ground] {};
    \draw (5,0) -- (6,3.5) to[R=$R_4$] (8,3.5) node[above left] {4} -- (8,3.5) to[C=$C_4$] (8,2.5) node[ground] {};
    % Draw voltage source
    \draw (0,0) to[short,-o] (0,0) node[left] {$V_x$};
\end{circuitikz}
\end{document}
```


![[Pasted image 20240803190553.png]]


```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
    % Draw components
    \draw (0,0) to[R=$R_1$] (3,0) node[above left] {1} -- (2,0) to[C=$C_1$] (2,-1) node[ground] {};
    \draw (3,0) to[R=$R_2$] (5,0) node[above left] {2} -- (5,0) to[C=$C_2$] (5,-1) node[ground] {};
    \draw (5,0) to[R=$R_5$] (8,0) node[above left] {5} -- (8,0) to[C=$C_5$] (8,-1) node[ground] {};
    \draw (8,0) to[R=$R_5$] (11,0) node[above left] {5} -- (11,0) to[C=$C_5$] (11,-1) node[ground] {};
    
    \draw (2,0) -- (3,3) to[R=$R_3$] (5,3) node[above left] {3} -- (5,3) to[C=$C_3$] (7,2) node[ground] {};
    \draw (5,0) -- (6,3.5) to[R=$R_4$] (8,3.5) node[above left] {4} -- (8,3.5) to[C=$C_4$] (8,2.5) node[ground] {};
	\draw (5,0) -- (6,3.5) to[R=$R_4$] (8,3.5) node[above left] {4} -- (8,3.5) to[C=$C_4$] (8,2.5) node[ground] {};

	\draw (5,0) -- (6,3.5) to[R=$R_4$] (8,3.5) node[above left] {4} -- (8,3.5) to[C=$C_4$] (8,2.5) node[ground] {};
    
    % Draw voltage source
    \draw (0,0) to[short,-o] (0,0) node[left] {$V_x$};
\end{circuitikz}
\end{document}
```
# Power Analysis and Power Aware Design

## Introduction to Power and Energy Consumption
Increasingly, power and energy consumption are crucial considerations in digital design due to their impact on heat, noise, costs, and battery life.
### Key Differences:
- **Power:** Measures work per unit time (Watts).
- **Energy:** Measures total work done (Joules or Watt-hours).
### Importance:
- **High Power Consumption:**
  - Excess heat and noise production.
  - Requires active cooling.
- **High Energy Consumption:**
  - Increased operational costs.
  - Reduced battery life in mobile devices.
## Power and Energy Consumption
### Power Consumption:
- Expressed in Watts (Joules per second).
- Reducing power benefits:
  - Less heat production.
  - Enables passive cooling.
  - Smaller devices.
  - Devices can be located further from power sources.
### Energy Consumption:
- Expressed in Joules or Watt-hours.
- Reducing energy benefits:
  - Lower operational costs.
  - Less frequent charging for mobile devices.
## Global Energy Production (2019)
### Sources and Percentages:
- **Coal:** 36.7%
- **Natural Gas:** 23.5%
- **Hydroelectric:** 16.0%
- **Nuclear:** 10.3%
- **Wind:** 5.3%
- **Oil:** 2.8%
- **Solar PV:** 2.5%
- **Biofuels:** 2.0%
- **Others:** <2%
### Data Centers:
- Account for approximately 1% of global electricity consumption.
- Significant CO2 emissions due to reliance on coal.
## Units of Energy and Power
### Energy:
- Measured in Joules (J).
- 1 Joule = 1 Watt-second.
### Power:
- Measured in Watts (W).
- 1 Watt = 1 Joule per second.
### Capacitors:
- Store energy measured in Farads (F).
- SI units for capacitors: $1F = 1 \frac{s^4 A^2}{m^2 kg}$.
## Battery Capacities
### Measurement:
- Typically in milliampere-hours (mAh).
- Energy storage relates to battery voltage and current draw.
### Example:
- A 3000 mAh battery with a device drawing 100 mA lasts for 30 hours.
## Battery Life Calculation Example
### Given:
- Laptop consumes 60W.
- Battery: 10V, 2.5Ah.
- CPU runs at 3GHz, CPI = 1.0.
### Steps:
1. Calculate energy stored: $E = V \times \text{Capacity} = 10V \times 2.5Ah = 25Wh$.
2. Calculate energy used per simulation step.
3. Determine the number of simulation steps per charge.
### Power Saving Mode:
- Reducing clock speed to 1.5GHz, power consumption drops to 15W.
- Calculation shows increased battery life.
## Power Consumption and Processor Throttling
Power Aware Designs: These are designs that will have the functionality to dynamically reduce clock speeds to prevent heat production, and while such an act might reduce performance, but the performance reduction happens when there's  excessive heat production which the system tends towards when left uncontrolled.
**Processor throttling is the process of reducing clock speeds within a processor to reduce heat production.**
### Dynamic Power:
- Switching power: Power consumed when signals switch ***(Useful)***.
- Short circuit power: Power loss during transistor state transitions ***(Useless, and needs to be minimized)***.
> In a typical high speed digital design, fewer than $20\%$ of all signals switch during a clock cycle.

> [!ChatGPT]
> ### Activity Factor in Detail
> The activity factor is a crucial concept in power-aware design, particularly in the context of dynamic power consumption. It measures how frequently a signal changes its value within a circuit and is a key determinant of the power consumed by switching activities. 
> #### Definition of Activity Factor
> The activity factor ($\alpha$) is defined as the average number of transitions per clock cycle for a signal. It is a measure of how often the signal toggles between logic levels (0 and 1).
> 
$$
\alpha = \frac{\text{Number of transitions}}{\text{Total number of clock cycles}}
$$

> #### Importance of Activity Factor
> - **Dynamic Power Consumption**: The dynamic power consumed by a circuit is directly proportional to the activity factor. Higher activity factors lead to higher dynamic power consumption.
>   
$$
P_{switching} =0.5\cdot \alpha \cdot C \cdot V^2 \cdot f
$$
 
$$
P_{short circuit}=\alpha \cdot f \cdot t_{short} \cdot I_{short} \cdot V_{supply}
$$
  
$$
P_{dynamic}=P_{switching} + P_{short circuit}
$$

>   Where:
>   - $P_{dynamic}$ is the dynamic power consumption.
>   - $\alpha$ is the activity factor.
>   - $C$ is the capacitance being switched.
>   - $V$ is the supply voltage.
>   - 
>   - $f$ is the Clock Speed.
> - **Design Optimization**: Understanding and controlling the activity factor can help in optimizing the design for power efficiency. Reducing unnecessary signal transitions can significantly lower the power consumption.
> #### Factors Influencing Activity Factor
> 1. **Signal Toggle Rate**: The rate at which signals change their state. Signals that toggle frequently have higher activity factors.
> 2. **Circuit Design**: The architecture and logic design of a circuit can influence the activity factor. Efficient designs minimize unnecessary transitions.
> 3. **Input Patterns**: The nature of the input data can affect how often signals toggle. Certain input patterns may cause more frequent transitions.
> 4. **Glitches**: Unwanted transitions (glitches) in the circuit increase the activity factor. Glitches are often caused by differences in signal path delays.
> #### Techniques to Reduce Activity Factor
> 1. **Clock Gating**: Disabling the clock for inactive parts of the circuit reduces unnecessary transitions.
> 2. **Data Encoding**: Techniques like Gray coding or one-hot encoding can reduce the number of bit changes in data buses, thus lowering the activity factor.
> 3. **Glitch Reduction**: Adding buffers or using balanced paths can reduce glitches and unnecessary transitions.
> 4. **Power Gating**: Shutting down entire sections of the circuit when not in use can effectively reduce the activity factor to zero for those sections.
> 5. **Redundant Logic**: Introducing redundant logic to stabilize signal transitions and avoid glitches.
> #### Practical Example of Activity Factor Calculation
> Consider a signal that transitions 1000 times in a period of 2000 clock cycles. The activity factor for this signal would be: 
$$
\alpha = \frac{1000}{2000} = 0.5
$$
This means that on average, the signal changes its value once every two clock cycles.
> #### Impact on Power Consumption
> If we consider a circuit with a capacitance of 10 pF, a supply voltage of 1.2 V, and a frequency of 1 GHz, the dynamic power consumption can be calculated as: 
$$
P_{dynamic} = \alpha \cdot C \cdot V^2 \cdot f
$$

$$
P_{dynamic} = 0.5 \cdot 10 \times 10^{-12} \cdot (1.2)^2 \cdot 10^9
$$

$$
P_{dynamic} = 0.5 \cdot 10 \cdot 1.44 \cdot 10^{-3}
$$

$$
P_{dynamic} = 7.2 \text{ mW}
$$
By reducing the activity factor, significant power savings can be achieved.
> #### Conclusion
> The activity factor is a fundamental parameter in dynamic power consumption, and its management is vital for designing power-efficient circuits. By employing techniques to minimize unnecessary transitions and glitches, designers can optimize the power consumption of digital systems, enhancing their overall efficiency and performance.

### Static Power:
- Leakage power: Current leakage through transistors.
	- Increases with temperature and lower threshold voltage.
### Total Power: 
$$
P_{\text{Total}} = P_{\text{Dynamic}} + P_{\text{Static}}
$$

## Power Reduction Techniques
### Analog Techniques:
1. **Dual VSupply:** High and low supply voltages.
2. **Dual VThreshold:** High and low threshold voltages.
3. **Exotic Circuits:** Specialized high-frequency, low-power circuits.
4. **Adiabatic Circuits:** Consume power only on specific transitions.
5. **Clock Trees:** Efficient clock signal routing.
### Digital Techniques:
1. **Multiple Clocks:** Different speeds for different parts of the circuit.
2. **Clock Gating:** Turning off the clock when not needed.
3. **Data Encoding:** Techniques like Gray coding to reduce activity.
4. **Glitch Reduction:** Remove unnecessary transitions.
5. **Asynchronous Circuits:** Reduce clock dependencies.
## Reducing Supply Voltage
### Benefits:
- Reduces dynamic power.
- Significant power savings by lowering $V_{\text{Supply}}$.
### Trade-offs:
- Reduced noise margins.
- Increased susceptibility to reliability issues.
- Increased delay in circuit operations.
### Example Calculation:
- Delay increases with lower supply voltage.
- $\text{New Delay} = \text{Old Delay} \times \left( \frac{V_{\text{Old}} - V_{\text{Threshold}}}{V_{\text{New}} - V_{\text{Threshold}}} \right)$.
## Reducing Threshold Voltage
### Benefits:
- Compensates for performance loss due to lower supply voltage.
### Trade-offs:
- Increases static power due to leakage.
- Balance between dynamic and static power is essential.
## Clock Gating
### Benefits:
- Reduces power by minimizing unnecessary clock transitions.
- Can significantly lower the activity factor.
### Trade-offs:
- Introduces additional delays and design complexity.
- Increased clock skew and potential reliability issues.
## Pipelining and Parallelism for Energy Efficiency
### Benefits:
- Improve performance, which can be traded for power reductions.
- Replicating circuits for parallelism can enable lower supply voltages.
### Concept:
- Increased performance allows for voltage reduction, yielding power savings.
## Summary
Power analysis and power-aware design are essential for optimizing digital circuits. By understanding and applying various techniques to manage dynamic and static power, designers can create efficient and sustainable electronic systems. Balancing performance with power consumption requires careful consideration of supply and threshold voltages, activity factors, and effective use of power reduction strategies.

# Fault Detection
## Introduction to Fault Detection
Fault detection in digital circuits is essential to ensure that manufactured designs function correctly as intended. Faults are manufacturing defects that may cause a circuit to malfunction. The process of verifying the functionality of circuits involves various methods of testing and analysis.
### Key Concepts:
- **Faults:** Manufacturing defects causing incorrect behavior.
- **Testing:** Checking that manufactured designs work as predicted.
- **Burn-In:** Subjecting chips to extreme conditions to accelerate failure of defective components.
## Fault Terminology
### Types of Faults:
- **Good Wires, Shorted Wires, Open Wires:** Depictions of different wiring conditions in circuits.
- **Burn-In Process:** Accelerates the failure of defective wires to ensure reliability in customers' designs.
### Causes of Faults:
- **Fabrication Issues:** Design flaws, chemical impurities, dust.
- **Manufacturing Issues:** Handling errors, material failures (e.g., corrosion, cracking).
## The Economics of Testing
Testing involves a trade-off between cost and reliability. While testing cannot identify all potential faults, it ensures a tolerable level of faulty chips for customers. Mission-critical systems require higher reliability.
### Considerations:
- **Cost vs. Faulty Chips Replacement:** Balancing testing costs with potential replacements.
- **Customer Tolerance:** Varies based on application.
## Types of Physical Faults
### Examples:
- Short circuits, open circuits, and incorrect connections.
## Detecting Faults
Fault detection involves comparing the actual output of a circuit with the expected output using test vectors.
### Test Vectors:
- Sets of inputs used to detect faults.
- Selecting appropriate test vectors is crucial for effective fault detection.
## Test Vector Selection
### Example:
For a given circuit, determine the test vectors that detect faults by comparing expected outputs for good and faulty circuits.
### Steps:
1. Compute expected outputs for both circuits.
2. Identify test vectors where outputs differ.
## Simple Algorithm for Generating Test Vectors
1. **Compute Karnaugh Map** for the good circuit.
2. **Compute Karnaugh Map** for the faulty circuit.
3. **Find Region of Output Disagreement.**
4. **Select Test Vectors** from the region of disagreement.
This algorithm works for combinational circuits and can be extended to RTL designs between register stages.
## Detecting vs. Diagnosing Faults
### Detection:
- Identifies faulty chips.
- Protects consumers from purchasing faulty products.
### Diagnosis:
- Identifies specific faults for correction.
- Often requires physical inspection of failed chips.
## Redundant and Irredundant Circuits
### Redundant Circuits:
- Have gates that can be removed without affecting functionality.
- Used to prevent glitches.
### Irredundant Circuits:
- No gates can be removed without affecting functionality.
- Removing any gate changes the output.
## Timing Hazards
### Types:
1. **Static Hazards:** Temporary glitches causing multiple transitions before stabilizing.
2. **Dynamic Hazards:** Multiple transitions before stabilizing to a new value.
### Example: Adding redundancy can eliminate static hazards.
## Undetectable Faults
Some faults cannot be detected:
- **Redundant Circuits:** Single stuck-at faults may go undetected.
- **Masking Effects:** Different faults can mask the presence of specific faults.
### Example:
A circuit with an undetectable fault at L1 shows identical outputs for correct and faulty states.
## Fault Domination and Fault Equivalence
### Fault Domination:
- Fault f1 dominates fault f2 if any test vector detecting f1 also detects f2.
- Dominated faults can be ignored if the dominant fault is tested.
### Fault Equivalence:
- Faults f1 and f2 are equivalent if detected by the same test vectors.
- One fault can be ignored if the other is tested.
## Gate Collapsing
Controlling inputs can simplify fault detection by collapsing multiple faults into a single testable fault.
### Example:
Detecting a fault at a gate output also detects all input faults in the collapsible set.
## Fault Coverage
Fault coverage is the percentage of detectable faults identified by a set of test vectors. It can be defined based on detectable faults or all possible faults.
### Formula: 
$$
\text{Fault Coverage} = \frac{\text{Number of Detected Faults}}{\text{Total Number of Detectable Faults}} \times 100\%
$$

## Testing Chips
### Scan Chain Testing:
- Uses existing registers to create scan chains for loading test vectors and recording outputs.
- Examines internal behavior of pipeline stages.
### Boundary Scan Testing:
- Adds new scan chain registers at the periphery.
- Less invasive and supported by industry standards (e.g., JTAG).
## Built-In Self-Test (BIST) Circuitry
### BIST:
- Circuit tests itself using linear feedback shift registers (LFSRs).
- Generates pseudo-random test vectors.
### Advantages of LFSRs:
- Less area than counters.
- Generates uncorrelated test vectors, more likely to detect slow paths.