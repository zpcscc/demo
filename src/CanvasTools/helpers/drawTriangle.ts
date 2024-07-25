import { Triangle, type Canvas, type FabricObjectProps, type TOptions } from 'fabric';

/**
 * @name 画三角形
 * @param canvas fabric的canvas对象
 * @param opt fabric的triangle配置
 */
const drawTriangle = (canvas: Canvas, opt?: TOptions<FabricObjectProps>) => {
  const defaultTriangleOpt: TOptions<FabricObjectProps> = {
    top: 10,
    left: 350,
    width: 60,
    height: 80,
    fill: '#66ccff'
  };
  // 构建三角形
  const triangle = new Triangle({ ...defaultTriangleOpt, ...opt });
  // 将三角形添加到画布中
  canvas.add(triangle);
};

export default drawTriangle;
