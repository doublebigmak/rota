from sqlalchemy.orm import Session
from . import models, schemas


def get_paper(db: Session, paper_id: int):
    return db.query(models.Paper).filter(models.Paper.id == paper_id).first()


def get_papers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Paper).offset(skip).limit(limit).all()

def create_paper(db: Session, paper: schemas.PaperCreate):
    db_paper = models.Paper(**paper.model_dump())
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper

def search_papers(db: Session, keyword: str):
    return db.query(models.Paper).filter(models.Paper.keywords.contains(keyword)).all()