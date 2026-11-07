/* ==========================================================
   1. YOUR DETAILS: edit this section
   Leave a value as "" until you have a real one.
   ========================================================== */
const SITE = {
  email: "ahmed.sidahmed.dev@gmail.com",     // e.g. "name@example.com"
  github: "",    // e.g. "https://github.com/your-username"
  linkedin: "",  // e.g. "https://www.linkedin.com/in/your-name"
};

/* Skills: level is 1 to 5. Change it to match how you feel. */
const SKILLS = [
  { name: "HTML", level: 4, note: "Comfortable" },
  { name: "CSS", level: 3, note: "Comfortable" },
  { name: "C++", level: 3, note: "Comfortable" },
  { name: "JavaScript", level: 1, note: "Currently learning", learning: true },
];

/* Projects: these are placeholders. Replace each one with a real project.
   Put your repository address in "github" once it exists. */
const PROJECTS = [
  { title: "Project name", description: "A short description of what this project does and the problem it solves.", tech: ["HTML", "CSS"], github: "" },
  { title: "Project name", description: "A short description of what this project does and the problem it solves.", tech: ["C++"], github: "" },
  { title: "Project name", description: "A short description of what this project does and the problem it solves.", tech: ["JavaScript"], github: "" },
];

/* ==========================================================
   2. SMALL HELPERS
   ========================================================== */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const toastEl = $("#toast");
let toastTimer;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3500);
}

/* ==========================================================
   3. COMPONENTS: build cards from the data above
   ========================================================== */
function SkillCard({ name, level, note, learning }) {
  const segments = Array.from({ length: 5 }, (_, i) =>
    `<span class="${i < level ? "on" : ""}" style="--n:${i}"></span>`).join("");
  return `
    <article class="skill ${learning ? "learning" : ""}">
      <div class="skill-head"><h3>${name}</h3><small>${note}</small></div>
      <div class="meter" role="img" aria-label="${name}: ${level} out of 5">${segments}</div>
    </article>`;
}

/* A simple placeholder picture. Replace it with <img src="images/your-shot.png" alt="..."> later. */
const PLACEHOLDER_IMG = `
  <svg viewBox="0 0 120 80" fill="none" stroke="#8e9bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="8" y="8" width="104" height="64" rx="8" stroke="#2a2a2e"/>
    <path d="M44 32 32 40l12 8M76 32l12 8-12 8M66 28 54 52"/>
  </svg>`;

function ProjectCard({ title, description, tech, github }) {
  const link = github
    ? `<a class="link" href="${github}" target="_blank" rel="noopener">View on GitHub</a>`
    : `<a class="link is-placeholder" href="#" data-missing="a GitHub link for this project">GitHub link coming soon</a>`;
  return `
    <article class="project">
      <div class="project-img">${PLACEHOLDER_IMG}</div>
      <div class="project-body">
        <h3>${title}</h3>
        <p>${description}</p>
        <ul class="tags">${tech.map(t => `<li>${t}</li>`).join("")}</ul>
        ${link}
      </div>
    </article>`;
}

$("#skills-list").innerHTML = SKILLS.map(SkillCard).join("");
$("#projects-list").innerHTML = PROJECTS.map(ProjectCard).join("");

/* ==========================================================
   4. SOCIAL LINKS: fill from SITE, or explain what's missing
   ========================================================== */
$$("[data-social]").forEach(link => {
  const type = link.dataset.social;
  const value = SITE[type];
  if (value) {
    link.href = type === "email" ? `mailto:${value}` : value;
    if (type !== "email") { link.target = "_blank"; link.rel = "noopener"; }
  } else {
    link.classList.add("is-placeholder");
    link.dataset.missing = type === "email" ? "your email" : `your ${type === "github" ? "GitHub" : "LinkedIn"} link`;
  }
});

/* Clicking a link that has no real address yet shows a helpful hint */
document.addEventListener("click", event => {
  const link = event.target.closest("[data-missing]");
  if (!link) return;
  event.preventDefault();
  showToast(`Add ${link.dataset.missing} in js/script.js`);
});

/* ==========================================================
   5. NAVIGATION: mobile menu + highlight current section
   ========================================================== */
const toggle = $(".nav-toggle");
const menu = $("#nav-links");

function setMenu(open) {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

const navLinks = $$(".nav-links a[href^='#']");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => sectionObserver.observe(s));

/* Animate the skill meters when they scroll into view */
const skillsEl = $("#skills-list");
new IntersectionObserver((entries, observer) => {
  if (entries[0].isIntersecting) { skillsEl.classList.add("visible"); observer.disconnect(); }
}, { threshold: 0.3 }).observe(skillsEl);

/* ==========================================================
   6. CONTACT FORM
   ========================================================== */
const form = $("#contact-form");
const statusEl = $("#form-status");

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const message = data.get("message").trim();

  // Check each field and mark the ones that need fixing
  const valid = {
    name: name.length > 0,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: message.length > 0,
  };
  Object.entries(valid).forEach(([field, ok]) =>
    form.elements[field].setAttribute("aria-invalid", !ok));

  if (!Object.values(valid).every(Boolean)) {
    statusEl.textContent = "Please fill in your name, a valid email and a message.";
    return;
  }

  if (!SITE.email) {
    statusEl.textContent = "The form works once you add your email in js/script.js.";
    return;
  }

  // Opens the visitor's email app with the message ready to send
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  statusEl.textContent = "Opening your email app to send the message.";
  form.reset();
});

/* ==========================================================
   7. FOOTER YEAR
   ========================================================== */
$("#year").textContent = new Date().getFullYear();
