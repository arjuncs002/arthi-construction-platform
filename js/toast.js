/* ============================================================
   Toast notifications — shared across all pages
   ============================================================ */
function showToast(message, type = 'default', icon) {
  const stack = document.getElementById('toast-stack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const defaultIcon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '🔔';
  el.innerHTML = `<span>${icon || defaultIcon}</span><span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 220);
  }, 3200);
}

// Generic handler: any element with data-toast="message" shows a toast on click
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-toast]');
  if (t) {
    e.preventDefault();
    showToast(t.getAttribute('data-toast'));
  }
  const scroller = e.target.closest('[data-scroll]');
  if (scroller) {
    e.preventDefault();
    const targetSel = scroller.getAttribute('data-target') || scroller.getAttribute('href');
    if (targetSel && targetSel.startsWith('#')) {
      const targetEl = document.querySelector(targetSel);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  const closer = e.target.closest('[data-close-modal]');
  if (closer) {
    e.preventDefault();
    closeModal(closer.getAttribute('data-close-modal'));
  }
  // click outside modal content closes it
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}