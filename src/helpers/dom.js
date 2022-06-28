const TRIGGER_SPEED = -1.5;

export const getScrollPositionInPercentage = () => {
  if (document.body.offsetHeight === window.innerHeight) {
    return 100;
  }
  return Math.floor(
    (window.scrollY / (document.body.offsetHeight - window.innerHeight)) * 100
  );
};

export const fastScrollingTop = (calback) => {
  let lastScrollPosition = window.scrollY;
  let lastDate = new Date().getTime();
  return (event) => {
    const currentScrollPosition = window.scrollY;
    const timePassedFromLastEvent = event.timeStamp - lastDate;
    const offset = currentScrollPosition - lastScrollPosition;
    const speed = offset / timePassedFromLastEvent;
    if (speed < TRIGGER_SPEED) {
      calback();
    }

    lastDate = event.timeStamp;
    lastScrollPosition = currentScrollPosition;
  };
};

export const isTouchDevice = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
