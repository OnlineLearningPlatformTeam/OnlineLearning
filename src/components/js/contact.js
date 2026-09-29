// ========================================
// GOOGLE SHEETS
// ========================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxSwVUMKDGBWwIfWUAEF0jWDtU6KYGT5vjupjWJmbTYe1Iq1ZaTOpXKVQuGMGrsI_Dn/exec";


// ========================================
// FORM ELEMENTS
// ========================================

const form = document.getElementById("contactForm");

const message = document.getElementById("message");
const charCount = document.getElementById("charCount");

const submitBtn = document.getElementById("submitBtn");
const submitLabel = document.getElementById("submitLabel");

const formStatus = document.getElementById("formStatus");


// ========================================
// PREVENT DUPLICATE SUBMISSIONS
// ========================================

let isSubmitting = false;


// ========================================
// TOPIC → SUBJECT
// ========================================

const TOPIC_TO_SUBJECT = {
  advisor: "enrollment",
  consultation: "enrollment",
  enrollment: "enrollment",
  course: "course",
  courses: "course",
  transfer: "transfer",
  technical: "technical",
  partnership: "partnership",
  other: "other",
};


// ========================================
// READ ?topic= FROM URL
// Example:
// contact.html?topic=course
// ========================================

const topic = new URLSearchParams(
  window.location.search
).get("topic");

const subjectField = document.getElementById("subject");

if (topic && subjectField) {

  const wanted = TOPIC_TO_SUBJECT[
    topic.toLowerCase()
  ];

  if (
    wanted &&
    [...subjectField.options].some(
      (option) => option.value === wanted
    )
  ) {

    subjectField.value = wanted;

    subjectField.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
  }

  document.getElementById("name")?.focus();
}


// ========================================
// LIVE CHARACTER COUNTER
// ========================================

message.addEventListener("input", () => {

  charCount.textContent = message.value.length;

});


// ========================================
// MARK INPUT AS TOUCHED
// ========================================

form.querySelectorAll(".input").forEach((field) => {

  field.addEventListener("blur", () => {

    field.classList.add("touched");

  });

});


// ========================================
// FIND ERROR MESSAGE
// ========================================

const errorNode = (field) =>

  document.querySelector(
    `.error-msg[data-error-for="${field.id}"]`
  ) ||

  field.closest("div")?.parentElement
    ?.querySelector(".error-msg") ||

  field.closest("div")
    ?.querySelector(".error-msg") ||

  null;


// ========================================
// SHOW ERROR
// ========================================

function showFieldError(field) {

  const errorMsg = errorNode(field);

  if (errorMsg) {
    errorMsg.classList.remove("hidden");
  }

  field.classList.add("touched");

  field.setAttribute(
    "aria-invalid",
    "true"
  );
}


// ========================================
// CLEAR ERROR
// ========================================

function clearFieldError(field) {

  const errorMsg = errorNode(field);

  if (errorMsg) {
    errorMsg.classList.add("hidden");
  }

  field.removeAttribute("aria-invalid");
}


// ========================================
// FORM SUBMIT
// ========================================

form.addEventListener("submit", async (e) => {

  e.preventDefault();


  // ========================================
  // PREVENT DUPLICATE SUBMISSION
  // ========================================

  if (isSubmitting) {
    return;
  }


  // ========================================
  // HIDE PREVIOUS STATUS
  // ========================================

  formStatus.classList.add("hidden");


  // ========================================
  // VALIDATE FORM
  // ========================================

  let valid = true;

  form.querySelectorAll("[required]").forEach((field) => {

    if (!field.checkValidity()) {

      valid = false;

      showFieldError(field);

    } else {

      clearFieldError(field);

    }

  });


  // Stop if validation fails
  if (!valid) {
    return;
  }


  // ========================================
  // LOCK SUBMISSION
  // ========================================

  isSubmitting = true;

  submitBtn.disabled = true;

  submitLabel.textContent = "Sending…";


  // ========================================
  // COLLECT FORM DATA
  // ========================================

  const formData = new FormData(form);


  try {

    // ======================================
    // SEND TO GOOGLE SHEETS
    // ======================================

    await fetch(GOOGLE_SCRIPT_URL, {

      method: "POST",

      mode: "no-cors",

      body: new URLSearchParams(formData)

    });


    // ======================================
    // SUCCESS
    // ======================================

    formStatus.textContent =
      "Thanks — your message has been sent. We'll reply within 24 academic hours.";

    formStatus.classList.remove("hidden");


    // ======================================
    // RESET FORM
    // ======================================

    form.reset();

    charCount.textContent = "0";


    // Remove touched state
    form
      .querySelectorAll(".touched")
      .forEach((field) => {

        field.classList.remove("touched");

      });


    // Remove invalid state
    form
      .querySelectorAll("[aria-invalid]")
      .forEach((field) => {

        field.removeAttribute("aria-invalid");

      });


  } catch (error) {

    // ======================================
    // ERROR
    // ======================================

    console.error(
      "Google Sheets Error:",
      error
    );


    formStatus.textContent =
      "Sorry, we couldn't send your message. Please try again.";

    formStatus.classList.remove("hidden");

  } finally {

    // ======================================
    // UNLOCK FORM
    // ======================================

    isSubmitting = false;

    submitBtn.disabled = false;

    submitLabel.textContent = "Send Message";

  }

});

// =====================

document.addEventListener("DOMContentLoaded", () => {
  const subject = document.getElementById("subject");

  // Reset to default option on page refresh
  subject.value = "";
});

// ==========================================

// Frequently Asked Questions

document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close any other open items (accordion behavior)
    document.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('open', !isOpen);
    question.setAttribute('aria-expanded', String(!isOpen));
  });
});


// ===========================================================


