var hamburger = document.getElementById("hamburger");
var navLinks  = document.getElementById("nav-links");

hamburger.addEventListener("click", function () {
  if (navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
  } else {
    navLinks.classList.add("open");
  }
});

var links = navLinks.querySelectorAll("a");
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
}

var form    = document.getElementById("contact-form");
var errorEl = document.getElementById("form-error");
var successEl = document.getElementById("form-success");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var name    = document.getElementById("name").value.trim();
  var email   = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  errorEl.textContent   = "";
  successEl.textContent = "";

  if (name === "") {
    errorEl.textContent = "Please enter your name.";
    return;
  }

  if (email === "" || !email.includes("@")) {
    errorEl.textContent = "Please enter a valid email address.";
    return;
  }

  if (message === "") {
    errorEl.textContent = "Please enter a message.";
    return;
  }

  successEl.textContent = "Thanks! Your message has been sent.";
  form.reset();
});

var themeToggle = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.innerHTML = "&#9728;&#65039;";
}

themeToggle.addEventListener("click", function () {
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = "&#127769;";
  } else {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = "&#9728;&#65039;";
  }
});