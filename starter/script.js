"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");

const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const allSections = document.querySelectorAll(".section");

const section1 = document.querySelector("#section--1");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Creating a cookie element
const message = document.createElement("div");
message.classList.add("cookie-message");
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
message.style.position = "sticky";
message.style.top = "calc(100vh - 79px)";
message.style.zIndex = "100";
header.after(message);
message.style.height =
  Number.parseInt(getComputedStyle(message).height, 10) + 30 + "px";

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

// Learn more button
btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

// Navigation links (using event delegation)
// 1. add event listener to common parent element
// 2. determine waht element originate the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // matching strategy
  try {
    if (e.target.classList.contains("nav__link")) {
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  } catch (err) {}
});

// Tabbed component
tabsContainer.addEventListener("click", function (e) {
  // gets the operation__tab button even if user clicks on the span element
  const clicked = e.target.closest(".operations__tab");

  // if the user clickes outside of the component, return and not run this function
  if (!clicked) return;

  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu fade animation
const handleHover = function (e, op) {
  if (e.target.classList.contains("nav__link")) {
    const navLink = e.target;
    const siblings = navLink.closest(".nav").querySelectorAll(".nav__link");
    const logo = navLink.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== navLink) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

// sticky navigationusing Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };

// // const obsOptions = {
// //   root: null,
// //   threshold: [0, 0.2], // when observer insersects with root and  >= 10% is visible, can use arrays to track multiple intersections (such as when observed section is 0 and then >= 20%)
// // };

// // const observer = new IntersectionObserver(obsCallback, obsOptions);
// // observer.observe(section1); // target element

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reaveal sections
const reavealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(reavealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
let currSlide = 0;
const maxSlide = slides.length;

const dotContainer = document.querySelector(".dots");

// creates the dots for the amount of slides
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (activeSlide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${activeSlide}"]`)
    .classList.add("dots__dot--active");
};

//go to slide
const goToSlide = function (slide) {
  // s for slide i for index
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

// next slide
const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  goToSlide(currSlide);
  activateDot(currSlide);
};

// previous slide
const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }

  goToSlide(currSlide);
  activateDot(currSlide);
};

const init = function () {
  createDots();
  goToSlide(0);
  activateDot(0);
};

init();

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    currSlide = Number(e.target.dataset.slide);
    goToSlide(currSlide);
    activateDot(currSlide);
  }
});
