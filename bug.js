const fs = require('fs');
const readline = require('readline');
const path = require('path');
const os = require('os');

const ORDERS_FILE = path.join(__dirname, 'orders.json');

class Order {
    constructor(order_id, customer_name, items, is_high_priority, status = 'pending') {
        this.order_id = order_id;
        this.customer_name = customer_name;
        this.items = items;
        this.is_high_priority = is_high_priority;
        this.status = status;
    }

    toDict() {
        return {
            order_id: this.order_id,
            customer_name: this.customer_name,
            items: this.items,
            is_high_priority: this.is_high_priority,
            status: this.status
        };
    }
}

function loadOrders() {
    if (fs.existsSync(ORDERS_FILE) && fs.statSync(ORDERS_FILE).size > 0) {
        try {
            const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
            const ordersData = JSON.parse(data);
            if (Array.isArray(ordersData)) {
                return ordersData.map(order => new Order(
                    order.order_id, order.customer_name, order.items, order.is_high_priority, order.status
                ));
            } else {
                console.log("Error: Invalid file format. Initializing a new file.");
                return [];
            }
        } catch (err) {
            console.log("Error: Corrupted order file. Initializing a new file.");
            return [];
        }
    }
    return [];
}

function saveOrders(orders) {
    const fd = fs.openSync(ORDERS_FILE, 'w');
    try {
        const data = JSON.stringify(orders.map(order => order.toDict()), null, 4);
        fs.writeFileSync(ORDERS_FILE, data);
    } catch (err) {
        console.log("Error saving orders: ", err.message);
    } finally {
        fs.closeSync(fd);
    }
}

function showPendingOrders(orders) {
    console.log("\n--- Pending Orders ---");
    const pendingOrders = orders
        .filter(order => order.status === 'pending')
        .sort((a, b) => (b.is_high_priority - a.is_high_priority) || a.order_id.localeCompare(b.order_id));

    if (pendingOrders.length === 0) {
        console.log("No pending orders.\n");
    } else {
        pendingOrders.forEach(order => {
            console.log(`Order ID: ${order.order_id}, Customer: ${order.customer_name}, Items: ${order.items.join(', ')}, Priority: ${order.is_high_priority ? 'Yes' : 'No'}`);
        });
        console.log("\n");
    }
}

function processOrder(orders, rl) {
    showPendingOrders(orders);
    rl.question("Enter Order ID to process or 'exit' to quit: ", (order_id) => {
        if (order_id.toLowerCase() === 'exit') {
            mainMenu(orders, rl);
            return;
        }

        const order = orders.find(o => o.order_id === order_id && o.status === 'pending');
        if (order) {
            order.status = 'completed';
            saveOrders(orders);
            console.log(`Order ${order_id} completed.\n`);
        } else {
            console.log(`Error: Order ID ${order_id} not found or already processed.\n`);
        }
        processOrder(orders, rl);
    });
}

function addOrder(orders, rl) {
    rl.question("Enter Order ID: ", (order_id) => {
        if (orders.some(o => o.order_id === order_id)) {
            console.log(`Error: Order ID ${order_id} already exists.\n`);
            mainMenu(orders, rl);
            return;
        }

        rl.question("Enter Customer Name: ", (customer_name) => {
            rl.question("Enter Items (comma-separated): ", (itemsInput) => {
                rl.question("Is this a High-Priority Order? (yes/no): ", (priorityInput) => {
                    const items = itemsInput.split(',').map(item => item.trim());
                    const is_high_priority = priorityInput.toLowerCase() === 'yes';
                    const newOrder = new Order(order_id, customer_name, items, is_high_priority);

                    orders.push(newOrder);
                    saveOrders(orders);
                    console.log(`Order ${order_id} added successfully.\n`);
                    mainMenu(orders, rl);
                });
            });
        });
    });
}

function mainMenu(orders, rl) {
    console.log("\n1. Add a new order");
    console.log("2. Process orders");
    console.log("3. View pending orders");
    console.log("4. Exit\n");

    rl.question("Enter your choice: ", (choice) => {
        switch (choice) {
            case '1':
                addOrder(orders, rl);
                break;
            case '2':
                processOrder(orders, rl);
                break;
            case '3':
                showPendingOrders(orders);
                mainMenu(orders, rl);
                break;
            case '4':
                console.log("Exiting the system. Goodbye!");
                rl.close();
                break;
            default:
                console.log("Invalid choice. Please try again.\n");
                mainMenu(orders, rl);
        }
    });
}

function main() {
    console.log("Welcome to the Order Management System!");
    const orders = loadOrders();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    mainMenu(orders, rl);
}

main();
