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
        this.event_id = event_id;
        this.event_name = event_name;
        this.event_datetime = new Date(event_datetime);  // Convert string to Date
        this.total_seats = total_seats;
        this.available_seats = available_seats !== null ? available_seats : total_seats;  // Default to total_seats
        this.ticket_price = ticket_price;
        this.status = status;
        if (this.available_seats === 0) {
            this.status = "sold out";
        }
        this.booked_by = [];  // List of users who booked tickets for this event
    }

    to_dict() {
        return {
            event_id: this.event_id,
            event_name: this.event_name,
            event_datetime: this.event_datetime.toISOString().slice(0, 16),  // Save as string
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
        this.user_id = user_id;
        this.name = name;
        this.booked_tickets = [];  // List of tickets the user has booked
    }

    book_ticket(event, num_tickets) {
        // Check if the user already has tickets for the event
        const existing_ticket = this.booked_tickets.find(ticket => ticket.event_id === event.event_id);
        
        if (event.status === "sold out") {
            console.log("Sorry, this event is sold out.");
            return false;
        }
        
        if (num_tickets > event.available_seats) {
            console.log(`Not enough available seats. Only ${event.available_seats} seats left.`);
            return false;
        }
        
        event.available_seats -= num_tickets;
        if (event.available_seats === 0) {
            event.status = "sold out";
        }
        
        if (existing_ticket) {
            existing_ticket.num_tickets += num_tickets;  // Update the number of tickets for an existing booking
        } else {
            const ticket_info = {
                event_id: event.event_id,
                num_tickets: num_tickets,
                ticket_price: event.ticket_price
            };
            this.booked_tickets.push(ticket_info);
        }

        event.booked_by.push(this.user_id);
        return true;
    }

    cancel_ticket(event, num_tickets) {
        const ticket_to_cancel = this.booked_tickets.find(ticket => ticket.event_id === event.event_id);
        
        if (!ticket_to_cancel) {
            console.log(`No tickets booked for event ${event.event_name}.`);
            return false;
        }

        if (num_tickets > ticket_to_cancel.num_tickets) {
            console.log("Cannot cancel more tickets than booked.");
            return false;
        }

        const refund_amount = num_tickets * ticket_to_cancel.ticket_price;
        console.log(`Refunded $${refund_amount} for ${num_tickets} tickets.`);
        
        event.available_seats += num_tickets;
        if (event.available_seats > 0) {
            event.status = "active";
        }
        
        ticket_to_cancel.num_tickets -= num_tickets;
        if (ticket_to_cancel.num_tickets === 0) {
            this.booked_tickets = this.booked_tickets.filter(ticket => ticket.event_id !== event.event_id);
            event.booked_by = event.booked_by.filter(userId => userId !== this.user_id);
        }

        return true;
    }
}

// Load and save events from JSON
const FILE_NAME = "events.json";
const USER_FILE_NAME = "users.json";

function load_events() {
    if (fs.existsSync(FILE_NAME) && fs.statSync(FILE_NAME).size > 0) {
        const data = JSON.parse(fs.readFileSync(FILE_NAME));
        return data.map(event => new Event(event.event_id, event.event_name, event.event_datetime, event.total_seats, event.ticket_price, event.available_seats, event.status));
    }
    return [];
}

function save_events(events) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(events.map(event => event.to_dict()), null, 4));
}

function load_users() {
    if (fs.existsSync(USER_FILE_NAME) && fs.statSync(USER_FILE_NAME).size > 0) {
        const data = JSON.parse(fs.readFileSync(USER_FILE_NAME));
        return data.map(user => new User(user.user_id, user.name));
    }
    return [];
}

function save_users(users) {
    fs.writeFileSync(USER_FILE_NAME, JSON.stringify(users, null, 4));
}

function is_event_starting_soon(event_datetime) {
    const current_time = new Date();
    return (event_datetime - current_time) <= 15 * 60 * 1000;
}

function update_price(event) {
    if (event.available_seats <= 5 || event.status === "sold out") {
        const new_price = event.ticket_price * 1.10;
        const max_price_limit = 1000;
        event.ticket_price = new_price <= max_price_limit ? new_price : max_price_limit;
    }
}

