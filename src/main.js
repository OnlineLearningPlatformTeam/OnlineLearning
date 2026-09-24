import './style.css';


// message

const form = document.getElementById('contactForm');
const message = document.getElementById('message');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const submitLabel = document.getElementById('submitLabel');
const formStatus = document.getElementById('formStatus');

// Live character counter for the message field
message.addEventListener('input', () => {
  charCount.textContent = message.value.length;
});

// Mark a field as "touched" once the user leaves it, so invalid styling
// only appears after interaction rather than on page load.
form.querySelectorAll('.input').forEach((field) => {
  field.addEventListener('blur', () => field.classList.add('touched'));
});

function showFieldError(field) {
  const wrapper = field.closest('div');
  const errorMsg = wrapper.parentElement.querySelector('.error-msg') || wrapper.querySelector('.error-msg');
  if (errorMsg) errorMsg.classList.remove('hidden');
  field.classList.add('touched');
}

function clearFieldError(field) {
  const wrapper = field.closest('div');
  const errorMsg = wrapper.parentElement.querySelector('.error-msg') || wrapper.querySelector('.error-msg');
  if (errorMsg) errorMsg.classList.add('hidden');
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