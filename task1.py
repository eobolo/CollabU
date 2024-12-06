from typing import List, Dict, Union

def calculate_production_time(products: List[Dict[str, Union[str, int, List[int]]]]) -> Union[int, str]:
    # Edge case: Empty product list
    if not products:
        return 0
    
    n = len(products)
    
    # Helper function to check if all required keys are present in the product dictionaries
    def validate_input():
        for product in products:
            if 'type' not in product or 'days' not in product or 'dependency' not in product:
                return False
            if not isinstance(product['type'], str) or not isinstance(product['days'], int) or not isinstance(product['dependency'], list):
                return False
            if any(not isinstance(dep, int) or dep < 0 or dep >= n for dep in product['dependency']):
                return False
        return True
    
    # Step 1: Validate the input for missing keys or invalid values
    if not validate_input():
        return "Invalid Input"
    
    # Step 2: Detect circular dependencies using DFS
    visited = [0] * n  # 0 = unvisited, 1 = visiting, 2 = visited
    completion_time = [0] * n  # Track the time when each product is completed
    
    def dfs(product_index: int) -> bool:
        if visited[product_index] == 1:
            # Cycle detected
            return False
        if visited[product_index] == 2:
            # Already processed product
            return True
        
        visited[product_index] = 1  # Mark as visiting
        
        for dep_index in products[product_index]["dependency"]:
            if dep_index >= n or dep_index < 0 or not dfs(dep_index):
                return False
        
        visited[product_index] = 2  # Mark as visited
        return True
    
    # Step 3: Check for cycles in the dependency graph
    for i in range(n):
        if visited[i] == 0 and not dfs(i):
            return "Invalid Cycle Detected"
    
    # Step 4: Calculate the completion time for each product
    def calculate_completion_time(product_index: int) -> int:
        if completion_time[product_index] > 0:
            return completion_time[product_index]
        
        # Calculate the maximum time from dependencies
        max_dependency_time = 0
        for dep_index in products[product_index]["dependency"]:
            max_dependency_time = max(max_dependency_time, calculate_completion_time(dep_index))
        
        # Add the production time for the current product
        completion_time[product_index] = max_dependency_time + products[product_index]["days"]
        
        return completion_time[product_index]
    
    # Step 5: Calculate the total production time
    total_time = 0
    for i in range(n):
        total_time = max(total_time, calculate_completion_time(i))
    
    return total_time

# Example usage:
products_1 = [
    {"type": "A", "days": 10, "dependency": []},
    {"type": "B", "days": 5, "dependency": [0]},
    {"type": "C", "days": 7, "dependency": [0]},
    {"type": "A", "days": 3, "dependency": [1, 2]},
    {"type": "B", "days": 8, "dependency": [3]},
    {"type": "C", "days": 4, "dependency": [4]},
]
products_2 = [
    {"type": "A", "days": 10, "dependency": []},
    {"type": "B", "days": 5, "dependency": []},
    {"type": "C", "days": 7, "dependency": []},
]
products_3 = [
    {"type": "A", "days": 12, "dependency": []},
]
products_4 = [
    {"type": "A", "days": 10, "dependency": [1]},
    {"type": "B", "days": 5, "dependency": [0]},
]
products_5 = [
    {"type": "A", "days": 10},  # Missing "dependency" key
    {"type": "B", "days": 5, "dependency": []},
]
products_6 = [
    {"type": "A", "days": 10, "dependency": [3]},  # Dependency on non-existent product
    {"type": "B", "days": 5, "dependency": []},
]



print(calculate_production_time(products_1))
print(calculate_production_time(products_2))
print(calculate_production_time(products_3))
print(calculate_production_time(products_4))
print(calculate_production_time(products_5))
print(calculate_production_time(products_6))