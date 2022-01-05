/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 00:04:42
 * @Description
 */

const currentKeys: string[] = [];
const listeners: ((e: VMouseEvent) => void)[] = [];

export interface VMouseEvent extends MouseEvent {
  currentKeys: string[];
}

function onKeyDown(e: KeyboardEvent) {
  currentKeys.push(e.type);
}

function onKeyUp(e: KeyboardEvent) {
  const key = e.type;
  const index = currentKeys.indexOf(key);
  if (index !== -1) {
    currentKeys.splice(index, 1);
  }
}

function onMouseMove(e: MouseEvent) {
  if (currentKeys.length !== 0) {
    listeners.forEach((listener) => {
      listener({ ...e, currentKeys });
    });
  }
}

function startListen() {
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("mousemove", onMouseMove);
}

function stopListen() {
  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("keyup", onKeyUp);
  document.removeEventListener("mousemove", onMouseMove);
}

export default class KeyDownMove {
  /**
   * 添加一个监听
   */
  static addListener(callback: (e: VMouseEvent) => void) {
    if (listeners.length === 0) {
      startListen();
    }
    listeners.push(callback);
  }

  /**
   * 移除监听
   */
  removeKeyDownMove(callback: (e: VMouseEvent) => void) {
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    if (listeners.length === 0) {
      stopListen();
    }
  }
}
