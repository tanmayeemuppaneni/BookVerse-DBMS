from database import SessionLocal
from models import Book

db = SessionLocal()

# Create some sample books
sample_books = [
    Book(title="The Great Gatsby", author="F. Scott Fitzgerald", description="A classic story of the Jazz Age.", published_year=1925),
    Book(title="Dune", author="Frank Herbert", description="Epic science fiction set on the desert planet Arrakis.", published_year=1965),
    Book(title="1984", author="George Orwell", description="A dystopian social science fiction novel.", published_year=1949)
]

# Insert into MySQL
db.add_all(sample_books)
db.commit()
print("Successfully added 3 sample books to MySQL!")
db.close()