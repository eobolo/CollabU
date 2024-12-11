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

        var products3 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 12 },
                { "dependency", new List<int>() }
            }
        };

        var products4 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 10 },
                { "dependency", new List<int> { 1 } }
            },
            new Dictionary<string, object>()
            {
                { "type", "B" },
                { "days", 5 },
                { "dependency", new List<int> { 0 } }
            }
        };

        var products5 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 10 }
            },
            new Dictionary<string, object>()
            {
                { "type", "B" },
                { "days", 5 },
                { "dependency", new List<int>() }
            }
        };

        var products6 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 10 },
                { "dependency", new List<int> { 3 } }
            },
            new Dictionary<string, object>()
            {
                { "type", "B" },
                { "days", 5 },
                { "dependency", new List<int>() }
            }
        };
        Console.WriteLine(CalculateProductionTime(products1));
        Console.WriteLine(CalculateProductionTime(products2));
        Console.WriteLine(CalculateProductionTime(products3));
        Console.WriteLine(CalculateProductionTime(products4));
        Console.WriteLine(CalculateProductionTime(products5));
        Console.WriteLine(CalculateProductionTime(products6));
    }
}
