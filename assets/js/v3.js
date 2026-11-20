/**
 * Anauê Design · Preview V3
 * Interações humanizadas, scroll reveal, dropdown e diagnóstico CRO multi-step
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Header com sombra sutil ao rolar
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 18);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 2. Menu Mobile + Dropdown de Soluções
  const toggleBtn = document.querySelector('.header__toggle');
  const nav = document.querySelector('.header__nav');
  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(open));
    });
  }

  const dropdown = document.querySelector('.nav-dropdown');
  const dropdownTrigger = document.querySelector('.nav-dropdown__trigger');
  if (dropdown && dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('is-open');
      dropdownTrigger.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
      if (nav && toggleBtn && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
        nav.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Scroll Reveal suave (respeitando prefers-reduced-motion)
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // 4. FAQ Accordion elegante (fecha os demais ao abrir um)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item && other.open) other.removeAttribute('open');
        });
      }
    });
  });

  // 5. Diagnóstico Rápido Multi-Step (CRO na prática: 2 cliques -> briefing pronto no WhatsApp)
  const wizard = document.querySelector('.wizard');
  if (wizard) {
    const panes = wizard.querySelectorAll('.wizard__pane');
    const bars = wizard.querySelectorAll('.wizard__bar');
    const stepLabel = wizard.querySelector('.wizard__step-label');
    const resultTitle = wizard.querySelector('#wizard-result-title');
    const resultDesc = wizard.querySelector('#wizard-result-desc');
    const waLink = wizard.querySelector('#wizard-wa-link');
    const backBtn = wizard.querySelector('.wizard__back');

    const state = {
      step: 1,
      goal: '',
      stage: ''
    };

    const recommendations = {
      'Site / PWA de Alta Conversão': {
        title: 'Arquitetura Web & CRO sob medida',
        desc: 'Recomendamos um diagnóstico de performance (Core Web Vitals) e redesign orientado à conversão para transformar visitantes em reuniões qualificadas.'
      },
      'IA & Automação de WhatsApp': {
        title: 'Agente de IA Humanizado + Integração CRM',
        desc: 'Estruturamos atendimento 24/7 no WhatsApp com qualificação automática e transbordo inteligente para seu time comercial.'
      },
      'Tráfego Pago & SEO/GEO': {
        title: 'Aquisição Previsível (Ads + SEO + Buscas por IA)',
        desc: 'Combinamos campanhas de alta intenção no Google/Meta com posicionamento orgânico no Google e citação em IAs como ChatGPT e Gemini.'
      },
      'Plataforma EAD / Moodle ou Hospedagem': {
        title: 'Engenharia Moodle & Infraestrutura NVMe Gerenciada',
        desc: 'Customização visual exclusiva, plugins sob demanda, gateways de pagamento e servidores blindados com suporte humano direto.'
      }
    };

    function renderStep(step) {
      state.step = step;
      panes.forEach((pane, idx) => {
        pane.classList.toggle('is-active', idx + 1 === step);
      });
      bars.forEach((bar, idx) => {
        bar.classList.toggle('is-done', idx + 1 < step);
        bar.classList.toggle('is-active', idx + 1 === step);
      });
      if (stepLabel) {
        stepLabel.textContent = step < 3 ? `Passo ${step} de 2` : 'Diagnóstico pronto';
      }
      if (backBtn) {
        backBtn.style.visibility = step > 1 ? 'visible' : 'hidden';
      }
    }

    wizard.querySelectorAll('[data-goal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.goal = btn.getAttribute('data-goal');
        wizard.querySelectorAll('[data-goal]').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        renderStep(2);
      });
    });

    wizard.querySelectorAll('[data-stage]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.stage = btn.getAttribute('data-stage');
        wizard.querySelectorAll('[data-stage]').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const rec = recommendations[state.goal] || recommendations['Site / PWA de Alta Conversão'];
        if (resultTitle) resultTitle.textContent = rec.title;
        if (resultDesc) resultDesc.textContent = rec.desc;

        const msg = `Olá! Fiz o diagnóstico rápido no site da Anauê Design.\n• Objetivo principal: ${state.goal}\n• Momento atual: ${state.stage}\nGostaria de conversar com um especialista.`;
        if (waLink) {
          waLink.href = `https://wa.me/5585996277707?text=${encodeURIComponent(msg)}`;
        }
        renderStep(3);
      });
    });

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (state.step > 1) renderStep(state.step - 1);
      });
    }

    renderStep(1);
  }
});


// 6. Filtros de categoria na página de Blog (V3)
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-filter');
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        blogCards.forEach((card) => {
          const cat = card.getAttribute('data-category');
          card.style.display = (selected === 'all' || cat === selected) ? '' : 'none';
        });
      });
    });
  }
});

// 7. Conformidade LGPD (Banner de Cookies) + Registro do Service Worker (PWA)
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!localStorage.getItem('anaue_cookie_consent')) {
      const banner = document.createElement('aside');
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Consentimento de cookies');
      banner.innerHTML = '<p class="cookie-banner__text">Utilizamos cookies para analisar o tráfego e melhorar sua experiência. Ao continuar, você concorda com nossa <a href="/politica-de-privacidade.html">Política de Privacidade</a>.</p><button class="cookie-banner__btn" type="button">Aceitar e Continuar</button>';
      banner.querySelector('button').addEventListener('click', () => {
        localStorage.setItem('anaue_cookie_consent', 'true');
        banner.classList.remove('is-visible');
        setTimeout(() => banner.remove(), 350);
      });
      document.body.appendChild(banner);
      setTimeout(() => banner.classList.add('is-visible'), 700);
    }
  } catch (e) {}

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
});
