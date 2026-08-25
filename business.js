// 1. YOUR VERCEL API URL
const API_URL = "https://legaspi-prelimfastapi.vercel.app"; 

// --- DOM Elements for Overlays ---
const categoriesBtn = document.getElementById('categories-btn');
const categoriesOverlay = document.getElementById('categories-overlay');
const closeCategoriesBtn = document.getElementById('close-categories-btn');

const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p'); 

// NEW: Grab the left-side image container so we can inject the picture
const detailImageContainer = document.querySelector('.details-image'); 

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
document.getElementById('nav-heists').addEventListener('click', () => {
    window.location.href = 'heists.html'; 
});
document.getElementById('nav-contact').addEventListener('click', () => {
    window.location.href = 'contact.html';
});

// --- API FETCH LOGIC ---
async function loadBusinesses() {
    try {
        const response = await fetch(`${API_URL}/businesses`);
        const data = await response.json(); 

        buildCards(data["Suspiciously Profitable"], "grid-profitable");
        buildCards(data["Above Minimum Wage"], "grid-mid");
        buildCards(data["Going Bankrupt"], "grid-bad");

    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

// --- CARD BUILDER & CLICK LOGIC ---
function buildCards(businessList, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return; // Safety check

    businessList.forEach(business => {
        const card = document.createElement('div');
        card.className = 'business-card';
        
        // CSS added directly here so images fit inside the card and don't block clicks!
        card.style.position = "relative";
        card.style.overflow = "hidden";
        card.style.cursor = "pointer";

        // Inject the image and title. pointer-events: none ensures the click passes to the card.
        card.innerHTML = `
            <img src="${business.image_url}" alt="${business.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0.5; position: absolute; top: 0; left: 0; z-index: -1; pointer-events: none;">
            <p style="position: relative; z-index: 1; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px #000; pointer-events: none;">${business.name}</p>
        `;

        // The Click Listener
        card.addEventListener('click', () => {
            detailTitle.innerText = business.name;
            
            // 1. Inject the large image into the left side of the modal
            detailImageContainer.innerHTML = `<img src="${business.image_url}" alt="${business.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
            
            // 2. Loop through all 14 database details
            let detailsHTML = "";
            for (const [key, value] of Object.entries(business)) {
                // Skip name and image since we already use them
                if (key === 'name' || key === 'image_url') continue;
                
                // Format the text nicely
                let formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
                let formattedValue = value;
                
                // Color Code Yes/No and Money
                if (typeof value === 'boolean') {
                    formattedValue = value ? '<span style="color: #4CAF50; font-weight: bold;">Yes</span>' : '<span style="color: #F44336; font-weight: bold;">No</span>';
                } else if (typeof value === 'number' && (key.includes('cost') || key.includes('payout'))) {
                    formattedValue = '<span style="color: #4CAF50; font-weight: bold;">$' + value.toLocaleString() + '</span>';
                }

                // Append it to our list
                detailsHTML += `<span style="color: #FFEB3B;">${formattedKey}:</span> <span style="color: #fff;">${formattedValue}</span><br><br>`;
            }
            
            // Update the paragraph with the massive list and show modal
            detailDescription.innerHTML = detailsHTML;
            detailsOverlay.classList.remove('hidden');
        });

        grid.appendChild(card); 
    });
}

// --- CLOSE MODALS ---
closeDetailsBtn.addEventListener('click', () => {
    detailsOverlay.classList.add('hidden');
});
window.addEventListener('click', (event) => {
    if (event.target === categoriesOverlay) categoriesOverlay.classList.add('hidden');
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});

// TRIGGER INITIAL LOAD
loadBusinesses();

// --- SEARCH LOGIC ---
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();
    
    try {
        const response = await fetch(`${API_URL}/businesses/search?q=${searchTerm}`);
        const data = await response.json();

        document.getElementById("grid-profitable").innerHTML = "";
        document.getElementById("grid-mid").innerHTML = "";
        document.getElementById("grid-bad").innerHTML = "";

        if (data["Suspiciously Profitable"]) buildCards(data["Suspiciously Profitable"], "grid-profitable");
        if (data["Above Minimum Wage"]) buildCards(data["Above Minimum Wage"], "grid-mid");
        if (data["Going Bankrupt"]) buildCards(data["Going Bankrupt"], "grid-bad");

    } catch (error) {
        console.error("Error searching API:", error);
    }
});