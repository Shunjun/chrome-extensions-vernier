/*
 * @Author 舜君
 * @LastEditTime 2022-01-05 15:30:54
 * @Description
 */
import VNode from "./VNode";

interface MarkSize {
  length: number;
  top: number;
  left: number;
}

type MarkType = "horizontal" | "vertical";

export default class Marker extends VNode {
  dom: HTMLElement;

  infoEle: HTMLElement;

  size: MarkSize;

  type: MarkType;

  style: CSSStyleDeclaration["borderBlockStyle"];

  width: number = 2;

  options: Options = {} as Options;

  constructor(
    type: MarkType,
    size: MarkSize,
    style?: CSSStyleDeclaration["borderBlockStyle"]
  ) {
    super();
    this.type = type;
    this.size = size;
    this.style = style || "solid";
    this.dom = document.createElement("div");
    this.infoEle = document.createElement("div");

    this.init();
  }

  async init() {
    await this.getOptions();
    this.initElement();
    this.updateSize(this.size);
  }

  async getOptions() {
    const { options } = (await chrome.storage.local.get("options")) as {
      options: Options;
    };
    this.options = options;

    if (this.style === "solid") {
      this.width = options.borderWidth || 2;
    } else {
      this.width = options.borderWidth / 2 || 1;
    }
  }

  initElement() {
    const { mainColor = "red", fontSize = "12px" } = this.options;

    this.dom.style.position = "absolute";
    this.dom.style.pointerEvents = "none";
    this.dom.style.fontSize = fontSize;
    this.dom.style.zIndex = "20";

    if (this.type === "horizontal") {
      this.dom.style.transform = "translate(0, -50%)";
    } else {
      this.dom.style.transform = "translate(-50%, 0)";
    }

    // line
    const line = document.createElement("div");
    line.style.margin = "auto";
    line.style.padding = "0";
    line.style.pointerEvents = "none";
    line.style.boxSizing = "content-box";
    line.style.position = "absolute";
    line.style.top = "50%";
    line.style.left = "50%";
    line.style.transform = "translate(-50%, -50%)";

    if (this.type === "horizontal") {
      line.style.height = "0";
      line.style.width = "100%";
      line.style.borderTopWidth = `${this.width}px`;
      line.style.borderTopColor = mainColor;
      line.style.borderTopStyle = this.style;
    } else {
      line.style.width = "0";
      line.style.height = "100%";
      line.style.borderLeftWidth = `${this.width}px`;
      line.style.borderLeftColor = mainColor;
      line.style.borderLeftStyle = this.style;
    }

    this.dom.appendChild(line);

    // info
    this.infoEle.style.position = "absolute";
    this.infoEle.style.pointerEvents = "none";
    this.infoEle.style.backgroundColor = mainColor;
    this.infoEle.style.color = "white";
    this.infoEle.style.padding = "2px 6px";
    this.infoEle.style.borderRadius = "100px";
    this.infoEle.style.fontSize = "0.8em";
    this.infoEle.style.whiteSpace = "nowrap";
    this.infoEle.classList.add("vernier-marker-info");

    if (this.type === "horizontal") {
      this.infoEle.style.top = "-4px";
      this.infoEle.style.left = "50%";
      this.infoEle.style.transform = "translate(-50%, -100%)";
    } else {
      this.infoEle.style.top = "50%";
      this.infoEle.style.right = "-4px";
      this.infoEle.style.transform = "translate(100%, -50%)";
    }
  }

  // 更新尺寸
  updateSize(size: MarkSize) {
    this.size = size;
    const { length, top, left } = size;

    if (this.type === "horizontal") {
      this.dom.style.width = `${length}px`;
      this.dom.style.height = `10px`;
    } else {
      this.dom.style.width = `10px`;
      this.dom.style.height = `${length}px`;
    }

    this.dom.style.top = `${top}px`;
    this.dom.style.left = `${left}px`;

    if (length > 50) {
      this.showArrows(true);
    } else {
      this.showArrows(false);
    }
  }

  // 显示线条箭头
  showArrows(show: boolean) {}

  // 显示数值
  showSize(show: boolean) {
    if (show && this.size.length > 0) {
      this.infoEle.innerText = `${this.size.length}px`;
      this.dom.appendChild(this.infoEle);
    } else {
      this.infoEle.remove();
    }

    return this;
  }
}
