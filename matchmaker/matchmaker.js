const API_URL = "https://the-hustle-hub.vercel.app"; 

// Navigation
document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = '../index.html'; 
});

// DOM Elements
const quizBox = document.getElementById('quiz-box');
const questionText = document.getElementById('question-text');
const optionsBox = document.getElementById('options-box');
const startBtn = document.getElementById('start-btn');
const resultsBox = document.getElementById('results-box');
const recommendationGrid = document.getElementById('recommendation-grid');
const restartBtn = document.getElementById('restart-btn');

// Detail Modal Elements
const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');
const detailImageContainer = document.querySelector('.details-image');

// --- THE MATCHMAKER QUESTIONS ---
const questions = [
    {
        question: "Which world are you grinding in?",
        options: [
            { text: "GTA Online", key: "game", val: "gta" },
            { text: "Stardew Valley", key: "game", val: "stardew" }
        ]
    },
    {
        question: "What is your budget right now?",
        options: [
            { text: "I'm broke ($0)", key: "budget", val: 0 },
            { text: "Comfortable (Under $1M)", key: "budget", val: 1000000 },
            { text: "I'm rich (Unlimited)", key: "budget", val: 99999999 }
        ]
    },
    {
        question: "How do you prefer to play?",
        options: [
            { text: "Lone Wolf (Solo)", key: "solo", val: true },
            { text: "With a Crew", key: "solo", val: false }
        ]
    },
    {
        question: "How much effort do you want to put in?",
        options: [
            { text: "I want passive income (Easy)", key: "passive", val: true },
            { text: "I want an active grind", key: "passive", val: false }
        ]
    }
];

// State Management
let currentQuestionIndex = 0;
let userPreferences = { game: null, budget: null, solo: null, passive: null };

// --- QUIZ LOGIC ---
startBtn.addEventListener('click', () => loadQuestion(0));
restartBtn.addEventListener('click', () => {
    resultsBox.classList.add('hidden');
    quizBox.classList.remove('hidden');
    loadQuestion(0);
});

function loadQuestion(index) {
    currentQuestionIndex = index;
    const qData = questions[index];
    
    questionText.innerText = qData.question;
    optionsBox.innerHTML = ""; 

    qData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "quiz-btn";
        btn.innerText = opt.text;
        
        btn.addEventListener('click', () => {
            userPreferences[opt.key] = opt.val; 
            
            if (index + 1 < questions.length) {
                loadQuestion(index + 1); 
            } else {
                calculateMatch(); 
            }
        });
        optionsBox.appendChild(btn);
    });
}

// --- ALGORITHM LOGIC ---
async function calculateMatch() {
    quizBox.classList.add('hidden'); 
    recommendationGrid.innerHTML = "<h2>Fetching data...</h2>";
    resultsBox.classList.remove('hidden'); 

    try {
        let fetchUrls = [];
        if (userPreferences.game === "gta") {
            fetchUrls = [`${API_URL}/gta/businesses`, `${API_URL}/gta/heists`, `${API_URL}/gta/contact`];
        } else {
            fetchUrls = [`${API_URL}/stardew/crops`, `${API_URL}/stardew/artisan_goods`, `${API_URL}/stardew/animal_products`];
        }

        const responses = await Promise.all(fetchUrls.map(url => fetch(url)));
        const dataSets = await Promise.all(responses.map(res => res.json()));

        // Flatten dictionary into one giant array
        let allItems = [];
        dataSets.forEach(category => {
            Object.values(category).forEach(tierArray => {
                allItems.push(...tierArray);
            });
        });

        // THE WEIGHTED ALGORITHM
        let validItems = [];
        
        allItems.forEach(item => {
            // HARD RULE: Must afford setup cost
            if (item.setup_cost > userPreferences.budget) return; 

            let score = 0;

            // SOFT RULES: Assign points based on preferences
            if (userPreferences.game === "gta") {
                if (item.solo_friendly === userPreferences.solo) score += 10;
                if (item.is_passive === userPreferences.passive) score += 10;
            } else {
                // Stardew logic mapping
                if (userPreferences.passive === true && item.daily_maintenance === false) score += 10;
                if (userPreferences.passive === false && item.daily_maintenance === true) score += 10;
                // Give all Stardew items solo points since it's mostly a solo game
                if (userPreferences.solo === true) score += 5; 
            }

            // Push to valid items with attached score
            validItems.push({ ...item, matchScore: score });
        });

        // Sort by highest score
        validItems.sort((a, b) => b.matchScore - a.matchScore);

        // Grab top 3
        const top3 = validItems.slice(0, 3);
        
        displayResults(top3);

    } catch (error) {
        console.error("Matchmaker fetch error:", error);
        recommendationGrid.innerHTML = "<h2>Failed to connect to the database.</h2>";
    }
}

// --- RENDER RESULTS ---
function displayResults(items) {
    recommendationGrid.innerHTML = ""; 

    if (items.length === 0) {
        recommendationGrid.innerHTML = "<p>You are too broke for anything in our database. Go collect bounties!</p>";
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'match-card';
        // Delay cascade animation slightly for visual flair
        card.style.animation = `fade-in 0.5s ease forwards`;
        card.style.animationDelay = `${index * 0.15}s`;
        card.style.opacity = "0";

        card.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.5; position: absolute; top: 0; left: 0; z-index: 0; pointer-events: none;">
            <div style="position: relative; z-index: 1; text-align: center;">
                <p style="margin: 0; font-weight: bold; text-shadow: 2px 2px 4px #000;">${item.name}</p>
                <small style="color: #4CAF50; font-size: 0.9rem; font-weight: normal; text-shadow: 1px 1px 2px #000;">Match Score: ${item.matchScore}</small>
            </div>
        `;

        card.addEventListener('click', () => {
            detailTitle.innerText = item.name;
            detailImageContainer.innerHTML = `<img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;">`;
            
            let detailsHTML = "";
            for (const [key, value] of Object.entries(item)) {
                if (key === 'name' || key === 'image_url' || key === 'matchScore') continue;
                
                let formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
                let formattedValue = value;
                
                if (typeof value === 'boolean') {
                    formattedValue = value ? '<span style="color: #4CAF50; font-weight: bold;">Yes</span>' : '<span style="color: #F44336; font-weight: bold;">No</span>';
                } else if (typeof value === 'number' && (key.includes('cost') || key.includes('payout'))) {
                    formattedValue = '<span style="color: #4CAF50; font-weight: bold;">$' + value.toLocaleString() + '</span>';
                }

                detailsHTML += `<span style="color: #f1b50d;">${formattedKey}:</span> <span style="color: #fff;">${formattedValue}</span><br><br>`;
            }
            
            detailDescription.innerHTML = detailsHTML;
            detailsOverlay.classList.remove('hidden');
        });

        recommendationGrid.appendChild(card);
    });
}

// --- MODAL CLOSE LOGIC ---
closeDetailsBtn.addEventListener('click', () => detailsOverlay.classList.add('hidden'));
window.addEventListener('click', (event) => {
    if (event.target === detailsOverlay) detailsOverlay.classList.add('hidden');
});
