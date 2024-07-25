import { Line, type Canvas, type FabricObjectProps, type TOptions } from 'fabric';

/**
 * @name 画线
 * @param canvas fabric的canvas对象
 * @param opt fabric的line配置
 */
const drawLine = (
  canvas: Canvas,
  points?: [number, number, number, number],
  opt?: TOptions<FabricObjectProps>
) => {
  const defaultPoints: [number, number, number, number] = [
    450,
    10, // 起始点坐标
    500,
    100 // 结束点坐标
  ];
  const defaultLineOpt: TOptions<FabricObjectProps> = {
    stroke: '#66ccff'
  };
  // 构建线
  const line = new Line(points || defaultPoints, { ...defaultLineOpt, ...opt });
  // 将线添加到画布中
  canvas.add(line);
};

export default drawLine;
