const API_URL = "https://legaspi-prelimfastapi.vercel.app";

// --- DOM Elements ---
const categoriesBtn = document.getElementById('categories-btn');
const overlay = document.getElementById('categories-overlay');
const closeBtn = document.getElementById('close-modal-btn');
const searchBar = document.getElementById('search-bar');
const mainContainer = document.querySelector('.templates-container');
const pageTitle = document.querySelector('h2');

// Detail Modal Elements
const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');

// Save the original 3 big templates so we can bring them back if the search bar is empty
const originalTemplatesHTML = mainContainer.innerHTML;

// --- Categories Pop-up Logic ---
categoriesBtn.addEventListener('click', () => overlay.classList.remove('hidden'));
closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

// Main Menu Category Routing
document.getElementById('cat-businesses').addEventListener('click', () => {
    window.location.href = 'business.html';
});
document.getElementById('cat-heists').addEventListener('click', () => {
    window.location.href = 'heists.html';
});

document.getElementById('cat-contact').addEventListener('click', () => {
    window.location.href = 'contact.html';
});

// --- Unified Search Logic ---
searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();

    // If search is empty, restore the original 3 big templates
    if (searchTerm === "") {
        pageTitle.innerText = "Top money hustling methods";
        mainContainer.className = "templates-container"; 
        mainContainer.innerHTML = originalTemplatesHTML;
        return;
    }

    try {
        // Fetch from BOTH APIs at the exact same time
        const [bizResponse, heistResponse] = await Promise.all([
            fetch(`${API_URL}/businesses/search?q=${searchTerm}`),
            fetch(`${API_URL}/heists/search?q=${searchTerm}`)
        ]);

        const bizData = await bizResponse.json();
        const heistData = await heistResponse.json();

        // Flatten all the tiered dictionary data into one giant array
        let combinedResults = [];
        
        Object.values(bizData).forEach(tier => combinedResults.push(...tier));
        Object.values(heistData).forEach(tier => combinedResults.push(...tier));

        // Update the UI
        pageTitle.innerText = `Search Results for "${searchTerm}"`;
        mainContainer.className = "search-results"; // Switch to grid layout
        mainContainer.innerHTML = ""; // Clear out the old cards

        if (combinedResults.length === 0) {
            mainContainer.innerHTML = "<p>No methods found. Try searching something else!</p>";
            return;
        }

        // Build the result cards
        combinedResults.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `<p>${item.name}</p>`;

            // Attach the click event for the split-screen detail
            card.addEventListener('click', () => {
                detailTitle.innerText = item.name;
                
                // Handle the fact that businesses use 'property' and heists use 'required_property'
                const reqProp = item.property || item.required_property;
                detailDescription.innerText = `Required Property: ${reqProp}\n\nMore details coming soon...`;
                
                detailsOverlay.classList.remove('hidden');
            });

            mainContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error searching unified APIs:", error);
    }
});

// --- Close Modals Logic ---
closeDetailsBtn.addEventListener('click', () => detailsOverlay.classList.add('hidden'));

window.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.classList.add('hidden');
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});