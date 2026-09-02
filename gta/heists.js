// 1. YOUR VERCEL API URL (Trailing slash removed!)
const API_URL = "https://legaspi-prelimfastapi.vercel.app"; 

// --- BACKGROUND SLIDER LOGIC ---
const backgrounds = [
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/cayo.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/casino.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/dre.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/doomsday.jpg?raw=true"
];

const bgSlider = document.getElementById('bg-slider');
let currentBgIndex = 0;

if (bgSlider) {
    // 1. Create the image layers inside the HTML
    backgrounds.forEach((src, index) => {
        const div = document.createElement('div');
        div.className = 'bg-image';
        div.style.backgroundImage = `url('${src}')`;
        if (index === 0) div.classList.add('active'); // Show the first one immediately
        bgSlider.appendChild(div);
    });

    const bgDivs = document.querySelectorAll('.bg-image');

    // 2. Cycle them every 3 seconds (3000 milliseconds)
    setInterval(() => {
        bgDivs[currentBgIndex].classList.remove('active'); // Fade out current
        currentBgIndex = (currentBgIndex + 1) % backgrounds.length; // Move to next
        bgDivs[currentBgIndex].classList.add('active'); // Fade in and zoom next
    }, 3000);
}

const homeBtn = document.getElementById('home-btn');

if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        // The forward slash forces the browser to look at the root directory
        window.location.href = '../menu.html'; 
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

// NEW: Grab the left-side image container
const detailImageContainer = document.querySelector('.details-image'); 

// --- Categories Modal Logic ---
categoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.remove('hidden');
});
closeCategoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.add('hidden');
});
document.getElementById('nav-home').addEventListener('click', () => {
    window.location.href = 'gtamenu.html';
});
document.getElementById('nav-business').addEventListener('click', () => {
    window.location.href = 'business.html'; 
});
document.getElementById('nav-contact').addEventListener('click', () => {
    window.location.href = 'contact.html';
});

// --- API FETCH LOGIC ---
async function loadHeists() {
    try {
        const response = await fetch(`${API_URL}/gta/heists`);
        const data = await response.json(); 

        buildCards(data["Billionaire Amongst Millionaires"], "grid-billionaire");
        buildCards(data["Typical Bank Heist"], "grid-typical");
        buildCards(data["What is this? A Convenience Store?"], "grid-convenience");

    } catch (error) {
        console.error("Error fetching data from API:", error);
    }
}

// --- CARD BUILDER & CLICK LOGIC ---
function buildCards(heistList, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !heistList) return; // Added safety check

    heistList.forEach(heist => {
        const card = document.createElement('div');
        card.className = 'heist-card';
        
        card.style.position = "relative";
        card.style.overflow = "hidden";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${heist.image_url}" alt="${heist.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0.5; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
            <p style="position: relative; z-index: 1; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px #000; pointer-events: none;">${heist.name}</p>
        `;

        card.addEventListener('click', () => {
            detailTitle.innerText = heist.name;
            detailImageContainer.innerHTML = `<img src="${heist.image_url}" alt="${heist.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
            
            let detailsHTML = "";
            for (const [key, value] of Object.entries(heist)) {
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
        const response = await fetch(`${API_URL}/gta/heists/search?q=${searchTerm}`);
        const data = await response.json();

        document.getElementById("grid-billionaire").innerHTML = "";
        document.getElementById("grid-typical").innerHTML = "";
        document.getElementById("grid-convenience").innerHTML = "";

        if (data["Billionaire Amongst Millionaires"]) buildCards(data["Billionaire Amongst Millionaires"], "grid-billionaire");
        if (data["Typical Bank Heist"]) buildCards(data["Typical Bank Heist"], "grid-typical");
        if (data["What is this? A Convenience Store?"]) buildCards(data["What is this? A Convenience Store?"], "grid-convenience");

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
loadHeists();