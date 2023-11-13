import { fabric } from 'fabric';

/**
 * @name 画矩形
 * @param canvas fabric的canvas对象
 * @param opt fabric的rect配置
 */
const drawRect = (canvas: fabric.Canvas, opt?: fabric.IRectOptions) => {
  const defaultRectOpt: fabric.IRectOptions = {
    top: 10,
    left: 10,
    width: 60,
    height: 60,
    fill: '#66ccff',
  };
  // 构建矩形
  const rect = new fabric.Rect({ ...defaultRectOpt, ...opt });
  // 将矩形添加到画布中
  canvas.add(rect);
};

export default drawRect;
