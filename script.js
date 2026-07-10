// Riccio di Marketing — site behavior (scroll reveal, parallax, carousel, case modal, contact form)
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar + hero parallax
  var progress = document.getElementById('scroll-progress');
  var heroVideo = document.getElementById('hero-video');
  var heroGlow = document.getElementById('hero-glow');
  var ticking = false;

  function updateOnScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct.toFixed(1) + '%';

    if (!reduceMotion && heroVideo) {
      var y = h.scrollTop;
      if (y < window.innerHeight * 1.1) {
        heroVideo.style.transform = 'translateY(' + (y * 0.25) + 'px)';
        if (heroGlow) heroGlow.style.transform = 'translateY(' + (y * 0.12) + 'px)';
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll('[data-reveal]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-shown', 'true');
        var counters = entry.target.querySelectorAll('[data-countup]');
        counters.forEach(runCountUp);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { observer.observe(el); });

  // Count-up animation for numeric stats
  function runCountUp(el) {
    var target = parseInt(el.getAttribute('data-countup'), 10);
    if (reduceMotion || isNaN(target)) {
      el.textContent = target;
      return;
    }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  // Services carousel
  var viewport = document.getElementById('services-viewport');
  var track = document.getElementById('services-track');
  var dots = Array.prototype.slice.call(document.querySelectorAll('.svc-dot'));
  var prevBtn = document.getElementById('svc-prev');
  var nextBtn = document.getElementById('svc-next');
  var slideCount = track.children.length;
  var index = 0;

  function renderCarousel() {
    track.style.transform = 'translateX(' + (index * -100) + '%)';
    viewport.style.height = track.children[index].offsetHeight + 'px';
    dots.forEach(function (d, i) {
      d.setAttribute('data-dot', i === index ? 'true' : 'false');
    });
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slideCount - 1;
  }

  window.addEventListener('resize', function () {
    viewport.style.height = track.children[index].offsetHeight + 'px';
  });

  prevBtn.addEventListener('click', function () {
    index = Math.max(0, index - 1);
    renderCarousel();
  });
  nextBtn.addEventListener('click', function () {
    index = Math.min(slideCount - 1, index + 1);
    renderCarousel();
  });
  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      index = parseInt(d.getAttribute('data-i'), 10);
      renderCarousel();
    });
  });
  renderCarousel();

  // Case modal
  var caseData = {
    'case-arbora': {
      segment: 'Higiene sustentável',
      client: 'Árbora',
      result: 'Identidade visual completa',
      detail: 'A Árbora é uma marca de higiene sustentável que transforma o autocuidado em cuidado com o planeta. A marca torna soluções de baixo impacto acessíveis, combinando ciência, design e logística circular — com transparência, cuidado humano, ética e diversidade.',
    },
    'case-canto-do-rio': {
      segment: 'Hotelaria',
      client: 'Hotel Canto do Rio',
      result: '+29% de crescimento no 1º mês',
      detail: 'Gerenciamos as redes sociais do Hotel Canto do Rio com conteúdo e estratégia. No primeiro mês: crescimento de 29% frente ao mês anterior, 58% das visualizações vindas de não seguidores, +35% de alcance e +282 novos seguidores (base de 15 mil) — tudo 100% orgânico, sem tráfego pago, com apenas 6 publicações no feed.',
    },
  };

  var modal = document.getElementById('case-modal');
  var modalInner = document.getElementById('case-modal-inner');
  var modalSegment = document.getElementById('case-modal-segment');
  var modalClient = document.getElementById('case-modal-client');
  var modalResult = document.getElementById('case-modal-result');
  var modalDetail = document.getElementById('case-modal-detail');
  var modalClose = document.getElementById('case-modal-close');

  function openCase(id) {
    var c = caseData[id];
    if (!c) return;
    modalSegment.textContent = c.segment;
    modalClient.textContent = c.client;
    modalResult.textContent = c.result;
    modalDetail.textContent = c.detail;
    modal.style.display = 'flex';
  }
  function closeCase() {
    modal.style.display = 'none';
  }

  document.querySelectorAll('.case-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openCase(card.getAttribute('data-case'));
    });
  });
  modal.addEventListener('click', closeCase);
  modalInner.addEventListener('click', function (e) { e.stopPropagation(); });
  modalClose.addEventListener('click', closeCase);

  // Contact form -> WhatsApp
  var form = document.getElementById('contact-form');
  var sentMsg = document.getElementById('form-sent-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements['name'].value;
    var email = form.elements['email'].value;
    var msg = form.elements['msg'].value;
    var text = encodeURIComponent('Ola! Meu nome e ' + name + ' (' + email + '). ' + msg);
    window.open('https://wa.me/5511930199061?text=' + text, '_blank');
    form.style.display = 'none';
    sentMsg.style.display = 'block';
  });
})();
