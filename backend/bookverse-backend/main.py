import os
import uuid
import shutil
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database import SessionLocal, engine
import models
import schemas

# Create tables in MySQL if not present
models.Base.metadata.create_all(bind=engine)

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="BookVerse API", version="1.0.0")

# CORS middleware to allow React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads directory for static image serving
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Dependency to manage database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_default_user(db: Session) -> models.User:
    """Helper to ensure a demo user exists in MySQL for foreign key constraints."""
    user = db.query(models.User).filter(models.User.username == "alexreads").first()
    if not user:
        user = models.User(
            user_id="u1",
            username="alexreads",
            email="alex@example.com",
            password_hash="demo_password_hash"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def normalize_status(status_str: str) -> str:
    """Map frontend reading list statuses to backend MySQL Enum values."""
    s = (status_str or "").lower().strip()
    if s in ["want", "want_to_read"]:
        return "want_to_read"
    elif s in ["reading"]:
        return "reading"
    elif s in ["finished", "completed"]:
        return "completed"
    return "want_to_read"


def format_review_response(r: models.Review) -> dict:
    """Format review for frontend consumption."""
    user_name = r.user.username if r.user else "Reader"
    return {
        "id": r.review_id,
        "review_id": r.review_id,
        "user_id": r.user_id,
        "user": user_name,
        "book_id": r.book_id,
        "book": r.book_id,
        "book_title": r.book.title if r.book else "",
        "rating": r.rating,
        "text": r.review_text or "",
        "review_text": r.review_text or "",
        "created_at": r.created_at,
        "date": r.created_at.strftime("%b %d, %Y") if r.created_at else "Just now",
        "likes": 0,
        "own": True
    }


# ==========================================
# IMAGE UPLOAD ROUTE
# ==========================================
@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and return the accessible static URL."""
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension {ext}. Allowed: {', '.join(allowed_extensions)}"
        )

    unique_filename = f"{uuid.uuid4().hex[:10]}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"http://127.0.0.1:8000/uploads/{unique_filename}"
    return {"url": image_url, "filename": unique_filename}


# ==========================================
# BOOK CRUD ROUTES
# ==========================================
@app.get("/books/", response_model=List[schemas.BookOut])
def read_books(db: Session = Depends(get_db)):
    """Fetch all books."""
    books = db.query(models.Book).order_by(models.Book.created_at.desc()).all()
    return books


@app.get("/books/{book_id}", response_model=schemas.BookOut)
def get_book(book_id: str, db: Session = Depends(get_db)):
    """Fetch a single book by ID."""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return book


@app.post("/books/", response_model=schemas.BookOut, status_code=status.HTTP_201_CREATED)
def create_book(book_in: schemas.BookCreate, db: Session = Depends(get_db)):
    """Create and add a new book to MySQL."""
    new_book = models.Book(
        title=book_in.title,
        author=book_in.author,
        category=book_in.category or "Classics",
        isbn=book_in.isbn,
        published_year=book_in.published_year,
        pages=book_in.pages or 320,
        rating=book_in.rating or 4.5,
        description=book_in.description,
        cover=book_in.cover,
        price=book_in.price
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book


@app.put("/books/{book_id}", response_model=schemas.BookOut)
def update_book(book_id: str, book_in: schemas.BookUpdate, db: Session = Depends(get_db)):
    """Update an existing book in MySQL."""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    update_data = book_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)

    db.commit()
    db.refresh(book)
    return book


@app.delete("/books/{book_id}")
def delete_book(book_id: str, db: Session = Depends(get_db)):
    """Delete a book from MySQL."""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully", "id": book_id}


# ==========================================
# REVIEW CRUD ROUTES
# ==========================================
@app.get("/reviews/")
def get_all_reviews(db: Session = Depends(get_db)):
    """Fetch all reviews."""
    reviews = db.query(models.Review).order_by(models.Review.created_at.desc()).all()
    return [format_review_response(r) for r in reviews]


@app.get("/books/{book_id}/reviews/")
def get_book_reviews(book_id: str, db: Session = Depends(get_db)):
    """Fetch reviews for a specific book."""
    reviews = db.query(models.Review).filter(models.Review.book_id == book_id).order_by(models.Review.created_at.desc()).all()
    return [format_review_response(r) for r in reviews]


@app.post("/reviews/", status_code=status.HTTP_201_CREATED)
def submit_review(review_in: schemas.ReviewCreate, db: Session = Depends(get_db)):
    """Submit a new user review."""
    # Ensure book exists
    book = db.query(models.Book).filter(models.Book.id == review_in.book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    # Ensure user exists (fallback to default demo user)
    user_id = review_in.user_id
    if user_id:
        user = db.query(models.User).filter(models.User.user_id == user_id).first()
        if not user:
            user = get_default_user(db)
            user_id = user.user_id
    else:
        user = get_default_user(db)
        user_id = user.user_id

    new_review = models.Review(
        user_id=user_id,
        book_id=review_in.book_id,
        rating=review_in.rating,
        review_text=review_in.review_text
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return format_review_response(new_review)


@app.put("/reviews/{review_id}")
def update_review(review_id: str, review_in: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    """Update a review rating or text."""
    review = db.query(models.Review).filter(models.Review.review_id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    if review_in.rating is not None:
        review.rating = review_in.rating
    if review_in.review_text is not None:
        review.review_text = review_in.review_text

    db.commit()
    db.refresh(review)
    return format_review_response(review)


@app.delete("/reviews/{review_id}")
def delete_review(review_id: str, db: Session = Depends(get_db)):
    """Delete a review."""
    review = db.query(models.Review).filter(models.Review.review_id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted successfully", "id": review_id}


# ==========================================
# READING LIST CRUD ROUTES
# ==========================================
@app.get("/reading-list/")
def get_reading_list(db: Session = Depends(get_db)):
    """Get the current user's reading list."""
    user = get_default_user(db)
    items = db.query(models.ReadingList).filter(models.ReadingList.user_id == user.user_id).all()
    # Return as list and dict for convenient frontend mapping
    result = []
    for item in items:
        result.append({
            "id": item.list_id,
            "list_id": item.list_id,
            "book_id": item.book_id,
            "status": item.status,
            "added_at": item.added_at,
            "book": {
                "id": item.book.id,
                "title": item.book.title,
                "author": item.book.author,
                "cover": item.book.cover
            } if item.book else None
        })
    return result


@app.post("/reading-list/", status_code=status.HTTP_201_CREATED)
def add_or_update_reading_list(item_in: schemas.ReadingListCreate, db: Session = Depends(get_db)):
    """Add a book to reading list or update its status."""
    book = db.query(models.Book).filter(models.Book.id == item_in.book_id).first()
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    user = get_default_user(db)
    mapped_status = normalize_status(item_in.status)

    existing = db.query(models.ReadingList).filter(
        models.ReadingList.user_id == user.user_id,
        models.ReadingList.book_id == item_in.book_id
    ).first()

    if existing:
        existing.status = mapped_status
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        new_item = models.ReadingList(
            user_id=user.user_id,
            book_id=item_in.book_id,
            status=mapped_status
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        target = new_item

    return {
        "id": target.list_id,
        "list_id": target.list_id,
        "user_id": target.user_id,
        "book_id": target.book_id,
        "status": target.status,
        "added_at": target.added_at
    }


@app.delete("/reading-list/{book_id}")
def remove_from_reading_list(book_id: str, db: Session = Depends(get_db)):
    """Remove a book from the reading list."""
    user = get_default_user(db)
    item = db.query(models.ReadingList).filter(
        models.ReadingList.user_id == user.user_id,
        models.ReadingList.book_id == book_id
    ).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in reading list")

    db.delete(item)
    db.commit()
    return {"message": "Removed from reading list", "book_id": book_id}


# ==========================================
# DATABASE EVALUATION & STATS ENDPOINT
# ==========================================
@app.get("/stats/db/")
def get_db_stats(db: Session = Depends(get_db)):
    """Live MySQL Database Statistics, Table Metrics, and Aggregation for DBMS Evaluation."""
    from sqlalchemy import text
    category_counts = db.execute(text("""
        SELECT category, COUNT(*) as count, ROUND(AVG(pages), 0) as avg_pages, ROUND(AVG(rating), 2) as avg_rating 
        FROM books 
        GROUP BY category 
        ORDER BY count DESC;
    """)).fetchall()

    total_books = db.query(models.Book).count()
    total_reviews = db.query(models.Review).count()
    total_reading_list = db.query(models.ReadingList).count()
    total_users = db.query(models.User).count()

    return {
        "database_name": "bookverse_db",
        "engine": "MySQL 8.0 (InnoDB)",
        "charset": "utf8mb4",
        "status": "online",
        "total_books": total_books,
        "total_reviews": total_reviews,
        "total_reading_list_items": total_reading_list,
        "total_users": total_users,
        "categories_breakdown": [
            {
                "category": row[0],
                "count": row[1],
                "avg_pages": int(row[2]) if row[2] else 350,
                "avg_rating": float(row[3]) if row[3] else 4.5
            }
            for row in category_counts
        ]
    }