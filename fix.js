const fs = require("fs");
const readlineSync = require("readline-sync"); // For user input
const path = require("path");

// File paths
const EVENTS_FILE = path.join(__dirname, "events.json");
const USERS_FILE = path.join(__dirname, "users.json");

// Utility functions to load and save data
function loadJSON(filePath) {
    if (!fs.existsSync(filePath)) return [];
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return [];
    }
}

function saveJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error.message);
    }
}

// Event class
class Event {
    constructor(eventId, eventName, eventDateTime, totalSeats, ticketPrice) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventDateTime = new Date(eventDateTime).toISOString();
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
        this.ticketPrice = ticketPrice;
        this.status = "active";
        this.bookedBy = [];
    }

    bookTickets(userId, numTickets) {
        if (this.status === "sold out") {
            console.log("Event is sold out.");
            return false;
        }
        if (numTickets > this.availableSeats) {
            console.log(`Only ${this.availableSeats} tickets are available.`);
            return false;
        }

        this.availableSeats -= numTickets;
        if (this.availableSeats === 0) this.status = "sold out";

        this.bookedBy.push({ userId, numTickets });
        console.log(`${numTickets} tickets booked successfully.`);
        return true;
    }

    cancelTickets(userId, numTickets) {
        const booking = this.bookedBy.find(b => b.userId === userId);
        if (!booking || booking.numTickets < numTickets) {
            console.log("Invalid cancellation. Not enough tickets booked.");
            return false;
        }

        booking.numTickets -= numTickets;
        if (booking.numTickets === 0) {
            this.bookedBy = this.bookedBy.filter(b => b.userId !== userId);
        }

        this.availableSeats += numTickets;
        this.status = "active";
        console.log(`${numTickets} tickets cancelled successfully.`);
        return true;
    }
}

// User class
class User {
    constructor(userId, name) {
        this.userId = userId;
        this.name = name;
        this.bookedTickets = [];
    }

    addBooking(eventId, numTickets, price) {
        this.bookedTickets.push({ eventId, numTickets, price });
    }

    cancelBooking(eventId, numTickets) {
        const booking = this.bookedTickets.find(b => b.eventId === eventId);
        if (!booking || booking.numTickets < numTickets) return false;

        booking.numTickets -= numTickets;
        if (booking.numTickets === 0) {
            this.bookedTickets = this.bookedTickets.filter(b => b.eventId !== eventId);
        }
        return true;
    }
}

// Load initial data
let events = loadJSON(EVENTS_FILE).map(e => new Event(e.eventId, e.eventName, e.eventDateTime, e.totalSeats, e.ticketPrice));
let users = loadJSON(USERS_FILE).map(u => new User(u.userId, u.name));

// Functions for menu options
function addEvent() {
    const eventId = readlineSync.question("Enter Event ID: ");
    if (events.some(event => event.eventId === eventId)) {
        console.log("Event ID already exists.");
        return;
    }
    const eventName = readlineSync.question("Enter Event Name: ");
    const eventDateTime = readlineSync.question("Enter Event Date and Time (YYYY-MM-DD HH:MM): ");
    const totalSeats = parseInt(readlineSync.question("Enter Total Seats: "), 10);
    const ticketPrice = parseFloat(readlineSync.question("Enter Ticket Price: "));

    const newEvent = new Event(eventId, eventName, eventDateTime, totalSeats, ticketPrice);
    events.push(newEvent);
    saveJSON(EVENTS_FILE, events);
    console.log("Event added successfully.");
}

function bookTicket() {
    const userId = readlineSync.question("Enter User ID: ");
    let user = users.find(u => u.userId === userId);
    if (!user) {
        const name = readlineSync.question("Enter your name: ");
        user = new User(userId, name);
        users.push(user);
    }

    const eventId = readlineSync.question("Enter Event ID to book tickets: ");
    const event = events.find(e => e.eventId === eventId);
    if (!event) {
        console.log("Event not found.");
        return;
    }

    const numTickets = parseInt(readlineSync.question("Enter number of tickets to book: "), 10);
    if (event.bookTickets(userId, numTickets)) {
        user.addBooking(eventId, numTickets, event.ticketPrice);
        saveJSON(EVENTS_FILE, events);
        saveJSON(USERS_FILE, users);
    }
}

function cancelTicket() {
    const userId = readlineSync.question("Enter User ID: ");
    const user = users.find(u => u.userId === userId);
    if (!user) {
        console.log("User not found.");
        return;
    }

    const eventId = readlineSync.question("Enter Event ID to cancel tickets: ");
    const event = events.find(e => e.eventId === eventId);
    if (!event) {
        console.log("Event not found.");
        return;
    }

    const numTickets = parseInt(readlineSync.question("Enter number of tickets to cancel: "), 10);
    if (user.cancelBooking(eventId, numTickets) && event.cancelTickets(userId, numTickets)) {
        saveJSON(EVENTS_FILE, events);
        saveJSON(USERS_FILE, users);
    } else {
        console.log("Cancellation failed.");
    }
}

function viewEvents() {
    console.log("Available Events:");
    events.forEach(event => {
        console.log(`${event.eventId}: ${event.eventName}, ${event.eventDateTime}, Seats: ${event.availableSeats}, Price: $${event.ticketPrice}`);
    });
}

// Main menu
function main() {
    while (true) {
        console.log("\n1. Add Event\n2. Book Ticket\n3. Cancel Ticket\n4. View Events\n5. Exit");
        const choice = readlineSync.question("Enter your choice: ");
        switch (choice) {
            case "1":
                addEvent();
                break;
            case "2":
                bookTicket();
                break;
            case "3":
                cancelTicket();
                break;
            case "4":
                viewEvents();
                break;
            case "5":
                console.log("Exiting...");
                return;
            default:
                console.log("Invalid choice.");
        }
    }
}

main();
