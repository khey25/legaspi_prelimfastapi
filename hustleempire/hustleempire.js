const API_URL = "https://the-hustle-hub.vercel.app/api/v1"; 

const API_KEY = "hustle-hub-secret-key";
const FETCH_OPTIONS = {
    headers: { "x-api-key": API_KEY }
};

document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = '../index.html'; 
});

const calcBox = document.getElementById('calculator-box');
const resultsBox = document.getElementById('results-box');
const recommendationGrid = document.getElementById('recommendation-grid');
const calculateBtn = document.getElementById('calculate-btn');
const restartBtn = document.getElementById('restart-btn');
const shortfallDisplay = document.getElementById('shortfall-display');

const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');
const detailImageContainer = document.querySelector('.details-image');

calculateBtn.addEventListener('click', calculateEmpirePlan);

restartBtn.addEventListener('click', () => {
    resultsBox.classList.add('hidden');
    calcBox.classList.remove('hidden');
    
    // Reset inputs
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-cost').value = '';
    document.getElementById('current-bank').value = '';
});

async function calculateEmpirePlan() {
    const goalName = document.getElementById('goal-name').value.trim() || "Your Goal";
    const goalCost = parseFloat(document.getElementById('goal-cost').value) || 0;
    const currentBank = parseFloat(document.getElementById('current-bank').value) || 0;
    const selectedGame = document.getElementById('game-selector').value;

    const shortfall = goalCost - currentBank;

    calcBox.classList.add('hidden');
    resultsBox.classList.remove('hidden');

    if (shortfall <= 0 && goalCost > 0) {
        shortfallDisplay.innerText = `You already have enough money for ${goalName}! Go buy it!`;
        recommendationGrid.innerHTML = "";
        return;
    } else if (goalCost <= 0) {
        shortfallDisplay.innerText = "Please enter a valid cost greater than 0.";
        recommendationGrid.innerHTML = "";
        return;
    }

    shortfallDisplay.innerText = `Shortfall for ${goalName}: $${shortfall.toLocaleString()}`;
    recommendationGrid.innerHTML = "<h2>Crunching the numbers...</h2>";

    try {
        let fetchUrls = [];
        if (selectedGame === "gta") {
            fetchUrls = [`${API_URL}/gta/businesses`, `${API_URL}/gta/heists`, `${API_URL}/gta/contact`];
        } else if (selectedGame === "stardew") {
            fetchUrls = [`${API_URL}/stardew/crops`, `${API_URL}/stardew/artisan_goods`, `${API_URL}/stardew/animal_products`];
        }

        const responses = await Promise.all(fetchUrls.map(url => fetch(url, FETCH_OPTIONS)));
        const dataSets = await Promise.all(responses.map(res => res.json()));

        let allItems = [];
        dataSets.forEach(category => {
            Object.values(category).forEach(tierArray => {
                allItems.push(...tierArray);
            });
        });

        let viablePlans = [];

        allItems.forEach(item => {
            const profitPerRun = item.max_payout - item.setup_cost;
            
            // Only consider items that actually generate a net profit
            if (profitPerRun > 0) {
                const runsNeeded = Math.ceil(shortfall / profitPerRun);
                let downtimeString = "";
                let sortMetric = 0;

                // Game-specific time math
                if (selectedGame === "gta") {
                    const totalMinutes = runsNeeded * (item.cooldown_minutes || 0);
                    downtimeString = `Total Cooldown: ${totalMinutes} min`;
                    sortMetric = runsNeeded; 
                } else if (selectedGame === "stardew") {
                    const totalDays = runsNeeded * (item.processing_days || 1);
                    downtimeString = `Total Time: ${totalDays} in-game days`;
                    sortMetric = totalDays; 
                }

                viablePlans.push({
                    ...item,
                    runs: runsNeeded,
                    downtimeLabel: downtimeString,
                    sortMetric: sortMetric
                });
            }
        });

        // Sort by the fastest/fewest runs needed
        viablePlans.sort((a, b) => a.sortMetric - b.sortMetric);
        
        // Take the top 9 most efficient methods
        displayGrindPlan(viablePlans.slice(0, 9));

    } catch (error) {
        console.error("Empire Builder fetch error:", error);
        recommendationGrid.innerHTML = "<h2>Failed to connect to the central database.</h2>";
    }
}

function displayGrindPlan(items) {
    recommendationGrid.innerHTML = ""; 

    if (items.length === 0) {
        recommendationGrid.innerHTML = "<p>No profitable methods found in the database to reach this goal.</p>";
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.style.animation = `fade-in 0.5s ease forwards`;
        // THE FIX: Placed the 's' outside the bracket
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = "0";

        card.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.3; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
            <div style="position: relative; z-index: 1; text-align: center; width: 100%; padding: 10px;">
                <p style="margin: 0 0 10px 0; font-size: 1.6rem; font-weight: bold; text-shadow: 2px 2px 4px #000;">${item.name}</p>
                <div style="background: rgba(0,0,0,0.7); border-radius: 8px; padding: 10px; display: inline-block;">
                    <p style="margin: 0; color: #f1b50d; font-weight: bold;">Runs Needed: ${item.runs.toLocaleString()}</p>
                    <p style="margin: 5px 0 0 0; color: #4CAF50; font-size: 1rem;">${item.downtimeLabel}</p>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            detailTitle.innerText = item.name;
            detailImageContainer.innerHTML = `<img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
            
            let detailsHTML = `<h4 style="color: #f1b50d; margin-top: 0;">Grind Plan: Run ${item.runs.toLocaleString()} times</h4><hr style="border-color: #333; margin-bottom: 20px;">`;
            
            for (const [key, value] of Object.entries(item)) {
                if (key === 'name' || key === 'image_url' || key === 'runs' || key === 'downtimeLabel' || key === 'sortMetric') continue;
                
                let formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
                let formattedValue = value;
                
                if (typeof value === 'boolean') {
                    formattedValue = value ? '<span style="color: #4CAF50; font-weight: bold;">Yes</span>' : '<span style="color: #F44336; font-weight: bold;">No</span>';
                } else if (typeof value === 'number' && (key.includes('cost') || key.includes('payout'))) {
                    formattedValue = '<span style="color: #4CAF50; font-weight: bold;">$' + value.toLocaleString() + '</span>';
                }

                detailsHTML += `<span style="color: #bbb;">${formattedKey}:</span> <span style="color: #fff;">${formattedValue}</span><br><br>`;
            }
            
            detailDescription.innerHTML = detailsHTML;
            detailsOverlay.classList.remove('hidden');
        });

        recommendationGrid.appendChild(card);
    });
}

closeDetailsBtn.addEventListener('click', () => detailsOverlay.classList.add('hidden'));
window.addEventListener('click', (event) => {
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});