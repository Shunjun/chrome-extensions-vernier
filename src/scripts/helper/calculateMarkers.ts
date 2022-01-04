/*
 * @Author 舜君
 * @LastEditTime 2022-01-04 22:44:36
 * @Description
 * 计算标尺的并创建标尺对象
 */

import Marker from "../elements/Marker";
import Rect from "../Rect";

export default function calculateMarkers(rect1: Rect, rect2: Rect) {
  const markers: Marker[] = [];

  if (
    rect1.inside(rect2) ||
    rect1.containing(rect2) ||
    rect1.colliding(rect2)
  ) {
    // 垂直线的 X 坐标
    const verticalX =
      (Math.max(rect1.left, rect2.left) + Math.min(rect1.right, rect2.right)) /
      2;
    // 水平线的 Y 坐标
    const horizontalY =
      (Math.max(rect1.top, rect2.top) + Math.min(rect1.bottom, rect2.bottom)) /
      2;

    const top = new Marker("vertical", {
      length: Math.abs(rect1.top - rect2.top),
      top: Math.min(rect1.top, rect2.top),
      left: verticalX,
    });

    const bottom = new Marker("vertical", {
      length: Math.abs(rect1.bottom - rect2.bottom),
      top: Math.min(rect1.bottom, rect2.bottom),
      left: verticalX,
    });

    const left = new Marker("horizontal", {
      length: Math.abs(rect1.left - rect2.left),
      top: horizontalY,
      left: Math.min(rect1.left, rect2.left),
    });

    const right = new Marker("horizontal", {
      length: Math.abs(rect1.right - rect2.right),
      top: horizontalY,
      left: Math.min(rect1.right, rect2.right),
    });

    markers.push(top, bottom, left, right);
  } else {
    // outside
    // 水平部分
    if (rect1.horizontalOverlap(rect2)) {
      // 相交,标记左右连部分距离

      // 距离左边近的块
      const fartherRect = rect1.left > rect2.left ? rect1 : rect2;
      const closerRect = rect1.left > rect2.left ? rect2 : rect1;

      // 是否近的块在上面
      const closerOver = closerRect.bottom < fartherRect.top;

      const top2top = Math.abs(closerRect.top - fartherRect.top);
      const bottom2bottom = Math.abs(closerRect.bottom - fartherRect.bottom);

      const left = new Marker("horizontal", {
        length: Math.abs(rect1.left - rect2.left),
        top: fartherRect.top + fartherRect.height / 2,
        left: closerRect.left,
      });
      // 绘制左侧延长线
      const extensionLineLeft = new Marker("vertical", {
        length: closerOver ? bottom2bottom : top2top,
        top: closerOver ? closerRect.bottom : fartherRect.top,
        left: closerRect.left,
      });

      const right = new Marker("horizontal", {
        length: Math.abs(rect1.right - rect2.right),
        top: closerRect.top + closerRect.height / 2,
        left: closerRect.right,
      });
      // 绘制右侧延长线
      const extensionLineRight = new Marker("vertical", {
        length: closerOver ? top2top : bottom2bottom,
        top: closerOver ? closerRect.top : fartherRect.bottom,
        left: closerRect.left,
      });

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
      });

      markers.push(apart);
    }

    // 垂直部分
    if (rect1.verticalOverlap(rect2)) {
      // 相交,标记顶部到顶部,底部到底部的距离

      // 距离顶部更近
      const closerRect = rect1.top < rect2.top ? rect1 : rect2;
      const fartherRect = rect1.top < rect2.top ? rect2 : rect1;

      // 距离近的在左边
      const closerLefter = closerRect.left < fartherRect.left;

      const left2left = Math.abs(closerRect.left - fartherRect.left);
      const right2right = Math.abs(closerRect.right - fartherRect.right);

      const top = new Marker("vertical", {
        length: Math.abs(rect1.top - rect2.top),
        top: closerRect.top,
        left: fartherRect.left + fartherRect.width / 2,
      });
      // 绘制上部延长线
      const extensionLineTop = new Marker("horizontal", {
        length: closerLefter ? right2right : left2left,
        top: closerRect.top,
        left: closerLefter ? closerRect.right : fartherRect.left,
      });

      const bottom = new Marker("vertical", {
        length: Math.abs(rect1.right - rect2.right),
        top: closerRect.bottom,
        left: closerRect.left + closerRect.width / 2,
      });
      // 绘制下部延长线
      const extensionLineBottom = new Marker("horizontal", {
        length: closerLefter ? left2left : right2right,
        top: fartherRect.bottom,
        left: closerLefter ? closerRect.left : fartherRect.right,
      });

      markers.push(top, bottom, extensionLineTop, extensionLineBottom);
    } else {
      // 不想交,标记两个矩形之间的距离
      const apart = new Marker("vertical", {
        length: Math.min(
          Math.abs(rect1.left - rect2.right),
          Math.abs(rect2.left - rect1.right)
        ),
        top:
          (Math.max(rect1.top, rect2.top) +
            Math.min(rect1.bottom, rect2.bottom)) /
          2,
        left: Math.min(rect1.right, rect2.right),
      });

      markers.push(apart);
    }
  }

  return markers;
}
