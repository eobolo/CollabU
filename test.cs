class Book:
    def __init__(self, book_id, title, author, copies_available, fine_per_day):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.copies_available = copies_available
        self.fine_per_day = fine_per_day
        self.status = "available"  # could be "available", "checked_out", or "overdue"

    def checkout(self):
        if self.copies_available > 0:
            self.copies_available -= 1
            self.status = "checked_out"
            return True
        return False

    def return_book(self):
        self.copies_available += 1
        if self.copies_available > 0:
            self.status = "available"
        return self.status

class User:
    def __init__(self, user_id):
        self.user_id = user_id
        self.borrowed_books = {}  # maps book_id to due_date
        self.fines = {}  # maps book_id to fine amount

    def borrow_book(self, book, due_date):
        if book.book_id not in self.borrowed_books:
            self.borrowed_books[book.book_id] = due_date
            return True
        return False

    def return_book(self, book_id, return_date):
        if book_id in self.borrowed_books:
            due_date = self.borrowed_books.pop(book_id)
            if return_date > due_date:  # overdue
                overdue_days = (return_date - due_date).days
                fine = overdue_days * book.fine_per_day
                self.fines[book_id] = fine
                return "overdue", fine
            return "on_time", 0
        return "not_borrowed"

    def pay_fine(self, book_id):
        if book_id in self.fines:
            del self.fines[book_id]
            return True
        return False

class Library:
    def __init__(self):
        self.books = {}
        self.users = {}

    def add_book(self, book):
        if book.book_id in self.books:
            return "Book ID Already Exists"
        self.books[book.book_id] = book
        return "Book Added"

    def add_user(self, user):
        if user.user_id in self.users:
            return "User ID Already Exists"
        self.users[user.user_id] = user
        return "User Added"

    def checkout_book(self, user_id, book_id, due_date):
        if user_id not in self.users:
            return "Invalid Input"
        if book_id not in self.books:
            return "Invalid Input"
        
        user = self.users[user_id]
        book = self.books[book_id]
        
        if book.checkout():
            user.borrow_book(book, due_date)
            return "Book Checked Out"
        return "No Copies Available"

    def return_book(self, user_id, book_id, return_date):
        if user_id not in self.users:
            return "Invalid Input"
        if book_id not in self.books:
            return "Invalid Input"
        
        user = self.users[user_id]
        book = self.books[book_id]
        
        result, fine = user.return_book(book_id, return_date)
        if result == "overdue":
            book.status = "overdue"
            return f"Book Returned. Fine: {fine}"
        elif result == "on_time":
            book.return_book()
            return "Book Returned On Time"
        return "Invalid Input"

    def pay_fine(self, user_id, book_id):
        if user_id not in self.users:
            return "Invalid Input"
        user = self.users[user_id]
        if user.pay_fine(book_id):
            self.books[book_id].status = "available"
            return "Fine Paid"
        return "No Fine Due"

import datetime

# Example Usage
library = Library()
library.add_book(Book('001', '1984', 'George Orwell', 2, 1))
library.add_user(User('user1'))

# Check out a book
due_date = datetime.date.today() + datetime.timedelta(days=14)
print(library.checkout_book('user1', '001', due_date))

# Return the book
return_date = datetime.date.today() + datetime.timedelta(days=15)  # 1 day overdue
print(library.return_book('user1', '001', return_date))

# Pay the fine
print(library.pay_fine('user1', '001'))
