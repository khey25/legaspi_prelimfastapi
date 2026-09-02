const API_URL = "https://legaspi-prelimfastapi.vercel.app";

// --- BACKGROUND SLIDER LOGIC ---
const backgrounds = [
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/payphone.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/classic.jpg?raw=true",
    "https://github.com/khey25/legaspi_prelimfastapi/blob/main/gta/gtaimages/paper.jpg?raw=true"
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

const categoriesBtn = document.getElementById('categories-btn');
const categoriesOverlay = document.getElementById('categories-overlay');
const closeCategoriesBtn = document.getElementById('close-categories-btn');
const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');
const detailImageContainer = document.querySelector('.details-image');

// Nav Routing
categoriesBtn.addEventListener('click', () => categoriesOverlay.classList.remove('hidden'));
closeCategoriesBtn.addEventListener('click', () => categoriesOverlay.classList.add('hidden'));
document.getElementById('nav-home').addEventListener('click', () => window.location.href = 'gtamenu.html');
document.getElementById('nav-business').addEventListener('click', () => window.location.href = 'business.html');
document.getElementById('nav-heists').addEventListener('click', () => window.location.href = 'heists.html');

// Initial Load
async function loadContactMissions() {
    try {
        const response = await fetch(`${API_URL}/gta/contact`);
        const data = await response.json(); 
        buildCards(data["Money and Time Efficient"], "grid-efficient");
        buildCards(data["Just for the Vibes"], "grid-vibes");
        buildCards(data["Why are you even doing this?"], "grid-why");
    } catch (error) { console.error(error); }
}

// Build Cards with Image Support
function buildCards(missionList, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !missionList) return; // Safety check

    missionList.forEach(mission => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        card.innerHTML = `
            <img src="${mission.image_url}" alt="${mission.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; opacity: 0.5; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
            <p style="position: relative; z-index: 1; margin: 0; font-weight: bold; text-shadow: 2px 2px 4px #000; pointer-events: none;">${mission.name}</p>
        `;

        card.addEventListener('click', () => {
            detailTitle.innerText = mission.name;
            detailImageContainer.innerHTML = `<img src="${mission.image_url}" alt="${mission.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
            
            // Loop through all database details
            let detailsHTML = "";
            for (const [key, value] of Object.entries(mission)) {
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

        grid.appendChild(card);
    });
}

// Search Logic
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    try {
        const response = await fetch(`${API_URL}/gta/contact/search?q=${searchTerm}`);
        const data = await response.json();

        document.getElementById("grid-efficient").innerHTML = "";
        document.getElementById("grid-vibes").innerHTML = "";
        document.getElementById("grid-why").innerHTML = "";

        if (data["Money and Time Efficient"]) buildCards(data["Money and Time Efficient"], "grid-efficient");
        if (data["Just for the Vibes"]) buildCards(data["Just for the Vibes"], "grid-vibes");
        if (data["Why are you even doing this?"]) buildCards(data["Why are you even doing this?"], "grid-why");
    } catch (error) { console.error(error); }
});

// Close Modals
closeDetailsBtn.addEventListener('click', () => detailsOverlay.classList.add('hidden'));
window.addEventListener('click', (event) => {
    if (event.target === categoriesOverlay) categoriesOverlay.classList.add('hidden');
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});

loadContactMissions();
