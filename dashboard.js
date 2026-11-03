
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const searchInput = document.getElementById("globalSearch");
const internshipList = document.getElementById("internshipList");
const emptySearch = document.getElementById("emptySearch");
const toast = document.getElementById("toast");

let savedCount = 3;
let toastTimer;

// Display a small message at the bottom of the page.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// Mobile sidebar toggle.
menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile sidebar when a navigation link is selected.
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Highlight the navigation item for the current section.
const sections = document.querySelectorAll(
  "#home, #resume, #internships, #skills, #applications, #saved"
);

const observer = new IntersectionObserver(entries => {
  const visibleSections = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

  if (!visibleSections.length) return;

  const currentId = visibleSections[0].target.id;

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentId}`
    );
  });
}, {
  rootMargin: "-15% 0px -65% 0px",
  threshold: [0, 0.2, 0.5]
});

sections.forEach(section => observer.observe(section));

// Search internships by company name, role, or keywords.
function filterInternships() {
  const query = searchInput.value.trim().toLowerCase();
  const rows = document.querySelectorAll(".internship-row");
  let visibleCount = 0;

  rows.forEach(row => {
    const searchableText =
      `${row.dataset.search} ${row.innerText}`.toLowerCase();

    const matches = searchableText.includes(query);
    row.hidden = !matches;

    if (matches) visibleCount++;
  });

  emptySearch.hidden = visibleCount !== 0;
  internshipList.hidden = visibleCount === 0;
}

searchInput.addEventListener("input", filterInternships);

// Keyboard shortcut: Cmd/Ctrl + K focuses the search bar.
document.addEventListener("keydown", event => {
  if (
    (event.metaKey || event.ctrlKey) &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === "Escape") {
    searchInput.blur();
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// Save or unsave an internship.
document.querySelectorAll(".save-button").forEach(button => {
  button.addEventListener("click", () => {
    const isSaved = button.classList.toggle("saved");

    button.setAttribute("aria-pressed", String(isSaved));
    button.setAttribute(
      "aria-label",
      `${isSaved ? "Unsave" : "Save"} ${button.closest(".internship-row")
        .querySelector("h3").textContent}`
    );

    button.textContent = isSaved ? "♥" : "♡";

    savedCount = Math.max(0, savedCount + (isSaved ? 1 : -1));

    document.getElementById("savedCount").textContent = savedCount;

    document.querySelector("#savedSummary strong").textContent =
      `${savedCount} opportunit${savedCount === 1 ? "y" : "ies"}`;

    document.querySelector("#savedSummary small").textContent =
      "Saved for later";

    showToast(
      isSaved
        ? "Opportunity saved to your list!"
        : "Opportunity removed from your saved list."
    );
  });
});

// Demo actions: these buttons show feedback but do not create
// a real resume, application, account, or backend record.
document.getElementById("resumeButton").addEventListener("click", event => {
  event.preventDefault();
  showToast("Resume Builder is ready for the next development step.");
});

document.getElementById("skillDetails").addEventListener("click", event => {
  event.preventDefault();
  showToast("Skill details can be connected in a future update.");
});

document.getElementById("viewAllInternships").addEventListener("click", event => {
  event.preventDefault();
  showToast("You're viewing the sample internship recommendations.");
});

document.getElementById("viewApplications").addEventListener("click", event => {
  event.preventDefault();
  showToast("Your application tracker currently uses sample data.");
});

document.getElementById("notificationButton").addEventListener("click", () => {
  showToast("You're all caught up! Notifications are demo-only.");
});
