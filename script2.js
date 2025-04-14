const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const countdowns = [
  { date: "2025-12-25", elementId: "my-element" },
  { date: "2026-01-01", elementId: "my-element2" },
  { date: "2025-02-14", elementId: "my-element3" },
  { date: "2025-10-31", elementId: "my-element4" }
];

// Get the next valid date (push to future if past)
function getNextValidDate(dateString) {
  const currentDate = new Date();
  let targetDate = new Date(dateString);

  while (targetDate < currentDate) {
    targetDate.setFullYear(targetDate.getFullYear() + 1);
  }

  return targetDate;
}

// Calculate days between now and target
function calculateDaysUntil(targetDate) {
  const currentDate = new Date();
  return Math.round((targetDate - currentDate) / MILLISECONDS_IN_A_DAY);
}

// Set days text inside a fixed element
function updateElementTextById(id, text) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Countdown not available (Element with ID "${id}" not found.)`);
    return;
  }
  element.innerText = text;
}

// Update hardcoded countdowns
function updateCountdowns() {
  countdowns.forEach(({ date, elementId }) => {
    const nextOccurrence = getNextValidDate(date);
    const daysRemaining = calculateDaysUntil(nextOccurrence);
    updateElementTextById(elementId, daysRemaining);
  });
}

document.addEventListener("DOMContentLoaded", updateCountdowns);

document.addEventListener("DOMContentLoaded", () => {
    const addEventBtn = document.getElementById("add-event-btn");
    const customCountdowns = document.getElementById("custom-countdowns");
  
    let activeInputCard = null;
  
    addEventBtn.addEventListener("click", () => {
      if (activeInputCard) return;
  
      const cardCol = document.createElement("div");
      cardCol.className = "col-12 col-md-6";
  
      const card = document.createElement("div");
      card.className = "card mb-4 shadow-sm animate-in";
  
      card.innerHTML = `
        <div class="card-body text-center">
          <div class="mb-3">
            <input type="text" class="form-control text-center fw-semibold fs-4" placeholder="Enter event name..." required />
          </div>
          <div class="mb-3">
            <input type="date" class="form-control w-50 mx-auto" required />
          </div>
          <div class="form-check d-flex justify-content-center mb-3">
            <input class="form-check-input me-2" type="checkbox" id="repeatYearly-${Date.now()}" />
            <label class="form-check-label" for="repeatYearly-${Date.now()}">Repeat yearly</label>
          </div>
          <button class="btn btn-success save-btn">Save Countdown</button>
        </div>
      `;
  
      cardCol.appendChild(card);
      customCountdowns.appendChild(cardCol);
      activeInputCard = card;
  
      card.querySelector(".save-btn").addEventListener("click", () => {
        const titleInput = card.querySelector('input[type="text"]');
        const dateInput = card.querySelector('input[type="date"]');
        const isRecurring = card.querySelector('input[type="checkbox"]').checked;
  
        const name = titleInput.value.trim();
        const date = dateInput.value;
  
        if (!name || !date) {
          alert("Please fill in both the event name and date.");
          return;
        }
  
        const targetDate = isRecurring ? getNextValidDate(date) : new Date(date);
        const daysRemaining = calculateDaysUntil(targetDate);
  
        card.innerHTML = `
          <div class="card-body text-center">
            <button class="delete-btn">🗑</button>
            <h3 class="card-title">${name}</h3>
            <div class="countdown-digit">${daysRemaining}</div>
          </div>
        `;
  
        card.querySelector(".delete-btn").addEventListener("click", () => {
          cardCol.remove();
        });
  
        activeInputCard = null;
      });
    });
  });