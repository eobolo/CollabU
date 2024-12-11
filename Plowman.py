import tkinter as tk
from tkinter import messagebox
import math

def calculate_best_combination():
    try:
        # Retrieve user inputs
        package_a_items = int(entry_package_a_items.get())
        package_a_cost = float(entry_package_a_cost.get())
        package_b_items = int(entry_package_b_items.get())
        package_b_cost = float(entry_package_b_cost.get())
        target_items = int(entry_target_items.get())

        # Initialize variables for the best combination
        min_cost = float('inf')
        best_combination = (0, 0, float('inf'))  # (num_a, num_b, unused_items)

        for x in range(target_items // package_a_items + 1):
            remaining_items = target_items - (x * package_a_items)
            if remaining_items < 0:
                break
            y = math.ceil(remaining_items / package_b_items)

            total_items_bought = (x * package_a_items) + (y * package_b_items)
            total_cost = (x * package_a_cost) + (y * package_b_cost)
            unused_items = total_items_bought - target_items

            if total_cost < min_cost or (total_cost == min_cost and unused_items < best_combination[2]):
                min_cost = total_cost
                best_combination = (x, y, unused_items)

        # Display results
        num_a, num_b, unused_items = best_combination
        result_text.set(f"Best combination:\n"
                        f"Package A: {num_a} ({package_a_items} items each)\n"
                        f"Package B: {num_b} ({package_b_items} items each)\n"
                        f"Total Cost: ${min_cost:.2f}\n"
                        f"Unused Items: {unused_items}")

    except ValueError:
        messagebox.showerror("Input Error", "Please enter valid numbers for all fields.")

# Create the main tkinter window
root = tk.Tk()
root.title("Package Optimizer")

# Input fields
frame_inputs = tk.Frame(root)
frame_inputs.pack(pady=10)

tk.Label(frame_inputs, text="Package A - Items:").grid(row=0, column=0, padx=5, pady=5, sticky="e")
entry_package_a_items = tk.Entry(frame_inputs)
entry_package_a_items.grid(row=0, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Package A - Cost:").grid(row=1, column=0, padx=5, pady=5, sticky="e")
entry_package_a_cost = tk.Entry(frame_inputs)
entry_package_a_cost.grid(row=1, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Package B - Items:").grid(row=2, column=0, padx=5, pady=5, sticky="e")
entry_package_b_items = tk.Entry(frame_inputs)
entry_package_b_items.grid(row=2, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Package B - Cost:").grid(row=3, column=0, padx=5, pady=5, sticky="e")
entry_package_b_cost = tk.Entry(frame_inputs)
entry_package_b_cost.grid(row=3, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Target Items:").grid(row=4, column=0, padx=5, pady=5, sticky="e")
entry_target_items = tk.Entry(frame_inputs)
entry_target_items.grid(row=4, column=1, padx=5, pady=5)

# Button to calculate
btn_calculate = tk.Button(root, text="Calculate Best Combination", command=calculate_best_combination)
btn_calculate.pack(pady=10)

# Output field
frame_output = tk.Frame(root)
frame_output.pack(pady=10)

result_text = tk.StringVar()
result_label = tk.Label(frame_output, textvariable=result_text, justify="left", font=("Arial", 12))
result_label.pack()

# Start the application
root.mainloop()






Prompt 1: The community sports council is organizing a 6-day marathon event and as a member of the organizing committee, I have been tasked with shopping for items needed. I need to buy exactly 100 items and I have two options, Package A and Package B.

I want you to help me write a Python application that can determine the combination of packages that minimizes cost. If both combinations have the same cost, the application should explain which one provides better value in terms of unused items. The values for Package A and Package B (number of items, and cost of package) should be received as user input.


import math

def find_best_package_combination():
    # Get user inputs for package details
    package_a_items = int(input("Enter the number of items in Package A: "))
    package_a_cost = float(input("Enter the cost of Package A: "))
    package_b_items = int(input("Enter the number of items in Package B: "))
    package_b_cost = float(input("Enter the cost of Package B: "))
    total_items = 100

    # Solve analytically for x (number of Package A) and y (number of Package B)
    # Let x be the number of Package A units, y be the number of Package B units
    min_cost = float('inf')
    best_combination = (0, 0, float('inf'))  # (num_a, num_b, unused_items)

    for x in range(total_items // package_a_items + 1):
        # Calculate y to satisfy the total_items constraint
        remaining_items = total_items - (x * package_a_items)
        if remaining_items < 0:
            break  # x is too large
        y = math.ceil(remaining_items / package_b_items)

        # Calculate cost and unused items
        total_items_bought = (x * package_a_items) + (y * package_b_items)
        total_cost = (x * package_a_cost) + (y * package_b_cost)
        unused_items = total_items_bought - total_items

        # Check if this is the best solution
        if total_cost < min_cost or (total_cost == min_cost and unused_items < best_combination[2]):
            min_cost = total_cost
            best_combination = (x, y, unused_items)

    # Display the result
    num_a, num_b, unused_items = best_combination
    print(f"\nBest combination:")
    print(f"  Package A: {num_a} ({package_a_items} items each)")
    print(f"  Package B: {num_b} ({package_b_items} items each)")
    print(f"  Total Cost: ${min_cost:.2f}")
    print(f"  Unused Items: {unused_items}")

if __name__ == "__main__":
    find_best_package_combination()






























def find_best_package_combination():
    # Get user inputs for package details
    package_a_items = int(input("Enter the number of items in Package A: "))
    package_a_cost = float(input("Enter the cost of Package A: "))
    package_b_items = int(input("Enter the number of items in Package B: "))
    package_b_cost = float(input("Enter the cost of Package B: "))
    total_items = 100  # Fixed target for the problem

    min_cost = float('inf')
    best_combinations = []

    # Iterate through possible combinations of Package A and Package B
    for num_a in range(total_items // package_a_items + 1):  # Max possible A packages
        for num_b in range(total_items // package_b_items + 1):  # Max possible B packages
            total_items_bought = num_a * package_a_items + num_b * package_b_items
            if total_items_bought >= total_items:  # Valid combinations
                total_cost = num_a * package_a_cost + num_b * package_b_cost
                unused_items = total_items_bought - total_items

                # Check if this combination has a lower cost
                if total_cost < min_cost:
                    min_cost = total_cost
                    best_combinations = [(num_a, num_b, unused_items)]
                elif total_cost == min_cost:
                    best_combinations.append((num_a, num_b, unused_items))

    # If there are multiple combinations with the same cost, choose based on fewer unused items
    best_combinations.sort(key=lambda x: x[2])  # Sort by unused items
    best_choice = best_combinations[0]

    # Display the results
    num_a, num_b, unused_items = best_choice
    print(f"\nBest combination:")
    print(f"  Package A: {num_a} ({package_a_items} items each)")
    print(f"  Package B: {num_b} ({package_b_items} items each)")
    print(f"  Total Cost: ${min_cost:.2f}")
    print(f"  Unused Items: {unused_items}")

    if len(best_combinations) > 1:
        print("\nNote: Other combinations with the same cost but more unused items:")
        for combination in best_combinations[1:]:
            print(f"  Package A: {combination[0]}, Package B: {combination[1]}, Unused Items: {combination[2]}")

if __name__ == "__main__":
    find_best_package_combination()
