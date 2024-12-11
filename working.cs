from datetime import datetime, timedelta

class Book:
    def __init__(self, book_id, title, author, copies_available, fine_per_day):
        self.book_id = book_id
        self.title = title
        self.author = author
        self.copies_available = copies_available
        self.fine_per_day = fine_per_day
        self.due_dates = {}  # Tracks due dates for each user who checked out the book

    def checkout(self, user_id):
        if self.copies_available > 0 and user_id not in self.due_dates:
            self.copies_available -= 1
            due_date = datetime.now() + timedelta(days=14)  # Fixed 14-day due date
            self.due_dates[user_id] = due_date
            return "Checkout Successful", due_date.strftime("%Y-%m-%d")
        elif user_id in self.due_dates:
            return "User Already Borrowed This Book", None
        else:
            return "Book Unavailable", None

    def return_book(self, user_id, return_date_str):
        if user_id not in self.due_dates:
            return "Book Not Borrowed by User", 0

        try:
            return_date = datetime.strptime(return_date_str, "%Y-%m-%d")
        except ValueError:
            return "Invalid Date Format", 0

        due_date = self.due_dates.pop(user_id)
        self.copies_available += 1

        if return_date > due_date:
            overdue_days = (return_date - due_date).days
            fine = overdue_days * self.fine_per_day
            return f"Book Returned, Fine: {fine}", fine
        return "Book Returned On Time", 0


class User:
    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name
        self.borrowed_books = {}  # Tracks book_id, due_date, and fine

    def borrow_book(self, book_id, due_date):
        if book_id in self.borrowed_books:
            return "User Already Borrowed This Book"
        self.borrowed_books[book_id] = {"due_date": due_date, "fine": 0}
        return "Book Borrowed Successfully"

    def return_book(self, book_id, fine):
        if book_id in self.borrowed_books:
            self.borrowed_books[book_id]["fine"] = fine  # Update fine
            return "Book Returned Successfully"
        return "Book Not Borrowed by User"

    def pay_fine(self, book_id):
        if book_id in self.borrowed_books:
            fine = self.borrowed_books[book_id]["fine"]
            if fine > 0:
                self.borrowed_books[book_id]["fine"] = 0
                return f"Fine of {fine} Paid Successfully"
            return "No Fine Due for This Book"
        return "Book Not Borrowed by User"


class Library:
    def __init__(self):
        self.books = {}
        self.users = {}

    def add_book(self, book_id, title, author, copies_available, fine_per_day):
        if book_id in self.books:
            return "Book ID Already Exists"
        self.books[book_id] = Book(book_id, title, author, copies_available, fine_per_day)
        return "Book Added Successfully"

    def add_user(self, user_id, name):
        if user_id in self.users:
            return "User ID Already Exists"
        self.users[user_id] = User(user_id, name)
        return "User Added Successfully"

    def checkout_book(self, user_id, book_id):
        if user_id not in self.users or book_id not in self.books:
            return "Invalid Input"
        
        user = self.users[user_id]
        book = self.books[book_id]
        result, due_date = book.checkout(user_id)
        if result == "Checkout Successful":
            user.borrow_book(book_id, due_date)
            return f"Checkout Successful, Due Date: {due_date}"
        return result

    def return_book(self, user_id, book_id, return_date):
        if user_id not in self.users or book_id not in self.books:
            return "Invalid Input"

        user = self.users[user_id]
        book = self.books[book_id]

        result, fine = book.return_book(user_id, return_date)
        if "Book Returned" in result:
            user.return_book(book_id, fine)
        return result

    def pay_fine(self, user_id, book_id):
        if user_id not in self.users:
            return "Invalid User ID"
        user = self.users[user_id]
        return user.pay_fine(book_id)

# Example Usage
if __name__ == "__main__":
    library = Library()

    # Add books
    print(library.add_book(1, "The Great Gatsby", "F. Scott Fitzgerald", 3, 1.0))  # Book Added Successfully
    print(library.add_book(1, "The Great Gatsby", "F. Scott Fitzgerald", 3, 1.0))
    print(library.add_book(2, "1984", "George Orwell", 2, 1.5))  # Book Added Successfully

    # Add users
    print(library.add_user(101, "Alice"))  # User Added Successfully
    print(library.add_user(101, "Alice"))
    print(library.add_user(102, "Bob"))    # User Added Successfully
    print(library.add_user(103, "excel"))    # User Added Successfully

    # Checkout books
    print(library.checkout_book(101, 1))  # Checkout Successful, Due Date: YYYY-MM-DD
    print(library.checkout_book(101, 1))  # User Already Borrowed This Book
    print(library.checkout_book(102, 1))  # Checkout Successful, Due Date: YYYY-MM-DD
    print(library.checkout_book(103, 1))  # Checkout Successful, Due Date: YYYY-MM-DD
    print(library.checkout_book(104, 1))
    print(library.add_user(104, "excel"))
    print(library.checkout_book(104, 1))

    # Return book on time
    print(library.return_book(101, 1, "2024-12-15"))  # Book Returned On Time

    # Return book late
    print(library.return_book(102, 1, "2024-12-25"))  # Book Returned, Fine: 5.0

    # # Test Case 12: User Tries to Return a Book Not Borrowed by Them (Invalid Case)
    print(library.return_book(101, 2, "2024-12-01"))  # "Book Not Borrowed by User"

    # # Test Case 13: Invalid Date Format (Invalid Date Format)
    print(library.return_book(101, 1, "2024-12-32"))  # "Invalid Date Format"


    # # Test Case 16: User Tries to Checkout a Book with Invalid User ID (Invalid User)
    print(library.checkout_book(999, 1))  # "Invalid Input"

    # # Test Case 17: User Tries to Checkout an Invalid Book ID (Invalid Book)
    print(library.checkout_book(101, 999))  # "Invalid Input"


    # Pay fine
    print(library.pay_fine(102, 1))  # Fine Paid Successfully
    print(library.pay_fine(102, 1))  # No Fine Due for This Book
    print(library.pay_fine(102, 3))
