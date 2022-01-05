/*
 * @Author 舜君
 * @LastEditTime 2022-01-05 15:29:44
 * @Description
 * 计算标尺的并创建标尺对象
 */

import Marker from "../elements/Marker";
import Rect from "../core/Rect";

/**
 * 计算并创建标尺
 * @param rect1
 * @param rect2
 * @returns
 */
export default function calculateMarkers(rect1: Rect, rect2: Rect) {
  const markers: Marker[] = [];

  if (
    rect1.inside(rect2) ||
    rect1.containing(rect2) ||
    rect1.colliding(rect2)
  ) {
    markers.push(...inside(rect1, rect2));
  } else {
    // outside
    markers.push(...outside(rect1, rect2));
  }

  return markers;
}

function inside(rect1: Rect, rect2: Rect) {
  // 垂直线的 X 坐标
  const verticalX =
    (Math.max(rect1.left, rect2.left) + Math.min(rect1.right, rect2.right)) / 2;
  // 水平线的 Y 坐标
  const horizontalY =
    (Math.max(rect1.top, rect2.top) + Math.min(rect1.bottom, rect2.bottom)) / 2;

  const top = new Marker("vertical", {
    length: Math.abs(rect1.top - rect2.top),
    top: Math.min(rect1.top, rect2.top),
    left: verticalX,
  }).showSize(true);

  const bottom = new Marker("vertical", {
    length: Math.abs(rect1.bottom - rect2.bottom),
    top: Math.min(rect1.bottom, rect2.bottom),
    left: verticalX,
  }).showSize(true);

  const left = new Marker("horizontal", {
    length: Math.abs(rect1.left - rect2.left),
    top: horizontalY,
    left: Math.min(rect1.left, rect2.left),
  }).showSize(true);

  const right = new Marker("horizontal", {
    length: Math.abs(rect1.right - rect2.right),
    top: horizontalY,
    left: Math.min(rect1.right, rect2.right),
  }).showSize(true);

  return [top, bottom, left, right];
}

function outside(rect1: Rect, rect2: Rect) {
  const markers: Marker[] = [];
  // 水平部分
  if (rect1.horizontalOverlap(rect2)) {
    // 相交,标记左右连部分距离

    const [, leftFarther] = sortCloserRect("left", rect1, rect2);
    const left = new Marker("horizontal", {
      length: Math.abs(rect1.left - rect2.left),
      top: leftFarther.top + leftFarther.height / 2,
      left: Math.min(rect1.left, rect2.left),
    }).showSize(true);
    const extensionLineLeft = createExtensionLine(rect1, rect2, "left");

    const [, rightFarther] = sortCloserRect("right", rect1, rect2);
    const right = new Marker("horizontal", {
      length: Math.abs(rect1.right - rect2.right),
      top: rightFarther.top + rightFarther.height / 2,
      left: Math.min(rect1.right, rect2.right),
    }).showSize(true);
    const extensionLineRight = createExtensionLine(rect1, rect2, "right");

    markers.push(left, right, extensionLineLeft, extensionLineRight);
  } else {
    // 不想交,标记两个矩形之间的距离
    const apart = new Marker("horizontal", {
      length: Math.min(
        Math.abs(rect1.left - rect2.right),
        Math.abs(rect2.left - rect1.right)
      ),
      top:
        (Math.max(rect1.top, rect2.top) +
          Math.min(rect1.bottom, rect2.bottom)) /
        2,
      left: Math.min(rect1.right, rect2.right),
    }).showSize(true);

    markers.push(apart);
  }

  // 垂直部分
  if (rect1.verticalOverlap(rect2)) {
    // 相交,标记顶部到顶部,底部到底部的距离

    const [, topFarther] = sortCloserRect("top", rect1, rect2);
    const top = new Marker("vertical", {
      length: Math.abs(rect1.top - rect2.top),
      top: Math.min(rect1.top, rect2.top),
      left: topFarther.left + topFarther.width / 2,
    }).showSize(true);
    // 绘制上部延长线
    const extensionLineTop = createExtensionLine(rect1, rect2, "top");

    const [, bottomFarther] = sortCloserRect("top", rect1, rect2);
    const bottom = new Marker("vertical", {
      length: Math.abs(rect1.bottom - rect2.bottom),
      top: Math.min(rect1.bottom, rect2.bottom),
      left: bottomFarther.left + bottomFarther.width / 2,
    }).showSize(true);
    // 绘制下部延长线
    const extensionLineBottom = createExtensionLine(rect1, rect2, "bottom");

    markers.push(top, bottom, extensionLineTop, extensionLineBottom);
  } else {
    // 不想交,标记两个矩形之间的距离
    const apart = new Marker("vertical", {
      length: Math.min(
        Math.abs(rect1.top - rect2.bottom),
        Math.abs(rect2.top - rect1.bottom)
      ),
      top: Math.min(rect1.bottom, rect2.bottom),
      left:
        (Math.max(rect1.left, rect2.left) +
          Math.min(rect1.right, rect2.right)) /
        2,
    }).showSize(true);

    markers.push(apart);
  }

  return markers;
}

