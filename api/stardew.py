from fastapi import APIRouter, HTTPException
from typing import Optional

# Initialize the router
router = APIRouter()

# --- THE MASSIVE 16-ATTRIBUTE STARDEW DATABASE ---
stardew_database = {
    "crops": {
        "Joja-Level Profits": [
            {
                "name": "Starfruit", 
                "setup_cost": 400,
                "base_payout": 750,
                "max_payout": 825,
                "processing_days": 13,
                "optimal_season": "Summer",
                "required_building": "Outdoors / Greenhouse",
                "required_equipment": "None",
                "prerequisite_skill": "Farming Lv 1",
                "best_profession": "Tiller",
                "loved_by_villagers": "Kent",
                "is_repeatable": False,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/starfruit.jpg?raw=true"
            },
            {
                "name": "Ancient Fruit", 
                "setup_cost": 0,
                "base_payout": 550,
                "max_payout": 605,
                "processing_days": 28,
                "optimal_season": "All Seasons",
                "required_building": "Greenhouse",
                "required_equipment": "None",
                "prerequisite_skill": "None",
                "best_profession": "Tiller",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/ancientfruit.jpg?raw=true"
            },
            {
                "name": "Sweet Gem Berry", 
                "setup_cost": 1000,
                "base_payout": 3000,
                "max_payout": 6000,
                "processing_days": 24,
                "optimal_season": "Fall",
                "required_building": "Outdoors / Greenhouse",
                "required_equipment": "Rare Seed",
                "prerequisite_skill": "None",
                "best_profession": "None",
                "loved_by_villagers": "Master Cannoli",
                "is_repeatable": False,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/sweetgem.jpg?raw=true"
            }
        ],
        "Honest Honest Work": [
            {
                "name": "Pumpkins", 
                "setup_cost": 100,
                "base_payout": 320,
                "max_payout": 352,
                "processing_days": 13,
                "optimal_season": "Fall",
                "required_building": "Outdoors",
                "required_equipment": "None",
                "prerequisite_skill": "Farming Lv 1",
                "best_profession": "Tiller",
                "loved_by_villagers": "Abigail, Krobus, Willy",
                "is_repeatable": False,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/pumpkin.jpg?raw=true"
            },
            {
                "name": "Cranberries", 
                "setup_cost": 240,
                "base_payout": 75,
                "max_payout": 82,
                "processing_days": 7,
                "optimal_season": "Fall",
                "required_building": "Outdoors",
                "required_equipment": "None",
                "prerequisite_skill": "Farming Lv 1",
                "best_profession": "Tiller",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/cranberry.jpg?raw=true"
            },
            {
                "name": "Strawberries", 
                "setup_cost": 100,
                "base_payout": 120,
                "max_payout": 132,
                "processing_days": 8,
                "optimal_season": "Spring",
                "required_building": "Outdoors",
                "required_equipment": "None",
                "prerequisite_skill": "Farming Lv 1",
                "best_profession": "Tiller",
                "loved_by_villagers": "Demetrius, Maru",
                "is_repeatable": True,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/strawberry.jpg?raw=true"
            }
        ],
        "Literally Just For Fun": [
            {
                "name": "Parsnip", 
                "setup_cost": 20,
                "base_payout": 35,
                "max_payout": 38,
                "processing_days": 4,
                "optimal_season": "Spring",
                "required_building": "Outdoors",
                "required_equipment": "None",
                "prerequisite_skill": "None",
                "best_profession": "Tiller",
                "loved_by_villagers": "Pam",
                "is_repeatable": False,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/parsnip.jpg?raw=true"
            },
            {
                "name": "Fairy Rose", 
                "setup_cost": 200,
                "base_payout": 290,
                "max_payout": 319,
                "processing_days": 12,
                "optimal_season": "Fall",
                "required_building": "Outdoors",
                "required_equipment": "None",
                "prerequisite_skill": "None",
                "best_profession": "Tiller",
                "loved_by_villagers": "Evelyn, Jas",
                "is_repeatable": False,
                "greenhouse_compatible": True,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/fairyrose.jpg?raw=true"
            }
        ]
    },
    "artisan_goods": {
        "Joja-Level Profits": [
            {
                "name": "Starfruit Wine", 
                "setup_cost": 400,
                "base_payout": 2250,
                "max_payout": 6300,
                "processing_days": 7,
                "optimal_season": "All Seasons",
                "required_building": "Shed / Cellar",
                "required_equipment": "Keg + Cask",
                "prerequisite_skill": "Farming Lv 8",
                "best_profession": "Artisan",
                "loved_by_villagers": "Harvey",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": False,
                "artisan_buff_eligible": True,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/starfruitwine.jpg?raw=true"
            },
            {
                "name": "Ancient Fruit Wine", 
                "setup_cost": 0,
                "base_payout": 1650,
                "max_payout": 4620,
                "processing_days": 7,
                "optimal_season": "All Seasons",
                "required_building": "Shed / Cellar",
                "required_equipment": "Keg + Cask",
                "prerequisite_skill": "Farming Lv 8",
                "best_profession": "Artisan",
                "loved_by_villagers": "Harvey",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": False,
                "artisan_buff_eligible": True,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/ancientwine.jpg?raw=true"
            },
            {
                "name": "Pale Ale", 
                "setup_cost": 60,
                "base_payout": 300,
                "max_payout": 420,
                "processing_days": 2,
                "optimal_season": "All Seasons",
                "required_building": "Shed",
                "required_equipment": "Keg",
                "prerequisite_skill": "Farming Lv 8",
                "best_profession": "Artisan",
                "loved_by_villagers": "Pam",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": False,
                "artisan_buff_eligible": True,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/paleale.jpg?raw=true"
            }
        ],
        "Honest Honest Work": [
            {
                "name": "Truffle Oil", 
                "setup_cost": 1000,
                "base_payout": 1065,
                "max_payout": 1491,
                "processing_days": 1,
                "optimal_season": "All Seasons",
                "required_building": "Shed",
                "required_equipment": "Oil Maker",
                "prerequisite_skill": "Farming Lv 8",
                "best_profession": "Artisan",
                "loved_by_villagers": "Mayor Lewis",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": False,
                "artisan_buff_eligible": True,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/truffleoil.jpg?raw=true"
            },
            {
                "name": "Goat Cheese", 
                "setup_cost": 4000,
                "base_payout": 400,
                "max_payout": 1120,
                "processing_days": 1,
                "optimal_season": "All Seasons",
                "required_building": "Barn / Cellar",
                "required_equipment": "Cheese Press",
                "prerequisite_skill": "Farming Lv 6",
                "best_profession": "Artisan",
                "loved_by_villagers": "Leah, Robin",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": False,
                "artisan_buff_eligible": True,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/goatcheese.jpg?raw=true"
            }
        ],
        "Literally Just For Fun": [
            {
                "name": "Mayonnaise", 
                "setup_cost": 800,
                "base_payout": 190,
                "max_payout": 399,
                "processing_days": 1,
                "optimal_season": "All Seasons",
                "required_building": "Coop",
                "required_equipment": "Mayonnaise Machine",
                "prerequisite_skill": "Farming Lv 2",
                "best_profession": "Artisan",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": False,
                "artisan_buff_eligible": True,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/mayo.jpg?raw=true"
            },
            {
                "name": "Apple Jelly", 
                "setup_cost": 0,
                "base_payout": 150,
                "max_payout": 210,
                "processing_days": 3,
                "optimal_season": "All Seasons",
                "required_building": "Shed",
                "required_equipment": "Preserves Jar",
                "prerequisite_skill": "Farming Lv 4",
                "best_profession": "Artisan",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": False,
                "artisan_buff_eligible": True,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/applejelly.jpg?raw=true"
            }
        ]
    },
    "animal_products": {
        "Joja-Level Profits": [
            {
                "name": "Truffle", 
                "setup_cost": 16000,
                "base_payout": 625,
                "max_payout": 1250,
                "processing_days": 1,
                "optimal_season": "Spring, Summer, Fall",
                "required_building": "Deluxe Barn",
                "required_equipment": "Pig",
                "prerequisite_skill": "Foraging Lv 10",
                "best_profession": "Botanist",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/truffle.jpg?raw=true"
            },
            {
                "name": "Ostrich Egg", 
                "setup_cost": 0,
                "base_payout": 600,
                "max_payout": 1440,
                "processing_days": 7,
                "optimal_season": "All Seasons",
                "required_building": "Barn",
                "required_equipment": "Ostrich",
                "prerequisite_skill": "None",
                "best_profession": "Rancher",
                "loved_by_villagers": "Leo",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/ostrichegg.jpg?raw=true"
            }
        ],
        "Honest Honest Work": [
            {
                "name": "Dinosaur Egg", 
                "setup_cost": 0,
                "base_payout": 350,
                "max_payout": 420,
                "processing_days": 7,
                "optimal_season": "All Seasons",
                "required_building": "Big Coop",
                "required_equipment": "Dinosaur",
                "prerequisite_skill": "None",
                "best_profession": "Rancher",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/dinoegg.jpg?raw=true"
            },
            {
                "name": "Large Goat Milk", 
                "setup_cost": 4000,
                "base_payout": 345,
                "max_payout": 414,
                "processing_days": 2,
                "optimal_season": "All Seasons",
                "required_building": "Big Barn",
                "required_equipment": "Goat",
                "prerequisite_skill": "None",
                "best_profession": "Rancher",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/goatmilk.jpg?raw=true"
            }
        ],
        "Literally Just For Fun": [
            {
                "name": "Brown Egg", 
                "setup_cost": 800,
                "base_payout": 50,
                "max_payout": 60,
                "processing_days": 1,
                "optimal_season": "All Seasons",
                "required_building": "Coop",
                "required_equipment": "Chicken",
                "prerequisite_skill": "None",
                "best_profession": "Rancher",
                "loved_by_villagers": "None",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/brownegg.jpg?raw=true"
            },
            {
                "name": "Wool", 
                "setup_cost": 8000,
                "base_payout": 340,
                "max_payout": 408,
                "processing_days": 3,
                "optimal_season": "All Seasons",
                "required_building": "Barn",
                "required_equipment": "Sheep",
                "prerequisite_skill": "None",
                "best_profession": "Rancher",
                "loved_by_villagers": "Emily",
                "is_repeatable": True,
                "greenhouse_compatible": False,
                "daily_maintenance": True,
                "artisan_buff_eligible": False,
                "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/stardew/stardewimages/wool.jpg?raw=true"
            }
        ]
    }
}

