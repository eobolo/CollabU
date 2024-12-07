using System;
using System.Collections.Generic;
using System.Linq;

public class Product
{
    public string Type { get; set; }
    public int Days { get; set; }
    public List<int> Dependency { get; set; }

    public Product(string type, int days, List<int> dependency)
    {
        Type = type;
        Days = days;
        Dependency = dependency;
    }
}

public class SupplyChainManager
{
    private readonly Dictionary<string, Product> products;

    public SupplyChainManager(List<Dictionary<string, object>> productList)
    {
        products = ValidateAndParseInput(productList);
    }

    private Dictionary<string, Product> ValidateAndParseInput(List<Dictionary<string, object>> productList)
    {
        var products = new Dictionary<string, Product>();

        foreach (var productDict in productList)
        {
            if (!productDict.Keys.Contains("type") || !productDict.Keys.Contains("days") || !productDict.Keys.Contains("dependency"))
            {
                Console.WriteLine("Invalid Input");
                return null;
            }

            string type = (string)productDict["type"];
            int days = (int)productDict["days"];
            List<int> dependency = (List<int>)productDict["dependency"];

            if (!products.TryAdd(type, new Product(type, days, dependency)))
            {
                Console.WriteLine("Invalid Input: Product type already exists.");
                return null;
            }
        }

        foreach (var product in products.Values)
        {
            for (int i = 0; i < product.Dependency.Count; i++)
            {
                int depIndex = product.Dependency[i];
                if (depIndex < 0 || depIndex >= products.Count)
                {
                    Console.WriteLine("Invalid Input: Dependency index out of bounds.");
                    return null;
                }

                string depType = products.Keys.ElementAt(depIndex);
                product.Dependency[i] = products.Keys.ToList().IndexOf(depType);
            }
        }

        return products;
    }

    public string CalculateProductionTime()
    {
        if (products == null)
        {
            return "Invalid Input"; // This should never be reached due to input validation
        }

        List<int> independentProducts = FindIndependentProducts();
        int totalDays = 0;

        while (independentProducts.Count > 0)
        {
            int currentProductIndex = independentProducts.RemoveFirst();
            string currentProductType = products.Keys.ElementAt(currentProductIndex);
            totalDays += products[currentProductType].Days;

            foreach (var product in products.Values)
            {
                if (product.Dependency.Contains(currentProductIndex))
                {
                    product.Dependency.Remove(currentProductIndex);
                    if (product.Dependency.Count == 0)
                    {
                        independentProducts.Add(products.Keys.ToList().IndexOf(product.Type));
                    }
                }
            }
        }

        if (HasCircularDependency())
        {
            return "Invalid Cycle Detected";
        }

        return totalDays.ToString();
    }

    private List<int> FindIndependentProducts()
    {
        List<int> independentProducts = new List<int>();

        foreach (var product in products.Values)
        {
            if (product.Dependency.Count == 0)
            {
                independentProducts.Add(products.Keys.ToList().IndexOf(product.Type));
            }
        }

        return independentProducts;
    }

    private bool HasCircularDependency()
    {
        bool[] visited = new bool[products.Count];
        Stack<int> stack = new Stack<int>();
