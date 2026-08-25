// 1. YOUR VERCEL API URL (Replace with your actual link)
const API_URL = "https://legaspi-prelimfastapi.vercel.app/"; 

// --- DOM Elements for Overlays ---
const categoriesBtn = document.getElementById('categories-btn');
const categoriesOverlay = document.getElementById('categories-overlay');
const closeCategoriesBtn = document.getElementById('close-categories-btn');

const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p'); 

// --- Categories Modal Logic ---
categoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.remove('hidden');
});
closeCategoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.add('hidden');
});
document.getElementById('nav-home').addEventListener('click', () => {
    window.location.href = 'menu.html';
});
document.getElementById('nav-business').addEventListener('click', () => {
    window.location.href = 'business.html'; 
});

document.getElementById('nav-contact').addEventListener('click', () => {
    window.location.href = 'contact.html';
});

// --- API FETCH LOGIC ---

// Reaches out to your API to get the heist data
async function loadHeists() {
    try {
        // Fetch from the /heists route
        const response = await fetch(`${API_URL}/heists`);
        const data = await response.json(); 

        // Send each tier of data to our builder function
        buildCards(data["Billionaire Amongst Millionaires"], "grid-billionaire");
        buildCards(data["Typical Bank Heist"], "grid-typical");
        buildCards(data["What is this? A Convenience Store?"], "grid-convenience");

    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

// Builds the HTML boxes and adds the click pop-ups
function buildCards(heistList, gridId) {
    const grid = document.getElementById(gridId);

    heistList.forEach(heist => {
        // Create the card
        const card = document.createElement('div');
        card.className = 'heist-card';
        card.innerHTML = `<p>${heist.name}</p>`;

        // Add the split-screen click listener
        card.addEventListener('click', () => {
            detailTitle.innerText = heist.name;
            // Uses required_property from your Python API
            detailDescription.innerText = `Required Property: ${heist.required_property}\n\nMore details coming soon...`;
            
            detailsOverlay.classList.remove('hidden');
        });

        grid.appendChild(card);
    });
}

// Close details modal
closeDetailsBtn.addEventListener('click', () => {
    detailsOverlay.classList.add('hidden');
});

// Close overlays if clicking the dark background
window.addEventListener('click', (event) => {
    if (event.target === categoriesOverlay) categoriesOverlay.classList.add('hidden');
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});

// TRIGGER THE FETCH WHEN THE SCRIPT LOADS
loadHeists();

// --- Server-Side Search Logic (Heists) ---
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    
    try {
        const response = await fetch(`https://legaspi-prelimfastapi.vercel.app/heists/search?q=${searchTerm}`);
        const data = await response.json();

        // Clear the current grids
        document.getElementById("grid-billionaire").innerHTML = "";
        document.getElementById("grid-typical").innerHTML = "";
        document.getElementById("grid-convenience").innerHTML = "";

        // Rebuild the cards with the filtered data
        if (data["Billionaire Amongst Millionaires"]) buildCards(data["Billionaire Amongst Millionaires"], "grid-billionaire");
        if (data["Typical Bank Heist"]) buildCards(data["Typical Bank Heist"], "grid-typical");
        if (data["What is this? A Convenience Store?"]) buildCards(data["What is this? A Convenience Store?"], "grid-convenience");

    } catch (error) {
        console.error("Error searching API:", error);
    }
});