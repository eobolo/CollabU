const fs = require('fs');
const readline = require('readline');
const path = require('path');

// File paths
const EVENTS_FILE = path.join(__dirname, 'events.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Utility: Read input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = (query) => new Promise((resolve) => rl.question(query, resolve));

// Event Class
class Event {
    constructor(event_id, event_name, event_datetime, total_seats, ticket_price, available_seats = null, status = "active") {
        this.event_id = event_id;
        this.event_name = event_name;
        this.event_datetime = new Date(event_datetime);
        this.total_seats = total_seats;
        this.available_seats = available_seats !== null ? available_seats : total_seats;
        this.ticket_price = ticket_price;
        this.status = this.available_seats === 0 ? "sold out" : status;
        this.booked_by = [];
    }

    toObject() {
        return {
            event_id: this.event_id,
            event_name: this.event_name,
            event_datetime: this.event_datetime.toISOString(),
            total_seats: this.total_seats,
            available_seats: this.available_seats,
            ticket_price: this.ticket_price,
            status: this.status
        };
    }
}

// User Class
class User {
    constructor(user_id, name) {
        this.user_id = user_id;
        this.name = name;
        this.booked_tickets = [];
    }

    bookTicket(event, num_tickets) {
        if (event.status === "sold out") {
            console.log("Sorry, this event is sold out.");
            return false;
        }
        if (num_tickets > event.available_seats) {
            console.log(`Only ${event.available_seats} seats are available.`);
            return false;
        }

        const existingTicket = this.booked_tickets.find(t => t.event_id === event.event_id);

        event.available_seats -= num_tickets;
        if (event.available_seats === 0) event.status = "sold out";

        if (existingTicket) {
            existingTicket.num_tickets += num_tickets;
        } else {
            this.booked_tickets.push({
                event_id: event.event_id,
                num_tickets: num_tickets,
                ticket_price: event.ticket_price
            });
        }
        event.booked_by.push(this.user_id);
        return true;
    }

    cancelTicket(event, num_tickets) {
        const ticket = this.booked_tickets.find(t => t.event_id === event.event_id);

        if (!ticket || ticket.num_tickets < num_tickets) {
            console.log("Invalid cancellation request.");
            return false;
        }

        event.available_seats += num_tickets;
        if (event.available_seats > 0) event.status = "active";

        ticket.num_tickets -= num_tickets;
        if (ticket.num_tickets === 0) {
            this.booked_tickets = this.booked_tickets.filter(t => t.event_id !== event.event_id);
            event.booked_by = event.booked_by.filter(id => id !== this.user_id);
        }

        const refund = num_tickets * ticket.ticket_price;
        console.log(`Refunded $${refund} for ${num_tickets} tickets.`);
        return true;
    }
}

// Load and Save Functions
function loadData(file) {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

function loadEvents() {
    const data = loadData(EVENTS_FILE);
    return data.map(event => new Event(...Object.values(event)));
}

function loadUsers() {
    const data = loadData(USERS_FILE);
    return data.map(user => new User(user.user_id, user.name));
}

// Add Event
async function addEvent(events) {
    const event_id = await input("Enter Event ID: ");
    if (events.find(event => event.event_id === event_id)) {
        console.log("Event ID already exists.");
        return;
    }

    const event_name = await input("Enter Event Name: ");
    const event_datetime = await input("Enter Event Date and Time (YYYY-MM-DDTHH:MM): ");
    const total_seats = parseInt(await input("Enter Total Seats: "));
    const ticket_price = parseFloat(await input("Enter Ticket Price: "));

    const new_event = new Event(event_id, event_name, event_datetime, total_seats, ticket_price);
    events.push(new_event);
    saveData(EVENTS_FILE, events.map(e => e.toObject()));
    console.log(`Event "${event_name}" added successfully.`);
}

// Book Tickets
async function bookTickets(events, users) {
    const user_id = await input("Enter User ID: ");
    let user = users.find(u => u.user_id === user_id);

    if (!user) {
        const name = await input("Enter your name: ");
        user = new User(user_id, name);
        users.push(user);
    }

    const event_id = await input("Enter Event ID: ");
    const event = events.find(e => e.event_id === event_id);

    if (!event) {
        console.log("Event not found.");
        return;
    }

    const num_tickets = parseInt(await input("How many tickets? "));
    if (user.bookTicket(event, num_tickets)) {
        saveData(EVENTS_FILE, events.map(e => e.toObject()));
        saveData(USERS_FILE, users);
        console.log("Tickets booked successfully.");
    }
}

// Cancel Tickets
async function cancelTickets(events, users) {
    const user_id = await input("Enter User ID: ");
    const user = users.find(u => u.user_id === user_id);

    if (!user) {
        console.log("User not found.");
        return;
    }

    const event_id = await input("Enter Event ID: ");
    const event = events.find(e => e.event_id === event_id);

    if (!event) {
        console.log("Event not found.");
        return;
    }

    const num_tickets = parseInt(await input("Number of tickets to cancel: "));
    if (user.cancelTicket(event, num_tickets)) {
        saveData(EVENTS_FILE, events.map(e => e.toObject()));
        saveData(USERS_FILE, users);
        console.log("Tickets cancelled successfully.");
    }
}

// View Events
function viewEvents(events) {
    events.forEach(event => {
        console.log(`ID: ${event.event_id}, Name: ${event.event_name}, Date: ${event.event_datetime}, Price: ${event.ticket_price}, Seats: ${event.available_seats}, Status: ${event.status}`);
    });
}

// Main Program
async function main() {
    let events = loadEvents();
    let users = loadUsers();

    while (true) {
        console.log("\n1. Add Event\n2. Book Ticket\n3. Cancel Ticket\n4. View Events\n5. Exit");
        const choice = await input("Enter your choice: ");

        if (choice === '1') await addEvent(events);
        else if (choice === '2') await bookTickets(events, users);
        else if (choice === '3') await cancelTickets(events, users);
        else if (choice === '4') viewEvents(events);
        else if (choice === '5') break;
        else console.log("Invalid choice.");
    }
    rl.close();
}

main();