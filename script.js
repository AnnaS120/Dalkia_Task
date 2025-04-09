const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const countdowns = [
    { date: "2025-12-25", elementId: "my-element" }, 
    { date: "2026-01-01", elementId: "my-element2" },
    { date: "2025-02-14", elementId: "my-element3" }  
];

// Getting a next valid date of the event (if the event has already passed, move it to next year)
function getNextValidDate(dateString) {
    const currentDate = new Date();
    const targetDate = new Date(dateString);

    if (targetDate < currentDate) {
        targetDate.setFullYear(currentDate.getFullYear() + 1);
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

document.addEventListener("DOMContentLoaded", updateCountdowns);