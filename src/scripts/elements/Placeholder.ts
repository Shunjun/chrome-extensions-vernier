/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 14:13:20
 * @Description
 */

import Rect from "../Rect";
import VNode from "./VNode";

// function create

export default class Placeholder extends VNode {
  dom: HTMLDivElement;

  infoVisible: boolean = false;

  infoContainer: HTMLDivElement;

  infoMap: Record<string, HTMLDivElement> = {};

  rect?: Rect;

  constructor(key: string) {
    super();

    this.dom = document.createElement("div");
    this.dom.id = key;
    this.initElement();

    this.infoContainer = document.createElement("div");
    this.initInfoContainer();
  }

  async initElement() {
    const { options } = await chrome.storage.local.get("options");
    const { mainColor = "red", borderWidth = 1 } = options || {};

    this.dom.style.position = "fixed";
    this.dom.style.pointerEvents = "none";
    this.dom.style.boxSizing = "border-box";
    this.dom.style.zIndex = "10";
    this.dom.style.border = `${borderWidth}px solid ${mainColor}`;
  }

  /**
   * 设置矩形的尺寸
   */
  updateRect(rect: Rect) {
    this.dom.style.width = `${rect.width}px`;
    this.dom.style.height = `${rect.height}px`;
    this.dom.style.top = `${rect.top}px`;
    this.dom.style.left = `${rect.left}px`;

    this.rect = rect;

    this.showSize();
  }

  async initInfoContainer() {
    const { options } = await chrome.storage.local.get("options");
    const { mainColor = "red", borderWidth = 1 } = options || {};

    this.infoContainer.style.position = "absolute";
    this.infoContainer.style.top = `-${borderWidth}px`;
    this.infoContainer.style.left = `-${borderWidth}px`;
    this.infoContainer.style.transform = "translate(0, -100%)";

    this.infoContainer.id = "infoContainer";
    this.infoContainer.style.backgroundColor = mainColor;
  }

  async showSelfInfo() {
    if (this.infoVisible === true) return;
    this.dom.appendChild(this.infoContainer);
    this.infoVisible = true;
  }

  async hideSelfInfo() {
    if (this.infoVisible === false) return;
    this.infoContainer.remove();
    this.infoVisible = false;
  }

  showSize() {
    if (this.rect) {
      const { width, height } = this.rect;
      this.setInfo("size", `${width.toFixed(0)}px × ${height.toFixed(0)}px`);
    }
  }

  async setInfo(key: string, info: string) {
    let infoEle = this.infoMap[key];
    // 不存在则创建
    if (!infoEle) {
      // 查找页面中是否已经存在
      const existInfoEle: HTMLDivElement | null =
        this.infoContainer.querySelector("#" + key);

      if (existInfoEle) {
        infoEle = existInfoEle;
      } else {
        infoEle = await this.createInfoEle(key);
        this.infoContainer.appendChild(infoEle);
      }
      this.infoMap[key] = infoEle;
    }

    infoEle.innerText = info;
  }

  removeInfo(key: string) {
    if (!(key in this.infoMap)) return;

    const infoEle = this.infoMap[key];
    infoEle.remove();

    delete this.infoMap[key];
  }

  private async createInfoEle(key: string) {
    const { options } = await chrome.storage.local.get("options");
    const { fontSize = "12px" } = options || {};

    const infoEle = document.createElement("div");
    infoEle.style.fontSize = fontSize;
    infoEle.style.color = "white";
    infoEle.style.padding = "5px";
    infoEle.style.whiteSpace = "nowrap";

    infoEle.id = key;

    return infoEle;
  }
}
