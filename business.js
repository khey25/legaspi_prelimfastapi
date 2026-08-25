// 1. YOUR VERCEL API URL (Replace with your actual link)
const API_URL = "https://legaspi-prelimfastapi.vercel.app/"; 

// --- DOM Elements for Overlays ---
const categoriesBtn = document.getElementById('categories-btn');
const categoriesOverlay = document.getElementById('categories-overlay');
const closeCategoriesBtn = document.getElementById('close-categories-btn');

const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p'); // Grabs the paragraph to update info

// --- Categories Modal Logic (Unchanged) ---
categoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.remove('hidden');
});
closeCategoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.add('hidden');
});
document.getElementById('nav-home').addEventListener('click', () => {
    window.location.href = 'menu.html';
});
document.getElementById('nav-heists').addEventListener('click', () => {
    window.location.href = 'heists.html'; 
});

// --- API FETCH LOGIC ---

// This function reaches out to your API to get the data
async function loadBusinesses() {
    try {
        // Fetch the data from the /businesses route
        const response = await fetch(`${API_URL}/businesses`);
        const data = await response.json(); // Unpack the JSON

        // Send each tier of data to our card-builder function along with the correct HTML grid ID
        buildCards(data["Suspiciously Profitable"], "grid-profitable");
        buildCards(data["Above Minimum Wage"], "grid-mid");
        buildCards(data["Going Bankrupt"], "grid-bad");

    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

// This function builds the HTML boxes and adds the click pop-ups
function buildCards(businessList, gridId) {
    const grid = document.getElementById(gridId);

    businessList.forEach(business => {
        // Create the <div> for the card
        const card = document.createElement('div');
        card.className = 'business-card';
        card.innerHTML = `<p>${business.name}</p>`;

        // Add the click listener to this specific card for the split-screen detail
        card.addEventListener('click', () => {
            detailTitle.innerText = business.name;
            // Now we can inject the required property from your API!
            detailDescription.innerText = `Required Property: ${business.property}\n\nMore details coming soon...`;
            
            detailsOverlay.classList.remove('hidden');
        });

        // Push the finished card into the HTML grid on the screen
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
loadBusinesses();

// --- Server-Side Search Logic ---
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    
    try {
        // Fetch the filtered data from your new Vercel search route
        const response = await fetch(`${API_URL}/businesses/search?q=${searchTerm}`);
        const data = await response.json();

        // Clear the current grids so we don't just add duplicates
        document.getElementById("grid-profitable").innerHTML = "";
        document.getElementById("grid-mid").innerHTML = "";
        document.getElementById("grid-bad").innerHTML = "";

        // Rebuild the cards with the filtered data
        if (data["Suspiciously Profitable"]) buildCards(data["Suspiciously Profitable"], "grid-profitable");
        if (data["Above Minimum Wage"]) buildCards(data["Above Minimum Wage"], "grid-mid");
        if (data["Going Bankrupt"]) buildCards(data["Going Bankrupt"], "grid-bad");

    } catch (error) {
        console.error("Error searching API:", error);
    }
});