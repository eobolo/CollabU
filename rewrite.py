C#:

using System;
using System.Collections.Generic;

public class ProductionScheduler
{
    public static string CalculateProductionTime(List<Dictionary<string, object>> products)
    {
        int n = products.Count;

        // Edge case: Empty product list
        if (n == 0)
            return "0";

        // Helper function to check if all required keys are present in the product dictionaries
        bool ValidateInput()
        {
            for (int i = 0; i < n; i++)
            {
                var product = products[i];
                if (!product.ContainsKey("type") || !product.ContainsKey("days") || !product.ContainsKey("dependency"))
                    return false;
                if (!(product["type"] is string) || !(product["days"] is int) || !(product["dependency"] is List<int>))
                    return false;
                var dependency = (List<int>)product["dependency"];
                foreach (var dep in dependency)
                {
                    if (dep < 0 || dep >= n)
                        return false;
                }
            }
            return true;
        }

        // Step 1: Validate the input for missing keys or invalid values
        if (!ValidateInput())
            return "Invalid Input";

        // Step 2: Detect circular dependencies using DFS
        int[] visited = new int[n]; // 0 = unvisited, 1 = visiting, 2 = visited
        int[] completionTime = new int[n]; // Track the time when each product is completed

        bool Dfs(int productIndex)
        {
            if (visited[productIndex] == 1)
                return false; // Cycle detected
            if (visited[productIndex] == 2)
                return true; // Already processed product

            visited[productIndex] = 1; // Mark as visiting

            var dependencyList = (List<int>)products[productIndex]["dependency"];
            foreach (int depIndex in dependencyList)
            {
                if (depIndex >= n || depIndex < 0 || !Dfs(depIndex))
                    return false;
            }

            visited[productIndex] = 2; // Mark as visited
            return true;
        }

        // Step 3: Check for cycles in the dependency graph
        for (int i = 0; i < n; i++)
        {
            if (visited[i] == 0 && !Dfs(i))
                return "Invalid Cycle Detected";
        }

        // Step 4: Calculate the completion time for each product
        int CalculateCompletionTime(int productIndex)
        {
            if (completionTime[productIndex] > 0)
                return completionTime[productIndex];

            int maxDependencyTime = 0;
            var dependencyList = (List<int>)products[productIndex]["dependency"];
            foreach (int depIndex in dependencyList)
            {
                maxDependencyTime = Math.Max(maxDependencyTime, CalculateCompletionTime(depIndex));
            }

            completionTime[productIndex] = maxDependencyTime + (int)products[productIndex]["days"];
            return completionTime[productIndex];
        }

        // Step 5: Calculate the total production time
        int totalTime = 0;
        for (int i = 0; i < n; i++)
        {
            totalTime = Math.Max(totalTime, CalculateCompletionTime(i));
        }

        return totalTime.ToString();
    }

    public static void Main()
    {
        var products1 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object> { { "type", "A" }, { "days", 10 }, { "dependency", new List<int>() } },
            new Dictionary<string, object> { { "type", "B" }, { "days", 5 }, { "dependency", new List<int>{0} } },
            new Dictionary<string, object> { { "type", "C" }, { "days", 7 }, { "dependency", new List<int>{0} } },
            new Dictionary<string, object> { { "type", "A" }, { "days", 3 }, { "dependency", new List<int>{1, 2} } },
            new Dictionary<string, object> { { "type", "B" }, { "days", 8 }, { "dependency", new List<int>{3} } },
            new Dictionary<string, object> { { "type", "C" }, { "days", 4 }, { "dependency", new List<int>{4} } }
        };

        var products2 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object> { { "type", "A" }, { "days", 10 }, { "dependency", new List<int>() } },
            new Dictionary<string, object> { { "type", "B" }, { "days", 5 }, { "dependency", new List<int>() } },
            new Dictionary<string, object> { { "type", "C" }, { "days", 7 }, { "dependency", new List<int>() } }
        };

        Console.WriteLine(CalculateProductionTime(products1));
        Console.WriteLine(CalculateProductionTime(products2));
    }
}




Swift:

import Foundation

func calculateProductionTime(products: [[String: Any]]) -> Any {
    let n = products.count
    
    // Edge case: Empty product list
    if n == 0 {
        return 0
    }
    
    // Helper function to check if all required keys are present in the product dictionaries
    func validateInput() -> Bool {
        for product in products {
            guard let type = product["type"] as? String,
                  let days = product["days"] as? Int,
                  let dependency = product["dependency"] as? [Int] else {
                return false
            }
            
            for dep in dependency {
                if dep < 0 || dep >= n {
                    return false
                }
            }
        }
        return true
    }
    
    // Step 1: Validate the input for missing keys or invalid values
    if !validateInput() {
        return "Invalid Input"
    }
    
    // Step 2: Detect circular dependencies using DFS
    var visited = [Int](repeating: 0, count: n) // 0 = unvisited, 1 = visiting, 2 = visited
    var completionTime = [Int](repeating: 0, count: n) // Track the time when each product is completed
    
    func dfs(productIndex: Int) -> Bool {
        if visited[productIndex] == 1 {
            return false // Cycle detected
        }
        if visited[productIndex] == 2 {
            return true // Already processed product
        }
        
        visited[productIndex] = 1 // Mark as visiting
        
        if let dependencyList = products[productIndex]["dependency"] as? [Int] {
            for depIndex in dependencyList {
                if depIndex >= n || depIndex < 0 || !dfs(productIndex: depIndex) {
                    return false
                }
            }
        }
        
        visited[productIndex] = 2 // Mark as visited
        return true
    }
    
    // Step 3: Check for cycles in the dependency graph
    for i in 0..<n {
        if visited[i] == 0 && !dfs(productIndex: i) {
            return "Invalid Cycle Detected"
        }
    }
    
    // Step 4: Calculate the completion time for each product
    func calculateCompletionTime(productIndex: Int) -> Int {
        if completionTime[productIndex] > 0 {
            return completionTime[productIndex]
        }
        
        var maxDependencyTime = 0
        if let dependencyList = products[productIndex]["dependency"] as? [Int] {
            for depIndex in dependencyList {
                maxDependencyTime = max(maxDependencyTime, calculateCompletionTime(productIndex: depIndex))
            }
        }
        
        completionTime[productIndex] = maxDependencyTime + (products[productIndex]["days"] as! Int)
        return completionTime[productIndex]
    }
    
    // Step 5: Calculate the total production time
    var totalTime = 0
    for i in 0..<n {
        totalTime = max(totalTime, calculateCompletionTime(productIndex: i))
    }
    
    return totalTime
}

// Example usage
let products1 = [
    ["type": "A", "days": 10, "dependency": []],
    ["type": "B", "days": 5, "dependency": [0]],
    ["type": "C", "days": 7, "dependency": [0]],
    ["type": "A", "days": 3, "dependency": [1, 2]],
    ["type": "B", "days": 8, "dependency": [3]],
    ["type": "C", "days": 4, "dependency": [4]]
]

let products2 = [
    ["type": "A", "days": 10, "dependency": []],
    ["type": "B", "days": 5, "dependency": []],
    ["type": "C", "days": 7, "dependency": []]
]

print(calculateProductionTime(products: products1))
print(calculateProductionTime(products: products2))
