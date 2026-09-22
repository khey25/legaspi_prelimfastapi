
// --- MAIN MENU ROUTING ---
// When a user clicks a card, send them to that game's specific folder/menu
document.getElementById('nav-gta').addEventListener('click', () => {
    window.location.href = 'gta/gtamenu.html'; // Assuming this is in the same root folder
});

document.getElementById('nav-stardew').addEventListener('click', () => {
    window.location.href = 'stardew/stardewmenu.html';
});

document.getElementById('nav-warframe').addEventListener('click', () => {
    window.location.href = 'warframemenu.html';
});


// --- LIGHTWEIGHT LOCAL SEARCH ---
const searchBar = document.getElementById('search-bar');
const gameCards = document.querySelectorAll('.nav-card');

searchBar.addEventListener('keyup', (e) => {
    const query = e.target.value.toLowerCase().trim();

    gameCards.forEach(card => {
        // Pull the hidden keywords we wrote into the HTML data-tags
        const tags = card.getAttribute('data-tags').toLowerCase();
        
        // If the tags include what the user typed, show it. Otherwise, hide it!
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

// Open Modal
if (toolsBtn) {
    toolsBtn.addEventListener('click', () => {
        toolsOverlay.classList.remove('hidden');
    });
}

// Close Modal (via X button)
if (closeToolsBtn) {
    closeToolsBtn.addEventListener('click', () => {
        toolsOverlay.classList.add('hidden');
    });
}

// Close Modal (via clicking the blurred background)
window.addEventListener('click', (event) => {
    if (event.target === toolsOverlay) {
        toolsOverlay.classList.add('hidden');
    }
});

// Route to The Hustle Match
const matchmakerCard = document.getElementById('tool-matchmaker');
if (matchmakerCard) {
    matchmakerCard.addEventListener('click', () => {
        // This assumes you will create matchmaker.html in the same root folder as index.html
        window.location.href = 'matchmaker.html';
    });
}
