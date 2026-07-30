const form = document.getElementById("lead-form");
const statusBox = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");
const label = submitButton?.querySelector(".button-label");

const validators = {
  name: value => value.trim().length >= 2 ? "" : "Please enter your full name.",
  mobile: value => /^[+()\d\s-]{7,20}$/.test(value.trim()) ? "" : "Please enter a valid mobile number.",
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address.",
  consent: checked => checked ? "" : "Please confirm that we may contact you."
};

function setError(key, message) {
  const el = document.querySelector(`[data-error-for="${key}"]`);
  if (el) el.textContent = message;
}

function validateForm() {
  const values = {
    name: form.name.value,
    mobile: form.mobile.value,
    email: form.email.value,
    consent: form.consent.checked
  };
  let valid = true;
  Object.entries(values).forEach(([key, value]) => {
    const message = validators[key](value);
    setError(key, message);
    if (message) valid = false;
  });
  return valid;
}

form?.addEventListener("submit", async event => {
  event.preventDefault();
  statusBox.textContent = "";
  if (!validateForm()) {
    statusBox.textContent = "Please check the highlighted fields.";
    return;
  }

  submitButton.disabled = true;
  if (label) label.textContent = "Requesting access…";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Submission failed");
    window.location.href = "thankyou.html";
  } catch (error) {
    statusBox.textContent = "We could not submit the form. Please try again or contact Dean on WhatsApp.";
    submitButton.disabled = false;
    if (label) label.textContent = "Access investment briefing";
  }
});

document.querySelectorAll(".reveal").forEach(el => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  observer.observe(el);
});
