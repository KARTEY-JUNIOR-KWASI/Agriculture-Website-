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

  const showcase = document.querySelector('.showcase');
  if (showcase) {
    const activateMap = () => showcase.setAttribute('data-map-active', 'true');
    if ('IntersectionObserver' in window) {
      const mapObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activateMap();
              mapObserver.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );

      mapObserver.observe(showcase);
    } else {
      activateMap();
    }
  }

  const chat = document.querySelector('.chat');
  if (chat) {
    const toggle = chat.querySelector('.chat__toggle');
    const panel = chat.querySelector('.chat__panel');
    const close = chat.querySelector('.chat__close');
    const composer = chat.querySelector('.chat__composer');
    const textarea = chat.querySelector('#chat-input');

    const setChatState = (isOpen) => {
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        panel.hidden = false;
        panel.dataset.open = 'true';
        textarea?.focus();
      } else {
        panel.dataset.open = 'false';
        panel.addEventListener(
          'transitionend',
          () => {
            if (panel.dataset.open === 'false') {
              panel.hidden = true;
            }
          },
          { once: true }
        );
      }
    };

    toggle?.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        setChatState(false);
      } else {
        panel.hidden = false;
        requestAnimationFrame(() => setChatState(true));
      }
    });

    close?.addEventListener('click', () => setChatState(false));

    composer?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!textarea || !textarea.value.trim()) return;

      const messageText = textarea.value.trim();
      textarea.value = '';

      const history = panel.querySelector('.chat__history');
      if (history) {
        const message = document.createElement('div');
        message.className = 'chat__message chat__message--user';
        message.innerHTML = `<span class="chat__sender">You</span><p>${messageText}</p>`;
        history.appendChild(message);
        history.scrollTo({ top: history.scrollHeight, behavior: 'smooth' });

        const typing = document.createElement('div');
        typing.className = 'chat__typing';
        typing.setAttribute('role', 'status');
        typing.textContent = 'Avery is typing…';
        history.appendChild(typing);
        history.scrollTo({ top: history.scrollHeight, behavior: 'smooth' });

        setTimeout(() => {
          typing.remove();
          const reply = document.createElement('div');
          reply.className = 'chat__message chat__message--agent';
          reply.innerHTML = `
            <span class="chat__sender">Avery · Farm Intelligence Specialist</span>
            <p>Thanks for sharing! I’ll route this to the right agronomy strategist and email you a tailored recommendation within the hour.</p>
            <time>${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
          `;
          history.appendChild(reply);
          history.scrollTo({ top: history.scrollHeight, behavior: 'smooth' });
        }, 1600);
      }
    });
  }

  const roiSection = document.querySelector('.roi');
  if (roiSection) {
    const acreageRange = roiSection.querySelector('#roi-acreage');
    const yieldInput = roiSection.querySelector('#roi-yield');
    const priceInput = roiSection.querySelector('#roi-price');
    const costInput = roiSection.querySelector('#roi-cost');
    const acreageDisplay = roiSection.querySelector('[data-field="acreage"]');
    const upliftDisplay = roiSection.querySelector('[data-result="uplift"]');
    const revenueDisplay = roiSection.querySelector('[data-result="revenue"]');
    const waterDisplay = roiSection.querySelector('[data-result="water"]');
    const paybackDisplay = roiSection.querySelector('[data-result="payback"]');

    const formatNumber = (value) => value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const formatCurrency = (value) =>
      value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    const updateROI = () => {
      const acreage = Number(acreageRange?.value || 0);
      const baselineYield = Number(yieldInput?.value || 0);
      const price = Number(priceInput?.value || 0);
      const programCost = Number(costInput?.value || 0);

      if (acreageDisplay) {
        acreageDisplay.textContent = formatNumber(acreage);
      }

      if (!acreage || !baselineYield || !price) {
        return;
      }

      const adaptiveFactor = clamp(0.14 + (baselineYield / 10) * 0.06, 0.1, 0.32);
      const investmentModifier = clamp(0.04 + programCost / 4000000, 0.02, 0.09);
      const upliftPercent = clamp(adaptiveFactor + investmentModifier, 0.12, 0.38);

      const additionalYield = acreage * baselineYield * upliftPercent;
      const grossGain = additionalYield * price;
      const waterSavingsPercent = clamp(0.22 + upliftPercent * 0.6, 0.18, 0.42);
      const waterSavingsValue = acreage * 35 * waterSavingsPercent;
      const carbonPremium = acreage * 28;
      const netNewRevenue = grossGain + waterSavingsValue + carbonPremium - programCost;
      const monthlyGain = netNewRevenue / 12;
      const paybackMonths = monthlyGain > 0 ? programCost / monthlyGain : Infinity;

      if (upliftDisplay) {
        upliftDisplay.textContent = `+${Math.round(upliftPercent * 100)}%`;
      }

      if (revenueDisplay) {
        revenueDisplay.textContent = formatCurrency(Math.max(netNewRevenue, 0));
      }

      if (waterDisplay) {
        waterDisplay.textContent = `${Math.round(waterSavingsPercent * 100)}%`;
      }

      if (paybackDisplay) {
        paybackDisplay.textContent =
          paybackMonths === Infinity ? 'N/A' : `${paybackMonths.toFixed(1)} months`;
      }
    };

    [acreageRange, yieldInput, priceInput, costInput].forEach((input) => {
      input?.addEventListener('input', updateROI);
      input?.addEventListener('change', updateROI);
    });

    updateROI();
  }

  const forms = document.querySelectorAll('[data-form]');
  if (forms.length) {
    const generateToken = () => {
      const bytes = new Uint8Array(16);
      if (window.crypto?.getRandomValues) {
        window.crypto.getRandomValues(bytes);
      } else {
        for (let i = 0; i < bytes.length; i += 1) {
          bytes[i] = Math.floor(Math.random() * 256);
        }
      }
      return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    };

    forms.forEach((form) => {
      const csrfInput = form.querySelector('[data-csrf]');
      const status = form.querySelector('[data-form-status]');
      const submitButton = form.querySelector('button[type="submit"]');
      const defaultButtonLabel = submitButton?.textContent?.trim() ?? '';

      if (csrfInput) {
        csrfInput.value = generateToken();
      }

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        form.classList.add('is-loading');
        if (status) {
          status.textContent = 'Submitting...';
        }

        if (submitButton) {
          const loadingLabel = submitButton.dataset.loadingLabel;
          if (loadingLabel) {
            submitButton.textContent = loadingLabel;
          }
        }

        setTimeout(() => {
          form.classList.remove('is-loading');
          if (submitButton) {
            submitButton.textContent = defaultButtonLabel || 'Submit';
          }
          if (status) {
            status.textContent =
              form.dataset.form === 'subscribe'
                ? 'Thanks for joining our field intelligence briefings!'
                : 'We received your details! Our strategists will follow up shortly.';
          }
          form.reset();
          if (csrfInput) {
            csrfInput.value = generateToken();
          }
        }, 1400);
      });
    });
  }
});
