iverilog -o my_design.vvp my_design.v



module production_cycle (
    input wire clk,             // Clock signal
    input wire reset,           // Reset signal
    output reg [31:0] total_time, // Total production time
    output reg valid_input,     // Flag for valid input
    output reg cycle_detected   // Flag for circular dependencies
);
    
    // Example of predefined production times and dependencies
    parameter NUM_PRODUCTS = 6;
    parameter [31:0] PRODUCTION_TIMES[NUM_PRODUCTS-1:0] = {10, 5, 7, 3, 8, 4}; // Production times in days
    parameter [NUM_PRODUCTS-1:0] DEPENDENCIES[NUM_PRODUCTS-1:0] = {
        6'b000000, // No dependencies for product 0
        6'b000001, // Product 1 depends on product 0
        6'b000001, // Product 2 depends on product 0
        6'b000110, // Product 3 depends on products 1 and 2
        6'b001000, // Product 4 depends on product 3
        6'b010000  // Product 5 depends on product 4
    };

    // Internal signals
    reg [31:0] completion_time[NUM_PRODUCTS-1:0]; // Stores the completion time for each product
    reg [NUM_PRODUCTS-1:0] visited;              // Visited flags for cycle detection
    reg [NUM_PRODUCTS-1:0] stack;                // Stack for cycle detection

    integer i, j; // Loop variables

    // Reset logic
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
        end else begin
            // Input validation
            valid_input <= 1;
            for (i = 0; i < NUM_PRODUCTS; i = i + 1) begin
                if (|DEPENDENCIES[i] & (i >= NUM_PRODUCTS)) begin
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
                    if (DEPENDENCIES[product_index][j]) begin
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
                completion_time[product_index] = max_dependency_time + PRODUCTION_TIMES[product_index];
                stack[product_index] = 0;
                calculate_completion_time = 1;
            end
        end
    endfunction
endmodule
