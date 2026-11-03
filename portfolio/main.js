const THEME_STORAGE_KEY = "theme";
const MOON_ICON = "🌙";
const SUN_ICON = "☀️";

const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");
const themeToggle = document.getElementById("themeToggle");

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageInput = document.getElementById("messageInput");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");


function toggleMenu() {
  navLinks.classList.toggle("open");
}

function closeMenu() {
  navLinks.classList.remove("open");
}

hamburger.addEventListener("click", toggleMenu);

for (const link of navLinks.querySelectorAll("a")) {
  link.addEventListener("click", closeMenu);
}


function getContactFormError(name, email, message) {
  if (name === "") {
    return "Please enter your name.";
  }

  if (email === "" || !email.includes("@")) {
    return "Please enter a valid email address.";
  }

  if (message === "") {
    return "Please enter a message.";
  }

  return "";
}

function handleContactSubmit(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  formError.textContent = "";
  formSuccess.textContent = "";

  const errorText = getContactFormError(name, email, message);

  if (errorText !== "") {
    formError.textContent = errorText;
    return;
  }

  formSuccess.textContent = "Thanks! Your message has been sent.";
  contactForm.reset();
}

contactForm.addEventListener("submit", handleContactSubmit);


function isDarkMode() {
  return document.body.classList.contains("dark-mode");
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.textContent = isDark ? SUN_ICON : MOON_ICON;
}

function toggleTheme() {
  const newTheme = isDarkMode() ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
}

if (localStorage.getItem(THEME_STORAGE_KEY) === "dark") {
  applyTheme("dark");
}

themeToggle.addEventListener("click", toggleTheme);
