const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Event class to define each event
class Event {
    constructor(event_id, event_name, event_datetime, total_seats, ticket_price, available_seats = null, status = "active") {
        this.event_id = event_id;  // Unique identifier for the event
        this.event_name = event_name;  // Name of the event
        this.event_datetime = new Date(event_datetime);  // Date and time of the event
        this.total_seats = total_seats;  // Total number of seats available for the event
        this.available_seats = available_seats !== null ? available_seats : total_seats;  // Available seats (defaults to total_seats)
        this.ticket_price = ticket_price;  // Price for a single ticket
        this.status = status;  // Status of the event ("active" or "sold out")
        if (this.available_seats === 0) {
            this.status = "sold out";  // If no seats are available, mark the event as sold out
        }
        this.booked_by = [];  // List of user IDs who have booked tickets for this event
    }

    // Converts the Event object to a dictionary (for saving to JSON)
    to_dict() {
        return {
            event_id: this.event_id,
            event_name: this.event_name,
            event_datetime: this.event_datetime.toISOString().slice(0, 16),  // Save as string format "YYYY-MM-DD HH:MM"
            total_seats: this.total_seats,
            available_seats: this.available_seats,
            ticket_price: this.ticket_price,
            status: this.status
        };
    }
}

// User class to define each user
class User {
    constructor(user_id, name) {
        this.user_id = user_id;  // Unique identifier for the user
        this.name = name;  // Name of the user
        this.booked_tickets = [];  // List of tickets the user has booked
    }

    // Method to book tickets for an event
    book_ticket(event, num_tickets) {
        // Check if the user already has tickets for the event
        const existing_ticket = this.booked_tickets.find(ticket => ticket.event_id === event.event_id);
        
        if (event.status === "sold out") {
            console.log("Sorry, this event is sold out.");
            return false;  // Cannot book tickets for a sold-out event
        }
        
        if (num_tickets > event.available_seats) {
            console.log(`Not enough available seats. Only ${event.available_seats} seats left.`);
            return false;  // Cannot book more tickets than available
        }
        
        event.available_seats -= num_tickets;  // Reduce the number of available seats
        if (event.available_seats === 0) {
            event.status = "sold out";  // If no seats are left, mark event as sold out
        }
        
        // If the user already has tickets for this event, update the number of tickets
        if (existing_ticket) {
            existing_ticket.num_tickets += num_tickets;
        } else {
            // Otherwise, create a new ticket entry for the user
            const ticket_info = {
                event_id: event.event_id,
                num_tickets: num_tickets,
                ticket_price: event.ticket_price
            };
            this.booked_tickets.push(ticket_info);
        }

        event.booked_by.push(this.user_id);  // Add user to the list of people who booked this event
        return true;  // Booking successful
    }

    // Method to cancel previously booked tickets
    cancel_ticket(event, num_tickets) {
        const ticket_to_cancel = this.booked_tickets.find(ticket => ticket.event_id === event.event_id);
        
        if (!ticket_to_cancel) {
            console.log(`No tickets booked for event ${event.event_name}.`);
            return false;  // Cannot cancel tickets for an event that was not booked
        }

        if (num_tickets > ticket_to_cancel.num_tickets) {
            console.log("Cannot cancel more tickets than booked.");
            return false;  // Cannot cancel more tickets than the user has booked
        }

        const refund_amount = num_tickets * ticket_to_cancel.ticket_price;  // Calculate the refund
        console.log(`Refunded $${refund_amount} for ${num_tickets} tickets.`);
        
        event.available_seats += num_tickets;  // Increase available seats as tickets are cancelled
        if (event.available_seats > 0) {
            event.status = "active";  // If there are available seats, mark the event as active
        }
        
        ticket_to_cancel.num_tickets -= num_tickets;  // Update the number of tickets the user has for this event
        if (ticket_to_cancel.num_tickets === 0) {
            // Remove the ticket entry if the user has no tickets left for this event
            this.booked_tickets = this.booked_tickets.filter(ticket => ticket.event_id !== event.event_id);
            // Remove the user from the event's booking list
            event.booked_by = event.booked_by.filter(userId => userId !== this.user_id);
        }

        return true;  // Cancellation successful
    }
}

// Load events from the events.json file and convert them into Event instances
function load_events() {
    if (fs.existsSync(FILE_NAME) && fs.statSync(FILE_NAME).size > 0) {
        const data = JSON.parse(fs.readFileSync(FILE_NAME));
        return data.map(event => new Event(event.event_id, event.event_name, event.event_datetime, event.total_seats, event.ticket_price, event.available_seats, event.status));
    }
    return [];  // Return an empty array if no events file exists or it's empty
}

// Save events to the events.json file
function save_events(events) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(events.map(event => event.to_dict()), null, 4));
}

// Load users from the users.json file and convert them into User instances
function load_users() {
    if (fs.existsSync(USER_FILE_NAME) && fs.statSync(USER_FILE_NAME).size > 0) {
        const data = JSON.parse(fs.readFileSync(USER_FILE_NAME));
        return data.map(user => new User(user.user_id, user.name));
    }
    return [];  // Return an empty array if no users file exists or it's empty
}

// Save users to the users.json file
function save_users(users) {
    fs.writeFileSync(USER_FILE_NAME, JSON.stringify(users, null, 4));
}

// Check if the event is starting soon (within the next 15 minutes)
function is_event_starting_soon(event_datetime) {
    const current_time = new Date();
    return (event_datetime - current_time) <= 15 * 60 * 1000;
}

