/*
 * @Author 舜君
 * @LastEditTime 2021-12-30 11:13:00
 * @Description
 */
export default function throttle(func: (...args: any[]) => any, wait: number) {
  let timer: number | undefined;
  return function (this: any, ...args: any[]) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      timer = undefined;
      return func.call(this, ...args);
    }, wait) as unknown as number;
  };
}
