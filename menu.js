
// --- MAIN MENU ROUTING ---
// When a user clicks a card, send them to that game's specific folder/menu
document.getElementById('nav-gta').addEventListener('click', () => {
    window.location.href = 'gta/gtamenu.html'; // Assuming this is in the same root folder
});

document.getElementById('nav-stardew').addEventListener('click', () => {
    window.location.href = 'stardewmenu.html';
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