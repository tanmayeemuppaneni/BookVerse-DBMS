from sqlalchemy import Column, String, Integer, Text, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Links users to their reviews and reading lists
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    reading_list = relationship("ReadingList", back_populates="user", cascade="all, delete-orphan")

class Book(Base):
    __tablename__ = "books"
    
    # Map Python 'id' to MySQL column 'book_id'
    id = Column("book_id", String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, default="Classics", index=True)
    isbn = Column(String(20), unique=True, nullable=True)
    published_year = Column(Integer, nullable=True, index=True)
    pages = Column(Integer, nullable=True, default=320)
    rating = Column(Numeric(3, 2), nullable=True, default=4.5)
    description = Column(Text, nullable=True)
    
    # Map Python 'cover' to MySQL column 'cover_image_url'
    cover = Column("cover_image_url", String(255), nullable=True)
    
    price = Column(Numeric(10, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reviews = relationship("Review", back_populates="book", cascade="all, delete-orphan")
    reading_list = relationship("ReadingList", back_populates="book", cascade="all, delete-orphan")

class Review(Base):
    __tablename__ = "reviews"
    
    review_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Point ForeignKey to MySQL column 'books.book_id'
    book_id = Column(String(36), ForeignKey("books.book_id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    book = relationship("Book", back_populates="reviews")

    @property
    def id(self):
        return self.review_id

class ReadingList(Base):
    __tablename__ = "reading_list"
    
    list_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    
    # Point ForeignKey to MySQL column 'books.book_id'
    book_id = Column(String(36), ForeignKey("books.book_id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum('want_to_read', 'reading', 'completed'), default='want_to_read')
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reading_list")
    book = relationship("Book", back_populates="reading_list")

    @property
    def id(self):
        return self.list_id