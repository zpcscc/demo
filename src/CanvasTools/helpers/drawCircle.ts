import { Circle, type Canvas, type FabricObjectProps, type TOptions } from 'fabric';

/**
 * @name 画圆
 * @param canvas fabric的canvas对象
 * @param opt fabric的circle配置
 */
const drawCircle = (canvas: Canvas, opt?: TOptions<FabricObjectProps>) => {
  const defaultCircleOpt: TOptions<FabricObjectProps> = {
    top: 10,
    left: 100,
    radius: 40,
    fill: '#66ccff'
  };
  // 构建圆
  const circle = new Circle({ ...defaultCircleOpt, ...opt });
  // 将圆添加到画布中
  canvas.add(circle);
};

export default drawCircle;
