export function getCircleCenterAndRadius(A, B, M) {
    // 工具函数：已知一段弧上的两点，已经这段弧中点的坐标，求出半径和圆心位置
    const [x1, y1] = A;
    const [x2, y2] = B;
    const [x3, y3] = M;
  
    const midAB = [(x1 + x2) / 2, (y1 + y2) / 2];
    const midAM = [(x1 + x3) / 2, (y1 + y3) / 2];

    // 斜率
    const kAB = (x2 - x1) === 0 ? null : (y2 - y1) / (x2 - x1);
    const kAM = (x3 - x1) === 0 ? null : (y3 - y1) / (x3 - x1);

    // 垂线斜率
    const perpAB = kAB === null ? 0 : (kAB === 0 ? null : -1 / kAB);
    const perpAM = kAM === null ? 0 : (kAM === 0 ? null : -1 / kAM);

    let cx, cy;
    if (perpAB === null) {
        // AB的中垂线是竖直线
        cx = midAB[0];
        cy = perpAM === null
            ? midAM[1]
            : perpAM * (cx - midAM[0]) + midAM[1];
    } else if (perpAM === null) {
        // AM的中垂线是竖直线
        cx = midAM[0];
        cy = perpAB * (cx - midAB[0]) + midAB[1];
    } else {
        // 一般情况
        cx = (perpAB * midAB[0] - perpAM * midAM[0] + midAM[1] - midAB[1]) / (perpAB - perpAM);
        cy = perpAB * (cx - midAB[0]) + midAB[1];
    }

    const r = Math.hypot(cx - x1, cy - y1);

    return { cx, cy, r };
}

export function getCentralAngle(A, B, O) {
  const [x1, y1] = A;
  const [x2, y2] = B;
  const [cx, cy] = O;

  // 向量
  const v1x = x1 - cx, v1y = y1 - cy;
  const v2x = x2 - cx, v2y = y2 - cy;

  // 点积
  const dot = v1x * v2x + v1y * v2y;
  // 模长
  const len1 = Math.hypot(v1x, v1y);
  const len2 = Math.hypot(v2x, v2y);

  // 夹角（弧度）
  let theta = Math.acos(dot / (len1 * len2));
  return theta; // 单位：弧度
}

export function rotatePointAroundCenter(x, y, cx, cy, angle) {
  // 平移到圆心为原点
  const dx = x - cx;
  const dy = y - cy;
  // 旋转
  const xRot = dx * Math.cos(angle) - dy * Math.sin(angle);
  const yRot = dx * Math.sin(angle) + dy * Math.cos(angle);
  // 平移回去
  return [xRot + cx, yRot + cy];
}