from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002","http://localhost:3000",'http://localhost:3001','http://localhost:3004'],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data
papers = [
    {"id": 1, "title": "Introduction to Machine Learning"},
    {"id": 2, "title": "Advanced Neural Networks"},
    {"id": 3, "title": "Bob's Quantum Mechanics"},
    {"id": 4, "title": "Fermi's Solutions"}
]

@app.post("/papers", response_model=schemas.Paper)
async def create_paper(paper: schemas.PaperCreate, db: Session = Depends(get_db)):
    return crud.create_paper(db=db, paper= paper)




@app.get("/papers")
async def read_papers(skip: int=0, limit: int = 100, db:Session=Depends(get_db)):
    papers = crud.get_papers(db, skip=skip, limit=limit)
    return papers

@app.get("/papers/{paper_id}", response_model=schemas.Paper)
def read_paper(paper_id: int, db: Session = Depends(get_db)):
    db_paper = crud.get_paper(db, paper_id=paper_id)
    if db_paper is None:
        raise HTTPException(status_code=404 ,detail = "Paper not found")
    return db_paper

@app.get("/search/", response_model=list[schemas.Paper])
def search_papers(keyword: str, db: Session= Depends(get_db)):
    papers=crud.search_papers(db, keyword=keyword)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)