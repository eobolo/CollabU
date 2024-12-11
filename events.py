import json
import os
from datetime import datetime, timedelta

# Event class to define each event
class Event:
    def __init__(self, event_id, event_name, event_datetime, total_seats, ticket_price, available_seats=None, status="active"):
        self.event_id = event_id
        self.event_name = event_name
        self.event_datetime = datetime.strptime(event_datetime, "%Y-%m-%d %H:%M")  # Ensure datetime is parsed
        self.total_seats = total_seats
        self.available_seats = available_seats if available_seats is not None else total_seats  # Default to total_seats
        self.ticket_price = ticket_price
        self.status = status

        # If available seats is zero, mark event as "sold out"
        if self.available_seats == 0:
            self.status = "sold out"
        self.booked_by = []  # List of users who booked tickets for this event

    def to_dict(self):
        return {
            "event_id": self.event_id,
            "event_name": self.event_name,
            "event_datetime": self.event_datetime.strftime("%Y-%m-%d %H:%M"),  # Save as string
            "total_seats": self.total_seats,
            "available_seats": self.available_seats,
            "ticket_price": self.ticket_price,
            "status": self.status
        }

# User class to define each user
class User:
    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name
        self.booked_tickets = []  # List of tickets the user has booked

    def book_ticket(self, event, num_tickets):
        # Check if the user already has tickets for the event
        existing_ticket = next((ticket for ticket in self.booked_tickets if ticket["event_id"] == event.event_id), None)
        
        if event.status == "sold out":
            print("Sorry, this event is sold out.")
            return False
        
        if num_tickets > event.available_seats:
            print(f"Not enough available seats. Only {event.available_seats} seats left.")
            return False
        
        event.available_seats -= num_tickets
        # If seats become zero, mark the event as sold out
        if event.available_seats == 0:
            event.status = "sold out"
        
        if existing_ticket:
            existing_ticket["num_tickets"] += num_tickets  # If the user already has tickets, just update the number
        else:
            ticket_info = {"event_id": event.event_id, "num_tickets": num_tickets, "ticket_price": event.ticket_price}
            self.booked_tickets.append(ticket_info)
        
        event.booked_by.append(self.user_id)
        return True
    
    def cancel_ticket(self, event, num_tickets):
        ticket_to_cancel = next((ticket for ticket in self.booked_tickets if ticket["event_id"] == event.event_id), None)
        
        if not ticket_to_cancel:
            print(f"No tickets booked for event {event.event_name}.")
            return
        
        # If the user booked multiple tickets for the event, adjust the cancellation based on the number
        if num_tickets > ticket_to_cancel["num_tickets"]:
            print("Cannot cancel more tickets than booked.")
            return
        
        # Refund logic: Refund money based on number of tickets and ticket price
        refund_amount = num_tickets * ticket_to_cancel["ticket_price"]
        print(f"Refunded ${refund_amount} for {num_tickets} tickets.")
        
        event.available_seats += num_tickets
        if event.available_seats > 0:
            event.status = "active"
        
        ticket_to_cancel["num_tickets"] -= num_tickets
        if ticket_to_cancel["num_tickets"] == 0:
            self.booked_tickets.remove(ticket_to_cancel)
            event.booked_by.remove(self.user_id)

        # If the user has no more booked tickets, remove them from the system
        if not self.booked_tickets:
            print(f"User {self.name} has no more bookings and has been removed from the system.")
            return True

        return False

    def __str__(self):
        return f"User({self.user_id}, {self.name})"


# Load and save events from JSON
FILE_NAME = "events.json"
USER_FILE_NAME = "users.json"

def load_events():
    if os.path.exists(FILE_NAME) and os.path.getsize(FILE_NAME) > 0:
        with open(FILE_NAME, 'r') as file:
            data = json.load(file)
            return [Event(**event) for event in data]
    return []

def save_events(events):
    with open(FILE_NAME, 'w') as file:
        json.dump([event.to_dict() for event in events], file, indent=4)

def load_users():
    if os.path.exists(USER_FILE_NAME) and os.path.getsize(USER_FILE_NAME) > 0:
        with open(USER_FILE_NAME, 'r') as file:
            data = json.load(file)
            return [User(**user) for user in data]
    return []

def save_users(users):
    with open(USER_FILE_NAME, 'w') as file:
        json.dump([user.__dict__ for user in users], file, indent=4)

# Check if an event has started soon
def is_event_starting_soon(event_datetime):
    current_time = datetime.now()
    return (event_datetime - current_time) <= timedelta(minutes=15)

# Dynamic pricing function
def update_price(event):
    if event.available_seats <= 5 or event.status == "sold out":
        new_price = event.ticket_price * 1.10
        max_price_limit = 1000  # Example price limit
        if new_price <= max_price_limit:
            event.ticket_price = new_price
        else:
            event.ticket_price = max_price_limit

