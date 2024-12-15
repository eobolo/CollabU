const fs = require('fs');
const readline = require('readline');
const { DateTime } = require('luxon');  // External library for date manipulation (to mimic datetime functionality)

const FILE_NAME = "events.json";
const USER_FILE_NAME = "users.json";

// Event class
class Event {
    constructor(event_id, event_name, event_datetime, total_seats, ticket_price, available_seats = null, status = "active") {
        this.event_id = event_id;
        this.event_name = event_name;
        this.event_datetime = DateTime.fromFormat(event_datetime, "yyyy-MM-dd HH:mm"); // Ensure datetime is parsed
        this.total_seats = total_seats;
        this.available_seats = available_seats || total_seats; // Default to total_seats if not provided
        this.ticket_price = ticket_price;
        this.status = status;

        // If available seats is zero, mark event as "sold out"
        if (this.available_seats === 0) {
            this.status = "sold out";
        }
        this.booked_by = []; // List of users who booked tickets for this event
    }

    toObject() {
        return {
            event_id: this.event_id,
            event_name: this.event_name,
            event_datetime: this.event_datetime.toFormat("yyyy-MM-dd HH:mm"), // Save as string
            total_seats: this.total_seats,
            available_seats: this.available_seats,
            ticket_price: this.ticket_price,
            status: this.status
        };
    }
}

// Load and save events from JSON
function loadEvents() {
    if (fs.existsSync(FILE_NAME) && fs.statSync(FILE_NAME).size > 0) {
        const data = JSON.parse(fs.readFileSync(FILE_NAME, 'utf8'));
        return data.map(event => new Event(event.event_id, event.event_name, event.event_datetime, event.total_seats, event.ticket_price, event.available_seats, event.status));
    }
    return [];
}

function saveEvents(events) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(events.map(event => event.toObject()), null, 4));
}

// Helper function for async input
function askQuestion(rl, question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

// 1. Add New Event
async function addEvent(events) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const event_id = await askQuestion(rl, "Enter Event ID: ");
        if (events.some(event => event.event_id === event_id)) {
            console.log("Event ID already exists. Please try again.");
            rl.close();
            return;
        }

        const event_name = await askQuestion(rl, "Enter Event Name: ");
        const event_datetime_str = await askQuestion(rl, "Enter Event Date and Time (YYYY-MM-DD HH:MM): ");

        let event_datetime;
        try {
            event_datetime = DateTime.fromFormat(event_datetime_str, "yyyy-MM-dd HH:mm");
        } catch (error) {
            console.log("Invalid date format. Please try again.");
            rl.close();
            return;
        }

        // Ensure event is in the future
        if (event_datetime < DateTime.now()) {
            console.log("Event cannot be scheduled in the past.");
            rl.close();
            return;
        }

        const total_seats_str = await askQuestion(rl, "Enter Total Seats: ");
        const total_seats = parseInt(total_seats_str);
        if (total_seats === 0) {
            console.log("Total seats cannot be zero. Please enter a valid number of seats.");
            rl.close();
            return;
        }

        const ticket_price_str = await askQuestion(rl, "Enter Ticket Price: ");
        const ticket_price = parseFloat(ticket_price_str);

        const new_event = new Event(event_id, event_name, event_datetime_str, total_seats, ticket_price);
        events.push(new_event);
        saveEvents(events);
        console.log(`Event ${event_name} scheduled successfully.`);
    } catch (error) {
        console.log("An error occurred while processing the event:", error);
    } finally {
        rl.close();
    }
}

// Main function to run the event ticketing system
async function main() {
    const events = loadEvents();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function showMenu() {
        console.log("\n1. Add New Event");
        console.log("2. Book Ticket");
        console.log("3. Cancel Ticket");
        console.log("4. Cancel Event");
        console.log("5. View Events");
        console.log("6. Exit");

        const choice = await askQuestion(rl, "Enter your choice: ");
        if (choice === '1') {
            await addEvent(events);
            showMenu(); // Show menu again after the event is added
        } else if (choice === '2') {
            // Implement bookTicket logic
            showMenu();
        } else if (choice === '3') {
            // Implement cancelTicket logic
            showMenu();
        } else if (choice === '4') {
            // Implement cancelEvent logic
            showMenu();
        } else if (choice === '5') {
            // Implement viewEvents logic
            showMenu();
        } else if (choice === '6') {
            console.log("Exiting...");
            rl.close();
        } else {
            console.log("Invalid choice. Please try again.");
            showMenu();
        }
    }

    showMenu();
}

main();
