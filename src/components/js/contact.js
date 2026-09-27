


// message

const form = document.getElementById('contactForm');
const message = document.getElementById('message');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const submitLabel = document.getElementById('submitLabel');
const formStatus = document.getElementById('formStatus');

// The courses page links here as contact.html?topic=... — preselect the
// matching inquiry area and put the cursor in the first field.
const TOPIC_TO_SUBJECT = {
  advisor: 'enrollment',
  consultation: 'enrollment',
  enrollment: 'enrollment',
  course: 'course',
  courses: 'course',
  transfer: 'transfer',
  technical: 'technical',
  partnership: 'partnership',
  other: 'other',
};
const topic = new URLSearchParams(window.location.search).get('topic');
const subjectField = document.getElementById('subject');
if (topic && subjectField) {
  const wanted = TOPIC_TO_SUBJECT[topic.toLowerCase()];
  if (wanted && [...subjectField.options].some((option) => option.value === wanted)) {
    subjectField.value = wanted;
    subjectField.dispatchEvent(new Event('change', { bubbles: true }));
  }
  document.getElementById('name')?.focus();
}

// Live character counter for the message field
message.addEventListener('input', () => {
  charCount.textContent = message.value.length;
});

// Mark a field as "touched" once the user leaves it, so invalid styling
// only appears after interaction rather than on page load.
form.querySelectorAll('.input').forEach((field) => {
  field.addEventListener('blur', () => field.classList.add('touched'));
});

// Each message belongs to exactly one field via data-error-for, so clearing
// one field can never hide (or reveal) another field's message.
const errorNode = (field) =>
  document.querySelector(`.error-msg[data-error-for="${field.id}"]`) ||
  field.closest('div')?.parentElement?.querySelector('.error-msg') ||
  field.closest('div')?.querySelector('.error-msg') ||
  null;

function showFieldError(field) {
  const errorMsg = errorNode(field);
  if (errorMsg) errorMsg.classList.remove('hidden');
  field.classList.add('touched');
  field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
  const errorMsg = errorNode(field);
  if (errorMsg) errorMsg.classList.add('hidden');
  field.removeAttribute('aria-invalid');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formStatus.classList.add('hidden');

  let valid = true;
  form.querySelectorAll('[required]').forEach((field) => {
    if (!field.checkValidity()) {
      valid = false;
      showFieldError(field);
    } else {
      clearFieldError(field);
    }
  });

  if (!valid) return;

  // Simulate sending; wire this up to a real endpoint as needed.
  submitBtn.disabled = true;
  submitLabel.textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitLabel.textContent = 'Send Message';
    formStatus.textContent = "Thanks — your message has been sent. We'll reply within 24 academic hours.";
    formStatus.classList.remove('hidden');
    form.reset();
    charCount.textContent = '0';
    form.querySelectorAll('.touched').forEach((f) => f.classList.remove('touched'));
    form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
  }, 700);
});

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