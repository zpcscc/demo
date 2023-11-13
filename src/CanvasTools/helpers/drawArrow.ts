import { fabric } from 'fabric';

interface OptType extends fabric.ILineOptions {
  theta?: number;
  headlen?: number;
}

/**
 * @name 画箭头
 * @param canvas fabric的canvas对象
 * @param opt fabric的line配置
 */
const drawArrow = (canvas: fabric.Canvas, path: any, opt?: OptType) => {
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
  const line1Points = [endPos.x + topX, endPos.y + topY, endPos.x - 2, endPos.y - 2];
  const line2Points = [endPos.x - 2, endPos.y - 2, endPos.x + botX, endPos.y + botY];

  const lineOpt: fabric.ILineOptions = {
    stroke: '#66ccff',
    ...opt,
  };
  // 构建矩形
  const line1 = new fabric.Line(line1Points, lineOpt);
  const line2 = new fabric.Line(line2Points, lineOpt);
  // 将箭头添加到画布中
  const arrowLine = new fabric.Group([path, line1, line2]);
  canvas.add(arrowLine);
  // 将已经添加到分组中的对象在画布上删除。避免和分组中的重复
  canvas.remove(path);
};

export default drawArrow;
