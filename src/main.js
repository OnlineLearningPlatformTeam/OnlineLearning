import './style.css';
const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    function setMenuState(isOpen) {
      menu.classList.toggle('hidden', !isOpen);
      iconOpen.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
    menuBtn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('hidden');
      setMenuState(isOpen);
    });
    document.addEventListener('click', (e) => {
      const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
      if (!isClickInside && !menu.classList.contains('hidden')) {
        setMenuState(false);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        setMenuState(false);
        menuBtn.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        menu.classList.remove('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else if (!menuBtn.getAttribute('aria-expanded') || menuBtn.getAttribute('aria-expanded') === 'false') {
        menu.classList.add('hidden');
      }
    });

