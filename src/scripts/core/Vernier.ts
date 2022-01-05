/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 23:24:02
 * @Description
 */
import throttle from "../../utils/throttle";
import Rect from "../core/Rect";
import Placeholder from "../elements/Placeholder";
import Container from "../elements/Container";
import preventPageScroll from "../helper/preventPageScroll";
import Marker from "../elements/Marker";
import calculateMarkers from "../helper/calculateMarkers";

export default class Vernier {
  /**
   *
   */
  private active: boolean = false;

  /**
   * 容器标尺容器
   */
  private container!: Container;

  /**
   * 用于显示当前选框的元素
   */
  private placeholder!: Placeholder;

  /**
   * 鼠标当前选择的元素
   */
  private currentholder: Placeholder;

  /**
   * 标尺
   */
  private markers: Marker[] = [];

  /**
   * 当前鼠标 hover 的元素
   */
  private targetEle?: HTMLElement;

  /**
   * 起始选择的元素
   */
  private selectedEle?: HTMLElement;

  /**
   * 设置项
   */
  private options: Options = {} as Options;

  constructor() {
    this.container = new Container();
    this.placeholder = new Placeholder("placeholder");
    this.currentholder = new Placeholder("currentholder");
    this.currentholder.showSelfInfo();
    this.container.appendChild(this.currentholder);
  }

  async start() {
    if (!document.body) {
      console.warn(`Unable to initialise, document.body does not exist.`);
      return;
    }
    document.body.appendChild(this.container.dom);

    /**
     * 启动后缓存设置项, 修改设置后需要重启
     */
    const { options } = await chrome.storage.local.get("options");
    this.options = options || {};

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
    document.addEventListener("mousemove", this.throttledMouseMove, false);
  }

  async stop() {
    this.container.dom.remove();
    this.clearUp();

    document.removeEventListener("keydown", this.onKeyDown.bind(this));
    document.removeEventListener("keyup", this.onKeyUp.bind(this));
    document.removeEventListener("mousemove", this.throttledMouseMove, false);
  }

  // 重启
  async restart() {
    await this.stop();
    await this.start();
  }

  onKeyDown(e: KeyboardEvent) {
    const { shortcutKeys } = this.options;
    const catchKey = shortcutKeys?.catch || "alt";

    if (!this.targetEle) return;

    if (e.key.toLocaleLowerCase() === catchKey) {
      preventPageScroll(true);

      // 保存选择的原始元素
      this.selectedEle = this.targetEle;

      const DOMRect = this.targetEle?.getBoundingClientRect();
      const rect = new Rect(DOMRect);

      this.placeholder.updateRect(rect);
      this.placeholder.showSelfInfo();

      this.container.appendChild(this.placeholder);

      this.active = true;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    const { shortcutKeys } = this.options;
    const catchKey = shortcutKeys?.catch || "alt";

    if (e.key.toLocaleLowerCase() === catchKey) {
      preventPageScroll(false);

      this.clearUp();

      this.active = false;
    }
  }

  /**
   * 鼠标移动事件
   * @param e
   * @returns
   */
  onMouseMove(e: MouseEvent) {
    const target = e.target as HTMLElement;

    // 鼠标没有切换元素
    if (!target || target === this.targetEle) return;

    this.targetEle = target as HTMLElement;

    // 鼠标在原始元素上
    if (target === this.selectedEle) {
      this.currentholder.remove();
      this.clearMarkers();
      return;
    }

    if (this.active) {
      const exictCurrentholder =
        this.container.dom.querySelector("#currentholder");

      if (!exictCurrentholder) {
        this.container.appendChild(this.currentholder);
      }

      const DOMRect = target.getBoundingClientRect();
      const rect = new Rect(DOMRect);

      this.currentholder.updateRect(rect);

      this.renderMarkers();
    }
  }

  // 节流鼠标移动事件
  throttledMouseMove = throttle(this.onMouseMove, 100).bind(this);

  renderMarkers() {
    if (!this.placeholder.rect || !this.currentholder.rect) {
      return;
    }

    // 清除旧标尺
    this.clearMarkers();

    this.markers.push(
      ...calculateMarkers(this.placeholder.rect, this.currentholder.rect)
    );

    this.markers.forEach((marker) => {
      this.container.appendChild(marker);
    });
  }

  // 清除标线
  clearMarkers() {
    this.markers.forEach((marker) => {
      marker.remove();
    });
    this.markers.length = 0;
  }

  // 全部清除
  clearUp() {
    this.clearMarkers();
    this.placeholder.remove();
    this.currentholder.remove();
  }
}
