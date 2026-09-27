import './style.css';
<<<<<<< HEAD
// Navbar

=======
>>>>>>> c7859430ce15525f08e5d58e2b9739d4a5583bfe
const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
<<<<<<< HEAD

=======
>>>>>>> c7859430ce15525f08e5d58e2b9739d4a5583bfe
    function setMenuState(isOpen) {
      menu.classList.toggle('hidden', !isOpen);
      iconOpen.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
<<<<<<< HEAD

=======
>>>>>>> c7859430ce15525f08e5d58e2b9739d4a5583bfe
    menuBtn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('hidden');
      setMenuState(isOpen);
    });
<<<<<<< HEAD

    // Close menu when clicking outside
=======
>>>>>>> c7859430ce15525f08e5d58e2b9739d4a5583bfe
    document.addEventListener('click', (e) => {
      const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
      if (!isClickInside && !menu.classList.contains('hidden')) {
        setMenuState(false);
      }
    });
<<<<<<< HEAD

    // Close menu on Escape key
=======
>>>>>>> c7859430ce15525f08e5d58e2b9739d4a5583bfe
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        setMenuState(false);
        menuBtn.focus();
      }
    });
<<<<<<< HEAD

    // Reset menu state when resizing to desktop
=======
>>>>>>> c7859430ce15525f08e5d58e2b9739d4a5583bfe
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
<<<<<<< HEAD
=======

>>>>>>> c7859430ce15525f08e5d58e2b9739d4a5583bfe
