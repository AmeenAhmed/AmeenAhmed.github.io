// The studio home page: the hero's reel, Benchly's fair-share sum, the price switcher, the one-field
// email and the entrances. Without this script the page still reads in full: the reel shows Pourwell,
// the sum shows 11 players, 7 on the field and 50 minutes, every price shows, and the field opens mail.

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // The reel: while the hero is pinned, scrolling moves the frame on, one app per step.
  const hero = document.querySelector('.hero');
  const reel = hero && hero.querySelector('.reel');
  if (reel) {
    const items = [...reel.children];
    let current = -1;
    const show = (i, force) => {
      if (i === current && !force) return;
      current = i;
      const y = items[i].offsetTop - items[0].offsetTop;
      reel.style.transform = `translateY(${-y}px)`;
      items.forEach((el, k) => el.classList.toggle('is-current', k === i));
    };
    const onScroll = () => {
      const range = hero.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / range)) : 0;
      show(Math.min(items.length - 1, Math.floor(p * items.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => show(Math.max(0, current), true));
    onScroll();
  }

  // Benchly's fair share (apps/benchly/src/lib/lineup.ts): every place on the field for every minute,
  // shared equally among the players who came.
  const fair = document.querySelector('.fair');
  if (fair) {
    const state = { players: 11, field: 7, minutes: 50 };
    const big = fair.querySelector('.fair-big');
    const line = fair.querySelector('.fair-line');
    const steppers = [...fair.querySelectorAll('.stepper')];
    const maxFor = (s) => (s.dataset.key === 'field'
      ? Math.min(Number(s.dataset.max), state.players)
      : Number(s.dataset.max));

    const render = () => {
      state.field = Math.min(state.field, state.players);
      const share = (state.field * state.minutes) / state.players;
      big.textContent = `${Math.round(share)} min`;
      line.textContent = state.field === state.players
        ? `each: everyone plays all ${state.minutes}, with nobody on the bench.`
        : `each, of ${state.minutes}, for ${state.players} players with ${state.field} on the field.`;
      for (const s of steppers) {
        const key = s.dataset.key;
        s.querySelector('output').textContent = state[key];
        s.querySelector('[data-dir="-1"]').disabled = state[key] <= Number(s.dataset.min);
        s.querySelector('[data-dir="1"]').disabled = state[key] >= maxFor(s);
      }
    };

    for (const s of steppers) {
      s.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b || b.disabled) return;
        const key = s.dataset.key;
        const next = state[key] + Number(s.dataset.step) * Number(b.dataset.dir);
        state[key] = Math.min(maxFor(s), Math.max(Number(s.dataset.min), next));
        render();
        big.classList.remove('bump');
        void big.offsetWidth;
        big.classList.add('bump');
      });
    }
    fair.querySelector('.fair-controls').hidden = false;
    render();
  }

  // Prices: choosing an app's name shows its price. Wide screens also follow keyboard focus.
  const plans = [...document.querySelectorAll('.plan')];
  const wide = matchMedia('(min-width: 900px)');
  const open = (plan) => {
    for (const p of plans) {
      const on = p === plan;
      p.classList.toggle('is-open', on);
      p.querySelector('.plan-name').setAttribute('aria-expanded', String(on));
    }
  };
  for (const p of plans) {
    const name = p.querySelector('.plan-name');
    name.addEventListener('click', () => open(p));
    name.addEventListener('focus', () => { if (wide.matches) open(p); });
  }

  // One field: the message goes into a new email in the visitor's own mail app.
  const ask = document.querySelector('.ask');
  if (ask) {
    ask.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = ask.querySelector('input').value.trim();
      const query = `subject=${encodeURIComponent('From cleverapestudio.com')}`
        + (text ? `&body=${encodeURIComponent(text)}` : '');
      window.location.href = `mailto:cleverapestudio@gmail.com?${query}`;
    });
  }

  // The clip plays only while it is on screen, and not at all for people who asked for less motion.
  const clip = document.querySelector('.cell video');
  if (clip) {
    if (reduce.matches) {
      clip.removeAttribute('autoplay');
      clip.pause();
      clip.controls = true;
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) clip.play().catch(() => {});
        else clip.pause();
      }).observe(clip);
    }
  }

  // Entrances: each part arrives once, in reading order with whatever arrives beside it.
  const rising = [...document.querySelectorAll('[data-rise]')];
  if (!('IntersectionObserver' in window)) {
    rising.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    let k = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.style.setProperty('--i', String(Math.min(k++, 6)));
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  rising.forEach((el) => io.observe(el));
})();
