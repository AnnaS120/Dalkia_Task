const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const countdowns = [
{ date: "2025-12-25", elementId: "my-element" },
{ date: "2026-01-01", elementId: "my-element2" },
{ date: "2025-02-14", elementId: "my-element3" },
{ date: "2025-10-31", elementId: "my-element4" },
];

// Getting a next valid date of the event
function getNextValidDate(dateString) {
const currentDate = new Date();
let targetDate = new Date(dateString);
while (targetDate < currentDate) {
targetDate.setFullYear(targetDate.getFullYear() + 1);
}
return targetDate;
}

// Calculating days until a specific date
function calculateDaysUntil(targetDate) {
const currentDate = new Date();
return Math.round((targetDate - currentDate) / MILLISECONDS_IN_A_DAY);
}

// Updating DOM with given values
function updateElementTextById(id, text) {
const element = document.getElementById(id);
if (!element) {
console.error(`Countdown not available (Element with ID "${id}" not found.)`);
return;
}
element.innerText = text;
}

// Updating countdowns
function updateCountdowns() {
countdowns.forEach(({ date, elementId }) => {
const nextOccurrence = getNextValidDate(date);
const daysRemaining = calculateDaysUntil(nextOccurrence);
updateElementTextById(elementId, daysRemaining);
});
}

