/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 22:39:26
 * @Description
 *
 * 阻止页面滚动
 */
export default function preventPageScroll(active: boolean): void {
  if (active) {
    document.addEventListener("DOMMouseScroll", scrollingPreventDefault, false);
    document.addEventListener("wheel", scrollingPreventDefault, {
      passive: false,
    });
    document.addEventListener("mousewheel", scrollingPreventDefault, {
      passive: false,
    });
  } else {
    document.removeEventListener("DOMMouseScroll", scrollingPreventDefault);
    document.removeEventListener("wheel", scrollingPreventDefault);
    document.removeEventListener("mousewheel", scrollingPreventDefault);
  }
}

function scrollingPreventDefault(e: Event): void {
  e.preventDefault();
}
