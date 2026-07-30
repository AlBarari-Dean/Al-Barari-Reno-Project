(() => {
  "use strict";

  const form = document.querySelector("#lead-form");

  if (!form) {
    return;
  }

  const submitButton = document.querySelector("#submit-button");
  const buttonLabel = submitButton.querySelector(".button-label");
  const formStatus = document.querySelector("#form-status");

  const fields = {
    name: document.querySelector("#name"),
    mobile: document.querySelector("#mobile"),
    email: document.querySelector("#email"),
    consent: document.querySelector("#consent")
  };

  const errors = {
    name: document.querySelector('[data-error-for="name"]'),
    mobile: document.querySelector('[data-error-for="mobile"]'),
    email: document.querySelector('[data-error-for="email"]'),
    consent: document.querySelector('[data-error-for="consent"]')
  };

  const setError = (fieldName, message) => {
    const field = fields[fieldName];
    const error = errors[fieldName];

    if (field && field.type !== "checkbox") {
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    if (error) {
      error.textContent = message;
    }
  };

  const clearErrors = () => {
    Object.keys(errors).forEach((fieldName) => {
      setError(fieldName, "");
    });

    formStatus.textContent = "";
    formStatus.classList.remove("is-error");
  };

  const normalizePhone = (value) => {
    return value.replace(/[^\d+]/g, "");
  };

  const validate = () => {
    clearErrors();

    let valid = true;
    const name = fields.name.value.trim();
    const mobile = normalizePhone(fields.mobile.value.trim());
    const email = fields.email.value.trim();

    if (name.length < 2) {
      setError("name", "Please enter your full name.");
      valid = false;
    }

    if (mobile.length < 8) {
      setError("mobile", "Please enter a valid mobile number.");
      valid = false;
    }

    if (!fields.email.checkValidity() || email.length < 5) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (!fields.consent.checked) {
      setError("consent", "Please confirm that we may contact you.");
      valid = false;
    }

    return valid;
  };

  Object.entries(fields).forEach(([fieldName, field]) => {
    const eventName = field.type === "checkbox" ? "change" : "input";

    field.addEventListener(eventName, () => {
      setError(fieldName, "");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validate()) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    submitButton.disabled = true;
    buttonLabel.textContent = "Submitting";
    formStatus.textContent = "Securely registering your access…";
    formStatus.classList.remove("is-error");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      buttonLabel.textContent = "Access granted";
      formStatus.textContent = "Thank you. Opening your briefing…";

      window.setTimeout(() => {
        window.location.href = "thankyou.html";
      }, 700);
    } catch (error) {
      submitButton.disabled = false;
      buttonLabel.textContent = "Unlock briefing";
      formStatus.textContent =
        "We couldn't submit the form. Please check your connection and try again.";
      formStatus.classList.add("is-error");
    }
  });
})();
