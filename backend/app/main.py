from fastapi import FastAPI
from app.modules.auth.router import router as auth_router
from app.modules.crm.router import router as crm_router
from app.modules.income.controller import router as income_router

from app.core.config import settings

app = FastAPI(title="Salitrex API", version="0.1.0")

# Startup Check
print(f"--- Startup Check ---")
print(f"S3 Bucket: {settings.S3_BUCKET or 'MISSING'}")
print(f"---------------------")

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(crm_router, prefix=settings.API_V1_STR)
app.include_router(income_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to Salitrex API"}
