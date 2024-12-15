import json
import os
import time
import msvcrt  # For file locking (works on Windows)

class Order:
    def __init__(self, order_id, customer_name, items, is_high_priority, status='pending'):
        self.order_id = order_id
        self.customer_name = customer_name
        self.items = items
        self.is_high_priority = is_high_priority
        self.status = status

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "customer_name": self.customer_name,
            "items": self.items,
            "is_high_priority": self.is_high_priority,
            "status": self.status
        }

def load_orders():
    if os.path.exists('orders.json') and os.path.getsize('orders.json') > 0:
        try:
            with open('orders.json', 'r') as file:
                orders_data = json.load(file)
                if isinstance(orders_data, list) and all(isinstance(order, dict) for order in orders_data):
                    return [Order(**order) for order in orders_data]  # Convert dict to Order objects
                else:
                    print("Error: The order file format is incorrect. Initializing a new file.")
                    return []
        except json.JSONDecodeError:
            print("Error: Corrupted order file. Initializing a new file.")
            return []
    else:
        return []

def save_orders(orders):
    # Use file locking to ensure only one process writes to the file at a time
    with open('orders.json', 'w') as file:
        # Lock the file for writing (Windows specific)
        msvcrt.locking(file.fileno(), msvcrt.LK_LOCK, os.path.getsize('orders.json'))
        json.dump([order.to_dict() for order in orders], file, indent=4)
        # Unlock the file after writing
        msvcrt.locking(file.fileno(), msvcrt.LK_UNLCK, os.path.getsize('orders.json'))

def show_pending_orders(orders):
    # Sort orders by priority (high priority first), then by order ID
    orders.sort(key=lambda x: (-x.is_high_priority, x.order_id))

    pending_orders = [order for order in orders if order.status == 'pending']
    if not pending_orders:
        print("--- Pending Orders ---")
        print("No pending orders.\n")
    else:
        print("--- Pending Orders ---")
        for order in pending_orders:
            print(f"Order ID: {order.order_id}, Customer: {order.customer_name}, Items: {order.items}, Priority: {'Yes' if order.is_high_priority else 'No'}")
        print("\n")

def process_order(orders):
    # Show pending orders (sorted by high priority first)
    show_pending_orders(orders)

    # Separate high-priority and non-priority orders
    high_priority_orders = [order for order in orders if order.status == 'pending' and order.is_high_priority]
    non_priority_orders = [order for order in orders if order.status == 'pending' and not order.is_high_priority]

    # Process high-priority orders first in order
    if high_priority_orders:
        print("You must process high-priority orders first.")
        order_id = input("Enter the first high-priority Order ID to process: ")

        # Check if the entered order ID matches the first high-priority order
        first_high_priority_order = high_priority_orders[0]  # the first high priority order
        if order_id == first_high_priority_order.order_id:
            first_high_priority_order.status = 'completed'
            save_orders(orders)
            print(f"Order {order_id} (High Priority) completed.\n")
        else:
            print("Oops! Please You must process orders in sequence. Please check and try again!")
            return

    # Once all high-priority orders are processed, handle non-priority orders
    elif non_priority_orders:
        print("No high-priority orders pending. You can now process non-priority orders.")
        order_id = input("Enter the first non-priority Order ID to process: ")

        # Check if the entered order ID matches the first non-priority order
        first_non_priority_order = non_priority_orders[0]  # the first non-priority order
        if order_id == first_non_priority_order.order_id:
            first_non_priority_order.status = 'completed'
            save_orders(orders)
            print(f"Order {order_id} (Non-Priority) completed.\n")
        else:
            print("Oops! Please process the first non-priority order first. Try again!\n")
    else:
        print("No pending orders to process.\n")

def add_order(orders):
    order_id = input("Enter Order ID: ")
    customer_name = input("Enter Customer Name: ")
    items = input("Enter Items (comma-separated): ").split(',')
    is_high_priority = input("Is this a High-Priority Order? (yes/no): ").lower() == 'yes'

    # Check if the order ID already exists
    if any(order.order_id == order_id for order in orders):
        print(f"Error: Order ID {order_id} already exists.\n")
        return

    new_order = Order(order_id, customer_name, items, is_high_priority)
    orders.append(new_order)
    save_orders(orders)
    print(f"Order {order_id} added successfully.\n")

def main():
    print("Welcome to the Order Management System!")
    orders = load_orders()

    while True:
        print("1. Add a new order")
        print("2. Process orders")
        print("3. View pending orders")
        print("4. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            add_order(orders)
        elif choice == '2':
            process_order(orders)
        elif choice == '3':
            show_pending_orders(orders)
        elif choice == '4':
            print("Exiting the system. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.\n")

        time.sleep(1)  # Check every second to give the user time to interact

if __name__ == "__main__":
    main()
