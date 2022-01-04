/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 14:37:49
 * @Description
 */
export default abstract class VNode {
  abstract dom: HTMLElement;

  appendChild(child: VNode) {
    this.dom.appendChild(child.dom);
  }

  remove() {
    this.dom.remove();
  }
}
