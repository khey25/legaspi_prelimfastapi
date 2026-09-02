const API_URL = "https://legaspi-prelimfastapi.vercel.app";

// --- BACKGROUND SLIDER LOGIC ---
const backgrounds = [
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/cayo.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/casino.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/dre.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/classic.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/fleeca.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/autoshop.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/cluckin.jpg?raw=true"
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

// --- DOM Elements ---
const categoriesBtn = document.getElementById('categories-btn');
const overlay = document.getElementById('categories-overlay');
const closeBtn = document.getElementById('close-modal-btn');
const searchBar = document.getElementById('search-bar');

const homeBtn = document.getElementById('home-btn');

if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        // The forward slash forces the browser to look at the root directory
        window.location.href = '../menu.html'; 
    });
}


// UPDATED: Now targeting our new class from the HTML
const mainContainer = document.querySelector('.category-options'); 
const pageTitle = document.querySelector('h2');

// Detail Modal Elements
const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');
const detailImageContainer = document.querySelector('.details-image'); // Grabbed for rich search results

// Save the original 3 big templates so we can bring them back if the search bar is empty
const originalTemplatesHTML = mainContainer.innerHTML;

// --- Categories Pop-up Logic ---
categoriesBtn.addEventListener('click', () => overlay.classList.remove('hidden'));
closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));

// Modal Category Routing
document.getElementById('cat-businesses').addEventListener('click', () => {
    window.location.href = 'business.html';
});
document.getElementById('cat-heists').addEventListener('click', () => {
    window.location.href = 'heists.html';
});
document.getElementById('cat-contact').addEventListener('click', () => {
    window.location.href = 'contact.html';
});

// --- HOVER & MAIN MENU ROUTING ---
function attachCardListeners() {
    // 1. Click Routing for the Main Video Cards
    const cardHeists = document.getElementById('card-heists');
    const cardBiz = document.getElementById('card-businesses');
    const cardContact = document.getElementById('card-contact');

    if (cardHeists) cardHeists.addEventListener('click', () => window.location.href = 'heists.html');
    if (cardBiz) cardBiz.addEventListener('click', () => window.location.href = 'business.html');
    if (cardContact) cardContact.addEventListener('click', () => window.location.href = 'contact.html');

    // 2. Video Hover Logic (Strictly Muted)
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        const video = card.querySelector('.nav-video');
        
        if (video) {
            // Hard-enforce absolute silence
            video.muted = true;
            video.volume = 0.5; 

            // Fade in and play on hover
            card.addEventListener('mouseenter', () => {
                video.style.opacity = "1";
                video.play();
            });

            // Fade out, pause, and rewind when mouse leaves
            card.addEventListener('mouseleave', () => {
                video.style.opacity = "0";
                video.pause();
                video.currentTime = 0; 
            });
        }
    });
}

// Fire the listeners on initial load
attachCardListeners();

// --- UNIFIED SEARCH LOGIC ---
searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.trim();

    // If search is empty, restore the original 3 video cards and re-attach hover events!
    if (searchTerm === "") {
        pageTitle.innerText = "Top money hustling methods";
        mainContainer.className = "category-options"; 
        mainContainer.innerHTML = originalTemplatesHTML;
        attachCardListeners(); 
        return;
    }

    try {
        // Fetch from ALL APIs at the exact same time
        const [bizResponse, contactResponse, heistResponse] = await Promise.all([
            fetch(`${API_URL}/gta/businesses/search?q=${searchTerm}`),
            fetch(`${API_URL}/gta/contact/search?q=${searchTerm}`),
            fetch(`${API_URL}/gta/heists/search?q=${searchTerm}`)
        ]);

        const bizData = await bizResponse.json();
        const contactData = await contactResponse.json();
        const heistData = await heistResponse.json();

        // Flatten all the tiered dictionary data into one giant array
        let combinedResults = [];
        
        if(bizData) Object.values(bizData).forEach(tier => combinedResults.push(...tier));
        if(contactData) Object.values(contactData).forEach(tier => combinedResults.push(...tier));
        if(heistData) Object.values(heistData).forEach(tier => combinedResults.push(...tier));

        // Update the UI
        pageTitle.innerText = `Search Results for "${searchTerm}"`;
        mainContainer.className = "search-results"; // Switch to grid layout
        mainContainer.innerHTML = ""; // Clear out the old cards

        if (combinedResults.length === 0) {
            mainContainer.innerHTML = "<p>No methods found. Try searching something else!</p>";
            return;
        }

        // Build the fully formatted result cards!
        // Build the fully formatted result cards!
        // NEW: We added "index" here to track the card number
        combinedResults.forEach((item, index) => { 
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.position = "relative";
            card.style.overflow = "hidden";
            
            // NEW: This dynamically adds a 0.1s delay between each card loading!
            card.style.animationDelay = `${index * 0.1}s`; 

            card.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0.5; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
                <p style="position: relative; z-index: 1; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px #000; pointer-events: none;">${item.name}</p>
            `;

            // Attach the rich split-screen detail event
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
                    } else if (typeof value === 'number' && (key.includes('cost') || key.includes('payout') || key.includes('base'))) {
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
        console.error("Error searching unified APIs:", error);
    }
});

// --- Close Modals Logic ---
closeDetailsBtn.addEventListener('click', () => detailsOverlay.classList.add('hidden'));

window.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.classList.add('hidden');
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});