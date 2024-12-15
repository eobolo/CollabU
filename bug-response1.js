const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define the Event class
class Event {
    constructor(id, name, dateTime, totalSeats, ticketPrice) {
        this.id = id;
        this.name = name;
        this.dateTime = new Date(dateTime);
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
        this.ticketPrice = ticketPrice;
        this.status = 'available';
    }

    updateStatus() {
        if (this.availableSeats === 0) {
            this.status = 'sold out';
        }
    }

    updateTicketPrice() {
        if (this.availableSeats < 5) {
            this.ticketPrice = Math.min(this.ticketPrice * 1.5, 100); // 1.5x up to a max of $100
        }
    }
}

// Define the User class
class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.bookedTickets = [];
    }

    bookTickets(event, numberOfTickets) {
        if (event.availableSeats < numberOfTickets || event.dateTime < new Date()) {
            console.log("Error: Not enough seats or event has started.");
            return;
        }

        const newBookings = [...Array(numberOfTickets)].map(() => ({ eventId: event.id }));
        event.availableSeats -= numberOfTickets;
        event.updateStatus();
        event.updateTicketPrice();

        this.bookedTickets.push(...newBookings);
        console.log(`${numberOfTickets} tickets booked for ${event.name}.`);
    }

    cancelTickets(eventId, numberOfTickets) {
        const bookings = this.bookedTickets.filter(b => b.eventId === eventId);
        if (numberOfTickets > bookings.length) {
            console.log("Error: Cannot cancel more tickets than booked.");
            return;
        }

        const canceledBookings = bookings.slice(0, numberOfTickets);
        canceledBookings.forEach(b => {
            const event = events.find(e => e.id === b.eventId);
            if (event) {
                event.availableSeats++;
                event.updateStatus();
                event.updateTicketPrice();
            }
        });

        this.bookedTickets = this.bookedTickets.filter(b => !canceledBookings.includes(b));
        if (this.bookedTickets.length === 0) {
            removeUser(this.id);
        }
        console.log(`${numberOfTickets} tickets canceled for ${eventId}.`);
    }
}

// Load data from JSON files
function loadData() {
    const eventsFilePath = path.join(__dirname, 'events.json');
    const usersFilePath = path.join(__dirname, 'users.json');

    try {
        events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf8'))
            .map(e => new Event(e.id, e.name, e.dateTime, e.totalSeats, e.ticketPrice));
    } catch (err) {
        console.log("Error loading events.");
        events = [];
    }

    try {
        users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'))
            .map(u => new User(u.id, u.name));
    } catch (err) {
        console.log("Error loading users.");
        users = [];
    }
}

// Save data to JSON files
function saveData() {
    const eventsFilePath = path.join(__dirname, 'events.json');
    const usersFilePath = path.join(__dirname, 'users.json');

    fs.writeFileSync(eventsFilePath, JSON.stringify(events.map(e => ({
        id: e.id,
        name: e.name,
        dateTime: e.dateTime.toISOString(),
        totalSeats: e.totalSeats,
        availableSeats: e.availableSeats,
        ticketPrice: e.ticketPrice,
        status: e.status
    })), null, 2));

    fs.writeFileSync(usersFilePath, JSON.stringify(users.map(u => ({
        id: u.id,
        name: u.name,
        bookedTickets: u.bookedTickets
    })), null, 2));
}

// Add new event
function addEvent() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter event ID: ", (id) => {
        rl.question("Enter event name: ", (name) => {
            rl.question("Enter event date and time (YYYY-MM-DD HH:MM:SS): ", (dateTime) => {
                rl.question("Enter total seats: ", (totalSeats) => {
                    rl.question("Enter ticket price: ", (ticketPrice) => {
                        const newEvent = new Event(id, name, dateTime, parseInt(totalSeats), parseFloat(ticketPrice));
                        if (new Date() > newEvent.dateTime) {
                            console.log("Error: Event cannot be scheduled in the past.");
                            rl.close();
                            return;
                        }
                        events.push(newEvent);
                        saveData();
                        console.log("Event added successfully.");
                        rl.close();
                    });
                });
            });
        });
    });
}

// Remove user
function removeUser(userId) {
    users = users.filter(u => u.id !== userId);
    saveData();
}

// Main CLI loop
function main() {
    loadData();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter '1' to add event, '2' to view events, '3' to book tickets, '4' to cancel tickets, '5' to exit: ", (choice) => {
        switch (choice) {
            case '1':
                addEvent();
                break;
            case '2':
                viewEvents();
                break;
            case '3':
                bookTickets();
                break;
            case '4':
                cancelTickets();
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log("Invalid choice. Please try again.");
                main();
        }
    });
}

// View events
function viewEvents() {
    const sortBy = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    sortBy.question("Enter 'date' to sort by date or 'price' to sort by price: ", (sortKey) => {
        const sortedEvents = sortKey === 'date' ? events.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)) : events.sort((a, b) => a.ticketPrice - b.ticketPrice);
        sortedEvents.forEach(event => {
            console.log(`ID: ${event.id}, Name: ${event.name}, Date: ${event.dateTime.toLocaleDateString()}, Price: $${event.ticketPrice.toFixed(2)}, Status: ${event.status}, Available Seats: ${event.availableSeats}`);
        });
        sortBy.close();
    });
}

// Book tickets
function bookTickets() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter user ID: ", (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) {
            console.log("Error: User not found.");
            rl.close();
            return;
        }

        rl.question("Enter event ID: ", (eventId) => {
            const event = events.find(e => e.id === eventId);
            if (!event) {
                console.log("Error: Event not found.");
                rl.close();
                return;
            }

            rl.question("Enter number of tickets: ", (numberOfTickets) => {
                user.bookTickets(event, parseInt(numberOfTickets));
                rl.close();
            });
        });
    });
}

// Cancel tickets
function cancelTickets() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter user ID: ", (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) {
            console.log("Error: User not found.");
            rl.close();
            return;
        }

        rl.question("Enter event ID: ", (eventId) => {
            const event = events.find(e => e.id === eventId);
            if (!event) {
                console.log("Error: Event not found.");
                rl.close();
                return;
            }

            rl.question("Enter number of tickets to cancel: ", (numberOfTickets) => {
                user.cancelTickets(eventId, parseInt(numberOfTickets));
                rl.close();
            });
        });
    });
}

// Initialize the system
main();
