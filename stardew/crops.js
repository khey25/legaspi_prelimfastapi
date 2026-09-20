const API_URL = "https://the-hustle-hub.vercel.app/"; 

const homeBtn = document.getElementById('home-btn');

if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        window.location.href = 'stardewmenu.html'; 
    });
}

// --- DOM Elements for Overlays ---
const categoriesBtn = document.getElementById('categories-btn');
const categoriesOverlay = document.getElementById('categories-overlay');
const closeCategoriesBtn = document.getElementById('close-categories-btn');

const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p'); 
const detailImageContainer = document.querySelector('.details-image'); 

// --- Categories Modal Logic ---
categoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.remove('hidden');
});
closeCategoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.add('hidden');
});
document.getElementById('nav-home').addEventListener('click', () => {
    window.location.href = 'stardewmenu.html';
});
document.getElementById('nav-artisan').addEventListener('click', () => {
    window.location.href = 'artisan.html'; 
});
document.getElementById('nav-animals').addEventListener('click', () => {
    window.location.href = 'animals.html';
});

// --- API FETCH LOGIC ---
async function loadCrops() {
    try {
        const response = await fetch(`${API_URL}/stardew/crops`);
        const data = await response.json(); 

        buildCards(data["Joja-Level Profits"], "grid-joja");
        buildCards(data["Honest Honest Work"], "grid-honest");
        buildCards(data["Literally Just For Fun"], "grid-fun");

    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

// --- CARD BUILDER & CLICK LOGIC ---
function buildCards(cropList, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !cropList) return;

    cropList.forEach(crop => {
        const card = document.createElement('div');
        card.className = 'crop-card';
        
        card.style.position = "relative";
        card.style.overflow = "hidden";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${crop.image_url}" alt="${crop.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0.5; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
            <p style="position: relative; z-index: 1; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px #000; pointer-events: none;">${crop.name}</p>
        `;

        card.addEventListener('click', () => {
            detailTitle.innerText = crop.name;
            detailImageContainer.innerHTML = `<img src="${crop.image_url}" alt="${crop.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
            
            let detailsHTML = "";
            for (const [key, value] of Object.entries(crop)) {
                if (key === 'name' || key === 'image_url') continue;
                
                let formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
                let formattedValue = value;
                
                if (typeof value === 'boolean') {
                    formattedValue = value ? '<span style="color: #4CAF50; font-weight: bold;">Yes</span>' : '<span style="color: #F44336; font-weight: bold;">No</span>';
                } else if (typeof value === 'number' && (key.includes('cost') || key.includes('payout'))) {
                    formattedValue = '<span style="color: #4CAF50; font-weight: bold;">$' + value.toLocaleString() + '</span>';
                }

                detailsHTML += `<span style="color: #FFEB3B;">${formattedKey}:</span> <span style="color: #fff;">${formattedValue}</span><br><br>`;
            }
            
            detailDescription.innerHTML = detailsHTML;
            detailsOverlay.classList.remove('hidden');
        });

        grid.appendChild(card);
    });
}

// --- SEARCH LOGIC ---
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();
    
    try {
        const response = await fetch(`${API_URL}/stardew/crops/search?q=${searchTerm}`);
        const data = await response.json();

        document.getElementById("grid-joja").innerHTML = "";
        document.getElementById("grid-honest").innerHTML = "";
        document.getElementById("grid-fun").innerHTML = "";

        if (data["Joja-Level Profits"]) buildCards(data["Joja-Level Profits"], "grid-joja");
        if (data["Honest Honest Work"]) buildCards(data["Honest Honest Work"], "grid-honest");
        if (data["Literally Just For Fun"]) buildCards(data["Literally Just For Fun"], "grid-fun");

    } catch (error) {
        console.error("Error searching API:", error);
    }
});

// --- CLOSE MODALS ---
closeDetailsBtn.addEventListener('click', () => {
    detailsOverlay.classList.add('hidden');
});
window.addEventListener('click', (event) => {
    if (event.target === categoriesOverlay) categoriesOverlay.classList.add('hidden');
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});

// TRIGGER INITIAL LOAD
loadCrops();