import tkinter as tk
from tkinter import messagebox
import random
import pygame
import threading
import time

class CountryCapitalGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Country-Capital Matching Game")
        self.root.geometry("800x400")  # Increase window width to fit 10 columns

        # Initialize pygame mixer for sound
        pygame.mixer.init()

        # Game state variables
        self.score = 0
        self.click_count = 0
        self.selected_country = ""
        self.selected_capital = ""
        self.timer_running = True
        self.time_left = 600  # 10 minutes in seconds

        # Country-Capital pairs
        self.capital_dict = {
            "Afghanistan": "Kabul",
            "Argentina": "Buenos Aires",
            "Australia": "Canberra",
            "Austria": "Vienna",
            "Bangladesh": "Dhaka",
            "Belgium": "Brussels",
            "Brazil": "Brasília",
            "Canada": "Ottawa",
            "Chile": "Santiago",
            "China": "Beijing",
            "Colombia": "Bogotá",
            "Czech Republic": "Prague",
            "Denmark": "Copenhagen",
            "Egypt": "Cairo",
            "Finland": "Helsinki",
            "France": "Paris",
            "Germany": "Berlin",
            "Greece": "Athens",
            "Hungary": "Budapest",
            "Iceland": "Reykjavik",
            "India": "New Delhi",
            "Indonesia": "Jakarta",
            "Iran": "Tehran",
            "Iraq": "Baghdad",
            "Ireland": "Dublin",
            "Israel": "Jerusalem",
            "Italy": "Rome",
            "Japan": "Tokyo",
            "Jordan": "Amman",
            "Kenya": "Nairobi",
            "Malaysia": "Kuala Lumpur",
            "Mexico": "Mexico City",
            "Netherlands": "Amsterdam",
            "New Zealand": "Wellington",
            "Nigeria": "Abuja",
            "Norway": "Oslo",
            "Pakistan": "Islamabad",
            "Peru": "Lima",
            "Philippines": "Manila",
            "Poland": "Warsaw",
            "Portugal": "Lisbon",
            "Russia": "Moscow",
            "Saudi Arabia": "Riyadh",
            "South Africa": "Pretoria",
            "South Korea": "Seoul",
            "Spain": "Madrid",
            "Sweden": "Stockholm",
            "Switzerland": "Bern",
            "Turkey": "Ankara",
            "United Kingdom": "London",
            "United States": "Washington, D.C."
        }
        self.items = list(self.capital_dict.items())
        random.shuffle(self.items)

        # Split and shuffle for random placement of buttons
        self.buttons_text = [item[0] for item in self.items] + [item[1] for item in self.items]
        random.shuffle(self.buttons_text)

        # Create timer label
        self.timer_label = tk.Label(self.root, text="Time left: 10:00", font=("Arial", 14))
        self.timer_label.pack(pady=10)

        # Display the score
        self.score_label = tk.Label(self.root, text="Score: 0", font=("Arial", 14))
        self.score_label.pack(pady=10)

        # Message display
        self.message_label = tk.Label(self.root, text="", font=("Arial", 12), fg="green")
        self.message_label.pack(pady=10)

        # Create button frame
        self.button_frame = tk.Frame(self.root)
        self.button_frame.pack(pady=10)

        # Initialize buttons
        self.buttons = {}
        for i, text in enumerate(self.buttons_text):
            btn = tk.Button(self.button_frame, text=text, font=("Arial", 10), width=15, command=lambda t=text: self.button_click(t))
            btn.grid(row=i // 10, column=i % 10, padx=5, pady=5)  # Set 10 columns here
            self.buttons[text] = btn

        # Start the timer thread
        self.start_timer()

    def start_timer(self):
        def countdown():
            while self.time_left > 0 and self.timer_running:
                mins, secs = divmod(self.time_left, 60)
                time_str = f"{mins:02}:{secs:02}"
                self.timer_label.config(text=f"Time left: {time_str}")
                time.sleep(1)
                self.time_left -= 1

            if self.time_left == 0:
                self.end_game("Game Over! Time's up.")
                self.play_sound('gameover.mp3')  # Play game over sound

        timer_thread = threading.Thread(target=countdown)
        timer_thread.start()

    def play_sound(self, file):
        pygame.mixer.music.load(file)
        pygame.mixer.music.play()

    def button_click(self, text):
        if text in self.capital_dict:
            self.selected_country = text
        elif text in self.capital_dict.values():
            self.selected_capital = text

        self.check_match()

    def check_match(self):
        if self.selected_country and self.selected_capital:
            if self.capital_dict[self.selected_country] == self.selected_capital:
                self.score += 1
                self.score_label.config(text=f"Score: {self.score}")
                self.message_label.config(text="Correct Match!", fg="green")
                self.play_sound('success.mp3')  # Correct match sound

                # Change border color to green for matching buttons
                # Change border color to red for non-matching buttons
                self.buttons[self.selected_country].config(bg="#90EE90")
                self.buttons[self.selected_capital].config(bg="#90EE90")


                # Disable matched buttons
                self.buttons[self.selected_country].config(state="disabled", highlightcolor="black")
                self.buttons[self.selected_capital].config(state="disabled", highlightcolor="black")

                # Check for game end
                if self.score == len(self.capital_dict):
                    self.end_game("Congratulations! You've matched all pairs!")

            else:
                self.message_label.config(text="Incorrect Match!", fg="red")
                self.play_sound('error.mp3')  # Incorrect match sound

                # Change border color to red for non-matching buttons
                self.buttons[self.selected_country].config(bg="red")
                self.buttons[self.selected_capital].config(bg="red")

            # Reset selections after a delay
            self.root.after(500, self.reset_button_color)
    def reset_button_color(self):
        # Reset selections and border colors
        self.buttons[self.selected_country].config(bg="SystemButtonFace")
        self.buttons[self.selected_capital].config(bg="SystemButtonFace")
        self.selected_country = ""
        self.selected_capital = ""
        for btn in self.buttons.values():
            btn.config(highlightbackground="black", highlightcolor="black")  # Reset border color to default

    def end_game(self, message):
        self.timer_running = False
        messagebox.showinfo("Game Over", message)

# Run the game
root = tk.Tk()
game = CountryCapitalGame(root)
root.mainloop()