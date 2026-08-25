from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# --- CORS MIDDLEWARE ---
# This allows your frontend website to pull data from this backend API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE MOCK ---
gta_database = {
    "businesses": {
        "Suspiciously Profitable": [
            {"name": "Acid Lab", "property": "Brickade 6x6 (Freakshop)"},
            {"name": "Nightclub Management", "property": "Nightclub"},
            {"name": "Gunrunning", "property": "Bunker"}
        ],
        "Above Minimum Wage": [
            {"name": "Special & Vehicle Cargo", "property": "Executive Office"},
            {"name": "Cocaine Lockup", "property": "MC Clubhouse"},
            {"name": "Air Freight Cargo", "property": "Hangar"},
            {"name": "Bail Enforcement", "property": "Bail Office"}
        ],
        "Going Bankrupt": [
            {"name": "Document Forgery Office", "property": "MC Clubhouse"},
            {"name": "Weed Farm", "property": "MC Clubhouse"},
            {"name": "Counterfeit Cash Factory", "property": "MC Clubhouse"}
        ]
    },
    "heists": {
        "Billionaire Amongst Millionaires": [
            {"name": "The Cayo Perico Heist", "required_property": "Kosatka Submarine"},
            {"name": "The Contract: Dr. Dre", "required_property": "Agency"},
            {"name": "The Diamond Casino Heist", "required_property": "Arcade"}
        ],
        "Typical Bank Heist": [
            {"name": "The Pacific Standard Job", "required_property": "High-End Apartment"},
            {"name": "The Doomsday Heist", "required_property": "Facility"},
            {"name": "The Cluckin' Bell Farm Raid", "required_property": "Vincent (Map Marker)"}
        ],
        "What is this? A Convenience Store?": [
            {"name": "The Fleeca Job", "required_property": "High-End Apartment"},
            {"name": "Auto Shop Contracts", "required_property": "Auto Shop"},
            {"name": "Salvage Yard Robberies", "required_property": "Salvage Yard"}
        ]
    },

"contact": {
        "Money and Time Efficient": [
            {
                "name": "First Dose & Last Dose", 
                "contact": "Dax", 
                "image_url": ""
            },
            {
                "name": "Payphone Hits", 
                "contact": "Franklin Clinton", 
                "image_url": ""
            }
        ],
        "Just for the Vibes": [
            {
                "name": "Dispatch Services", 
                "contact": "Martin Madrazo", 
                "image_url": ""
            },
            {
                "name": "Premium Deluxe Repo Work", 
                "contact": "Simeon Yetarian", 
                "image_url": ""
            },
            {
                "name": "Last Play Missions", 
                "contact": "Gerald", 
                "image_url": ""
            }
        ],
        "Why are you even doing this?": [
            {
                "name": "Operation Paper Trail", 
                "contact": "Agent ULP", 
                "image_url": ""
            },
            {
                "name": "Classic Grinds", 
                "contact": "Lester Crest", 
                "image_url": ""
            }
        ]
    }
}




# --- HOME ENDPOINT ---

@app.get("/")
def home():
    return {"message": "Welcome to the GTA Online Activity API!"}


# --- BUSINESS ROUTES ---

@app.get("/businesses")
def get_all_businesses():
    """Returns all businesses grouped by ranking."""
    return gta_database["businesses"]

@app.get("/businesses/search")
def search_businesses(q: Optional[str] = ""):
    """Searches businesses by name."""
    if not q:
        return gta_database["businesses"]
    
    results = {"Suspiciously Profitable": [], "Above Minimum Wage": [], "Going Bankrupt": []}
    for tier, items in gta_database["businesses"].items():
        matched = [b for b in items if q.lower() in b["name"].lower()]
        if matched:
            results[tier] = matched
    return results

@app.get("/businesses/{ranking}")
def get_businesses_by_ranking(ranking: str):
    """Search businesses by ranking tier."""
    result = gta_database["businesses"].get(ranking)
    if not result:
        raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result


# --- HEIST ROUTES ---

@app.get("/heists")
def get_all_heists():
    """Returns all heists grouped by ranking."""
    return gta_database["heists"]

@app.get("/heists/search")
def search_heists(q: Optional[str] = ""):
    """Searches heists by name."""
    if not q:
        return gta_database["heists"]
    
    results = {"Billionaire Amongst Millionaires": [], "Typical Bank Heist": [], "What is this? A Convenience Store?": []}
    for tier, items in gta_database["heists"].items():
        matched = [h for h in items if q.lower() in h["name"].lower()]
        if matched:
            results[tier] = matched
    return results

@app.get("/heists/{ranking}")
def get_heists_by_ranking(ranking: str):
    """Search heists by ranking tier."""
    result = gta_database["heists"].get(ranking)
    if not result:
        raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result

    # --- CONTACT MISSION ROUTES ---

@app.get("/contact")
def get_all_contact_missions():
    """Returns all contact missions grouped by ranking."""
    return gta_database["contact"]

@app.get("/contact/search")
def search_contact_missions(q: Optional[str] = ""):
    """Searches contact missions by name."""
    if not q:
        return gta_database["contact"]
    
    results = {"Money and Time Efficient": [], "Just for the Vibes": [], "Why are you even doing this?": []}
    for tier, items in gta_database["contact"].items():
        matched = [c for c in items if q.lower() in c["name"].lower()]
        if matched:
            results[tier] = matched
    return results

@app.get("/contact/{ranking}")
def get_contact_by_ranking(ranking: str):
    """Search contact missions by ranking tier."""
    result = gta_database["contact"].get(ranking)
    if not result:
        raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result
