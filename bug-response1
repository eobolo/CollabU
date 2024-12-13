function processOrder(orders, rl) {
    showPendingOrders(orders);
    
    rl.question("Enter Order ID to process or 'exit' to quit: ", (order_id) => {
        if (order_id.toLowerCase() === 'exit') {
            mainMenu(orders, rl);
            return;
        }

        const order = orders.find(o => o.order_id === order_id && o.status === 'pending');
        if (order) {
            // Check if the order is the next one to be processed based on priority and order_id
            const nextOrder = orders
                .filter(o => o.status === 'pending')
                .sort((a, b) => (b.is_high_priority - a.is_high_priority) || a.order_id.localeCompare(b.order_id))
                .shift();

            if (order === nextOrder) {
                order.status = 'completed';
                saveOrders(orders);
                console.log(`Order ${order_id} completed.\n`);
            } else {
                console.log("Oops! You must process orders in sequence. Please check and try again!\n");
            }
        } else {
            console.log(`Error: Order ID ${order_id} not found or already processed.\n`);
        }

        processOrder(orders, rl);
    });
}
