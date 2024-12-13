function processOrder(orders, rl) {
    const pendingOrders = orders
        .filter(order => order.status === 'pending')
        .sort((a, b) => (b.is_high_priority - a.is_high_priority) || a.order_id.localeCompare(b.order_id));

    showPendingOrders(orders);

    rl.question("Enter Order ID to process or 'exit' to quit: ", (order_id) => {
        if (order_id.toLowerCase() === 'exit') {
            mainMenu(orders, rl);
            return;
        }

        // Find the correct order to process based on the sequence
        const orderToProcess = pendingOrders[0];
        
        if (order_id === orderToProcess.order_id) {
            orderToProcess.status = 'completed';
            saveOrders(orders);
            console.log(`Order ${order_id} completed.\n`);

            // Remove the completed order from the pending orders array
            const remainingOrders = pendingOrders.filter(order => order.order_id !== orderToProcess.order_id);
            if (remainingOrders.length > 0) {
                processOrder(remainingOrders, rl);
            } else {
                mainMenu(orders, rl);
            }
        } else {
            console.log("Oops! You must process orders in sequence. Please check and try again!");
            processOrder(pendingOrders, rl);
        }
    });
}