// Function to add a new event
function add_event(events) {
    rl.question("Enter Event ID: ", (event_id) => {
        if (events.find(event => event.event_id === event_id)) {
            console.log("Event ID already exists. Please try again.");
            main();
            return;
        }

        rl.question("Enter Event Name: ", (event_name) => {
            rl.question("Enter Event Date and Time (YYYY-MM-DD HH:MM): ", (event_datetime) => {
                const event_datetime_obj = new Date(event_datetime);
                if (isNaN(event_datetime_obj)) {
                    console.log("Invalid date format. Please try again.");
                    main();
                    return;
                }

                rl.question("Enter Total Seats: ", (total_seats) => {
                    total_seats = parseInt(total_seats);
                    if (total_seats <= 0) {
                        console.log("Total seats must be greater than 0.");
                        main();
                        return;
                    }

                    rl.question("Enter Ticket Price: ", (ticket_price) => {
                        ticket_price = parseFloat(ticket_price);
                        // Create an Event instance using the Event class
                        const new_event = new Event(event_id, event_name, event_datetime_obj, total_seats, ticket_price);
                        events.push(new_event);
                        save_events(events);
                        console.log(`Event ${event_name} scheduled successfully.`);
                        main();
                    });
                });
            });
        });
    });
}

// Function to book tickets
function book_ticket(events, users) {
    rl.question("Enter User ID: ", (user_id) => {
        let user = users.find(user => user.user_id === user_id);
        if (!user) {
            rl.question("Enter your name: ", (name) => {
                user = { user_id, name, booked_tickets: [] };
                users.push(user);
                save_users(users);
                book_ticket(events, users); // Re-run booking for the newly created user
            });
            return;
        }

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
                if (num_tickets > event.available_seats) {
                    console.log(`Not enough available seats. Only ${event.available_seats} seats left.`);
                    main();
                    return;
                }

                // Check if user already has tickets for this event
                const existingTicket = user.booked_tickets.find(ticket => ticket.event_id === event.event_id);

                if (existingTicket) {
                    // Update the number of tickets if already booked
                    existingTicket.num_tickets += num_tickets;
                } else {
                    // Create a new ticket entry
                    const ticket_info = { event_id: event.event_id, num_tickets, ticket_price: event.ticket_price };
                    user.booked_tickets.push(ticket_info);
                }

                // Update the event's booked users and available seats
                event.available_seats -= num_tickets;
                if (event.available_seats === 0) {
                    event.status = "sold out";
                }

                event.booked_by.push(user.user_id);
                update_price(event);  // Update price dynamically based on remaining seats

                save_events(events);
                save_users(users);

                console.log(`Booked ${num_tickets} tickets for ${event.event_name}.`);
                main();
            });
        });
    });
}

// Cancel Ticket
function cancel_ticket(events, users) {
    rl.question("Enter User ID to cancel tickets: ", (user_id) => {
        const user = users.find(user => user.user_id === user_id);
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

            rl.question("Enter the number of tickets to cancel: ", (num_tickets) => {
                num_tickets = parseInt(num_tickets);
                if (user.cancel_ticket(event, num_tickets)) {
                    save_events(events);
                    save_users(users);
                    console.log(`Tickets for ${event.event_name} have been cancelled.\n`);
                }
                main();
            });
        });
    });
}

// View Events
function view_events(events) {
    rl.question("Sort events by 'date' or 'price'? ", (sortChoice) => {
        if (sortChoice === "date") {
            events.sort((a, b) => new Date(a.event_datetime) - new Date(b.event_datetime));
        } else if (sortChoice === "price") {
            events.sort((a, b) => a.ticket_price - b.ticket_price);
        } else {
            console.log("Invalid sort option.");
        }

        console.log("\nUpcoming Events:");
        events.forEach(event => {
            console.log(`${event.event_name} (${event.event_datetime}) - $${event.ticket_price} per ticket`);
        });
        main();
    });
}

// Main Menu
function main() {
    console.log("\n1. Add New Event");
    console.log("2. Book Ticket");
    console.log("3. Cancel Ticket");
    console.log("4. View Events");
    console.log("5. Exit");

    rl.question("Enter your choice: ", (choice) => {
        if (choice === '1') {
            add_event(events);
        } else if (choice === '2') {
            book_ticket(events, users);
        } else if (choice === '3') {
            cancel_ticket(events, users);
        } else if (choice === '4') {
            view_events(events);
        } else if (choice === '5') {
            console.log("Exiting...");
            rl.close(); // Close the readline interface when done
        } else {
            console.log("Invalid choice. Please try again.");
            main(); // Retry if the input is invalid
        }
    });
}

// Load events and users data
const events = load_events();
const users = load_users();

// Start the application
main();
