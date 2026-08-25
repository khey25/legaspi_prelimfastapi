// --- DOM Elements ---
const categoriesBtn = document.getElementById('categories-btn');
const categoriesOverlay = document.getElementById('categories-overlay');
const closeCategoriesBtn = document.getElementById('close-categories-btn');

const detailsOverlay = document.getElementById('details-overlay');
const closeDetailsBtn = document.getElementById('close-details-btn');
const detailTitle = document.getElementById('detail-title');

// Grab all business cards
const businessCards = document.querySelectorAll('.business-card');

// --- Categories Modal Logic ---
categoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.remove('hidden');
});

closeCategoriesBtn.addEventListener('click', () => {
    categoriesOverlay.classList.add('hidden');
});

// Navigation routing inside Categories Modal
document.getElementById('nav-home').addEventListener('click', () => {
    window.location.href = 'menu.html';
});
document.getElementById('nav-heists').addEventListener('click', () => {
    window.location.href = 'heists.html'; // Assuming this is your next file
});

// --- Details Split-Screen Logic ---

// Open details modal when ANY business card is clicked
businessCards.forEach(card => {
    card.addEventListener('click', (event) => {
        // As a nice touch, grab the text from the card clicked and put it in the detail title
        const cardName = event.currentTarget.innerText;
        detailTitle.innerText = cardName;
        
        detailsOverlay.classList.remove('hidden');
    });
});

closeDetailsBtn.addEventListener('click', () => {
    detailsOverlay.classList.add('hidden');
});

// Close overlays if clicking the dark background outside the boxes
window.addEventListener('click', (event) => {
    if (event.target === categoriesOverlay) {
        categoriesOverlay.classList.add('hidden');
    }
    if (event.target === detailsOverlay) {
        detailsOverlay.classList.add('hidden');
    }
});