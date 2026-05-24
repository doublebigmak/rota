from pydantic import BaseModel

class PaperBase(BaseModel):
    title: str
    authors: str
    abstract: str
    keywords: str

class PaperCreate(PaperBase):
    pass

class Paper(PaperBase):
    id: int

    class Config:
        orm_mode = True