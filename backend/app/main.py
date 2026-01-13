from fastapi import FastAPI
from app.modules.auth.router import router as auth_router
from app.modules.crm.router import router as crm_router

from app.core.config import settings

app = FastAPI(title="Salitrex API", version="0.1.0")

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(crm_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to Salitrex API"}
