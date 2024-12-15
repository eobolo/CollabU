import unittest
import json
import os
from shutil import rmtree

class TestOrderManagementSystem(unittest.TestCase):

    def setUp(self):
        # Set up a clean environment by removing any existing order files
        if os.path.exists('orders.json'):
            os.remove('orders.json')
        
    def tearDown(self):
        # Clean up the environment after each test
        if os.path.exists('orders.json'):
            os.remove('orders.json')
    
    # Normal scenarios

    def test_add_valid_order(self):
        add_order([])
        orders = load_orders()
        self.assertEqual(len(orders), 1)
        self.assertEqual(orders[0].status, 'pending')

    def test_process_high_priority_order(self):
        order1 = Order(order_id='001', customer_name='Alice', items=['Item1'], is_high_priority=True)
        order2 = Order(order_id='002', customer_name='Bob', items=['Item2'], is_high_priority=False)
        orders = [order1, order2]
        save_orders(orders)

        process_order(load_orders())

        orders = load_orders()
        self.assertEqual(orders[0].status, 'completed')
        self.assertEqual(orders[1].status, 'pending')

    # Edge cases

    def test_add_order_with_no_items(self):
        add_order([])
        orders = load_orders()
        self.assertEqual(orders[0].items, [])

    def test_add_large_order(self):
        items = [f'Item{i}' for i in range(100)]  # 100 items
        add_order([], items=items)
        orders = load_orders()
        self.assertEqual(len(orders[0].items), 100)

    def test_add_order_with_invalid_chars_in_name(self):
        add_order([], customer_name='!@#$%^&*()')
        orders = load_orders()
        self.assertEqual(orders[0].customer_name, '!@#$%^&*()')

    # Error cases

    def test_add_duplicate_order_id(self):
        add_order([])
        with self.assertRaises(SystemExit) as cm:  # Assuming add_order should terminate with an error message
            add_order([], order_id='001')  # Duplicate order ID
        self.assertEqual(cm.exception.code, 1)  # Custom exit code or handling is needed in real code

    def test_load_corrupted_orders_file(self):
        # Create a corrupted file
        with open('orders.json', 'w') as file:
            file.write('Invalid JSON data')

        orders = load_orders()
        self.assertEqual(orders, [])  # Expect an empty list due to error handling

if __name__ == '__main__':
    unittest.main(argv=[''], exit=False)
