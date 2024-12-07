using System;
using System.Collections.Generic;

public class ProductionScheduler
{
    // This method calculates the total production time, considering product dependencies.
    public static string CalculateProductionTime(List<Dictionary<string, object>> products)
    {
        int n = products.Count;  // Number of products

        // Edge case: Empty product list (no products to process)
        if (n == 0)
            return "0";

        // Helper function to validate input
        bool ValidateInput()
        {
            // Loop through each product
            for (int i = 0; i < n; i++)
            {
                var product = products[i];
                
                // Check if required keys are present: "type", "days", and "dependency"
                if (!product.ContainsKey("type") || !product.ContainsKey("days") || !product.ContainsKey("dependency"))
                    return false;

                // Ensure the correct types for each key
                if (!(product["type"] is string) || !(product["days"] is int) || !(product["dependency"] is List<int>))
                    return false;

                // Validate dependencies for each product (must reference valid products)
                var dependency = (List<int>)product["dependency"];
                foreach (var dep in dependency)
                {
                    if (dep < 0 || dep >= n)  // Dependency should be within valid product indices
                        return false;
                }
            }
            return true;
        }

        // Step 1: Validate the input
        if (!ValidateInput())
            return "Invalid Input";

        // Step 2: Prepare for cycle detection and completion time calculation
        int[] visited = new int[n];  // 0 = unvisited, 1 = visiting, 2 = visited
        int[] completionTime = new int[n];  // Track the time when each product is completed

        // Depth First Search to detect cycles
        bool Dfs(int productIndex)
        {
            if (visited[productIndex] == 1)  // Cycle detected (currently being visited)
                return false;
            if (visited[productIndex] == 2)  // Already processed
                return true;

            visited[productIndex] = 1;  // Mark product as being visited

            var dependencyList = (List<int>)products[productIndex]["dependency"];
            foreach (int depIndex in dependencyList)
            {
                if (depIndex >= n || depIndex < 0 || !Dfs(depIndex))  // Check if dependency is valid
                    return false;
            }

            visited[productIndex] = 2;  // Mark product as fully visited
            return true;
        }

        // Step 3: Detect cycles in the dependency graph
        for (int i = 0; i < n; i++)
        {
            if (visited[i] == 0 && !Dfs(i))  // If a cycle is found
                return "Invalid Cycle Detected";
        }

        // Step 4: Calculate the completion time for each product
        int CalculateCompletionTime(int productIndex)
        {
            if (completionTime[productIndex] > 0)  // Return pre-calculated time
                return completionTime[productIndex];

            int maxDependencyTime = 0;
            var dependencyList = (List<int>)products[productIndex]["dependency"];
            foreach (int depIndex in dependencyList)
            {
                maxDependencyTime = Math.Max(maxDependencyTime, CalculateCompletionTime(depIndex));  // Get max of dependencies
            }

            completionTime[productIndex] = maxDependencyTime + (int)products[productIndex]["days"];
            return completionTime[productIndex];
        }

        // Step 5: Calculate the total production time
        int totalTime = 0;
        for (int i = 0; i < n; i++)
        {
            totalTime = Math.Max(totalTime, CalculateCompletionTime(i));  // Max time considering all products
        }

        // Return total production time
        return totalTime.ToString();
    }

    public static void Main()
    {
        // Example product lists and calls to CalculateProductionTime
        var products1 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object> { { "type", "A" }, { "days", 10 }, { "dependency", new List<int>() } },
            new Dictionary<string, object> { { "type", "B" }, { "days", 5 }, { "dependency", new List<int>{0} } },
            new Dictionary<string, object> { { "type", "C" }, { "days", 7 }, { "dependency", new List<int>{0} } },
            new Dictionary<string, object> { { "type", "A" }, { "days", 3 }, { "dependency", new List<int>{1, 2} } },
            new Dictionary<string, object> { { "type", "B" }, { "days", 8 }, { "dependency", new List<int>{3} } },
            new Dictionary<string, object> { { "type", "C" }, { "days", 4 }, { "dependency", new List<int>{4} } }
        };

        Console.WriteLine(CalculateProductionTime(products1));  // Output: Expected total time based on dependencies
    }
}
