/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 03:12:29
 * @Description
 */

import VNode from "./VNode";

export default class Container extends VNode {
  dom: HTMLDivElement;

  constructor() {
    super();
    this.dom = document.createElement("div");
    this.initElement();
  }

  initElement() {
    this.dom.style.position = "fixed";
    this.dom.style.top = "0px";
    this.dom.style.left = "0px";
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";
    this.dom.style.zIndex = "99999";
    this.dom.style.pointerEvents = "none";
  }
}
