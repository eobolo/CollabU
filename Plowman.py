import tkinter as tk
from tkinter import messagebox
import math

def calculate_best_combination():
    try:
        # Retrieve user inputs
        package_a_items = int(entry_package_a_items.get())
        package_a_cost = float(entry_package_a_cost.get())
        package_b_items = int(entry_package_b_items.get())
        package_b_cost = float(entry_package_b_cost.get())
        target_items = int(entry_target_items.get())

        # Initialize variables for the best combination
        min_cost = float('inf')
        best_combination = (0, 0, float('inf'))  # (num_a, num_b, unused_items)

        for x in range(target_items // package_a_items + 1):
            remaining_items = target_items - (x * package_a_items)
            if remaining_items < 0:
                break
            y = math.ceil(remaining_items / package_b_items)

            total_items_bought = (x * package_a_items) + (y * package_b_items)
            total_cost = (x * package_a_cost) + (y * package_b_cost)
            unused_items = total_items_bought - target_items

            if total_cost < min_cost or (total_cost == min_cost and unused_items < best_combination[2]):
                min_cost = total_cost
                best_combination = (x, y, unused_items)

        # Display results
        num_a, num_b, unused_items = best_combination
        result_text.set(f"Best combination:\n"
                        f"Package A: {num_a} ({package_a_items} items each)\n"
                        f"Package B: {num_b} ({package_b_items} items each)\n"
                        f"Total Cost: ${min_cost:.2f}\n"
                        f"Unused Items: {unused_items}")

    except ValueError:
        messagebox.showerror("Input Error", "Please enter valid numbers for all fields.")

# Create the main tkinter window
root = tk.Tk()
root.title("Package Optimizer")

# Input fields
frame_inputs = tk.Frame(root)
frame_inputs.pack(pady=10)

tk.Label(frame_inputs, text="Package A - Items:").grid(row=0, column=0, padx=5, pady=5, sticky="e")
entry_package_a_items = tk.Entry(frame_inputs)
entry_package_a_items.grid(row=0, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Package A - Cost:").grid(row=1, column=0, padx=5, pady=5, sticky="e")
entry_package_a_cost = tk.Entry(frame_inputs)
entry_package_a_cost.grid(row=1, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Package B - Items:").grid(row=2, column=0, padx=5, pady=5, sticky="e")
entry_package_b_items = tk.Entry(frame_inputs)
entry_package_b_items.grid(row=2, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Package B - Cost:").grid(row=3, column=0, padx=5, pady=5, sticky="e")
entry_package_b_cost = tk.Entry(frame_inputs)
entry_package_b_cost.grid(row=3, column=1, padx=5, pady=5)

tk.Label(frame_inputs, text="Target Items:").grid(row=4, column=0, padx=5, pady=5, sticky="e")
entry_target_items = tk.Entry(frame_inputs)
entry_target_items.grid(row=4, column=1, padx=5, pady=5)

# Button to calculate
btn_calculate = tk.Button(root, text="Calculate Best Combination", command=calculate_best_combination)
btn_calculate.pack(pady=10)

# Output field
frame_output = tk.Frame(root)
frame_output.pack(pady=10)

result_text = tk.StringVar()
result_label = tk.Label(frame_output, textvariable=result_text, justify="left", font=("Arial", 12))
result_label.pack()

# Start the application
root.mainloop()






Prompt 1: The community sports council is organizing a 6-day marathon event and as a member of the organizing committee, I have been tasked with shopping for items needed. I need to buy exactly 100 items and I have two options, Package A and Package B.

I want you to help me write a Python application that can determine the combination of packages that minimizes cost. If both combinations have the same cost, the application should explain which one provides better value in terms of unused items. The values for Package A and Package B (number of items, and cost of package) should be received as user input.


import math

def find_best_package_combination():
    # Get user inputs for package details
    package_a_items = int(input("Enter the number of items in Package A: "))
    package_a_cost = float(input("Enter the cost of Package A: "))
    package_b_items = int(input("Enter the number of items in Package B: "))
    package_b_cost = float(input("Enter the cost of Package B: "))
    total_items = 100

    # Solve analytically for x (number of Package A) and y (number of Package B)
    # Let x be the number of Package A units, y be the number of Package B units
    min_cost = float('inf')
    best_combination = (0, 0, float('inf'))  # (num_a, num_b, unused_items)

    for x in range(total_items // package_a_items + 1):
        # Calculate y to satisfy the total_items constraint
        remaining_items = total_items - (x * package_a_items)
        if remaining_items < 0:
            break  # x is too large
        y = math.ceil(remaining_items / package_b_items)

        # Calculate cost and unused items
        total_items_bought = (x * package_a_items) + (y * package_b_items)
        total_cost = (x * package_a_cost) + (y * package_b_cost)
        unused_items = total_items_bought - total_items

        # Check if this is the best solution
        if total_cost < min_cost or (total_cost == min_cost and unused_items < best_combination[2]):
            min_cost = total_cost
            best_combination = (x, y, unused_items)

    # Display the result
    num_a, num_b, unused_items = best_combination
    print(f"\nBest combination:")
    print(f"  Package A: {num_a} ({package_a_items} items each)")
    print(f"  Package B: {num_b} ({package_b_items} items each)")
    print(f"  Total Cost: ${min_cost:.2f}")
    print(f"  Unused Items: {unused_items}")

if __name__ == "__main__":
    find_best_package_combination()






























def find_best_package_combination():
    # Get user inputs for package details
    package_a_items = int(input("Enter the number of items in Package A: "))
    package_a_cost = float(input("Enter the cost of Package A: "))
    package_b_items = int(input("Enter the number of items in Package B: "))
    package_b_cost = float(input("Enter the cost of Package B: "))
    total_items = 100  # Fixed target for the problem

    min_cost = float('inf')
    best_combinations = []

    # Iterate through possible combinations of Package A and Package B
    for num_a in range(total_items // package_a_items + 1):  # Max possible A packages
        for num_b in range(total_items // package_b_items + 1):  # Max possible B packages
            total_items_bought = num_a * package_a_items + num_b * package_b_items
            if total_items_bought >= total_items:  # Valid combinations
                total_cost = num_a * package_a_cost + num_b * package_b_cost
                unused_items = total_items_bought - total_items

                # Check if this combination has a lower cost
                if total_cost < min_cost:
                    min_cost = total_cost
                    best_combinations = [(num_a, num_b, unused_items)]
                elif total_cost == min_cost:
                    best_combinations.append((num_a, num_b, unused_items))

    # If there are multiple combinations with the same cost, choose based on fewer unused items
    best_combinations.sort(key=lambda x: x[2])  # Sort by unused items
    best_choice = best_combinations[0]

    # Display the results
    num_a, num_b, unused_items = best_choice
    print(f"\nBest combination:")
    print(f"  Package A: {num_a} ({package_a_items} items each)")
    print(f"  Package B: {num_b} ({package_b_items} items each)")
    print(f"  Total Cost: ${min_cost:.2f}")
    print(f"  Unused Items: {unused_items}")

    if len(best_combinations) > 1:
        print("\nNote: Other combinations with the same cost but more unused items:")
        for combination in best_combinations[1:]:
            print(f"  Package A: {combination[0]}, Package B: {combination[1]}, Unused Items: {combination[2]}")

if __name__ == "__main__":
    find_best_package_combination()



=============================================================================MIND MAPPING TOOL=====================================================================


import sys
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QGraphicsScene, QGraphicsView, QGraphicsEllipseItem,
    QGraphicsLineItem, QGraphicsTextItem, QToolBar, QAction, QColorDialog, QFileDialog
)
from PyQt5.QtGui import QPen, QBrush, QColor, QImage, QPainter
from PyQt5.QtCore import Qt, QPointF
import json

class MindMapApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Advanced Mind Mapping Tool")
        self.setGeometry(100, 100, 1200, 800)

        # Scene and View
        self.scene = QGraphicsScene(self)
        self.view = QGraphicsView(self.scene, self)
        self.setCentralWidget(self.view)

        # Toolbar
        self.init_toolbar()

        # Node and Link management
        self.selected_color = QColor(Qt.white)
        self.current_nodes = []
        self.current_links = []

    def init_toolbar(self):
        toolbar = QToolBar("Main Toolbar", self)
        self.addToolBar(toolbar)

        # Add Node Action
        add_node_action = QAction("Add Node", self)
        add_node_action.triggered.connect(self.add_node)
        toolbar.addAction(add_node_action)

        # Change Node Color
        color_action = QAction("Change Color", self)
        color_action.triggered.connect(self.change_color)
        toolbar.addAction(color_action)

        # Save/Load
        save_action = QAction("Save", self)
        save_action.triggered.connect(self.save_map)
        toolbar.addAction(save_action)

        load_action = QAction("Load", self)
        load_action.triggered.connect(self.load_map)
        toolbar.addAction(load_action)

        # Export to Image
        export_action = QAction("Export as Image", self)
        export_action.triggered.connect(self.export_as_image)
        toolbar.addAction(export_action)

    def add_node(self):
        # Create a basic node
        node = QGraphicsEllipseItem(0, 0, 100, 50)
        node.setBrush(QBrush(self.selected_color))
        node.setFlag(QGraphicsEllipseItem.ItemIsMovable)
        node.setFlag(QGraphicsEllipseItem.ItemIsSelectable)

        # Add text to the node
        text = QGraphicsTextItem("Node")
        text.setDefaultTextColor(Qt.black)
        text.setParentItem(node)
        text.setPos(25, 15)

        self.scene.addItem(node)
        self.current_nodes.append(node)

    def change_color(self):
        # Select color for new nodes
        color = QColorDialog.getColor()
        if color.isValid():
            self.selected_color = color

    def save_map(self):
        # Save map to a file (e.g., JSON)
        file_path, _ = QFileDialog.getSaveFileName(self, "Save Mind Map", "", "JSON Files (*.json)")
        if file_path:
            data = []
            for node in self.current_nodes:
                pos = node.scenePos()
                color = node.brush().color().name()
                data.append({
                    'x': pos.x(),
                    'y': pos.y(),
                    'color': color,
                    'text': node.childItems()[0].toPlainText()
                })
            with open(file_path, 'w') as file:
                json.dump(data, file, indent=4)

    def load_map(self):
        # Load map from a file (e.g., JSON)
        file_path, _ = QFileDialog.getOpenFileName(self, "Open Mind Map", "", "JSON Files (*.json)")
        if file_path:
            with open(file_path, 'r') as file:
                data = json.load(file)
                self.scene.clear()
                self.current_nodes = []
                for item in data:
                    node = QGraphicsEllipseItem(0, 0, 100, 50)
                    node.setBrush(QBrush(QColor(item['color'])))
                    node.setPos(QPointF(item['x'], item['y']))
                    node.setFlag(QGraphicsEllipseItem.ItemIsMovable)
                    node.setFlag(QGraphicsEllipseItem.ItemIsSelectable)

                    text = QGraphicsTextItem(item['text'])
                    text.setDefaultTextColor(Qt.black)
                    text.setParentItem(node)
                    text.setPos(25, 15)

                    self.scene.addItem(node)
                    self.current_nodes.append(node)

    def export_as_image(self):
        # Export the scene as an image
        file_path, _ = QFileDialog.getSaveFileName(self, "Export as Image", "", "PNG Files (*.png)")
        if file_path:
            rect = self.scene.sceneRect()
            image = QImage(rect.width(), rect.height(), QImage.Format_ARGB32)
            image.fill(Qt.white)

            painter = QPainter(image)
            self.scene.render(painter)
            painter.end()

            image.save(file_path)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MindMapApp()
    window.show()
    sys.exit(app.exec_())

