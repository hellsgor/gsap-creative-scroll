import '../../node_modules/modern-normalize/modern-normalize.css';
import '../scss/style.scss';

import { gsap } from 'gsap-trial';
import { ScrollTrigger, ScrollSmoother } from 'gsap-trial/all';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  wrapper: '.smooth-wrapper',
  content: '.smooth-content',
  smooth: 3,
  effects: true,
});

gsap.fromTo(
  '.hero',
  { opacity: 1 },
  { opacity: 0, scrollTrigger: { trigger: '.hero', start: 'top', end: 'bottom', scrub: true } },
);

moveItemsParent('.gallery__side_left .gallery__item', 'fromLeftToRight');

function moveItemsParent(selector, direction) {
  document.querySelectorAll(selector).forEach((item) => moveItems(item, direction));
}

function moveItems(item, direction) {
  const xMove = direction === 'fromLeftToRight' ? -700 : 700;

  gsap.fromTo(
    item,
    { opacity: 0, x: xMove },
    { opacity: 1, x: 0, scrollTrigger: { trigger: item, scrub: true, start: 500, end: 'center' } },
  );
}
