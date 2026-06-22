import Swiper from 'swiper/bundle';

class ThemeSwiper extends HTMLElement {
  constructor() {
    super();
    this.swiper = null;
    this.thumbSwiper = null;
    this.slider = null;
    this.thumbnail = null;
    this.wrapper = null;
    this.prevButton = null;
    this.nextButton = null;
    this.pagination = null;
    this.scrollbar = null;
    this.selector = '[swiper]';
    this.thumbnailSelector = '[swiper-thumbnail]';
  }

  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    this.destroy();
  }

  init() {
    this.slider = this.matches(this.selector) ? this : this.querySelector(this.selector);
    if (!this.slider || this.slider.swiper) return;

    this.thumbnail = this.querySelector(this.thumbnailSelector);
    this.wrapper = this.slider.querySelector('[swiper-wrapper]');
    this.prevButton = this.slider.querySelector('[swiper-prev]');
    this.nextButton = this.slider.querySelector('[swiper-next]');
    this.pagination = this.slider.querySelector('[swiper-pagination]');
    this.scrollbar = this.slider.querySelector('[swiper-scrollbar]');

    this.prepare(this.slider);

    if (this.thumbnail) {
      this.prepare(this.thumbnail);
      this.thumbSwiper = new Swiper(this.thumbnail, this.options(this.thumbnail, true));
      this.thumbnail.swiper = this.thumbSwiper;
    }

    this.swiper = new Swiper(this.slider, this.options(this.slider));
    this.slider.swiper = this.swiper;
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }

    if (this.thumbSwiper) {
      this.thumbSwiper.destroy(true, true);
      this.thumbSwiper = null;
    }

    if (this.slider) this.slider.swiper = null;
    if (this.thumbnail) this.thumbnail.swiper = null;
  }

  update() {
    if (this.swiper) this.swiper.update();
    if (this.thumbSwiper) this.thumbSwiper.update();
  }

  prepare(slider) {
    slider.classList.add('swiper');

    const wrapper = slider.querySelector('[swiper-wrapper]');
    if (!wrapper) return;

    wrapper.classList.add('swiper-wrapper');
    wrapper.querySelectorAll('[swiper-slide]').forEach((slide) => {
      slide.classList.add('swiper-slide');
    });
  }

  options(slider, isThumbnail = false) {
    const config = {
      slidesPerView: this.value(slider.getAttribute('slides-per-view'), isThumbnail ? 'auto' : 1),
      spaceBetween: this.number(slider.getAttribute('space-between'), isThumbnail ? 8 : 0),
    };

    if (slider.hasAttribute('speed')) config.speed = this.number(slider.getAttribute('speed'), 300);
    if (slider.hasAttribute('loop')) config.loop = slider.getAttribute('loop') === 'true';
    if (slider.hasAttribute('centered-slides')) config.centeredSlides = slider.getAttribute('centered-slides') === 'true';
    if (slider.hasAttribute('free-mode')) config.freeMode = slider.getAttribute('free-mode') === 'true';
    if (slider.hasAttribute('effect')) config.effect = slider.getAttribute('effect') || 'slide';

    if (slider.getAttribute('autoplay') === 'true') {
      config.autoplay = {
        delay: this.number(slider.getAttribute('autoplay-delay'), 3000),
        disableOnInteraction: false,
      };
    }

    if (!isThumbnail && this.thumbSwiper) config.thumbs = { swiper: this.thumbSwiper };
    if (!isThumbnail && slider.getAttribute('navigation') === 'true' && this.prevButton && this.nextButton) {
      config.navigation = { prevEl: this.prevButton, nextEl: this.nextButton };
    }
    if (!isThumbnail && slider.getAttribute('pagination') === 'true' && this.pagination) {
      config.pagination = { el: this.pagination, clickable: true };
    }
    if (!isThumbnail && slider.getAttribute('scrollbar') === 'true' && this.scrollbar) {
      config.scrollbar = { el: this.scrollbar, draggable: true };
    }

    const breakpoints = this.json(slider.getAttribute('breakpoints'));
    if (breakpoints) config.breakpoints = breakpoints;

    return config;
  }

  number(value, fallback) {
    const number = Number(value);
    return value === null || value === '' || Number.isNaN(number) ? fallback : number;
  }

  value(value, fallback) {
    if (value === 'auto') return 'auto';
    return this.number(value, fallback);
  }

  json(value) {
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('Invalid Swiper breakpoints JSON:', error);
      return null;
    }
  }
}

if (!customElements.get('theme-swiper')) {
  customElements.define('theme-swiper', ThemeSwiper);
}

document.addEventListener('shopify:section:load', (event) => {
  const sliders = event.target.matches?.('theme-swiper') ? [event.target] : event.target.querySelectorAll('theme-swiper');
  sliders.forEach((slider) => slider.init());
});

document.addEventListener('shopify:section:unload', (event) => {
  const sliders = event.target.matches?.('theme-swiper') ? [event.target] : event.target.querySelectorAll('theme-swiper');
  sliders.forEach((slider) => slider.destroy());
});

document.addEventListener('shopify:block:select', (event) => {
  event.target.closest('theme-swiper')?.update();
});

document.addEventListener('shopify:block:deselect', (event) => {
  event.target.closest('theme-swiper')?.update();
});
