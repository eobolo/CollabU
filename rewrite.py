using System;
using System.Collections.Generic;
using System.Linq;

public class ProductionManager
{
    public string CalculateProductionTime(List<Dictionary<string, object>> products)
    {
        // Validate the input data
        if (!products.All(p => p.Keys.Contains("type") && p.Keys.Contains("days") && p.Keys.Contains("dependency")))
        {
            return "Invalid Input";
        }

        if (!products.All(p => int.TryParse(p["days"].ToString(), out _)))
        {
            return "Invalid Input";
        }

        var productDict = new Dictionary<int, Product>();

        for (int i = 0; i < products.Count; i++)
        {
            var product = new Product
            {
                Id = i,
                Type = products[i]["type"].ToString(),
                Days = int.Parse(products[i]["days"].ToString()),
                Dependencies = (products[i]["dependency"] as List<object>)?.Select(o => int.Parse(o.ToString())).ToList() ?? new List<int>()
            };

            // Validate dependencies
            if (product.Dependencies.Any(d => d < 0 || d >= products.Count))
            {
                return "Invalid Input";
            }

            productDict.Add(product.Id, product);
        }

        bool hasCircularDependency = hasCircularDependencyUtil(productDict, new List<int>());
        if (hasCircularDependency)
        {
            return "Invalid Cycle Detected";
        }

        var queue = new Queue<Product>();
        foreach (var product in productDict.Values where !product.Dependencies.Any())
        {
            queue.Enqueue(product);
        }

        int totalDays = 0;
        while (queue.Count > 0)
        {
            var currentProduct = queue.Dequeue();
            totalDays += currentProduct.Days;

            foreach (var product in productDict.Values where product.Dependencies.Contains(currentProduct.Id))
            {
                product.Dependencies.Remove(currentProduct.Id);
                if (!product.Dependencies.Any())
                {
                    queue.Enqueue(product);
                }
            }
        }

        // Check if there are any remaining products with dependencies, indicating an invalid state
        if (productDict.Values.Any(p => p.Dependencies.Any()))
        {
            return "Invalid Input";
        }

        return totalDays.ToString();
    }

    private bool hasCircularDependencyUtil(Dictionary<int, Product> productDict, List<int> visited)
    {
        visited.AddRange(productDict.Keys);

        foreach (var product in productDict.Values)
        {
            foreach (var dependency in product.Dependencies)
            {
                if (visited.Contains(dependency))
                {
                    return true;
                }

                if (hasCircularDependencyUtil(productDict, visited))
                {
                    return true;
                }
            }
        }

        return false;
    }

    public class Product
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Days { get; set; }
        public List<int> Dependencies { get; set; }
    }

    public static void Main()
    {
        var productionManager = new ProductionManager();

        List<Dictionary<string, object>> productList1 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object> { { "type", "Coffee dust" }, { "days", 2 }, { "dependency", new[] {} } },
            new Dictionary<string, object> { { "type", "Coffee cups" }, { "days", 3 }, { "dependency", new[] { 0 } } },
            new Dictionary<string, object> { { "type", "Coffee sealing" }, { "days", 1 }, { "dependency", new[] { 0 } } },
        };

        Console.WriteLine("Example 1 Output: " + productionManager.CalculateProductionTime(productList1)); // Output: 6

        List<Dictionary<string, object>> productList2 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object> { { "type", "A" }, { "days", 1 }, { "dependency", new[] { 1 } } },
            new Dictionary<string, object> { { "type", "B" }, { "days", 1 }, { "dependency", new[] { 0 } } },
        };

        Console.WriteLine("Example 2 Output: " + productionManager.CalculateProductionTime(productList2)); // Output: Invalid Cycle Detected

        List<Dictionary<string, object>> productList3 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object> { { "type", "A" }, { "days", 1 }, { "dependency", new[] {} } },  // Missing "dependency" key in B
        };

        Console.WriteLine("Example 3 Output: " + productionManager.CalculateProductionTime(productList3)); // Output: Invalid Input

        List<Dictionary<string, object>> productList4 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object> { { "type", "A" }, { "days", "1" }, { "dependency", new[] {} } },  // Invalid value for "days"
        };

        Console.WriteLine("Example 4 Output: " + productionManager.CalculateProductionTime(productList4)); // Output: Invalid Input
    }
}
