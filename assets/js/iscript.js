/* ======================== Navbar Toggle ======================== */
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
}

/* ======================== Scroll Reveal ======================== */
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 50) {
      el.classList.add('show');
    }
  });
}
revealOnScroll();
window.addEventListener('scroll', revealOnScroll);

/* ======================== Contact Form ======================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    contactForm.reset();
  });
}

/* ======================== Services Slider ======================== */
const track = document.querySelector('.services-track');
const cards = Array.from(document.querySelectorAll('.services-track .service-card'));
const dotsContainer = document.querySelector('.slider-dots');

if (track && cards.length && dotsContainer) {
  let currentSlide = 0;
  let cardsPerView = 3;

  function updateCardsPerView() {
    const width = window.innerWidth;
    if (width <= 600) cardsPerView = 1;
    else if (width <= 992) cardsPerView = 2;
    else cardsPerView = 3;

    const trackWidth = track.offsetWidth;
    const cardWidth = trackWidth / cardsPerView - 20;
    cards.forEach(card => card.style.flex = `0 0 ${cardWidth}px`);

    createDots();
    moveToSlide(0);
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function moveToSlide(index) {
    currentSlide = index;
    const cardWidth = cards[0].getBoundingClientRect().width + 20;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    dotsContainer.querySelectorAll('button')
      .forEach((dot, idx) => dot.classList.toggle('active', idx === index));
  }

  window.addEventListener('resize', updateCardsPerView);
  updateCardsPerView();
}

/* ======================== Accessories Slider ======================== */
const slides = document.querySelectorAll('.accessories-item');
const dotsContainerAcc = document.querySelector('.accessories-nav');
let currentAccessory = 0;

if (slides.length && dotsContainerAcc) {
  dotsContainerAcc.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showAccessorySlide(i));
    dotsContainerAcc.appendChild(dot);
  });
}

const dotsAcc = dotsContainerAcc ? dotsContainerAcc.querySelectorAll('.dot') : [];

function showAccessorySlide(index) {
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  dotsAcc.forEach((dot, i) => dot.classList.toggle('active', i === index));
  currentAccessory = index;
  adjustAccessoryImageHeight();
}

function adjustAccessoryImageHeight() {
  const activeSlide = document.querySelector('.accessories-item.active');
  if (!activeSlide) return;
  const left = activeSlide.querySelector('.accessories-left');
  const img = activeSlide.querySelector('.accessories-right img');
  if (left && img && window.innerWidth > 992) img.style.height = `${left.offsetHeight}px`;
  else if (img) img.style.height = 'auto';
}

window.addEventListener('load', () => showAccessorySlide(0));
window.addEventListener('resize', adjustAccessoryImageHeight);

/* ======================== Swiper Slider ======================== */
const swiper = new Swiper(".mySwiper", {
  loop: true,
  centeredSlides: true,
  slidesPerView: 1.1,
  spaceBetween: 16,
  pagination: { el: ".swiper-pagination", clickable: true },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  breakpoints: {
    600: { slidesPerView: 2, spaceBetween: 20 },
    992: { slidesPerView: 3, spaceBetween: 30 }
  },
  on: {
    init: function () { setInitialZoom(this); },
    slideChangeTransitionStart: function () { setInitialZoom(this); }
  }
});

function setInitialZoom(sw) {
  sw.slides.forEach(slide => {
    slide.style.transform = "scale(0.9)";
    slide.style.opacity = "0.6";
    slide.style.zIndex = "1";
  });
  const active = sw.slides[sw.activeIndex];
  if (active) {
    active.style.transform = "scale(1.2)";
    active.style.opacity = "1";
    active.style.zIndex = "3";
  }
  const prev = sw.slides[sw.activeIndex - 1];
  const next = sw.slides[sw.activeIndex + 1];
  if (prev) { prev.style.transform = "scale(0.95)"; prev.style.opacity = "0.8"; prev.style.zIndex = "2"; }
  if (next) { next.style.transform = "scale(0.95)"; next.style.opacity = "0.8"; next.style.zIndex = "2"; }
}

/* ======================== Stallion Slider (Mobile Only) ======================== */
function initStallionNav(sectionSelector, dashChar = '–') {
  const slider = document.querySelector(`${sectionSelector} .stallion-slider`);
  const nav = document.querySelector(`${sectionSelector} .stallion-nav`);
  if (!slider || !nav) return;

  function isMobile() { return window.innerWidth <= 768; }

  function createNav() {
    const cards = Array.from(slider.querySelectorAll('.stallion-card'));
    nav.innerHTML = '';
    if (!isMobile() || !cards.length) {
      nav.style.display = 'none';
      slider.style.transform = 'translateX(0)';
      return;
    }
    nav.style.display = 'block';
    cards.forEach((_, i) => {
      const dash = document.createElement('span');
      dash.textContent = dashChar;
      if (i === 0) dash.classList.add('active');
      dash.addEventListener('click', () => {
        const cardWidth = slider.querySelector('.stallion-card').offsetWidth + 15;
        slider.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
      });
      nav.appendChild(dash);
    });
  }

  slider.addEventListener('scroll', () => {
    if (!isMobile()) return;
    const cardWidth = slider.querySelector('.stallion-card').offsetWidth + 15;
    let idx = Math.round(slider.scrollLeft / cardWidth);
    const cards = Array.from(slider.querySelectorAll('.stallion-card'));
    if (idx >= cards.length) idx = cards.length - 1;
    nav.querySelectorAll('span').forEach((s, i) => s.classList.toggle('active', i === idx));
  });

  window.addEventListener('resize', createNav);
  // 🔥 Rebuild nav after JSON injection
  window.addEventListener('cardsInjected', createNav);

  createNav();
}

// Init for each section
initStallionNav('.top-stallions', '–');
initStallionNav('.new-home-horses', '_');
initStallionNav('.more-pets', '_');
