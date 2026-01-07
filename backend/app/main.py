from fastapi import FastAPI
from app.modules.auth.router import router as auth_router
from app.modules.crm.router import router as crm_router

app = FastAPI(title="Salitrex API", version="0.1.0")

app.include_router(auth_router)
app.include_router(crm_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Salitrex API"}
