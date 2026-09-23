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
const backBtn = document.getElementById('back-btn');
const resultsBox = document.getElementById('results-box');
const recommendationGrid = document.getElementById('recommendation-grid');
const restartBtn = document.getElementById('restart-btn');

// Detail Modal Elements
const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.querySelector('.details-text p');
const detailImageContainer = document.querySelector('.details-image');

// --- THE GENERALIZED MATCHMAKER QUESTIONS (4 Options Each) ---
const questions = [
    {
        question: "Which universe are you stepping into today?",
        options: [
            { 
                text: "GTA Online", 
                key: "game", 
                val: "gta", 
                img: "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/gtaonline.jpg?raw=true" 
            },
            { 
                text: "Stardew Valley", 
                key: "game", 
                val: "stardew", 
                img: "https://github.com/khey25/legaspi_prelimfastapi/blob/main/menuimages/stardew.jpg?raw=true" 
            }
        ]
    },
    {
        question: "What does your starting bank account look like?",
        options: [
            { text: "Absolutely Broke", key: "budget", val: 0 },
            { text: "Just getting started", key: "budget", val: 100000 },
            { text: "Comfortable", key: "budget", val: 1000000 },
            { text: "Filthy Rich", key: "budget", val: 99999999 }
        ]
    },
    {
        question: "Who are you bringing with you on this grind?",
        options: [
            { text: "I'm a strictly Lone Wolf", key: "solo", val: true },
            { text: "Just me and a buddy", key: "solo", val: false },
            { text: "A small, trusted crew", key: "solo", val: false },
            { text: "A massive syndicate", key: "solo", val: false }
        ]
    },
    {
        question: "How much actual effort do you want to put in?",
        options: [
            { text: "Zero effort. Fully AFK / Passive", key: "passive", val: true },
            { text: "Light maintenance", key: "passive", val: true },
            { text: "A steady, active grind.", key: "passive", val: false },
            { text: "Sweaty, intense, non-stop gameplay.", key: "passive", val: false }
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

// "Go Back" Button Logic
backBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
});

function loadQuestion(index) {
    currentQuestionIndex = index;
    const qData = questions[index];
    
    questionText.innerText = qData.question;
    optionsBox.innerHTML = ""; 

    // Dynamically switch layout if the options have images
    const hasImages = qData.options.some(opt => opt.img);
    if (hasImages) {
        optionsBox.classList.add('image-grid-layout');
    } else {
        optionsBox.classList.remove('image-grid-layout');
    }

    if (index > 0) {
        backBtn.classList.remove('hidden');
    } else {
        backBtn.classList.add('hidden');
    }

    qData.options.forEach(opt => {
        const btn = document.createElement('button');
        
        // Build an Image Card OR a Text Button
        if (opt.img) {
            btn.className = "quiz-img-btn";
            btn.innerHTML = `
                <img src="${opt.img}" alt="${opt.text}">
                <span>${opt.text}</span>
            `;
        } else {
            btn.className = "quiz-btn";
            btn.innerText = opt.text;
        }
        
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

    // Safely handle unbuilt games
    if (userPreferences.game !== "gta" && userPreferences.game !== "stardew") {
        recommendationGrid.innerHTML = `<p>Our scouts are still gathering intel on ${userPreferences.game}. Check back later!</p>`;
        return;
    }

    try {
        let fetchUrls = [];
        if (userPreferences.game === "gta") {
            fetchUrls = [`${API_URL}/gta/businesses`, `${API_URL}/gta/heists`, `${API_URL}/gta/contact`];
        } else if (userPreferences.game === "stardew") {
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

            // SOFT RULES: Assign points based on universal preferences
            if (userPreferences.game === "gta") {
                if (item.solo_friendly === userPreferences.solo) score += 10;
                if (item.is_passive === userPreferences.passive) score += 10;
            } else if (userPreferences.game === "stardew") {
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
        recommendationGrid.innerHTML = "<p>You are too broke for anything in our database. Go collect bounties or chop some wood!</p>";
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

// Grab the new carousel container
const gameCarousel = document.getElementById('game-carousel');

// --- QUIZ LOGIC ---
startBtn.addEventListener('click', () => {
    // Hide the carousel so the quiz interface remains completely clean
    if (gameCarousel) {
        gameCarousel.classList.add('hidden');
    }
    loadQuestion(0);
});

// Restart button reloads the page to cleanly bring back the welcome screen & carousel
restartBtn.addEventListener('click', () => {
    window.location.reload();
});