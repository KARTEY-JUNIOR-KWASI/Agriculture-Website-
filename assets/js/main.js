document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    const setNavState = (isOpen) => {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navLinks.dataset.open = String(isOpen);
    };

    setNavState(window.innerWidth > 780);

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      setNavState(!expanded);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 780) {
          setNavState(false);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 780) {
        setNavState(true);
      } else {
        setNavState(false);
      }
    });
  }

  const year = document.querySelector('#year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const animatedSections = document.querySelectorAll('[data-animate]');
  if (animatedSections.length) {
    animatedSections.forEach((element) => {
      const delay = element.dataset.animateDelay;
      if (delay) {
        element.style.transitionDelay = `${delay}ms`;
      }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      animatedSections.forEach((section) => observer.observe(section));
    } else {
      animatedSections.forEach((section) => section.classList.add('is-visible'));
    }
  }
});
