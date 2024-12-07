using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Define product dictionaries for products_3, products_4, products_5, and products_6

        // Product 3 (No dependencies)
        var products_3 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 12 },
                { "dependency", new List<int>() } // Empty dependency list
            }
        };

        // Product 4 (Has dependencies)
        var products_4 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 10 },
                { "dependency", new List<int> { 1 } } // Dependency on product 1
            },
            new Dictionary<string, object>()
            {
                { "type", "B" },
                { "days", 5 },
                { "dependency", new List<int> { 0 } } // Dependency on product 0
            }
        };

        // Product 5 (Missing "dependency" key for the first product)
        var products_5 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 10 }
                // Missing "dependency" key in the first product
            },
            new Dictionary<string, object>()
            {
                { "type", "B" },
                { "days", 5 },
                { "dependency", new List<int>() } // Empty dependency list
            }
        };

        // Product 6 (Has invalid dependency)
        var products_6 = new List<Dictionary<string, object>>()
        {
            new Dictionary<string, object>()
            {
                { "type", "A" },
                { "days", 10 },
                { "dependency", new List<int> { 3 } } // Dependency on non-existent product 3
            },
            new Dictionary<string, object>()
            {
                { "type", "B" },
                { "days", 5 },
                { "dependency", new List<int>() } // Empty dependency list
            }
        };

        // Print all products for verification
        PrintProducts("products_3", products_3);
        PrintProducts("products_4", products_4);
        PrintProducts("products_5", products_5);
        PrintProducts("products_6", products_6);
    }

    // Helper function to print product details
    static void PrintProducts(string name, List<Dictionary<string, object>> products)
    {
        Console.WriteLine($"{name}:");
        foreach (var product in products)
        {
            Console.WriteLine($"  Type: {product["type"]}, Days: {product["days"]}, Dependencies: {string.Join(", ", (List<int>)product["dependency"])}");
        }
    }
}