# --- HOME ENDPOINT ---
@router.get("/")
def home():
    return {"message": "Welcome to the Stardew Valley Farming API!"}

# --- CROPS ROUTES ---
@router.get("/crops")
def get_all_crops():
    return stardew_database["crops"]

@router.get("/crops/search")
def search_crops(q: Optional[str] = ""):
    if not q: return stardew_database["crops"]
    results = {"Joja-Level Profits": [], "Honest Honest Work": [], "Literally Just For Fun": []}
    for tier, items in stardew_database["crops"].items():
        matched = [c for c in items if q.lower() in c["name"].lower()]
        if matched: results[tier] = matched
    return results

@router.get("/crops/{ranking}")
def get_crops_by_ranking(ranking: str):
    result = stardew_database["crops"].get(ranking)
    if not result: raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result

# --- ARTISAN GOODS ROUTES ---
@router.get("/artisan_goods")
def get_all_artisan_goods():
    return stardew_database["artisan_goods"]

@router.get("/artisan_goods/search")
def search_artisan_goods(q: Optional[str] = ""):
    if not q: return stardew_database["artisan_goods"]
    results = {"Joja-Level Profits": [], "Honest Honest Work": [], "Literally Just For Fun": []}
    for tier, items in stardew_database["artisan_goods"].items():
        matched = [a for a in items if q.lower() in a["name"].lower()]
        if matched: results[tier] = matched
    return results

@router.get("/artisan_goods/{ranking}")
def get_artisan_goods_by_ranking(ranking: str):
    result = stardew_database["artisan_goods"].get(ranking)
    if not result: raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result

# --- ANIMAL PRODUCTS ROUTES ---
@router.get("/animal_products")
def get_all_animal_products():
    return stardew_database["animal_products"]

@router.get("/animal_products/search")
def search_animal_products(q: Optional[str] = ""):
    if not q: return stardew_database["animal_products"]
    results = {"Joja-Level Profits": [], "Honest Honest Work": [], "Literally Just For Fun": []}
    for tier, items in stardew_database["animal_products"].items():
        matched = [a for a in items if q.lower() in a["name"].lower()]
        if matched: results[tier] = matched
    return results

@router.get("/animal_products/{ranking}")
def get_animal_products_by_ranking(ranking: str):
    result = stardew_database["animal_products"].get(ranking)
    if not result: raise HTTPException(status_code=404, detail="Ranking tier not found.")
    return result