# 1. Add New Event
def add_event(events):
    event_id = input("Enter Event ID: ")
    if any(event.event_id == event_id for event in events):
        print("Event ID already exists. Please try again.")
        return

    event_name = input("Enter Event Name: ")
    event_datetime_str = input("Enter Event Date and Time (YYYY-MM-DD HH:MM): ")
    
    try:
        event_datetime = datetime.strptime(event_datetime_str, "%Y-%m-%d %H:%M")
    except ValueError:
        print("Invalid date format. Please try again.")
        return
    
    # Ensure event is in the future
    if event_datetime < datetime.now():
        print("Event cannot be scheduled in the past.")
        return
    
    total_seats = int(input("Enter Total Seats: "))
    
    # Prevent zero available seats
    if total_seats == 0:
        print("Total seats cannot be zero. Please enter a valid number of seats.")
        return
    
    ticket_price = float(input("Enter Ticket Price: "))
    
    new_event = Event(event_id, event_name, event_datetime_str, total_seats, ticket_price)
    events.append(new_event)
    save_events(events)
    print(f"Event {event_name} scheduled successfully.\n")

# 2. Book Tickets
def book_ticket(events, users):
    user_id = input("Enter User ID: ")
    user = next((user for user in users if user.user_id == user_id), None)
    if not user:
        name = input("Enter your name: ")
        user = User(user_id, name)
        users.append(user)
        save_users(users)

    event_id = input("Enter Event ID to book tickets: ")
    event = next((event for event in events if event.event_id == event_id), None)
    
    if not event:
        print("Event not found.")
        return
    
    # Check if event is starting within 15 minutes
    if is_event_starting_soon(event.event_datetime):
        print(f"Booking not allowed. Event '{event.event_name}' is starting in less than 15 minutes.")
        return

    num_tickets = int(input(f"How many tickets for {event.event_name}: "))
    if not user.book_ticket(event, num_tickets):
        return

    update_price(event)  # Update ticket price dynamically
    save_events(events)
    save_users(users)
    print(f"Booked {num_tickets} tickets for {event.event_name}.\n")


# 3. Cancel Tickets
def cancel_ticket(events, users):
    user_id = input("Enter User ID to cancel tickets: ")
    user = next((user for user in users if user.user_id == user_id), None)
    
    if not user:
        print("User not found.")
        return
    
    event_id = input("Enter Event ID to cancel tickets: ")
    event = next((event for event in events if event.event_id == event_id), None)
    
    if not event:
        print("Event not found.")
        return
    
    # Show the user their bookings for the event
    tickets_to_cancel = [ticket for ticket in user.booked_tickets if ticket["event_id"] == event.event_id]
    
    if not tickets_to_cancel:
        print(f"No tickets booked for event {event.event_name}.")
        return
    
    print(f"Tickets booked for event {event.event_name}:")
    for idx, ticket in enumerate(tickets_to_cancel, start=1):
        print(f"{idx}. {ticket['num_tickets']} tickets at ${ticket['ticket_price']} each.")
    
    # Ask the user how many tickets they want to cancel
    try:
        cancel_choice = int(input("Enter the number of tickets to cancel: "))
        if cancel_choice < 1 or cancel_choice > tickets_to_cancel[0]["num_tickets"]:
            print("Invalid choice. Please try again.")
            return
    except (ValueError, IndexError):
        print("Invalid choice. Please try again.")
        return
    
    # Proceed with refunding the user
    if user.cancel_ticket(event, cancel_choice):
        users.remove(user)
    
    # Save the updated data
    save_events(events)
    save_users(users)
    print(f"Tickets for {event.event_name} have been cancelled.\n")

# 4. Cancel Entire Event
def cancel_event(events, users):
    event_id = input("Enter Event ID to cancel: ")
    event = next((event for event in events if event.event_id == event_id), None)
    
    if not event:
        print("Event not found.")
        return
    
    # Refund all users who booked tickets for the event
    for user_id in event.booked_by:
        user = next((user for user in users if user.user_id == user_id), None)
        if user:
            user.cancel_ticket(event, user.booked_tickets[0]["num_tickets"])
    
    events.remove(event)
    save_events(events)
    save_users(users)
    print(f"Event {event.event_name} has been canceled. All users have been refunded.\n")

# 5. View Events
def view_events(events, sort_by="date"):
    if sort_by == "date":
        events.sort(key=lambda event: event.event_datetime)
    elif sort_by == "price":
        events.sort(key=lambda event: event.ticket_price)
    
    for event in events:
        print(f"Event ID: {event.event_id}, Name: {event.event_name}, Date: {event.event_datetime}, Price: {event.ticket_price}, Status: {event.status}, Available Seats: {event.available_seats}")

# Main function to run the event ticketing system
def main():
    events = load_events()
    users = load_users()
    
    while True:
        print("\n1. Add New Event")
        print("2. Book Ticket")
        print("3. Cancel Ticket")
        print("4. Cancel Event")
        print("5. View Events")
        print("6. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            add_event(events)
        elif choice == '2':
            book_ticket(events, users)
        elif choice == '3':
            cancel_ticket(events, users)
        elif choice == '4':
            cancel_event(events, users)
        elif choice == '5':
            sort_choice = input("Sort events by 'date' or 'price'? ").strip().lower()
            view_events(events, sort_by=sort_choice)
        elif choice == '6':
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
