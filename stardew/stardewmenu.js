const API_URL = "https://the-hustle-hub.vercel.app/";

// --- DOM Elements ---
const categoriesBtn = document.getElementById('categories-btn');
const overlay = document.getElementById('categories-overlay');
const closeBtn = document.getElementById('close-modal-btn');
const searchBar = document.getElementById('search-bar');
const homeBtn = document.getElementById('home-btn');

if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        window.location.href = '../index.html'; 
    });
}

const mainContainer = document.querySelector('.category-options'); 
const pageTitle = document.querySelector('h2');

// Detail Modal Elements
const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');
const detailImageContainer = document.querySelector('.details-image'); 

// Save the original 3 templates for empty search restoration
const originalTemplatesHTML = mainContainer.innerHTML;

// --- Categories Pop-up Logic ---
categoriesBtn.addEventListener('click', () => overlay.classList.remove('hidden'));
closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

// Modal Category Routing (Assuming you will build crops.html, artisan.html, etc. next)
document.getElementById('cat-crops').addEventListener('click', () => {
    window.location.href = 'crops.html';
});
document.getElementById('cat-artisan').addEventListener('click', () => {
    window.location.href = 'artisan.html';
});
document.getElementById('cat-animals').addEventListener('click', () => {
    window.location.href = 'animals.html';
});

// --- HOVER & MAIN MENU ROUTING ---
function attachCardListeners() {
    const cardCrops = document.getElementById('card-crops');
    const cardArtisan = document.getElementById('card-artisan');
    const cardAnimals = document.getElementById('card-animals');

    if (cardCrops) cardCrops.addEventListener('click', () => window.location.href = 'crops.html');
    if (cardArtisan) cardArtisan.addEventListener('click', () => window.location.href = 'artisan.html');
    if (cardAnimals) cardAnimals.addEventListener('click', () => window.location.href = 'animals.html');
}

attachCardListeners();

// --- UNIFIED SEARCH LOGIC ---
searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();

    if (searchTerm === "") {
        pageTitle.innerText = "YOUR GUIDE TO MILLIONAIRE FARMING";
        mainContainer.className = "category-options"; 
        mainContainer.innerHTML = originalTemplatesHTML;
        attachCardListeners(); 
        return;
    }

    try {
        // Fetch from ALL Stardew APIs concurrently
        const [cropsRes, artisanRes, animalRes] = await Promise.all([
            fetch(`${API_URL}/stardew/crops/search?q=${searchTerm}`),
            fetch(`${API_URL}/stardew/artisan_goods/search?q=${searchTerm}`),
            fetch(`${API_URL}/stardew/animal_products/search?q=${searchTerm}`)
        ]);

        const cropsData = await cropsRes.json();
        const artisanData = await artisanRes.json();
        const animalData = await animalRes.json();

        let combinedResults = [];
        
        if(cropsData) Object.values(cropsData).forEach(tier => combinedResults.push(...tier));
        if(artisanData) Object.values(artisanData).forEach(tier => combinedResults.push(...tier));
        if(animalData) Object.values(animalData).forEach(tier => combinedResults.push(...tier));

        pageTitle.innerText = `Search Results for "${searchTerm}"`;
        mainContainer.className = "search-results"; 
        mainContainer.innerHTML = ""; 

        if (combinedResults.length === 0) {
            mainContainer.innerHTML = "<p>No methods found. Try searching something else!</p>";
            return;
        }

        combinedResults.forEach((item, index) => { 
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.position = "relative";
            card.style.overflow = "hidden";
            card.style.animationDelay = `${index * 0.1}s`; 

            card.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0.5; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
                <p style="position: relative; z-index: 1; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px #000; pointer-events: none;">${item.name}</p>
            `;

            card.addEventListener('click', () => {
                detailTitle.innerText = item.name;
                detailImageContainer.innerHTML = `<img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
                
                let detailsHTML = "";
                for (const [key, value] of Object.entries(item)) {
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

            mainContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error searching Stardew APIs:", error);
    }
});

// --- Close Modals Logic ---
closeDetailsBtn.addEventListener('click', () => detailsOverlay.classList.add('hidden'));

window.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.classList.add('hidden');
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});