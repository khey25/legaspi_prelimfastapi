from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# --- CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THE MASSIVE 16-ATTRIBUTE DATABASE ---
gta_database = {
    "businesses": {
        "Suspiciously Profitable": [
            {
                "name": "Acid Lab", 
                "property": "Brickade 6x6 (Freakshop)",
                "associated_network": "Fooliganz",
                "setup_cost": 750000,
                "is_passive": True,
                "solo_friendly": True,
                "max_payout": 335200,
                "restock_method": "Buy or Steal",
                "can_be_raided": False,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Los Santos Drug Wars",
                "release_year": 2022,
                "location_options": 1,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/acid.jpg?raw=true"
            },
            {
                "name": "Nightclub Management", 
                "property": "Nightclub",
                "associated_network": "Nightclub Underground",
                "setup_cost": 1080000,
                "is_passive": True,
                "solo_friendly": True,
                "max_payout": 1900000,
                "restock_method": "Fully Passive",
                "can_be_raided": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "After Hours",
                "release_year": 2018,
                "location_options": 10,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/nightclub.jpg?raw=true"
            },
            {
                "name": "Gunrunning", 
                "property": "Bunker",
                "associated_network": "Disruption Logistics",
                "setup_cost": 1165000,
                "is_passive": True,
                "solo_friendly": True,
                "max_payout": 1050000,
                "restock_method": "Buy or Steal",
                "can_be_raided": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Gunrunning",
                "release_year": 2017,
                "location_options": 11,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/gunrunning.jpg?raw=true"
            }
        ],
        "Above Minimum Wage": [
            {
                "name": "Special & Vehicle Cargo", 
                "property": "Executive Office",
                "associated_network": "SecuroServ",
                "setup_cost": 1000000,
                "is_passive": False,
                "solo_friendly": True,
                "max_payout": 2200000,
                "restock_method": "Steal Only",
                "can_be_raided": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Further Adventures in Finance and Felony",
                "release_year": 2016,
                "location_options": 4,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/vehicle.jpg?raw=true"
            },
            {
                "name": "Cocaine Lockup", 
                "property": "MC Clubhouse",
                "associated_network": "Motorcycle Club",
                "setup_cost": 975000,
                "is_passive": True,
                "solo_friendly": False,
                "max_payout": 525000,
                "restock_method": "Buy or Steal",
                "can_be_raided": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Bikers",
                "release_year": 2016,
                "location_options": 4,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/cocaine.jpg?raw=true"
            },
            {
                "name": "Air Freight Cargo", 
                "property": "Hangar",
                "associated_network": "Free Trade Shipping Co",
                "setup_cost": 1200000,
                "is_passive": False,
                "solo_friendly": False,
                "max_payout": 2500000,
                "restock_method": "Steal Only",
                "can_be_raided": False,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Smuggler's Run",
                "release_year": 2017,
                "location_options": 5,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/aircargo.jpg?raw=true"
            },
            {
                "name": "Bail Enforcement", 
                "property": "Bail Office",
                "associated_network": "Bail Enforcement",
                "setup_cost": 1550000,
                "is_passive": False,
                "solo_friendly": True,
                "max_payout": 130000,
                "restock_method": "Bounty Hunting",
                "can_be_raided": False,
                "cooldown_minutes": 48,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Bottom Dollar Bounties",
                "release_year": 2024,
                "location_options": 5,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/bail.jpg?raw=true"
            }
        ],
        "Going Bankrupt": [
            {
                "name": "Document Forgery Office", 
                "property": "MC Clubhouse",
                "associated_network": "Motorcycle Club",
                "setup_cost": 650000,
                "is_passive": True,
                "solo_friendly": False,
                "max_payout": 126000,
                "restock_method": "Buy or Steal",
                "can_be_raided": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Bikers",
                "release_year": 2016,
                "location_options": 4,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/forgery.jpg?raw=true"
            },
            {
                "name": "Weed Farm", 
                "property": "MC Clubhouse",
                "associated_network": "Motorcycle Club",
                "setup_cost": 715000,
                "is_passive": True,
                "solo_friendly": False,
                "max_payout": 315000,
                "restock_method": "Buy or Steal",
                "can_be_raided": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Bikers",
                "release_year": 2016,
                "location_options": 4,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/weed.jpg?raw=true"
            },
            {
                "name": "Counterfeit Cash Factory", 
                "property": "MC Clubhouse",
                "associated_network": "Motorcycle Club",
                "setup_cost": 845000,
                "is_passive": True,
                "solo_friendly": False,
                "max_payout": 352000,
                "restock_method": "Buy or Steal",
                "can_be_raided": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "release_update": "Bikers",
                "release_year": 2016,
                "location_options": 4,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/cash.jpg?raw=true"
            }
        ]
    },
    "heists": {
        "Billionaire Amongst Millionaires": [
            {
                "name": "The Cayo Perico Heist", 
                "required_property": "Kosatka Submarine",
                "primary_location": "Cayo Perico Island",
                "setup_cost": 100000,
                "solo_friendly": True,
                "max_payout": 4100000,
                "prep_missions": 5,
                "cooldown_minutes": 144,
                "min_players": 1,
                "max_players": 4,
                "stealth_option": True,
                "hard_mode_available": True,
                "elite_challenge": True,
                "release_update": "The Cayo Perico Heist",
                "release_year": 2020,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/cayo.jpg?raw=true"
            },
            {
                "name": "The Contract: Dr. Dre", 
                "required_property": "Agency",
                "primary_location": "Los Santos",
                "setup_cost": 0,
                "solo_friendly": True,
                "max_payout": 1000000,
                "prep_missions": 9,
                "cooldown_minutes": 48,
                "min_players": 1,
                "max_players": 4,
                "stealth_option": False,
                "hard_mode_available": False,
                "elite_challenge": False,
                "release_update": "The Contract",
                "release_year": 2021,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/dre.jpg?raw=true"
            },
            {
                "name": "The Diamond Casino Heist", 
                "required_property": "Arcade",
                "primary_location": "Diamond Casino & Resort",
                "setup_cost": 25000,
                "solo_friendly": False,
                "max_payout": 3619000,
                "prep_missions": 6,
                "cooldown_minutes": 48,
                "min_players": 2,
                "max_players": 4,
                "stealth_option": True,
                "hard_mode_available": True,
                "elite_challenge": True,
                "release_update": "The Diamond Casino Heist",
                "release_year": 2019,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/casino.jpg?raw=true"
            }
        ],
        "Typical Bank Heist": [
            {
                "name": "The Pacific Standard Job", 
                "required_property": "High-End Apartment",
                "primary_location": "Downtown Vinewood",
                "setup_cost": 100000,
                "solo_friendly": False,
                "max_payout": 1250000,
                "prep_missions": 5,
                "cooldown_minutes": 48,
                "min_players": 4,
                "max_players": 4,
                "stealth_option": False,
                "hard_mode_available": True,
                "elite_challenge": True,
                "release_update": "Heists Update",
                "release_year": 2015,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/pacific.jpg?raw=true"
            },
            {
                "name": "The Doomsday Heist", 
                "required_property": "Facility",
                "primary_location": "San Andreas",
                "setup_cost": 120000,
                "solo_friendly": False,
                "max_payout": 1500000,
                "prep_missions": 5,
                "cooldown_minutes": 48,
                "min_players": 2,
                "max_players": 4,
                "stealth_option": True,
                "hard_mode_available": True,
                "elite_challenge": True,
                "release_update": "The Doomsday Heist",
                "release_year": 2017,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/doomsday.jpg?raw=true"
            },
            {
                "name": "The Cluckin' Bell Farm Raid", 
                "required_property": "Vincent (Map Marker)",
                "primary_location": "Paleto Bay",
                "setup_cost": 0,
                "solo_friendly": True,
                "max_payout": 500000,
                "prep_missions": 5,
                "cooldown_minutes": 48,
                "min_players": 1,
                "max_players": 4,
                "stealth_option": True,
                "hard_mode_available": False,
                "elite_challenge": False,
                "release_update": "The Cluckin' Bell Farm Raid",
                "release_year": 2024,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/cluckin.jpg?raw=true"
            }
        ],
        "What is this? A Convenience Store?": [
            {
                "name": "The Fleeca Job", 
                "required_property": "High-End Apartment",
                "primary_location": "Great Ocean Highway",
                "setup_cost": 11500,
                "solo_friendly": False,
                "max_payout": 143750,
                "prep_missions": 2,
                "cooldown_minutes": 48,
                "min_players": 2,
                "max_players": 2,
                "stealth_option": False,
                "hard_mode_available": True,
                "elite_challenge": True,
                "release_update": "Heists Update",
                "release_year": 2015,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/fleeca.jpg?raw=true"
            },
            {
                "name": "Auto Shop Contracts", 
                "required_property": "Auto Shop",
                "primary_location": "Los Santos",
                "setup_cost": 0,
                "solo_friendly": True,
                "max_payout": 300000,
                "prep_missions": 2,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "stealth_option": False,
                "hard_mode_available": False,
                "elite_challenge": False,
                "release_update": "Los Santos Tuners",
                "release_year": 2021,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/autoshop.jpg?raw=true"
            },
            {
                "name": "Salvage Yard Robberies", 
                "required_property": "Salvage Yard",
                "primary_location": "Los Santos",
                "setup_cost": 20000,
                "solo_friendly": True,
                "max_payout": 300000,
                "prep_missions": 3,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "stealth_option": True,
                "hard_mode_available": False,
                "elite_challenge": False,
                "release_update": "The Chop Shop",
                "release_year": 2023,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/salvage.jpg?raw=true"
            }
        ]
    },
    "contact": {
        "Money and Time Efficient": [
            {
                "name": "First Dose & Last Dose", 
                "contact": "Dax",
                "mission_type": "Story Campaign",
                "unlock_requirement": "None",
                "solo_friendly": True,
                "base_payout": 100000,
                "time_to_complete_mins": 15,
                "difficulty_selectable": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "combat_heavy": True,
                "double_money_eligible": True,
                "release_update": "Los Santos Drug Wars",
                "release_year": 2022,
                "image_url": "https://raw.githubusercontent.com/YOUR_GITHUB/images/dax.jpg"
            },
            {
                "name": "Payphone Hits", 
                "contact": "Franklin Clinton",
                "mission_type": "Free Roam Assassination",
                "unlock_requirement": "Own an Agency",
                "solo_friendly": True,
                "base_payout": 85000,
                "time_to_complete_mins": 5,
                "difficulty_selectable": False,
                "cooldown_minutes": 10,
                "min_players": 1,
                "max_players": 2,
                "combat_heavy": False,
                "double_money_eligible": False,
                "release_update": "The Contract",
                "release_year": 2021,
                "image_url": "https://raw.githubusercontent.com/YOUR_GITHUB/images/franklin.jpg"
            }
        ],
        "Just for the Vibes": [
            {
                "name": "Dispatch Services", 
                "contact": "Martin Madrazo",
                "mission_type": "Instanced Co-op",
                "unlock_requirement": "None",
                "solo_friendly": False,
                "base_payout": 20000,
                "time_to_complete_mins": 5,
                "difficulty_selectable": True,
                "cooldown_minutes": 0,
                "min_players": 2,
                "max_players": 4,
                "combat_heavy": True,
                "double_money_eligible": True,
                "release_update": "Southern San Andreas Super Sport Series",
                "release_year": 2018,
                "image_url": "https://raw.githubusercontent.com/YOUR_GITHUB/images/martin.jpg"
            },
            {
                "name": "Premium Deluxe Repo Work", 
                "contact": "Simeon Yetarian",
                "mission_type": "Instanced Co-op",
                "unlock_requirement": "None",
                "solo_friendly": True,
                "base_payout": 20000,
                "time_to_complete_mins": 8,
                "difficulty_selectable": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "combat_heavy": True,
                "double_money_eligible": True,
                "release_update": "Arena War",
                "release_year": 2019,
                "image_url": "https://raw.githubusercontent.com/YOUR_GITHUB/images/simeon.jpg"
            },
            {
                "name": "Last Play Missions", 
                "contact": "Gerald",
                "mission_type": "Instanced Co-op",
                "unlock_requirement": "None",
                "solo_friendly": True,
                "base_payout": 25000,
                "time_to_complete_mins": 10,
                "difficulty_selectable": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "combat_heavy": True,
                "double_money_eligible": True,
                "release_update": "Gerald's Last Play",
                "release_year": 2020,
                "image_url": "https://raw.githubusercontent.com/YOUR_GITHUB/images/gerald.jpg"
            }
        ],
        "Why are you even doing this?": [
            {
                "name": "Operation Paper Trail", 
                "contact": "Agent ULP",
                "mission_type": "Story Campaign",
                "unlock_requirement": "None",
                "solo_friendly": True,
                "base_payout": 40000,
                "time_to_complete_mins": 15,
                "difficulty_selectable": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "combat_heavy": True,
                "double_money_eligible": True,
                "release_update": "The Criminal Enterprises",
                "release_year": 2022,
                "image_url": "https://raw.githubusercontent.com/YOUR_GITHUB/images/ulp.jpg"
            },
            {
                "name": "Classic Grinds", 
                "contact": "Lester Crest",
                "mission_type": "Instanced Co-op",
                "unlock_requirement": "Level 75",
                "solo_friendly": False,
                "base_payout": 18000,
                "time_to_complete_mins": 10,
                "difficulty_selectable": True,
                "cooldown_minutes": 0,
                "min_players": 1,
                "max_players": 4,
                "combat_heavy": True,
                "double_money_eligible": True,
                "release_update": "High Life Update",
                "release_year": 2014,
                "image_url": "https://raw.githubusercontent.com/YOUR_GITHUB/images/lester.jpg"
            }
        ]
    }
}

