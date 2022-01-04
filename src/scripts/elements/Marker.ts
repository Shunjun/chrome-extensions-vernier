/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 15:56:01
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

  size: MarkSize;

  type: MarkType;

  constructor(type: MarkType, size: MarkSize) {
    super();
    this.type = type;
    this.size = size;
    this.dom = document.createElement("div");

    this.initElement();
    this.updateSize(size);
  }

  async initElement() {
    const { options } = (await chrome.storage.local.get("options")) as {
      options: Options;
    };
    const { borderWidth = 1, mainColor = "red" } = options || {};

    this.dom.style.position = "absolute";
    this.dom.style.pointerEvents = "none";

    const line = document.createElement("div");
    line.style.margin = "auto";
    line.style.padding = "0";
    line.style.pointerEvents = "none";
    line.style.boxSizing = "border-box";
    line.style.backgroundColor = mainColor;

    if (this.type === "horizontal") {
      line.style.height = `${borderWidth}px`;
      line.style.width = "100%";
    } else {
      line.style.width = `${borderWidth}px`;
      line.style.height = "100%";
    }

    this.dom.appendChild(line);
  }

  // 显示线条箭头
  showArrows(show: boolean) {}

  updateSize(size: MarkSize) {
    this.size = size;

    const { length, top, left } = this.size;

    if (this.type === "horizontal") {
      this.dom.style.width = `${length}px`;
      this.dom.style.height = `5px`;
    } else {
      this.dom.style.width = `5px`;
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

  // 显示数值
  showSize(show: boolean) {}
}
