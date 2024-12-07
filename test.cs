from datetime import datetime, timedelta

class Book:
    def __init__(self, book_id, title, author, copies_available, fine_per_day):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.copies_available = copies_available
        self.fine_per_day = fine_per_day
        self.status = "available"

    def checkout(self):
        if self.copies_available > 0:
            self.copies_available -= 1
            self.status = "checked_out"
            return True
        return False

    def return_book(self, return_date, due_date):
        if return_date > due_date:
            self.status = "overdue"
            return True  # Book is overdue
        else:
            self.status = "available"
            return False  # Book is returned on time

class User:
    def __init__(self, user_id):
        self.user_id = user_id
        self.borrowed_books = {}
        self.fines = {}

    def borrow_book(self, book_id):
        self.borrowed_books[book_id] = datetime.now()
        self.fines[book_id] = 0  # Initialize fines for this book

    def return_book(self, book_id):
        if book_id in self.borrowed_books:
            return_date = datetime.now()
            due_date = self.borrowed_books[book_id] + timedelta(days=14)  # Assume a 14-day loan period
            is_overdue = self.fines[book_id] > 0
            
            if is_overdue:
                print(f"Book was overdue. Please pay your fine for {book_id}.")
                return True  # Indicates overdue book due for fine payment
            
            return return_date > due_date
        return False  # Book not borrowed by user

    def pay_fine(self, book_id, amount):
        if book_id in self.fines and self.fines[book_id] > 0:
            self.fines[book_id] -= amount
            if self.fines[book_id] <= 0:
                self.fines[book_id] = 0  # Fine is cleared
            print(f"Fine paid for book {book_id}. Remaining fine: {self.fines[book_id]}")
            return True
        return False

class Library:
    def __init__(self):
        self.books = {}
        self.users = {}

    def add_book(self, book_id, title, author, copies_available, fine_per_day):
        if book_id in self.books:
            return "Book ID Already Exists"
        self.books[book_id] = Book(book_id, title, author, copies_available, fine_per_day)
        return "Book added successfully"

    def add_user(self, user_id):
        if user_id not in self.users:
            self.users[user_id] = User(user_id)
            return "User added successfully"
        return "User already exists"

    def checkout_book(self, user_id, book_id):
        if book_id not in self.books:
            return "Invalid Input"
        book = self.books[book_id]
        if book.checkout():
            self.users[user_id].borrow_book(book_id)
            return "Book checked out successfully"
        return "No available copies"

    def return_book(self, user_id, book_id):
        if user_id not in self.users or book_id not in self.books:
            return "Invalid Input"
        
        user = self.users[user_id]
        if user.return_book(book_id):
            book = self.books[book_id]
            overdue = book.return_book(datetime.now(), user.borrowed_books[book_id])
            if overdue:
                days_late = (datetime.now() - (user.borrowed_books[book_id] + timedelta(days=14))).days
                fine_amount = days_late * book.fine_per_day
                user.fines[book_id] += fine_amount
                print(f"Book returned late. Fine incurred: {fine_amount}")
            del user.borrowed_books[book_id]  # Remove book from borrowed list
            book.copies_available += 1  # Increase the available copies
            return "Book returned successfully"
        return "You have not borrowed this book"

    def pay_fine(self, user_id, book_id, amount):
        if user_id not in self.users or book_id not in self.books:
            return "Invalid Input"
        
        user = self.users[user_id]
        if user.pay_fine(book_id, amount):
            book = self.books[book_id]
            book.status = "available"  # Book is available after fine payment
            return "Fine paid successfully"
        return "No fines to pay"

# Example usage:
library = Library()
library.add_user("user1")
library.add_book("book1", "Python Programming", "Author A", 3, 1)
print(library.checkout_book("user1", "book1"))  # Checkout book
print(library.return_book("user1", "book1"))    # Return book
