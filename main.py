"""
Sliding Puzzle Game

A 3x3 sliding puzzle game implemented using Tkinter.
"""

import tkinter as tk
import random


class SlidingPuzzle:
    """
    Represents the sliding puzzle game.

    Attributes:
        master (tk.Tk): The root window of the game.
        tiles (list): A 3x3 list of strings representing the tiles.
        buttons (list): A 3x3 list of tk.Button objects representing the tiles.
        empty_row (int): The row index of the empty tile.
        empty_col (int): The column index of the empty tile.
    """

    def __init__(self, master):
        """
        Initializes the game.

        Args:
            master (tk.Tk): The root window of the game.
        """
        self.master = master
        self.master.title("Sliding Puzzle")
        self.tiles = [[str(i + j * 3 + 1) for i in range(3)] for j in range(3)]
        self.tiles[2][2] = ""  # Initialize the empty tile
        self.buttons = [[None] * 3 for _ in range(3)]
        self.empty_row = 2
        self.empty_col = 2
        self.create_ui()

    def create_ui(self):
        """
        Creates the game's user interface.
        """
        # Create the tile buttons
        for i in range(3):
            for j in range(3):
                self.buttons[i][j] = tk.Button(
                    self.master,
                    text=self.tiles[i][j],
                    font=("Helvetica", 32),
                    width=4,
                    height=2,
                    command=lambda r=i, c=j: self.move_tile(r, c)
                )
                self.buttons[i][j].grid(row=i, column=j)

        # Create the shuffle button
        tk.Button(
            self.master,
            text="Shuffle",
            font=("Helvetica", 16),
            command=self.shuffle
        ).grid(row=3, columnspan=3)

    def shuffle(self):
        """
        Shuffles the tiles randomly.
        """
        for _ in range(100):
            # Choose a random direction (up, down, left, or right)
            directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
            dr, dc = random.choice(directions)
            new_row, new_col = self.empty_row + dr, self.empty_col + dc

            # Check if the new position is within the grid boundaries
            if 0 <= new_row < 3 and 0 <= new_col < 3:
                # Swap the tiles
                self.tiles[self.empty_row][self.empty_col],\
                    self.tiles[new_row][new_col] =\
                    self.tiles[new_row][new_col],\
                    self.tiles[self.empty_row][self.empty_col]
                self.buttons[self.empty_row][self.empty_col]['text'] =\
                    self.tiles[self.empty_row][self.empty_col]
                self.buttons[new_row][new_col]['text'] =\
                    self.tiles[new_row][new_col]
                self.empty_row, self.empty_col = new_row, new_col

    def move_tile(self, row, col):
        """
        Moves a tile to the empty position.

        Args:
            row (int): The row index of the tile to move.
            col (int): The column index of the tile to move.
        """
        # Check if the tile is adjacent to the empty position
        if abs(row - self.empty_row) + abs(col - self.empty_col) == 1:
            # Swap the tiles
            self.tiles[self.empty_row][self.empty_col],\
                self.tiles[row][col] = self.tiles[row][col],\
                self.tiles[self.empty_row][self.empty_col]
            self.buttons[self.empty_row][self.empty_col]['text'] =\
                self.tiles[self.empty_row][self.empty_col]
            self.buttons[row][col]['text'] = self.tiles[row][col]
            self.empty_row, self.empty_col = row, col
            self.check_win()

    def check_win(self):
        """
        Checks if the game is won.

        Displays a congratulatory message if the game is won.
        """
        # Define the winning condition
        win_condition =\
            [[str(i + j * 3 + 1) for i in range(3)] for j in range(3)]
        win_condition[2][2] = ""

        # Check if the tiles match the winning condition
        if self.tiles == win_condition:
            # Display a congratulatory message
            tk.Label(
                self.master,
                text="Congratulations!!",
                font=("Helvetica", 16)
            ).grid(row=4, columnspan=3)


if __name__ == "__main__":
    root = tk.Tk()
    app = SlidingPuzzle(root)
    root.mainloop()