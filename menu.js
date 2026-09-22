const API_URL = "https://the-hustle-hub.vercel.app";

// --- API FETCH LOGIC ---
async function loadGames() {
    try {
        const response = await fetch(`${API_URL}/games`);
        const games = await response.json(); 
        buildGameCards(games);
    } catch (error) {
        console.error("Error fetching games directory from API:", error);
    }
}

// --- DYNAMIC CARD BUILDER ---
function buildGameCards(gameList) {
    const grid = document.getElementById('games-grid');
    if (!grid || !gameList) return;

    grid.innerHTML = ""; // Clear existing

    gameList.forEach(game => {
        const card = document.createElement('div');
        card.className = 'nav-card';
        card.setAttribute('data-tags', game.tags);
        
        // Render dynamic title text based on backend availability status
        let titleDisplay = game.status === "Available" ? game.name : "coming soon...";

        card.innerHTML = `
            <img src="${game.image_url}" class="nav-img" alt="${game.name}">
            <h2 class="card-title">${titleDisplay}</h2>
        `;

        // Only add click routing if the game is active
        card.addEventListener('click', () => {
            if (game.status === "Available" && game.path !== "") {
                window.location.href = game.path;
            }
        });

        grid.appendChild(card);
    });
}

// --- DYNAMIC SEARCH BAR ---
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    // Dynamically query all cards currently on screen
    const gameCards = document.querySelectorAll('.nav-card');

    gameCards.forEach(card => {
        const tags = card.getAttribute('data-tags').toLowerCase();
        if (tags.includes(query) || query === "") {
            card.style.display = "flex"; 
        } else {
            card.style.display = "none";
        }
    });
});

// --- TOOLS MODAL LOGIC ---
const toolsBtn = document.getElementById('tools-btn');
const toolsOverlay = document.getElementById('tools-overlay');
const closeToolsBtn = document.getElementById('close-tools-btn');

if (toolsBtn) toolsBtn.addEventListener('click', () => toolsOverlay.classList.remove('hidden'));
if (closeToolsBtn) closeToolsBtn.addEventListener('click', () => toolsOverlay.classList.add('hidden'));

window.addEventListener('click', (event) => {
    if (event.target === toolsOverlay) toolsOverlay.classList.add('hidden');
});

const matchmakerCard = document.getElementById('tool-matchmaker');
if (matchmakerCard) {
    matchmakerCard.addEventListener('click', () => window.location.href = 'matchmaker.html');
}

// TRIGGER INITIAL LOAD
loadGames();
