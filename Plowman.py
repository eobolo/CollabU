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
