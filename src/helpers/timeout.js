export const abortableSetTimeout = (callback, timeout, signal) => {
  const timer = setTimeout(() => {
    callback();
    signal.removeEventListener("abort", clear);
    clear();
  }, timeout);

  const clear = () => {
    clearTimeout(timer);
  };

  signal.addEventListener("abort", clear);
};
