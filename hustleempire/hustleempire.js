const API_URL = "https://the-hustle-hub.vercel.app/api/v1"; 
const API_KEY = "hustle-hub-secret-key";
const FETCH_OPTIONS = { headers: { "x-api-key": API_KEY } };

document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = '../index.html'; 
});

// DOM Elements
const empireCarousel = document.getElementById('empire-carousel');
const calcBox = document.getElementById('calculator-box');
const resultsBox = document.getElementById('results-box');
const recommendationGrid = document.getElementById('recommendation-grid');
const restartBtn = document.getElementById('restart-btn');
const shortfallDisplay = document.getElementById('shortfall-display');

const stepTitle = document.getElementById('step-title');
// REMOVED stepDesc completely
const dynamicOptions = document.getElementById('dynamic-options');
const backBtn = document.getElementById('back-btn');
const startBtn = document.getElementById('start-btn');

// Detail Modal Elements
const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');
const detailImageContainer = document.querySelector('.details-image');

// State Management
let currentStep = 0; // Starts at 0 (Welcome Screen HTML)
let selectedGame = "";
let targetGoal = null;
let currentBank = 0;

// --- STEP NAVIGATION LOGIC ---
startBtn.addEventListener('click', () => {
    if (empireCarousel) {
        empireCarousel.classList.add('hidden');
    }
    currentStep = 1; 
    renderStep();
});

backBtn.addEventListener('click', () => {
    if (currentStep > 1) { 
        currentStep--;
        renderStep();
    }
});

restartBtn.addEventListener('click', () => {
    window.location.reload(); 
});


function renderStep() {
    dynamicOptions.innerHTML = "";
    dynamicOptions.className = "options-container"; 

    if (currentStep === 1) {
        stepTitle.innerText = "What game will it be playa?";
        backBtn.classList.add('hidden'); // Hide back button on first real step
        dynamicOptions.classList.add('image-grid-layout');

        const games = [
            { id: "gta", name: "GTA Online", img: "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/gtaonline.jpg?raw=true" },
            { id: "stardew", name: "Stardew Valley", img: "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/stardew.jpg?raw=true" }
        ];

        games.forEach(g => {
            const btn = document.createElement('button');
            btn.className = "quiz-img-btn";
            btn.innerHTML = `<img src="${g.img}" alt="${g.name}"><span>${g.name}</span>`;
            btn.onclick = () => { selectedGame = g.id; currentStep = 2; renderStep(); };
            dynamicOptions.appendChild(btn);
        });
    }

    else if (currentStep === 2) {
        stepTitle.innerText = "What is your target property?";
        backBtn.classList.remove('hidden');
        dynamicOptions.innerHTML = "<h3 style='color: #4CAF50;'>Accessing secure database...</h3>";
        
        fetchAndCategorizeGoals();
    }

    else if (currentStep === 3) {
        stepTitle.innerText = `Bank Check: ${targetGoal.name} ($${targetGoal.cost.toLocaleString()})`;
        backBtn.classList.remove('hidden');

        const input = document.createElement('input');
        input.type = "number";
        input.id = "current-bank-input";
        input.className = "empire-input";
        input.placeholder = "Current Bank Balance (e.g. 500000)";

        const calcBtn = document.createElement('button');
        calcBtn.className = "quiz-btn";
        calcBtn.innerText = "Calculate Grind Plan";
        calcBtn.style.marginTop = "15px";
        calcBtn.onclick = () => {
            currentBank = parseFloat(document.getElementById('current-bank-input').value) || 0;
            calculateEmpirePlan();
        };

        dynamicOptions.appendChild(input);
        dynamicOptions.appendChild(calcBtn);
    }
}

