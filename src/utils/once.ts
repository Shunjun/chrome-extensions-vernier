/*
 * @Author 舜君
 * @LastEditTime 2021-12-30 13:28:31
 * @Description
 */

/**
 * 绑定事件执行一次
 * @param ele
 * @param type
 * @param handler
 * @param optons
 */
export default function once<K extends keyof HTMLElementEventMap>(
  ele: HTMLElement,
  type: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  ...optons: any[]
) {
  ele.addEventListener(
    type,
    function fn(this: HTMLElement, e: HTMLElementEventMap[K]) {
      handler.call(this, e);
      ele.removeEventListener(type, fn, ...optons);
    },
    ...optons
  );
}
