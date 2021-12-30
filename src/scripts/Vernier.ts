/*
 * @Author 舜君
 * @LastEditTime 2021-12-30 16:57:33
 * @Description
 */
import { setStyle, loadCss, setClassName } from "../utils/style";
import throttle from "../utils/throttle";
import once from "../utils/once";

export default class Vernier {
  /**
   * 容器标尺容器
   */
  content!: HTMLElement;

  /**
   * 用于显示当前选框的元素
   */
  currentFrame!: HTMLElement;

  /**
   * 点击产生的选框元素
   */
  clickFrame!: DocumentFragment;

  /**
   * 当前鼠标 hover 的元素
   */
  currentEle?: HTMLElement;

  constructor() {
    this.initElement();
  }

  start() {
    document.body.appendChild(this.currentFrame);
    document.addEventListener("mousemove", this.throttledMouseMove, false);
  }

  stop() {
    document.body.removeChild(this.currentFrame);
    document.removeEventListener("mousemove", this.throttledMouseMove, false);
  }

  /**
   * 鼠标移动事件
   * @param e
   * @returns
   */
  onMouseMove(e: MouseEvent) {
    const target = e.target;

    if (!target || target === this.currentEle) {
      return;
    }

    this.currentEle = target as HTMLElement;
    const currentEle = this.currentEle;

    const height = currentEle.offsetHeight;
    const width = currentEle.offsetWidth;
    const [top, left] = this.elementRelativelyBody(currentEle);

    const currentStyle = {
      height: `${height}px`,
      width: `${width}px`,
      top: `${top}px`,
      left: `${left}px`,
    };

    setStyle(this.currentFrame, currentStyle);

    once(this.currentEle, "click", this.onElementClick);
  }

  // 节流鼠标移动事件
  throttledMouseMove = throttle(this.onMouseMove, 200).bind(this);

  /**
   * 初始化用到的元素
   */
  initElement() {
    // 加载 css 样式表
    const url = chrome.runtime.getURL("style/frame.css");
    loadCss(url);

    this.createCurrentFrame();
    this.createClickFrame();
  }

  /**
   * 创建当前鼠标框
   */
  createCurrentFrame() {
    this.currentFrame = document.createElement("div");
    setClassName(this.currentFrame, "vernier-current-frame-base");
  }

  /**
   * 创建点击选中框
   */
  createClickFrame() {
    this.clickFrame = document.createDocumentFragment();

    const frame = document.createElement("div");
    setClassName(frame, "vernier-click-frame-base");

    // 横竖标尺
    const widthRuler = document.createElement("div");
    const heightRuler = document.createElement("div");
    setClassName(widthRuler, "vernier-ruler-base");
    setClassName(heightRuler, "vernier-ruler-base");

    setClassName(widthRuler, "vernier-ruler-width");
    setClassName(heightRuler, "vernier-ruler-height");

    frame.append(widthRuler, heightRuler);

    this.clickFrame.append(frame);
  }

  /**
   * 点击
   * @param e
   */
  onElementClick(e: MouseEvent) {
    e.preventDefault();
  }

  /**
   * 获取元素到根节点的距离
   * @param ele
   * @returns
   */
  elementRelativelyBody(ele: HTMLElement): [number, number] {
    const parent = ele.offsetParent;
    if (parent === null) {
      return [ele.offsetTop, ele.offsetLeft];
    }
    const [top, left] = this.elementRelativelyBody(parent as HTMLElement);
    return [top + ele.offsetTop, left + ele.offsetLeft];
  }
}

function showSelfSize(ele: HTMLElement) {
  const widthSizeDiv = document.createElement("div");

  const style = {
    "": "",
  };

  setStyle(widthSizeDiv, style);
}

function hideSelfSize() {}