document.addEventListener("DOMContentLoaded", () => {
updateCountdowns();

const addEventBtn = document.getElementById("add-event-btn");
const allCountdowns = document.getElementById("all-countdowns");
let activeInputCard = null;

// Loading saved countdowns
const savedCountdowns = JSON.parse(localStorage.getItem("customCountdowns")) || [];
savedCountdowns.forEach(({ name, date, isRecurring }) => {
const cardCol = buildCardColumn(name, date, isRecurring);
addDeleteHandler(cardCol, name, date);
allCountdowns.appendChild(cardCol);
});

// Making the countdowns sortable
new Sortable(allCountdowns, {
animation: 150,
handle: ".card",
ghostClass: "sortable-ghost",
onEnd: saveCurrentOrderToLocalStorage,
});

addEventBtn.addEventListener("click", handleAddEventClick);

// Add event button
function handleAddEventClick() {
    if (activeInputCard) return;
  
    const { cardCol, card } = createInputCountdownCard();
    addNewCountdown(cardCol);
    trackActiveInput(card);
    scrollToBottom();
    attachEventHandlers(card, cardCol);
}

// Adding a countdown into DOM
function addNewCountdown(cardCol) {
    allCountdowns.appendChild(cardCol);
}

//Keeps track of the currently active input card 
function trackActiveInput(card) {
    activeInputCard = card;
}
  
//Attaching delete and save logic to the input card
function attachEventHandlers(card, cardCol) {
    setupDeleteHandler(cardCol, () => {
      cardCol.remove();
      activeInputCard = null;
    });
  
    setupSaveHandler(card, cardCol, () => {
      activeInputCard = null;
    });
}


// Creating new cards when clicked on the add button
function createInputCardElement() {
    const card = document.createElement("div");
    card.className = "card shadow-sm text-center animate-in";
    card.innerHTML = `
      <div class="card-body text-center position-relative">
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        <div class="mb-3">
          <input type="text" class="form-control text-center fw-semibold fs-4" placeholder="Enter event name" required />
        </div>
        <div class="mb-3">
          <input type="date" class="form-control w-50 mx-auto" required />
        </div>
        <div class="form-check d-flex justify-content-center mb-3">
          <input class="form-check-input me-2" type="checkbox" id="repeatYearly-${Date.now()}" />
          <label class="form-check-label" for="repeatYearly-${Date.now()}">Repeat yearly</label>
        </div>
        <button class="btn btn-success save-btn">Save</button>
      </div>
    `;
    return card;
}
// Wrapping the card in a column container
function wrapCardInColumn(card) {
    const cardCol = document.createElement("div");
    cardCol.className = "col-12 col-md-6";
    cardCol.appendChild(card);
    return cardCol;
}
  
// Creating both elements and returning them
function createInputCountdownCard() {
    const card = createInputCardElement();
    const cardCol = wrapCardInColumn(card);
    return { cardCol, card };
}

// When clicking the add button, the page scrolls to the bottom
function scrollToBottom() {
setTimeout(() => {
window.scrollTo({
top: document.body.scrollHeight,
behavior: "smooth"
});
}, 100);
}

// Delete feature for custom countdowns 
function setupDeleteHandler(cardCol, onDelete) {
const deleteBtn = cardCol.querySelector(".delete-btn");
deleteBtn.addEventListener("click", onDelete);
}


// Extract data from the card
function extractFormData(card) {
    const titleInput = card.querySelector('input[type="text"]');
    const dateInput = card.querySelector('input[type="date"]');
    const isRecurring = card.querySelector('input[type="checkbox"]').checked;
  
    return {
      name: titleInput.value.trim(),
      date: dateInput.value,
      isRecurring
    };
}
  
// Validate form inputs
function validateFormData(name, date) {
    if (!name || !date) {
      alert("Please fill in both the event name and date.");
      return false;
    }
    return true;
}
  
// Handle creation and saving of a valid countdown
function handleValidCountdown(name, date, isRecurring, cardCol, onSave) {
    cardCol.remove();
    createCountdownCard(name, date, isRecurring);
    saveCountdownToLocalStorage({ name, date, isRecurring });
    onSave();
}
  
// Setup save button handler
function setupSaveHandler(card, cardCol, onSave) {
    card.querySelector(".save-btn").addEventListener("click", () => {
      const { name, date, isRecurring } = extractFormData(card);
  
      if (!validateFormData(name, date)) return;
  
      handleValidCountdown(name, date, isRecurring, cardCol, onSave);
    });
}


// Creating a saved countdown card
function createCountdownCard(name, date, isRecurring) {
    const cardCol = buildCardColumn(name, date, isRecurring); 
    addDeleteHandler(cardCol, name, date);                    
    appendCardToPage(cardCol);                                
}

function appendCardToPage(cardCol) {
    allCountdowns.appendChild(cardCol);
}

//Calculate days remaining
function getDaysRemaining(date, isRecurring) {
    const targetDate = isRecurring ? getNextValidDate(date) : new Date(date);
    return calculateDaysUntil(targetDate);
}

// Create card DOM
function createCardElement(name, daysRemaining) {
    const card = document.createElement("div");
    card.className = "card shadow-sm text-center animate-in";
    card.innerHTML = `
      <div class="card-body text-center">
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        <div class="drag-handle"><i class="fa-solid fa-grip-lines fa-lg"></i></div>
        <h3 class="card-title">${name}</h3>
        <div class="countdown-digit">${daysRemaining}</div>
      </div>
    `;
    card.classList.remove("fade-out"); // remove immediately so it's not visible until triggered
    return card;
}
// build outer card container
function buildCardColumn(name, date, isRecurring) {
    const daysRemaining = getDaysRemaining(date, isRecurring);
    const card = createCardElement(name, daysRemaining);
  
    const cardCol = document.createElement("div");
    cardCol.className = "col-12 col-md-6";
    cardCol.dataset.name = name;
    cardCol.dataset.date = date;
    cardCol.dataset.recurring = isRecurring;
  
    cardCol.appendChild(card);
    return cardCol;
  }


// Remove the custom countdown from the page
function addDeleteHandler(cardCol, name, date) {
    const card = cardCol.querySelector(".card");
    const deleteBtn = card.querySelector(".delete-btn");
  
    deleteBtn.addEventListener("click", () => {
      cardCol.remove();
      deleteCountdownFromLocalStorage(name, date);
    });
  }

// Storing a new countdown in localStorage
function saveCountdownToLocalStorage(newCountdown) {
const saved = JSON.parse(localStorage.getItem("customCountdowns")) || [];
saved.push(newCountdown);
localStorage.setItem("customCountdowns", JSON.stringify(saved));
}

//Deleting a saved countdown from localStorage when a user removes it from the page
function deleteCountdownFromLocalStorage(name, date) {
let saved = JSON.parse(localStorage.getItem("customCountdowns")) || [];
saved = saved.filter(c => c.name !== name || c.date !== date);
localStorage.setItem("customCountdowns", JSON.stringify(saved));
}

// Ypdate the countdown order in localStorage based on the current DOM state
function saveCurrentOrderToLocalStorage() {
const updated = [];
const allCards = allCountdowns.querySelectorAll(".col-md-6");

allCards.forEach(col => {
const name = col.dataset.name;
const date = col.dataset.date;
if (name && date) {
const isRecurring = getRecurringFromCard(col);
updated.push({ name, date, isRecurring });
}
});

localStorage.setItem("customCountdowns", JSON.stringify(updated));
}

// Ensuring that the repeat yearly option is correctly read from the DOM
function getRecurringFromCard(col) {
const checkbox = col.querySelector('input[type="checkbox"]');
return checkbox ? checkbox.checked : false;
}
});



