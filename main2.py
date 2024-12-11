import tkinter as tk
import random

class SlidingPuzzle:
    """
    A 3x3 sliding puzzle game implemented using Tkinter. The puzzle consists of 8 numbered tiles 
    and one empty space. The objective is to arrange the tiles in ascending numerical order 
    by sliding adjacent tiles into the empty space.

    Attributes:
        master (tk.Tk): The root Tkinter window for the puzzle game.
        tiles (list of list of str): A 3x3 grid representing the current arrangement of the tiles.
        buttons (list of list of tk.Button): A 3x3 grid of Tkinter buttons representing the tiles on the UI.
        empty_row (int): The row index of the empty space.
        empty_col (int): The column index of the empty space.
    """

    def __init__(self, master):
        """Initialize the sliding puzzle with a 3x3 grid and set up the UI."""
        self.master = master
        self.master.title("Sliding Puzzle")

        # Initialize the tiles in a 3x3 grid, with the last tile as an empty space
        self.tiles = [[str(i + j * 3 + 1) for i in range(3)] for j in range(3)]
        self.tiles[2][2] = ""  # Set the last tile as the empty space

        # Create a 3x3 grid for Tkinter buttons to represent each tile
        self.buttons = [[None] * 3 for _ in range(3)]

        # Track the location of the empty space
        self.empty_row = 2
        self.empty_col = 2

        # Set up the initial UI
        self.create_ui()

    def create_ui(self):
        """Create the user interface with tile buttons and a shuffle button."""
        for i in range(3):
            for j in range(3):
                # Create a button for each tile with a command to move the tile
                self.buttons[i][j] = tk.Button(
                    self.master, 
                    text=self.tiles[i][j], 
                    font=("Helvetica", 32), 
                    width=4, 
                    height=2, 
                    command=lambda r=i, c=j: self.move_tile(r, c)
                )
                self.buttons[i][j].grid(row=i, column=j)  # Place button in the grid

        # Create a shuffle button to randomly shuffle the tiles
        tk.Button(
            self.master, 
            text="Shuffle", 
            font=("Helvetica", 16), 
            command=self.shuffle
        ).grid(row=3, columnspan=3)

    def shuffle(self):
        """Shuffle the puzzle by making random moves to mix the tiles."""
        for _ in range(100):
            # Define possible directions for moving the empty space
            directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
            dr, dc = random.choice(directions)
            
            # Calculate the new position of the empty space
            new_row, new_col = self.empty_row + dr, self.empty_col + dc

            # Check if the new position is within the bounds of the grid
            if 0 <= new_row < 3 and 0 <= new_col < 3:
                # Swap the empty space with the tile in the new position
                self.tiles[self.empty_row][self.empty_col], self.tiles[new_row][new_col] = \
                    self.tiles[new_row][new_col], self.tiles[self.empty_row][self.empty_col]

                # Update button text to reflect the new tile positions
                self.buttons[self.empty_row][self.empty_col]['text'] = self.tiles[self.empty_row][self.empty_col]
                self.buttons[new_row][new_col]['text'] = self.tiles[new_row][new_col]

                # Update the position of the empty space
                self.empty_row, self.empty_col = new_row, new_col

    def move_tile(self, row, col):
        """
        Move a tile into the empty space if it is adjacent to the empty space.

        Args:
            row (int): The row index of the tile to move.
            col (int): The column index of the tile to move.
        """
        # Only move if the tile is adjacent to the empty space
        if abs(row - self.empty_row) + abs(col - self.empty_col) == 1:
            # Swap the selected tile with the empty space
            self.tiles[self.empty_row][self.empty_col], self.tiles[row][col] = \
                self.tiles[row][col], self.tiles[self.empty_row][self.empty_col]

            # Update button text to reflect the new tile positions
            self.buttons[self.empty_row][self.empty_col]['text'] = self.tiles[self.empty_row][self.empty_col]
            self.buttons[row][col]['text'] = self.tiles[row][col]

            # Update the position of the empty space
            self.empty_row, self.empty_col = row, col

            # Check if the puzzle is solved
            self.check_win()

    def check_win(self):
        """Check if the puzzle is in a winning state and display a congratulatory message if so."""
        # Define the winning configuration of the tiles
        win_condition = [[str(i + j * 3 + 1) for i in range(3)] for j in range(3)]
        win_condition[2][2] = ""

        # Check if the current tile configuration matches the winning configuration
        if self.tiles == win_condition:
            # Display a congratulatory message if the puzzle is solved
            tk.Label(self.master, text="Congratulations!!", font=("Helvetica", 16)).grid(row=4, columnspan=3)


# Initialize and start the Tkinter event loop
root = tk.Tk()
app = SlidingPuzzle(root)
root.mainloop()