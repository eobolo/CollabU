from datetime import datetime

class Library:
    def __init__(self):
        self.books = {}
        self.users = {}

    def add_book(self, book_id, title, author, copies_available, fine_per_day):
        # Check if the book ID already exists
        if book_id in self.books:
            return "Book ID Already Exists"
        
        self.books[book_id] = {
            "title": title,
            "author": author,
            "copies_available": copies_available,
            "fine_per_day": fine_per_day,
            "checked_out": 0,  # Tracks how many copies are currently checked out
            "overdue": 0,  # Tracks how many copies are overdue
            "due_date": None  # Store the due date for the checked-out book
        }
        return "Book Added Successfully"

    def add_user(self, user_id, name):
        if user_id in self.users:
            return "User ID Already Exists"
        self.users[user_id] = {
            "name": name,
            "borrowed_books": [],  # A list to track the book IDs borrowed by the user
            "fines_due": {}  # A dictionary to track overdue fines for each borrowed book
        }
        return "User Added Successfully"

    def checkout_book(self, user_id, book_id, due_date):
        book = self.books.get(book_id)
        user = self.users.get(user_id)
        
        if not book or not user:
            return "Invalid Input"
        
        if book["copies_available"] <= 0:
            return "Book Unavailable"
        
        # Checkout the book
        book["copies_available"] -= 1
        book["checked_out"] += 1
        book["due_date"] = due_date
        user["borrowed_books"].append(book_id)
        
        return "Checkout Successful"

    def return_book(self, user_id, book_id, return_date):
        book = self.books.get(book_id)
        user = self.users.get(user_id)
        
        if not book or not user:
            return "Invalid Input"
        
        if book_id not in user["borrowed_books"]:
            return "Book Not Borrowed by User"
        
        # Update the availability count
        user["borrowed_books"].remove(book_id)
        book["checked_out"] -= 1
        book["copies_available"] += 1

        # Convert the string dates to datetime objects for comparison
        try:
            return_date = datetime.strptime(return_date, "%Y-%m-%d")
            due_date = datetime.strptime(book["due_date"], "%Y-%m-%d")
        except ValueError:
            return "Invalid Date Format"

        # Calculate fine if returned late
        fine = 0
        if return_date > due_date:
            overdue_days = (return_date - due_date).days
            fine = overdue_days * book["fine_per_day"]
            user["fines_due"][book_id] = fine
            book["overdue"] += 1
            book["due_date"] = None  # Clear the due date after return
        
        if fine > 0:
            return f"Book Returned, Fine: {fine}"
        return "Book Returned On Time"

    def pay_fine(self, user_id, book_id):
        user = self.users.get(user_id)
        
        if not user:
            return "Invalid User ID"
        
        if book_id not in user["fines_due"]:
            return "No Fine Due for This Book"
        
        fine = user["fines_due"][book_id]
        
        if fine == 0:
            return "No Fine Due for This Book"
        
        # User pays the fine
        user["fines_due"].pop(book_id)  # Remove the fine for this book
        return "Fine Paid Successfully"


# Example Usage:

library = Library()

# # Test Case 1: Add a Book Successfully
# print(library.add_book(1, "Book One", "Author A", 3, 1.0))  # "Book Added Successfully"

# # Test Case 2: Add a Book with an Existing Book ID (Invalid Case)
# print(library.add_book(1, "Book One", "Author A", 3, 1.0))  # "Book ID Already Exists"

# # Test Case 3: Add a User Successfully
# print(library.add_user(101, "User A"))  # "User Added Successfully"

# # Test Case 4: Add a User with an Existing User ID (Invalid Case)
# print(library.add_user(101, "User A"))  # "User ID Already Exists"

# # Test Case 5: User Checks Out a Book (Valid Checkout)
# print(library.checkout_book(101, 1, "2024-12-01"))  # "Checkout Successful"

# # Test Case 6: Book Unavailable for Checkout (No Copies Available)
# print(library.checkout_book(101, 1, "2024-12-02"))  # "Book Unavailable"

