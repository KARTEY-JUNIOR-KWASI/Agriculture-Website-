document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("primary-navigation");
  const floatingCta = document.querySelector(".floating-cta");
  const contactSection = document.getElementById("contact");
  const backToTop = document.querySelector(".back-to-top");
  const yearSpan = document.querySelector("[data-year]");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = reduceMotionQuery.matches;

  const updateMotionPreference = () => {
    prefersReducedMotion = reduceMotionQuery.matches;
  };

  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", updateMotionPreference);
  } else if (typeof reduceMotionQuery.addListener === "function") {
    reduceMotionQuery.addListener(updateMotionPreference);
  }

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (navToggle && navLinks) {
    const closeNav = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.dataset.open = "false";
    };

    const openNav = () => {
      navToggle.setAttribute("aria-expanded", "true");
      navLinks.dataset.open = "true";
    };

    const navWrapper = navLinks;

    navLinks.dataset.open = "false";
    closeNav();

    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeNav();
      } else {
        openNav();
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 864) {
          closeNav();
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 864) {
        closeNav();
      }
    });

    document.addEventListener("click", (event) => {
      if (!navWrapper.contains(event.target) && event.target !== navToggle && window.innerWidth <= 864) {
        closeNav();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
        navToggle.focus();
      }
    });
  }

  const scrollToTarget = (target) => {
    if (!target) return;
    const options = { behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" };
    target.scrollIntoView(options);
  };

  if (floatingCta && contactSection) {
    const toggleFloatingCta = () => {
      const shouldShow = window.scrollY > window.innerHeight * 0.35;
      floatingCta.classList.toggle("is-visible", shouldShow);
    };

    toggleFloatingCta();

    window.addEventListener("scroll", toggleFloatingCta, { passive: true });

    floatingCta.addEventListener("click", () => {
      scrollToTarget(contactSection);
    });
  }

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      const href = backToTop.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const targetSection = document.querySelector(href);
      if (!targetSection) return;

      event.preventDefault();
      scrollToTarget(targetSection);
    });
  }
});