/**
 * 生成延长线
 * @param rect1
 * @param rect2
 * @param position
 */
function createExtensionLine(
  rect1: Rect,
  rect2: Rect,
  direction: "top" | "bottom" | "left" | "right"
): Marker {
  const [closer, farther] = sortCloserRect(direction, rect1, rect2);

  const isEqual = rect1[direction] === rect2[direction];

  if (isEqual) {
    if (direction === "left" || direction === "right") {
      const length = Math.min(
        Math.abs(rect1.top - rect2.bottom),
        Math.abs(rect2.top - rect1.bottom)
      );
      return new Marker(
        "vertical",
        {
          length,
          top: Math.min(rect1.bottom, rect2.bottom),
          left: rect1[direction],
        },
        "dashed"
      );
    } else {
      const length = Math.min(
        Math.abs(rect1.left - rect2.right),
        Math.abs(rect2.left - rect1.right)
      );
      return new Marker(
        "horizontal",
        {
          length,
          top: rect1[direction],
          left: Math.min(rect1.right, rect2.right),
        },
        "dashed"
      );
    }
  } else {
    const top2top = Math.abs(rect1.top - rect2.top);
    const bottom2bottom = Math.abs(rect1.bottom - rect2.bottom);
    const left2left = Math.abs(rect1.left - rect2.left);
    const right2right = Math.abs(rect1.right - rect2.right);

    if (direction === "left") {
      return new Marker(
        "vertical",
        {
          length: closer.onTop(farther) ? bottom2bottom : top2top,
          left: closer.left,
          top: closer.onTop(farther) ? closer.bottom : closer.top - top2top,
        },
        "dashed"
      );
    } else if (direction === "right") {
      return new Marker(
        "vertical",
        {
          length: closer.onTop(farther) ? bottom2bottom : top2top,
          left: closer.right,
          top: closer.onTop(farther) ? closer.bottom : closer.top - top2top,
        },
        "dashed"
      );
    } else if (direction === "top") {
      return new Marker(
        "horizontal",
        {
          length: closer.onLeft(farther) ? right2right : left2left,
          top: closer.top,
          left: closer.onLeft(farther) ? closer.right : closer.left - left2left,
        },
        "dashed"
      );
    } else {
      return new Marker(
        "horizontal",
        {
          length: closer.onLeft(farther) ? right2right : left2left,
          top: closer.bottom,
          left: closer.onLeft(farther) ? closer.right : closer.left - left2left,
        },
        "dashed"
      );
    }
  }
}

/**
 * 按距离边界更近的顺序排序
 * @param rect1
 * @param rect2
 * @param position
 */
function sortCloserRect(
  direction: "top" | "bottom" | "left" | "right",
  ...rects: Rect[]
) {
  return rects.sort((rect1, rect2) => {
    if (direction === "top" || direction === "left") {
      return rect1[direction] - rect2[direction];
    } else {
      return rect2[direction] - rect1[direction];
    }
  });
}
