
// Navbar

const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

function setMenuState(isOpen) {
  menu.classList.toggle('opacity-0', !isOpen);
  menu.classList.toggle('opacity-100', isOpen);
  menu.classList.toggle('pointer-events-none', !isOpen);
  menu.classList.toggle('pointer-events-auto', isOpen);
  menu.classList.toggle('-translate-y-2', !isOpen);
  menu.classList.toggle('translate-y-0', isOpen);
  iconOpen.classList.toggle('opacity-0', isOpen);
  iconOpen.classList.toggle('rotate-90', isOpen);
  iconOpen.classList.toggle('scale-75', isOpen);
  iconClose.classList.toggle('opacity-0', !isOpen);
  iconClose.classList.toggle('rotate-90', !isOpen);
  iconClose.classList.toggle('scale-75', !isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuBtn.classList.toggle('active', isOpen);
}

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('opacity-0');
    setMenuState(isOpen);
  });

  document.addEventListener('click', (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedButton = menuBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedButton && menu.classList.contains('opacity-100')) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('opacity-100')) {
      setMenuState(false);
      menuBtn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      menu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
      menu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      iconOpen.classList.remove('opacity-0', 'rotate-90', 'scale-75');
      iconClose.classList.add('opacity-0', 'rotate-90', 'scale-75');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.classList.remove('active');
    } else if (menuBtn.getAttribute('aria-expanded') === 'false') {
      menu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      menu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
    }
  });
}

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