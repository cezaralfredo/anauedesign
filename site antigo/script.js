/**
 * Anauê Design - Script compartilhado
 */
document.addEventListener('DOMContentLoaded', function() {
  // 1. Header scroll effect
  const header = document.querySelector('.hd');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 40) {
        header.classList.add('hd--scrolled');
      } else {
        header.classList.remove('hd--scrolled');
      }
    }, { passive: true });
  }

  // 2. Destacar link ativo na navegação
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.hd__nav a, .ft__col a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href !== '/' && currentPath.includes(href)))) {
      link.classList.add('is-active');
    }
  });

  // 3. Suporte a menu mobile toggle
  const mobileToggle = document.querySelector('.hd__toggle, .hd__mobile-toggle');
  const nav = document.querySelector('.hd__nav');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
        nav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Fechar ao clicar em um link
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', function() {
        nav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Fechar FAQ ao abrir outro (modo accordion elegante)
  const faqDetails = document.querySelectorAll('.cs-faq__item, .ia-faq__item, .md-faq__item, .seo-faq__item, .hp-faq__item, .home-faq__item');
  faqDetails.forEach(detail => {
    detail.addEventListener('toggle', function() {
      if (detail.open) {
        faqDetails.forEach(other => {
          if (other !== detail && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });

  // 5. Carrossel de depoimentos (quando presente na página)
  const carousel = document.querySelector('.dep__carousel');
  if (carousel) {
    const track = carousel.querySelector('.dep__track');
    const prev = carousel.querySelector('.dep__nav--prev');
    const next = carousel.querySelector('.dep__nav--next');
    const dots = carousel.parentElement ? carousel.parentElement.querySelectorAll('.dep__dot') : [];
    const cards = track ? track.querySelectorAll('.dep__card') : [];
    let idx = 0;

    function go(n) {
      if (!cards.length || !track) return;
      idx = (n + cards.length) % cards.length;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dots.forEach((d, i) => { d.classList.toggle('is-active', i === idx); });
    }

    if (prev) prev.addEventListener('click', () => go(idx - 1));
    if (next) next.addEventListener('click', () => go(idx + 1));
    dots.forEach((d, i) => { d.addEventListener('click', () => go(i)); });

    let autoplay = setInterval(() => go(idx + 1), 5500);
    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', () => { autoplay = setInterval(() => go(idx + 1), 5500); });
  }

  // 6. Conformidade LGPD - Banner de Consentimento de Cookies
  try {
    const consent = localStorage.getItem('anaue_cookie_consent');
    if (!consent) {
      const banner = document.createElement('aside');
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Consentimento de cookies');

      const text = document.createElement('p');
      text.className = 'cookie-banner__text';
      text.innerHTML = 'Utilizamos cookies para analisar o tráfego e melhorar sua experiência. Ao continuar, você concorda com nossa <a href="/politica-de-privacidade.html">Política de Privacidade</a>.';

      const actions = document.createElement('div');
      actions.className = 'cookie-banner__actions';

      const btn = document.createElement('button');
      btn.className = 'cookie-banner__btn';
      btn.textContent = 'Aceitar e Continuar';
      btn.addEventListener('click', function() {
        localStorage.setItem('anaue_cookie_consent', 'true');
        banner.classList.remove('is-visible');
        setTimeout(() => banner.remove(), 400);
      });

      actions.appendChild(btn);
      banner.appendChild(text);
      banner.appendChild(actions);
      document.body.appendChild(banner);

      setTimeout(() => banner.classList.add('is-visible'), 600);
    }
  } catch (e) {
    // LocalStorage bloqueado em navegação restrita
  }

  // 7. Registro do Service Worker (PWA)
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function() {
          // SW registrado com sucesso
        })
        .catch(function(err) {
          console.warn('Falha no registro do Service Worker:', err);
        });
    });
  }
});
