/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 13:10:19
 * @Description
 */
/**
 * 获取元素到根节点的距离
 * @param ele
 * @returns
 */
export default function elementRelativelyBody(
  ele: HTMLElement
): [number, number] {
  const parent = ele.offsetParent;
  if (parent === null) {
    return [ele.offsetTop, ele.offsetLeft];
  }
  const [top, left] = elementRelativelyBody(parent as HTMLElement);
  return [top + ele.offsetTop, left + ele.offsetLeft];
}
