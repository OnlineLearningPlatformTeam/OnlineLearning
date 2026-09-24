import '../style.css';

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