import datetime

class Book:
    def __init__(self, book_id, title, author, copies_available, fine_per_day):
        if self.book_id_exists(book_id):
            raise ValueError("Book ID Already Exists")

        self.book_id = book_id
        self.title = title
        self.author = author
        self.copies_available = copies_available
        self.fine_per_day = fine_per_day
        self.status = "available"

    def book_id_exists(self, book_id):
        """ Check if the book_id is already in the book list """
        for book in all_books:
            if book.book_id == book_id:
                return True
        return False

    @property
    def is_available(self):
        return self.status == "available" and self.copies_available > 0

    def checkout(self):
        if not self.is_available:
            raise ValueError("Book is not available for checkout.")
        self.copies_available -= 1
        self.status = "checked_out"

    def return_book(self, return_date):
        global all_books
        today = return_date
        book = next((b for b in all_books if b.book_id == self.book_id), None)
        if book is None:
            raise ValueError("Invalid book return.")

        if book.status != "checked_out":
            raise ValueError("You haven't borrowed this book.")

        due_date = book.borrow_date + datetime.timedelta(days=14)
        days_overdue = (today - due_date).days if today > due_date else 0

        if days_overdue > 0:
            book.status = "overdue"
            fine = days_overdue * book.fine_per_day
            owed_fines[book.borrower_user_id][book.book_id] = fine
        else:
            book.status = "available"
            book.copies_available += 1

        # Clear the borrower information when the book is returned
        book.borrower_user_id = None
        book.borrow_date = None

    def calculate_overdue_fine(self, return_date):
        today = return_date
        due_date = self.borrow_date + datetime.timedelta(days=14)
        days_overdue = (today - due_date).days if today > due_date else 0
        return days_overdue * self.fine_per_day


class User:
    def __init__(self, user_id):
        self.user_id = user_id
        self.borrowed_books = []

    def borrow_book(self, book):
        if not book.is_available:
            raise ValueError("Book is not available for checkout.")

        book.checkout()
        book.borrower_user_id = self.user_id
        book.borrow_date = datetime.date.today()
        self.borrowed_books.append(book.book_id)

    def return_book(self, book_id):
        for book in all_books:
            if book.book_id == book_id and book.borrower_user_id == self.user_id:
                book.return_book(datetime.date.today())
                self.borrowed_books.remove(book_id)
                return
        raise ValueError("You haven't borrowed this book.")

    def pay_fine(self, book_id):
        if book_id not in owed_fines.get(self.user_id, {}):
            print("You have no fine for this book.")
            return

        fine = owed_fines[self.user_id][book_id]
        print(f"Fine paid: ${fine}")
        del owed_fines[self.user_id][book_id]

        # Once fine is paid
