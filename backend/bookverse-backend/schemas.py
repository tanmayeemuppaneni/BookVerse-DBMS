from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime

# --- Book Schemas ---
class BookBase(BaseModel):
    title: str
    author: str
    category: Optional[str] = "Classics"
    isbn: Optional[str] = None
    published_year: Optional[int] = None
    pages: Optional[int] = 320
    rating: Optional[float] = 4.5
    description: Optional[str] = None
    cover: Optional[str] = None
    price: Optional[float] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    isbn: Optional[str] = None
    published_year: Optional[int] = None
    pages: Optional[int] = None
    rating: Optional[float] = None
    description: Optional[str] = None
    cover: Optional[str] = None
    price: Optional[float] = None

class BookOut(BookBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# --- Review Schemas ---
class ReviewCreate(BaseModel):
    book_id: str
    rating: int = Field(..., ge=1, le=5)
    review_text: Optional[str] = None
    user_id: Optional[str] = None

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    review_text: Optional[str] = None

class ReviewOut(BaseModel):
    id: str
    review_id: str
    user_id: str
    user: Optional[str] = "Reader"
    book_id: str
    book_title: Optional[str] = ""
    rating: int
    text: Optional[str] = ""
    review_text: Optional[str] = ""
    created_at: Optional[datetime] = None
    date: Optional[str] = "Recently"
    likes: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)


# --- Reading List Schemas ---
class ReadingListCreate(BaseModel):
    book_id: str
    status: str = "want_to_read"  # supports 'want', 'want_to_read', 'reading', 'finished', 'completed'
    user_id: Optional[str] = None

class ReadingListUpdate(BaseModel):
    status: str

class ReadingListOut(BaseModel):
    id: str
    list_id: str
    user_id: str
    book_id: str
    status: str
    added_at: Optional[datetime] = None
    book: Optional[BookOut] = None

    model_config = ConfigDict(from_attributes=True)
