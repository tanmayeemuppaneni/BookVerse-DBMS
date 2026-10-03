from database import SessionLocal
from models import Book

db = SessionLocal()

# A larger library of actual books
real_books = [
    Book(title="The Brothers Karamazov", author="Fyodor Dostoevsky", description="A passionate philosophical novel set in 19th-century Russia that enters deeply into the ethical debates of God, free will, and morality.", published_year=1880),
    Book(title="Crime and Punishment", author="Fyodor Dostoevsky", description="A psychological drama focusing on the mental anguish and moral dilemmas of an impoverished ex-student in St. Petersburg.", published_year=1866),
    Book(title="Vagabond, Vol. 1", author="Takehiko Inoue", description="A fictionalized retelling of the life of Miyamoto Musashi, the legendary Japanese swordsman, featuring incredible brush artwork.", published_year=1998),
    Book(title="Slam Dunk, Vol. 1", author="Takehiko Inoue", description="A classic coming-of-age sports manga about a high school basketball team.", published_year=1990),
    Book(title="The Name of the Wind", author="Patrick Rothfuss", description="The tale of a magically gifted young man who grows to be the most notorious wizard his world has ever seen.", published_year=2007),
    Book(title="The Silent Patient", author="Alex Michaelides", description="A shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive.", published_year=2019),
    Book(title="Clean Code", author="Robert C. Martin", description="A handbook of agile software craftsmanship, teaching how to write robust, maintainable code.", published_year=2008),
    Book(title="Grokking Algorithms", author="Aditya Bhargava", description="An illustrated, friendly guide that teaches you how to apply common algorithms to the practical problems you face every day as a programmer.", published_year=2016),
    Book(title="The Hobbit", author="J.R.R. Tolkien", description="A great modern classic and the prelude to The Lord of the Rings.", published_year=1937),
    Book(title="And Then There Were None", author="Agatha Christie", description="Ten strangers are invited to an isolated island, where they are killed off one by one.", published_year=1939)
]

db.add_all(real_books)
db.commit()
print("Successfully added 10 new books to the database!")
db.close()