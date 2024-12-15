const fs = require('fs');
const readline = require('readline');
const { DateTime } = require('luxon'); // For date manipulation

const FILE_NAME = "events.json";

// Event class
class Event {
    constructor(event_id, event_name, event_datetime, total_seats, ticket_price, available_seats = null, status = "active") {
        this.event_id = event_id;
        this.event_name = event_name;
        this.event_datetime = DateTime.fromFormat(event_datetime, "yyyy-MM-dd HH:mm");
        this.total_seats = total_seats;
        this.available_seats = available_seats || total_seats;
        this.ticket_price = ticket_price;
        this.status = status;

        if (this.available_seats === 0) {
            this.status = "sold out";
        }
        this.booked_by = [];
    }

    toObject() {
        return {
            event_id: this.event_id,
            event_name: this.event_name,
            event_datetime: this.event_datetime.toFormat("yyyy-MM-dd HH:mm"),
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
    return new Promise(resolve => rl.question(question, resolve));
}

// 1. Add New Event
async function addEvent(events, rl) {
    try {
        const event_id = await askQuestion(rl, "Enter Event ID: ");
        if (events.some(event => event.event_id === event_id)) {
            console.log("Event ID already exists. Please try again.");
            return;
        }

        const event_name = await askQuestion(rl, "Enter Event Name: ");
        const event_datetime_str = await askQuestion(rl, "Enter Event Date and Time (YYYY-MM-DD HH:MM): ");
        const event_datetime = DateTime.fromFormat(event_datetime_str, "yyyy-MM-dd HH:mm");

        if (!event_datetime.isValid || event_datetime < DateTime.now()) {
            console.log("Invalid date or time. Event cannot be scheduled in the past.");
            return;
        }

        const total_seats_str = await askQuestion(rl, "Enter Total Seats: ");
        const total_seats = parseInt(total_seats_str);
        if (isNaN(total_seats) || total_seats <= 0) {
            console.log("Total seats must be a positive number.");
            return;
        }

        const ticket_price_str = await askQuestion(rl, "Enter Ticket Price: ");
        const ticket_price = parseFloat(ticket_price_str);
        if (isNaN(ticket_price) || ticket_price <= 0) {
            console.log("Ticket price must be a positive number.");
            return;
        }

        const new_event = new Event(event_id, event_name, event_datetime_str, total_seats, ticket_price);
        events.push(new_event);
        saveEvents(events);
        console.log(`Event "${event_name}" scheduled successfully.`);
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

// Main function
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
        switch (choice) {
            case '1':
                await addEvent(events, rl);
                break;
            case '2':
                console.log("Book Ticket - Functionality not implemented yet.");
                break;
            case '3':
                console.log("Cancel Ticket - Functionality not implemented yet.");
                break;
            case '4':
                console.log("Cancel Event - Functionality not implemented yet.");
                break;
            case '5':
                console.log("Viewing Events:");
                events.forEach(event => console.log(event.toObject()));
                break;
            case '6':
                console.log("Exiting...");
                rl.close();
                return;
            default:
                console.log("Invalid choice. Please try again.");
        }
        showMenu();
    }

    showMenu();
}

main();