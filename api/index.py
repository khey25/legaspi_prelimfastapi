from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your GTA routes
from api.gta import router as gta_router

app = FastAPI()

# --- CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PLUG IN THE ROUTERS ---
# This automatically slaps "/gta" in front of every route in gta.py!
app.include_router(gta_router, prefix="/gta", tags=["GTA"])

# (When you build Warframe later, you will add it right here!)
# from api.warframe import router as warframe_router
# app.include_router(warframe_router, prefix="/warframe", tags=["Warframe"])

# --- ROOT ENDPOINT ---
@app.get("/")
def root():
    return {"message": "Welcome to the Gaming Hustle API! The server is running perfectly."}
