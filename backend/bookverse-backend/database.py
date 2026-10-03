import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Put your raw password inside quote_plus
user = "root"
raw_password = "mysql@123"  # e.g., "root@123"
encoded_password = urllib.parse.quote_plus(raw_password)

DATABASE_URL = f"mysql+pymysql://{user}:{encoded_password}@localhost:3306/bookverse_db?charset=utf8mb4"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()