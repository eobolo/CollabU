C:\Users\Excel\Desktop\Python>iverilog -o product_manager.vvp product_manager.v
product_manager.v:117: error: Enable of unknown task ``return''.
1 error(s) during elaboration.

    
    
    
    
    module production_cycle (
    input wire clk,             // Clock signal
    input wire reset,           // Reset signal
    output reg [31:0] total_time, // Total production time
    output reg valid_input,     // Flag for valid input
    output reg cycle_detected   // Flag for circular dependencies
);

    parameter NUM_PRODUCTS = 6;

    // Production times for products (encoded as individual parameters)
    parameter [31:0] PRODUCTION_TIME_0 = 10;
    parameter [31:0] PRODUCTION_TIME_1 = 5;
    parameter [31:0] PRODUCTION_TIME_2 = 7;
    parameter [31:0] PRODUCTION_TIME_3 = 3;
    parameter [31:0] PRODUCTION_TIME_4 = 8;
    parameter [31:0] PRODUCTION_TIME_5 = 4;

    // Dependencies represented as packed arrays (1 bit per dependency)
    parameter [NUM_PRODUCTS-1:0] DEPENDENCY_0 = 6'b000000;
    parameter [NUM_PRODUCTS-1:0] DEPENDENCY_1 = 6'b000001;
    parameter [NUM_PRODUCTS-1:0] DEPENDENCY_2 = 6'b000001;
    parameter [NUM_PRODUCTS-1:0] DEPENDENCY_3 = 6'b000110;
    parameter [NUM_PRODUCTS-1:0] DEPENDENCY_4 = 6'b001000;
    parameter [NUM_PRODUCTS-1:0] DEPENDENCY_5 = 6'b010000;

    // Array to store production times
    reg [31:0] production_times[NUM_PRODUCTS-1:0];
    reg [NUM_PRODUCTS-1:0] dependencies[NUM_PRODUCTS-1:0];

    // Internal signals
    reg [31:0] completion_time[NUM_PRODUCTS-1:0]; // Stores the completion time for each product
    reg [NUM_PRODUCTS-1:0] visited;              // Visited flags for cycle detection
    reg [NUM_PRODUCTS-1:0] stack;                // Stack for cycle detection

    integer i, j; // Loop variables

    // Initialize arrays at reset
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            total_time <= 0;
            valid_input <= 1;
            cycle_detected <= 0;

            // Reset all registers
            for (i = 0; i < NUM_PRODUCTS; i = i + 1) begin
                completion_time[i] <= 0;
                visited[i] <= 0;
                stack[i] <= 0;
            end

            // Load production times
            production_times[0] <= PRODUCTION_TIME_0;
            production_times[1] <= PRODUCTION_TIME_1;
            production_times[2] <= PRODUCTION_TIME_2;
            production_times[3] <= PRODUCTION_TIME_3;
            production_times[4] <= PRODUCTION_TIME_4;
            production_times[5] <= PRODUCTION_TIME_5;

            // Load dependencies
            dependencies[0] <= DEPENDENCY_0;
            dependencies[1] <= DEPENDENCY_1;
            dependencies[2] <= DEPENDENCY_2;
            dependencies[3] <= DEPENDENCY_3;
            dependencies[4] <= DEPENDENCY_4;
            dependencies[5] <= DEPENDENCY_5;
        end else begin
            // Input validation
            valid_input <= 1;
            for (i = 0; i < NUM_PRODUCTS; i = i + 1) begin
                if (|dependencies[i] & (i >= NUM_PRODUCTS)) begin
                    valid_input <= 0; // Invalid dependency detected
                end
            end

            if (valid_input) begin
                // Cycle detection and completion time calculation
                for (i = 0; i < NUM_PRODUCTS; i = i + 1) begin
                    if (!visited[i] && !cycle_detected) begin
                        if (!calculate_completion_time(i)) begin
                            cycle_detected <= 1; // Circular dependency detected
                        end
                    end
                end
                if (!cycle_detected) begin
                    // Calculate total production time
                    total_time <= 0;
                    for (i = 0; i < NUM_PRODUCTS; i = i + 1) begin
                        if (completion_time[i] > total_time) begin
                            total_time <= completion_time[i];
                        end
                    end
                end
            end
        end
    end

    // Function to calculate completion time using a DFS-like approach
    function calculate_completion_time(input integer product_index);
        reg [31:0] max_dependency_time;
        begin
            if (stack[product_index]) begin
                calculate_completion_time = 0; // Cycle detected
            end else if (visited[product_index]) begin
                calculate_completion_time = 1; // Already processed
            end else begin
                // Mark as visiting
                stack[product_index] = 1;
                visited[product_index] = 1;

                max_dependency_time = 0;
                for (j = 0; j < NUM_PRODUCTS; j = j + 1) begin
                    if (dependencies[product_index][j]) begin
                        if (!calculate_completion_time(j)) begin
                            calculate_completion_time = 0; // Cycle detected in dependency
                            stack[product_index] = 0;
                            return;
                        end
                        if (completion_time[j] > max_dependency_time) begin
                            max_dependency_time = completion_time[j];
                        end
                    end
                end

                // Calculate completion time
                completion_time[product_index] = max_dependency_time + production_times[product_index];
                stack[product_index] = 0;
                calculate_completion_time = 1;
            end
        end
    endfunction
endmodule
