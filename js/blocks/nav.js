export function startScrollSpy(ids) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      document.querySelectorAll('.bar nav a').forEach(a =>
        a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  // Pin the section's top edge (scroll-margin-top in layout.css clears the floating nav).
  // No explicit behavior, so it follows html's scroll-behavior (smooth, or instant for reduced motion).
  document.querySelectorAll('.bar a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      const el = document.getElementById(a.hash.slice(1));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ block: 'start' });
      history.pushState(null, '', a.hash);
    }));

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}
