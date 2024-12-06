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

        # Calculate number of pages
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
        total_pages = len(self.pages)
        
        # Payment calculation based on the number of pages
        if total_pages == 0:
            return 0
        elif total_pages <= 2:
            return 30
        elif total_pages <= 4:
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