// --- FETCH & CATEGORIZE GOALS ---
async function fetchAndCategorizeGoals() {
    try {
        const response = await fetch(`${API_URL}/${selectedGame}/goals`, FETCH_OPTIONS);
        const goals = await response.json();
        dynamicOptions.innerHTML = "";

        let categorized = {};
        
        if (selectedGame === "gta") {
            categorized = { "Businesses": [], "Heists": [], "Contact": [] };
            
            goals.forEach(goal => {
                const keys = goal.keywords.toLowerCase();
                if (keys.includes('agency') || keys.includes('payphone')) {
                    categorized["Contact"].push(goal);
                } else if (keys.includes('heist') || keys.includes('arcade') || keys.includes('kosatka') || keys.includes('facility') || keys.includes('salvage') || keys.includes('auto shop') || keys.includes('apartment')) {
                    categorized["Heists"].push(goal);
                } else {
                    categorized["Businesses"].push(goal); 
                }
            });
        } else {
            categorized = { "Properties & Upgrades": goals }; 
        }

        for (const [category, items] of Object.entries(categorized)) {
            if (items.length > 0) {
                const header = document.createElement('h3');
                header.innerText = category;
                header.style.color = '#be70f1';
                header.style.textAlign = 'left';
                header.style.borderBottom = '2px solid #be70f1';
                header.style.paddingBottom = '5px';
                header.style.marginTop = '25px';
                header.style.marginBottom = '15px';
                dynamicOptions.appendChild(header);

                const grid = document.createElement('div');
                grid.className = 'options-container image-grid-layout';

                items.forEach(item => {
                    const btn = document.createElement('button');
                    btn.className = "quiz-img-btn";
                    btn.innerHTML = `
                        <img src="${item.image_url}" alt="${item.name}">
                        <div style="position: relative; z-index: 1; text-align: center; text-shadow: 2px 2px 6px #000;">
                            <span style="display: block; font-size: 1.3rem; color: #fff;">${item.name}</span>
                            <span style="display: block; color: #4CAF50; font-size: 1.1rem; margin-top: 5px;">$${item.cost.toLocaleString()}</span>
                        </div>
                    `;
                    
                    btn.onclick = () => {
                        targetGoal = item;
                        currentStep = 3;
                        renderStep();
                    };
                    grid.appendChild(btn);
                });
                
                dynamicOptions.appendChild(grid);
            }
        }
    } catch (error) {
        console.error("Failed to load goals:", error);
        dynamicOptions.innerHTML = "<p>Error loading database. Please try again.</p>";
    }
}

// --- CORE MATH & API LOGIC ---
async function calculateEmpirePlan() {
    const shortfall = targetGoal.cost - currentBank;

    calcBox.classList.add('hidden');
    resultsBox.classList.remove('hidden');

    if (shortfall <= 0 && targetGoal.cost > 0) {
        shortfallDisplay.innerText = `You already have enough money for the ${targetGoal.name}! Go buy it!`;
        recommendationGrid.innerHTML = "";
        return;
    }

    shortfallDisplay.innerText = `Shortfall for ${targetGoal.name}: $${shortfall.toLocaleString()}`;
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
            
            if (profitPerRun > 0) {
                const runsNeeded = Math.ceil(shortfall / profitPerRun);
                let downtimeString = "";
                let sortMetric = 0;

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

        viablePlans.sort((a, b) => a.sortMetric - b.sortMetric);
        displayGrindPlan(viablePlans.slice(0, 9));

    } catch (error) {
        console.error("Empire Builder fetch error:", error);
        recommendationGrid.innerHTML = "<h2>Failed to connect to the central database.</h2>";
    }
}

// --- RENDER RESULTS ---
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
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = "0";

        card.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.3; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
            <div style="position: relative; z-index: 1; text-align: center; width: 100%; padding: 10px;">
                <p style="margin: 0 0 10px 0; font-size: 1.6rem; font-weight: bold; text-shadow: 2px 2px 4px #000;">${item.name}</p>
                <div style="background: rgba(0,0,0,0.7); border-radius: 8px; padding: 10px; display: inline-block;">
                    <p style="margin: 0; color: #be70f1; font-weight: bold;">Runs Needed: ${item.runs.toLocaleString()}</p>
                    <p style="margin: 5px 0 0 0; color: #4CAF50; font-size: 1rem;">${item.downtimeLabel}</p>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            detailTitle.innerText = item.name;
            detailImageContainer.innerHTML = `<img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
            
            let detailsHTML = `<h4 style="color: #4CAF50; margin-top: 0;">Grind Plan: Run ${item.runs.toLocaleString()} times</h4><hr style="border-color: #333; margin-bottom: 20px;">`;
            
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
