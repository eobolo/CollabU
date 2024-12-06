import re

class ArticleManager:
    def __init__(self, article_text, options=None):
        if options is None:
            options = {}
        
        self.article_text = article_text
        self.pages = []
        self.words = []
        self.options = {
            'words_per_line': options.get('words_per_line', 12),
            'lines_per_page': options.get('lines_per_page', 20),
            'payment_structure': options.get('payment_structure', {
                1: 30,
                2: 30,
                3: 60,
                4: 60,
                'default': 100,
            })
        }

    def split_into_pages(self):
        words_per_line = self.options['words_per_line']
        lines_per_page = self.options['lines_per_page']
        total_words = len(self.words)

        # Calculate number of pages (each page contains 240 words)
        if total_words == 0:
            total_pages = 0
        else:
            total_pages = (total_words + words_per_line * lines_per_page - 1) // (words_per_line * lines_per_page)

        # Split the words into pages
        for page_index in range(total_pages):
            start_index = page_index * words_per_line * lines_per_page
            end_index = min((page_index + 1) * words_per_line * lines_per_page, total_words)
            page_words = self.words[start_index:end_index]
            
            page_lines = []
            for i in range(0, len(page_words), words_per_line):
                page_lines.append(' '.join(page_words[i:i + words_per_line]))
            
            # Join lines into the final page content
            self.pages.append('\n'.join(page_lines))

    def calculate_payment(self):
        total_words = len(self.words)

        # If there are fewer than 240 words, the payment should be $0
        if total_words < 240:
            return 0

        # Calculate the total number of pages
        words_per_page = self.options['words_per_line'] * self.options['lines_per_page']
        total_pages = (total_words + words_per_page - 1) // words_per_page

        # Payment structure based on number of pages
        if total_pages == 1 or total_pages == 2:
            return 30
        elif total_pages == 3 or total_pages == 4:
            return 60
        else:
            return 100

    def display_pages(self):
        # Display pages first
        for index, page in enumerate(self.pages):
            print(f"Page {index + 1}:\n{page}\n")

        # Now display total pages and payment
        total_pages = len(self.pages)
        payment = self.calculate_payment()

        print(f"Total Pages: {total_pages}")
        print(f"Payment Due: ${payment}")

    def process_article(self):
        # First, split the article into words
        self.words = re.split(r'\s+', self.article_text.strip())
        
        # Then, split the article into pages
        self.split_into_pages()
        
        # Finally, display the pages and payment
        self.display_pages()

# Example usage
article_text = """Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."""

article_manager = ArticleManager(article_text)
article_manager.process_article()











import re

class ArticleManager:
    """
    A class to manage article writing and freelancer payments. This class splits an article into pages, 
    calculates the payment based on the total word count, and displays the article's content and payment due.

    Attributes:
    -----------
    article_text : str
        The article text provided by the user.
    options : dict
        A dictionary of options such as the number of words per line, lines per page, and the payment structure.
    """

    def __init__(self, article_text, options=None):
        """
        Initializes the ArticleManager with the given article text and options.
        
        Parameters:
        -----------
        article_text : str
            The article text to process.
        options : dict, optional
            A dictionary of options for customizing the number of words per line, lines per page, and the payment structure.
        """
        if options is None:
            options = {}

        # Set up article text and options with defaults
        self.article_text = article_text
        self.options = {
            'words_per_line': options.get('words_per_line', 12),  # Default: 12 words per line
            'lines_per_page': options.get('lines_per_page', 20),  # Default: 20 lines per page
            'payment_structure': options.get('payment_structure', {
                1: 30,    # 1-2 pages: $30
                2: 30,
                3: 60,    # 3-4 pages: $60
                4: 60,
                'default': 100,  # More than 4 pages: $100
            })
        }

    def calculate_payment(self):
        """
        Calculates the payment due based on the total word count of the article.

        The payment is determined as follows:
        - Fewer than 240 words: $0
        - 1-2 pages (240-479 words): $30
        - 3-4 pages (480-959 words): $60
        - More than 4 pages (960+ words): $100
        
        Returns:
        --------
        int
            The payment amount due for the article.
        """
        # Calculate total number of words in the article
        total_words = len(re.findall(r'\S+', self.article_text))  # Use regex to count non-whitespace words

        # If fewer than 240 words, return $0
        if total_words < 240:
            return 0

        # Calculate number of pages (240 words per page)
        total_pages = (total_words + 239) // 240  # Equivalent to ceiling division of total_words / 240

        # Payment structure based on the number of pages
        if total_pages <= 2:
            return 30
        elif total_pages <= 4:
            return 60
        else:
            return 100

    def display_article(self):
        """
        Displays the article's content page-by-page in the console, and then the total number of pages 
        and the payment amount due for the article.
        """
        # Calculate total number of words and pages directly without storing pages in memory
        total_words = len(re.findall(r'\S+', self.article_text))  # Regex to find non-whitespace words
        total_pages = (total_words + 239) // 240  # Calculate number of pages

        # Display pages by splitting the article into lines
        if total_pages == 0:
            print("No content to display.")
        else:
            words = re.split(r'\s+', self.article_text.strip())  # Split article into words

            # Print the pages, word by word
            words_per_page = self.options['words_per_line'] * self.options['lines_per_page']  # 240 words per page
            for page_index in range(total_pages):
                start_index = page_index * words_per_page
                end_index = min((page_index + 1) * words_per_page, total_words)
                page_words = words[start_index:end_index]

                # Print the current page content
                page_lines = []
                for i in range(0, len(page_words), self.options['words_per_line']):
                    page_lines.append(' '.join(page_words[i:i + self.options['words_per_line']]))
                print(f"Page {page_index + 1}:\n" + '\n'.join(page_lines) + "\n")

        # Now, display total pages and payment
        payment = self.calculate_payment()
        print(f"Total Pages: {total_pages}")
        print(f"Payment Due: ${payment}")

    def process_article(self):
        """
        Processes the article by calculating the pages and displaying them along with the payment due.
        """
        self.display_article()


# Example usage
article_text = """Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."""

# Initialize ArticleManager
article_manager = ArticleManager(article_text)

# Process and display the article
article_manager.process_article()
