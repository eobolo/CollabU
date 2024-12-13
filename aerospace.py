import json

# Class for Aircraft Component
class Component:
    def __init__(self, component_id, name, weight, strength, cost, status="under design"):
        self.component_id = component_id
        self.name = name
        self.weight = weight
        self.strength = strength
        self.cost = cost
        self.status = status

    def calculate_cost(self):
        # Formula: Base cost + weight * 5 + strength * 10
        self.cost = 5000 + (self.weight * 5) + (self.strength * 10)

    def display(self):
        return (f"ID: {self.component_id}, Name: {self.name}, Weight: {self.weight}, "
                f"Strength: {self.strength}, Cost: {self.cost}, Status: {self.status}")

# Component Management System
class ComponentManager:
    MAX_WEIGHT = 500  # Maximum allowed weight
    MIN_STRENGTH = 300  # Minimum required strength

    def __init__(self):
        self.components = []
        self.load_components()

    def save_components(self):
        try:
            with open("components.json", "w") as file:
                json.dump([vars(c) for c in self.components], file)
        except Exception as e:
            print(f"Error saving components: {e}")

    def load_components(self):
        try:
            with open("components.json", "r") as file:
                components_data = json.load(file)
                self.components = [Component(**data) for data in components_data]
        except FileNotFoundError:
            self.components = []
        except json.JSONDecodeError:
            print("Error: components.json file is corrupted. Loading empty components list.")
            self.components = []
        except Exception as e:
            print(f"Unexpected error while loading components: {e}")
            self.components = []

    def add_component(self):
        component_id = input("Enter unique component ID: ")
        if any(c.component_id == component_id for c in self.components):
            print("Component ID already exists. Try again.")
            return

        name = input("Enter component name: ")
        try:
            weight = float(input("Enter component weight (kg): "))
            strength = float(input("Enter material strength: "))
        except ValueError:
            print("Invalid input. Weight and strength must be numeric.")
            return

        new_component = Component(component_id, name, weight, strength, 0)
        new_component.calculate_cost()
        self.components.append(new_component)
        self.save_components()
        print(f"Component '{name}' added successfully.")

    def modify_component(self):
        component_id = input("Enter component ID to modify: ")
        component = self.find_component(component_id)
        if not component:
            print("Component not found.")
            return

        if component.status in ["tested", "approved"]:
            print(f"Cannot modify component in '{component.status}' status.")
            choice = input("Do you want to reset the status to 'under design'? (yes/no): ")
            if choice.lower() != "yes":
                return
            component.status = "under design"

        try:
            new_weight = float(input(f"Enter new weight (current: {component.weight}): "))
            new_strength = float(input(f"Enter new material strength (current: {component.strength}): "))
        except ValueError:
            print("Invalid input. Weight and strength must be numeric.")
            return

        component.weight = new_weight
        component.strength = new_strength
        component.calculate_cost()
        self.save_components()
        print("Component modified successfully.")

    def test_component(self):
        component_id = input("Enter component ID to test: ")
        component = self.find_component(component_id)
        if not component:
            print("Component not found.")
            return

        if component.status == "tested":
            print("Component already tested.")
            return

        if component.weight > self.MAX_WEIGHT and component.strength < self.MIN_STRENGTH:
            print("Test FAILED: Weight exceeds the maximum limit and strength is below the threshold.")
            print(f"Suggestions: Reduce weight to below {self.MAX_WEIGHT} and increase strength to at least {self.MIN_STRENGTH}.")
        elif component.weight > self.MAX_WEIGHT:
            print("Test FAILED: Weight exceeds the maximum limit.")
            print(f"Suggestion: Reduce weight to below {self.MAX_WEIGHT}.")
        elif component.strength < self.MIN_STRENGTH:
            print("Test FAILED: Strength is below the minimum threshold.")
            print(f"Suggestion: Increase strength to at least {self.MIN_STRENGTH}.")
        else:
            print("Test PASSED: Component meets all safety requirements.")
            component.status = "tested"
            self.save_components()

    def approve_component(self):
        component_id = input("Enter component ID to approve: ")
        component = self.find_component(component_id)
        if not component:
            print("Component not found.")
            return

        if component.status != "tested":
            print("Only tested components can be approved.")
        else:
            component.status = "approved"
            self.save_components()
            print("Component approved successfully.")

    def view_components(self):
        if not self.components:
            print("No components available.")
            return

        sort_by = input("Sort by 'cost' or 'weight'?: ").lower()
        if sort_by == "cost":
            sorted_components = sorted(self.components, key=lambda c: c.cost)
        elif sort_by == "weight":
            sorted_components = sorted(self.components, key=lambda c: c.weight)
        else:
            print("Invalid choice. Displaying unsorted components.")
            sorted_components = self.components

        print("\n--- Component List ---")
        for component in sorted_components:
            print(component.display())

    def find_component(self, component_id):
        for component in self.components:
            if component.component_id == component_id:
                return component
        return None

    def main_menu(self):
        while True:
            print("\n1. Add Component")
            print("2. Modify Component")
            print("3. Test Component")
            print("4. Approve Component")
            print("5. View Components")
            print("6. Exit")
            choice = input("Enter your choice: ")

            if choice == "1":
                self.add_component()
            elif choice == "2":
                self.modify_component()
            elif choice == "3":
                self.test_component()
            elif choice == "4":
                self.approve_component()
            elif choice == "5":
                self.view_components()
            elif choice == "6":
                print("Exiting the program. Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.")

if __name__ == "__main__":
    manager = ComponentManager()
    manager.main_menu()
