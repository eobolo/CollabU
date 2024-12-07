import Foundation

// Define product dictionaries for products_3, products_4, products_5, and products_6

// Product 3 (No dependencies)
let products_3: [[String: Any]] = [
    [
        "type": "A",
        "days": 12,
        "dependency": [] // Empty dependency list
    ]
]

// Product 4 (Has dependencies)
let products_4: [[String: Any]] = [
    [
        "type": "A",
        "days": 10,
        "dependency": [1] // Dependency on product 1
    ],
    [
        "type": "B",
        "days": 5,
        "dependency": [0] // Dependency on product 0
    ]
]

// Product 5 (Missing "dependency" key for the first product)
let products_5: [[String: Any]] = [
    [
        "type": "A",
        "days": 10
        // Missing "dependency" key in the first product
    ],
    [
        "type": "B",
        "days": 5,
        "dependency": [] // Empty dependency list
    ]
]

// Product 6 (Has invalid dependency)
let products_6: [[String: Any]] = [
    [
        "type": "A",
        "days": 10,
        "dependency": [3] // Dependency on non-existent product 3
    ],
    [
        "type": "B",
        "days": 5,
        "dependency": [] // Empty dependency list
    ]
]

// Print all products for verification
func printProducts(name: String, products: [[String: Any]]) {
    print("\(name):")
    for product in products {
        if let type = product["type"] as? String,
           let days = product["days"] as? Int,
           let dependency = product["dependency"] as? [Int] {
            print("  Type: \(type), Days: \(days), Dependencies: \(dependency.isEmpty ? "None" : dependency.map { String($0) }.joined(separator: ", "))")
        }
    }
}

printProducts(name: "products_3", products: products_3)
printProducts(name: "products_4", products: products_4)
printProducts(name: "products_5", products: products_5)
printProducts(name: "products_6", products: products_6)