# # Test Case 7: User Returns Book On Time (Valid Return)
# print(library.return_book(101, 1, "2024-12-01"))  # "Book Returned On Time"

# # Test Case 8: User Returns Book Late (With Fine)
# print(library.return_book(101, 1, "2024-12-05"))  # "Book Returned, Fine: 4.0"

# # Test Case 9: User Returns Book Late with Fine (Multiple Days Late)
# print(library.return_book(101, 1, "2024-12-04"))  # "Book Returned, Fine: 3.0"

# # Test Case 10: User Pays Fine for Overdue Book (Valid Payment)
# print(library.pay_fine(101, 1))  # "Fine Paid Successfully"

# # Test Case 11: User Pays Fine When No Fine is Due (Invalid Case)
# print(library.pay_fine(101, 1))  # "No Fine Due for This Book"

# # Test Case 12: User Tries to Return a Book Not Borrowed by Them (Invalid Case)
# print(library.return_book(101, 2, "2024-12-01"))  # "Book Not Borrowed by User"

# # Test Case 13: Invalid Date Format (Invalid Date Format)
# print(library.return_book(101, 1, "2024-12-32"))  # "Invalid Date Format"

# # Test Case 14: User Returns a Book They Have Not Borrowed (Invalid Case)
# print(library.return_book(101, 2, "2024-12-01"))  # "Book Not Borrowed by User"

# # Test Case 15: Invalid Date Format on Return
# print(library.return_book(101, 1, "2024-31-02"))  # "Invalid Date Format"

# # Test Case 16: User Tries to Checkout a Book with Invalid User ID (Invalid User)
# print(library.checkout_book(999, 1, "2024-12-01"))  # "Invalid Input"

# # Test Case 17: User Tries to Checkout an Invalid Book ID (Invalid Book)
# print(library.checkout_book(101, 999, "2024-12-01"))  # "Invalid Input"

# # Test Case 18: User Attempts to Pay Fine for a Book They Did Not Borrow (Invalid Payment)
# print(library.pay_fine(102, 1))  # "Invalid Input"

# # Test Case 19: Book Already Returned, No Fine Due
# print(library.return_book(101, 1, "2024-12-01"))  # "Book Returned On Time"
# print(library.pay_fine(101, 1))  # "No Fine Due for This Book"

# # Test Case 20: Checkout Multiple Books (Different Due Dates)
# print(library.checkout_book(101, 1, "2024-12-01"))  # "Checkout Successful"
# print(library.checkout_book(101, 2, "2024-12-10"))  # "Checkout Successful"

# # Test Case 21: User Pays Multiple Fines for Multiple Books (Multiple Payments)
# print(library.return_book(101, 1, "2024-12-05"))  # "Book Returned, Fine: 4.0"
# print(library.return_book(101, 2, "2024-12-15"))  # "Book Returned, Fine: 5.0"
# print(library.pay_fine(101, 1))  # "Fine Paid Successfully"
# print(library.pay_fine(101, 2))  # "Fine Paid Successfully"

# # Test Case 22: Return Late and User Pays Fine for Each Book
# print(library.return_book(101, 1, "2024-12-05"))  # "Book Returned, Fine: 4.0"
# print(library.pay_fine(101, 1))  # "Fine Paid Successfully"

# # Test Case 23: Add a New User and Checkout Books
# print(library.add_user(102, "User B"))  # "User Added Successfully"
# print(library.checkout_book(102, 1, "2024-12-01"))  # "Checkout Successful"
# print(library.return_book(102, 1, "2024-12-05"))  # "Book Returned, Fine: 4.0"
# print(library.pay_fine(102, 1))  # "Fine Paid Successfully"

# # Test Case 24: Try to Pay Fine After Book is Already Returned On Time (No Fine)
# print(library.pay_fine(102, 1))  # "No Fine Due for This Book"

# # Test Case 25: Invalid Date Format on Return
# print(library.return_book(102, 1, "2024-31-02"))  # "Invalid Date Format"
