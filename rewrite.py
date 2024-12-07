Top-level statements must precede namespace and type declarations.CS8803
List<Dictionary<string, object>>.List() (+ 2 overloads)
Initializes a new instance of the List class that is empty and has the default initial capacity.


using System;
using System.Collections.Generic;
using System.Linq;

public class ProductionCycleManager
{
    public static string ManageProduction(List<Dictionary<string, object>> products)
    {
        // Validate input
        if (!products.All(p => IsValidProduct(p)))
        {
            return "Invalid Input";
        }

        Dictionary<int, Product> productDictionary = new Dictionary<int, Product>();
        foreach (var productData in products)
        {
            var product = new Product
            {
                Id = (int)productData["id"],
                Type = (string)productData["type"],
                Days = (int)productData["days"],
                Dependencies = (int[])productData["dependency"]
            };
            productDictionary[product.Id] = product;
        }

        // Check for circular dependencies
        if (HasCircularDependency(productDictionary))
        {
            return "Invalid Cycle Detected";
        }

        // Topological sorting
        int totalDays = 0;
        var queue = new Queue<Product>(products.Select(p => productDictionary[(int)p["id"]]).Where(p => !p.Dependencies.Any()));

        while (queue.Count > 0)
        {
            var currentProduct = queue.Dequeue();
            totalDays += currentProduct.Days;

            foreach (var product in productDictionary.Values)
            {
                if (product.Dependencies.Contains(currentProduct.Id))
                {
                    product.Dependencies.Remove(currentProduct.Id);
                    if (!product.Dependencies.Any())
                    {
                        queue.Enqueue(product);
                    }
                }
            }
        }

        return totalDays.ToString();
    }

    private static bool HasCircularDependency(Dictionary<int, Product> products)
    {
        var visited = new HashSet<int>();
        var stack = new Stack<int>();

        foreach (var product in products.Values)
        {
            if (DFS(product, products, visited, stack))
            {
                return true;
            }
        }
        return false;
    }

    private static bool DFS(Product product, Dictionary<int, Product> products, HashSet<int> visited, Stack<int> stack)
    {
        if (stack.Contains(product.Id))
        {
            return true;
        }

        if (visited.Contains(product.Id))
        {
            return false;
        }

        visited.Add(product.Id);
        stack.Push(product.Id);

        foreach (var dependency in product.Dependencies)
        {
            if (DFS(products[dependency], products, visited, stack))
            {
                return true;
            }
        }

        stack.Pop();
        return false;
    }

    private static bool IsValidProduct(Dictionary<string, object> product)
    {
        return product.Keys.All(k => k == "id" || k == "type" || k == "days" || k == "dependency") &&
               product.Values.All(v =>
                   v is int || v is string &&
                   (v is int && (int)v >= 0) ||
                   (v is string && !string.IsNullOrEmpty((string)v)) ||
                   (v is int[] && ((int[])v).All(d => d >= 0))
               );
    }

    class Product
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Days { get; set; }
        public int[] Dependencies { get; set; }
    }
}



var products_1 = new List<Dictionary<string, object>>()
{
    new Dictionary<string, object> { { "id", 0 }, { "type", "A" }, { "days", 10 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 1 }, { "type", "B" }, { "days", 5 }, { "dependency", new int[] { 0 } } },
    new Dictionary<string, object> { { "id", 2 }, { "type", "C" }, { "days", 7 }, { "dependency", new int[] { 0 } } },
    new Dictionary<string, object> { { "id", 3 }, { "type", "A" }, { "days", 3 }, { "dependency", new int[] { 1, 2 } } },
    new Dictionary<string, object> { { "id", 4 }, { "type", "B" }, { "days", 8 }, { "dependency", new int[] { 3 } } },
    new Dictionary<string, object> { { "id", 5 }, { "type", "C" }, { "days", 4 }, { "dependency", new int[] { 4 } } }
};

Console.WriteLine(ProductionCycleManager.ManageProduction(products_1));  // Expected output: "37"
var products_2 = new List<Dictionary<string, object>>()
{
    new Dictionary<string, object> { { "id", 0 }, { "type", "A" }, { "days", 10 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 1 }, { "type", "B" }, { "days", 5 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 2 }, { "type", "C" }, { "days", 7 }, { "dependency", new int[] { } } }
};

Console.WriteLine(ProductionCycleManager.ManageProduction(products_2));  // Expected output: "22"

var products_3 = new List<Dictionary<string, object>>()
{
    new Dictionary<string, object> { { "id", 0 }, { "type", "A" }, { "days", 12 }, { "dependency", new int[] { } } }
};

Console.WriteLine(ProductionCycleManager.ManageProduction(products_3));  // Expected output: "12"

var products_4 = new List<Dictionary<string, object>>()
{
    new Dictionary<string, object> { { "id", 0 }, { "type", "A" }, { "days", 10 }, { "dependency", new int[] { 1 } } },
    new Dictionary<string, object> { { "id", 1 }, { "type", "B" }, { "days", 5 }, { "dependency", new int[] { 0 } } }
};

Console.WriteLine(ProductionCycleManager.ManageProduction(products_4));  // Expected output: "Invalid Cycle Detected"

var products_5 = new List<Dictionary<string, object>>()
{
    new Dictionary<string, object> { { "id", 0 }, { "type", "A" }, { "days", 10 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 1 }, { "type", "B" }, { "days", 5 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 2 }, { "type", "C" }, { "days", 7 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 3 }, { "type", "A" }, { "days", 3 } }  // Missing "dependency"
};

Console.WriteLine(ProductionCycleManager.ManageProduction(products_5));  // Expected output: "Invalid Input"

var products_6 = new List<Dictionary<string, object>>()
{
    new Dictionary<string, object> { { "id", 0 }, { "type", "A" }, { "days", 10 }, { "dependency", new int[] { 3 } } },  // Dependency on non-existent product
    new Dictionary<string, object> { { "id", 1 }, { "type", "B" }, { "days", 5 }, { "dependency", new int[] { } } }
};

Console.WriteLine(ProductionCycleManager.ManageProduction(products_6));  // Expected output: "Invalid Input"

var products_7 = new List<Dictionary<string, object>>()
{
    new Dictionary<string, object> { { "id", 0 }, { "type", "A" }, { "days", 5 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 1 }, { "type", "B" }, { "days", 8 }, { "dependency", new int[] { } } },
    new Dictionary<string, object> { { "id", 2 }, { "type", "C" }, { "days", 10 }, { "dependency", new int[] { } } }
};

Console.WriteLine(ProductionCycleManager.ManageProduction(products_7));  // Expected output: "23"