// Update the ticket price based on available seats (increase by 10% if necessary)
function update_price(event) {
    if (event.available_seats <= 5 || event.status === "sold out") {
        const new_price = event.ticket_price * 1.10;
        const max_price_limit = 1000;  // Max price cap at $1000
        event.ticket_price = new_price <= max_price_limit ? new_price : max_price_limit;
    }
}

// Add a new event to the system
function add_event(events) {
    rl.question("Enter Event ID: ", (event_id) => {
        if (events.some(event => event.event_id === event_id)) {
            console.log("Event ID already exists. Please try again.");
            add_event(events);  // Retry if event ID already exists
            return;
        }

        rl.question("Enter Event Name: ", (event_name) => {
            rl.question("Enter Event Date and Time (YYYY-MM-DD HH:MM): ", (event_datetime_str) => {
                const event_datetime = new Date(event_datetime_str);
                
                if (isNaN(event_datetime)) {
                    console.log("Invalid date format. Please try again.");
                    add_event(events);  // Retry if invalid date format
                    return;
                }

                if (event_datetime < new Date()) {
                    console.log("Event cannot be scheduled in the past.");
                    add_event(events);  // Retry if the event date is in the past
                    return;
                }

                rl.question("Enter Total Seats: ", (total_seats) => {
                    total_seats = parseInt(total_seats);
                    if (total_seats === 0) {
                        console.log("Total seats cannot be zero. Please enter a valid number of seats.");
                        add_event(events);  // Retry if total seats is zero
                        return;
                    }

                    rl.question("Enter Ticket Price: ", (ticket_price) => {
                        ticket_price = parseFloat(ticket_price);
                        const new_event = new Event(event_id, event_name, event_datetime_str, total_seats, ticket_price);
                        events.push(new_event);
                        save_events(events);
                        console.log(`Event ${event_name} scheduled successfully.\n`);
                        main();  // Go back to the main menu
                    });
                });
            });
        });
    });
}

// Book a ticket for a user
function book_ticket(events, users) {
    rl.question("Enter User ID: ", (user_id) => {
        let user = users.find(user => user.user_id === user_id);
        if (!user) {
            rl.question("Enter your name: ", (name) => {
                user = new User(user_id, name);
                users.push(user);
                save_users(users);
                proceed_with_booking(user, events);  // Proceed with booking if new user
            });
        } else {
            proceed_with_booking(user, events);  // Proceed if the user already exists
        }
    });

    // Internal function to handle booking for an existing or new user
    function proceed_with_booking(user, events) {
        rl.question("Enter Event ID to book tickets: ", (event_id) => {
            const event = events.find(event => event.event_id === event_id);
            if (!event) {
                console.log("Event not found.");
                main();
                return;
            }

            if (is_event_starting_soon(event.event_datetime)) {
                console.log(`Booking not allowed. Event '${event.event_name}' is starting in less than 15 minutes.`);
                main();
                return;
            }

            rl.question(`How many tickets for ${event.event_name}: `, (num_tickets) => {
                num_tickets = parseInt(num_tickets);
                if (user.book_ticket(event, num_tickets)) {
                    update_price(event);  // Update ticket price after booking
                    save_events(events);  // Save updated events
                    save_users(users);  // Save updated users
                    console.log(`Booked ${num_tickets} tickets for ${event.event_name}.\n`);
                }
                main();
            });
        });
    }
}

// Cancel tickets for a user
function cancel_ticket(events, users) {
    rl.question("Enter User ID to cancel tickets: ", (user_id) => {
        let user = users.find(user => user.user_id === user_id);
        if (!user) {
            console.log("User not found.");
            main();
            return;
        }

        rl.question("Enter Event ID to cancel tickets: ", (event_id) => {
            const event = events.find(event => event.event_id === event_id);
            if (!event) {
                console.log("Event not found.");
                main();
                return;
            }

            rl.question("Enter number of tickets to cancel: ", (num_tickets) => {
                num_tickets = parseInt(num_tickets);
                if (user.cancel_ticket(event, num_tickets)) {
                    save_events(events);  // Save updated events
                    save_users(users);  // Save updated users
                    console.log(`Cancelled ${num_tickets} tickets for ${event.event_name}.\n`);
                }
                main();
            });
        });
    });
}

// View available events sorted by date or price
function view_events(events) {
    rl.question("Sort by (1) Date or (2) Price: ", (choice) => {
        let sorted_events = [];
        if (choice === '1') {
            sorted_events = events.sort((a, b) => a.event_datetime - b.event_datetime);
        } else if (choice === '2') {
            sorted_events = events.sort((a, b) => a.ticket_price - b.ticket_price);
        }

        console.log("Upcoming Events:");
        sorted_events.forEach(event => {
            console.log(`${event.event_name} - ${event.event_datetime} - $${event.ticket_price} - ${event.available_seats} seats available`);
        });

        main();  // Return to main menu after displaying events
    });
}

// Main menu interface
function main() {
    rl.question("1. Add Event\n2. Book Ticket\n3. Cancel Ticket\n4. View Events\n5. Exit\nChoose an option: ", (choice) => {
        const events = load_events();
        const users = load_users();

        switch (choice) {
            case '1':
                add_event(events);
                break;
            case '2':
                book_ticket(events, users);
                break;
            case '3':
                cancel_ticket(events, users);
                break;
            case '4':
                view_events(events);
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log("Invalid choice. Try again.");
                main();
        }
    });
}

// Start the program by calling main menu
main();
