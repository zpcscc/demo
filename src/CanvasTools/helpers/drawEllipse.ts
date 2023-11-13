import { fabric } from 'fabric';

/**
 * @name 画椭圆
 * @param canvas fabric的canvas对象
 * @param opt fabric的ellipse配置
 */
const drawEllipse = (canvas: fabric.Canvas, opt?: fabric.IEllipseOptions) => {
  const defaultEllipseOpt: fabric.IEllipseOptions = {
    top: 10,
    left: 200,
    rx: 70,
    ry: 30,
    fill: '#66ccff',
  };
  // 构建椭圆
  const ellipse = new fabric.Ellipse({ ...defaultEllipseOpt, ...opt });
  // 将椭圆添加到画布中
  canvas.add(ellipse);
};

export default drawEllipse;
