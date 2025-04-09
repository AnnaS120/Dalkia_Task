const CHRISTMAS_DATE = "2025-12-25";
const NEW_YEAR_DATE = "2026-01-01";

// Calculating days until a specific date
function calculateDaysUntil(specificDate) {
    const currentDate = new Date();
    const target = new Date(specificDate);
    return Math.round((target - currentDate) / (1000 * 60 * 60 * 24));
}

// Updating DOM with a given value
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
    const christmasDays = calculateDaysUntil(CHRISTMAS_DATE);
    updateElementTextById("my-element", christmasDays);

    const newYearDays = calculateDaysUntil(NEW_YEAR_DATE);
    updateElementTextById("my-element2", newYearDays);
}

document.addEventListener("DOMContentLoaded", updateCountdowns);




