import { Group, Line, type Canvas, type FabricObjectProps, type TOptions } from 'fabric';

import type { Any } from 'src/type';

type OptType = TOptions<FabricObjectProps> & {
  theta?: number;
  headlen?: number;
};

/**
 * @name 画箭头
 * @param canvas fabric的canvas对象
 * @param opt fabric的line配置
 */
const drawArrow = (canvas: Canvas, path: Any, opt?: OptType) => {
  const { theta = 30, headlen = 30 } = opt || {};
  const startPath = path.path.toReversed().find((item: (string | number)[]) => item[0] === 'Q');
  const lastPath = path.path.at(-1);
  if (!startPath || !lastPath) return;
  const startPos = { x: startPath[3], y: startPath[4] };
  const endPos = { x: lastPath[1], y: lastPath[2] };
  const angle = (Math.atan2(startPos.y - endPos.y, startPos.x - endPos.x) * 180) / Math.PI;
  const angle1 = ((angle + theta) * Math.PI) / 180;
  const angle2 = ((angle - theta) * Math.PI) / 180;
  const topX = headlen * Math.cos(angle1);
  const topY = headlen * Math.sin(angle1);
  const botX = headlen * Math.cos(angle2);
  const botY = headlen * Math.sin(angle2);
  const line1Points: [number, number, number, number] = [
    endPos.x + topX,
    endPos.y + topY,
    endPos.x - 2,
    endPos.y - 2
  ];
  const line2Points: [number, number, number, number] = [
    endPos.x - 2,
    endPos.y - 2,
    endPos.x + botX,
    endPos.y + botY
  ];

  const lineOpt: TOptions<FabricObjectProps> = {
    stroke: '#66ccff',
    ...opt
  };
  // 构建矩形
  const line1 = new Line(line1Points, lineOpt);
  const line2 = new Line(line2Points, lineOpt);
  // 将箭头添加到画布中
  const arrowLine = new Group([path, line1, line2]);
  canvas.add(arrowLine);
  // 将已经添加到分组中的对象在画布上删除。避免和分组中的重复
  canvas.remove(path);
};

export default drawArrow;
