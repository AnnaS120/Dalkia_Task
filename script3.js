const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const countdowns = [
  { date: "2025-12-25", elementId: "my-element" },
  { date: "2026-01-01", elementId: "my-element2" },
  { date: "2025-02-14", elementId: "my-element3" },
  { date: "2025-10-31", elementId: "my-element4" },
];

function getNextValidDate(dateString) {
  const currentDate = new Date();
  let targetDate = new Date(dateString);
  while (targetDate < currentDate) {
    targetDate.setFullYear(targetDate.getFullYear() + 1);
  }
  return targetDate;
}

function calculateDaysUntil(targetDate) {
  const currentDate = new Date();
  return Math.round((targetDate - currentDate) / MILLISECONDS_IN_A_DAY);
}

function updateElementTextById(id, text) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`Countdown not available (Element with ID "${id}" not found.)`);
    return;
  }
  element.innerText = text;
}

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

  // Load saved custom countdowns and preserve order
  const savedCountdowns = JSON.parse(localStorage.getItem("customCountdowns")) || [];
  savedCountdowns.forEach(({ name, date, isRecurring }) => {
    createCountdownCard(name, date, isRecurring);
  });

  // Enable drag-and-drop and update localStorage on sort
  new Sortable(allCountdowns, {
    animation: 150,
    handle: ".card",
    ghostClass: "sortable-ghost",
    onEnd: saveCurrentOrderToLocalStorage
  });

  addEventBtn.addEventListener("click", () => {
    if (activeInputCard) return;

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

    const cardCol = document.createElement("div");
    cardCol.className = "col-12 col-md-6";
    cardCol.appendChild(card);
    allCountdowns.appendChild(cardCol);
    activeInputCard = card;

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }, 100);

    card.querySelector(".delete-btn").addEventListener("click", () => {
      cardCol.remove();
      activeInputCard = null;
    });

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

      cardCol.remove();
      createCountdownCard(name, date, isRecurring);
      saveCountdownToLocalStorage({ name, date, isRecurring });
      activeInputCard = null;
    });
  });

  function createCountdownCard(name, date, isRecurring) {
    const targetDate = isRecurring ? getNextValidDate(date) : new Date(date);
    const daysRemaining = calculateDaysUntil(targetDate);

    const cardCol = document.createElement("div");
    cardCol.className = "col-12 col-md-6";
    cardCol.dataset.name = name;
    cardCol.dataset.date = date;

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

    card.querySelector(".delete-btn").addEventListener("click", () => {
      card.classList.add("fade-out");
      setTimeout(() => {
        cardCol.remove();
        deleteCountdownFromLocalStorage(name, date);
      }, 400);
    });

    cardCol.appendChild(card);
    allCountdowns.appendChild(cardCol);
  }

  function saveCountdownToLocalStorage(newCountdown) {
    const saved = JSON.parse(localStorage.getItem("customCountdowns")) || [];
    saved.push(newCountdown);
    localStorage.setItem("customCountdowns", JSON.stringify(saved));
  }

  function deleteCountdownFromLocalStorage(name, date) {
    let saved = JSON.parse(localStorage.getItem("customCountdowns")) || [];
    saved = saved.filter(c => c.name !== name || c.date !== date);
    localStorage.setItem("customCountdowns", JSON.stringify(saved));
  }

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

  function getRecurringFromCard(col) {
    const checkbox = col.querySelector('input[type="checkbox"]');
    return checkbox ? checkbox.checked : false;
  }
});

