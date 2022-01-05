/*
 * @Author 舜君
 * @LastEditTime 2022-01-05 13:35:46
 * @Description
 */
export default class Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;

  constructor(rect: DOMRect) {
    this.top = rect.top;
    this.left = rect.left;
    this.width = rect.width;
    this.height = rect.height;
    this.right = rect.right;
    this.bottom = rect.bottom;
  }

  // 相交
  colliding(other: Rect) {
    return !(
      this.top > other.bottom ||
      this.right < other.left ||
      this.bottom < other.top ||
      this.left > other.right
    );
  }

  // 包含
  containing(other: Rect) {
    return (
      this.left <= other.left &&
      other.left < this.width &&
      this.top <= other.top &&
      other.top < this.height
    );
  }

  // 在内部
  inside(other: Rect) {
    return (
      other.top <= this.top &&
      this.top <= other.bottom &&
      other.top <= this.bottom &&
      this.bottom <= other.bottom &&
      other.left <= this.left &&
      this.left <= other.right &&
      other.left <= this.right &&
      this.right <= other.right
    );
  }

  // 当前 rect 在 other rect 的上方
  onTop(other: Rect) {
    return this.top < other.top && this.bottom <= other.top;
  }

  // 当前 rect 在 other rect 的左方
  onLeft(other: Rect) {
    return this.left < other.left && this.right <= other.left;
  }

  // 当前 rect 在 other rect 的右方
  onRight(other: Rect) {
    return this.right > other.right && this.left >= other.right;
  }

  // 当前 rect 在 other rect 的下方
  onBottom(other: Rect) {
    return this.bottom > other.bottom && this.top >= other.bottom;
  }

  // 垂直方向有重叠
  verticalOverlap(other: Rect) {
    return !(this.top > other.bottom || this.bottom < other.top);
  }

  // 水平方向有重叠
  horizontalOverlap(other: Rect) {
    return !(this.left > other.right || this.right < other.left);
  }
}
