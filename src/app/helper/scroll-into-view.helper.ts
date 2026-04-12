export function scrollIntoViewHelper(target: HTMLElement) {
  if (window.innerWidth < 768) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
}
