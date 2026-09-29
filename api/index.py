from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime # Required for the health check timestamp

# Import your game routers
from api.gta import router as gta_router
from api.stardew import router as stardew_router

# ==========================================
# CONFIGURATION CONSTANTS
# ==========================================
API_KEY = "hustle-hub-secret-key"
API_VERSION = "1.0"

# Instantiate the application with the new configuration
app = FastAPI(
    title="The Gaming Hustle API",
    description="A centralized REST API for game money-making strategies.",
    version=API_VERSION
)

# --- CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# API KEY AUTHENTICATION DEPENDENCY
# ==========================================
# This function intercepts incoming requests and checks the "x-api-key" header
def verify_api_key(x_api_key: Optional[str] = Header(default=None)):
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key."
        )
    return True

# ==========================================
# PLUG IN THE ROUTERS WITH VERSIONING & SECURITY
# ==========================================
# We update the prefix to include '/api/v1' for versioning.
# We add the 'dependencies' parameter to enforce the API key check on ALL routes within these modules.
app.include_router(gta_router, prefix="/api/v1/gta", tags=["GTA"], dependencies=[Depends(verify_api_key)])
app.include_router(stardew_router, prefix="/api/v1/stardew", tags=["Stardew Valley"], dependencies=[Depends(verify_api_key)])

# ==========================================
# HEALTH CHECK (Public)
# ==========================================
# This route is unprotected so automated monitors can ping it
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "The Gaming Hustle API",
        "version": API_VERSION,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# --- ROOT ENDPOINT (Unprotected for testing) ---
@app.get("/")
def root():
    return {
        "message": "Welcome to the Gaming Hustle API!",
        "version": API_VERSION,
        "status": "Running securely."
    }