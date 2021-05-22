function raf(fn) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}
