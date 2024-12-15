import unittest
import json
import os
from tempfile import TemporaryDirectory
from shutil import copyfile

# Path to the original code file
original_orders_path = 'orders.json'

class TestOrderManagementSystem(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory to run tests without affecting real files
        self.temp_dir = TemporaryDirectory()
        self.temp_orders_path = os.path.join(self.temp_dir.name, 'orders.json')
        
        # Copy the original orders file to the temp directory to start with valid data
        copyfile(original_orders_path, self.temp_orders_path)

    def tearDown(self):
        # Clean up the temporary directory
        self.temp_dir.cleanup()

    def test_order_init(self):
        order = Order(1, "John Doe", ["item1", "item2"], True)
        self.assertEqual(order.order_id, 1)
        self.assertEqual(order.customer_name, "John Doe")
        self.assertEqual(order.items, ["item1", "item2"])
        self.assertTrue(order.is_high_priority)
        self.assertEqual(order.status, 'pending')

    def test_load_orders(self):
        orders = load_orders(self.temp_orders_path)
        self.assertIsInstance(orders, list)
        self.assertGreater(len(orders), 0)

    def test_load_orders_empty_file(self):
        with open(self.temp_orders_path, 'w') as file:
            file.write('')
        
        orders = load_orders(self.temp_orders_path)
        self.assertEqual(orders, [])

    def test_load_orders_corrupted_file(self):
        with open(self.temp_orders_path, 'w') as file:
            file.write('invalid json')
        
        orders = load_orders(self.temp_orders_path)
        self.assertEqual(orders, [])

    def test_save_orders(self):
        orders = load_orders(self.temp_orders_path)
        new_order = Order(100, "New Customer", ["new item"], False)
        orders.append(new_order)
        save_orders(orders, self.temp_orders_path)

        with open(self.temp_orders_path, 'r') as file:
            saved_orders = json.load(file)
        
        self.assertEqual(len(saved_orders), len(orders))
        self.assertIn(new_order.to_dict(), saved_orders)

    def test_add_order(self):
        orders = load_orders(self.temp_orders_path)
        original_length = len(orders)
        
        add_order(orders, self.temp_orders_path, 101, "New Customer", ["new item"], False)
        
        self.assertEqual(len(orders), original_length + 1)
        self.assertIn(Order(101, "New Customer", ["new item"], False).to_dict(), [order.to_dict() for order in orders])

    def test_add_order_duplicate_id(self):
        orders = load_orders(self.temp_orders_path)
        original_length = len(orders)
        
        first_order = orders[0]
        
        add_order(orders, self.temp_orders_path, first_order.order_id, "New Customer", ["new item"], False)
        
        self.assertEqual(len(orders), original_length)

    def test_show_pending_orders(self):
        orders = load_orders(self.temp_orders_path)
        pending_orders = [order for order in orders if order.status == 'pending']
        show_pending_orders(pending_orders)

    def test_process_order(self):
        # Simulate input for testing
        def mock_input(prompt):
            if "Order ID" in prompt:
                return "1"
            return None
        
        with unittest.mock.patch('builtins.input', side_effect=mock_input):
            orders = load_orders(self.temp_orders_path)
            first_order = orders[0]
            
            process_order(orders, self.temp_orders_path)
            
            self.assertEqual(orders[0].status, 'completed')

    def test_process_order_invalid_input(self):
        # Simulate invalid input for testing
        def mock_input(prompt):
            if "Order ID" in prompt:
                return "1000"  # Invalid order ID
            return None
        
        with unittest.mock.patch('builtins.input', side_effect=mock_input):
            orders = load_orders(self.temp_orders_path)
            
            process_order(orders, self.temp_orders_path)
            
            self.assertEqual(orders[0].status, 'pending')

if __name__ == "__main__":
    unittest.main(argv=[''], exit=False)
