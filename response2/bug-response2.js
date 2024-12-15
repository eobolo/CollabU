const fs = require('fs');
const path = require('path');

// Event class
class Event {
  constructor(id, name, date, time, totalSeats, ticketPrice) {
    this.id = id;
    this.name = name;
    this.date = new Date(date);
    this.time = time;
    this.totalSeats = totalSeats;
    this.availableSeats = totalSeats;
    this.ticketPrice = ticketPrice;
    this.status = 'Active';
  }

  isPast() {
    return this.date < new Date();
  }

  updateStatus() {
    if (this.availableSeats === 0) {
      this.status = 'Sold Out';
    }
  }

  adjustPrice() {
    if (this.availableSeats < 5) {
      this.ticketPrice = Math.min(this.ticketPrice * 1.5, 100); // max price is 100
    }
  }

  bookTicket() {
    if (this.availableSeats > 0) {
      this.availableSeats--;
      this.updateStatus();
      this.adjustPrice();
      return true;
    }
    return false;
  }

  cancelTicket() {
    if (this.availableSeats < this.totalSeats) {
      this.availableSeats++;
      this.updateStatus();
      this.adjustPrice();
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      date: this.date.toJSON(),
      time: this.time,
      totalSeats: this.totalSeats,
      availableSeats: this.availableSeats,
      ticketPrice: this.ticketPrice,
      status: this.status
    };
  }
}

// User class
class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.bookedTickets = [];
  }

  bookTicket(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event && event.availableSeats > 0) {
      if (event.bookTicket()) {
        this.bookedTickets.push(eventId);
        return true;
      }
    }
    return false;
  }

  cancelTicket(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event && this.bookedTickets.includes(eventId)) {
      if (event.cancelTicket()) {
        this.bookedTickets.splice(this.bookedTickets.indexOf(eventId), 1);
        if (!this.bookedTickets.length) {
          removeUser(this.id);
        }
        return true;
      }
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      bookedTickets: this.bookedTickets
    };
  }
}

// Load events and users from JSON files
function loadData() {
  events = JSON.parse(fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8')) || [];
  users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8')) || [];

  events.forEach(event => {
    event = new Event(event.id, event.name, event.date, event.time, event.totalSeats, event.ticketPrice);
    event.availableSeats = event.totalSeats;
  });

  users.forEach(user => {
    user = new User(user.id, user.name);
    user.bookedTickets = user.bookedTickets.map(id => parseInt(id, 10));
  });
}

// Save events and users to JSON files
function saveData() {
  fs.writeFileSync(path.join(__dirname, 'events.json'), JSON.stringify(events, null, 2));
  fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
}

// Add a new event
function addEvent(id, name, date, time, totalSeats, ticketPrice) {
  const newEvent = new Event(id, name, date, time, totalSeats, ticketPrice);
  if (newEvent.isPast()) {
    console.log('Event cannot be scheduled in the past.');
    return;
  }
  events.push(newEvent);
  saveData();
  console.log(`Event "${name}" added successfully.`);
}

// View all events
function viewEvents() {
  console.log('\nEvents:');
  events.sort((a, b) => b.date - a.date).forEach(event => {
    console.log(`ID: ${event.id}, Name: ${event.name}, Date: ${event.date.toLocaleDateString()} ${event.time}, Price: $${event.ticketPrice.toFixed(2)}, Status: ${event.status}, Available Seats: ${event.availableSeats}`);
  });
}

// Book a ticket for a user
function bookTicket(userId, eventId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    const event = events.find(e => e.id === eventId);
    if (event) {
      if (user.bookTicket(eventId)) {
        saveData();
        console.log(`Ticket booked for user ${user.name} for event "${event.name}".`);
      } else {
        console.log('Not enough seats available or event is sold out.');
      }
    } else {
      console.log('Event not found.');
    }
  } else {
    console.log('User not found.');
  }
}

// Cancel a ticket for a user
function cancelTicket(userId, eventId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    const event = events.find(e => e.id === eventId);
    if (event) {
      if (user.cancelTicket(eventId)) {
        saveData();
        console.log(`Ticket canceled for user ${user.name} for event "${event.name}".`);
      } else {
        console.log('Ticket not found or event is sold out.');
      }
    } else {
      console.log('Event not found.');
    }
  } else {
    console.log('User not found.');
  }
}

// Remove a user
function removeUser(userId) {
  users = users.filter(u => u.id !== userId);
  saveData();
  console.log(`User removed.`);
}

// Start the command-line interface
function startCli() {
  loadData();
  console.log('Event Ticketing System');
  console.log('1. Add Event');
  console.log('2. View Events');
  console.log('3. Book Ticket');
  console.log('4. Cancel Ticket');
  console.log('5. View Users');
  console.log('6. Exit');

  let choice = prompt('Choose an option: ');
  while (choice !== '6') {
    switch (choice) {
      case '1':
        const id = parseInt(prompt('Enter event ID: '), 10);
        const name = prompt('Enter event name: ');
        const date = prompt('Enter event date (YYYY-MM-DD): ');
        const time = prompt('Enter event time (HH:MM): ');
        const totalSeats = parseInt(prompt('Enter total seats: '), 10);
        const ticketPrice = parseInt(prompt('Enter ticket price: '), 10);
        addEvent(id, name, date, time, totalSeats, ticketPrice);
        break;
      case '2':
        viewEvents();
        break;
      case '3':
        const userId = parseInt(prompt('Enter user ID: '), 10);
        const eventId = parseInt(prompt('Enter event ID: '), 10);
        bookTicket(userId, eventId);
        break;
      case '4':
        const userId = parseInt(prompt('Enter user ID: '), 10);
        const eventId = parseInt(prompt('Enter event ID: '), 10);
        cancelTicket(userId, eventId);
        break;
      case '5':
        console.log('\nUsers:');
        users.forEach(user => {
          console.log(`ID: ${user.id}, Name: ${user.name}, Booked Tickets: ${user.bookedTickets.length}`);
        });
        break;
      default:
        console.log('Invalid option. Please try again.');
    }
    choice = prompt('Choose an option: ');
  }
  console.log('Exiting the Event Ticketing System.');
}

// Initialize the system
events = [];
users = [];
startCli();
