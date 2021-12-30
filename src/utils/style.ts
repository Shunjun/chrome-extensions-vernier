/*
 * @Author 舜君
 * @LastEditTime 2021-12-30 16:54:28
 * @Description
 */
export function setStyle(dom: HTMLElement, style: Record<string, any>) {
  if (!("style" in dom)) {
    throw new Error(`${dom} is not a DOM element`);
  }

  Object.keys(style).forEach((key) => {
    if (style.hasOwnProperty(key)) {
      const value = style[key];
      dom.style.setProperty(key, value);
    }
  });
}

/**
 * 加载 css 样式表
 * @param url
 */
export function loadCss(url: string) {
  const link = document.createElement("link");
  // link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  link.crossOrigin = "anonymous";
  const head = document.getElementsByTagName("head")[0];
  head.append(link);
}

/**
 * 设置元素类名
 * @param dom
 * @param className
 */
export function setClassName(dom: HTMLElement, className: string) {
  if (!("style" in dom)) {
    throw new Error(`${dom} is not a DOM element`);
  }
  if (Array.prototype.includes.call(dom.classList, className)) {
    return;
  }
  dom.classList.add(className);
}
