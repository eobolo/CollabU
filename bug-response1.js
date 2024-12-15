import unittest
import json
import os
import tempfile

class TestOrderManagementSystem(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory for test files
        self.temp_dir = tempfile.TemporaryDirectory()
        # Set the file path within the temporary directory
        self.orders_file = os.path.join(self.temp_dir.name, 'orders.json')
        # Clear any existing data
        with open(self.orders_file, 'w') as file:
            json.dump([], file)

    def tearDown(self):
        # Remove the temporary directory and all its contents
        self.temp_dir.cleanup()

    def test_load_orders_empty(self):
        # Ensure loading an empty file works correctly
        orders = load_orders(file_path=self.orders_file)
        self.assertEqual(len(orders), 0)

    def test_load_orders_single(self):
        # Save a single order to the file
        save_orders([Order('001', 'John Doe', ['item1', 'item2'], True)], file_path=self.orders_file)
        # Load orders and verify correctness
        orders = load_orders(file_path=self.orders_file)
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0].order_id, '001')
        self.assertEqual(orders[0].customer_name, 'John Doe')
        self.assertEqual(orders[0].items, ['item1', 'item2'])
        self.assertTrue(orders[0].is_high_priority)

    def test_save_orders_multiple(self):
        # Save multiple orders to the file
        save_orders([Order('001', 'John Doe', ['item1', 'item2'], True), 
                     Order('002', 'Jane Smith', ['item3'], False)], 
                    file_path=self.orders_file)
        # Load and verify the saved orders
        orders = load_orders(file_path=self.orders_file)
        self.assertEqual(len(orders), 2)
        self.assertEqual(orders[0].order_id, '001')
        self.assertEqual(orders[1].order_id, '002')

    def test_show_pending_orders(self):
        # Save some orders
        save_orders([Order('001', 'John Doe', ['item1', 'item2'], True), 
                     Order('002', 'Jane Smith', ['item3'], False)], 
                    file_path=self.orders_file)
        # Load orders and show pending
        orders = load_orders(file_path=self.orders_file)
        show_pending_orders(orders)
        self.assertEqual(len(orders), 2)
        # Assert that the first order is high priority
        self.assertTrue(orders[0].is_high_priority)

    def test_process_order_high_priority(self):
        # Save a high-priority order
        save_orders([Order('001', 'John Doe', ['item1', 'item2'], True)], 
                    file_path=self.orders_file)
        # Load and process the order
        orders = load_orders(file_path=self.orders_file)
        process_order(orders)
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0].status, 'completed')

    def test_process_order_non_priority(self):
        # Save a non-priority order
        save_orders([Order('001', 'John Doe', ['item1', 'item2'], False)], 
                    file_path=self.orders_file)
        # Load and process the order
        orders = load_orders(file_path=self.orders_file)
        process_order(orders)
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0].status, 'completed')

    def test_add_order_valid(self):
        # Add a valid order
        save_orders([], file_path=self.orders_file)
        add_order(orders=[], file_path=self.orders_file)
        orders = load_orders(file_path=self.orders_file)
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0].order_id, '001')

    def test_add_order_duplicate(self):
        # Add a valid order
        save_orders([Order('001', 'John Doe', ['item1', 'item2'], True)], 
                    file_path=self.orders_file)
        add_order(orders=[], file_path=self.orders_file)
        orders = load_orders(file_path=self.orders_file)
        self.assertEqual(len(orders), 1)

    def test_add_order_empty_items(self):
        # Add an order with empty items
        save_orders([], file_path=self.orders_file)
        add_order(orders=[], file_path=self.orders_file, items='')
        orders = load_orders(file_path=self.orders_file)
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0].items, [])

    def test_load_orders_corrupted(self):
        # Corrupt the order file
        with open(self.orders_file, 'w') as file:
            file.write('Invalid JSON')
        # Load orders and check for handling
        orders = load_orders(file_path=self.orders_file)
        self.assertEqual(len(orders), 0)

# To run the tests, execute the following line in your terminal or command prompt:
# python -m unittest test_order_management_system.TestOrderManagementSystem
