// Calculating days until a specific date
function calculateDaysUntil(specificDate, elementId) {
    const currentDate = new Date();
    const target = new Date(specificDate);
    const daysUntil = Math.round((target - currentDate) / (1000 * 60 * 60 * 24));

    const element = document.getElementById(elementId);
    element.innerText = daysUntil;
}

document.addEventListener("DOMContentLoaded", () => {
    calculateDaysUntil("2025-12-25", "my-element");  // Days until Christmas
    calculateDaysUntil("2026-01-01", "my-element2");  // Days until New Year
  });