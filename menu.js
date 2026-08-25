// Grab the necessary elements from the HTML
const categoriesBtn = document.getElementById('categories-btn');
const overlay = document.getElementById('categories-overlay');
const closeBtn = document.getElementById('close-modal-btn');

// Open the modal when clicking "Categories"
categoriesBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
});

// Close the modal when clicking the "X"
closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

// (Optional) Close the modal if the user clicks the dark background outside the box
overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        overlay.classList.add('hidden');
    }
});