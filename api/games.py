from fastapi import APIRouter

router = APIRouter()

games_database = [
    {
        "name": "GTA ONLINE",
        "tags": "gta, grand theft auto, heists, businesses, cayo perico, los santos",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/gtaonline.jpg?raw=true",
        "path": "gta/gtamenu.html",
        "status": "Available"
    },
    {
        "name": "STARDEW VALLEY",
        "tags": "stardew valley, farming, crops, artisan, starfruit, pelican town",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/stardew.jpg?raw=true",
        "path": "stardew/stardewmenu.html",
        "status": "Available"
    },
    {
        "name": "Warframe",
        "tags": "warframe, platinum, relics, farming, space ninjas, void",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/warframe.jpg?raw=true",
        "path": "warframemenu.html",
        "status": "Coming Soon"
    },
    {
        "name": "Minecraft",
        "tags": "minecraft, survival, redstone, automated farms, diamonds, crafting",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/minecraft.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Heartopia",
        "tags": "heartopia, cozy, life sim, crafting, building, multiplayer",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/heartopia.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Cyberpunk 2077",
        "tags": "cyberpunk 2077, night city, edgerunners, eddies, gigs, rpg",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/cyberpunk.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Old School RuneScape",
        "tags": "osrs, runescape, gold farming, skilling, flipping, grand exchange",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/runescape.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Path of Exile",
        "tags": "poe, path of exile, currency, mapping, crafting, chaos orbs",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/pathofexile.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Destiny 2",
        "tags": "destiny 2, glimmer, raids, loot, exotic farming, vanguard",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/destiny2.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "World of Warcraft",
        "tags": "wow, world of warcraft, gold farming, auction house, raids, professions",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/wow.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Animal Crossing",
        "tags": "animal crossing, bells, turnips, stalk market, island, fishing",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/animalcrossing.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Black Desert Online",
        "tags": "bdo, black desert online, silver, lifeskilling, grinding, nodes",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/blackdesert.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "Elite Dangerous",
        "tags": "elite dangerous, credits, mining, trading, space, bounty hunting",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/elitedangerous.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    },
    {
        "name": "No Man's Sky",
        "tags": "no mans sky, units, nanites, farming, space, exploration",
        "image_url": "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/nomansky.jpg?raw=true",
        "path": "",
        "status": "Coming Soon"
    }
]

@router.get("/")
def get_all_games():
    return games_database