# --- HOME ENDPOINT ---
@app.get("/")
def home():
    return {"message": "Welcome to the Gaming Activity API!"}

# --- BUSINESS ROUTES ---
@app.get("/gta/businesses")
def get_all_businesses():
    return gta_database["businesses"]

@app.get("/gta/businesses/search")
def search_businesses(q: Optional[str] = ""):
    if not q: return gta_database["businesses"]
    results = {"Suspiciously Profitable": [], "Above Minimum Wage": [], "Going Bankrupt": []}
    for tier, items in gta_database["businesses"].items():
        matched = [b for b in items if q.lower() in b["name"].lower()]
        if matched: results[tier] = matched
    return results

@app.get("/gta/businesses/{ranking}")
def get_businesses_by_ranking(ranking: str):
    result = gta_database["businesses"].get(ranking)
    if not result: raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result

# --- HEIST ROUTES ---
@app.get("/gta/heists")
def get_all_heists():
    return gta_database["heists"]

@app.get("/gta/heists/search")
def search_heists(q: Optional[str] = ""):
    if not q: return gta_database["heists"]
    results = {"Billionaire Amongst Millionaires": [], "Typical Bank Heist": [], "What is this? A Convenience Store?": []}
    for tier, items in gta_database["heists"].items():
        matched = [h for h in items if q.lower() in h["name"].lower()]
        if matched: results[tier] = matched
    return results

@app.get("/gta/heists/{ranking}")
def get_heists_by_ranking(ranking: str):
    result = gta_database["heists"].get(ranking)
    if not result: raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result

# --- CONTACT MISSION ROUTES ---
@app.get("/gta/contact")
def get_all_contact_missions():
    return gta_database["contact"]

@app.get("/gta/contact/search")
def search_contact_missions(q: Optional[str] = ""):
    if not q: return gta_database["contact"]
    results = {"Money and Time Efficient": [], "Just for the Vibes": [], "Why are you even doing this?": []}
    for tier, items in gta_database["contact"].items():
        matched = [c for c in items if q.lower() in c["name"].lower()]
        if matched: results[tier] = matched
    return results

@app.get("/gta/contact/{ranking}")
def get_contact_by_ranking(ranking: str):
    result = gta_database["contact"].get(ranking)
    if not result: raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result
