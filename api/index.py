from fastapi import FastAPI, HTTPException

app = FastAPI()

gta_database = {
    "businesses": {
        "Suspiciously Profitable": [
            {"name": "Acid Lab", "property": "Brickade 6x6 (Freakshop)"},
            {"name": "Nightclub Management", "property": "Nightclub"},
            {"name": "Gunrunning", "property": "Bunker"}
        ],
        "Above Minimum Wage": [
            {"name": "Special & Vehicle Cargo", "property": "Executive Office"},
            {"name": "Cocaint Lockup", "property": "MC Clubhouse"},
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
            {"name": "The Diamond Casino Heist", "required_property": "Arcade"}
        ],
        "Typical Bank Heist": [
            {"name": "The Pacific Standard Job", "required_property": "High-End Apartment"},
            {"name": "The Doomsday Heist", "required_property": "Facility"},
            {"name": "The Contract: Dr. Dre", "required_property": "Agency"},
            {"name": "The Cluckin' Bell Farm Raid", "required_property": "Vincent (Map Marker)"}
        ],
        "What is this? A Convenience Store?": [
            {"name": "The Fleeca Job", "required_property": "High-End Apartment"},
            {"name": "Auto Shop Contracts", "required_property": "Auto Shop"},
            {"name": "Salvage Yard Robberies", "required_property": "Salvage Yard"}
        ]
    }
}

#DITO YUNG MGA DATA ENDPOINTS

@app.get("/")
def home():
    return {"message": "Welcome to the GTA Online Activity API!"}

@app.get("/businesses")
def get_all_businesses():
    """Returns all businesses grouped by ranking."""
    return gta_database["businesses"]

@app.get("/businesses/{ranking}")
def get_businesses_by_ranking(ranking: str):
    """
    Search businesses by ranking. 
    Use exactly: 'Suspiciously Profitable', 'Above Minimum Wage', or 'Going Bankrupt'
    """
    # Using .get() prevents errors if the user types a ranking that doesn't exist
    result = gta_database["businesses"].get(ranking)
    if not result:
        raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result

# --- Heist Routes ---

@app.get("/heists")
def get_all_heists():
    """Returns all heists grouped by ranking."""
    return gta_database["heists"]

@app.get("/heists/{ranking}")
def get_heists_by_ranking(ranking: str):
    """
    Search heists by ranking. 
    Use exactly: 'Billionaire Amongst Millionaires', 'Typical Bank Heist', or 'What is this? A Convenience Store?'
    """
    result = gta_database["heists"].get(ranking)
    if not result:
        raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result
